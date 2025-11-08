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
import { logger } from '../utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn('Supabase not configured - help requests disabled');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  : null;

export const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};
