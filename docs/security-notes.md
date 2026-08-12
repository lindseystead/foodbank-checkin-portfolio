# Security notes

## Frontend (this repo)

- Admin auth is Supabase-managed (PKCE); tokens never belong in git.
- API client sends `Authorization: Bearer` only when a session exists.
- No service-role keys in this repository.
- Vite env vars are build-time; treat anything `VITE_*` as public.

## Backend (separate deployment)

- Helmet, CORS allowlists, rate limiting
- JWT verification on staff routes; volunteer role isolation
- Supabase RLS on tenant-scoped tables
- Day-of appointment purge (~24h); durable PII governed by privacy process documentation in the private system
