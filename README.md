# 🍎 Foodbank Check-In System

> **Portfolio Project** | Full-Stack Capstone Project (21,628+ lines TypeScript) | Production-Ready

**TL;DR:** Production-ready full-stack system reducing check-in time from 15+ minutes to under 5 minutes. Built entirely solo as capstone project: React 18/TypeScript frontends + Node.js/Express RESTful API backend. QR code workflow, 7-language support, CSV-first architecture. Deployed demo ready for licensing.

🌐 **Live Demo:** [Client Check-In](https://foodbank-checkin-tan.vercel.app/) | [Admin Dashboard](https://foodbank-checkin.vercel.app/login)

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

**DevOps & Deployment:**
- Vercel (frontend hosting)
- Railway (backend hosting)
- CI/CD ready
- Environment-based configuration

**Features:**
- QR code workflow (no dedicated hardware required)
- Real-time analytics dashboard
- CSV-first data processing
- Multi-language support (7 languages)
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

**What This Demonstrates:**
- Full software engineering lifecycle (requirements → design → implementation → deployment)
- Agile methodology implementation
- Solo full-stack development capabilities
- Production deployment and DevOps skills
- Real-world problem-solving

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
- **Welcome & Language Selection** - 7-language support
- **Check-In Process** - 5-step workflow (Landing → Initial Check-In → Special Requests → Appointment Details → Confirmation)
- **Mobile Responsive** - Works seamlessly on phones, tablets, and kiosks

### Admin Dashboard
- **Real-Time Analytics** - Bar charts, hourly breakdown, peak hour identification
- **Check-In Management** - Search, filter, status management, print tickets
- **CSV Upload** - Drag-and-drop with intelligent column detection
- **Client Management** - Full CRUD operations, appointment rebooking

---

## 🚀 Quick Start

**Prerequisites:**
- Node.js 18+ and npm
- Backend API running (not included in this repository)

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

## 🧪 Testing

**Test Infrastructure:**
- Vitest-ready: Frontend unit testing setup
- Cypress-ready: End-to-end testing setup

**Running Tests:**
```bash
# Admin frontend unit tests
cd admin && npm test

# Client frontend unit tests
cd client && npm test
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

## 📄 License

**Portfolio Project** - This repository is for portfolio demonstration purposes only.

This is proprietary software - no license is granted for use, copying, modification, distribution, or commercial exploitation.

For licensing inquiries: info@lifesavertech.ca

---

## 🙏 Acknowledgments

- **Dr. Kevin O'Neil** - Software Engineering Professor and Capstone Supervisor at Thompson Rivers University
- **Food bank organizations** - For providing real-world context and feedback
- **Thompson Rivers University** - For academic guidance and capstone opportunity

---

> *"Every line of code serves a purpose: making food bank operations more efficient for staff and clients."*

