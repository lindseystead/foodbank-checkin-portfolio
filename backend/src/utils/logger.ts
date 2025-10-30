/**
 * @fileoverview Logging utility for Foodbank Check-In and Appointment System backend API
 * 
 * This module provides centralized logging functionality with structured
 * console output. It handles different log levels and provides consistent
 * logging across the entire backend application.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link https://github.com/winstonjs/winston} Winston logging library
 */

export const logger = {
  info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta || ''),
  warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta || ''),
  error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta || ''),
  debug: (message: string, meta?: any) => console.debug(`[DEBUG] ${message}`, meta || ''),
};
