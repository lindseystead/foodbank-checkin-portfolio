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
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Authentication Documentation
 */

import { createClient } from '@supabase/supabase-js'
import { logger } from '../utils/logger'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

/**
 * Supabase client configuration following best practices:
 * - PKCE flow for enhanced security
 * - Automatic token refresh
 * - Session persistence using localStorage
 * - Proper error handling
 * 
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Auth Documentation
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
})

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
