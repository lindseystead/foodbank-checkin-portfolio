# Admin dashboard

Staff cockpit for the Foodbank Check-In system. React 18 + Chakra UI + Vite, authenticated with Supabase (PKCE).

## What this app does

Evidence: `src/App.tsx`, `src/layouts/navConfig.ts`.

| Area | Path | Notes |
|------|------|--------|
| Dashboard | `/dashboard` | Live check-in analytics, CSV status, quick actions |
| Check-ins | `/check-ins` | Today’s appointments, status, ticket print UI |
| Clients | `/clients`, `/clients/:id` | Lookup + detail / extras |
| Help Requests | `/help-requests` | Kiosk assistance inbox |
| Volunteers | `/volunteers` | Roster approval + shift scheduling (paid staff) |
| Reports | `/reports` | Utilization / export surfaces |
| CSV Upload | `/csv-upload` | Link2Feed CSV ingest |
| Settings / Profile | `/settings`, `/profile` | Integrations + account |
| Volunteer portal | `/volunteer` | Separate shell for `role === 'volunteer'` |

Paid-staff roles come from `TenantContext` (`director`, `coordinator`, `staff`, plus legacy `admin` / `super_admin`). Volunteers are redirected away from the staff shell.

## Stack

- React 18, TypeScript, Vite, Chakra UI 2.x, React Router
- Supabase JS (auth)
- Recharts (dashboard)
- Design tokens: `src/config/designTokens.ts` → `src/config/theme.ts`

## Setup

```bash
cd admin
npm install
# Create .env with:
#   VITE_API_BASE_URL=http://localhost:3001/api   # or leave unset → Vite proxies /api
#   VITE_SUPABASE_URL=...
#   VITE_SUPABASE_ANON_KEY=...
npm run dev
```

Production API base is injected via `vercel.json` (`VITE_API_BASE_URL` → Cloud Run).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npx tsc --noEmit` | Typecheck |
| `npm test` / `npm run test:e2e` | Vitest / Cypress runners (few/no committed specs) |

## Notes

- Prefer sidebar navigation over pasting deep URLs while a session is establishing.
- Volunteers UI is always in the nav; API success requires volunteer migrations on the linked Supabase project.
