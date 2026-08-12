/**
 * @fileoverview Shared appointment configuration constants.
 *
 * Single source of truth for valid appointment time slots used across
 * the client application. Must be kept in sync with the backend's
 * appointmentScheduler.ts VALID_TIMES export.
 *
 * @license Proprietary
 */

/** Valid appointment time slots (15-minute intervals within operating hours). */
export const VALID_TIMES: string[] = [
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15',
  '12:00', '12:15', '12:30', '12:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45',
];
