/**
 * @fileoverview Centralized sessionStorage access for check-in flow
 *
 * Replaces the scattered `JSON.parse(sessionStorage.getItem(...))` calls
 * across all 4 check-in pages (InitialCheckIn, SpecialRequests,
 * AppointmentDetails, Confirmation) and the Landing page.
 *
 * Provides typed getters, setters, and a `clearSession` method that
 * removes all three session keys at once.
 *
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

import { useCallback, useMemo } from 'react';
import type { CheckInSession } from '../types/CheckInResponse';

// ---- Session storage keys (single source of truth) ----
const KEYS = {
  checkIn: 'checkInInfo',
  specialRequests: 'specialRequestsData',
  appointment: 'appointmentData',
} as const;

// ---- Payload types ----

export interface SpecialRequestPayload {
  checkInId?: string;
  clientId?: string;
  dietaryRestrictions?: string[];
  allergies?: string;
  unwantedFoods?: string;
  additionalInfo?: string;
  hasMobilityIssues?: boolean;
  diaperSize?: string;
  submittedAt?: string;
}

export interface AppointmentPayload {
  date?: string;
  formattedDate?: string;
  time?: string;
  notificationPreference?: string;
  email?: string;
  phone?: string;
  phoneCarrier?: string;
}

// ---- Helpers (pure, no hooks) ----

function safeGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

// ---- Hook ----

export function useCheckInSession() {
  // --- Getters (stable callbacks) ---

  const getCheckInInfo = useCallback(
    (): CheckInSession | null => safeGet<CheckInSession>(KEYS.checkIn),
    [],
  );

  const getSpecialRequests = useCallback(
    (): SpecialRequestPayload | null => safeGet<SpecialRequestPayload>(KEYS.specialRequests),
    [],
  );

  const getAppointment = useCallback(
    (): AppointmentPayload | null => safeGet<AppointmentPayload>(KEYS.appointment),
    [],
  );

  // --- Setters ---

  const setCheckInInfo = useCallback((data: CheckInSession): void => {
    safeSet(KEYS.checkIn, data);
  }, []);

  const setSpecialRequests = useCallback((data: SpecialRequestPayload): void => {
    safeSet(KEYS.specialRequests, data);
  }, []);

  const setAppointment = useCallback((data: AppointmentPayload): void => {
    safeSet(KEYS.appointment, data);
  }, []);

  /** Merge partial updates into the existing checkInInfo object. */
  const updateCheckInInfo = useCallback((partial: Partial<CheckInSession>): void => {
    const current = safeGet<CheckInSession>(KEYS.checkIn) || {};
    safeSet(KEYS.checkIn, { ...current, ...partial });
  }, []);

  // --- Clear ---

  const clearSession = useCallback((): void => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(KEYS.checkIn);
    window.sessionStorage.removeItem(KEYS.specialRequests);
    window.sessionStorage.removeItem(KEYS.appointment);
  }, []);

  return useMemo(
    () => ({
      getCheckInInfo,
      getSpecialRequests,
      getAppointment,
      setCheckInInfo,
      setSpecialRequests,
      setAppointment,
      updateCheckInInfo,
      clearSession,
    }),
    [
      getCheckInInfo,
      getSpecialRequests,
      getAppointment,
      setCheckInInfo,
      setSpecialRequests,
      setAppointment,
      updateCheckInInfo,
      clearSession,
    ],
  );
}
