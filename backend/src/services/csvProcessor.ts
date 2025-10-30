/**
 * @fileoverview CSV processing service for Foodbank Check-In and Appointment System backend API
 * 
 * This module provides CSV parsing and processing functionality for bulk
 * appointment data import. It handles CSV file parsing, data validation,
 * and conversion to appointment objects for the food bank system.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../controllers/csvController.ts} CSV controller
 */

import { parse } from 'csv-parse';
import { storeCSVData } from '../stores/unifiedStore';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

export interface CSVProcessingResult {
  success: boolean;
  count: number;
  added: number;
  duplicates: number;
  expiresAt: string;
  error?: string;
  warning?: string;
  csvDate?: string;
  todayDate?: string;
}

export class CSVProcessor {
  /**
   * Process CSV file - SINGLE COMBINED CLIENT AND APPOINTMENT DATA
   */
  static async processCSV(file: Buffer, filename: string): Promise<CSVProcessingResult> {
    try {
      const csvContent = file.toString('utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header and one data row');
      }

      const header = lines[0].toLowerCase();
      
      // Process as single combined CSV
      return await this.processCombinedCSV(csvContent, filename);
    } catch (error: any) {
      console.error(`CSV processing error for ${filename}:`, error.message);
      return {
        success: false,
        count: 0,
        added: 0,
        duplicates: 0,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Process CSV file - just CSV records with pickup times
   */
  private static async processCombinedCSV(csvContent: string, filename: string): Promise<CSVProcessingResult> {
    return new Promise((resolve, reject) => {
      const csvRecords: any[] = [];
      const importId = `csv_${Date.now()}`;
      let csvDate: string | null = null;
      // Use Vancouver timezone for today's date
      let todayDate = dayjs().tz('America/Vancouver').format('YYYY-MM-DD');

      const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true
      });

      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          // Process CSV record (first record debug removed to reduce console noise)
          // Parse the pickup date format: "2025-04-14 @ 9:00 AM" -> ISO
          const pickUpDate = record['Pick Up Date'] || record.pickup_date || record.pick_up_date || record.pickUpDate || record.date;
          let pickUpISO = null;
          let pickUpTime = null; // Extract time in HH:MM format
          
          if (pickUpDate) {
            try {
              // Convert "2025-04-14 @ 9:00 AM" to ISO format
              const dateStr = pickUpDate.replace(' @ ', 'T').replace(' AM', '').replace(' PM', '');
              const [datePart, timePart] = dateStr.split('T');
              const [year, month, day] = datePart.split('-');
              const [hour, minute] = timePart.split(':');
              
              // Convert to 24-hour format if PM
              let hour24 = parseInt(hour);
              if (pickUpDate.includes('PM') && hour24 !== 12) {
                hour24 += 12;
              } else if (pickUpDate.includes('AM') && hour24 === 12) {
                hour24 = 0;
              }
              
              // Store time in HH:MM format for easy reuse (e.g., "09:00", "14:30")
              pickUpTime = `${hour24.toString().padStart(2, '0')}:${minute}`;
              
              // Create proper ISO string representing this date/time in Vancouver
              // We need to account for DST - Vancouver is UTC-7 (PDT) or UTC-8 (PST)
              // For simplicity, use -07:00 offset (PDT which is March-November)
              // The actual timezone offset doesn't matter for date comparisons since we store the date string
              const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour24.toString().padStart(2, '0')}:${minute.padStart(2, '0')}:00-07:00`;
              pickUpISO = isoDate;
              
              
              // Extract CSV date for validation (YYYY-MM-DD format)
              if (!csvDate) {
                csvDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              }
            } catch (e) {
              console.warn('Failed to parse pickup date:', pickUpDate, e);
            }
          }

          // Handle name - try multiple possible column names
          const fullName = record.Name || record.name || record['Full Name'] || record.fullName || record['Client Name'] || record.clientName || record['Name'] || '';
          const nameParts = fullName.trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Normalize phone number - try multiple possible column names
          const phoneNumber = record['Phone Number'] || record.phone || record.phone_number || record['Phone'] || record.Phone || record['Phone #'] || record['Phone#'] || record.phoneNumber || '';
          const phoneDigits = phoneNumber.replace(/\D/g, '');

          // Calculate household size from adults + seniors + children
          const adults = parseInt(record.Adults || record.adults || '0') || 0;
          const seniors = parseInt(record.Seniors || record.seniors || '0') || 0;
          const children = parseInt(record.Children || record.children || '0') || 0;
          const householdSize = adults + seniors + children || 1;

          // Create CSV record with pickup time - Support both current CSV and Link2Feed export formats
          const csvRecord = {
            pickUpISO: pickUpISO,
            pickUpTime: pickUpTime, // Store time as HH:MM format (e.g., "09:00", "14:30")
            pickUpDate: pickUpDate,
            status: 'Pending', // Start as Pending until checked in
            // Location field - Support multiple possible column names for Link2Feed compatibility
            location: record.Location || record.location || record['Food Bank Site'] || record.site || record['Site'] || 'Foodbank Check-In and Appointment System',
            // Program field - Support multiple possible column names for Link2Feed compatibility  
            program: record.Program || record.program || record['Program Name'] || record['Program Type'] || record.programType || 'Food Hamper',
            quantity: 1,
            provisions: record['Items Provided'] || record.items || 'Standard',
            householdSize: householdSize,
            clientId: record['Client #'] || record.clientId || record['Client ID'] || record.client_id || record.clientid || record.id,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            phoneDigits: phoneDigits,
            email: record.Email || record.email || '',
            dietaryConsiderations: record['Dietary Considerations'] || record.dietaryConsiderations || record.dietary || record.dietary_considerations || 'None',
            adults: adults,
            seniors: seniors,
            children: children,
            childrensAges: record["Children's Ages"] || record.children_ages || record['Children Ages'] || '',
            itemsProvided: record['Items Provided'] || record.items || '',
            // Notes field - Support multiple possible column names for Link2Feed compatibility
            notes: record.Notes || record.notes || record['Appointment Notes'] || record.appointmentNotes || record['Staff Notes'] || record.staffNotes || '',
            createdAt: new Date().toISOString(),
            // Add linking fields for easier matching
            fullName: `${firstName} ${lastName}`.trim(),
            normalizedLastName: lastName.toLowerCase().trim(),
            normalizedFirstName: firstName.toLowerCase().trim()
          };

          // Only add if we have essential data
          if (csvRecord.clientId && firstName.trim() && lastName.trim()) {
            csvRecords.push(csvRecord);
          }
        }
      });

      parser.on('error', (error: any) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      });

      parser.on('end', () => {
        try {
          // Store CSV records with deduplication
          const stats = storeCSVData(csvRecords, importId);
          
          // Check if CSV date matches today's date
          let warning: string | undefined;
          if (csvDate && csvDate !== todayDate) {
            // For ANY date mismatch, show error (not just year)
            warning = `ERROR: The CSV file contains appointments for ${csvDate}, but today's date is ${todayDate}. Client check-ins will NOT work with this data. Please upload a CSV file with appointments for today's date (${todayDate}).`;
            console.error(`Date mismatch: CSV date ${csvDate} vs today ${todayDate}`);
          }
          
          // Add warning if duplicates were found
          if (stats.duplicates > 0) {
            const duplicateWarning = `${stats.duplicates} duplicate record(s) were skipped`;
            if (warning) {
              warning = `${duplicateWarning}. ${warning}`;
            } else {
              warning = duplicateWarning;
            }
          }
          
          resolve({
            success: true,
            count: stats.total, // Total records in CSV
            added: stats.added, // New records added
            duplicates: stats.duplicates, // Duplicate records skipped
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
            warning: warning,
            csvDate: csvDate || undefined,
            todayDate: todayDate
          });
        } catch (error: any) {
          reject(new Error(`Failed to store data: ${error.message}`));
        }
      });

      // Start parsing
      parser.write(csvContent);
      parser.end();
    });
  }
}

export default CSVProcessor;