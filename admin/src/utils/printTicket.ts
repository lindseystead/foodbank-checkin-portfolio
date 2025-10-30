/**
 * Unified print ticket utility
 * All print ticket functionality should use this function
 */

import { getTicketUrl } from '../common/apiConfig';

export const printTicket = (checkInId: string) => {
  if (!checkInId) {
    console.error('Print ticket: No check-in ID provided');
    return;
  }
  
  // Use the single backend endpoint for all print tickets
  window.open(getTicketUrl(checkInId), '_blank');
};
