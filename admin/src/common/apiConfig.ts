/**
 * @fileoverview Centralized API configuration for Foodbank Check-In and Appointment System
 * 
 * This module provides a single source of truth for API base URLs,
 * ensuring consistency across the application and proper environment-based configuration.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-28
 * @license Proprietary - see LICENSE file for details
 */

/**
 * Get the API base URL based on environment
 * 
 * Priority:
 * 1. VITE_API_BASE_URL environment variable (highest priority)
 * 2. Development mode: localhost
 * 3. Production fallback: environment variable must be set
 * 
 * @returns The API base URL
 */
export const getApiBaseUrl = (): string => {
  // Priority 1: Environment variable (set in Vercel/AWS/etc.)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Priority 2: Development mode uses local backend
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }
  
  // Priority 3: Production fallback
  // In production, VITE_API_BASE_URL should always be set
  // This fallback is just for safety
  return 'http://localhost:3001/api';
};

/**
 * Get the API base URL for print tickets
 * Used for opening tickets in new windows
 */
export const getTicketUrl = (checkInId: string): string => {
  return `${getApiBaseUrl()}/tickets/${checkInId}`;
};

/**
 * Combine API base URL with an endpoint path
 * 
 * @param path - The API endpoint path (e.g., '/checkin' or 'checkin')
 * @returns The full API URL
 */
export const getApiUrl = (path: string): string => {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

