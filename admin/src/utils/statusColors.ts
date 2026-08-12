/**
 * @fileoverview Status color mapping — hex values come from designTokens.
 */

import { chartColors, palette } from '../config/designTokens';

export const STATUS_COLORS = {
  completed: {
    hex: chartColors.completed,
    chakra: 'green',
    token: 'accent.green.300',
    name: 'green',
  },
  pending: {
    hex: chartColors.pending,
    chakra: 'blue',
    token: 'brand.500',
    name: 'blue',
  },
  noShow: {
    hex: chartColors.noShow,
    chakra: 'red',
    token: 'accent.coral.300',
    name: 'red',
  },
  shipped: {
    hex: chartColors.shipped,
    chakra: 'purple',
    token: 'admin.shipped',
    name: 'purple',
  },
  cancelled: {
    hex: chartColors.cancelled,
    chakra: 'gray',
    token: 'admin.muted',
    name: 'gray',
  },
  late: {
    hex: chartColors.late,
    chakra: 'orange',
    token: 'accent.orange.300',
    name: 'orange',
  },
} as const;

export const getStatusColorScheme = (
  status: string,
  checkIn?: { appointmentTime?: string }
): string => {
  if (status === 'Pending' && checkIn?.appointmentTime) {
    const appointmentTime = new Date(checkIn.appointmentTime);
    const now = new Date();
    const hoursPast = (now.getTime() - appointmentTime.getTime()) / (1000 * 60 * 60);

    if (hoursPast >= 4) {
      return STATUS_COLORS.noShow.chakra;
    }
    if (hoursPast >= 1) {
      return STATUS_COLORS.late.chakra;
    }
  }

  switch (status) {
    case 'Collected':
      return STATUS_COLORS.completed.chakra;
    case 'Shipped':
      return STATUS_COLORS.shipped.chakra;
    case 'Pending':
    case 'Rescheduled':
      return STATUS_COLORS.pending.chakra;
    case 'Not Collected':
      return STATUS_COLORS.noShow.chakra;
    case 'Cancelled':
      return STATUS_COLORS.cancelled.chakra;
    default:
      return STATUS_COLORS.cancelled.chakra;
  }
};

export const getStatusColorHex = (
  status: string,
  checkIn?: { appointmentTime?: string }
): string => {
  if (status === 'Pending' && checkIn?.appointmentTime) {
    const appointmentTime = new Date(checkIn.appointmentTime);
    const now = new Date();
    const hoursPast = (now.getTime() - appointmentTime.getTime()) / (1000 * 60 * 60);

    if (hoursPast >= 4) {
      return STATUS_COLORS.noShow.hex;
    }
    if (hoursPast >= 1) {
      return STATUS_COLORS.late.hex;
    }
  }

  switch (status) {
    case 'Collected':
      return STATUS_COLORS.completed.hex;
    case 'Shipped':
      return STATUS_COLORS.shipped.hex;
    case 'Pending':
    case 'Rescheduled':
      return STATUS_COLORS.pending.hex;
    case 'Not Collected':
      return STATUS_COLORS.noShow.hex;
    case 'Cancelled':
      return STATUS_COLORS.cancelled.hex;
    default:
      return STATUS_COLORS.cancelled.hex;
  }
};

/** Theme token string for Chakra color/bg props. */
export const getStatusColorToken = (
  status: string,
  checkIn?: { appointmentTime?: string }
): string => {
  if (status === 'Pending' && checkIn?.appointmentTime) {
    const appointmentTime = new Date(checkIn.appointmentTime);
    const now = new Date();
    const hoursPast = (now.getTime() - appointmentTime.getTime()) / (1000 * 60 * 60);

    if (hoursPast >= 4) return STATUS_COLORS.noShow.token;
    if (hoursPast >= 1) return STATUS_COLORS.late.token;
  }

  switch (status) {
    case 'Collected':
      return STATUS_COLORS.completed.token;
    case 'Shipped':
      return STATUS_COLORS.shipped.token;
    case 'Pending':
    case 'Rescheduled':
      return STATUS_COLORS.pending.token;
    case 'Not Collected':
      return STATUS_COLORS.noShow.token;
    case 'Cancelled':
      return STATUS_COLORS.cancelled.token;
    default:
      return STATUS_COLORS.cancelled.token;
  }
};

export { palette, chartColors };
