# Foodbank Check-In System

**Full-stack TypeScript application for streamlining food bank client check-in processes** | Production-ready | PIPEDA-compliant

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Chakra UI](https://img.shields.io/badge/Chakra%20UI-2.0+-319795?style=flat&logo=chakraui&logoColor=white)](https://chakra-ui.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Testing](https://img.shields.io/badge/Testing-Vitest%20%7C%20Cypress-green.svg)](#testing--quality-assurance)
[![Security](https://img.shields.io/badge/Security-PKCE%20%7C%20CORS%20Protected-brightgreen.svg)](#security-implementation)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-blue.svg)](#technical-implementation)
[![Privacy](https://img.shields.io/badge/Privacy-PIPEDA%20Compliant-purple.svg)](#technical-implementation)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%7C%20Railway-orange.svg)](https://vercel.com/)
![Visitor Count](https://visitor-badge.laobi.icu/badge?page_id=lindseystead.foodbank-checkin)
![Last Commit](https://img.shields.io/github/last-commit/lindseystead/foodbank-checkin-portfolio)

**Live Demo:** [Client Check-In](https://foodbank-checkin-tan.vercel.app/) | [Admin Dashboard](https://foodbank-checkin.vercel.app/login)

> **Note:** This repository contains the frontend applications only (Client App + Admin Dashboard). The backend API is proprietary and not included in this repository.

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Why This Project Matters](#-why-this-project-matters)
- [My Role](#-my-role-solo-developer)
- [Screenshots](#-screenshots)
- [By The Numbers](#-by-the-numbers)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Security Implementation](#-security-implementation)
- [Database Design](#-database-design)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Performance Improvements](#-performance-improvements)
- [Engineering Skills Demonstrated](#-engineering-skills-demonstrated)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Testing the System](#-testing-the-system)
- [Code Access](#-code-access)
- [License & Intellectual Property](#-license--intellectual-property)
- [Acknowledgments](#-acknowledgments)

---

## 📌 For Hiring Managers — Start Here

If you're reviewing this project for a technical role:

1. **View the [Architecture](#-architecture) section** - See the swappable N-tier backend design
2. **Check the [My Role](#-my-role-solo-developer) section** - Understand solo development scope
3. **Test the [live demo](#-testing-the-system) using the step-by-step instructions**
4. **Review the [Engineering Skills](#-engineering-skills-demonstrated) list** - See technical competencies
5. **Request [full code access](#-code-access) for deeper evaluation** - Complete codebase available upon request

---

## 🎯 Overview

Production-ready full-stack system that reduces client check-in time from 15+ minutes to under 5 minutes. Features QR code workflow, multi-language support (7 languages), CSV-first architecture, and real-time analytics dashboard.

**Impact:**
- 67% reduction in check-in time per client
- Eliminated manual data entry errors through automated tracking
- WCAG 2.1 AA accessible design
- PIPEDA-compliant privacy (24-hour auto-purge)

---

## 💡 Why This Project Matters

- **Designed for high-volume, time-sensitive nonprofit operations** - Handles real-world food bank check-in workflows with efficiency and reliability
- **Adheres to PIPEDA privacy law and WCAG 2.1 AA accessibility** - Compliant with Canadian privacy regulations and international accessibility standards
- **Built with enterprise-grade architecture (swappable N-tier)** - Used in real government and nonprofit tech, demonstrating production-ready design patterns

---

## 👩‍💻 My Role (Solo Developer)

I designed and built this entire system end-to-end:

- **Architecture & System Design** - Swappable N-tier architecture, CSV-first approach, Link2Feed RESTful API ready
- **Frontend Development** - React/TypeScript client app and admin dashboard (21,628+ lines of code)
- **Backend Design** - Node.js/Express RESTful API with 31 endpoints across 10 route modules
- **Security & Privacy Compliance** - PKCE authentication, CORS protection, PIPEDA-compliant 24-hour auto-purge
- **UX Design & Accessibility** - WCAG 2.1 AA compliant, multi-language support (7 languages), responsive design
- **Deployment** - Vercel (frontend) + Railway (backend) with CI/CD configuration
- **Documentation, Testing, QA** - Comprehensive testing (Vitest + Cypress), technical documentation, code quality standards

---

## 📸 Screenshots

<details>
  <summary>📸 Click to Expand Screenshots (14 images)</summary>

### Client Check-In Application

#### Welcome & Language Selection
![Client Welcome Landing](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/client-welcome-landing.png)
*Multi-language welcome screen with language selection (7 languages supported)*

![Language Selection](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/client-language-selection.png)
*Language selection interface with persistent preference*

![Check-In Form](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/client-check-in-form.png)
*5-step check-in form with appointment verification*

![Mobile Responsive](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/client-mobile-responsive.png)
*Fully responsive mobile interface for on-the-go check-ins*

### Admin Dashboard

#### Admin Access & Configuration
![Admin Login](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/admin-login.png)
*Admin dashboard login with Supabase authentication*

![CSV Upload](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/admin-csv-upload.png)
*CSV upload interface for importing Link2Feed appointment data*

![Link2Feed Configuration](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/admin-link2feed-config.png)
*Link2Feed RESTful API configuration (swappable backend architecture)*

![Check-Ins Page](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/admin-check-ins-page.png)
*Real-time check-ins dashboard with filtering and search*

![Client Detail](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/admin-client-detail.png)
*Detailed client information and check-in history*

![Recent Check-Ins](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/admin-recent-check-ins.png)
*Recent check-ins view with timestamps and status*

![Admin Settings](https://raw.githubusercontent.com/lindseystead/foodbank-checkin-portfolio/main/assets/admin-settings.png)
*Admin settings and system configuration*

</details>

---

## 📊 By The Numbers

| Metric | Value |
|--------|-------|
| **Codebase** | 21,628+ lines of TypeScript |
| **API Endpoints** | 31 RESTful endpoints across 10 route modules |
| **React Components** | 28 components (11 client + 17 admin) |
| **Languages** | 7-language internationalization support |
| **Time Reduction** | 67% reduction in check-in time |
| **Accessibility** | WCAG 2.1 AA compliant |
| **Privacy** | PIPEDA-compliant (24-hour auto-purge) |

---

## 🏗️ Architecture

**CSV-First, Link2Feed-Ready, Swappable N-Tier Architecture**

### Architecture Overview

- **CSV-first architecture** - Works immediately with Link2Feed CSV exports (no API access required)
- **Swappable N-tier architecture** - Modular design allows swapping backend implementations (CSV → Link2Feed RESTful API)
- **Link2Feed RESTful API ready** - Backend designed for seamless integration with Link2Feed RESTful API when available
- **Scalable multi-location** - Built to handle multiple locations and high-volume check-ins simultaneously

### System Architecture

```
┌─────────────────────┐
│  Client App        │  React 18 | TypeScript | Chakra UI
│  (Check-In)        │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  RESTful API        │  Node.js | Express | TypeScript
│  (Backend)          │  Supabase | PostgreSQL
│                     │
│  Swappable Backend: │
│  • CSV Processing   │  ← Current Implementation
│  • Link2Feed API    │  ← Ready for Integration
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Admin Dashboard    │  React 18 | TypeScript | Chakra UI
│  (Analytics)        │
└─────────────────────┘
```

### Swappable Backend Architecture

The system uses a **swappable N-tier architecture** that allows seamless backend swapping:

1. **Current Implementation (CSV-First):**
   - Processes Link2Feed CSV exports directly
   - No API access required
   - Immediate deployment capability
   - Works with standard CSV file format

2. **Link2Feed RESTful API Ready:**
   - Backend designed for future Link2Feed RESTful API integration
   - Modular architecture allows swapping CSV processor for API client
   - Same frontend interfaces, different backend implementation
   - Zero frontend changes required when switching backends

### Key Design Decisions

- **Swappable N-Tier:** Modular backend allows swapping CSV processing for Link2Feed RESTful API without frontend changes
- **CSV-First:** Immediate deployment without API dependencies
- **Link2Feed-Ready:** Architecture designed for seamless Link2Feed RESTful API integration
- **TypeScript:** 100% type safety across frontend and backend
- **Supabase Auth:** PKCE flow for secure authentication
- **Privacy by Design:** 24-hour auto-purge of all PII
- **Real-time Updates:** Smart polling with Page Visibility API (no WebSockets needed)

---

## 🛠️ Tech Stack

**Frontend:**
- React 18, TypeScript
- Chakra UI
- i18next (7 languages, 1,668 lines of translations)
- React Router, Vite
- Supabase Auth (PKCE flow)

**Backend:**
- Node.js, Express, TypeScript
- RESTful API (31 endpoints across 10 route modules)
- **Swappable N-tier architecture** - CSV processing (current) or Link2Feed RESTful API (ready)
- Supabase, PostgreSQL
- In-memory data store with 24-hour auto-purge
- **Link2Feed RESTful API ready** - Backend designed for seamless Link2Feed API integration
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

---

## 🔒 Security Implementation

- ✅ **Authentication:** Supabase with PKCE flow
- ✅ **Authorization:** Protected routes (admin-only access)
- ✅ **Input Validation:** Client-side and server-side validation
- ✅ **CORS Protection:** Configured for secure cross-origin requests
- ✅ **Rate Limiting:** 200 requests per 15 minutes per IP
- ✅ **Secure Headers:** XSS protection and security headers
- ✅ **Privacy Compliance:** PIPEDA-compliant with 24-hour auto-purge

---

## 🗄️ Database Design

**In-Memory Data Store with 24-Hour Auto-Purge**

### Design Overview
- **In-Memory Storage:** Fast access for check-in operations
- **Auto-Purge:** All PII automatically deleted after 24 hours
- **PostgreSQL Integration:** Supabase for authentication and user management
- **CSV Processing:** Direct CSV import without database dependencies

### Key Design Decisions
- **Privacy by Design:** No PII retention after 24 hours (PIPEDA compliance)
- **CSV-First:** Works immediately with CSV exports, no database required
- **Scalability:** Multi-location architecture supports concurrent operations
- **Data Integrity:** Validation and error handling throughout

### Database Features
- User authentication via Supabase
- Session management
- Check-in data processing
- Analytics data aggregation
- 24-hour automatic data purging

---

## 🧪 Testing & Quality Assurance

**Comprehensive testing approach ensuring production-ready reliability.**

### Testing Methodology
- **Unit Testing:** Vitest for component and function testing
- **E2E Testing:** Cypress for end-to-end workflow testing
- **Type Safety:** 100% TypeScript with strict mode
- **Code Quality:** Comprehensive error handling with graceful fallbacks
- **Performance Testing:** Code splitting, lazy loading, memoization

### Test Coverage
✅ **Client App:** 5-step check-in flow, QR code scanning, multi-language support  
✅ **Admin Dashboard:** CSV upload, analytics, user management  
✅ **API Integration:** RESTful endpoint consumption, error handling  
✅ **Authentication:** Supabase PKCE flow, protected routes  
✅ **Accessibility:** WCAG 2.1 AA compliance testing  
✅ **Performance:** Lazy loading, code splitting, memoization  

### Quality Metrics
- **Code Quality:** 100% TypeScript with strict mode
- **Security:** PKCE authentication, CORS protection, rate limiting
- **Performance:** Optimized with code splitting and lazy loading
- **Accessibility:** WCAG 2.1 AA compliant design
- **Privacy:** PIPEDA-compliant with 24-hour auto-purge

---

## 📈 Performance Improvements

- **Check-in Time:** Reduced from 15+ minutes to under 5 minutes
- **Time Savings:** 67% reduction in check-in time per client
- **Data Accuracy:** Eliminated manual data entry errors through automated tracking
- **Staff Efficiency:** Volunteers can focus on serving clients instead of paperwork

---

## 💼 Engineering Skills Demonstrated

- **Full-Stack Development:** React/TypeScript frontends + Node.js/Express backend
- **Backend Architecture:** Swappable N-tier architecture, RESTful API design, data management, security implementation
- **Link2Feed Integration:** Backend designed for Link2Feed RESTful API integration (swappable with CSV processing)
- **API Integration:** RESTful API consumption with error handling
- **Database Design:** In-memory data store with auto-purge, data integrity
- **Security:** Authentication, authorization, CORS, input validation, rate limiting
- **UI/UX Design:** Accessible, responsive, multi-language support
- **DevOps:** Vercel + Railway deployment, environment management
- **Testing:** Unit and E2E testing setup
- **Documentation:** Technical specs, user guides, code comments
- **TypeScript:** 100% type-safe codebase with strict mode
- **Architecture Patterns:** Swappable N-tier, CSV-first, Link2Feed RESTful API ready design

---

## 📁 Project Structure

```
foodbank-checkin/
├── client/           # Client-facing check-in app (7,515 lines)
│   ├── src/
│   │   ├── pages/           # 5-step check-in flow
│   │   ├── components/      # Reusable UI components
│   │   ├── common/            # Shared config (i18n, theme, API)
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

---

## 🚀 Quick Start

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

---

## 🧪 Testing the System

**Live Demo Available:**

- **Client Check-In**: [https://foodbank-checkin-tan.vercel.app/](https://foodbank-checkin-tan.vercel.app/)
- **Admin Dashboard**: [https://foodbank-checkin.vercel.app/login](https://foodbank-checkin.vercel.app/login)

### Step-by-Step Testing Instructions

#### Step 1: Access Admin Dashboard
1. Navigate to: [https://foodbank-checkin.vercel.app/login](https://foodbank-checkin.vercel.app/login)
2. **Login with Supabase Admin Credentials:**
   - Email: `admin@example.com`
   - Password: `testing123`
   - *Note: This is a test account for portfolio review purposes*

#### Step 2: Prepare CSV File
1. Download the sample CSV file: [`docs/sample-appointments.csv`](docs/sample-appointments.csv)
2. **Update the dates:**
   - Open the CSV file in Excel, Google Sheets, or a text editor
   - Change all `Pick Up Date` values to **today's date**
   - **Important:** Set times between **9:00 AM - 6:00 PM** (operational hours)
   - Format: `YYYY-MM-DD @ HH:MM AM/PM` (e.g., `2025-01-15 @ 2:30 PM`)
   - Save the updated CSV file

#### Step 3: Upload CSV to Admin Dashboard
1. **During operational hours (9:00 AM - 6:00 PM):**
   - After logging into the Admin Dashboard, navigate to the **CSV Upload** page
   - Upload your prepared CSV file
   - The system will process and populate the check-in appointments
   - Verify the appointments appear in the dashboard

#### Step 4: Test Client Check-In
1. Navigate to the **Client Check-In** app: [https://foodbank-checkin-tan.vercel.app/](https://foodbank-checkin-tan.vercel.app/)
2. **Use credentials from your uploaded CSV:**
   - Enter the **last name** (from the `Last Name` column in your CSV)
   - Enter the **phone number** (from the `Phone Number` column in your CSV)
   - The system will match the client and allow check-in
3. Complete the 5-step check-in flow to verify the entire process

### Important Notes

- ⏰ **Operational Hours:** CSV uploads and check-ins work during **9:00 AM - 6:00 PM** only
- 📅 **Date Requirements:** All CSV appointment dates must match **today's date** for the system to recognize them
- 📱 **Phone Format:** Use the exact phone number format from your CSV (with or without dashes/spaces)
- 🔍 **Name Matching:** Last names are case-sensitive - use the exact spelling from your CSV
- ✅ **Verification:** After uploading CSV, verify appointments appear in the Admin Dashboard before testing check-in

---

## 🔐 Code Access

**This is proprietary software.** Source code is available for portfolio review and technical evaluation.

**For Recruiters & Hiring Managers:**
- ✅ **Portfolio Review:** Code available for technical skills assessment
- ✅ **Code Inspection:** Full codebase accessible for evaluation
- ✅ **Interview Discussion:** This project can be discussed in interviews
- 📧 **Request Access:** Contact info@lifesavertech.ca for repository access

**For Commercial Use:**
- This software is proprietary and available for licensing
- Commercial use, deployment, or distribution requires a license
- Licensing inquiries: Lifesaver Technology Services (info@lifesavertech.ca)

---

## 📄 License & Intellectual Property

**Intellectual Property:** This project was designed, created, and implemented by **Lindsey D. Stead** and is the intellectual property of Lindsey D. Stead.

**Copyright © 2025 Lindsey D. Stead. All Rights Reserved.**

**Portfolio Project** - This repository is for portfolio demonstration purposes only.

**For Recruiters & Hiring Managers:**
- ✅ **Portfolio Review:** Feel free to review this code for evaluation purposes
- ✅ **Code Inspection:** You may inspect the codebase to assess technical skills
- ✅ **Interview Discussion:** This project can be discussed in interviews

**For Commercial Use:**
- This software is proprietary and available for licensing upon request
- Commercial use, deployment, or distribution requires a license
- **Licensing inquiries:** Lifesaver Technology Services (info@lifesavertech.ca)

---

## 🙏 Acknowledgments

- **Dr. Kevin O'Neil** - Software Engineering Professor and Capstone Supervisor at Thompson Rivers University
- **Food bank organizations** - For providing real-world context and feedback
- **Thompson Rivers University** - For academic guidance and capstone opportunity

---

**Built with ❤️ for streamlining food bank operations and improving client service efficiency.**

