/**
 * @fileoverview Simplified appointment date editing routes for Foodbank Check-In and Appointment System backend API
 * 
 * This module handles updating next appointment dates for clients.
 * It focuses solely on updating the appointment date that appears on printed tickets.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../controllers/checkInController.ts} Check-in controller
 */

import { Router } from 'express';
import { getTodayAppointments, updateCheckIn } from '../stores/unifiedStore';

const router = Router();

/**
 * PUT /api/admin/appointments/:clientId/update-next-date
 * Update the next appointment date for a client
 */
router.put('/appointments/:clientId/update-next-date', (req, res) => {
  try {
    const { clientId } = req.params;
    const { newDate, newTime } = req.body as { newDate?: string; newTime?: string };
    
    // Validate required fields
    if (!newDate) {
      return res.status(400).json({
        success: false,
        error: 'New date is required'
      });
    }
    // Build ISO using provided time or default 10:00
    const time = typeof newTime === 'string' && /^\d{2}:\d{2}$/.test(newTime) ? newTime : '10:00';
    const isoString = new Date(`${newDate}T${time}:00`).toISOString();
    
    // Get current appointment (which contains all client data)
    const appointments = getTodayAppointments();
    
    const currentAppointment = appointments.find(a => 
      a.clientId === clientId && 
      ['Pending', 'Collected'].includes(a.status)
    );
    
    if (!currentAppointment) {
      return res.status(404).json({
        success: false,
        error: 'No appointment found for this client'
      });
    }
    
    // Update the next appointment date fields
    const updatedAppointment = updateCheckIn(currentAppointment.id, {
      nextAppointmentDate: newDate,
      nextAppointmentTime: time,
      nextAppointmentISO: isoString,
      updatedAt: new Date().toISOString()
    });
    
    if (!updatedAppointment) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update appointment'
      });
    }
    
    res.json({
      success: true,
      appointment: updatedAppointment,
      message: 'Next appointment date updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to update appointment date',
      message: error.message
    });
  }
});

export default router;
