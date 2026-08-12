/**
 * @fileoverview Vite configuration for Foodbank Check-In and Appointment System admin panel
 * 
 * This configuration file sets up the Vite build tool for the admin
 * panel with optimized settings for development and production
 * builds, including performance optimizations and deployment settings.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license MIT
 * 
 * @see {@link https://vitejs.dev/config/} Vite Configuration Documentation
 */

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables explicitly to debug in development
  // Vite automatically loads .env files, but this helps us see what's loaded
  const env = loadEnv(mode, process.cwd(), '');
  
  // Debug: Log environment variable loading in development
  if (mode === 'development') {
    console.log('\n🔍 Vite Environment Variables Check:');
    console.log('  Mode:', mode);
    console.log('  Working Directory:', process.cwd());
    console.log('  VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL ? `✓ Set (${env.VITE_SUPABASE_URL.substring(0, 30)}...)` : '✗ Missing');
    console.log('  VITE_SUPABASE_ANON_KEY:', env.VITE_SUPABASE_ANON_KEY ? `✓ Set (${env.VITE_SUPABASE_ANON_KEY.substring(0, 30)}...)` : '✗ Missing');
    console.log('  VITE_API_BASE_URL:', env.VITE_API_BASE_URL || 'Using default (localhost:3001/api)');
    console.log('  All VITE_* vars:', Object.keys(env).filter(k => k.startsWith('VITE_')));
    console.log('');
  }

  return {
    plugins: [react()],
    server: {
      port: 3003,
      proxy: {
        '/api': 'http://localhost:3001',
      },
    },
    // Note: Vite automatically loads .env files from the project root (where vite.config.ts is)
    // and exposes VITE_* variables via import.meta.env in your code
    // The loadEnv call above is just for debugging - Vite handles .env loading automatically
  };
});
