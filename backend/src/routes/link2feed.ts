/**
 * @fileoverview Link2Feed integration routes for Foodbank Check-In and Appointment System backend API
 * 
 * This module handles integration with the Link2Feed system for client
 * data synchronization. It provides endpoints for syncing client data,
 * managing Link2Feed connections, and handling data exchange.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../controllers/link2feedController.ts} Link2Feed controller
 */

/**
 * Link2Feed Routes - Stub Implementation
 * 
 * These routes provide stub implementations for Link2Feed API integration.
 * The system is designed to be Link2Feed API ready while maintaining
 * functionality with CSV-based data processing.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0 - Stub Implementation
 */

import express from 'express';
import { Link2FeedController } from '../controllers/link2feedController';

const router = express.Router();

/**
 * Configure Link2Feed API credentials
 * POST /api/link2feed/configure
 */
router.post('/configure', Link2FeedController.configure);

/**
 * Test Link2Feed API connection
 * POST /api/link2feed/test-connection
 */
router.post('/test-connection', Link2FeedController.testConnection);

/**
 * Get Link2Feed API status
 * GET /api/link2feed/status
 */
router.get('/status', Link2FeedController.getStatus);

/**
 * Get available Link2Feed data types
 * GET /api/link2feed/data-types
 */
router.get('/data-types', Link2FeedController.getDataTypes);

export default router;
