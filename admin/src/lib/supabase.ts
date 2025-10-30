/**
 * @fileoverview Supabase client configuration and security utilities for Foodbank Check-In and Appointment System admin panel
 * 
 * This module configures the Supabase client with security best practices including PKCE flow,
 * automatic token refresh, and session persistence. It also provides utility functions for
 * error handling, input validation, and security sanitization.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Authentication Documentation
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY


// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create Supabase client with security best practices
// Optimized for faster initial load
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disabled for login page - not needed
    flowType: 'pkce', // Use PKCE flow for enhanced security
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-auth-token',
    // Use memory storage first for faster checks
    debug: false,
  },
  // Disable realtime on login page - not needed
  realtime: undefined,
  global: {
    headers: {
      'X-Client-Info': 'cofb-admin-panel'
    }
  }
})

// Professional error handling with security considerations
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  
  // Don't expose internal error details in production
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
  
  // In development, show more detailed errors
  return error.message || 'An unexpected error occurred.'
}

// Security utility functions
export const sanitizeInput = (input: string): string => {
  // Basic input sanitization
  return input.trim().replace(/[<>]/g, '')
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // Minimum 8 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}
