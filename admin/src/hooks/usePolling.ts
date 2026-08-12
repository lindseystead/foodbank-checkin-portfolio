/**
 * @fileoverview Reusable polling hook with Page Visibility API integration.
 *
 * Encapsulates the polling pattern used across admin dashboard components:
 *  - Starts an interval when the browser tab is visible
 *  - Pauses the interval when the tab is hidden
 *  - Fetches immediately when the tab becomes visible again
 *  - Cleans up on unmount
 *  - Optionally supports exponential back-off via `maxConsecutiveErrors`
 *
 * @license Proprietary
 */

import { useEffect, useRef, useCallback } from 'react';

export interface UsePollingOptions {
  /** Async function called on every tick (and on initial mount / tab-visible). */
  fetchFn: () => Promise<void>;
  /** Polling interval in milliseconds. */
  intervalMs: number;
  /** Set to `false` to suspend polling without unmounting. Default `true`. */
  enabled?: boolean;
  /**
   * Optional. When provided the interval callback will NOT fire if the
   * internal `consecutiveErrors` counter reaches this limit. The counter
   * resets to 0 every time `resetErrors()` is called (typically after a
   * successful fetch).
   */
  maxConsecutiveErrors?: number;
  /** Delay (ms) before the very first fetch. Useful to avoid mount-time race conditions. Default 0. */
  initialDelayMs?: number;
}

export interface UsePollingReturn {
  /** Ref that is `true` while the component is mounted. Guard async setState with this. */
  isMountedRef: React.MutableRefObject<boolean>;
  /** Current consecutive-error counter (ref, not state — no re-render). */
  consecutiveErrors: React.MutableRefObject<number>;
  /** Reset the error counter to 0 (call this after a successful fetch). */
  resetErrors: () => void;
  /** Bump the error counter by 1. Returns the new value. */
  incrementErrors: () => number;
}

export function usePolling({
  fetchFn,
  intervalMs,
  enabled = true,
  maxConsecutiveErrors,
  initialDelayMs = 0,
}: UsePollingOptions): UsePollingReturn {
  const isMountedRef = useRef(true);
  const consecutiveErrors = useRef(0);

  const resetErrors = useCallback(() => {
    consecutiveErrors.current = 0;
  }, []);

  const incrementErrors = useCallback(() => {
    consecutiveErrors.current += 1;
    return consecutiveErrors.current;
  }, []);

  // Track mount separately so fetchFn/enabled changes don't leave isMountedRef stuck false
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    let interval: ReturnType<typeof setInterval> | null = null;
    let initialTimeout: ReturnType<typeof setTimeout> | null = null;
    let active = true;

    const shouldPoll = (): boolean => {
      if (!active || !isMountedRef.current) return false;
      if (document.hidden) return false;
      if (maxConsecutiveErrors !== undefined && consecutiveErrors.current >= maxConsecutiveErrors) return false;
      return true;
    };

    const startPolling = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (shouldPoll()) {
          fetchFn();
        }
      }, intervalMs);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible — fetch immediately and restart interval
        if (active && isMountedRef.current) {
          fetchFn();
          startPolling();
        }
      } else {
        // Tab hidden — stop polling
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };

    // Initial fetch (optionally delayed)
    if (initialDelayMs > 0) {
      initialTimeout = setTimeout(() => {
        if (active && isMountedRef.current) fetchFn();
      }, initialDelayMs);
    } else {
      fetchFn();
    }

    // Start interval if tab is visible
    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      active = false;
      if (initialTimeout) clearTimeout(initialTimeout);
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn, intervalMs, enabled]);

  return { isMountedRef, consecutiveErrors, resetErrors, incrementErrors };
}
