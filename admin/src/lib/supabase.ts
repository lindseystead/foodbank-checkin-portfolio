/**
 * @fileoverview Supabase client configuration and security utilities for Foodbank Check-In and Appointment System admin panel
 * 
 * IMPORTANT: This module uses Supabase ONLY for authentication services.
 * We do NOT use Supabase database tables - all application data is stored in the backend API.
 * 
 * This module configures the Supabase client with security best practices including PKCE flow,
 * automatic token refresh, and session persistence. It also provides utility functions for
 * error handling, input validation, and security sanitization.
 * 
 * Supabase is used solely for:
 * - User authentication (email/password login)
 * - Session and token management
 * - Password reset functionality
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Authentication Documentation
 */

import { createClient } from '@supabase/supabase-js'
import { logger } from '../utils/logger'

/**
 * Get Supabase URL from environment variables
 * Reads from import.meta.env at runtime to ensure Vite has loaded .env files
 */
const getSupabaseUrl = (): string | undefined => {
  return import.meta.env.VITE_SUPABASE_URL;
};

/**
 * Get Supabase anonymous key from environment variables
 * Reads from import.meta.env at runtime to ensure Vite has loaded .env files
 */
const getSupabaseAnonKey = (): string | undefined => {
  return import.meta.env.VITE_SUPABASE_ANON_KEY;
};

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  // Read env vars at runtime (not at module load time) to ensure Vite has processed them
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  
  // Handle both undefined and empty string cases
  const urlStr = typeof url === 'string' ? url.trim() : '';
  const keyStr = typeof key === 'string' ? key.trim() : '';
  return !!(urlStr && keyStr && urlStr.length > 0 && keyStr.length > 0);
};

// Gracefully handle missing Supabase config (for CSV-only mode)
// Don't throw error - let components handle missing auth gracefully
if (!isSupabaseConfigured()) {
  if (import.meta.env.DEV) {
    // Debug: Log what we're seeing
    // Read env vars at runtime for debugging
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    logger.warn('Supabase configuration check:', {
      hasUrl: !!url,
      hasKey: !!key,
      urlType: typeof url,
      keyType: typeof key,
      urlValue: url ? `${url.substring(0, 20)}...` : 'undefined',
      keyValue: key ? `${key.substring(0, 20)}...` : 'undefined',
      allViteEnvKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
    });
    logger.warn(
      'Missing Supabase environment variables in development. Please create a .env file in the admin/ directory with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Then restart the dev server (Vite only loads .env on startup).'
    );
  } else {
    logger.warn(
      'Missing Supabase environment variables. Authentication will be disabled.'
    );
  }
}

/**
 * Supabase client configuration following best practices:
 * - PKCE flow for enhanced security
 * - Automatic token refresh
 * - Session persistence using localStorage
 * - Proper error handling
 * 
 * Note: If env vars are missing, creates a dummy client that will fail gracefully
 * 
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Auth Documentation
 */
// Only create Supabase client if properly configured
// If not configured, we'll create a mock client that throws helpful errors
// Read env vars at runtime to ensure they're loaded
export const supabase = (() => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  
  if (isSupabaseConfigured() && url && key) {
    return createClient(url, key, {
      auth: {
        // Enable automatic token refresh (recommended)
        autoRefreshToken: true,
        // Persist session in localStorage (default behavior)
        persistSession: true,
        // Disable URL-based session detection for admin panel (not using OAuth redirects)
        detectSessionInUrl: false,
        // Use PKCE flow for enhanced security (recommended for all auth flows)
        flowType: 'pkce',
        // Use default storage (localStorage) - Supabase handles this automatically
        // Don't override storageKey - use Supabase's default for compatibility
        debug: import.meta.env.DEV, // Enable debug in development only
      },
      global: {
        headers: {
          'X-Client-Info': 'cofb-admin-panel'
        }
      }
    });
  } else {
    // Return mock client that throws helpful errors
    return {
      auth: {
        getSession: async () => {
          throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
        },
        signInWithPassword: async () => {
          throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
        },
        signOut: async () => {
          throw new Error('Supabase is not configured.');
        },
        onAuthStateChange: () => ({
          data: { subscription: null },
          error: null,
        }),
      }
    } as any;
  }
})();

export const handleSupabaseError = (error: any) => {
  logger.error('Supabase error:', error)
  
  // Hide error details in production
  if (import.meta.env.PROD) {
    if (error.code === 'PGRST301') {
      return 'Authentication required. Please log in.'
    }
    
    if (error.code === 'PGRST302') {
      return 'Access denied. You do not have permission for this action.'
    }
    
    if (error.code === 'PGRST303') {
      return 'Data not found.'
    }
    
    return 'An error occurred. Please try again.'
  }
  
  // Dev mode - show full error
  return error.message || 'An unexpected error occurred.'
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // 8+ chars, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}
