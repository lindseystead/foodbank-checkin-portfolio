/**
 * @fileoverview API service layer for Foodbank Check-In and Appointment System client application
 * 
 * This module provides a centralized API service for communicating with the
 * backend API from the client application. It handles HTTP requests,
 * error handling, and provides methods for check-in operations and
 * data submission.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./checkInService.ts} Check-in service implementation
 */

const getApiBase = () => {
  // If VITE_API_BASE_URL is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Development fallback - use local API for testing
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }
  
  // Production - fallback (should be set via VITE_API_BASE_URL)
  return 'http://localhost:3001/api';
};

const API_BASE = getApiBase();

export const api = (path: string, init?: RequestInit) => {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  return fetch(url, init);
};
