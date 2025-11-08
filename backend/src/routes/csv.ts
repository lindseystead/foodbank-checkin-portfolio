/**
 * @fileoverview CSV processing routes for Foodbank Check-In and Appointment System backend API
 * 
 * This module handles CSV file uploads and processing for bulk appointment
 * data import. It provides endpoints for uploading CSV files, processing
 * appointment data, and managing bulk operations for the food bank system.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../controllers/csvController.ts} CSV controller implementation
 */

import express from 'express';
import multer from 'multer';
import { getTodayAppointments, getDailyStatus, getAllCheckIns } from '../stores/unifiedStore';
import { CSVProcessor } from '../services/csvProcessor';
import { CsvController } from '../controllers/csvController';

const router = express.Router();

/**
 * Configure multer middleware for CSV file uploads
 * 
 * Uses memory storage to process CSV files without writing to disk.
 * Limits upload size to 10MB to prevent memory issues.
 * Validates that only CSV files are accepted.
 */
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory for processing
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size
  },
  fileFilter: (req, file, cb) => {
    // Only allow CSV files by MIME type or file extension
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

/**
 * Upload CSV file
 * POST /api/csv/upload
 */
router.post('/upload', upload.single('csv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No CSV file provided'
      });
    }

    // Process the CSV file
    const result = await CSVProcessor.processCSV(req.file.buffer, req.file.originalname);

    if (result.success) {
      res.json({
        success: true,
        count: result.count,
        added: result.added,
        duplicates: result.duplicates,
        expiresAt: result.expiresAt,
        warning: result.warning,
        csvDate: result.csvDate,
        todayDate: result.todayDate
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to process CSV file'
      });
    }
  } catch (error: any) {
    console.error('CSV upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload CSV file',
      message: error.message
    });
  }
});


/**
 * Get ALL CSV data
 * GET /api/csv/all
 */
router.get('/all', async (req, res) => {
  try {
    // Return all clients from CSV import (any date)
    const appointments = getAllCheckIns().filter(record => record.source === 'csv');
    
    res.json({
      success: true,
      data: appointments,
      count: appointments.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch CSV data',
      message: error.message
    });
  }
});

/**
 * Export all CSV records with updates
 * 
 * Exports EVERY person from the original CSV upload with:
 * - Same headers and order as original upload
 * - Updated status from check-ins
 * - Next appointment date (or "NA" if missed)
 * - Special requests from client check-in
 * - Original data preserved unless updated
 * 
 * GET /api/csv/export-all
 */
router.get('/export-all', async (req, res) => {
  try {
    const csvContent = CsvController.exportAllWithUpdates();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="appointments-export-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to export CSV',
      message: error.message
    });
  }
});

/**
 * Export next appointments as CSV (legacy method - kept for backward compatibility)
 * GET /api/csv/export-next-appointments
 */
router.get('/export-next-appointments', async (req, res) => {
  try {
    const csvContent = CsvController.exportNextAppointments();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="next-appointments-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to export CSV',
      message: error.message
    });
  }
});

export default router;