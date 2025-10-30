/**
 * @fileoverview Enhanced client search routes for Foodbank Check-In and Appointment System backend API
 * 
 * This module provides advanced client search functionality with fuzzy
 * matching, partial searches, and enhanced filtering capabilities.
 * It enables efficient client lookup for the food bank system.
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

/**
 * POST /api/admin/clients/enhanced-search
 * Enhanced search using appointments (which contain all client data)
 */
router.post('/clients/enhanced-search', (req, res) => {
  try {
    const { query } = req.body;
    const appointments = getTodayAppointments();
    
    if (!query) {
      return res.json({
        success: true,
        clients: appointments
      });
    }
    
    // Enhanced search across appointment data
    const searchTerm = query.toLowerCase().trim();
    
    const filteredAppointments = appointments.filter(appointment => {
      return appointment.firstName?.toLowerCase().includes(searchTerm) ||
             appointment.lastName?.toLowerCase().includes(searchTerm) ||
             appointment.clientId?.toLowerCase().includes(searchTerm) ||
             appointment.phoneNumber?.includes(query) ||
             appointment.phoneDigits?.includes(query);
    });
    
    res.json({
      success: true,
      clients: filteredAppointments
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Enhanced search failed',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/clients/:id/comprehensive
 * Get comprehensive client data by ID (using appointments)
 */
router.get('/clients/:id/comprehensive', (req, res) => {
  try {
    const { id } = req.params;
    const appointments = getTodayAppointments();
    
    // Find appointment by client ID
    const appointment = appointments.find(apt => apt.clientId === id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    res.json({
      success: true,
      client: appointment // Appointment contains all client data
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get comprehensive client data',
      message: error.message
    });
  }
});

export default router;
