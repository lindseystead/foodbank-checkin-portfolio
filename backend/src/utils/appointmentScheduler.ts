/**
 * @fileoverview Appointment scheduling utilities for Foodbank Check-In and Appointment System backend API
 * 
 * This module provides appointment scheduling logic and time slot management
 * for the food bank system. It handles appointment creation, time slot
 * allocation, and scheduling conflict resolution.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../stores/unifiedStore.ts} Data store for appointments
 */

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const VANCOUVER_TZ = 'America/Vancouver';

// Valid appointment times (matching CSV data exactly)
const VALID_TIMES = [
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15',
  '12:00', '12:15', '12:30', '12:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45'
];

// Valid weekdays (Monday = 1, Friday = 5)
const VALID_WEEKDAYS = [1, 2, 3, 4, 5];

// Simplified approach: Calculate statutory holidays dynamically
// Only hardcode dates that don't change year to year

/**
 * Check if a date is a statutory holiday
 * BC statutory holidays: New Year, Family Day, Good Friday, Victoria Day, Canada Day, 
 * BC Day, Labour Day, Thanksgiving, Remembrance Day, Christmas, Boxing Day
 * 
 * Note: Food bank doesn't operate on holidays - clients get next business day
 */
function isStatutoryHoliday(date: dayjs.Dayjs): boolean {
  const month = date.month() + 1; // dayjs months are 0-based (0 = January)
  const day = date.date();
  const weekDay = date.day(); // 0=Sunday, 1=Monday, etc.
  
  // Fixed date holidays
  // New Year's Day (January 1)
  if (month === 1 && day === 1) return true;
  
  // Family Day (3rd Monday in February) - BC specific
  if (month === 2 && weekDay === 1 && day >= 8 && day <= 14) return true;
  
  // Good Friday - Calculate using Easter date
  // This one's tricky since Easter moves each year
  const year = date.year();
  const easterDate = calculateEaster(year);
  const goodFridayDate = easterDate.subtract(2, 'day');
  
  if (date.format('YYYY-MM-DD') === goodFridayDate.format('YYYY-MM-DD')) {
    return true;
  }
  
  // Victoria Day (last Monday before May 25)
  if (month === 5 && weekDay === 1 && day >= 18 && day <= 24) return true;
  
  // Canada Day (July 1)
  if (month === 7 && day === 1) return true;
  
  // BC Day (first Monday in August) - BC specific
  if (month === 8 && weekDay === 1 && day >= 1 && day <= 7) return true;
  
  // Labour Day (first Monday in September)
  if (month === 9 && weekDay === 1 && day >= 1 && day <= 7) return true;
  
  // Thanksgiving (second Monday in October)
  if (month === 10 && weekDay === 1 && day >= 8 && day <= 14) return true;
  
  // Remembrance Day (November 11)
  if (month === 11 && day === 11) return true;
  
  // Christmas (December 25)
  if (month === 12 && day === 25) return true;
  
  // Boxing Day (December 26)
  if (month === 12 && day === 26) return true;
  
  return false;
}

/**
 * Calculate Easter date using Alex's algorithm
 */
function calculateEaster(year: number): dayjs.Dayjs {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return dayjs(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
}

/**
 * Calculate the next appointment date (21 days from today, adjusted for weekdays and holidays)
 * If originalAppointment is provided, preserves the same weekday (e.g., if original is Saturday, next is Saturday)
 * 
 * The 21-day rule is a food bank policy - clients can come back every 3 weeks
 */
export function calculateNextAppointmentDate(originalAppointment?: any): string {
  const today = dayjs().tz(VANCOUVER_TZ);
  let nextDate = today.add(21, 'days');
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loops (should never hit this)
  
  // Determine valid weekdays based on original appointment
  // If original is Saturday (6), allow Saturdays for next appointment
  // This is important - some clients have Saturday-only schedules
  let validWeekdays = VALID_WEEKDAYS; // Default: Monday-Friday
  if (originalAppointment && originalAppointment.pickUpISO) {
    const originalDate = dayjs(originalAppointment.pickUpISO);
    const originalDay = originalDate.day(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    if (originalDay === 6) { // Saturday
      validWeekdays = [1, 2, 3, 4, 5, 6]; // Allow weekdays + Saturday
    }
  }
  
  // Keep moving forward until we hit a valid weekday and not a holiday
  // Skip weekends and BC statutory holidays
  while ((!validWeekdays.includes(nextDate.day()) || isStatutoryHoliday(nextDate)) && attempts < maxAttempts) {
    nextDate = nextDate.add(1, 'day');
    attempts++;
  }
  
  if (attempts >= maxAttempts) {
    console.warn(`Warning: Could not find valid appointment date after ${maxAttempts} attempts. Using fallback.`);
    // Fallback: just find next valid weekday
    while (!validWeekdays.includes(nextDate.day())) {
      nextDate = nextDate.add(1, 'day');
    }
  }
  
  const finalDate = nextDate.format('YYYY-MM-DD');
  
  return finalDate;
}

/**
 * Get the next valid appointment time based on the original appointment
 */
export function getNextValidTime(originalAppointment: any): string {
  // Extract time from original appointment's pickUpISO or pickUpTime
  let originalTime = originalAppointment.pickUpTime;
  
  // If no pickUpTime, extract from pickUpISO
  if (!originalTime && originalAppointment.pickUpISO) {
    const date = new Date(originalAppointment.pickUpISO);
    originalTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
  
  // If still no time, default to 10:00
  if (!originalTime) {
    return '10:00';
  }
  
  // Extract hours and minutes from time string
  const timeMatch = originalTime.match(/(\d{1,2}):(\d{2})/);
  if (!timeMatch) {
    return '10:00';
  }
  
  const [, hours, minutes] = timeMatch;
  const originalMinutes = parseInt(hours) * 60 + parseInt(minutes);
  
  // Find the closest valid time
  let closestTime = VALID_TIMES[0];
  let minDifference = Math.abs(getTimeInMinutes(VALID_TIMES[0]) - originalMinutes);
  
  for (const time of VALID_TIMES) {
    const difference = Math.abs(getTimeInMinutes(time) - originalMinutes);
    if (difference < minDifference) {
      minDifference = difference;
      closestTime = time;
    }
  }
  
  return closestTime;
}

/**
 * Convert time string to minutes for comparison
 */
function getTimeInMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Generate a unique ticket number
 */
export function generateTicketNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `T${timestamp.slice(-6)}${random}`;
}

/**
 * Create a new appointment object for the next visit
 */
export function createNextAppointment(
  clientId: string,
  clientData: any,
  originalAppointment: any
): any {
  // Pass original appointment to preserve weekday (e.g., Saturday appointments)
  const nextDate = calculateNextAppointmentDate(originalAppointment);
  const nextTime = getNextValidTime(originalAppointment);
  const nextISO = dayjs.tz(`${nextDate}T${nextTime}`, VANCOUVER_TZ).toISOString();
  const ticketNumber = generateTicketNumber();
  
  return {
    id: `auto-${Date.now()}-${clientId}`,
    clientId: clientId,
    firstName: clientData.firstName || originalAppointment.firstName,
    lastName: clientData.lastName || originalAppointment.lastName,
    status: 'Pending',
    pickUpDate: nextDate,
    pickUpTime: nextTime,
    pickUpISO: nextISO,
    dietaryConsiderations: originalAppointment.dietaryConsiderations || 'None',
    itemsProvided: originalAppointment.itemsProvided || 'Standard',
    adults: originalAppointment.adults || 1,
    seniors: originalAppointment.seniors || 0,
    children: originalAppointment.children || 0,
    childrenAges: originalAppointment.childrenAges || '',
    email: clientData.email || originalAppointment.email || '',
    phoneNumber: clientData.phoneNumber || originalAppointment.phoneNumber || '',
    phoneDigits: clientData.phoneDigits || originalAppointment.phoneDigits || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Mark as auto-generated
    isAutoGenerated: true,
    generatedFrom: originalAppointment.id,
    generatedAt: new Date().toISOString(),
    // Add ticket number for printing
    ticketNumber: ticketNumber,
    // Add linking fields for easier matching
    fullName: `${clientData.firstName || originalAppointment.firstName} ${clientData.lastName || originalAppointment.lastName}`.trim(),
    normalizedLastName: (clientData.lastName || originalAppointment.lastName || '').toLowerCase().trim(),
    normalizedFirstName: (clientData.firstName || originalAppointment.firstName || '').toLowerCase().trim()
  };
}

/**
 * Get all valid appointment times
 * Kept for potential admin features
 */
export function getValidTimes(): string[] {
  return [...VALID_TIMES];
}

/**
 * Check if a time is valid  
 * Kept for potential admin features
 */
export function isValidTime(time: string): boolean {
  return VALID_TIMES.includes(time);
}

/**
 * Check if a date is a valid weekday
 * Kept for potential admin features
 */
export function isValidWeekday(date: string): boolean {
  const day = dayjs.tz(date, VANCOUVER_TZ).day();
  return VALID_WEEKDAYS.includes(day);
}

/**
 * Check if a date is a valid appointment date (weekday and not a holiday)
 * Kept for potential admin features
 */
export function isValidAppointmentDate(date: string): boolean {
  const dayjsDate = dayjs.tz(date, VANCOUVER_TZ);
  return isValidWeekday(date) && !isStatutoryHoliday(dayjsDate);
}

/**
 * Get the next valid appointment date from a given date
 * Kept for potential admin features
 */
export function getNextValidAppointmentDate(fromDate: string): string {
  let nextDate = dayjs.tz(fromDate, VANCOUVER_TZ);
  let attempts = 0;
  const maxAttempts = 10;
  
  while ((!VALID_WEEKDAYS.includes(nextDate.day()) || isStatutoryHoliday(nextDate)) && attempts < maxAttempts) {
    nextDate = nextDate.add(1, 'day');
    attempts++;
  }
  
  if (attempts >= maxAttempts) {
    console.warn(`Warning: Could not find valid appointment date after ${maxAttempts} attempts from ${fromDate}`);
  }
  
  return nextDate.format('YYYY-MM-DD');
}
