/**
 * @fileoverview Authentication context provider for admin panel
 * 
 * This module provides centralized authentication state management using Supabase Auth.
 * It handles user sessions, admin authorization, and provides authentication methods
 * throughout the admin application. Features include automatic session restoration,
 * admin-only access control, and secure token management.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-01-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../lib/supabase.ts} Supabase client configuration
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Auth documentation
 */

/**
 * @fileoverview Authentication context provider for Foodbank Check-In and Appointment System admin panel
 * 
 * This module provides centralized authentication state management using Supabase Auth.
 * It handles user sessions, admin authorization, and provides authentication methods
 * throughout the admin application. The system uses an invite-only approach where only
 * users created in Supabase can access the admin panel.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Authentication Documentation
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useToast } from '@chakra-ui/react';

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
  const toast = useToast();

  // Simple admin check - if user exists in Supabase, they're admin
  const isAdmin = (user: User | null): boolean => {
    // If Supabase authenticated them, they're an admin
    // Only users you create in Supabase can access the system
    return !!user;
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Fast path: Check localStorage first (instant)
        const storedSession = localStorage.getItem('sb-auth-token');
        
        // Only call Supabase if we have a stored token (saves network call if no session)
        if (storedSession) {
          // Get initial session from Supabase
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            // Don't show welcome message on initial load - this is a restored session
          }
        } else {
          // No stored token - user definitely not logged in, no need to wait for Supabase
          setIsLoading(false);
          setIsInitialLoad(false);
          return;
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false); // Mark initial load as complete
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session);
          setUser(session.user);
          
          // Check if user is admin
          if (!isAdmin(session.user)) {
            // User is not admin - sign them out
            await supabase.auth.signOut();
            toast({
              title: 'Access Denied',
              description: 'You do not have admin privileges',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          } else {
            // Only show welcome message for fresh logins, not restored sessions
            if (!isInitialLoad) {
              toast({
                title: 'Welcome!',
                description: 'Successfully signed in to admin panel',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setSession(session);
          setUser(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Sign in function - delegates to Supabase
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        console.error('Supabase sign in error:', error);
        return { success: false, error: error.message };
      }
      
      // Success - Supabase will handle the auth state change
      return { success: true };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  // Sign out function - delegates to Supabase
  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: 'Sign Out Error',
          description: 'Failed to sign out properly',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Sign out exception:', error);
    }
  };

  // Reset password function - delegates to Supabase
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      
      // Use dynamic origin to support any port in development
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
   
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
  
      return { success: false, error: error.message || 'An unexpected error occurred' };
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