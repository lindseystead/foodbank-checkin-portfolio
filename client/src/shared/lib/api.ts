/**
 * @fileoverview API service layer for Foodbank Check-In and Appointment System client application
 * 
 * This module provides a centralized API service for communicating with the
 * backend API from the client application. It handles HTTP requests,
 * error handling, and provides methods for check-in operations and
 * data submission.
 * 
 * Best Practices Implemented:
 * - Centralized API configuration for consistency
 * - Environment-based configuration (dev vs production)
 * - Proper error handling in calling components
 * - Rate limiting handled at server level (200 req/15min per IP)
 * 
 * Note: Client app uses one-time API calls (no polling needed).
 * The check-in flow is a single-use process, not a real-time dashboard.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./checkInService.ts} Check-in service implementation
 */

import { getApiBaseUrl, getTenantApiBaseUrl } from '../config/apiConfig';

/** @deprecated Use getApiBaseUrl from apiConfig.ts directly */
export const getApiBase = getApiBaseUrl;

/**
 * Make an API request to the tenant-scoped backend.
 * When a tenant slug is set (via TenantConfigContext), all requests
 * are automatically prefixed with `/api/t/:slug`.
 */
export const api = (path: string, init?: RequestInit) => {
  const API_BASE = getTenantApiBaseUrl();
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  return fetch(url, init);
};
