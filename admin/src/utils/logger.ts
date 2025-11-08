/**
 * @fileoverview Production-safe logging utility for admin panel
 * 
 * This module provides a logging utility that automatically disables
 * console.log and console.warn in production while always logging errors.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-01-20
 * @license Proprietary - see LICENSE file for details
 */

const isDev = import.meta.env.DEV;

/**
 * Production-safe logger utility
 * 
 * - log(): Only logs in development
 * - warn(): Only logs in development
 * - error(): Always logs (errors are important in all environments)
 * - debug(): Only logs in development (for detailed debugging)
 */
export const logger = {
  /**
   * Log informational messages (development only)
   * @param args - Arguments to log
   */
  log: (...args: unknown[]): void => {
    if (isDev) {
      console.log('[LOG]', ...args);
    }
  },

  /**
   * Log warning messages (development only)
   * @param args - Arguments to log
   */
  warn: (...args: unknown[]): void => {
    if (isDev) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log error messages (always logged)
   * @param args - Arguments to log
   */
  error: (...args: unknown[]): void => {
    console.error('[ERROR]', ...args);
  },

  /**
   * Log debug messages (development only)
   * @param args - Arguments to log
   */
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
    }
  },

  /**
   * Check if logging is enabled for the current environment
   * @returns true if in development mode
   */
  isEnabled: (): boolean => isDev,
};

/**
 * Log API errors with context
 * @param context - Context where the error occurred
 * @param error - The error object
 */
export const logApiError = (context: string, error: unknown): void => {
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    // Connection errors - only log in dev
    if (isDev) {
      logger.warn(`${context}: Backend server not available`);
    }
  } else {
    // Other errors - always log
    logger.error(`${context}:`, error);
  }
};

