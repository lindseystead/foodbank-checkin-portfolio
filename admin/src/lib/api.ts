/**
 * @fileoverview API service layer for Foodbank Check-In and Appointment System admin panel
 * 
 * This module provides a centralized API service for communicating with the
 * backend API. It handles HTTP requests, error handling, and provides
 * methods for all admin panel operations including check-ins, CSV uploads,
 * and data management.
 * 
 * Best Practices Implemented:
 * - 10-second timeout protection to prevent hanging requests
 * - Automatic authentication token inclusion from Supabase
 * - Rate limiting handling (429 responses)
 * - Proper error logging (dev vs production)
 * - Automatic redirect on 401 (unauthorized)
 * 
 * Note: Components using this API should implement smart polling with:
 * - Page Visibility API to pause when tab is hidden
 * - Exponential backoff on connection errors
 * - Appropriate polling intervals (30-120 seconds based on priority)
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../contexts/AuthContext.tsx} Authentication context
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API} Page Visibility API
 */

import { supabase } from './supabase';
import { logger, logApiError } from '../utils/logger';

// ---------------------------------------------------------------------------
// Tenant ID injection — set by TenantContext, read by every request
// ---------------------------------------------------------------------------

let _currentTenantId: string | null = null;

/** Called by TenantContext whenever the tenant resolves or changes. */
export const setCurrentTenantId = (id: string | null): void => {
  _currentTenantId = id;
};

/** Read the current tenant ID (used internally). */
export const getCurrentTenantId = (): string | null => _currentTenantId;

/**
 * Get API base URL with graceful fallback
 * Returns null if not configured - components should handle gracefully
 */
const getApiBase = (): string | null => {
  // Check if env var exists and is not empty
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim();
  }

  // Use relative API base by default to leverage Vite proxy in dev
  // and same-origin routing in production.
  return '/api';
};

/**
 * Get authentication token from Supabase session
 * 
 * Best practice: Always get fresh session to ensure token is valid.
 * Supabase automatically refreshes tokens when needed.
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error('Error getting auth session:', error);
      return null;
    }
    
    // Return access token if session exists and is valid
    return session?.access_token || null;
  } catch (error) {
    logger.error('Error getting auth session:', error);
    return null;
  }
};

export const api = async (path: string, init?: RequestInit): Promise<Response> => {
  try {
    const API_BASE = getApiBase();
    
    // Handle missing API configuration gracefully
    // In CSV-only mode, this is expected - don't throw errors, return a mock response
    if (!API_BASE) {
      // Return a rejected promise silently - components handle this gracefully
      // Use logger.debug instead of throwing to avoid production console errors
      logger.debug('API not configured - CSV-only mode active');
      return Promise.reject(new Error('API_NOT_CONFIGURED'));
    }
    
    const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
    
    const authToken = await getAuthToken();
    
    // Don't set Content-Type for FormData - browser handles it
    const isFormData = init?.body instanceof FormData;
    
    const baseHeaders: HeadersInit = isFormData 
      ? {}
      : {
          'Content-Type': 'application/json',
        };
    
    const headers: Record<string, string> = {
      ...baseHeaders as Record<string, string>,
      ...(init?.headers as Record<string, string> || {}),
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Attach tenant context so the backend can scope queries
    if (_currentTenantId) {
      headers['X-Tenant-ID'] = _currentTenantId;
    }

    const response = await fetch(url, {
      ...init,
      headers,
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    // Redirect to login on 401
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    // Rate limited - let components handle it
    if (response.status === 429) {
      return response;
    }

    return response;
  } catch (error: any) {
    // Only log real errors, not API_NOT_CONFIGURED (expected state in CSV-only mode)
    if (error?.message !== 'API_NOT_CONFIGURED') {
      logApiError('API request failed', error);
    }
    return Promise.reject(error);
  }
};

// Clear all system data
export const clearAllData = async (): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await api('/admin/t/status/clear', {
      method: 'DELETE',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to clear data');
    }

    return result;
    // handle error gracefully
  } catch (error: any) {
    logger.error('Clear data failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to clear data'
    };
  }
};