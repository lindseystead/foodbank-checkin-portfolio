/// <reference types="vite/client" />

/**
 * Environment variable type definitions for Vite
 *
 * All environment variables must be prefixed with VITE_ to be accessible
 * in the browser. These are loaded from .env files in the admin/ directory.
 */
interface ImportMetaEnv {
  /** API base URL for backend requests (defaults to http://localhost:3001/api in dev) */
  readonly VITE_API_BASE_URL?: string;
  /** Supabase project URL for authentication */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anonymous/public key for authentication */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Sentry DSN for error tracking and performance monitoring */
  readonly VITE_SENTRY_DSN?: string;
  /** Development mode flag (automatically set by Vite) */
  readonly DEV: boolean;
  /** Production mode flag (automatically set by Vite) */
  readonly PROD: boolean;
  /** Current mode (development or production) */
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
