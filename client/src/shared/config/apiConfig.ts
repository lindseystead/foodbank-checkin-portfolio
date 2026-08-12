/**
 * @fileoverview Centralized API configuration for Foodbank Check-In and Appointment System client
 *
 * This module provides a single source of truth for API base URLs,
 * ensuring consistency across the application and proper environment-based configuration.
 *
 * Multi-tenant support: `setTenantSlug()` is called by TenantConfigContext on
 * mount. Once set, `getTenantApiBaseUrl()` returns a tenant-scoped base such as
 * `http://localhost:3001/api/t/cofb`. Legacy helpers (`getApiBaseUrl`, `getApiUrl`)
 * continue to work unchanged (they point at the global `/api` prefix).
 *
 * @version 2.0.0
 * @since 2025-10-28
 * @license Proprietary - see LICENSE file for details
 */

// ---------------------------------------------------------------------------
// Global (non-scoped) base URL
// ---------------------------------------------------------------------------

export const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Dev mode - use local API
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }

  // Production needs this env var
  throw new Error(
    'VITE_API_BASE_URL environment variable is required in production. ' +
    'Please configure it in your deployment platform (Vercel, AWS, etc.).'
  );
};

// ---------------------------------------------------------------------------
// Tenant-scoped helpers
// ---------------------------------------------------------------------------

let _tenantSlug: string | null = null;

/** Called by TenantConfigContext when the slug is known. */
export const setTenantSlug = (slug: string | null): void => {
  _tenantSlug = slug;
};

/** Returns the current slug (or null). */
export const getTenantSlug = (): string | null => _tenantSlug;

/**
 * Returns a tenant-scoped API base, e.g. `http://localhost:3001/api/t/cofb`.
 * Falls back to the global base if no slug has been set.
 */
export const getTenantApiBaseUrl = (): string => {
  const base = getApiBaseUrl();
  if (_tenantSlug) {
    return `${base}/t/${_tenantSlug}`;
  }
  return base;
};

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------

/** Get help request URL (tenant-scoped when slug is set). */
export const getHelpRequestUrl = (): string => {
  return `${getTenantApiBaseUrl()}/help-requests`;
};

/** Build a full API URL from a relative path (not tenant-scoped). */
export const getApiUrl = (path: string): string => {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};
