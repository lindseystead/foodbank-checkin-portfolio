/**
 * @fileoverview Help request routes for Foodbank Check-In and Appointment System backend API
 * 
 * This module handles help request operations from clients. It provides endpoints
 * for submitting help requests (public), retrieving all help requests (admin),
 * and updating help request status (admin).
 * 
 * Best Practices:
 * - Public endpoint for client submissions (no auth required)
 * - Admin endpoints protected by authentication middleware
 * - Rate limiting applied at server level (200 req/15min per IP)
 * - Frontend should implement smart polling (30s intervals, Page Visibility API)
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../middleware/auth.ts} Authentication middleware
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API} Page Visibility API
 */

import { Router } from 'express';
import { 
  addHelpRequest, 
  getAllHelpRequests, 
  updateHelpRequestStatus 
} from '../stores/unifiedStore';

const router = Router();

/**
 * Submit help request from client
 * 
 * Allows clients to request assistance during check-in process. Stores request
 * in-memory for admin review. This is a public endpoint - no authentication required.
 * 
 * @route POST /api/help-requests
 * @body {string} client_phone - Client phone number
 * @body {string} client_last_name - Client last name
 * @body {string} [client_email] - Client email (optional)
 * @body {string} message - Help request message
 * @body {string} [current_page] - Page where request was made
 * @body {boolean} [has_existing_appointment] - Whether client has appointment
 * @returns {Object} Success status and help request data
 */
router.post('/', (req, res) => {
  try {
    // Extract required fields from request body
    const { client_phone, client_last_name, client_email, message, current_page, has_existing_appointment } = req.body;
    
    // Validate required fields
    if (!client_phone || !client_last_name || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number, last name, and message are required'
      });
    }
    
    // Store help request in unified store for admin access
    const request = addHelpRequest({
      client_phone,
      client_last_name,
      client_email,
      message,
      current_page,
      has_existing_appointment: has_existing_appointment || false
    });
    
    // Return success response with request data
    res.json({
      success: true,
      data: request
    });
  } catch (error: any) {
    // Handle any errors during request submission
    res.status(500).json({
      success: false,
      error: 'Failed to submit help request',
      message: error.message
    });
  }
});

/**
 * Retrieve all help requests
 * 
 * Returns all help requests stored in the unified store, sorted by most recent.
 * Used by admin panel to view and manage client assistance requests.
 * 
 * @route GET /api/help-requests
 * @returns {Object} Success status and array of help requests
 */
router.get('/', (req, res) => {
  try {
    // Retrieve all help requests from unified store
    const requests = getAllHelpRequests();
    
    res.json({
      success: true,
      data: requests
    });
  } catch (error: any) {
    // Handle retrieval errors
    res.status(500).json({
      success: false,
      error: 'Failed to fetch help requests',
      message: error.message
    });
  }
});

/**
 * Update help request status
 * 
 * Allows admin to change the status of a help request (e.g., pending -> in_progress -> resolved).
 * Used to track workflow of client assistance requests.
 * 
 * @route PUT /api/help-requests/:id/status
 * @param {string} id - Help request ID
 * @body {string} status - New status (pending, in_progress, resolved)
 * @returns {Object} Success status and message
 */
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status is provided
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }
    
    // Update status in unified store
    const success = updateHelpRequestStatus(parseInt(id), status);
    
    if (success) {
      res.json({
        success: true,
        message: 'Help request status updated'
      });
    } else {
      // Help request not found
      res.status(404).json({
        success: false,
        error: 'Help request not found'
      });
    }
  } catch (error: any) {
    // Handle update errors
    res.status(500).json({
      success: false,
      error: 'Failed to update help request status',
      message: error.message
    });
  }
});

export default router;

