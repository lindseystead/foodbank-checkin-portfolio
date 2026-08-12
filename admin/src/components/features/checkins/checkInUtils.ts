/**
 * @fileoverview Check-in helper utilities
 */

import { CheckInRecord } from '../../../types/checkIn';

export const getStatusText = (status: string, checkIn: CheckInRecord): string => {
  if (status === 'Pending' && checkIn.appointmentTime) {
    const appointmentTime = new Date(checkIn.appointmentTime);
    const now = new Date();
    const hoursPast = (now.getTime() - appointmentTime.getTime()) / (1000 * 60 * 60);

    if (hoursPast >= 4) {
      return 'Missed';
    }
    if (hoursPast >= 1) {
      const hours = Math.floor(hoursPast);
      const minutes = Math.floor((hoursPast - hours) * 60);
      return minutes > 0 ? `Late by ${hours}h ${minutes}m` : `Late by ${hours}h`;
    }
  }

  switch (status) {
    case 'Collected':
      return 'Completed';
    case 'Shipped':
      return 'In Transit';
    case 'Pending':
      return 'Pending';
    case 'Not Collected':
      return 'Not Collected';
    case 'Rescheduled':
      return 'Rescheduled';
    case 'Cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};
