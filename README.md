# 🍎 Foodbank Check-In and Appointment System

> **A complete full-stack system designed from the ground up as my Bachelor of Computing Sciences capstone project at Thompson Rivers University (TRU). Built solo using agile methodologies, this system helps food bank clients check in faster using QR codes and their own tablets or mobile devices.**

🌐 **Live System**: [https://foodbank-checkin-tan.vercel.app/](https://foodbank-checkin-tan.vercel.app/) (Client Check-In) | [https://foodbank-checkin.vercel.app/login](https://foodbank-checkin.vercel.app/login) (Admin Dashboard)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosted-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

**A complete full-stack system designed and built solo as a software engineering capstone project. The architecture is CSV-first and Link2Feed-ready, enabling food bank clients to check in faster using QR codes displayed at the food bank entrance, which they scan with their tablets or mobile devices.**

🌐 **Live Client Check-In**: [https://foodbank-checkin-tan.vercel.app/](https://foodbank-checkin-tan.vercel.app/)  
📊 **Admin Dashboard**: [https://foodbank-checkin.vercel.app/login](https://foodbank-checkin.vercel.app/login)

> **📝 Portfolio Project**: This repository contains the **frontend applications** (Client App + Admin Dashboard) from my capstone project. Designed and built entirely by me using agile methodologies, the system features a CSV-first architecture that works immediately with Link2Feed exports, with an API-ready design for future Link2Feed integration. The backend API is not included in this repository.

---

## 🚀 Quick Start

This repository contains the **frontend applications** for the Foodbank Check-In System:

1. **Client App** (`/client`) - React/TypeScript frontend for client check-in (7,515 lines)
2. **Admin Panel** (`/admin`) - React/TypeScript frontend for staff management (14,113 lines)

**Frontend Tech Stack:** React 18, TypeScript, Chakra UI, React Router, i18next, Vercel  

**📄 Sample CSV File:** See [`docs/sample-appointments.csv`](docs/sample-appointments.csv) for an example CSV file format compatible with Link2Feed exports. All data is sanitized/anonymized for demonstration purposes.

**⚠️ Note:** The sample CSV contains hardcoded dates (`2025-04-14`). To test the system, you must update all `Pick Up Date` values to match **today's date** before uploading. The system only allows check-ins for appointments scheduled for today.

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
3. **Upload to Admin Dashboard**: Log in to the admin dashboard and upload the updated CSV file
4. **Test Client Check-In**: Use the phone numbers and last names from the CSV to test the client check-in flow

---

## 🌟 What Makes This Special

- ✨ **Real-World Impact**: Production-ready system designed for food bank operations, currently deployed and serving real clients
- 📱 **QR Code Workflow**: Clients scan QR codes displayed at food bank entrance using their tablets or mobile devices—no dedicated kiosk hardware needed
- 🌍 **Multi-Language Support**: 7 languages (English, French, Spanish, Chinese, Hindi, Arabic, Punjabi)
- 📊 **CSV-First Architecture**: Works immediately with Link2Feed CSV exports—no API access required
- 🔗 **Link2Feed-Ready**: Architecture designed for future Link2Feed API integration
- ⚡ **Fast Check-In**: Typically under 5 minutes (vs ~15 minutes with paper)
- 🔒 **Privacy by Design**: All data auto-purges after 24 hours
- 🏢 **Multi-Location**: Scalable architecture supporting multiple food bank locations
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

### CSV-First, Link2Feed-Ready Architecture

This system was designed with a **CSV-first architecture** that enables immediate deployment with Link2Feed exports, while maintaining an **API-ready design** for future Link2Feed integration. The architecture supports both workflows seamlessly.

**Architecture Overview:**

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT CHECK-IN APP                      │
│  • QR code scanning workflow                              │
│  • Clients use their tablets/mobile devices               │
│  • Multilingual UI (7 languages)                          │
│  • Phone number + last name lookup                        │
│  • Special dietary requests                               │
│  • Instant next appointment generation                     │
│  • Mobile-friendly responsive design                       │
└─────────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────────┐
│                   ADMIN DASHBOARD                          │
│  • Real-time check-in monitoring                          │
│  • CSV upload from Link2Feed (CSV-first)                 │
│  • Link2Feed API integration ready                        │
│  • Client search and management                           │
│  • Analytics and reporting                                │
│  • Multi-location support                                │
└─────────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API                              │
│  • CSV-first processing (immediate deployment)            │
│  • Link2Feed API-ready (future integration)              │
│  • In-memory data store (24h auto-purge)                  │
│  • Appointment scheduling (21-day cycle)                  │
│  • Ticket number generation                               │
└─────────────────────────────────────────────────────────────┘
```

**Key Architectural Decisions:**
- **CSV-First**: Works immediately with Link2Feed CSV exports—no API access required
- **Link2Feed-Ready**: Architecture designed for future Link2Feed API integration
- **Hybrid Approach**: Supports both CSV upload and API integration workflows

---

## 🎯 Complete System Features

### Client Check-In Application - QR Code Based Workflow

**How It Works:**
1. Food bank displays QR code at the front entrance
2. Clients arriving for appointments scan the QR code with their tablet or mobile device
3. QR code opens the check-in application directly in their browser
4. Clients complete the 5-step check-in process on their own device
5. Staff receive real-time updates on the admin dashboard
6. System generates ticket for food distribution

This approach eliminates the need for dedicated kiosk hardware and allows clients to use their own devices, making the system more accessible and cost-effective.

#### **Page 1: Landing & Language Selection**
- Welcome page with professional branding
- Language selection interface with 7 languages: English, French, Spanish, Chinese, Hindi, Arabic, Punjabi
- Language preference persists throughout entire session
- Responsive design optimized for tablets and mobile devices
- Clear call-to-action to begin check-in

#### **Page 2: Initial Check-In**
- Phone number input with automatic formatting (e.g., (250) 555-1234)
- Last name input for appointment verification
- Real-time form validation with helpful error messages
- Client lookup integration with backend API
- **"Need Help?" Assistance Button**: Always visible on every page for client support
- Progress indicator showing step 1 of 5
- Handles appointment verification errors gracefully

#### **Page 3: Special Dietary Requests**
- **Multi-select dietary preferences** with visual icons:
  - Vegetarian (carrot icon)
  - Vegan (leaf icon)
  - Gluten-free (bread icon)
  - Dairy-free
  - Halal (mosque icon)
  - Kosher (synagogue icon)
- **Allergies text field** for detailed allergy information
- **Unwanted foods** text field for food preferences
- **Mobility assistance checkbox** for accessibility needs
- **Diaper size selection** dropdown for Tiny Bundles program (Newborn, Size 1-7)
- **Additional notes** textarea for any other special requests
- Pre-populates dietary restrictions from CSV data if available
- **Assistance Button** available on every page
- Progress indicator showing step 3 of 5

#### **Page 4: Appointment Details**
- Displays current appointment date and time in formatted, readable format
- Shows appointment information (e.g., "Monday, October 27th at 9:00 AM")
- **Appointment rescheduling capability** - clients can request to reschedule
- Rescheduling modal with date picker and time slot selection
- Valid time slots: 9:00 AM - 2:45 PM in 15-minute increments
- System features display (privacy, speed, multilingual support)
- Important notices about arrival times and policies
- **Assistance Button** available
- Progress indicator showing step 4 of 5

#### **Page 5: Confirmation**
- Displays next appointment (automatically scheduled 21 days from today)
- Formatted date display (e.g., "Monday, November 17th at 10:00 AM")
- Success confirmation message
- **Auto-redirect after 10 seconds** back to landing page for next client
- Completion status indicator
- Visual confirmation with checkmark icon
- Progress indicator showing step 5 of 5 (complete)

#### **Client App Additional Features:**
- **Help Request System**: Clients can request assistance from any page
- **Session Management**: Data persists across pages using sessionStorage
- **Error Handling**: Graceful error handling with user-friendly messages
- **Mobile-First Design**: Optimized for tablets and mobile devices
- **Accessibility**: WCAG-compliant with keyboard navigation and screen reader support
- **Internationalization**: All text translated into 7 languages
- **Responsive Layout**: Adapts to different screen sizes seamlessly

---

### Admin Dashboard - Complete Management System

#### **Dashboard Page** - Main Operations Hub with 5 Tabs:

**1. Analytics Tab**
- **Real-time bar charts** showing check-in status distribution:
  - Collected (green) - completed check-ins
  - Pending (blue) - awaiting completion
  - Not Collected (orange) - missed appointments
- **Hourly breakdown** of check-ins throughout the day (8 AM - 8 PM)
- **Dashboard statistics**:
  - Total check-ins count
  - Completed count
  - Pending count
  - No-show count
  - Average wait time calculation
  - Peak hour identification
- **CSV data status indicator** showing if today's data is loaded
- **Real-time updates** with automatic refresh (30-120 second intervals)
- **Responsive charts** that adapt to screen size

**2. Recent Check-Ins Tab**
- **Live feed** of all check-in activity
- **Status badges** with color coding (Pending, Collected, Not Collected, etc.)
- **Completion time** display showing how long each check-in took
- **Filter by status** dropdown (All, Pending, Collected, Not Collected)
- **Real-time updates** as new check-ins occur
- **Client information** display (name, phone, appointment time)
- **Quick actions** available for each check-in

**3. Find Clients Tab**
- **Instant search** across all CSV clients
- **Search by**: Client ID, first name, last name, or phone number
- **Real-time filtering** as you type
- **Click to navigate** to full client detail page
- **Client count** display showing filtered results
- **Empty state** messaging when no results found

**4. Clients List Tab**
- **Complete table view** of all CSV upload data
- **Sortable columns** for easy data organization
- **Filtering capabilities** by various criteria
- **Client information** display (ID, name, phone, appointment details)
- **Quick navigation** to client detail pages

**5. Help Requests Tab**
- **Live table** of all client assistance requests
- **Request details**: Client phone, name, message, current page, timestamp
- **Status management**: Pending, In Progress, Resolved
- **Filter by status** dropdown
- **Search functionality** to find specific requests
- **View details modal** showing full request information
- **Status update** buttons for managing requests
- **Response tracking** with admin notes
- **Real-time updates** with polling

#### **CSV Upload Page**
- **Drag-and-drop file upload** interface
- **File validation**: Checks for .csv extension and file size (10MB limit)
- **Upload progress bar** with percentage display
- **Upload statistics**:
  - Total records processed
  - New records added
  - Duplicate records skipped
  - Date mismatch warnings
- **Date mismatch detection**: Warns if CSV dates don't match today
- **Intelligent column detection**: Automatically detects CSV column structure
- **Supports multiple CSV formats** and column variations
- **Duplicate detection**: Prevents duplicate client records
- **Clear all data** functionality with confirmation dialog
- **Today's data status** indicator showing if data exists
- **Data expiry time** display (24-hour auto-purge countdown)
- **Upload history** and status tracking

#### **All Check-Ins Page**
- **Complete list** of all check-in records
- **Advanced search** functionality:
  - Search by client name (first or last)
  - Search by client ID
  - Search by phone number
  - Search by date range
- **Status filtering**:
  - All statuses
  - Pending
  - Collected
  - Not Collected
  - Rescheduled
  - Cancelled
- **Status management**:
  - Update check-in status
  - Mark as collected
  - Mark as not collected
  - Cancel appointments
- **Print ticket** functionality directly from list (one-click printing)
- **View details modal** showing complete check-in information
- **Client information display**:
  - Name, phone, email
  - Appointment date and time
  - Check-in timestamp
  - Completion time
  - Status with color coding
- **Late appointment detection**: Shows "Late by X hours" for overdue appointments
- **Missed appointment detection**: Identifies appointments missed by 4+ hours
- **Real-time updates** with automatic refresh (30-second polling)
- **Export CSV functionality**: Export all check-ins with updates
- **Export includes**:
  - All original CSV data
  - Updated status from check-ins
  - Next appointment dates
  - Special requests from client check-in
  - Original data preserved unless updated
- **Responsive table design** for mobile and desktop
- **Pagination** for large datasets

#### **Client Detail Page**
- **Full client profile view** with comprehensive information:
  - Personal details (name, phone, email)
  - Household information (size, adults, seniors, children, children's ages)
  - Appointment details (current and next appointment)
  - Special requests (dietary restrictions, allergies, mobility issues)
  - Program information (Link2Feed program field)
  - Location and client type
- **Edit all client fields**:
  - Personal information (name, phone, email)
  - Household size and composition
  - Appointment details
  - Special requests and dietary information
  - Notes and additional information
- **Print ticket** button for specific client
- **Appointment rebooking** functionality:
  - Change next appointment date
  - Change appointment time
  - Validates future dates
- **Check-in history** display:
  - Full history of all check-ins
  - Timestamps for each check-in
  - Status history
  - Completion times
- **Special requests display**:
  - Dietary restrictions list
  - Allergies information
  - Mobility issues indicator
  - Diaper size (if applicable)
- Additional notes
- **Real-time data sync** with backend
- **Save changes** with confirmation
- **Navigation breadcrumbs** for easy return to dashboard

#### **Settings Page**
- **Link2Feed API configuration**:
  - API endpoint configuration
  - API key management
  - Connection testing
  - Integration status display
- **System status monitoring**:
  - Backend connection status
  - Database status
  - API health checks
- **Data management**:
  - Clear all data button with confirmation
  - Data version tracking
  - System information display
- **Configuration management**:
  - Save and clear configuration
  - Reset to defaults
- **System information**:
  - Version information
  - Last update time
  - System health indicators

#### **Profile Page**
- **Admin user information** display
- **Account details**:
  - Email address
  - User role
  - Account creation date
- **Session management**:
  - Sign out functionality
  - Session information

#### **Admin Dashboard Additional Features:**

**Real-Time Updates & Synchronization:**
- **Smart polling system**: Automatic data refresh every 30-120 seconds
- **Page Visibility API**: Pauses polling when browser tab is hidden
- **Exponential backoff**: Stops polling after 3 consecutive connection errors
- **Real-time synchronization** across all admin pages
- **Connection error handling**: Graceful degradation when backend unavailable

**Print Ticket System:**
- **One-click printing** from multiple locations:
  - Check-Ins page (bulk printing)
  - Client Detail page (individual printing)
  - Dashboard quick actions
- **Ticket includes**:
  - Client name and ID
  - Appointment date and time
  - Next appointment information
  - Special requests summary
  - Ticket number
  - QR code for future check-ins
- **Print preview** before printing
- **Print optimization** for standard paper sizes

**Appointment Management:**
- **Appointment rebooking modal**:
  - Date picker for new appointment
  - Time slot selection (9:00 AM - 2:45 PM)
  - Validates future dates only
  - Updates all related records
- **Status management**:
  - Update check-in status
  - Mark appointments as collected
  - Mark as not collected
  - Reschedule appointments
  - Cancel appointments
- **Appointment history** tracking

**Client Management:**
- **Client edit modal**:
- Edit all client fields
  - Update household information
  - Modify special requests
  - Change appointment details
- **Client search** across all pages
- **Client lookup** with instant results
- **Client detail navigation** from multiple entry points

**Data Export & Reporting:**
- **Export all CSV** functionality:
  - Exports every person from original CSV upload
  - Includes updated status from check-ins
  - Includes next appointment dates
  - Includes special requests
  - Preserves original data structure
- **Export format**: CSV compatible with Link2Feed
- **Date formatting** for export compatibility

**Help Request Management:**
- **Help request table** with filtering and search
- **Status management**: Pending, In Progress, Resolved
- **Request details modal**:
  - Full request message
  - Client information
  - Current page where request was made
  - Timestamp
- **Response tracking** with admin notes
- **Real-time updates** as new requests come in

**Analytics & Reporting:**
- **Real-time analytics charts**:
  - Bar charts by status
  - Hourly breakdown
  - Peak hour identification
- **Dashboard statistics**:
  - Total check-ins
  - Completion rates
  - Average wait times
  - No-show rates
- **Visual data representation** with color coding

**Authentication & Security:**
- **Supabase authentication** with PKCE flow
- **Protected routes** - admin-only access
- **Session management** with auto-refresh tokens
- **Secure API calls** with authentication headers
- **Password reset** functionality
- **Login page** with error handling

**System Features:**
- **CSV-first architecture**: Works immediately with CSV uploads
- **Link2Feed-ready**: Architecture designed for future API integration
- **Multi-location support**: Scalable for multiple food bank locations
- **24-hour auto-purge**: Data automatically deleted after 24 hours for privacy
- **Error handling**: Comprehensive error handling throughout
- **Loading states**: Skeleton loaders and spinners for better UX
- **Toast notifications**: User feedback for all actions
- **Responsive design**: Works on desktop, tablet, and mobile
- **Accessibility**: WCAG-compliant design

---

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Chakra UI** for beautiful, accessible components
- **i18next** for multi-language support (7 languages)
- **React Router** for navigation
- **Vite** for lightning-fast builds
- **Supabase Auth**: Secure authentication with PKCE flow, auto-refresh tokens
- **Protected Routes**: Admin-only access control with session management
- **Vercel Analytics**: Performance monitoring and insights

### Deployment
- **Vercel** for frontend hosting (static assets via CDN)
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
└── assets/          # Screenshots and documentation images
```

---

## 💻 Technical Excellence

### Software Engineering Best Practices
- **Type Safety**: 100% TypeScript codebase with strict mode
- **Testing Infrastructure**: Vitest unit tests, Cypress E2E tests
- **Error Handling**: Comprehensive try-catch blocks with graceful fallbacks
- **Performance Optimization**: Code splitting, lazy loading, memoization
- **Security**: CORS protection, input validation
- **Authentication**: Supabase with PKCE flow, secure session management
- **Documentation**: JSDoc comments throughout, comprehensive README
- **CI/CD Ready**: Automated builds with Vite, ready for GitHub Actions
- **Monitoring**: Vercel Speed Insights and Analytics for production monitoring

### Architecture Patterns
- **Multi-Application Architecture**: Separate client and admin frontends
- **Component-Based Design**: Reusable React components with Chakra UI
- **Observer Pattern**: Real-time updates with optimized interval polling (30–120 seconds based on component priority)
- **Page Visibility API**: Automatic polling pause when browser tab is hidden to reduce unnecessary API calls
- **Exponential Backoff**: Stops polling after 3 consecutive connection errors to prevent server overload
- **Smart Polling**: Only polls when tab is visible, not loading, and connection is healthy

### Engineering Skills Demonstrated
✅ **Frontend Development**: React, TypeScript, modern UI frameworks  
✅ **API Integration**: RESTful API consumption with error handling  
✅ **UI/UX Design**: Accessible, responsive, multi-language support  
✅ **DevOps**: Vercel deployment, environment management  
✅ **Testing**: Unit and E2E testing setup  
✅ **Documentation**: Technical specs, user guides, code comments  
✅ **Project Management**: From capstone to production deployment  

---

## 🎓 Academic Context: Capstone Project

This system was **designed and built entirely by me** as my **Bachelor of Computing Sciences capstone project** at **Thompson Rivers University** under the software engineering supervision of **Dr. Kevin O'Neil**. 

**Solo Development:**
- Designed from the ground up using agile methodologies
- Full-stack implementation: React/TypeScript frontends, Node.js/Express backend
- Complete system architecture and data management design
- Security implementation and privacy compliance
- Deployment and DevOps configuration
- All development work completed independently

**Agile Methodology:**
- Iterative development with stakeholder feedback from food bank staff and volunteers
- Requirements gathering, analysis, design, implementation, and testing phases
- Continuous improvement based on real-world usage
- Regular check-ins with supervisor Dr. Kevin O'Neil

**From Capstone to Production:**
What began as academic research evolved into a production-ready system serving real food bank operations. The system demonstrates the complete software engineering lifecycle from concept to deployment. Special thanks to Dr. O'Neil for his guidance, mentorship, and support throughout the capstone project.

### 🎓 Capstone Details
- **Course**: COMP 4911 (Capstone Project)
- **Institution**: Thompson Rivers University (TRU)
- **Degree Program**: Bachelor of Computing Sciences  
- **Project Type**: Final Pilot Software Project - Foodbank Check-In and Appointment System
- **Supervisor**: Dr. Kevin O'Neil (Software Engineering Professor, TRU)
- **Submission Date**: August 2025
- **Development Timeline**: August 2025 (5 months development to deployment)

### 📚 Academic Context
This project represents Lindsey D. Stead's final capstone submission for Bachelor of Computing Sciences at Thompson Rivers University. The system was developed to address real-world food bank operational challenges.

**Key Academic Components:**
- **Analysis Report**: Requirements gathering, stakeholder analysis, needs assessment
- **Design Report**: Architectural design (CSV-first, Link2Feed-ready), subsystem specifications, design rationale
- **Final Report**: Complete implementation, testing, deployment documentation
- **Agile Methodology**: Iterative development with stakeholder feedback, designed and implemented by me
- **Hybrid Architecture**: CSV-first with Link2Feed API-ready design pattern—enables immediate deployment while supporting future API integration

**What This Represents:**
- **Academic Excellence**: Demonstrates mastery of software engineering principles
- **Real-World Application**: Theory applied to solve actual community problems
- **Professional Readiness**: Production-quality code deployed and operational
- **Research to Reality**: Academic project evolved into deployed software
- **Full Agile and Iterative Software Lifecycle**: From requirements gathering to production maintenance

This project showcases the complete journey from academic research (COMP 4911 capstone project at TRU) to production deployment. Designed and built entirely by me using agile methodologies, the system demonstrates technical skills, problem-solving ability, and commitment to serving Canadian communities. The CSV-first, Link2Feed-ready architecture enables immediate deployment while supporting future API integration. Originally designed as a capstone project, the system is now designed specifically for Canadian food banks with PIPEDA compliance and Canadian data residency options.

---

## 🧪 Testing

### Test Infrastructure
- **Vitest-ready**: Frontend unit testing setup available
- **Cypress-ready**: End-to-end testing setup available

### Running Tests

```bash
# Admin frontend unit tests (Vitest)
cd admin && npm test

# Client frontend unit tests (Vitest)
cd client && npm test
```

---

## 🏢 Project Status

**Portfolio Project**: Foodbank Check-In and Appointment System  
**Academic Origin**: Originally designed as a capstone project at Thompson Rivers University (TRU) - Bachelor of Computing Science Capstone Project (Graduated with Distinction)  
**Status**: Production System (Deployed & Operational)  
**Developer**: Lindsey D. Stead  
**Repository Contents**: Frontend applications only (Client App + Admin Dashboard)  
**Total Frontend Code**: 21,628 lines (7,515 + 14,113)

This system was originally designed as a capstone project at Thompson Rivers University and evolved into a production-ready application serving real food bank operations in Canada. The frontend code demonstrates React/TypeScript development skills, UI/UX design, internationalization, and responsive design. The system is designed for Canadian food banks and complies with Canadian privacy regulations (PIPEDA).

---

## 🎯 Relevant Experience for Software & Support Services Engineering

This project demonstrates **relevant qualifications** for a Software and Support Services Engineering role:

### ✨ Why This Project Stands Out
- **Solo Development**: Designed and built entirely by me from the ground up as a capstone project
- **Agile Methodology**: Used agile development practices throughout the project lifecycle
- **Real Production System**: Deployed and serving real users daily
- **Full Lifecycle Management**: From concept, system design and modeling, prototyping, to capstone to production
- **CSV-First Architecture**: Enables immediate deployment with Link2Feed exports, no API access required
- **Link2Feed-Ready**: Architecture designed for future API integration
- **QR Code Workflow**: Innovative approach using QR codes and client devices—no dedicated hardware needed
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

- **Dr. Kevin O'Neil** - Software Engineering Professor and Capstone Supervisor at Thompson Rivers University, for his guidance, mentorship, and support throughout the capstone project development
- **Food bank organizations** who inspired this project and provided real-world context
- **Thompson Rivers University** for academic guidance and the capstone opportunity
- **React & TypeScript communities** for amazing tooling and documentation
- **All food bank volunteers** who serve their community

---

> 💝 **"Every line of code serves a purpose: making food bank operations more efficient for staff and clients."**

---

## 🇨🇦 Canadian Food Bank Licensing

This system is designed specifically for **Canadian food banks** and is available for licensing across Canada.

### Why This System for Canadian Food Banks?

- **PIPEDA Compliant**: Meets Canadian federal privacy law requirements
- **Canadian Data Residency**: Can be deployed on Canadian servers (AWS ca-central-1, GCP northamerica-northeast1, Azure Canada Central)
- **Multilingual Support**: 7 languages including French (Canada's official languages)
- **Link2Feed Integration**: Works seamlessly with Link2Feed CSV exports used by Canadian food banks
- **Real-World Proven**: Currently deployed and serving Canadian food bank operations

### Licensing Options for Canadian Organizations

**Full System Licensing** includes:
- Complete frontend and backend deployment
- PIPEDA-compliant configuration
- Canadian data residency options
- Staff training and documentation
- Ongoing support and maintenance
- Custom development for Canadian food bank needs
- **Multi-tenant licensing**: Each food bank organization requires a separate license

**Contact for Canadian Licensing:**
- **Email**: lindsey@lifesavertech.ca
- **Location**: Canada
- **Services**: Custom deployment, training, and support for Canadian food banks
- **Licensing Model**: Per food bank organization (multi-location support included per license)

---

## 📄 License & Intellectual Property

**Copyright © 2025 Lindsey D. Stead. All Rights Reserved.**

This codebase is displayed for **PORTFOLIO PURPOSES ONLY**. 

**This is proprietary software** - no license is granted for use, copying, modification, distribution, or commercial exploitation.

**Permitted Use:**
- ✅ Portfolio review and code inspection for evaluation purposes
- ✅ Educational learning and reference
- ✅ Personal study and understanding

**Prohibited Use:**
- ❌ Commercial use or deployment
- ❌ Copying, modifying, or distributing the code
- ❌ Creating derivative works
- ❌ Using in production systems
- ❌ Reselling or sublicensing

**For commercial use, production deployment, or licensing inquiries in Canada**, please contact:
- **Email**: lindsey@lifesavertech.ca

**Commercial licensing includes:**
- Production deployment rights for Canadian food banks (per food bank organization)
- Commercial use authorization
- Support and maintenance options
- Custom development services
- Backend API access (not included in this repository)
- PIPEDA-compliant deployment options
- Canadian data residency options (AWS ca-central-1, GCP northamerica-northeast1, Azure Canada Central)
- **Multi-tenant licensing**: Each food bank requires a separate commercial license

See [`LICENSE`](LICENSE) for full terms and conditions.
