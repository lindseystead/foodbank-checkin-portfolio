/**
 * @fileoverview System status routes for Foodbank Check-In and Appointment System backend API
 * 
 * This module provides health check and system status endpoints for monitoring
 * the backend API. It includes basic health checks and system information
 * for deployment monitoring and debugging.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../controllers/checkInController.ts} Main controller for system data
 */

import { Router } from 'express';
import { getDailyStatus, clearAllData, purgeExpired, getDataVersion } from '../stores/unifiedStore';

const router = Router();

/**
 * Get daily data status and health information
 * 
 * Retrieves the current system status including data availability, CSV upload status,
 * and data expiration information. Automatically purges expired entries before
 * returning status to ensure accurate information.
 * 
 * @route GET /api/status/day
 * @returns {Object} Status information with today's date, CSV date, data count, and expiration
 */
router.get('/day', (req, res) => {
  try {
    // Clean up expired data before returning status
    purgeExpired();
    
    // Get current daily status from unified store
    const status = getDailyStatus();
    
    res.json({
      success: true,
      data: status,
      dataVersion: getDataVersion()
    });
  } catch (error: any) {
    // Handle status retrieval errors
    res.status(500).json({
      success: false,
      error: 'Failed to get daily status',
      message: error.message
    });
  }
});

/**
 * Clear all system data
 * 
 * WARNING: This operation removes all check-in data, appointments, and help requests
 * from the unified store. Used for system reset or data refresh. This action is
 * irreversible.
 * 
 * @route DELETE /api/status/clear
 * @returns {Object} Success status and confirmation message
 */
router.delete('/clear', (req, res) => {
  try {
    // Clear all data from unified store
    clearAllData();
    
    res.json({
      success: true,
      message: 'All data cleared successfully'
    });
  } catch (error: any) {
    // Handle data clearing errors
    res.status(500).json({
      success: false,
      error: 'Failed to clear data',
      message: error.message
    });
  }
});

export default router;