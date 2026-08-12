/**
 * @fileoverview Data hook for the volunteer self-service portal.
 *
 * Wraps the authenticated volunteer-self endpoints (all scoped to the logged-in
 * user's own volunteer record on the backend):
 *   GET  /admin/t/me/volunteer
 *   GET  /admin/t/me/volunteer/shifts
 *   GET  /admin/t/me/volunteer/shifts/open
 *   POST /admin/t/me/volunteer/shifts/:id/signup
 *   GET  /admin/t/me/volunteer/hours
 *   GET  /admin/t/me/volunteer/availability
 *   POST /admin/t/me/volunteer/availability
 */

import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { logger } from '../utils/logger';

export interface MyProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  status: string;
}

export interface MyShiftAssignment {
  id: string;
  status: string;
  signed_up_at: string;
  volunteer_shifts: {
    id: string;
    position: string;
    location?: string | null;
    shift_date: string;
    start_time: string;
    end_time: string;
    status: string;
  } | null;
}

export interface OpenShift {
  id: string;
  position: string;
  location?: string | null;
  shift_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  status: string;
}

export interface HoursEntry {
  id: string;
  hoursWorked: string | number;
  dateWorked: string;
  notes?: string | null;
}

export interface AvailabilityWindow {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  available: boolean;
}

async function readJson(response: Response): Promise<any> {
  const text = await response.text();
  try { return text ? JSON.parse(text) : {}; } catch { return {}; }
}

export function useMyVolunteer() {
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [myShifts, setMyShifts] = useState<MyShiftAssignment[]>([]);
  const [openShifts, setOpenShifts] = useState<OpenShift[]>([]);
  const [hours, setHours] = useState<HoursEntry[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [availability, setAvailability] = useState<AvailabilityWindow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const profileRes = await api('/admin/t/me/volunteer');
      if (profileRes.status === 404) {
        setNoProfile(true);
        return;
      }
      const profileJson = await readJson(profileRes);
      if (profileJson.success) setProfile(profileJson.data);

      const [shiftsRes, openRes, hoursRes, availRes] = await Promise.all([
        api('/admin/t/me/volunteer/shifts'),
        api('/admin/t/me/volunteer/shifts/open'),
        api('/admin/t/me/volunteer/hours'),
        api('/admin/t/me/volunteer/availability'),
      ]);

      const shiftsJson = await readJson(shiftsRes);
      if (shiftsJson.success) setMyShifts(shiftsJson.data || []);
      const openJson = await readJson(openRes);
      if (openJson.success) setOpenShifts(openJson.data || []);
      const hoursJson = await readJson(hoursRes);
      if (hoursJson.success) { setHours(hoursJson.entries || []); setTotalHours(hoursJson.totalHours || 0); }
      const availJson = await readJson(availRes);
      if (availJson.success) setAvailability(availJson.data || []);
      setError(null);
    } catch (err: any) {
      if (err?.message !== 'API_NOT_CONFIGURED') {
        logger.error('Error loading volunteer portal:', err);
        setError('Failed to load your volunteer information');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (shiftId: string): Promise<{ ok: boolean; onWaitlist?: boolean; error?: string }> => {
    try {
      const res = await api(`/admin/t/me/volunteer/shifts/${shiftId}/signup`, { method: 'POST' });
      const data = await readJson(res);
      if (!res.ok) return { ok: false, error: data.error || 'Signup failed' };
      await load();
      return { ok: true, onWaitlist: !!data.onWaitlist };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Signup failed' };
    }
  }, [load]);

  const addAvailability = useCallback(async (
    dayOfWeek: number, startTime: string, endTime: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await api('/admin/t/me/volunteer/availability', {
        method: 'POST',
        body: JSON.stringify({ dayOfWeek, startTime, endTime }),
      });
      const data = await readJson(res);
      if (!res.ok) return { ok: false, error: data.error || 'Failed to save availability' };
      await load();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Failed to save availability' };
    }
  }, [load]);

  useEffect(() => { load(); }, [load]);

  return {
    profile, myShifts, openShifts, hours, totalHours, availability,
    isLoading, noProfile, error, refresh: load, signUp, addAvailability,
  };
}
