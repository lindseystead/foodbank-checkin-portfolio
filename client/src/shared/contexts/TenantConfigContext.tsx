/**
 * @fileoverview Tenant configuration context for the client kiosk.
 *
 * Fetches public tenant config from `GET /api/t/:slug/config` and provides
 * tenant metadata (name, phone, timezone, branding) to all downstream
 * components. The slug comes from the URL (e.g. `/cofb/checkin`).
 *
 * Falls back to sensible defaults when the config is unavailable so
 * existing single-tenant deployments work with zero changes.
 *
 * @license Proprietary
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getApiBaseUrl, setTenantSlug } from '../config/apiConfig';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TenantConfig {
  name: string;
  timezone: string;
  phone: string;
  branding: Record<string, unknown>;
  operatingHours: { start: number; end: number };
}

/** Default tenant slug used by backwards-compatible non-slug routes. */
export const DEFAULT_TENANT_SLUG = 'cofb';

interface TenantConfigContextType {
  /** The current tenant config, or null while loading. */
  config: TenantConfig | null;
  /** The tenant slug from the URL. */
  slug: string;
  /** True while the initial fetch is in progress. */
  isLoading: boolean;
  /** Convenience: formatted phone for tel: links (digits only). */
  phoneDigits: string;
  /** Convenience: formatted phone for display. */
  phoneDisplay: string;
}

const DEFAULT_CONFIG: TenantConfig = {
  name: 'Food Bank',
  timezone: 'America/Vancouver',
  phone: '',
  branding: {},
  operatingHours: { start: 8, end: 20 },
};

const TenantConfigContext = createContext<TenantConfigContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useTenantConfig = (): TenantConfigContextType => {
  const ctx = useContext(TenantConfigContext);
  if (ctx === undefined) {
    throw new Error('useTenantConfig must be used within a TenantConfigProvider');
  }
  return ctx;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip non-digit characters from a phone string. */
const toDigits = (phone: string): string => phone.replace(/\D/g, '');

/** Format a 10-digit phone as (XXX) XXX-XXXX; pass through others. */
const formatPhone = (phone: string): string => {
  const digits = toDigits(phone);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

/** Build a client route that preserves the active tenant slug. */
export const buildTenantPath = (slug?: string | null, path: string = ''): string => {
  const effectiveSlug = slug || DEFAULT_TENANT_SLUG;
  const normalizedPath = path.trim();

  if (!normalizedPath || normalizedPath === '/') {
    return `/${effectiveSlug}`;
  }

  return `/${effectiveSlug}/${normalizedPath.replace(/^\/+/, '')}`;
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface TenantConfigProviderProps {
  slug: string;
  children: ReactNode;
}

export const TenantConfigProvider: React.FC<TenantConfigProviderProps> = ({ slug, children }) => {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Push slug into API config so all fetch calls are tenant-scoped
    setTenantSlug(slug || null);

    if (!slug) {
      setConfig(DEFAULT_CONFIG);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const base = getApiBaseUrl();
        const response = await fetch(`${base}/t/${slug}/config`, {
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
          throw new Error(`Config fetch failed: ${response.status}`);
        }

        const json = await response.json();

        if (!cancelled && json.success && json.data) {
          setConfig(json.data as TenantConfig);
        }
      } catch {
        // Graceful degradation — use defaults
        if (!cancelled) {
          setConfig(DEFAULT_CONFIG);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchConfig();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const phone = config?.phone || DEFAULT_CONFIG.phone;

  const value: TenantConfigContextType = {
    config,
    slug,
    isLoading,
    phoneDigits: toDigits(phone),
    phoneDisplay: formatPhone(phone),
  };

  return (
    <TenantConfigContext.Provider value={value}>
      {children}
    </TenantConfigContext.Provider>
  );
};
