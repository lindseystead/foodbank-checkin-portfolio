/**
 * @fileoverview Authentication context provider for Foodbank Check-In and Appointment System admin panel
 * 
 * This module provides centralized authentication state management using Supabase Auth.
 * IMPORTANT: This system uses Supabase ONLY for authentication (user login, sessions, tokens).
 * We do NOT use Supabase database tables - all data is stored in the backend API.
 * 
 * The system uses an invite-only approach where only users created in Supabase can access
 * the admin panel. Supabase is used solely for:
 * - User authentication (email/password)
 * - Session management
 * - Token generation and refresh
 * - Password reset functionality
 * 
 * Features:
 * - Automatic session restoration
 * - Admin-only access control
 * - Secure token management
 * - Session persistence
 * - Password reset functionality
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../lib/supabase.ts} Supabase client configuration
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Authentication Documentation
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useToast } from '@chakra-ui/react';
import { logger } from '../utils/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasShownWelcomeToast, setHasShownWelcomeToast] = useState(false);
  const toast = useToast();

  /**
   * Check if user has admin privileges
   * 
   * Best practice: Use user metadata to determine admin status.
   * Admin users should have `role: 'admin'` in their user_metadata or app_metadata.
   * 
   * For now, any authenticated user is considered an admin (invite-only system).
   * In production, you should set user metadata when creating admin users:
   * 
   * ```sql
   * -- In Supabase SQL Editor or via Admin API:
   * UPDATE auth.users 
   * SET user_metadata = jsonb_set(user_metadata, '{role}', '"admin"')
   * WHERE email = 'admin@example.com';
   * ```
   * 
   * Then check: user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin'
   */
  const isAdmin = (user: User | null): boolean => {
    if (!user) return false;
    
    // Check user metadata for admin role (recommended approach)
    const userRole = user.user_metadata?.role || user.app_metadata?.role;
    if (userRole === 'admin') {
      return true;
    }
    
    // Fallback: For invite-only systems, any authenticated user is admin
    // This should be replaced with proper role checking in production
    return true;
  };

  useEffect(() => {
    /**
     * Initialize authentication state
     * 
     * Best practice: Always call getSession() - Supabase handles localStorage automatically.
     * Don't manually check localStorage as Supabase manages session storage internally.
     */
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Get current session - Supabase automatically checks localStorage
        // and validates the session with the server if needed
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting session:', error);
          // Clear invalid session
          setSession(null);
          setUser(null);
        } else if (initialSession?.user) {
          // Session restored from localStorage - don't show welcome toast
          setSession(initialSession);
          setUser(initialSession.user);
          // Mark that we've already loaded (session restored, not new login)
          setHasShownWelcomeToast(true);
        } else {
          // No valid session
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        logger.error('Auth initialization error:', error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    initializeAuth();

    /**
     * Subscribe to auth state changes
     * 
     * Best practice: Handle all auth events properly:
     * - SIGNED_IN: User successfully authenticated
     * - SIGNED_OUT: User signed out
     * - TOKEN_REFRESHED: Access token was refreshed
     * - USER_UPDATED: User metadata was updated
     * - PASSWORD_RECOVERY: Password reset flow initiated
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session);
          setUser(session.user);
          
          // Verify admin privileges
          if (!isAdmin(session.user)) {
            // Not an admin, sign them out immediately
            await supabase.auth.signOut();
            toast({
              title: 'Access Denied',
              description: 'Your account does not have administrator privileges. Please contact your system administrator for access.',
              status: 'error',
              duration: 6000,
              isClosable: true,
            });
          } else {
            // Only show welcome toast for actual new logins (not session restoration)
            // Don't show if it's the initial load (page refresh) or if we've already shown it
            if (!isInitialLoad && !hasShownWelcomeToast) {
              setHasShownWelcomeToast(true);
              toast({
                title: 'Welcome Back',
                description: 'You have successfully signed in to the admin panel.',
                status: 'success',
                duration: 4000,
                isClosable: true,
              });
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          // Reset welcome toast flag when user signs out
          setHasShownWelcomeToast(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Token was refreshed - update session
          setSession(session);
          setUser(session.user);
        } else if (event === 'USER_UPDATED' && session?.user) {
          // User metadata was updated - refresh user data
          setSession(session);
          setUser(session.user);
        } else if (event === 'PASSWORD_RECOVERY') {
          // Password recovery flow initiated
          // This is handled by the password reset page
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  /**
   * Sign in with email and password
   * 
   * Best practice: Use signInWithPassword() with proper error handling.
   * Supabase automatically handles session creation and token management.
   */
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Trim email and validate
      const trimmedEmail = email.trim().toLowerCase();
      
      if (!trimmedEmail || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password
      });

      if (error) {
        logger.error('Supabase sign in error:', error);
        
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
        } else if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email address before signing in.' };
        } else if (error.message.includes('Too many requests')) {
          return { success: false, error: 'Too many login attempts. Please wait a few minutes and try again.' };
        }
        
        return { success: false, error: error.message };
      }
      
      // Success - onAuthStateChange will handle session update
      // Verify admin status after sign in
      if (data?.user && !isAdmin(data.user)) {
        await supabase.auth.signOut();
        return { success: false, error: 'Your account does not have administrator privileges.' };
      }
      
      return { success: true };
    } catch (error: any) {
      logger.error('Sign in exception:', error);
      return { success: false, error: error.message || 'An unexpected error occurred. Please try again.' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: 'Sign Out Error',
          description: 'Unable to sign out properly. Please close your browser or clear your session manually.',
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Sign out exception:', error);
    }
  };

  /**
   * Send password reset email
   * 
   * Best practice: Use resetPasswordForEmail() with proper redirect URL.
   * The redirect URL must be added to your Supabase project's allowed redirect URLs
   * in the Supabase Dashboard > Authentication > URL Configuration.
   */
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      
      if (!trimmedEmail) {
        return { success: false, error: 'Email address is required' };
      }

      // Construct redirect URL - must match Supabase dashboard settings
      // Best practice: Use absolute URL with the admin route
      const redirectUrl = `${window.location.origin}/admin/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: redirectUrl,
        // Optional: Customize email template
        // emailRedirectTo: redirectUrl,
      });

      if (error) {
        logger.error('Password reset error:', error);
        
        // Provide user-friendly error messages
        if (error.message.includes('rate limit')) {
          return { success: false, error: 'Too many password reset requests. Please wait a few minutes and try again.' };
        }
        
        return { success: false, error: error.message };
      }

      // Success - email sent (even if user doesn't exist, for security)
      return { success: true };
    } catch (error: any) {
      logger.error('Password reset exception:', error);
      return { success: false, error: error.message || 'An unexpected error occurred. Please try again.' };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};