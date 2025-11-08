# 🍎 Foodbank Check-In and Appointment System

> **Transforming Food Bank Operations: From Paper Chaos to Digital Efficiency**

🌐 **Live System**: [https://www.foodbank-checkin.ca/](https://www.foodbank-checkin.ca/)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosted-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Railway](https://img.shields.io/badge/Railway-Backend-0B0D0E?logo=railway&logoColor=white)](https://railway.app)
[![Proprietary](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

**A complete full-stack production system for food bank operations, transforming client check-in workflow from paper-based to digital efficiency.**

🌐 **Live Client Check-In**: [https://www.foodbank-checkin.ca/](https://www.foodbank-checkin.ca/)  
📊 **Admin Dashboard**: [Live admin panel](https://www.foodbank-checkin.ca/admin)

> **📝 Note**: This repository contains the **frontend applications only** (Client App + Admin Dashboard). The backend API is proprietary and not included in this repository. For backend licensing inquiries, contact lindsey@lifesavertech.ca

---

## 🚀 Quick Start

This repository contains the **frontend applications** for the Foodbank Check-In System:

1. **Client App** (`/client`) - React/TypeScript frontend for client check-in (7,515 lines)
2. **Admin Panel** (`/admin`) - React/TypeScript frontend for staff management (14,113 lines)
3. **Backend API** (`/backend`) - Node.js/Express/TypeScript API server (proprietary, not included)

Each frontend component has its own README with detailed setup instructions. See:
- [`client/README.md`](client/README.md) for client app setup
- [`admin/README.md`](admin/README.md) for admin panel setup

**Frontend Tech Stack:** React 18, TypeScript, Chakra UI, React Router, i18next, Vercel  
**Backend Tech Stack:** Node.js, Express, TypeScript, Supabase, Railway (proprietary)

---

## 🎮 Try It Out

**Live Demo Available:**
- **Client Check-In**: [https://www.foodbank-checkin.ca/](https://www.foodbank-checkin.ca/)
- **Admin Dashboard**: [https://www.foodbank-checkin.ca/admin](https://www.foodbank-checkin.ca/admin)
  - Test credentials available upon request for portfolio review
  - Contact: lindsey@lifesavertech.ca

**Code Review:**
- Frontend code is available in this repository
- Backend API code is proprietary (contact for licensing inquiries)

---

## 🏢 For Food Banks (Canada)

**Standalone check-in system designed to work directly with Link2Feed**

This is a standalone component that integrates seamlessly with your existing Link2Feed workflow. Simply export your daily appointments CSV from Link2Feed and upload it to get an immediate, fast, multilingual check-in experience with real-time admin dashboard—no API access required, no changes to your Link2Feed subscription needed.

**Key Benefits:**
- **Standalone Component**: Works independently alongside Link2Feed without replacing your case management system
- **Direct CSV Integration**: Uses Link2Feed's standard CSV export—no API contracts or subscriptions needed
- **Faster Operations**: 70% faster check-ins (15+ min → <5 min)
- **Multilingual**: Full support for 7 languages (English, French, Spanish, Chinese, Hindi, Arabic, Punjabi)
- **Accessible**: WCAG 2.1 AA compliant for inclusive service delivery
- **Privacy-First**: All operational data auto-deletes within 24 hours
- **Low Risk**: No vendor lock-in; works with your existing Link2Feed data export
- **Scalable**: Multi-location ready with per-location isolation

> Outcome: Enhanced check-in experience without disrupting your existing Link2Feed operations

---

## 🇨🇦 Data Hosting & Residency (Canada)

- **Frontends**: Hosted on Vercel (static assets via CDN)
- **Backend**: Configurable. Default US hosting (Railway) with strict 24-hour auto-purge; Canada-hosted backend available (AWS ca-central-1, GCP northamerica-northeast1, Fly.io YUL, Render Toronto)
- **Safeguards**: HTTPS, Helmet/CSP, rate limiting, CORS whitelist, input validation, no PII in logs, least-privilege access, MFA on providers
- **Disclosure**: Cross-border processing is disclosed to end users; data is encrypted in transit and automatically deleted within 24 hours

> Residency Option: Choose a Canada-region backend tier for organizations that require Canadian data residency.

---

## 🌟 What Makes This Special

- ✨ **Real-World Impact**: Production-ready system designed for food bank operations
- 🌍 **Multi-Language Support**: 7 languages (English, French, Spanish, Chinese, Hindi, Arabic, Punjabi)
- 📱 **Mobile-First**: Works seamlessly on phones, tablets, and kiosks
- 🔒 **Privacy by Design**: All data auto-purges after 24 hours
- 🏢 **Multi-Location**: Scalable architecture supporting multiple food bank locations
- ⚡ **Fast Check-In**: Typically under 5 minutes (vs ~15 minutes with paper)
- 🎨 **Accessible**: WCAG-compliant design for screen readers and keyboard navigation

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
![Admin Dashboard Analytics](assets/admin-dashboard-analytics.png)
*Real-time analytics dashboard - live charts showing collected, pending, and not collected appointments*

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

> 📹 **Video Demo Coming Soon**: A comprehensive video walkthrough of the system will be available shortly, demonstrating the complete client check-in flow and admin dashboard features.

---

## 📊 The Impact

### Before (Paper System)
- ❌ 15+ minute check-in times
- ❌ Lost paperwork and data entry errors
- ❌ Volunteers walking to and from vehicles in the elements spending hours on manual data entry
- ❌ No real-time visibility into operations
- ❌ Limited to single location

### After (Digital System)
- ✅ Under 5-minute check-in times
- ✅ Reduced data loss through automated tracking
- ✅ Staff can focus on serving clients
- ✅ Real-time dashboard showing all operations
- ✅ Support for multiple locations simultaneously

---

## 🏗️ System Architecture

### Three-Part System

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT CHECK-IN APP                      │
│  • Multilingual UI (3 languages)                           │
│  • Phone number + last name lookup                        │
│  • Special dietary requests                               │
│  • Instant next appointment generation                     │
│  • Mobile-friendly kiosk access                           │
└─────────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────────┐
│                   ADMIN DASHBOARD                          │
│  • Real-time check-in monitoring                          │
│  • CSV upload from Link2Feed                             │
│  • Client search and management                           │
│  • Analytics and reporting                                │
│  • Multi-location support                                │
└─────────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API                              │
│  • Node.js + Express + TypeScript                         │
│  • In-memory data store (24h auto-purge)                   │
│  • CSV processing with automatic parsing                  │
│  • Appointment scheduling (21-day cycle)                  │
│  • Ticket number generation                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### For Clients - Complete Check-In Flow

**Page 1: Landing & Language Selection**
- Welcome page with language selection
- 7 languages: English, French, Spanish, Chinese, Hindi, Arabic, Punjabi
- Persists language choice throughout session

**Page 2: Initial Check-In** 
- Enter phone number (auto-formatted)
- Enter last name
- Real-time validation
- **Assistance Button**: "Need Help?" button always visible for support

**Page 3: Special Dietary Requests**
- Multi-select dietary preferences (vegetarian, vegan, gluten-free, dairy-free, halal, kosher)
- Allergies tracking
- Unwanted foods
- Mobility assistance checkbox
- Diaper size selection (Tiny Bundles program)
- Additional notes
- **Assistance Button**: Available on every page

**Page 4: Appointment Details**
- Review current appointment date and time
- See formatted date (e.g., "Monday, October 27th at 9:00 AM")
- View appointment information
- Continue to confirmation

**Page 5: Confirmation**
- See next appointment (21 days out, formatted nicely)
- Success confirmation with auto-redirect after 10 seconds
- Completion status

### For Staff - Admin Dashboard Features

**Dashboard Page** - Main hub with 5 tabs:
1. **Analytics** - Real-time charts showing: Collected (green), Pending (blue), Not Collected (orange)
2. **Recent Check-Ins** - Live feed with completion time, status badges, filter by status
3. **Find Clients** - Search all CSV clients by name, phone, ID
4. **Clients List** - View all CSV upload data in table format
5. **Help Requests** - Live table of client assistance requests with status management

**All Check-Ins Page**:
- Complete list of all check-in records
- Search functionality
- Filter by status (Pending, Collected, Not Collected, etc.)
- **Print tickets** directly from the list
- View detailed check-in info
- Real-time updates

**Client Detail Page**:
- Full client profile view
- Edit all client fields
- Print ticket for specific client
- View full check-in history
- Special requests display

**CSV Upload Page**:
- Upload CSV from Link2Feed CSV export 
- View upload statistics (added vs duplicates)
- Date mismatch warnings
- Clear all data with confirmation

**Settings Page**:
- Link2Feed API configuration
- System status
- Clear configuration button
- Integration management

**Profile Page**:
- Admin user information
- Account details

### For the Organization
- **Privacy-First**: Auto-deletes all data after 24 hours
- **Cost-Effective**: No expensive database licenses needed
- **Scalable**: Easy to add new locations
- **Error-Free**: Eliminates manual data entry mistakes
- **Accessible**: WCAG 2.1 Level AA compliant
- **Performance Monitoring**: Vercel Speed Insights & Analytics built-in (client app)
- **Testing Suite**: Vitest, Cypress E2E, Newman and Postman API tests, Jest unit tests
- **Type Safety**: 100% TypeScript for reliability
- **Secure Authentication**: Supabase with PKCE flow, invite-only admin access
- **Session Management**: Auto-refresh tokens, persistent sessions, secure logout

---

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Chakra UI** for beautiful, accessible components
- **i18next** for multi-language support
- **React Router** for navigation
- **Vite** for lightning-fast builds
- **Supabase Auth**: Secure authentication with PKCE flow, auto-refresh tokens
- **Protected Routes**: Admin-only access control with session management

### Backend
- **Node.js + Express** for robust API
- **TypeScript** throughout for safety
- **In-memory storage** (Maps) - no database needed!
- **csv-parse** for CSV processing
- **Day.js** for timezone-aware date handling
- **Helmet**: Security headers for XSS protection, clickjacking prevention, and more
- **Express Rate Limit**: Protect against abuse with configurable rate limiting
- **Intelligent CSV Parser**: Automatically detects column variations (Location vs location vs Site)
- **Holiday Detection**: BC statutory holidays considered in scheduling
- **21-Day Cycle**: Automatic appointment generation following food bank policy
- **10 API Route Modules**: Check-in, status, CSV, tickets, special requests, Link2Feed, client search, editing, rebooking, help requests
- **Data Versioning**: Track data changes with version numbers
- **Automatic Purging**: Expired data cleanup runs on every request
- **Unified Store**: Single source of truth for all data

### Deployment
- **Vercel** for frontend hosting (static assets via CDN)
- **Railway** for backend hosting (configurable region)
- **Custom domains** for professional branding

---

## 📁 Project Structure

```
foodbank-checkin/
├── client/           # Client-facing check-in app
│   ├── src/
│   │   ├── pages/           # Check-in flow pages (5-step process)
│   │   ├── components/      # Reusable UI components
│   │   ├── common/          # Shared config (i18n, theme, API)
│   │   │   └── i18n.ts      # 7 language translations
│   │   └── lib/             # API integration and services
│   └── dist/                # Production build
│
├── admin/           # Staff / Admin dashboard
│   ├── src/
│   │   ├── pages/           # Dashboard, check-ins, CSV upload, settings
│   │   ├── components/      # Feature components (dashboard, CSV, clients)
│   │   │   └── features/    # Feature-specific components
│   │   ├── contexts/        # Auth context (Supabase)
│   │   └── lib/             # API integration with auth
│   └── dist/                 # Production build
│
└── backend/         # API server
    ├── src/
    │   ├── controllers/     # Business logic
    │   ├── routes/         # API endpoints
    │   ├── services/       # CSV processing
    │   ├── stores/         # In-memory data store
    │   └── utils/          # Scheduling, parsing
    └── dist/               # Compiled JS
```

---

## 🔑 Unique Selling Points

### 1. **Privacy by Design**
Data self-destructs after 24 hours. No permanent storage means no liability.

### 2. **Flexible Storage Options**
Uses in-memory storage (Maps) by default - simple, fast, and cost-effective. Can be configured with database connections (PostgreSQL, MySQL, MongoDB, etc.) for organizations requiring persistent storage.

### 3. **Standalone Component for Link2Feed**
Designed specifically to work directly with Link2Feed. Simply export your daily CSV and upload—no API access, no subscription changes, no disruptions to your existing workflow.

### 4. **Multi-Location Ready**
From day one, architected to support multiple locations with complete data isolation.

### 5. **Accessible to All**
Screen reader support, keyboard navigation, and large touch targets for all users.

### 6. **Volunteer-Friendly**
Very little staff and volunteer training required. Simple interface that anyone can use.

---

## 🎬 The Daily Workflow

### Morning Setup (5 minutes)
1. Staff exports today's appointments from Link2Feed
2. Staff log in using their Supabase-managed credentials and upload a CSV file containing that day's appointments to the admin dashboard
3. System automatically parses and stores client data

### Client Arrival (Under 5 minutes)
1. Client arrives for their scheduled appointment
2. Client scans the QR code displayed at the front of the building to begin check-in
3. Client enters phone number + last name to verify their appointment
4. Client fills out special dietary requests and accommodation needs
5. Client receives confirmation with next appointment details
6. Staff prints ticket for food distribution

### Throughout the Day
- Real-time dashboard shows all check-ins for a single day
- Analytics update automatically on an interval (15–60 seconds depending on the widget; paused on hover where applicable to prevent flickering)
- Staff can search for any client
- Status tracking (Pending, Collected, Not Collected)
- Performance metrics tracked via dedicated API endpoint

### End of Day
- All data automatically purges after 24 hours
- Privacy maintained
- Ready for tomorrow's operations

---

## 🛠️ Software Development Process

### Project Origin

This system was **independently developed** by Lindsey D. Stead as a **Bachelor of Computing Science capstone project** at **Thompson Rivers University (TRU)**. The project was created to solve real operational challenges faced by a local food bank, transforming their paper-based check-in process into a modern, efficient digital system.

### Development Journey

**From Concept to Production:**
- **Academic Foundation**: Started as COMP 4911 capstone project under the supervision of Dr. Kevin O'Neil
- **Real-World Problem**: Designed to address actual needs of a local food bank struggling with paper-based workflows
- **Full-Stack Development**: Built entirely from scratch - frontend, backend, and deployment infrastructure
- **Production Deployment**: Evolved from academic project to production system serving real clients daily
- **Continuous Improvement**: Iterative development with stakeholder feedback from food bank staff and volunteers

### Key Development Highlights

**Solo Development:**
- Entire system designed, developed, and deployed independently
- Full-stack implementation: React/TypeScript frontends, Node.js/Express backend
- Complete system architecture and database design
- Security implementation and privacy compliance
- Deployment and DevOps configuration

**Real-World Application:**
- Developed in collaboration with local food bank staff
- Tested with actual clients and volunteers
- Deployed to production and handling daily operations
- QR code integration for seamless client check-in at building entrance

**Customization & Extensibility:**
- **Highly Customizable**: System can be adapted for any food bank or organization
- **Database Integration Ready**: Architecture supports database connections (PostgreSQL, MySQL, MongoDB, etc.)
- **Extensible Features**: Modular design allows for additional features:
  - Integration with existing case management systems
  - Custom reporting and analytics
  - Multi-location support with centralized management
  - API integrations with third-party services
  - Custom branding and theming
  - Additional language support
  - Advanced notification systems (SMS, email, push notifications)

### Client Check-In Experience

**QR Code Workflow:**
1. Food bank displays QR code at the front entrance of the building
2. Clients arriving for appointments scan the QR code with their mobile device
3. QR code opens the check-in application directly in their browser
4. Clients complete the 5-step check-in process on their own device
5. Staff receive real-time updates on the admin dashboard
6. System generates ticket for food distribution

This approach eliminates the need for dedicated kiosk hardware and allows clients to use their own devices, making the system more accessible and cost-effective.

### Privacy & Security Implementation

**Privacy by Design:**
- **24-Hour Auto-Purge**: All operational data automatically deleted after 24 hours
- **In-Memory Storage**: No persistent database by default (can be configured with database)
- **Data Minimization**: Only collects necessary information for check-in operations
- **No PII in Logs**: Personal information never logged or stored permanently
- **Session-Based**: Client data exists only during active check-in session

**Security Measures:**
- **HTTPS Encryption**: All data transmission encrypted in transit
- **Rate Limiting**: Protection against abuse (200 requests per 15 minutes per IP)
- **CORS Protection**: Whitelist of approved origins only
- **Input Validation**: Comprehensive sanitization and validation of all inputs
- **Security Headers**: Helmet.js implementation for XSS protection, clickjacking prevention
- **Authentication**: Supabase PKCE flow for secure admin authentication
- **Protected Routes**: Route-level authentication for admin panel

### Canadian Data Residency Requirements

**For Canadian Organizations:**

The system is designed with **Canadian data residency compliance** in mind. For organizations that require data to remain within Canada:

**Backend Deployment Options (Canadian Servers):**
- **AWS Canada (ca-central-1)**: Montreal data center
- **Google Cloud Platform (northamerica-northeast1)**: Montreal region
- **Microsoft Azure Canada Central**: Toronto data center
- **Fly.io (YUL)**: Montreal region
- **Render (Toronto)**: Toronto data center

**Frontend Deployment:**
- **Vercel**: Global CDN with Canadian edge locations
- **Custom Domain**: Can be configured with Canadian hosting providers

**Compliance Considerations:**
- **PIPEDA Compliant**: Meets Canadian federal privacy law requirements
- **Data Residency**: Backend can be deployed exclusively on Canadian servers
- **Cross-Border Disclosure**: Clear documentation of data processing locations
- **Privacy Safeguards**: Multiple layers of security and privacy protection
- **24-Hour Retention**: Automatic data purge minimizes retention window

**Deployment Configuration:**
- Backend API must be deployed on a Canadian cloud provider for full data residency
- Environment variables configured to point to Canadian-hosted backend
- All data processing occurs within Canadian borders
- No cross-border data transmission for Canadian deployments

### Technical Architecture & Extensibility

**Current Architecture:**
- **In-Memory Storage**: Fast, simple, no database setup required
- **CSV-First Design**: Works immediately with Link2Feed exports
- **API-Ready**: Designed for future database integration

**Database Integration Options:**
- **PostgreSQL**: Full relational database support
- **MySQL/MariaDB**: Alternative relational database option
- **MongoDB**: NoSQL document database support
- **Supabase**: Integrated database and authentication
- **Custom Database**: Can be configured with any database system

**Additional Features Available:**
- Real-time notifications (SMS, email, push)
- Advanced analytics and reporting
- Multi-tenant architecture for multiple organizations
- Custom branding and white-labeling
- Integration with existing case management systems
- Automated appointment reminders
- Client history and tracking
- Inventory management integration
- Volunteer management features

### Customization for Organizations

The system is designed to be **highly customizable** for different food banks and organizations:

**Customization Options:**
- **Branding**: Custom logos, colors, and themes
- **Languages**: Add additional language support
- **Workflow**: Customize check-in steps and questions
- **Integration**: Connect with existing systems (Link2Feed, Salesforce, etc.)
- **Features**: Add organization-specific features and modules
- **Reporting**: Custom reports and analytics dashboards
- **Notifications**: Configure notification preferences and channels

**Implementation Process:**
1. Requirements gathering with organization stakeholders
2. System customization and configuration
3. Database setup (if required)
4. Integration with existing systems
5. Staff training and documentation
6. Deployment and go-live support
7. Ongoing maintenance and updates

---

## 📈 System Capabilities

- **Multi-Location Support**: Designed to support multiple locations with complete data isolation
- **Optimized Real-Time Updates**: Smart polling with Page Visibility API (30–120 second intervals, pauses when tab hidden, exponential backoff on errors)
- **Performance Metrics API**: Built-in tracking for check-ins, completion rates, and operational analytics
- **Improved Data Accuracy**: Automated tracking reduces manual entry errors
- **7 Languages** Client check-in feature supports English, French, Spanish, Chinese, Hindi, Arabic, and Punjabi
- **24-Hour Auto-Purge**: Privacy-first data retention
- **Low Operational Cost**: Efficient hosting (backend only)
- **Flexible Storage**: In-memory storage by default, database integration available
- **Operational Metrics**: Real-time metrics endpoint (`/api/checkin/metrics`) tracking daily operations, completion rates, average check-in times, and location-specific performance

---

## 🧪 Testing

### Test Infrastructure
- **Vitest-ready**: Frontend unit testing setup available
- **Cypress-ready**: End-to-end testing setup available
- **Newman-compatible**: API testing via Postman collections
- **Jest-compatible**: Backend unit tests can be added with Jest

### Running Tests

```bash
# Admin frontend unit tests (Vitest)
cd admin && npm test

# Client frontend unit tests (Vitest)
cd client && npm test

# Root testing suite (optional, Postman/Newman & perf scripts)
cd .. && npm run postman
cd .. && npm run perf:all
```

Note: No default backend test script is defined. Backend is Jest-compatible if you choose to add tests.

### Test Coverage
Test harnesses and scripts are provided; coverage depends on your deployment and added tests.

---

## 🔒 Privacy & Security

### Compliance Summary

**This system is PIPEDA-compliant with strong safeguards for cross-border data handling:**

✅ **Data Hosting**: Backend (Railway US East/Virginia), Frontend (Vercel US regions)  
✅ **Auto-Purge**: 24-hour automatic deletion on every API request  
✅ **Storage Type**: In-memory RAM only (no database, no disk writes)  
✅ **Security**: Controls include Helmet, rate limiting, CORS, input validation, and PKCE auth  
✅ **Browser Storage**: sessionStorage for temporary data (auto-clears on close)  
✅ **Transmission**: HTTPS encryption for all Canada→US data flows  
✅ **Transparency**: All data handling locations and practices disclosed  
✅ **Retention**: Maximum 24-hour window - no long-term storage  

**Implemented Controls**: Security measures are implemented in code and configurable per deployment.

---

### Data Hosting & Residency

**Frontend Hosting (Vercel):**
- Static assets served from Vercel's global CDN
- Compute regions: United States (closest to Canada)
- Edge locations worldwide for low-latency delivery

**Backend Hosting (Railway):**
- API server hosted on Railway infrastructure
- Current region: United States (primary deployment)
- **Note**: Railway operates in multi-region environments, with data processed in US-based centers

**Data Processing Location:**
- All personal information processed and temporarily stored in Railway's US-based backend infrastructure (US East/Virginia)
- Data transmission: Canada → US (Railway backend) with HTTPS encryption
- 24-hour automatic purge runs on every API request (check-in and status operations)
- No persistent database storage - data exists only in server RAM memory
- Auto-purge is auditable and automatic - no manual cleanup required

**Compliance Considerations:**
- PIPEDA requires disclosure of data processing locations (documented here)
- Data minimization (24-hour auto-purge) minimizes cross-border retention window
- Secure transmission (HTTPS) for all data transfers between Canada and US
- In-memory processing eliminates long-term residency concerns
- Automatic expiry prevents data accumulation beyond 24 hours

### Data Handling & Privacy Policy

**Data Collection:**
- Phone number (for appointment matching)
- Last name (for appointment matching)
- Dietary preferences (for food provision)
- Household information (for portion sizing)
- Special requests (mobility needs, allergies)

**Data NOT Collected:**
- ❌ Social Insurance Numbers
- ❌ Financial information
- ❌ Medical records (beyond dietary needs)
- ❌ Employment information
- ❌ Government ID numbers

**Data Retention:**
- All data automatically deleted after 24 hours
- No permanent storage or database
- Privacy by design architecture
- **No manual deletion required** - automatic purge

**Data Sharing:**
- ❌ No third-party sharing
- ❌ No marketing use
- ✅ Data used solely for daily operations
- ✅ Privacy by design implementation

### Security Measures

**Backend Security (Verified Implementation):**
- ✅ **Helmet Security Headers**: Content Security Policy (CSP), XSS protection, clickjacking prevention, MIME sniffing protection
- ✅ **Rate Limiting**: 200 requests per 15 minutes per IP (applies to all `/api/` routes)
- ✅ **CORS Protection**: Whitelist of approved origins only (localhost dev servers, Vercel subdomains, AWS deployment domains, and configured production domains)
- ✅ **Input Validation**: 
  - Phone numbers normalized (digits only for matching)
  - Names sanitized and trimmed
  - Email format validation (regex pattern)
  - CSV file type validation (`.csv` files only)
  - File size limits (10MB max for CSV uploads)
- ✅ **No Database**: Zero persistent storage reduces breach risk
- ✅ **In-Memory Storage**: Data exists only in server RAM, never written to disk
- ✅ **Automatic Expiry**: 24-hour purge runs on every API request (`/api/checkin`, `/api/status/day`)
- ✅ **Error Handling**: Comprehensive try-catch blocks with graceful fallbacks
- ✅ **Express Security**: JSON body parser with size limits, static file serving restrictions

**Frontend Security (Verified Implementation):**
- ✅ **Secure Authentication**: Supabase PKCE flow (Proof Key for Code Exchange)
- ✅ **Protected Routes**: Route-level authentication check before rendering
- ✅ **Session Management**: 
  - Auto-refresh tokens for persistent sessions
  - Secure logout with session cleanup
  - Session expiry detection
  - Persistent auth tokens in secure localStorage (admin only)
- ✅ **Browser Storage**:
  - **Client App**: sessionStorage for temporary form data (auto-cleared on browser close)
  - **Admin App**: localStorage only for Supabase auth tokens (persists across sessions)
  - No PII stored in browser storage
  - Data version tracking to prevent stale cache
- ✅ **Auto-Cleanup**: Clear All Data functionality preserves auth while wiping operational data
- ✅ **Client Security**: Client app explicitly disables auth persistence (`persistSession: false`, `autoRefreshToken: false`)

### Compliance

**PIPEDA Compliant (Canadian Federal Privacy Law):**
- ✅ **Accountability** - Food bank responsible for data, clear ownership documented
- ✅ **Limiting Collection** - Only necessary data collected (phone, name, dietary needs, household info)
- ✅ **Identifying Purposes** - Data used solely for daily check-in operations
- ✅ **Consent** - Clients implicitly consent by using check-in system
- ✅ **Limiting Use** - Single-use operational data only
- ✅ **Limiting Retention** - 24-hour automatic purge on every API request
- ✅ **Accuracy** - Clients verify their own information during check-in
- ✅ **Safeguards** - Multiple security layers (Helmet, rate limiting, CORS, input validation)
- ✅ **Openness** - Clear disclosure of data handling practices and hosting locations
- ✅ **Individual Access** - Admin can retrieve client info for verification
- ✅ **Challenging Compliance** - Food bank contact available for privacy concerns
- ✅ **Transborder Data Flows** - Data processing location disclosed (US-based with strong safeguards)

**Data Residency & Cross-Border Considerations:**

**Default Deployment (US-Based):**
- Backend infrastructure hosted in United States (Railway US East/Virginia)
- Frontend served via Vercel's global CDN (US compute regions)
- **PIPEDA-Compliant Safeguards:**
  - 24-hour automatic data purge runs on every check-in and status request
  - No persistent database storage (in-memory RAM only, data never written to disk)
  - Secure HTTPS encryption for all Canada→US transmissions
  - Privacy by design architecture (data minimization from the start)
  - Input validation prevents injection attacks
  - Rate limiting prevents abuse and reduces exposure window
  - Client app: No auth persistence, no token storage
  - Admin app: Auth tokens only in localStorage, operational data separate
  - Temporary session data auto-cleared when browser closes
  - Clients informed about data handling: 24-hour retention disclosed

**Canadian Data Residency Option:**
- For Canadian organizations requiring data residency, backend can be deployed on Canadian cloud providers
- Available options: AWS ca-central-1, GCP northamerica-northeast1, Azure Canada Central, Fly.io YUL, Render Toronto
- All data processing occurs within Canadian borders
- No cross-border data transmission
- Full PIPEDA compliance with Canadian data residency

### Privacy by Design Principles
1. **Proactive not reactive** - Privacy built from day one
2. **Privacy as default** - No data collection beyond necessity
3. **Full functionality** - Privacy doesn't limit operations
4. **End-to-end security** - 24-hour auto-deletion
5. **Visibility and transparency** - Clients know what's collected
6. **Respect for user privacy** - Minimal data, maximum protection
7. **Keep it user-centric** - Privacy serves the user

---

## 💻 Technical Excellence

### Software Engineering Best Practices
- **Type Safety**: 100% TypeScript codebase with strict mode
- **Testing Infrastructure**: Vitest unit tests, Cypress E2E tests, Newman API tests
- **Error Handling**: Comprehensive try-catch blocks with graceful fallbacks
- **Performance Optimization**: Code splitting, lazy loading, memoization
- **Security**: Helmet security headers, rate limiting (200 req/15min), CORS protection, input validation
- **Authentication**: Supabase with PKCE flow, invite-only admin access, secure session management
- **Documentation**: JSDoc comments throughout, comprehensive README
- **CI/CD Ready**: Automated builds with Vite, ready for GitHub Actions
- **Monitoring**: Vercel Speed Insights and Analytics for production monitoring

### Architecture Patterns
- **Multi-Application Architecture**: Separate client, admin, and backend services
- **Hybrid Architecture**: CSV-first for immediate deployment, API-ready for future Link2Feed integration
- **N-Tier Design**: Presentation, business logic, and data layers (from capstone design)
- **Repository Pattern**: Unified data store abstraction
- **Observer Pattern**: Real-time updates with optimized interval polling (30–120 seconds based on component priority) following industry best practices
- **Page Visibility API**: Automatic polling pause when browser tab is hidden to reduce unnecessary API calls
- **Exponential Backoff**: Stops polling after 3 consecutive connection errors to prevent server overload
- **Smart Polling**: Only polls when tab is visible, not loading, and connection is healthy
- **Singleton Pattern**: In-memory storage management
- **Factory Pattern**: CSV record creation with multiple sources
- **Strategy Pattern**: Flexible CSV parsing for different formats

### Capstone Architectural Design (COMP 4911)
As documented in the Final Project Report:
- **Architectural Style**: Hybrid multi-application with separate client, admin, backend
- **Integration Flow**: CSV-first for current operations, API-ready for Link2Feed integration
- **Data Flow**: Kiosk link → frontend form → backend validation → dashboard update
- **Admin Flow**: Secure login → dashboard → search/filter/edit → CSV export
- **Temporary Operational Data Store**: In-memory CSV storage, 24-hour auto-purge

### Engineering Skills Demonstrated
✅ **Full-Stack Development**: Frontend, backend, deployment  
✅ **Database Design**: Schema-less in-memory architecture  
✅ **API Design**: RESTful endpoints with proper HTTP methods  
✅ **UI/UX Design**: Accessible, responsive, multi-language support  
✅ **DevOps**: Railway deployment, Vercel hosting, environment management  
✅ **Testing**: Unit, integration, E2E, performance testing  
✅ **Documentation**: Technical specs, user guides, code comments  
✅ **Project Management**: From capstone to production deployment  

---

## 🎓 Academic Context: Capstone Project

This system was developed as Lindsey D. Stead's **Bachelor of Computing Sciences capstone project** at **Thompson Rivers University** under the software engineering supervision of Dr. Kevin O'Neil.

### 🎓 Capstone Details
- **Course**: COMP 4911 (Capstone Project)
- **Institution**: Thompson Rivers University (TRU)
- **Degree Program**: Bachelor of Computing Sciences  
- **Project Type**: Final Pilot Software Project - Foodbank Check-In and Appointment System
- **Supervisor**: Dr. Kevin O'Neil
- **Submission Date**: August 2025
- **Development Timeline**: August 2025 (5 months development to deployment)

### 📚 Academic Context
This project represents Lindsey D. Stead's final capstone submission for Bachelor of Computing Sciences at Thompson Rivers University. The system was developed to address real-world food bank operational challenges.

**Key Academic Components:**
- **Analysis Report**: Requirements gathering, stakeholder analysis, needs assessment
- **Design Report**: Architectural design, subsystem specifications, design rationale
- **Final Report**: Complete implementation, testing, deployment documentation
- **Agile Methodology**: Iterative development with stakeholder feedback
- **Hybrid Architecture**: CSV-first with Link2Feed API-ready design pattern

**What This Represents:**
- **Academic Excellence**: Demonstrates mastery of software engineering principles
- **Real-World Application**: Theory applied to solve actual community problems
- **Professional Readiness**: Production-quality code deployed and operational
- **Research to Reality**: Academic project evolved into deployed software
- **Full Agile and Iterative Software Lifecycle**: From requirements gathering to production maintenance

### 📄 Capstone Documentation
The complete academic submission includes:
- **Executive Summary**: Problem statement and solution overview
- **Introduction**: Context and methodology (Agile development)
- **Design Goals and Constraints**: Functional and non-functional requirements
- **Architectural Design**: N-tier hybrid pattern (CSV-first, API-ready)
- **Subsystem and Component Design**: Client, Admin, Backend modules
- **Data Management**: In-memory operational store with 24-hour auto-purge
- **Security and Reliability Design**: Supabase authentication, Privacy by Design
- **Risk Mitigation**: Dependency management, adoption strategies
- **Design Trade-offs**: CSV-first vs API-first, scope decisions
- **References**: Academic citations (Sommerville, Cavoukian, Link2Feed)

This project showcases the complete journey from academic research (COMP 4911) to production deployment, demonstrating technical skills, problem-solving ability, and commitment to serving the community.

---

## 💻 For Licensed Organizations

**Full System Licensing** (Frontend + Backend):
Setup, deployment, and configuration for licensed organizations is handled during onboarding. We provide:

- Complete system deployment (frontend + backend)
- Environment configuration and security setup
- Hosting deployment (Canada or U.S. based on requirements)
- Staff training and documentation
- Ongoing support and maintenance

**Backend API Licensing**:
The backend API is available for licensing separately. Contact for pricing and deployment options.

For technical inquiries or licensing, contact: **lindsey@lifesavertech.ca**.

---

## 🌐 Multi-Location Support

The system supports multiple food bank locations with complete data isolation. Each location requires its own backend deployment to ensure data separation and operational independence.

Deployment model:
- One backend per location (isolated data storage)
- One admin dashboard per location
- Client portal can be shared or location-specific depending on operational needs

This architecture ensures that each location's data remains completely separate and locations can operate independently without interference.

---

## 🚀 Deployment

This is proprietary software. Deployment is handled as part of onboarding for licensed organizations. We support Canada or U.S. hosting based on residency requirements.

Deployment options:
- Backend: Canada (AWS ca-central-1, GCP northamerica-northeast1, Fly.io YUL, Render Toronto) or U.S.
- Frontend: Vercel with CDN and HTTPS
- Per-location isolation: one backend and one admin per location

For deployment inquiries, contact: **lindsey@lifesavertech.ca**.


## 📊 Production Metrics

The system includes built-in performance tracking via the `/api/checkin/metrics` endpoint, providing:
- Daily check-in volumes and completion rates
- Average check-in processing times
- Location-specific performance analytics
- Real-time operational insights

## 📞 Contact

For technical questions or inquiries:

- **Email**: lindsey@lifesavertech.ca

---

## 🏢 Project Status

**Portfolio Project**: Foodbank Check-In and Appointment System  
**Academic Context**: Thompson Rivers University - Bachelor of Computing Science Capstone Project (Graduated with Distinction)  
**Status**: Production System (Deployed & Operational)  
**Developer**: Lindsey D. Stead  
**Repository Contents**: Frontend applications only (Client App + Admin Dashboard)  
**Total Frontend Code**: 21,628 lines (7,515 + 14,113)

This system was developed as a capstone project and evolved into a production-ready application serving real food bank operations. The frontend code demonstrates React/TypeScript development skills, UI/UX design, internationalization, and responsive design. The backend API (proprietary, not included) handles business logic, data management, and API endpoints.

---

## 📄 License

**FRONTEND APPLICATIONS** - Open Source (MIT License)  
**BACKEND API** - Proprietary (All Rights Reserved)

### Frontend (This Repository)
The frontend applications (Client App + Admin Dashboard) in this repository are available for:
- ✅ Portfolio review and code inspection
- ✅ Educational purposes
- ✅ Personal learning and reference

### Backend API (Not Included)
The backend API is proprietary and not included in this repository. For backend licensing inquiries, contact: lindsey@lifesavertech.ca

**Copyright © 2025 Lindsey D. Stead**

---

## 🎯 Relevant Experience for Software & Support Services Engineering

This project demonstrates **relevant qualifications** for a Software and Support Services Engineering role:

### ✨ Why This Project Stands Out
- **Real Production System**: Deployed and serving real users daily
- **Full Lifecycle Management**: From concept, system design and modeling, prototyping, to capstone to production
- **Stakeholder Management**: Worked directly with food bank staff and volunteers
- **Problem-Solving**: Transformed paper-based chaos into digital efficiency
- **Support-First Design**: Built with volunteers' limited technical skills in mind
- **Maintainable Code**: Clean architecture for easy feature additions
- **Documentation**: Comprehensive README, architecture notes, and inline docs
- **Accessibility**: WCAG compliant - usable by everyone
- **Performance**: Responsive UI with real-time updates
- **Security**: Privacy-first design, auto-purge, no PII retention

### 🎓 Academic Excellence
- **Capstone Project**: Thompson Rivers University - Bachelor of Computing Science (Distinction)
- **Supervised by Dr. Kevin O'Neil**: Academic rigor + real-world application
- **Demonstrates**: Research → Design → Implementation → Deployment
- **Proven Track Record**: System in production handling daily operations across multiple locations

---

## 🙏 Acknowledgments

- **Food bank organizations** who inspired this project
- **Thompson Rivers University** for academic guidance
- **Dr. Kevin O'Neil** for capstone supervision, guidance and mentoring
- **React & TypeScript communities** for amazing tooling and documentation
- **All food bank volunteers** who serve their community

---

> 💝 **"Every line of code serves a purpose: making food bank operations more efficient for staff and clients."**

---

## 🔐 Configuration & Deployment

This is proprietary software. The system follows best practices for deployment:

- Secrets are never committed to source control
- Server-only keys remain server-side
- Environments are isolated per location where required
- Environment variables configured per deployment

For technical inquiries, contact: **lindsey@lifesavertech.ca**.
