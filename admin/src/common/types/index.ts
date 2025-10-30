/**
 * @fileoverview Type definitions for Foodbank Check-In and Appointment System admin panel
 * 
 * This module contains TypeScript interfaces and type definitions used throughout
 * the admin panel application. It provides type safety for data structures,
 * API responses, and component props to ensure robust development and maintenance.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../lib/api.ts} API service layer
 */

// Note: User type is imported from @supabase/supabase-js
// No custom User interface needed

export interface AuthState {
  user: any | null; // Using Supabase User type
  isAuthenticated: boolean;
  isLoading: boolean;
}

// CSV Upload Types
export interface CSVUploadStatus {
  id: string;
  filename: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  errors: string[];
  createdAt: string;
  completedAt?: string;
}

export interface CSVFieldMapping {
  sourceField: string;
  targetField: string;
  dataType?: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  transformation?: 'capitalize' | 'lowercase' | 'uppercase' | 'trim';
  fallbackValue?: string;
}

export interface CSVValidationRule {
  field: string;
  type: 'required' | 'format' | 'range' | 'custom';
  message: string;
  validator?: (value: any) => boolean;
}

// Check-in Types - moved to checkIn.ts for better organization
export type { CheckInRecord as CheckIn } from './checkIn';

// Link2Feed Types
export interface Link2FeedConfig {
  baseUrl: string;
  apiKey: string;
  secretKey: string;
  organizationId?: string;
  environment: 'test' | 'staging' | 'live';
}

export interface Link2FeedStatus {
  configured: boolean;
  hasApiKey: boolean;
  hasSecretKey: boolean;
  baseUrl?: string;
  environment: string;
  missing: string[];
}

// Dashboard Types
export interface DashboardStats {
  totalCheckInsToday: number;
  totalClients: number;
  csvUploadsToday: number;
  systemStatus: 'healthy' | 'warning' | 'error';
}

// Quick Actions
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
  colorScheme: string;
  isDisabled?: boolean;
}
