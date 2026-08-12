/**
 * @fileoverview Data hooks for coordinator/director volunteer management.
 *
 * Wraps the authenticated admin volunteer + shift APIs:
 *   - GET    /admin/t/volunteers            (roster)
 *   - PATCH  /admin/t/volunteers/:id/approve
 *   - PATCH  /admin/t/volunteers/:id/reject
 *   - GET    /admin/t/shifts/shifts         (shift list)
 *   - POST   /admin/t/shifts/shifts         (create shift)
 *   - PATCH  /admin/t/shifts/shifts/:id     (update shift)
 *   - DELETE /admin/t/shifts/shifts/:id     (cancel shift)
 *
 * Uses the shared `api()` client (auto token + tenant) and the same
 * fetch/error conventions as the rest of the admin app.
 */

import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { logger } from '../utils/logger';

export interface Volunteer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  status: 'pending' | 'approved' | 'inactive' | 'suspended' | 'rejected';
  created_at: string;
}

export interface Shift {
  id: string;
  position: string;
  location?: string | null;
  shift_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  status: 'open' | 'full' | 'cancelled' | 'completed';
  assigned_count?: number;
}

export interface NewShiftInput {
  position: string;
  location?: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

async function readJson(response: Response): Promise<any> {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Roster
// ---------------------------------------------------------------------------

export function useVolunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteers = useCallback(async () => {
    try {
      const response = await api('/admin/t/volunteers?limit=100');
      if (!response.ok) throw new Error(`Failed to fetch volunteers: ${response.status}`);
      const data = await readJson(response);
      if (data.success && Array.isArray(data.data)) {
        setVolunteers(data.data);
        setError(null);
      }
    } catch (err: any) {
      if (err?.message !== 'API_NOT_CONFIGURED') {
        logger.error('Error fetching volunteers:', err);
        setError('Failed to load volunteers');
      } else {
        setVolunteers([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approve = useCallback(async (id: string, notes?: string): Promise<{ ok: boolean; error?: string; loginEmail?: string; tempPassword?: string }> => {
    try {
      const response = await api(`/admin/t/volunteers/${id}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({ notes }),
      });
      const data = await readJson(response);
      if (!response.ok) return { ok: false, error: data.error || 'Approval failed' };
      await fetchVolunteers();
      return { ok: true, loginEmail: data.loginEmail, tempPassword: data.tempPassword };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Approval failed' };
    }
  }, [fetchVolunteers]);

  const reject = useCallback(async (id: string, reason: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const response = await api(`/admin/t/volunteers/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
      const data = await readJson(response);
      if (!response.ok) return { ok: false, error: data.error || 'Rejection failed' };
      await fetchVolunteers();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Rejection failed' };
    }
  }, [fetchVolunteers]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  return { volunteers, isLoading, error, refresh: fetchVolunteers, approve, reject };
}

// ---------------------------------------------------------------------------
// Shifts
// ---------------------------------------------------------------------------

export function useShifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShifts = useCallback(async () => {
    try {
      const response = await api('/admin/t/shifts/shifts?limit=100');
      if (!response.ok) throw new Error(`Failed to fetch shifts: ${response.status}`);
      const data = await readJson(response);
      if (data.success && Array.isArray(data.data)) {
        setShifts(data.data);
        setError(null);
      }
    } catch (err: any) {
      if (err?.message !== 'API_NOT_CONFIGURED') {
        logger.error('Error fetching shifts:', err);
        setError('Failed to load shifts');
      } else {
        setShifts([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createShift = useCallback(async (input: NewShiftInput): Promise<{ ok: boolean; error?: string }> => {
    try {
      const response = await api('/admin/t/shifts/shifts', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      const data = await readJson(response);
      if (!response.ok) return { ok: false, error: data.error || 'Failed to create shift' };
      await fetchShifts();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Failed to create shift' };
    }
  }, [fetchShifts]);

  const cancelShift = useCallback(async (id: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const response = await api(`/admin/t/shifts/shifts/${id}`, { method: 'DELETE' });
      const data = await readJson(response);
      if (!response.ok) return { ok: false, error: data.error || 'Failed to cancel shift' };
      await fetchShifts();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Failed to cancel shift' };
    }
  }, [fetchShifts]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  return { shifts, isLoading, error, refresh: fetchShifts, createShift, cancelShift };
}
