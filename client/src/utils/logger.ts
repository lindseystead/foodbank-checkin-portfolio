/**
 * @fileoverview Production-safe logging utility for client application
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

// Logger that only logs in dev (except errors)
export const logger = {
  log: (...args: unknown[]): void => {
    if (isDev) {
      console.log('[LOG]', ...args);
    }
  },

  warn: (...args: unknown[]): void => {
    if (isDev) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (...args: unknown[]): void => {
    console.error('[ERROR]', ...args);
  },

  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
    }
  },

  isEnabled: (): boolean => isDev,
};

// Log API errors (connection errors only in dev)
export const logApiError = (context: string, error: unknown): void => {
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    if (isDev) {
      logger.warn(`${context}: Backend server not available`);
    }
  } else {
    logger.error(`${context}:`, error);
  }
};

