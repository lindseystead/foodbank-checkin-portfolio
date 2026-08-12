/**
 * @fileoverview Tenant-timezone-aware time helpers.
 *
 * Single source of truth for "what time is it for *this tenant*".
 * Wraps `formatToLocalTime` with the tenant's `timezone` from context,
 * so all admin components render times consistently — even when the
 * admin user's browser is in a different timezone.
 *
 * Usage:
 *   const { formatTime, formatDate, formatDateTime, tz } = useTenantTime();
 *   <Text>{formatTime(record.appointmentAt)}</Text>
 */

import { useMemo } from 'react';
import { useTenant } from '../contexts/TenantContext';
import {
  formatToLocalTime,
  formatToLocalTimeOnly,
  formatToLocalDateOnly,
} from './timeFormatter';

const FALLBACK_TZ = 'America/Vancouver';

export const useTenantTime = () => {
  const { tenant } = useTenant();
  const tz = tenant?.timezone || FALLBACK_TZ;

  return useMemo(
    () => ({
      tz,
      /** Full date + time, e.g. "May 5, 2026, 4:08 PM" */
      formatDateTime: (d: string | Date | null | undefined) =>
        d ? formatToLocalTime(d, tz) : '—',
      /** Time only, e.g. "4:08 PM" */
      formatTime: (d: string | Date | null | undefined) =>
        d ? formatToLocalTimeOnly(d, tz) : '—',
      /** Date only, e.g. "May 5, 2026" */
      formatDate: (d: string | Date | null | undefined) =>
        d ? formatToLocalDateOnly(d, tz) : '—',
      /** "Now" in tenant tz */
      now: () =>
        new Date().toLocaleString('en-US', {
          timeZone: tz,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
    }),
    [tz],
  );
};
