# Client check-in kiosk

Public, unauthenticated React kiosk for food-bank clients. Multilingual check-in flow against the Express API.

## Flow (5 steps)

Evidence: `src/App.tsx`, `src/features/*`.

1. Landing — language + continue  
2. Initial check-in — phone + last name (+ consent)  
3. Special requests — dietary / mobility / notes  
4. Appointment details — review / notify / reschedule  
5. Confirmation — ticket summary + finish  

Routes support a tenant slug (`/:slug/...`) and default-tenant aliases (`/initial-check-in`, …).

## Features

- **i18n (7):** `en`, `fr`, `es`, `zh`, `hi`, `ar`, `pa` — `src/shared/config/i18n.ts` + `locales/`
- **Responsive CTAs:** theme variants `primary` / `assistance` / `language` from `src/shared/config/theme.ts`, tokens in `designTokens.ts` (48px touch height)
- **Help requests:** modal wired to API help-request endpoints
- **Session storage:** temporary check-in payload between steps (cleared on finish)

## Stack

- React 18, TypeScript, Vite, Chakra UI 2.x, React Router, i18next
- Optional Vercel Analytics where configured

## Setup

```bash
cd client
npm install
# .env: VITE_API_BASE_URL=http://localhost:3001/api   # or leave unset → Vite proxies /api
npm run dev
```

Production builds use `vercel.json` (`VITE_API_BASE_URL` → Cloud Run API).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (typically :5174) |
| `npm run build` | Production build |
| `npx tsc --noEmit` | Typecheck |

## Accessibility

Layouts favor large touch targets (44–48px), visible focus rings, and reduced-motion handling in theme globals. Treat WCAG claims as goals; validate with tooling before asserting conformance on a given release.
