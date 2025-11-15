# Foodbank Check-In System

Full-stack TypeScript application for streamlining food bank client check-in processes. Production-ready system with React frontends and Node.js/Express RESTful API backend.

**Live Demo:** [Client Check-In](https://foodbank-checkin-tan.vercel.app/) | [Admin Dashboard](https://foodbank-checkin.vercel.app/login)

> **Note:** This repository contains the frontend applications only (Client App + Admin Dashboard). The backend API is proprietary and not included in this repository.

## Overview

Production-ready full-stack system that reduces client check-in time from 15+ minutes to under 5 minutes. Features QR code workflow, multi-language support (7 languages), CSV-first architecture, and real-time analytics dashboard.

**Key Metrics:**
- 21,628+ lines of TypeScript code
- 31 RESTful API endpoints across 10 route modules
- 28 React components (11 client + 17 admin)
- 7-language internationalization support
- 67% reduction in check-in time
- WCAG 2.1 AA accessible design
- PIPEDA-compliant privacy (24-hour auto-purge)

## Architecture

**CSV-First, Link2Feed-Ready Architecture**

- CSV-first architecture - Works immediately with Link2Feed CSV exports (no API access required)
- N-tier architecture - Separate client app, admin dashboard, and RESTful API backend
- Link2Feed-ready - Architecture designed for future Link2Feed RESTful API integration
- Scalable multi-location - Built to handle multiple locations and high-volume check-ins simultaneously

**System Architecture:**
```
Client App (React/TypeScript) ↔ RESTful API (Node.js/Express) ↔ Admin Dashboard (React/TypeScript)
```

## Tech Stack

**Frontend:**
- React 18, TypeScript
- Chakra UI
- i18next (7 languages, 1,668 lines of translations)
- React Router, Vite
- Supabase Auth (PKCE flow)

**Backend:**
- Node.js, Express, TypeScript
- RESTful API (31 endpoints across 10 route modules)
- Supabase, PostgreSQL
- In-memory data store with 24-hour auto-purge
- **Note:** Backend API is proprietary and not included in this repository

**DevOps & Deployment:**
- Vercel (frontend hosting)
- Railway (backend hosting)
- CI/CD ready
- Environment-based configuration

**Features:**
- QR code workflow (no dedicated hardware required)
- Real-time analytics dashboard
- CSV-first data processing
- Multi-language support (7 languages with persistent language selection)
- WCAG 2.1 AA accessible design
- PIPEDA-compliant privacy

## Performance Improvements

- **Check-in Time:** Reduced from 15+ minutes to under 5 minutes
- **Time Savings:** 67% reduction in check-in time per client
- **Data Accuracy:** Eliminated manual data entry errors through automated tracking
- **Staff Efficiency:** Volunteers can focus on serving clients instead of paperwork

## Technical Implementation

**Code Quality:**
- 100% TypeScript codebase with strict mode
- Comprehensive error handling with graceful fallbacks
- Code splitting, lazy loading, memoization for performance
- Unit tests (Vitest) and E2E tests (Cypress)

**Security:**
- Supabase authentication with PKCE flow
- Protected routes (admin-only access)
- Input validation (client-side and server-side)
- CORS protection
- Rate limiting (200 req/15min per IP)
- Secure headers (XSS protection)

**Privacy Compliance:**
- PIPEDA-compliant - 24-hour auto-purge of all PII
- Privacy by Design - No PII retention after 24 hours
- Data Residency - Supports Canadian data residency options

**Technical Solutions:**
- Real-time updates without WebSockets - Implemented smart polling with Page Visibility API
- CSV-first architecture - Enables immediate deployment without API dependencies
- Multi-language support - 7 languages with persistent language selection
- Scalability - Multi-location architecture built from the ground up
- QR code workflow - Eliminates need for expensive kiosk hardware

## Project Structure

```
foodbank-checkin/
├── client/           # Client-facing check-in app (7,515 lines)
│   ├── src/
│   │   ├── pages/           # 5-step check-in flow
│   │   ├── components/      # Reusable UI components
│   │   ├── common/          # Shared config (i18n, theme, API)
│   │   └── lib/             # API integration and services
│   └── dist/                # Production build
│
├── admin/           # Staff / Admin dashboard (14,113 lines)
│   ├── src/
│   │   ├── pages/           # Dashboard, check-ins, CSV upload, settings
│   │   ├── components/      # Feature components
│   │   ├── contexts/        # Auth context (Supabase)
│   │   └── lib/             # API integration with auth
│   └── dist/                 # Production build
│
└── assets/          # Screenshots and documentation images
```

## Quick Start

> **Note:** This repository contains frontend applications only (Client App + Admin Dashboard). The backend API is proprietary and not included in this repository. The backend is deployed separately and not available for public access.

**Prerequisites:**
- Node.js 18+ and npm
- Backend API running (proprietary - not included in this repository)

**Installation:**
```bash
# Install dependencies for client app
cd client && npm install

# Install dependencies for admin panel
cd ../admin && npm install
```

**Running Locally:**
```bash
# Run client app (port 3002)
cd client && npm run dev

# Run admin panel (port 5173)
cd admin && npm run dev
```

**Environment Variables:**
- `VITE_API_BASE_URL` - Backend API base URL (required in production)
- Supabase configuration (handled via Supabase client)

**Build for Production:**
```bash
cd client && npm run build
cd admin && npm run build
```

## Testing the System

**Live Demo Available:**
- **Client Check-In**: [https://foodbank-checkin-tan.vercel.app/](https://foodbank-checkin-tan.vercel.app/)
- **Admin Dashboard**: [https://foodbank-checkin.vercel.app/login](https://foodbank-checkin.vercel.app/login)
  - **Test Admin Credentials:**
    - Email: `admin@example.com`
    - Password: `testing123`
  - Note: This is a test account for portfolio review purposes

**To test the complete check-in flow:**
1. Download the sample CSV file: [`docs/sample-appointments.csv`](docs/sample-appointments.csv)
2. Update the dates: Change all `Pick Up Date` values to match today's date (format: `YYYY-MM-DD @ HH:MM AM/PM`)
3. Upload to Admin Dashboard: Log in and navigate to the CSV Upload page
4. Test Client Check-In: Use the phone numbers and last names from the CSV to test the check-in flow

## Engineering Skills Demonstrated

- **Full-Stack Development:** React/TypeScript frontends + Node.js/Express backend
- **Backend Architecture:** RESTful API design, data management, security implementation
- **API Integration:** RESTful API consumption with error handling
- **Database Design:** In-memory data store with auto-purge, data integrity
- **Security:** Authentication, authorization, CORS, input validation, rate limiting
- **UI/UX Design:** Accessible, responsive, multi-language support
- **DevOps:** Vercel + Railway deployment, environment management
- **Testing:** Unit and E2E testing setup
- **Documentation:** Technical specs, user guides, code comments

## License

**Intellectual Property:** This project was designed, created, and implemented by Lindsey D. Stead and is the intellectual property of Lindsey D. Stead.

**Copyright © 2025 Lindsey D. Stead. All Rights Reserved.**

**Portfolio Project** - This repository is for portfolio demonstration purposes only.

**For Recruiters & Hiring Managers:**
- Portfolio Review: Feel free to review this code for evaluation purposes
- Code Inspection: You may inspect the codebase to assess technical skills
- Interview Discussion: This project can be discussed in interviews

**For Commercial Use:**
- This software is proprietary and available for licensing upon request
- Commercial use, deployment, or distribution requires a license
- Licensing inquiries: Lifesaver Technology Services (info@lifesavertech.ca)

## Acknowledgments

- Dr. Kevin O'Neil - Software Engineering Professor and Capstone Supervisor at Thompson Rivers University
- Food bank organizations - For providing real-world context and feedback
- Thompson Rivers University - For academic guidance and capstone opportunity
