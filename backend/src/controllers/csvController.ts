/**
 * @fileoverview CSV controller for Foodbank Check-In and Appointment System backend API
 * 
 * This module handles CSV file processing operations including file upload,
 * data validation, and bulk appointment creation. It provides methods for
 * processing CSV data and managing bulk operations for the food bank system.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../services/csvProcessor.ts} CSV processing service
 */

import { getTodayAppointments, getAllCheckIns } from '../stores/unifiedStore';

export class CsvController {
  /**
   * Export all original CSV records with updates
   * 
   * This exports EVERY person from the original CSV upload with:
   * - Same headers and order as original upload
   * - Updated status from check-ins
   * - Next appointment date (or "NA" if missed)
   * - Special requests from client check-in
   * - Original data preserved unless updated
   * 
   * @returns CSV string matching original format with updates
   */
  static exportAllWithUpdates(): string {
    // Get ALL original CSV records (everyone from the upload)
    const allRecords = getAllCheckIns().filter(r => r.source === 'csv');
    
    // Original CSV headers in exact order (matching upload format)
    const headers = [
      'Client #',
      'Name',
      'Pick Up Date',
      'Dietary Considerations',
      'Items Provided',
      'Adults',
      'Seniors',
      'Children',
      "Children's Ages",
      'Email',
      'Phone Number',
      'Next Pick Up Date', // NEW: Auto-generated next appointment
      'Status', // NEW: Updated status from check-ins
      'Special Requests' // NEW: Mobility, allergies, etc. from check-in
    ];
    
    /**
     * Format next appointment date for display
     * Returns "NA" if appointment was missed or no next appointment
     */
    const formatNextAppointment = (record: any): string => {
      // If status is "Not Collected" (missed), return "NA"
      if (record.status === 'Not Collected') {
        return 'NA';
      }
      
      // If there's a next appointment, format it
      if (record.nextAppointmentISO || record.nextAppointmentDate) {
        try {
          if (record.nextAppointmentISO) {
            const d = new Date(record.nextAppointmentISO);
            if (!isNaN(d.getTime())) {
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              let hours = d.getHours();
              const minutes = String(d.getMinutes()).padStart(2, '0');
              const ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12;
              if (hours === 0) hours = 12;
              return `${yyyy}-${mm}-${dd} @ ${hours}:${minutes} ${ampm}`;
            }
          }
          // Fallback to date + time strings
          if (record.nextAppointmentDate && record.nextAppointmentTime) {
            return `${record.nextAppointmentDate} @ ${record.nextAppointmentTime}`;
          }
          if (record.nextAppointmentDate) {
            return record.nextAppointmentDate;
          }
        } catch (error) {
          console.error('Error formatting next appointment:', error);
        }
      }
      
      // No next appointment or missed appointment
      return 'NA';
    };
    
    /**
     * Format special requests from check-in
     * Combines mobility, allergies, dietary restrictions, etc.
     */
    const formatSpecialRequests = (record: any): string => {
      const requests = [];
      
      // Mobility assistance
      if (record.hasMobilityIssues) {
        requests.push('Mobility Assistance Required');
      }
      
      // Allergies
      if (record.allergies && record.allergies.trim()) {
        requests.push(`Allergies: ${record.allergies.trim()}`);
      }
      
      // Dietary restrictions from check-in (additional to CSV dietary)
      if (record.dietaryRestrictions && Array.isArray(record.dietaryRestrictions) && record.dietaryRestrictions.length > 0) {
        requests.push(`Dietary: ${record.dietaryRestrictions.join(', ')}`);
      }
      
      // Unwanted foods
      if (record.unwantedFoods && record.unwantedFoods.trim()) {
        requests.push(`Unwanted: ${record.unwantedFoods.trim()}`);
      }
      
      // Diaper size
      if (record.diaperSize && record.diaperSize.trim()) {
        requests.push(`Diaper Size: ${record.diaperSize.trim()}`);
      }
      
      // Additional info
      if (record.additionalInfo && record.additionalInfo.trim()) {
        requests.push(`Notes: ${record.additionalInfo.trim()}`);
      }
      
      return requests.length > 0 ? requests.join('; ') : '';
    };
    
    /**
     * Combine dietary considerations from CSV and check-in updates
     */
    const getDietaryConsiderations = (record: any): string => {
      const csvDietary = record.dietaryConsiderations || '';
      const checkInDietary = record.dietaryRestrictions && Array.isArray(record.dietaryRestrictions) 
        ? record.dietaryRestrictions.join(', ') 
        : '';
      
      // Merge both, removing duplicates
      const allDietary = [csvDietary, checkInDietary]
        .filter(Boolean)
        .join(', ')
        .split(', ')
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .join(', ');
      
      return allDietary || 'None';
    };
    
    // Convert to CSV rows - preserving original data with updates
    const rows = allRecords.map(record => [
      record.clientId || '',
      record.clientName || `${record.firstName || ''} ${record.lastName || ''}`.trim(),
      record.pickUpDate || '', // Original pickup date
      getDietaryConsiderations(record), // Updated dietary (CSV + check-in)
      record.itemsProvided || record.provisions || '', // Original items provided
      record.adults || 0,
      record.seniors || 0,
      record.children || 0,
      record.childrensAges || record.childrenAges || '',
      record.email || '',
      record.phoneNumber || '',
      formatNextAppointment(record), // NEW: Next appointment or "NA"
      record.status || 'Pending', // NEW: Updated status
      formatSpecialRequests(record) // NEW: Special requests from check-in
    ]);
    
    // Combine headers and rows with proper CSV escaping
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => {
        const fieldStr = String(field || '');
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
          return `"${fieldStr.replace(/"/g, '""')}"`;
        }
        return fieldStr;
      }).join(','))
      .join('\n');
    
    return csvContent;
  }

  /**
   * Export next appointments as CSV (legacy method - kept for backward compatibility)
   * @returns CSV string with next appointment data
   */
  static exportNextAppointments(): string {
    const checkIns = getAllCheckIns();
    const completedCheckIns = checkIns.filter(c => c.status === 'Collected' && c.nextAppointmentISO);
    
    // CSV headers
    const headers = [
      'Pick Up Date',
      'Client ID',
      'Client Name',
      'Phone Number',
      'Email',
      'Household Size',
      'Adults',
      'Seniors',
      'Children',
      'Children Ages',
      'Dietary Considerations',
      'Location',
      'Program',
      'Next Appointment Date',
      'Next Appointment Time',
      'Next Appointment ISO',
      'Ticket Number',
      'Is Auto Generated',
      'Generated At'
    ];
    
    // Helper to format "YYYY-MM-DD @ h:mm AM/PM" in local time
    const formatPickUpDisplay = (iso?: string, date?: string, time?: string): string => {
      try {
        if (iso) {
          const d = new Date(iso);
          if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            let hours = d.getHours();
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            if (hours === 0) hours = 12;
            return `${yyyy}-${mm}-${dd} @ ${hours}:${minutes} ${ampm}`;
          }
        }
        if (date && time) return `${date} @ ${time}`;
        if (date) return `${date}`;
      } catch {}
      return '';
    };

    // Convert to CSV rows
    const rows = completedCheckIns.map(checkIn => [
      formatPickUpDisplay(checkIn.nextAppointmentISO, checkIn.nextAppointmentDate, checkIn.nextAppointmentTime),
      checkIn.clientId,
      checkIn.clientName,
      checkIn.phoneNumber || '',
      checkIn.email || '',
      checkIn.householdSize || '',
      checkIn.adults || '',
      checkIn.seniors || '',
      checkIn.children || '',
      checkIn.childrensAges || checkIn.childrenAges || '',
      checkIn.dietaryConsiderations || '',
      checkIn.location || 'Foodbank Check-In and Appointment System',
      checkIn.program || 'Food Hamper',
      checkIn.nextAppointmentDate || '',
      checkIn.nextAppointmentTime || '',
      checkIn.nextAppointmentISO || '',
      checkIn.ticketNumber || '',
      checkIn.isAutoGenerated ? 'Yes' : 'No',
      checkIn.generatedAt || ''
    ]);
    
    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    return csvContent;
  }
}

export default CsvController;
