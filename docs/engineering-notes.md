# Engineering notes

This repo is a public snapshot of the production frontends. Application source under `admin/src` and `client/src` matches the private production tree — keep that layout so the portfolio stays in sync with production.

How to exercise the live demo (CSV upload, kiosk lookup, tickets): root [README](../README.md) → **Try the live demo**.

## Quality gates

From `admin/` or `client/`:

- `npm run lint` — ESLint flat config (must exit 0)
- `npm run build` — TypeScript check + production Vite build

Application source stays aligned with the private production frontends; tooling fixes (ESLint deps/scripts) live in this public snapshot so reviewers can verify quality without the private API.

## Where to look

| Concern | Location |
|---------|----------|
| Kiosk routes (5-step + tenant slug) | `client/src/App.tsx` |
| Check-in feature modules | `client/src/features/checkin/` |
| i18n (7 locales) | `client/src/shared/config/i18n.ts`, `locales/` |
| Design tokens / theme | `client/src/shared/config/designTokens.ts`, `theme.ts` |
| Admin routes + RBAC shells | `admin/src/App.tsx`, `layouts/navConfig.ts` |
| CSV upload UX | `admin/src/components/features/csv/`, `pages/CSVUploadPage.tsx` |
| Print ticket | `admin/src/utils/printTicket.ts` |
| Link2Feed settings UI | `admin/src/components/features/dashboard/Link2FeedStatus.tsx`, `features/settings/` |
| Auth (Supabase PKCE) | `admin/src/lib/supabase.ts`, `contexts/AuthContext.tsx` |
| API client (JWT attach) | `admin/src/lib/api.ts`, `client/src/shared/lib/api.ts` |

## Backend (private)

Layered Express API: routes → services (CSV, Link2Feed, tickets, scheduling) → `unifiedStore` adapter → `tenantStore` → Supabase Postgres. Automated tests and migrations live there, not in this snapshot.

## Not in this repository

- Express API, migrations, service-role keys  
- Link2Feed signing secrets  
- Production appointment data  
