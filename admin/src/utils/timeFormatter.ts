/**
 * @fileoverview Time formatting utilities for Foodbank Check-In and Appointment System admin panel
 *
 * This module provides timezone-aware date and time formatting functions.
 * All functions accept an optional timezone parameter and fall back to
 * 'America/Vancouver' when none is provided.
 *
 * @version 2.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 *
 * @see {@link ../config/theme.ts} Theme configuration
 */

const DEFAULT_TIMEZONE = 'America/Vancouver';

export const formatToLocalTime = (dateString: string | Date, tz: string = DEFAULT_TIMEZONE): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/** @deprecated Use formatToLocalTime instead */
export const formatToVancouverTime = formatToLocalTime;

export const formatToLocalTimeOnly = (dateString: string | Date, tz: string = DEFAULT_TIMEZONE): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/** @deprecated Use formatToLocalTimeOnly instead */
export const formatToVancouverTimeOnly = formatToLocalTimeOnly;

export const formatToLocalDateOnly = (dateString: string | Date, tz: string = DEFAULT_TIMEZONE): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/** @deprecated Use formatToLocalDateOnly instead */
export const formatToVancouverDateOnly = formatToLocalDateOnly;

export const getCurrentLocalTime = (tz: string = DEFAULT_TIMEZONE): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
};

/** @deprecated Use getCurrentLocalTime instead */
export const getCurrentVancouverTime = getCurrentLocalTime;
