/**
 * @fileoverview Client editing routes for Foodbank Check-In and Appointment System backend API
 * 
 * This module handles client information updates and editing functionality.
 * It provides endpoints for modifying client data, updating contact
 * information, and managing client records in the food bank system.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../controllers/checkInController.ts} Check-in controller
 */

import { Router } from 'express';
import { getTodayAppointments } from '../stores/unifiedStore';
import { CheckInController } from '../controllers/checkInController';

const router = Router();

// Temporary memory store for edited client data
const tempClientStore = new Map<string, any>();

/**
 * PUT /api/admin/clients/:id/edit
 * Update client data in temporary memory store
 */
router.put('/clients/:id/edit', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Get current appointment data (which contains all client data)
    const appointments = getTodayAppointments();
    
    const appointment = appointments.find(apt => apt.clientId === id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    // Get existing temp data or create new
    const existingTempData = tempClientStore.get(id) || {};
    
    // Merge updates with existing temp data
    const updatedTempData = {
      ...existingTempData,
      ...updates,
      clientId: id,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin' // In a real app, this would be the actual user
    };
    
    // Store in temp memory
    tempClientStore.set(id, updatedTempData);
    
    res.json({
      success: true,
      message: 'Client data updated in temporary memory'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to update client data',
      message: error.message
    });
  }
});


export default router;
