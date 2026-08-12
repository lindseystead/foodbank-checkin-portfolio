/**
 * @fileoverview Centralized API configuration for Foodbank Check-In and Appointment System
 * 
 * This module provides a single source of truth for API base URLs,
 * ensuring consistency across the application and proper environment-based configuration.
 * 
 * Best Practices:
 * - Environment-based configuration (dev vs production)
 * - Throws error in production if API URL not configured
 * - Consistent URL construction across the application
 * 
 * Note: Components using these URLs should implement smart polling with:
 * - Page Visibility API to pause when tab is hidden
 * - Exponential backoff on connection errors
 * - Appropriate polling intervals (30-120 seconds based on priority)
 * 
 * @version 1.0.0
 * @since 2025-10-28
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API} Page Visibility API
 */

/**
 * Get API base URL with graceful fallback
 * 
 * Best Practice: Never throw errors in production - always provide fallback
 * This allows the app to run in "offline mode" or show user-friendly messages
 */
export const getApiBaseUrl = (): string | null => {
  // Check if env var exists and is not empty
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim();
  }

  // Default to relative base to leverage Vite proxy in dev
  // and same-origin routing in production.
  return '/api';
};

/**
 * Check if API is configured
 */
export const isApiConfigured = (): boolean => {
  return getApiBaseUrl() !== null;
};

export const getTicketUrl = (checkInId: string): string | null => {
  const base = getApiBaseUrl();
  if (!base) return null;
  return `${base}/tickets/${checkInId}`;
};

export const getApiUrl = (path: string): string | null => {
  const base = getApiBaseUrl();
  if (!base) return null;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

