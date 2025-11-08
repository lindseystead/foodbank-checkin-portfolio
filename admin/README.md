# Admin Dashboard

The admin panel for the Foodbank Check-In and Appointment System. This application provides food bank staff with comprehensive tools to manage daily operations, monitor check-ins, upload appointment data, and track client information.

## Overview

The admin dashboard is a secure, real-time management interface that enables staff to:
- Monitor live check-in activity throughout the day
- Upload daily appointment CSV files from Link2Feed
- Search and manage client records
- View analytics and operational metrics
- Print tickets for client distribution
- Handle help requests from clients

## Features

- 📊 **Real-Time Dashboard**: Live check-in monitoring with automatic refresh and analytics
- 👥 **Client Management**: Comprehensive search, view, and edit client information
- 📤 **CSV Upload**: Drag-and-drop import of Link2Feed appointment exports
- 🎫 **Ticket Printing**: Generate and print tickets for client distribution
- 📈 **Analytics**: Real-time check-in statistics, trends, and performance metrics
- 🔒 **Secure Authentication**: Supabase-based admin authentication with session management
- 🔍 **Client Search**: Fast search across all client records by name, phone, or ID
- 📋 **Check-In Management**: View all check-ins with filtering and status management
- 🆘 **Help Requests**: Monitor and manage client assistance requests
- ⏱️ **Real-Time Updates**: Automatic data refresh with hover-pause to prevent UI flickering

## Tech Stack

- **React 18** with TypeScript for type-safe development
- **Vite** for fast builds and optimized production bundles
- **Chakra UI** for accessible, responsive admin components
- **React Router** for protected route navigation
- **Supabase** for secure authentication with PKCE flow
- **Recharts** for interactive data visualization and analytics
- **Date-fns** for timezone-aware date formatting
- **Custom API Client** with automatic token management and error handling

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (backend not included in this repository)
- Supabase project configured

### Installation

1. **Clone the repository** (if not already done)

2. **Navigate to the admin folder**
   ```bash
   cd admin
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your values:
   - `VITE_API_BASE_URL`: Your backend API URL
   - `VITE_SUPABASE_URL`: Your Supabase project URL (required)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key (required)

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3003`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests (Vitest)
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
admin/
├── src/
│   ├── pages/              # Page components
│   │   ├── DashboardPage.tsx    # Main dashboard with tabs
│   │   ├── CheckInsPage.tsx     # All check-ins management
│   │   ├── CSVUploadPage.tsx    # CSV upload interface
│   │   ├── ClientDetailPage.tsx # Individual client view
│   │   ├── SettingsPage.tsx      # System settings
│   │   ├── ProfilePage.tsx      # Admin profile
│   │   └── auth/                # Authentication pages
│   │       └── LoginPage.tsx     # Admin login
│   ├── components/         # Reusable components
│   │   ├── features/       # Feature-specific components
│   │   │   ├── dashboard/  # Dashboard components (analytics, charts)
│   │   │   ├── csv/        # CSV upload and viewer
│   │   │   ├── clients/    # Client lookup and management
│   │   │   └── appointments/ # Appointment components
│   │   ├── layout/         # Layout components (AdminLayout, Sidebar, Header)
│   │   └── ui/             # UI components (ProtectedRoute, ErrorBoundary)
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Supabase authentication context
│   ├── lib/                # API and service utilities
│   │   ├── api.ts          # API client with auth token management
│   │   └── supabase.ts     # Supabase client configuration
│   ├── common/             # Shared utilities and config
│   │   ├── theme.ts        # Chakra UI theme configuration
│   │   ├── apiConfig.ts    # API base URL configuration
│   │   └── types/          # TypeScript type definitions
│   ├── utils/              # Utility functions
│   │   ├── logger.ts       # Production-safe logging
│   │   └── timeFormatter.ts # Timezone-aware date formatting
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
└── dist/                   # Production build output
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the client code.

Required:
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Authentication

The admin panel uses Supabase for authentication:

1. Admin users must be created in your Supabase project
2. Users log in with email and password
3. Sessions are persisted using localStorage
4. Protected routes require authentication

### Setting Up Admin Users

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add user** and create a new user with:
   - Email address
   - Password (must meet security requirements)
4. The user can now log in to the admin panel at the login page
5. Sessions are automatically managed with token refresh

## Development

### Adding a New Feature

1. Create component in `src/components/features/`
2. Add page in `src/pages/` if needed
3. Add route in `src/App.tsx`
4. Update navigation in `Sidebar.tsx` if needed

### API Integration

API calls are made through `src/lib/api.ts` which:
- Automatically includes Supabase authentication tokens in headers
- Handles 401 errors with automatic redirect to login
- Provides 10-second timeout protection
- Handles rate limiting (429 responses)
- Logs errors appropriately (dev vs production)

**Best Practices for Polling:**
- **Page Visibility API**: All polling components pause when browser tab is hidden
- **Exponential Backoff**: Stops polling after 3 consecutive connection errors
- **Optimized Intervals**: 30-120 seconds based on component priority
- **Smart Conditions**: Only polls when tab is visible, not loading, and connection is healthy
- **Proper Cleanup**: Clears intervals and removes event listeners on unmount

This reduces API calls by 80%+ while maintaining real-time updates when needed.

Example:
```typescript
import { api } from '../lib/api';

// GET request
const response = await api('/checkin/appointments');
const data = await response.json();

// POST request with body
const createResponse = await api('/checkin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phoneNumber, lastName }),
});
```

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Deployment

This application is typically deployed to Vercel or similar static hosting.

1. **Build the application**: `npm run build`
   - This creates an optimized production build in the `dist/` folder
2. **Deploy the `dist/` folder** to your hosting provider
   - Vercel: Connect your repository and it will auto-deploy
   - Other providers: Upload the `dist/` folder contents
3. **Set environment variables** in your hosting platform (all required):
   - `VITE_API_BASE_URL` - Your backend API URL
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
4. **Configure custom domain** if needed
5. **Verify** authentication works and the dashboard can connect to the backend API

## Security Notes

- **Never commit `.env` files** - They contain sensitive credentials
- **Use environment variables** for all configuration
- **Supabase anon key** is safe to expose in client (it's public)
- **API tokens** are handled server-side and sent via Authorization header

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - All Rights Reserved

Copyright © 2025 Lindsey D. Stead / Lifesaver Technology Services

