/**
 * @fileoverview Main Express server for Foodbank Check-In and Appointment System backend API
 * 
 * This module sets up the Express server with all necessary middleware, routes,
 * and configuration for the Foodbank Check-In and Appointment System. It handles
 * CORS, static file serving, and routes all API endpoints for the admin and client applications.
 * 
 * Best Practices Implemented:
 * - Rate Limiting: 200 requests per IP per 15 minutes to prevent abuse
 * - Security Headers: Helmet middleware for XSS protection, clickjacking prevention
 * - CORS Protection: Whitelist-based CORS with credentials support
 * - Input Validation: JSON body parsing with size limits
 * - Error Handling: Graceful error responses with proper HTTP status codes
 * 
 * Note: Frontend components should implement smart polling with:
 * - Page Visibility API to pause when tab is hidden
 * - Exponential backoff on connection errors
 * - Appropriate polling intervals (30-120 seconds based on priority)
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./routes/} API route modules
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API} Page Visibility API
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import your existing routes
import checkinRouter from './routes/checkin';
import statusRouter from './routes/status';
import link2feedRouter from './routes/link2feed';
import ticketsRouter from './routes/tickets';
import specialRequestsRouter from './routes/specialRequests';
import csvRouter from './routes/csv';
import enhancedClientSearchRouter from './routes/enhancedClientSearch';
import clientEditRouter from './routes/clientEdit';
import appointmentRebookRouter from './routes/appointmentRebook';
import helpRequestsRouter from './routes/helpRequests';
import { authenticateAdmin } from './middleware/auth';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const LEAN_MODE = (process.env.LEAN_MODE || 'true').toLowerCase() === 'true';

// Security middleware - Helmet adds security headers
// Had to relax CSP for tickets since they're rendered as standalone HTML
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Need inline styles for printable tickets
      scriptSrc: ["'self'", "'unsafe-inline'"], // Need inline scripts for tickets
    },
  },
}));

/**
 * Rate limiting - protect against abuse and excessive API calls
 * 
 * Best Practice: Rate limiting prevents server overload from:
 * - Excessive polling from frontend components
 * - DDoS attacks
 * - Accidental infinite loops
 * 
 * Configuration: 200 requests per IP per 15 minutes
 * This allows for normal polling (30-120 second intervals) while preventing abuse.
 * 
 * Note: Frontend components should implement smart polling to stay within limits:
 * - Page Visibility API to pause when tab is hidden
 * - Exponential backoff on connection errors
 * - Optimized polling intervals (30-120 seconds based on priority)
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // Allow up to 200 requests per IP per 15 minutes
});

app.use('/api/', limiter);

// Serve static files from public directory
app.use('/assets', express.static('public'));

// CORS config - had to add a bunch of localhost ports during development
// TODO: cleanup old ports later
app.use(cors({
  origin: [
    'http://localhost:3002', // Client frontend dev
    'http://localhost:3003', // Admin panel dev
    'http://localhost:3004', // Client frontend dev (current)
    'http://localhost:3005', // Client frontend dev (current)
    'http://localhost:3008', // Client frontend dev (current)
    'http://localhost:3009', // Admin panel dev (current)
    'http://localhost:3010', // Client frontend dev (current)
    'http://localhost:3011', // Admin panel dev (current)
    'http://localhost:4004', // Client frontend dev (current)
    'https://foodbank-checkin.vercel.app', // Admin panel prod
    /\.vercel\.app$/, // Any Vercel subdomain (covers all preview and production URLs)
    /\.elasticbeanstalk\.com$/, // Any AWS Elastic Beanstalk subdomain
    /\.amazonaws\.com$/, // Any AWS subdomain
  ],
  credentials: true, // Need this for Supabase auth cookies
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'Foodbank Check-In and Appointment System Backend API' });
});


// Add your existing routes

// Public routes
app.use('/api/checkin', checkinRouter);
app.use('/api/status', statusRouter);
// Link2Feed API stubs are unused in current UI; gate them behind LEAN_MODE
if (!LEAN_MODE) {
  app.use('/api/link2feed', link2feedRouter);
}
app.use('/api/tickets', ticketsRouter);
app.use('/api/special-requests', specialRequestsRouter);
app.use('/api/help-requests', helpRequestsRouter);

// Protected admin routes - require Supabase JWT
// Note: authenticateAdmin middleware verifies token before allowing access
app.use('/api/csv', authenticateAdmin, csvRouter);
app.use('/api/admin', authenticateAdmin, enhancedClientSearchRouter);
app.use('/api/admin', authenticateAdmin, clientEditRouter);
app.use('/api/admin', authenticateAdmin, appointmentRebookRouter);

/**
 * Start the Express server
 * Server initialization with port binding and startup logging
 */
app.listen(PORT, () => {
  console.log(`✅ Backend API server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log('🔐 Admin authentication: http://localhost:3003/login');
  console.log('🎉 All Systems Go! 🎉');
});
