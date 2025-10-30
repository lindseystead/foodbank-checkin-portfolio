/**
 * @fileoverview Link2Feed controller for Foodbank Check-In and Appointment System backend API
 * 
 * This module handles Link2Feed integration operations including client
 * data synchronization, API communication, and data exchange between
 * the food bank system and Link2Feed platform.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../services/link2feedService.ts} Link2Feed service
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../types/index';

export class Link2FeedController {
  /**
   * Configure Link2Feed API credentials
   * POST /api/link2feed/configure
   */
  static async configure(req: Request, res: Response): Promise<void> {
    try {
      const { apiUrl, apiKey, secretKey, organizationId } = req.body;

      // Validate required fields
      if (!apiUrl || !apiKey || !secretKey || !organizationId) {
        const response: ApiResponse = {
          success: false,
          error: 'Missing required Link2Feed configuration fields'
        };
        res.status(400).json(response);
        return;
      }

      // Store configuration (in a real implementation, this would be stored securely)
      
      const response: ApiResponse = {
        success: true,
        message: 'Link2Feed configuration saved (stub mode)',
        data: {
          configured: true,
          apiUrl,
          organizationId
        }
      };

      res.json(response);
    } catch (error: any) {
      console.error('Link2Feed configuration error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to configure Link2Feed API',
        message: error.message
      };
      res.status(500).json(response);
    }
  }

  /**
   * Test Link2Feed API connection
   * POST /api/link2feed/test-connection
   */
  static async testConnection(req: Request, res: Response): Promise<void> {
    try {
      // Simulate API connection test
      const response: ApiResponse = {
        success: true,
        message: 'Link2Feed API not available in stub mode',
        data: {
          connected: false,
          mode: 'stub',
          message: 'Connection test completed (stub mode)'
        }
      };

      res.json(response);
    } catch (error: any) {
      console.error('Link2Feed connection test error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to test Link2Feed connection',
        message: error.message
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get Link2Feed API status
   * GET /api/link2feed/status
   */
  static async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const response: ApiResponse = {
        success: true,
        data: {
          configured: false,
          connected: false,
          mode: 'stub',
          message: 'Link2Feed API not configured - using CSV fallback'
        }
      };

      res.json(response);
    } catch (error: any) {
      console.error('Link2Feed status error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get Link2Feed status',
        message: error.message
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get available Link2Feed data types
   * GET /api/link2feed/data-types
   */
  static async getDataTypes(req: Request, res: Response): Promise<void> {
    try {
      const response: ApiResponse = {
        success: true,
        data: {
          dataTypes: [
            {
              name: 'visits',
              description: 'Visit records from Link2Feed',
              fields: ['client_id', 'visit_date', 'visit_type', 'notes']
            },
            {
              name: 'appointments',
              description: 'Appointment records from Link2Feed',
              fields: ['client_id', 'appointment_date', 'status', 'location']
            },
            {
              name: 'clients',
              description: 'Client records from Link2Feed',
              fields: ['client_id', 'first_name', 'last_name', 'phone', 'dietary_restrictions']
            }
          ],
          mode: 'stub',
          message: 'Link2Feed data types not available in stub mode'
        }
      };

      res.json(response);
    } catch (error: any) {
      console.error('Link2Feed data types error:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve Link2Feed data types',
        message: error.message
      };
      res.status(500).json(response);
    }
  }
}

export default Link2FeedController;
