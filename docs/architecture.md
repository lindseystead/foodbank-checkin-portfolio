# Architecture

Public frontends for the Foodbank Check-In system. Full Express API, migrations, and secrets remain in a private repository. This note describes the **production system shape** as implemented there, so the portfolio UI is understood in context.

## Layers

```
Presentation     client/ (kiosk)  ·  admin/ (staff + volunteer portal)
       ↓
API              Express routes / controllers
       ↓
Domain services  CSV · Link2Feed · tickets · appointment scheduler · consent / data-rights
       ↓
Data access      unifiedStore adapter → tenantStore → Supabase Postgres (+ RLS)
```

### Presentation (this repo)

**Client (`client/`)**

- Feature folders under `client/src/features/` (landing, check-in pages)
- Shared layout, theme, i18n, API helper under `client/src/shared/`
- Design tokens: `client/src/shared/config/designTokens.ts` → Chakra theme
- Routes: tenant slug + default-tenant five-step flow (`client/src/App.tsx`)

**Admin (`admin/`)**

- Pages: dashboard, check-ins, clients, help requests, volunteers, reports, CSV upload, settings, profile (`admin/src/App.tsx`)
- Navigation: `admin/src/layouts/navConfig.ts`
- Auth: Supabase PKCE (`admin/src/lib/supabase.ts`, `AuthContext`)
- Design tokens: `admin/src/config/designTokens.ts`
- API client: `admin/src/lib/api.ts` attaches JWT when a session exists
- Print tickets: `admin/src/utils/printTicket.ts`

### API & domain (private)

- Public kiosk APIs: check-in, special requests, help requests, tickets, status, tenant config
- Multi-tenant variants: `/api/t/:slug/...`
- Staff APIs: `/api/admin/t/...` (CSV, clients, reports, Link2Feed, volunteers, shifts, …)
- Role gates: paid staff vs volunteer vs coordinator-only routes
- Consent + data-rights endpoints for privacy workflows

### Persistence adapter (private)

| Concern | Implementation |
|---------|----------------|
| Adapter | `unifiedStore` — stable API for controllers/services |
| Tenant store | `tenantStore` — Supabase Postgres, `tenantId` scoped |
| History | Replaced earlier in-memory `Map` stores without rewriting call sites |
| Day-of TTL | `expires_at` ~24h; purged on an interval |
| Durable data | Client profiles, volunteer roster/shifts, consent, memberships |

### Link2Feed (private services + admin Settings UI)

See [`link2feed-integration.md`](link2feed-integration.md) for the full note.

- **Primary:** CSV export from Link2Feed → smart import (fuzzy headers, date-mismatch gate, dedupe)
- **Optional:** HMAC-SHA256 API client → sync into the same unified record model
- Settings UI documents CSV-only as a first-class mode

### Scheduling & tickets (private + admin print)

- Next appointment ~21 days out; preserve time-of-day; weekday/holiday rules
- HTML ticket generation; admin opens print URL via shared helper

## Hosting

**Vercel** (frontends) + **Google Cloud Run** (API) + **Supabase** (database and auth).
