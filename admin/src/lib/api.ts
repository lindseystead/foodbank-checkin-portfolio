/**
 * @fileoverview API service layer for Foodbank Check-In and Appointment System admin panel
 * 
 * This module provides a centralized API service for communicating with the
 * backend API. It handles HTTP requests, error handling, and provides
 * methods for all admin panel operations including check-ins, CSV uploads,
 * and data management.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../contexts/AuthContext.tsx} Authentication context
 */

import { supabase } from './supabase';

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

/**
 * Get the current Supabase session token for API authentication
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error('Error getting auth session:', error);
    return null;
  }
};

// Simple rate limiting - track last call time
// let lastCallTime = 0;
// const MIN_CALL_INTERVAL = 1000; // Minimum 1 second between calls

export const api = async (path: string, init?: RequestInit): Promise<Response> => {
  try {
    const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
    
    // Get auth token from Supabase session
    const authToken = await getAuthToken();
    
    // Don't set Content-Type for FormData - let the browser set it with boundary
    const isFormData = init?.body instanceof FormData;
    
    // Build headers with authentication
    const baseHeaders: HeadersInit = isFormData 
      ? {}
      : {
          'Content-Type': 'application/json',
        };
    
    // Add auth token if available
    const headers: Record<string, string> = {
      ...baseHeaders as Record<string, string>,
      ...(init?.headers as Record<string, string> || {}),
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(url, {
      ...init,
      headers,
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    // Handle authentication errors - redirect to login
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    // Handle rate limiting - return response for graceful degradation
    if (response.status === 429) {
      // Rate limit exceeded - components handle this gracefully
      return response;
    }

    return response;
  } catch (error: any) {
    // Log only unexpected errors (not connection refused)
    if (!(error instanceof TypeError && error.message.includes('Failed to fetch'))) {
      console.error('API request failed:', error?.message || error);
    }
    return Promise.reject(error);
  }
};

/**
 * Clear all data from the system
 */
export const clearAllData = async (): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await api('/status/clear', {
      method: 'DELETE',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to clear data');
    }

    return result;
  } catch (error: any) {
    console.error('Clear data failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to clear data'
    };
  }
};