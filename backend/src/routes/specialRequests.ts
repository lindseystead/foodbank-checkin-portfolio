/**
 * @fileoverview Special requests routes for Foodbank Check-In and Appointment System backend API
 * 
 * This module handles special accommodation requests and client needs
 * management. It provides endpoints for submitting, updating, and
 * managing special requests for food bank clients.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../controllers/checkInController.ts} Check-in controller
 */

import express from 'express';
import { Request, Response } from 'express';
import { ApiResponse } from '../types/index';

const router = express.Router();

/**
 * In-memory storage for special client requests
 * 
 * Stores dietary restrictions, allergies, mobility needs, and other
 * special accommodations for clients. Data is keyed by checkInId
 * and persists for the application lifecycle.
 */
const specialRequestsStore = new Map<string, any>();

/**
 * Submit special requests for a check-in
 * POST /api/special-requests
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      checkInId,
      clientId,
      dietaryRestrictions,
      allergies,
      unwantedFoods,
      additionalInfo,
      householdInfoChanged,
      hasMobilityIssues
    } = req.body;

    if (!checkInId || !clientId) {
      const response: ApiResponse = {
        success: false,
        error: 'Check-in ID and Client ID are required'
      };
      res.status(400).json(response);
      return;
    }

    // Create special requests record with timestamp
    const specialRequests = {
      checkInId,
      clientId,
      dietaryRestrictions: dietaryRestrictions || [],
      allergies: allergies || '',
      unwantedFoods: unwantedFoods || '',
      additionalInfo: additionalInfo || '',
      householdInfoChanged: householdInfoChanged || false,
      hasMobilityIssues: hasMobilityIssues || false,
      submittedAt: new Date().toISOString()
    };

    // Store in memory for retrieval during check-in processing
    specialRequestsStore.set(checkInId, specialRequests);

    // Simplified approach: special requests are stored separately
    const checkIn = null;
    if (checkIn) {
      (checkIn as any).dietaryRestrictions = dietaryRestrictions || [];
      (checkIn as any).allergies = allergies || '';
      (checkIn as any).unwantedFoods = unwantedFoods || '';
      (checkIn as any).additionalInfo = additionalInfo || '';
      (checkIn as any).householdInfoChanged = householdInfoChanged || false;
      (checkIn as any).hasMobilityIssues = hasMobilityIssues || false;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Special requests submitted successfully',
      data: {
        checkInId,
        clientId,
        dietaryConsiderationTypes: dietaryRestrictions || [],
        submittedAt: specialRequests.submittedAt
      }
    };

    res.json(response);
  } catch (error: any) {
    // Log error for debugging and monitoring
    console.error('Error submitting special requests:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to submit special requests',
      message: error.message
    };
    res.status(500).json(response);
  }
});

/**
 * Get special requests for a check-in
 * GET /api/special-requests/:checkInId
 */
router.get('/:checkInId', async (req: Request, res: Response) => {
  try {
    const { checkInId } = req.params;
    const specialRequests = specialRequestsStore.get(checkInId);

    if (!specialRequests) {
      const response: ApiResponse = {
        success: false,
        error: 'Special requests not found'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: specialRequests
    };

    res.json(response);
  } catch (error: any) {
    // Log error for debugging
    console.error('Error getting special requests:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve special requests',
      message: error.message
    };
    res.status(500).json(response);
  }
});


export default router;
