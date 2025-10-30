/**
 * @fileoverview Authentication middleware for admin routes
 * 
 * This middleware verifies Supabase JWT tokens to protect admin-only endpoints.
 * It extracts the JWT token from the Authorization header, verifies it with Supabase,
 * and attaches the user information to the request object.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../lib/supabase.ts} Supabase client configuration
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/supabase';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        [key: string]: any;
      };
    }
  }
}

/**
 * Middleware to verify JWT token and protect routes
 * Extracts the token from Authorization header and verifies it with Supabase
 */
export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: 'No authorization header provided',
      });
      return;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
      });
      return;
    }

    // Verify JWT token with Supabase authentication service
    const user = await verifyToken(token);

    // Reject request if token verification fails
    if (!user) {
      console.warn('Unauthorized API access attempt detected');
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
      return;
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email || '',
    };

    // Continue to next middleware/route handler
    next();
  } catch (error: any) {
    // Log critical authentication errors for monitoring
    console.error('Authentication middleware error:', error?.message || error);
    res.status(500).json({
      success: false,
      error: 'Authentication service unavailable',
    });
  }
};

