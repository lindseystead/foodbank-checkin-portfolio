/**
 * @fileoverview Hook that fetches today's appointments from the admin API,
 * with automatic polling via `usePolling`. Consolidates the identical
 * fetch-and-filter logic previously duplicated in DashboardPage,
 * CheckInsPage, and CheckInAnalyticsChart.
 *
 * @license Proprietary
 */

import { useState, useCallback } from 'react';
import { CheckInRecord } from '../types/checkIn';
import { api } from '../lib/api';
import { logger } from '../utils/logger';
import { usePolling } from './usePolling';
import { useTenantTime } from '../utils/useTenantTime';

export interface UseTodayAppointmentsOptions {
  /** Polling interval in milliseconds. Default 30 000 (30 s). */
  pollIntervalMs?: number;
  /** Optional hour window filter, e.g. { start: 8, end: 20 }. */
  filterHours?: { start: number; end: number };
}

export interface UseTodayAppointmentsReturn {
  appointments: CheckInRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastRefresh: Date;
}

export function useTodayAppointments(
  options: UseTodayAppointmentsOptions = {},
): UseTodayAppointmentsReturn {
  const { pollIntervalMs = 30_000, filterHours } = options;
  const { tz } = useTenantTime();

  const [appointments, setAppointments] = useState<CheckInRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await api('/admin/t/checkin/appointments');

      if (!isMountedRef.current) return;

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const records = data.data as CheckInRecord[];
        // The backend endpoint is already scoped to the tenant's current day.
        // Do not re-filter by the browser's local timezone here.
        let filtered = records;

        // Optional hour-window filter
        if (filterHours) {
          filtered = filtered.filter((rec: CheckInRecord) => {
            const iso = (rec as any).pickUpISO || rec.appointmentTime;
            const timeStr = (rec as any).pickUpTime as string | undefined;
            let hour: number | null = null;

            // Prefer the explicit HH:MM value, which is already tenant-local.
            if (typeof timeStr === 'string' && /^\d{2}:\d{2}$/.test(timeStr)) {
              hour = parseInt(timeStr.split(':')[0], 10);
            } else if (iso) {
              const parsed = new Date(iso);
              if (!isNaN(parsed.getTime())) {
                // Hour-of-day is timezone-sensitive: read it in the tenant tz.
                const hh = new Intl.DateTimeFormat('en-CA', {
                  timeZone: tz,
                  hour: '2-digit',
                  hour12: false,
                }).formatToParts(parsed).find((p) => p.type === 'hour')?.value;
                if (hh !== undefined) hour = parseInt(hh, 10) % 24;
              }
            }

            if (hour === null) return false;
            return hour >= filterHours.start && hour < filterHours.end;
          });
        }

        if (isMountedRef.current) {
          setAppointments(filtered);
          setError(null);
        }
      } else {
        if (isMountedRef.current) {
          setAppointments([]);
        }
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;

      if (err?.message === 'API_NOT_CONFIGURED') {
        logger.debug('API not configured - CSV-only mode');
        setError(null);
        setAppointments([]);
      } else if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        logger.debug('Backend server not available for appointments, will retry later');
        // Keep existing data on connection errors
      } else {
        logger.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments');
        setAppointments([]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setLastRefresh(new Date());
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterHours?.start, filterHours?.end, tz]);

  const { isMountedRef } = usePolling({
    fetchFn: fetchAppointments,
    intervalMs: pollIntervalMs,
  });

  return { appointments, isLoading, error, refresh: fetchAppointments, lastRefresh };
}
