/**
 * @fileoverview Type definitions for Foodbank Check-In and Appointment System backend API
 * 
 * This module contains TypeScript interfaces and type definitions used
 * throughout the backend API. It provides type safety for API responses,
 * request data, and internal data structures.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./client.types.ts} Client-specific types
 * @see {@link ./appointment.types.ts} Appointment-specific types
 */

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  dataVersion?: number;
}
