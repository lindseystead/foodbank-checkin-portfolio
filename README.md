# 🍎 Foodbank Check-In System

> **Portfolio Project** | Full-Stack Capstone Project (21,628+ lines TypeScript) | Production-Ready

**TL;DR:** Production-ready full-stack system reducing check-in time from 15+ minutes to under 5 minutes. Built entirely solo as capstone project: React 18/TypeScript frontends + Node.js/Express RESTful API backend. QR code workflow, 7-language support, CSV-first architecture. Deployed demo ready for licensing.

🌐 **Live Demo:** [Client Check-In](https://foodbank-checkin-tan.vercel.app/) | [Admin Dashboard](https://foodbank-checkin.vercel.app/login)

> **📝 Portfolio Project**: This repository contains the **frontend applications only** (Client App + Admin Dashboard) from my capstone project. **The backend API is proprietary and NOT included in this repository.** This is a portfolio demonstration - the backend code is not publicly available.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosted-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)
[![Code Quality](https://img.shields.io/badge/Code-Quality-blue)](README.md#-technical-excellence)
[![Tests](https://img.shields.io/badge/Tests-Vitest%20%7C%20Cypress-green)](README.md#-testing)

![visitor badge](https://visitor-badge.laobi.icu/badge?page_id=lindseystead.foodbank-checkin-portfolio)

---

## 🎯 Key Highlights

- **21,628+ lines** of production TypeScript code
- **31 RESTful API endpoints** across 10 route modules
- **28 React components** (11 client + 17 admin)
- **7-language support** (English, French, Spanish, Chinese, Hindi, Arabic, Punjabi)
- **1,668 lines** of translations (i18next)
- **67% reduction** in check-in time (15+ min → under 5 min)
- **Production-ready** system deployed on Vercel + Railway
- **WCAG 2.1 AA** accessible design
- **PIPEDA-compliant** privacy (24-hour auto-purge)

---

## 🏗️ Architecture

**CSV-First, Link2Feed-Ready Architecture**

- **CSV-first architecture** - Works immediately with Link2Feed CSV exports (no API access required)
- **N-tier architecture** - Separate client app, admin dashboard, and RESTful API backend
- **Link2Feed-ready** - Architecture designed for future Link2Feed RESTful API integration
- **Scalable multi-location** - Built to handle multiple locations and high-volume check-ins simultaneously

**System Architecture:**
```
Client App (React/TypeScript) ↔ RESTful API (Node.js/Express) ↔ Admin Dashboard (React/TypeScript)
```

---

## 🚀 Tech Stack

**Frontend:**
- React 18, TypeScript, Chakra UI
- i18next (7 languages, 1,668 lines of translations)
- React Router, Vite
- Supabase Auth (PKCE flow)

**Backend:**
- Node.js, Express, TypeScript
- RESTful API (31 endpoints across 10 route modules)
- Supabase, PostgreSQL
- In-memory data store with 24-hour auto-purge
- **Note:** Backend API is proprietary and not included in this repository (see top note)

**DevOps & Deployment:**
- Vercel (frontend hosting)
- Railway (backend hosting)
- CI/CD ready
- Environment-based configuration

**Features:**
- QR code workflow (no dedicated hardware required)
- Real-time analytics dashboard
- CSV-first data processing
- **Multi-language support** - 7 languages (English, French, Spanish, Chinese, Hindi, Arabic, Punjabi) with 1,668 lines of translations
- **i18next internationalization** - Persistent language selection, full UI translation
- WCAG 2.1 AA accessible design
- PIPEDA-compliant privacy

---

## 📊 Measurable Impact

**Performance Improvements:**
- **Check-in Time:** Reduced from 15+ minutes to under 5 minutes
- **Time Savings:** 67% reduction in check-in time per client
- **Data Accuracy:** Eliminated manual data entry errors through automated tracking
- **Staff Efficiency:** Volunteers can focus on serving clients instead of paperwork

**System Metrics:**
- **Codebase:** 21,628 lines of TypeScript (7,515 client + 14,113 admin)
- **API Endpoints:** 31 RESTful endpoints across 10 route modules
- **Components:** 28 React components (11 client + 17 admin)
- **Languages:** 7 languages with 1,668 lines of translations
- **Architecture:** CSV-first with Link2Feed API-ready design

---

## 🎓 Academic Context

**Capstone Project** - Thompson Rivers University  
**Degree:** Bachelor of Computing Science (with Distinction)  
**Supervisor:** Dr. Kevin O'Neil (Software Engineering Professor)  
**Timeline:** 6 months solo development  
**Status:** Production-ready, deployed demo

---

## 🌟 What Makes This Special

**Solo Development:**
- Designed and built entirely by me from the ground up
- Full-stack implementation: React/TypeScript frontends + Node.js/Express backend
- Complete system architecture and data management design
- Security implementation and privacy compliance
- Deployment and DevOps configuration

**Technical Excellence:**
- **Type Safety:** 100% TypeScript codebase with strict mode
- **Testing:** Vitest unit tests, Cypress E2E tests
- **Error Handling:** Comprehensive try-catch blocks with graceful fallbacks
- **Performance:** Code splitting, lazy loading, memoization
- **Security:** CORS protection, input validation, Supabase authentication
- **Accessibility:** WCAG 2.1 AA compliant design
- **Privacy:** PIPEDA-compliant with 24-hour auto-purge

**Problem-Solving:**
- **Real-time updates without WebSockets** - Implemented smart polling with Page Visibility API
- **CSV-first architecture** - Enables immediate deployment without API dependencies
- **Multi-language support** - 7 languages with persistent language selection
- **Privacy compliance** - 24-hour auto-purge system for PIPEDA compliance
- **Scalability** - Multi-location architecture built from the ground up
- **QR code workflow** - Eliminates need for expensive kiosk hardware

---

## 📸 Screenshots

### Client Application

#### Welcome & Language Selection
![Client Welcome Landing](assets/client-welcome-landing.png)
*Welcome page with language selection - clients can choose from 7 languages*

![Client Language Selection](assets/client-language-selection.png)
*Language selection interface supporting English, French, Spanish, Chinese, Hindi, Arabic, and Punjabi*

#### Check-In Process
![Client Check-In Form](assets/client-check-in-form.png)
*Initial check-in form - clients enter phone number and last name to verify their appointment*

![Client Special Requests](assets/client-special-requests.png)
*Special dietary requests page - clients can specify dietary preferences, allergies, and accommodation needs*

![Client Appointment Details](assets/client-appointment-details.png)
*Appointment details page - clients review their scheduled appointment information*

![Client Confirmation](assets/client-confirmation.png)
*Confirmation page - clients receive confirmation with their next appointment details*

#### Mobile Responsive Design
![Client Mobile Responsive](assets/client-mobile-responsive.png)
*Mobile-responsive design - the client application works seamlessly on phones, tablets, and kiosks*

### Admin Dashboard

#### Authentication & Configuration
![Admin Login](assets/admin-login.png)
*Admin login page - secure authentication using Supabase with PKCE flow*

![Admin Link2Feed Config](assets/admin-link2feed-config.png)
*Link2Feed API configuration - admin can configure Link2Feed integration settings*

#### Dashboard & Analytics
![Admin Recent Check-Ins](assets/admin-recent-check-ins.png)
*Recent check-ins feed - live feed of check-in activity with status badges and completion times*

#### Check-In Management
![Admin Check-Ins Page](assets/admin-check-ins-page.png)
*All check-ins page - comprehensive view of all check-ins with search, filter, and status management*

![Admin Client Detail](assets/admin-client-detail.png)
*Client detail page - full client profile view with edit capabilities and check-in history*

#### Data Management
![Admin CSV Upload](assets/admin-csv-upload.png)
*CSV upload page - upload daily appointment CSV files from Link2Feed with upload statistics*

![Admin Settings](assets/admin-settings.png)
*Settings page - system configuration, Link2Feed integration, and system status*

---

## 🎮 Try It Out

**Live Demo Available:**
- **Client Check-In**: [https://foodbank-checkin-tan.vercel.app/](https://foodbank-checkin-tan.vercel.app/)
- **Admin Dashboard**: [https://foodbank-checkin.vercel.app/login](https://foodbank-checkin.vercel.app/login)
  - **Test Admin Credentials for Supabase Authentication:**
    - Email: `admin@example.com`
    - Password: `testing123`
  - Note: This is a test account for portfolio review and demonstration purposes

**⚠️ Important: Testing the System**

To test the complete check-in flow, you'll need:

1. **Download the sample CSV file**: [`docs/sample-appointments.csv`](docs/sample-appointments.csv)
2. **Update the dates**: Change all `Pick Up Date` values to match **today's date** (format: `YYYY-MM-DD @ HH:MM AM/PM`)
   - Example: If today is November 7, 2025, change `2025-04-14 @ 9:00 AM` to `2025-11-07 @ 9:00 AM`
   - The system validates check-ins based on today's date, so appointments must be for today to populate the check-ins for that day and it must be during the correct hours for the system validation work
3. **Upload to Admin Dashboard**: 
   - Log in to the admin dashboard using the test credentials above
   - Navigate to the CSV Upload page
   - Upload the updated CSV file
4. **Test Client Check-In**: 
   - Open the client check-in app: [https://foodbank-checkin-tan.vercel.app/](https://foodbank-checkin-tan.vercel.app/)
   - Use the phone numbers and last names from the CSV to test the client check-in flow
   - Complete the 5-step check-in process

**📄 Sample CSV File:** See [`docs/sample-appointments.csv`](docs/sample-appointments.csv) for an example CSV file format compatible with Link2Feed exports. All data is sanitized/anonymized for demonstration purposes. **Note:** The sample CSV contains hardcoded dates (`2025-04-14`). To test the system, you must update all `Pick Up Date` values to match **today's date** before uploading.

---

## 🚀 Quick Start

> **⚠️ Important**: This repository contains **frontend applications only** (Client App + Admin Dashboard). The backend API is **proprietary and not included** in this repository. The backend is deployed separately and not available for public access.

**Prerequisites:**
- Node.js 18+ and npm
- Backend API running (proprietary - not included in this repository - see note above)

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

## 🔒 Security & Privacy

**Security Measures:**
- Supabase authentication with PKCE flow
- Protected routes (admin-only access)
- Input validation (client-side and server-side)
- CORS protection
- Rate limiting (200 req/15min per IP)
- Secure headers (XSS protection)

**Privacy Compliance:**
- **PIPEDA-compliant** - 24-hour auto-purge of all PII
- **Privacy by Design** - No PII retention after 24 hours
- **Data Residency** - Supports Canadian data residency options

**No Secrets Committed:**
- All credentials loaded from environment variables
- `.gitignore` properly configured
- Demo credentials for portfolio review only

---

## 📁 Project Structure

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

---

## 🎯 Engineering Skills Demonstrated

✅ **Full-Stack Development:** React/TypeScript frontends + Node.js/Express backend  
✅ **Backend Architecture:** RESTful API design, data management, security implementation  
✅ **API Integration:** RESTful API consumption with error handling  
✅ **Database Design:** In-memory data store with auto-purge, data integrity  
✅ **Security:** Authentication, authorization, CORS, input validation, rate limiting  
✅ **UI/UX Design:** Accessible, responsive, multi-language support  
✅ **DevOps:** Vercel + Railway deployment, environment management  
✅ **Testing:** Unit and E2E testing setup  
✅ **Documentation:** Technical specs, user guides, code comments  
✅ **Project Management:** From capstone to production deployment

---

## 🏆 Achievements

- 🎓 **Graduated with Distinction** from Thompson Rivers University
- 👩‍💻 **Only mother** in Computing Science program
- 📊 **21,628+ lines** of production TypeScript code
- 🚀 **3+ production-ready applications** deployed
- 🔐 **PIPEDA-compliant** privacy design implemented
- ♿ **WCAG 2.1 AA** accessible applications built
- 🌍 **7-language** internationalization support created
- ⚡ **67% reduction** in check-in time achieved

---

## 👤 Developer

**Lindsey Stead** - Full-Stack Developer

- 💼 [LinkedIn](https://www.linkedin.com/in/lindseystead/)
- 🐙 [GitHub](https://github.com/lindseystead)
- 📧 Open to opportunities and collaborations

**About Me:**
I'm a full-stack developer who builds production-ready systems that solve real problems. I recently graduated with Distinction from Thompson Rivers University, where I built this 21,628+ line food-bank check-in system that reduced wait times from 15+ minutes to under 5 minutes. I'm looking to join a collaborative software team where I can contribute my experience and help build technology that makes a real impact.

---

## 📄 License & Intellectual Property

**Intellectual Property:** This project was designed, created, and implemented by Lindsey D. Stead and is the intellectual property of Lindsey D. Stead.

**Copyright © 2025 Lindsey D. Stead. All Rights Reserved.**

**Portfolio Project** - This repository is for portfolio demonstration purposes only.

**For Recruiters & Hiring Managers:**
- ✅ **Portfolio Review:** Feel free to review this code for evaluation purposes
- ✅ **Code Inspection:** You may inspect the codebase to assess technical skills
- ✅ **Interview Discussion:** This project can be discussed in interviews

**For Commercial Use:**
- This software is proprietary and available for licensing upon request
- Commercial use, deployment, or distribution requires a license
- Licensing inquiries: Lifesaver Technology Services (info@lifesavertech.ca)


**Note:** This demonstrates both technical skills and business acumen - the ability to build production-ready software and understand intellectual property rights.

---

## 🙏 Acknowledgments

- **Dr. Kevin O'Neil** - Software Engineering Professor and Capstone Supervisor at Thompson Rivers University
- **Food bank organizations** - For providing real-world context and feedback
- **Thompson Rivers University** - For academic guidance and capstone opportunity

---

> *"Every line of code serves a purpose: making food bank operations more efficient for staff and clients."*

