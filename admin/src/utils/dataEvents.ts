/**
 * @fileoverview Shared real-time event channel for the admin panel.
 *
 * Components that mutate data emit one of these events, and components
 * that display data subscribe. This keeps the dashboard live across
 * tabs / panes without each component reinventing its own listener.
 *
 * Used by:
 *   • CSVUploader  → emits `data:csvImported` after a successful upload
 *   • Kiosk check-in completion → server-side; admin picks up via polling +
 *                                 the dataVersion bump in /api/status/day
 *   • Help-request submission   → admin's HelpRequestsTable polls at 30s
 *
 * Subscribers (call `useDataEvent(name, handler)` or use the listener
 * functions directly): CSVStatus, CSVDataViewer, ClientLookup, Sidebar,
 * CheckInAnalyticsChart.
 */

import { useEffect } from 'react';

export type DataEventName =
  | 'data:csvImported'      // CSV upload completed successfully
  | 'data:dataVersionChanged' // tenant data version bumped (any source)
  | 'data:appointmentUpdated'; // a single appointment changed status

interface EventDetailMap {
  'data:csvImported': { count: number };
  'data:dataVersionChanged': { dataVersion: string | number };
  'data:appointmentUpdated': { id: string };
}

export const emitDataEvent = <K extends DataEventName>(
  name: K,
  detail: EventDetailMap[K],
): void => {
  // Backwards compatibility: also dispatch the legacy un-namespaced events
  // until all listeners are migrated to the new names.
  if (name === 'data:csvImported') {
    window.dispatchEvent(new CustomEvent('csvDataImported', { detail }));
  }
  if (name === 'data:dataVersionChanged') {
    window.dispatchEvent(new CustomEvent('dataVersionChanged', { detail }));
  }
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

export const onDataEvent = <K extends DataEventName>(
  name: K,
  handler: (detail: EventDetailMap[K]) => void,
): (() => void) => {
  const wrapped = (e: Event) => handler((e as CustomEvent).detail);
  window.addEventListener(name, wrapped);
  // Also listen on the legacy event names so existing emitters still work.
  if (name === 'data:csvImported') window.addEventListener('csvDataImported', wrapped);
  if (name === 'data:dataVersionChanged') window.addEventListener('dataVersionChanged', wrapped);
  return () => {
    window.removeEventListener(name, wrapped);
    if (name === 'data:csvImported') window.removeEventListener('csvDataImported', wrapped);
    if (name === 'data:dataVersionChanged') window.removeEventListener('dataVersionChanged', wrapped);
  };
};

/** React hook wrapper. Auto-cleans on unmount. */
export const useDataEvent = <K extends DataEventName>(
  name: K,
  handler: (detail: EventDetailMap[K]) => void,
): void => {
  useEffect(() => {
    const off = onDataEvent(name, handler);
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);
};
