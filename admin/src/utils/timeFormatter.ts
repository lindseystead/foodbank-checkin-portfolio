/**
 * @fileoverview Time formatting utilities for Foodbank Check-In and Appointment System admin panel
 * 
 * This module provides timezone-aware date and time formatting functions
 * specifically for the Vancouver timezone. It handles date display,
 * formatting, and timezone conversion for the admin panel interface.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../common/theme.ts} Theme configuration
 */

const VANCOUVER_TIMEZONE = 'America/Vancouver';

export const formatToVancouverTime = (dateString: string | Date): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    timeZone: VANCOUVER_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatToVancouverTimeOnly = (dateString: string | Date): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    timeZone: VANCOUVER_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatToVancouverDateOnly = (dateString: string | Date): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    timeZone: VANCOUVER_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const getCurrentVancouverTime = (): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: VANCOUVER_TIMEZONE }));
};
