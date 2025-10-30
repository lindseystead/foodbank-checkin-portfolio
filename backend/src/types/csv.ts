/**
 * @fileoverview CSV type definitions for Foodbank Check-In and Appointment System backend API
 * 
 * This module defines TypeScript interfaces and types specific to CSV
 * file processing and data import operations. It ensures type safety
 * for CSV parsing, validation, and data transformation.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./index.ts} Main type definitions
 */

export interface CSVUploadResult {
  success: boolean;
  kind: string;
  count: number;
  expiresAt: string;
  error?: string;
}

export interface DayStatus {
  today: string;
  data: {
    present: boolean;
    count: number;
    expiresAt?: string;
  };
}

export interface CSVValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  detectedFormat?: string;
}
