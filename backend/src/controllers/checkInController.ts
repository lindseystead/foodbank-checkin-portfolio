/**
 * @fileoverview Check-in controller for Foodbank Check-In and Appointment System backend API
 * 
 * This module handles all check-in related operations including client check-ins,
 * appointment management, and status updates. It provides methods for processing
 * check-in data, updating client information, and managing appointment scheduling.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../stores/unifiedStore.ts} Data store for check-in operations
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../types/index';
import { logger } from '../utils/logger';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const VANCOUVER_TZ = 'America/Vancouver';
import { 
  addCheckIn, 
  updateCheckIn, 
  getCheckInById, 
  getAllCheckIns, 
  getCheckInStats,
  getTodayAppointments,
  getTodayAnalytics,
  incrementCompletedCheckIns,
  purgeExpired,
  getDataVersion
} from '../stores/unifiedStore';
import { createNextAppointment } from '../utils/appointmentScheduler';

export class CheckInController {
  /**
   * Handle client check-in
   * POST /api/checkin
   */
  static async handleCheckIn(req: Request, res: Response): Promise<void> {
    try {
      const { phoneNumber, lastName } = req.body;

      if (!phoneNumber || !lastName) {
        const response: ApiResponse = {
          success: false,
          error: 'Phone number and last name are required'
        };
        res.status(400).json(response);
        return;
      }

      // Purge expired entries first - keeps memory clean
      purgeExpired();

      // Normalize search criteria - strip whitespace and non-digit chars for consistent matching
      const searchLastName = lastName.toLowerCase().trim();
      const searchPhone = phoneNumber.replace(/\D/g, '');

      // Find matching CSV record (which contains all client data)
      const csvRecords = getTodayAppointments();
      
      logger.info('Client check-in attempt', { 
        searchPhone, 
        searchLastName, 
        totalRecords: csvRecords.length 
      });

      // Look for matching CSV record(s) directly
      // Match Pending OR Not Collected (allows late check-ins) - important for flexibility
      // IMPORTANT: Handle multiple appointments for the same client
      const matchingRecords = csvRecords.filter((record: any) => 
        record.phoneNumber.replace(/\D/g, '') === searchPhone &&
        record.lastName?.toLowerCase().trim() === searchLastName &&
        (record.status === 'Pending' || record.status === 'Not Collected') // Allow checking in even if marked as missed
      );

      if (matchingRecords.length === 0) {
        logger.info('Appointment not found for client', { 
          phoneNumber, 
          lastName, 
          searchPhone, 
          searchLastName
        });
        const response: ApiResponse = {
          success: false,
          error: 'Appointment not found. Please call (250) 763-7161 or wait for a volunteer.'
        };
        res.status(404).json(response);
        return;
      }

      // If multiple appointments found, select the most appropriate one
      // Priority: 1) Today's appointment closest to current time (not passed), 2) Earliest today's appointment, 3) First match
      let csvRecord = matchingRecords[0];
      
      if (matchingRecords.length > 1) {
        const now = dayjs().tz(VANCOUVER_TZ);
        
        // Filter to today's appointments only
        const todayRecords = matchingRecords.filter((record: any) => {
          if (!record.pickUpISO && !record.appointmentTime) return false;
          const apptTime = dayjs(record.pickUpISO || record.appointmentTime).tz(VANCOUVER_TZ);
          return apptTime.isSame(now, 'day');
        });
        
        if (todayRecords.length > 0) {
          // Prefer appointment closest to current time (but not passed by more than 30 minutes)
          const validRecords = todayRecords.filter((record: any) => {
            if (!record.pickUpISO && !record.appointmentTime) return false;
            const apptTime = dayjs(record.pickUpISO || record.appointmentTime).tz(VANCOUVER_TZ);
            const minutesDiff = now.diff(apptTime, 'minute');
            return minutesDiff <= 30; // Within 30 minutes (allows late check-ins)
          });
          
          if (validRecords.length > 0) {
            // Sort by appointment time (closest to now, but not passed)
            validRecords.sort((a: any, b: any) => {
              const timeA = dayjs(a.pickUpISO || a.appointmentTime).tz(VANCOUVER_TZ);
              const timeB = dayjs(b.pickUpISO || b.appointmentTime).tz(VANCOUVER_TZ);
              const diffA = Math.abs(now.diff(timeA, 'minute'));
              const diffB = Math.abs(now.diff(timeB, 'minute'));
              return diffA - diffB; // Closest to current time
            });
            csvRecord = validRecords[0];
          } else {
            // No valid appointments today, use earliest today's appointment
            todayRecords.sort((a: any, b: any) => {
              const timeA = dayjs(a.pickUpISO || a.appointmentTime).tz(VANCOUVER_TZ);
              const timeB = dayjs(b.pickUpISO || b.appointmentTime).tz(VANCOUVER_TZ);
              return timeA.valueOf() - timeB.valueOf();
            });
            csvRecord = todayRecords[0];
          }
        } else {
          // No today's appointments, use first match (fallback)
          logger.warn('Multiple appointments found but none for today', {
            clientId: matchingRecords[0].clientId,
            phoneNumber: searchPhone,
            lastName: searchLastName,
            appointmentCount: matchingRecords.length
          });
          csvRecord = matchingRecords[0];
        }
      }

      // Check if already checked in or completed
      if (csvRecord.status === 'Collected' || csvRecord.status === 'Shipped') {
        logger.info('Client already checked in', { 
          clientId: csvRecord.clientId,
          status: csvRecord.status
        });
        
        const response: ApiResponse = {
          success: false,
          error: 'You have already checked in for this appointment. Please wait for a volunteer to assist you.'
        };
        res.status(400).json(response);
        return;
      }

      // Check appointment time window (30 minutes before to 30 minutes after)
      // 30 minutes is the cutoff - food bank policy for keeping schedule on track
      const now = dayjs().tz(VANCOUVER_TZ);
      const appointmentTimeISO = csvRecord.appointmentTime || csvRecord.pickUpISO;
      
      if (appointmentTimeISO) {
        const appointmentTime = dayjs(appointmentTimeISO).tz(VANCOUVER_TZ);
        const minutesDiff = now.diff(appointmentTime, 'minute'); // Positive = late, Negative = early
        
        // Check if too early (more than 30 minutes before appointment)
        if (minutesDiff < -30) {
          logger.info('Client check-in rejected - too early', { 
            clientId: csvRecord.clientId,
            appointmentTime: appointmentTimeISO,
            currentTime: now.format(),
            minutesEarly: Math.abs(minutesDiff),
            appointmentTimeFormatted: appointmentTime.format('h:mm A')
          });
          
          const response: ApiResponse = {
            success: false,
            error: `Your appointment is at ${appointmentTime.format('h:mm A')}. Please check in no more than 30 minutes before your appointment time.`
          };
          res.status(400).json(response);
          return;
        }
        
        // Check if too late (more than 30 minutes after appointment)
        if (minutesDiff > 30) {
          logger.info('Client check-in rejected - more than 30 minutes late', { 
            clientId: csvRecord.clientId,
            appointmentTime: appointmentTimeISO,
            currentTime: now.format(),
            minutesLate: minutesDiff
          });
          
          const response: ApiResponse = {
            success: false,
            error: `You are more than 30 minutes late for your appointment. Please call (250) 763-7161 to see if we can still help you.`
          };
          res.status(400).json(response);
          return;
        }
      }

      // Update the existing CSV record to add check-in time (keep Pending status)
      // Status stays Pending here - admin marks as Collected when they pick up food
      // IMPORTANT: Preserve pickUpTime and pickUpDate from CSV file (these are the actual appointment times)
      const updatedRecord = updateCheckIn(csvRecord.id, {
        status: 'Pending', // Keep as Pending until admin completes
        checkInTime: new Date().toISOString(),
        phoneNumber: phoneNumber, // Update with the phone number they used to check in
        // Preserve CSV pickup time and date (these come from the admin CSV upload)
        pickUpTime: csvRecord.pickUpTime, // HH:MM format from CSV (e.g., "09:00", "14:30")
        pickUpDate: csvRecord.pickUpDate, // YYYY-MM-DD format from CSV
        pickUpISO: csvRecord.pickUpISO // ISO timestamp from CSV
      });

      if (!updatedRecord) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to update appointment record'
        };
        res.status(500).json(response);
        return;
      }

      /**
       * Auto-generate next appointment (21+ days from today)
       * 
       * IMPORTANT: This next appointment will ALWAYS appear on printed tickets.
       * When a client checks in properly, the system automatically generates
       * their next appointment following food bank policy (21+ days from today,
       * preserving weekday if applicable, e.g., Saturday appointments).
       * 
       * The auto-generated appointment data is stored in the check-in record:
       * - nextAppointmentDate: Date string (YYYY-MM-DD)
       * - nextAppointmentTime: Time string (HH:MM)
       * - nextAppointmentISO: ISO timestamp (timezone-aware)
       * - ticketNumber: Unique ticket number for the next appointment
       * - isAutoGenerated: true (marks it as auto-generated)
       * 
       * This data is then retrieved by the ticket generation route
       * (GET /api/tickets/:checkInId) and displayed on printed tickets.
       * 
       * Best Practice: This runs in the background - if it fails, check-in
       * still succeeds (non-critical error handling).
       */
      let finalRecord = updatedRecord; // Use this to ensure we have the latest data
      try {
        const nextAppointment = createNextAppointment(updatedRecord.clientId, updatedRecord, updatedRecord);
        
        // Store auto-generated appointment in check-in record
        // IMPORTANT: Use the return value to get the updated record with appointment data
        // This ensures the response includes the newly generated appointment
        const recordWithAppointment = updateCheckIn(updatedRecord.id, {
          nextAppointmentDate: nextAppointment.pickUpDate,
          nextAppointmentTime: nextAppointment.pickUpTime,
          nextAppointmentISO: nextAppointment.pickUpISO,
          ticketNumber: nextAppointment.ticketNumber,
          isAutoGenerated: true,
          generatedFrom: updatedRecord.id,
          generatedAt: new Date().toISOString()
        });
        
        // Use the updated record that includes the appointment data
        if (recordWithAppointment) {
          finalRecord = recordWithAppointment;
        }
        
        logger.info('Next appointment generated and stored for ticket printing', { 
          clientId: updatedRecord.clientId, 
          nextDate: nextAppointment.pickUpDate,
          nextTime: nextAppointment.pickUpTime,
          ticketNumber: nextAppointment.ticketNumber
        });
      } catch (error) {
        // Non-critical - appointment gen failing shouldn't block check-in
        // However, ticket will show "No next appointment scheduled" if this fails
        logger.error('Failed to generate next appointment', { 
          clientId: updatedRecord.clientId, 
          error 
        });
      }

      // Debug: Log what appointment time we're returning
      const appointmentTime = finalRecord.appointmentTime || finalRecord.pickUpISO;
      logger.info('Returning appointment time for client', {
        clientId: finalRecord.clientId,
        clientName: finalRecord.clientName,
        appointmentTime: appointmentTime,
        pickUpISO: finalRecord.pickUpISO,
        pickUpTime: finalRecord.pickUpTime,
        appointmentTimeField: finalRecord.appointmentTime,
        nextAppointmentDate: finalRecord.nextAppointmentDate,
        nextAppointmentTime: finalRecord.nextAppointmentTime
      });

      // Success response
      // IMPORTANT: Include next appointment data in response so client pages can display it immediately
      // This ensures the auto-generated appointment is available right away
      // Use finalRecord which includes the newly generated appointment data
      const response: ApiResponse = {
        success: true,
        message: 'Check-in successful',
        data: {
          checkInId: finalRecord.id,
          clientId: finalRecord.clientId,
          clientName: finalRecord.clientName,
          // Use appointmentTime or pickUpISO from finalRecord (this is the actual pickup time from CSV)
          appointmentTime: appointmentTime,
          // IMPORTANT: Also include pickUpTime (HH:MM format) for reliable time display
          // This avoids timezone conversion issues when parsing ISO strings
          pickUpTime: finalRecord.pickUpTime,
          pickUpDate: finalRecord.pickUpDate,
          phoneNumber: finalRecord.phoneNumber,
          // Include auto-generated next appointment data (available immediately after check-in)
          // Use finalRecord which includes the appointment data from updateCheckIn
          nextAppointmentDate: finalRecord.nextAppointmentDate,
          nextAppointmentTime: finalRecord.nextAppointmentTime,
          nextAppointmentISO: finalRecord.nextAppointmentISO,
          ticketNumber: finalRecord.ticketNumber,
          isAutoGenerated: finalRecord.isAutoGenerated,
          // Include pickup details for frontend
          appointment: {
            householdSize: finalRecord.householdSize,
            provisions: finalRecord.provisions,
            location: finalRecord.location || 'Food Bank Location',
            status: finalRecord.status
          },
          // Include client details for frontend
          client: {
            dietary: finalRecord.dietaryConsiderations,
            firstName: finalRecord.firstName,
            lastName: finalRecord.lastName,
            adults: finalRecord.adults,
            seniors: finalRecord.seniors,
            children: finalRecord.children,
            childrenAges: finalRecord.childrensAges,
            itemsProvided: finalRecord.itemsProvided,
            email: finalRecord.email
          }
        }
      };

      res.json(response);
      logger.info('Check-in successful', { 
        checkInId: finalRecord.id, 
        clientId: finalRecord.clientId, 
        clientName: finalRecord.clientName,
        hasNextAppointment: !!finalRecord.nextAppointmentDate
      });

    } catch (error) {
      logger.error('Check-in error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Check-in failed. Please try again or contact staff.'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Complete check-in process with full data
   * POST /api/checkin/complete
   */
  static async completeCheckInProcess(req: Request, res: Response): Promise<void> {
    try {
      const {
        checkInId,
        clientId,
        clientName,
        phoneNumber,
        checkInTime,
        appointmentTime,
        completionTime,
        dietaryRestrictions,
        allergies,
        unwantedFoods,
        additionalInfo,
        householdInfoChanged,
        hasMobilityIssues,
        diaperSize,
        notificationPreference,
        email,
        phone,
        phoneCarrier,
        location,
        clientType
      } = req.body;

      if (!checkInId || !clientId) {
        const response: ApiResponse = {
          success: false,
          error: 'Check-in ID and Client ID are required'
        };
        res.status(400).json(response);
        return;
      }

      // Find existing appointment by clientId (from CSV data)
      const appointments = getTodayAppointments();
      let appointment = appointments.find(apt => apt.clientId === clientId);
      
      if (!appointment) {
        // If no appointment found, create a new check-in record
        const checkIn = addCheckIn({
          clientId,
          clientName: clientName || 'Unknown Client',
          phoneNumber: phoneNumber || '',
          checkInTime: checkInTime || new Date().toISOString(),
          appointmentTime,
          source: 'manual',
          status: 'Collected'
        });
        
        const response: ApiResponse = {
          success: true,
          message: 'Check-in completed successfully',
          data: {
            checkInId: checkIn.id,
            status: checkIn.status,
            updatedAt: checkIn.updatedAt
          }
        };
        res.json(response);
        return;
      }
      
      // Update the existing appointment record with completion data
      const updatedAppointment = updateCheckIn(appointment.id, {
        status: 'Collected',
        checkInTime: checkInTime || new Date().toISOString(),
        completionTime: completionTime || new Date().toISOString(),
        dietaryRestrictions,
        allergies,
        unwantedFoods,
        additionalInfo,
        householdInfoChanged,
        hasMobilityIssues,
        diaperSize,
        notificationPreference,
        email,
        phone,
        phoneCarrier,
        location,
        clientType
      });
      
      if (!updatedAppointment) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to update appointment'
        };
        res.status(500).json(response);
        return;
      }

      // Increment analytics counter for completed check-ins
      incrementCompletedCheckIns();

      const response: ApiResponse = {
        success: true,
        message: 'Check-in process completed successfully',
        data: {
          checkInId: updatedAppointment.id,
          clientId,
          clientName: updatedAppointment.clientName,
          status: 'Complete',
          completionTime: updatedAppointment.completionTime,
          // Include next appointment data (may have been auto-generated or updated by admin)
          nextAppointmentDate: updatedAppointment.nextAppointmentDate,
          nextAppointmentTime: updatedAppointment.nextAppointmentTime,
          nextAppointmentISO: updatedAppointment.nextAppointmentISO,
          ticketNumber: updatedAppointment.ticketNumber,
          isAutoGenerated: updatedAppointment.isAutoGenerated
        }
      };

      res.json(response);
      logger.info('Check-in completed', { 
        checkInId: updatedAppointment.id, 
        clientId, 
        clientName: updatedAppointment.clientName 
      });

    } catch (error) {
      logger.error('Complete check-in process error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to complete check-in process'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get all check-ins
   * GET /api/checkin
   */
  static async getCheckIns(req: Request, res: Response): Promise<void> {
    try {
      const checkIns = getAllCheckIns();
      
      const response: ApiResponse = {
        success: true,
        data: checkIns,
        dataVersion: getDataVersion()
      };
      res.json(response);
    } catch (error) {
      logger.error('Get check-ins error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve check-ins'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Client reschedule appointment
   * PUT /api/checkin/:checkInId/reschedule
   * 
   * Simple client rescheduling - allows clients to select a new appointment date/time
   * during the check-in process. Updates the next appointment in the check-in record.
   */
  static async rescheduleAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { checkInId } = req.params;
      const { newDate, newTime } = req.body as { newDate?: string; newTime?: string };
      
      // Validate required fields
      if (!newDate) {
        const response: ApiResponse = {
          success: false,
          error: 'New date is required'
        };
        res.status(400).json(response);
        return;
      }
      
      // Get the check-in record
      const currentCheckIn = getCheckInById(checkInId);
      
      if (!currentCheckIn) {
        const response: ApiResponse = {
          success: false,
          error: 'Check-in not found'
        };
        res.status(404).json(response);
        return;
      }
      
      // Validate date is at least 21 days from today (food bank policy)
      const today = dayjs().tz(VANCOUVER_TZ);
      const selectedDate = dayjs.tz(newDate, VANCOUVER_TZ);
      const daysDifference = selectedDate.diff(today, 'day');
      
      if (daysDifference < 21) {
        const response: ApiResponse = {
          success: false,
          error: 'Appointment must be at least 21 days from today'
        };
        res.status(400).json(response);
        return;
      }
      
      // Validate time is in valid time slots
      const time = typeof newTime === 'string' && /^\d{2}:\d{2}$/.test(newTime) ? newTime : '10:00';
      const VALID_TIMES = [
        '09:00', '09:15', '09:30', '09:45',
        '10:00', '10:15', '10:30', '10:45',
        '11:00', '11:15',
        '12:00', '12:15', '12:30', '12:45',
        '13:00', '13:15', '13:30', '13:45',
        '14:00', '14:15', '14:30', '14:45'
      ];
      
      if (!VALID_TIMES.includes(time)) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid time slot. Please select a valid appointment time.'
        };
        res.status(400).json(response);
        return;
      }
      
      // Check if date is a valid weekday (Monday-Friday)
      const weekday = selectedDate.day(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      if (weekday === 0 || weekday === 6) {
        const response: ApiResponse = {
          success: false,
          error: 'Appointments are only available Monday through Friday'
        };
        res.status(400).json(response);
        return;
      }
      
      // Build ISO string with Vancouver timezone
      const isoString = dayjs.tz(`${newDate}T${time}:00`, VANCOUVER_TZ).toISOString();
      
      // Update the check-in record with new appointment
      const updatedCheckIn = updateCheckIn(checkInId, {
        nextAppointmentDate: newDate,
        nextAppointmentTime: time,
        nextAppointmentISO: isoString,
        isAutoGenerated: false, // Mark as manually rescheduled
        updatedAt: new Date().toISOString()
      });
      
      if (!updatedCheckIn) {
        const response: ApiResponse = {
          success: false,
          error: 'Failed to update appointment'
        };
        res.status(500).json(response);
        return;
      }
      
      logger.info('Client rescheduled appointment', { 
        checkInId, 
        newDate, 
        newTime: time 
      });
      
      const response: ApiResponse = {
        success: true,
        message: 'Appointment rescheduled successfully',
        data: {
          checkInId: updatedCheckIn.id,
          nextAppointmentDate: updatedCheckIn.nextAppointmentDate,
          nextAppointmentTime: updatedCheckIn.nextAppointmentTime,
          nextAppointmentISO: updatedCheckIn.nextAppointmentISO
        }
      };
      
      res.json(response);
    } catch (error: any) {
      logger.error('Reschedule appointment error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to reschedule appointment',
        message: error.message
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get check-in by ID
   * GET /api/checkin/:id
   */
  static async getCheckInById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const checkIn = getCheckInById(id);

      if (!checkIn) {
        const response: ApiResponse = {
          success: false,
          error: 'Check-in not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: checkIn
      };
      res.json(response);
    } catch (error) {
      logger.error('Get check-in by ID error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve check-in'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get check-in statistics
   * GET /api/checkin/stats
   */
  static async getCheckInStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = getCheckInStats();

      const response: ApiResponse = {
        success: true,
        data: stats
      };
      res.json(response);
    } catch (error) {
      logger.error('Get check-in stats error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve check-in statistics'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Admin: Create manual check-in
   * POST /api/checkin/admin
   */
  static async createManualCheckIn(req: Request, res: Response): Promise<void> {
    try {
      const {
        clientId,
        clientName,
        phoneNumber,
        appointmentTime,
        notes
      } = req.body;

      if (!clientId || !clientName || !phoneNumber) {
        const response: ApiResponse = {
          success: false,
          error: 'Client ID, name, and phone number are required'
        };
        res.status(400).json(response);
        return;
      }

      // Create manual check-in
      const checkIn = addCheckIn({
        clientId,
        clientName,
        phoneNumber,
        checkInTime: new Date().toISOString(),
        appointmentTime,
        source: 'manual',
        status: 'Collected',
        notes: notes || '',
        location: 'Foodbank Check-In and Appointment System'
      });

      const response: ApiResponse = {
        success: true,
        message: 'Manual check-in created successfully',
        data: {
          checkInId: checkIn.id,
          clientId: checkIn.clientId,
          clientName: checkIn.clientName,
          checkInTime: checkIn.checkInTime,
          status: checkIn.status
        }
      };

      res.json(response);
      logger.info('Manual check-in created', { 
        checkInId: checkIn.id, 
        clientId: checkIn.clientId, 
        clientName: checkIn.clientName 
      });

    } catch (error) {
      logger.error('Create manual check-in error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create manual check-in'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Admin: Update check-in status
   * PUT /api/checkin/:id/status
   */
  static async updateCheckInStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!status || !['Pending', 'Shipped', 'Collected', 'Not Collected', 'Rescheduled', 'Cancelled'].includes(status)) {
        const response: ApiResponse = {
          success: false,
          error: 'Valid status is required (Pending, Shipped, Collected, Not Collected, Rescheduled, or Cancelled)'
        };
        res.status(400).json(response);
        return;
      }

      const updateData: any = { status };
      if (notes) updateData.notes = notes;
      if (status === 'Collected') {
        updateData.completionTime = new Date().toISOString();
      }

      const updatedCheckIn = updateCheckIn(id, updateData);

      if (!updatedCheckIn) {
        const response: ApiResponse = {
          success: false,
          error: 'Check-in not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Check-in status updated successfully',
        data: {
          checkInId: updatedCheckIn.id,
          status: updatedCheckIn.status,
          updatedAt: updatedCheckIn.updatedAt
        }
      };

      res.json(response);
      logger.info('Check-in status updated', { 
        checkInId: updatedCheckIn.id, 
        status: updatedCheckIn.status 
      });

    } catch (error) {
      logger.error('Update check-in status error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update check-in status'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Admin: Get all appointments (from CSV data) - FILTERED BY LOCATION
   * GET /api/checkin/appointments?location={location-id}
   */
  static async getAppointments(req: Request, res: Response): Promise<void> {
    try {
      const location = req.query.location as string;
      
      // Get ALL CSV appointments regardless of date - let frontend handle filtering
      const allCheckIns = getAllCheckIns();
      let appointments = allCheckIns.filter(record => record.source === 'csv');
      
      // Filter by location if provided
      if (location) {
        appointments = appointments.filter(record => record.location === location);
      }
      
      const response: ApiResponse = {
        success: true,
        data: appointments
      };
      res.json(response);
    } catch (error) {
      logger.error('Get appointments error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve appointments'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Admin: Get simple analytics counters
   * GET /api/checkin/analytics
   */
  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const analytics = getTodayAnalytics();
      
      const response: ApiResponse = {
        success: true,
        data: analytics
      };
      res.json(response);
    } catch (error) {
      logger.error('Get analytics error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve analytics'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get system performance metrics
   * GET /api/checkin/metrics
   */
  static async getPerformanceMetrics(req: Request, res: Response): Promise<void> {
    try {
      const stats = getCheckInStats();
      const analytics = getTodayAnalytics();
      const allCheckIns = getAllCheckIns();
      
      // Calculate actual check-in times
      const checkInTimes = allCheckIns
        .filter(c => c.checkInTime && c.completionTime)
        .map(c => {
          const checkIn = new Date(c.checkInTime).getTime();
          const completed = new Date(c.completionTime!).getTime();
          return (completed - checkIn) / 1000 / 60; // minutes
        });

      const avgCheckInTime = checkInTimes.length > 0 
        ? Math.round(checkInTimes.reduce((sum, t) => sum + t, 0) / checkInTimes.length)
        : 0;

      // Calculate by location
      const locations = new Set(allCheckIns.map(c => c.location));
      const locationCounts = Array.from(locations).map(location => ({
        location,
        total: allCheckIns.filter(c => c.location === location).length,
        completed: allCheckIns.filter(c => c.location === location && c.status === 'Collected').length
      }));

      const metrics = {
        dailyOperations: {
          totalAppointments: analytics.totalAppointments,
          completedCheckIns: analytics.completedCheckIns,
          pendingCheckIns: analytics.pendingCheckIns,
          completionRate: analytics.totalAppointments > 0 
            ? `${Math.round((analytics.completedCheckIns / analytics.totalAppointments) * 100)}%`
            : '0%'
        },
        performance: {
          avgCheckInTime: avgCheckInTime > 0 ? `${avgCheckInTime} minutes` : 'N/A',
          totalCheckIns: stats.total,
          completed: stats.completed,
          pending: stats.pending,
          completionRate: `${stats.completionRate}%`
        },
        byLocation: locationCounts
      };
      
      const response: ApiResponse = {
        success: true,
        data: metrics
      };
      res.json(response);
    } catch (error) {
      logger.error('Get performance metrics error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve performance metrics'
      };
      res.status(500).json(response);
    }
  }
}