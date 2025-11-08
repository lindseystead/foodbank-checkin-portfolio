/**
 * @fileoverview Check-in routes for Foodbank Check-In and Appointment System backend API
 * 
 * This module defines all HTTP routes related to client check-ins including
 * initial check-in processing, status updates, and appointment management.
 * It handles the core functionality of the food bank check-in system.
 * 
 * Best Practices:
 * - Rate limiting applied at server level (200 req/15min per IP)
 * - Public endpoints for client check-in (no auth required)
 * - Admin endpoints protected by authentication middleware
 * - Frontend should implement smart polling (30-120s intervals, Page Visibility API)
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../controllers/checkInController.ts} Check-in controller implementation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API} Page Visibility API
 */

import { Router } from 'express';
import { CheckInController } from '../controllers/checkInController';

const router = Router();

// ============================================================================
// Unified Check-in Management - Simple and Effective
// ============================================================================

/**
 * Client check-in (phone + last name lookup)
 * POST /api/checkin
 */
router.post('/', CheckInController.handleCheckIn);

/**
 * Complete check-in process (admin completion)
 * POST /api/checkin/complete
 */
router.post('/complete', CheckInController.completeCheckInProcess);

/**
 * Get check-in statistics
 * GET /api/checkin/stats
 */
router.get('/stats', CheckInController.getCheckInStats);

/**
 * Get all check-ins (admin view)
 * GET /api/checkin
 */
router.get('/', CheckInController.getCheckIns);

/**
 * Admin: Get all appointments (from CSV data)
 * GET /api/checkin/appointments
 */
router.get('/appointments', CheckInController.getAppointments);

/**
 * Admin: Get simple analytics counters
 * GET /api/checkin/analytics
 */
router.get('/analytics', CheckInController.getAnalytics);

/**
 * Get system performance metrics
 * GET /api/checkin/metrics
 */
router.get('/metrics', CheckInController.getPerformanceMetrics);

/**
 * Admin: Create manual check-in
 * POST /api/checkin/admin
 */
router.post('/admin', CheckInController.createManualCheckIn);

/**
 * Admin: Update check-in status
 * PUT /api/checkin/:id/status
 */
router.put('/:id/status', CheckInController.updateCheckInStatus);

/**
 * Client reschedule appointment
 * PUT /api/checkin/:checkInId/reschedule
 */
router.put('/:checkInId/reschedule', CheckInController.rescheduleAppointment);

/**
 * Get check-in by ID
 * GET /api/checkin/:id
 */
router.get('/:id', CheckInController.getCheckInById);

export default router;