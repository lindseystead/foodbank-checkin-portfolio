/**
 * @fileoverview Appointment type definitions for Foodbank Check-In and Appointment System backend API
 * 
 * This module defines TypeScript interfaces and types specific to appointment
 * scheduling and management. It ensures type safety for appointment data,
 * scheduling operations, and related functionality.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./index.ts} Main type definitions
 */

export interface Appointment {
  id?: string;
  clientId: string;
  firstName?: string;
  lastName?: string;
  status: 'Pending' | 'Booked' | 'Completed' | 'Cancelled';
  pickUpDate: string;
  pickUpTime?: string;
  pickUpISO?: string;
  location?: string;
  quantity?: number;
  provisions?: string;
  householdSize?: number;
  dietaryConsiderations?: string;
  itemsProvided?: string;
  adults?: number;
  seniors?: number;
  children?: number;
  childrensAges?: string; 
  email?: string;
  phoneNumber?: string;
  phoneDigits?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Additional fields for CSV processing
  fullName?: string;
  normalizedLastName?: string;
  normalizedFirstName?: string;
}

export interface AppointmentLookupResult {
  success: boolean;
  data?: Appointment | null;
  error?: string;
}

export interface ClientLookupResult {
  success: boolean;
  data?: {
    client: any;
    appointment: any | null;
  };
  error?: string;
}
