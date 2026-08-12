/**
 * @fileoverview Tenant context provider for multi-tenant admin panel.
 *
 * Fetches the authenticated user's tenant info from `GET /api/admin/me/tenant`
 * and provides tenant metadata (id, slug, name, timezone, phone, branding)
 * to all downstream components.
 *
 * Must be rendered **inside** `<AuthProvider>` so that a valid session
 * exists when the API call is made.
 *
 * @license Proprietary
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { api, setCurrentTenantId } from '../lib/api';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TenantInfo {
  id: string;
  slug: string;
  name: string;
  timezone: string;
  phone: string;
  branding: Record<string, unknown>;
  operatingHours: { start: number; end: number };
}

/**
 * Canonical tenant role model (mirrors backend migration 010_fix_role_model).
 *   director > coordinator > staff > volunteer
 *
 * Legacy production schemas (pre-010) still use 'super_admin'/'admin'; we accept
 * both so the panel works against either schema.
 */
export type TenantRole =
  | 'director' | 'coordinator' | 'staff' | 'volunteer'
  | 'super_admin' | 'admin';

/** Roles that are paid staff (everyone except an unpaid volunteer). */
export const PAID_STAFF_ROLES: readonly TenantRole[] =
  ['director', 'coordinator', 'staff', 'super_admin', 'admin'];

/** True for any paid-staff role (i.e. not a volunteer). */
export const isPaidStaffRole = (role: string): boolean => role !== 'volunteer';

interface TenantContextType {
  /** The current tenant object, or null while loading / if not resolved. */
  tenant: TenantInfo | null;
  /** The user's role within the tenant. */
  role: TenantRole;
  /** True when the user is paid staff (director/coordinator/staff). */
  isPaidStaff: boolean;
  /** True while the initial fetch is in progress. */
  isLoading: boolean;
  /** Convenience shorthand for `tenant?.id`. */
  tenantId: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useTenant = (): TenantContextType => {
  const ctx = useContext(TenantContext);
  if (ctx === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return ctx;
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [role, setRole] = useState<TenantRole>('volunteer');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in yet — reset and wait
      setTenant(null);
      setRole('volunteer');
      setIsLoading(false);
      setCurrentTenantId(null);
      return;
    }

    let cancelled = false;

    const fetchTenant = async () => {
      try {
        setIsLoading(true);
        const response = await api('/admin/me/tenant');

        if (!response.ok) {
          throw new Error(`Tenant fetch failed: ${response.status}`);
        }

        const json = await response.json();

        if (!cancelled && json.success && json.data) {
          const t = json.data.tenant as TenantInfo;
          setTenant(t);
          setRole((json.data.role as TenantRole) || 'volunteer');
          // Push tenant ID into the API layer so every request gets X-Tenant-ID
          setCurrentTenantId(t.id);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          // Graceful degradation — admin panel works without tenant context
          const message = err instanceof Error ? err.message : String(err);
          if (message !== 'API_NOT_CONFIGURED') {
            logger.error('Failed to fetch tenant info:', message);
          }
          setTenant(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchTenant();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const value: TenantContextType = {
    tenant,
    role,
    isPaidStaff: isPaidStaffRole(role),
    isLoading,
    tenantId: tenant?.id ?? null,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
