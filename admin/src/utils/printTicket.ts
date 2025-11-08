/**
 * @fileoverview Print ticket utility for Foodbank Check-In and Appointment System admin panel
 * 
 * This module provides unified print ticket functionality for the admin panel.
 * All print ticket operations should use this utility to ensure consistency
 * and proper ticket generation.
 * 
 * Best Practices Implemented:
 * - Centralized ticket printing: All print buttons use this utility
 * - Consistent data source: All tickets use the same backend endpoint
 * - Same data structure: All tickets display the same information
 * - Error handling: Validates check-in ID before printing
 * - Opens in new window: Prevents navigation away from admin panel
 * 
 * IMPORTANT: All admin features with print icons MUST use this utility
 * to ensure consistent ticket generation across the application.
 * 
 * Verified Print Icon Locations (all use this utility):
 * - CheckInsPage.tsx: handlePrintTicket() -> printTicket()
 * - RecentCheckInsList.tsx: onClick -> printTicket()
 * - ClientDetailPage.tsx: handlePrint() -> printTicket()
 * 
 * Auto-Generated Appointment Flow:
 * 1. Client checks in via POST /api/checkin
 * 2. Backend auto-generates next appointment (21+ days from today, preserves time)
 *    - Uses calculateNextAppointmentDate() to add 21 days and adjust for weekdays/holidays
 *    - Uses getNextValidTime() to preserve original appointment time (around the same time)
 * 3. Appointment stored in check-in record (nextAppointmentISO, nextAppointmentDate, nextAppointmentTime)
 * 4. Same appointment data sent to client during check-in process (in response)
 * 5. Ticket generation (GET /api/tickets/:checkInId) displays this auto-generated appointment
 * 6. Admin can edit appointment via PUT /api/admin/appointments/:checkInId/update-next-date
 * 7. Updated appointment appears on tickets and throughout admin panel
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../common/apiConfig.ts} API configuration
 * @see {@link ../../backend/src/routes/tickets.ts} Backend ticket generation
 * @see {@link ../../backend/src/utils/appointmentScheduler.ts} Auto-scheduling logic (21+ days, preserves time)
 */

import { getTicketUrl } from '../common/apiConfig';

/**
 * Print ticket for a check-in record
 * 
 * This function opens the HTML ticket in a new window for printing.
 * All print buttons across the admin panel should use this utility
 * to ensure consistent ticket generation.
 * 
 * The ticket includes:
 * - Client name and information
 * - Next appointment date and time (auto-generated)
 * - Household size and dietary requirements
 * - Special requests and mobility assistance
 * - Pickup instructions
 * 
 * @param checkInId - The unique identifier for the check-in record
 * 
 * @example
 * ```tsx
 * <Button onClick={() => printTicket(checkIn.id)}>
 *   Print Ticket
 * </Button>
 * ```
 */
export const printTicket = (checkInId: string) => {
  if (!checkInId) {
    console.error('Print ticket: No check-in ID provided');
    return;
  }
  
  // Open ticket in new window for printing
  // Backend endpoint: GET /api/tickets/:checkInId
  // Returns HTML ticket with all client and appointment data
  window.open(getTicketUrl(checkInId), '_blank');
};
