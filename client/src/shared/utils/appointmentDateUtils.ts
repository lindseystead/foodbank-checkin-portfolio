/**
 * @fileoverview Centralized appointment date/time parsing utilities
 *
 * Consolidates the multi-strategy date parsing logic that was previously
 * duplicated across SpecialRequests.tsx and AppointmentDetails.tsx.
 *
 * Handles three data shapes returned by the backend:
 *  1. `pickUpTime` (HH:MM) + `pickUpDate` (YYYY-MM-DD or legacy "YYYY-MM-DD @ H:MM AM")
 *  2. `appointmentTime` (ISO 8601 string)
 *  3. Fallback to current date/time
 *
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

import type { CheckInSession } from '../types/CheckInResponse';

export interface ParsedAppointmentDateTime {
  /** Human-readable time, e.g. "9:00 AM" */
  time: string;
  /** Locale-formatted date, e.g. "Monday, October 27" */
  date: string;
}

/**
 * Convert 24-hour HH:MM time string to 12-hour format with AM/PM.
 *
 * @example formatTime24to12('14:30') // '2:30 PM'
 * @example formatTime24to12('09:00') // '9:00 AM'
 */
export function formatTime24to12(timeStr: string): string {
  if (!timeStr) return '10:00 AM';
  const [hours, minutes] = timeStr.split(':');
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Parse a date string that may come in several formats:
 *  - "YYYY-MM-DD"
 *  - "YYYY-MM-DD @ H:MM AM" (legacy)
 *  - Generic parseable string
 *
 * Always constructs the Date at noon UTC from year/month/day so that
 * subsequent timezone-aware formatting never crosses a day boundary.
 */
function parseDateString(dateStr: string): Date {
  // YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12));
  }
  // Legacy "YYYY-MM-DD @ H:MM AM" format
  if (dateStr.includes(' @ ')) {
    const datePart = dateStr.split(' @ ')[0];
    const [year, month, day] = datePart.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12));
  }
  // Fallback
  return new Date(dateStr);
}

/**
 * Parse appointment date/time from a CheckInSession object.
 *
 * Uses a 3-strategy approach:
 *  1. If `pickUpTime` exists — parse it directly (most reliable, avoids TZ issues)
 *  2. Else if `appointmentTime` exists — regex-extract from ISO string
 *  3. Else — fall back to current date/time
 *
 * @param session  The check-in session data (from sessionStorage)
 * @param locale   Browser locale string, e.g. "en-US"
 * @param tenantTz IANA timezone, e.g. "America/Vancouver" (used only in fallback paths)
 */
export function parseAppointmentDateTime(
  session: CheckInSession,
  locale: string,
  tenantTz: string,
): ParsedAppointmentDateTime {
  // Strategy 1: pickUpTime (HH:MM format) — most reliable
  if (session.pickUpTime) {
    const time = formatTime24to12(session.pickUpTime);

    let dateObj: Date;
    if (session.pickUpDate) {
      dateObj = parseDateString(session.pickUpDate);
    } else if (session.appointmentTime) {
      const match = session.appointmentTime.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const [, year, month, day] = match.map(Number);
        dateObj = new Date(Date.UTC(year, month - 1, day, 12));
      } else {
        dateObj = new Date(session.appointmentTime);
      }
    } else {
      dateObj = new Date();
    }

    const date = dateObj.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: tenantTz,
    });

    return { time, date };
  }

  // Strategy 2: appointmentTime ISO string
  if (session.appointmentTime) {
    const match = session.appointmentTime.match(
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
    );

    if (match) {
      const [, year, month, day, hour, minute] = match.map(Number);
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const time = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
      const dateObj = new Date(Date.UTC(year, month - 1, day, 12));
      const date = dateObj.toLocaleDateString(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: tenantTz,
      });
      return { time, date };
    }

    // Sub-fallback: let the browser parse (uses timezone)
    const appointmentDate = new Date(session.appointmentTime);
    return {
      time: appointmentDate.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: tenantTz,
      }),
      date: appointmentDate.toLocaleDateString(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: tenantTz,
      }),
    };
  }

  // Strategy 3: fallback to now
  const now = new Date();
  return {
    time: now.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tenantTz,
    }),
    date: now.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: tenantTz,
    }),
  };
}
