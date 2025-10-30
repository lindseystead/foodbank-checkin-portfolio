/**
 * @fileoverview Type definitions for check-in response data in Foodbank Check-In and Appointment System client application
 * 
 * This module defines TypeScript interfaces and types for handling check-in responses
 * from the backend API. It ensures type safety for client-side data handling and
 * provides clear contracts for API communication.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../lib/checkInService.ts} Check-in service implementation
 */

export interface CheckInResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string | { message: string; code?: string };
}

export interface CheckInFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  appointmentId?: string;
  specialRequests?: string[];
}
