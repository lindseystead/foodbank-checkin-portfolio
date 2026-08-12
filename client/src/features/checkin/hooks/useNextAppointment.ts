/**
 * @fileoverview Hook for loading and refreshing next appointment details.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../../shared/lib/api';
import { logger } from '../../../utils/logger';

export interface NextAppointment {
  date: string;
  time: string;
  formattedDate: string;
}

interface UseNextAppointmentOptions {
  checkInId?: string | null;
  enablePolling?: boolean;
  pollIntervalMs?: number;
  /** IANA timezone for the tenant, e.g. "America/Vancouver". Controls display formatting. */
  tenantTz?: string;
}

const DEFAULT_TENANT_TZ = 'America/Vancouver';

const formatTime = (timeStr?: string): string => {
  if (!timeStr) return '10:00 AM';
  const [hours, minutes] = timeStr.split(':');
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
};

const buildNextAppointment = (
  dateValue: string,
  timeValue: string | undefined,
  tenantTz: string,
): NextAppointment => {
  const nextDate = new Date(dateValue);
  return {
    date: dateValue,
    time: formatTime(timeValue || '10:00'),
    formattedDate: nextDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: tenantTz,
    }),
  };
};

const getFromSessionStorage = (tenantTz: string): NextAppointment | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem('checkInInfo');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.nextAppointmentDate) return null;
    return buildNextAppointment(parsed.nextAppointmentDate, parsed.nextAppointmentTime || '10:00', tenantTz);
  } catch {
    return null;
  }
};

export const useNextAppointment = ({
  checkInId,
  enablePolling = false,
  pollIntervalMs = 30000,
  tenantTz = DEFAULT_TENANT_TZ,
}: UseNextAppointmentOptions) => {
  const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refreshNextAppointment = useCallback(async (overrideCheckInId?: string) => {
    const requestId = ++requestIdRef.current;
    const effectiveId = overrideCheckInId ?? checkInId;
    if (effectiveId) {
      try {
        const response = await api(`/checkin/${effectiveId}/summary`);
        const data = await response.json();
        if (!isMountedRef.current || requestId !== requestIdRef.current) return;
        if (data.success && data.data) {
          const checkInRecord = data.data;
          const appointmentDate = checkInRecord.nextAppointmentISO
            ? checkInRecord.nextAppointmentISO
            : checkInRecord.nextAppointmentDate;
          if (appointmentDate) {
            const built = buildNextAppointment(
              checkInRecord.nextAppointmentDate || appointmentDate,
              checkInRecord.nextAppointmentTime || '10:00',
              tenantTz
            );
            setNextAppointment(built);
            return;
          }
        }
      } catch (error) {
        logger.error('Failed to fetch next appointment:', error);
      }
    }

    if (!isMountedRef.current || requestId !== requestIdRef.current) return;
    const fallback = getFromSessionStorage(tenantTz);
    if (fallback) {
      setNextAppointment(fallback);
    }
  }, [checkInId, tenantTz]);

  const pollingEnabled = useMemo(() => Boolean(enablePolling), [enablePolling]);

  useEffect(() => {
    refreshNextAppointment();
  }, [refreshNextAppointment]);

  useEffect(() => {
    if (!pollingEnabled) return undefined;
    let interval: number | null = null;

    const startPolling = () => {
      if (interval) clearInterval(interval);
      interval = window.setInterval(() => {
        if (!document.hidden) {
          refreshNextAppointment();
        }
      }, pollIntervalMs);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      } else {
        refreshNextAppointment();
        startPolling();
      }
    };

    const timeoutId = window.setTimeout(() => {
      if (!document.hidden) {
        startPolling();
      }
    }, 1000);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(timeoutId);
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pollIntervalMs, pollingEnabled, refreshNextAppointment]);

  return { nextAppointment, refreshNextAppointment, setNextAppointment };
};
