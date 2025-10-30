/**
 * @fileoverview Supabase client configuration for Foodbank Check-In and Appointment System client application
 * 
 * This module configures the Supabase client for the client application
 * to enable help request functionality. It provides a secure connection
 * to Supabase services for storing client assistance requests.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Authentication Documentation
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration not found. Help request functionality will be disabled.');
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Don't persist auth sessions in client app
        autoRefreshToken: false, // Don't auto-refresh tokens
        detectSessionInUrl: false // Don't detect sessions in URL
      }
    })
  : null;

// Helper function to check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};
