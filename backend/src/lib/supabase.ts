/**
 * @fileoverview Supabase client configuration for backend JWT verification
 * 
 * This module provides the Supabase client for server-side authentication
 * verification. It uses the service role key to verify JWT tokens from
 * admin panel requests.
 * 
 * IMPORTANT: This uses the service role key which has elevated privileges.
 * Never expose this key to the frontend.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('⚠️  CRITICAL: Supabase environment variables not configured.');
  console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('Admin authentication will be disabled until configured.');
}

/**
 * Create Supabase client with service role key for server-side JWT verification
 * This client bypasses RLS (Row Level Security) and has admin privileges
 */
export const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  : null;

/**
 * Verify a Supabase JWT token
 * @param token - The JWT token from the Authorization header
 * @returns Promise with user info if valid, null if invalid
 */
export const verifyToken = async (token: string) => {
  if (!supabase) {
    console.error('Supabase client not configured');
    return null;
  }

  try {
    // Verify token and get user from Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      // Log authentication failure for security monitoring
      console.warn(`Authentication failed: ${error?.message || 'Invalid token'}`);
      return null;
    }

    return user;
  } catch (error: any) {
    // Critical error in authentication - log for investigation
    console.error('Token verification error:', error?.message || error);
    return null;
  }
};

