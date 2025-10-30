/**
 * @fileoverview Vite configuration for Foodbank Check-In and Appointment System client application
 * 
 * This configuration file sets up the Vite build tool for the client
 * application with optimized settings for development and production
 * builds, including performance optimizations and deployment settings.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license MIT
 * 
 * @see {@link https://vitejs.dev/config/} Vite Configuration Documentation
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      '/api': 'http://localhost:3001',
    }
  },
  define: {
    'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:3001/api'),
  },
})
