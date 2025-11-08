/**
 * @fileoverview API service layer for Foodbank Check-In and Appointment System client application
 * 
 * This module provides a centralized API service for communicating with the
 * backend API from the client application. It handles HTTP requests,
 * error handling, and provides methods for check-in operations and
 * data submission.
 * 
 * Best Practices Implemented:
 * - Centralized API configuration for consistency
 * - Environment-based configuration (dev vs production)
 * - Proper error handling in calling components
 * - Rate limiting handled at server level (200 req/15min per IP)
 * 
 * Note: Client app uses one-time API calls (no polling needed).
 * The check-in flow is a single-use process, not a real-time dashboard.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./checkInService.ts} Check-in service implementation
 */

const getApiBase = (): string => {
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

export const api = (path: string, init?: RequestInit) => {
  const API_BASE = getApiBase();
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  return fetch(url, init);
};
