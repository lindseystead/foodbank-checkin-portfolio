/**
 * @fileoverview Client type definitions for Foodbank Check-In and Appointment System backend API
 * 
 * This module defines TypeScript interfaces and types specific to client
 * data structures used throughout the food bank system. It ensures type
 * safety for client information, check-in data, and related operations.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./index.ts} Main type definitions
 */

export interface ClientLookupRequest {
  id?: string;
  clientId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneDigits: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
  dietaryConsiderations?: string;
  adults?: number;
  seniors?: number;
  children?: number;
  childrensAges?: string; 
  householdSize?: number;
  itemsProvided?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Additional fields for CSV processing
  fullName?: string;
  normalizedLastName?: string;
  normalizedFirstName?: string;
}

export interface ClientLookupResult {
  success: boolean;
  data?: {
    client: ClientLookupRequest;
    appointment: any | null;
  };
  error?: string;
}
