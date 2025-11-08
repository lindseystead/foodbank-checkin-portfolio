/**
 * @fileoverview Centralized API configuration for Foodbank Check-In and Appointment System client
 * 
 * This module provides a single source of truth for API base URLs,
 * ensuring consistency across the application and proper environment-based configuration.
 * 
 * Best Practices:
 * - Environment-based configuration (dev vs production)
 * - Throws error in production if API URL not configured
 * - Consistent URL construction across the application
 * 
 * Note: Client app uses one-time API calls (no polling needed).
 * The check-in flow is a single-use process, not a real-time dashboard.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-28
 * @license Proprietary - see LICENSE file for details
 */

export const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Dev mode - use local API
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }
  
  // Production needs this env var
  throw new Error(
    'VITE_API_BASE_URL environment variable is required in production. ' +
    'Please configure it in your deployment platform (Vercel, AWS, etc.).'
  );
};

// Get help request URL
export const getHelpRequestUrl = (): string => {
  return `${getApiBaseUrl()}/help-requests`;
};

// Get API URL
export const getApiUrl = (path: string): string => {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

