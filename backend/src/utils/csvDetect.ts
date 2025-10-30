/**
 * @fileoverview CSV detection utilities for Foodbank Check-In and Appointment System backend API
 * 
 * This module provides CSV file format detection and validation functionality.
 * It handles file type checking, format validation, and ensures proper
 * CSV structure for data import operations.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../services/csvProcessor.ts} CSV processing service
 */

export const normalizeString = (str: string): string => {
  return str.toLowerCase().trim();
};
