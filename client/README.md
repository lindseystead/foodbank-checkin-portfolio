# Client Check-In Application

The client-facing check-in application for the Foodbank Check-In and Appointment System. This application provides a streamlined, multilingual check-in experience for food bank clients, allowing them to check in quickly and provide dietary preferences and special requests.

## Overview

The client application guides users through a 5-step check-in process:
1. **Landing Page**: Language selection and welcome
2. **Initial Check-In**: Phone number and last name verification
3. **Special Requests**: Dietary preferences, allergies, and accommodation needs
4. **Appointment Details**: Review and confirm appointment information
5. **Confirmation**: Final confirmation with next appointment details

## Features

- 🌍 **Multilingual Support**: Full translations in 7 languages (English, French, Spanish, Chinese, Hindi, Arabic, and Punjabi)
- 📱 **Mobile-First Design**: Optimized for tablets, phones, and kiosks with responsive layouts
- ♿ **Accessible**: WCAG 2.1 AA compliant with screen reader support and keyboard navigation
- ⚡ **Fast Performance**: Optimized builds with Vite and code splitting
- 🎨 **Modern UI**: Built with Chakra UI for consistent, accessible components
- 🔄 **Real-Time Updates**: Live appointment information and status updates
- 🆘 **Help Support**: Integrated assistance button on every page for client support

## Tech Stack

- **React 18** with TypeScript for type-safe development
- **Vite** for lightning-fast builds and hot module replacement
- **Chakra UI** for accessible, responsive components
- **React Router** for client-side navigation
- **i18next** for comprehensive internationalization (7 languages)
- **Framer Motion** for smooth animations and transitions
- **Supabase** (optional) for help request functionality
- **Vercel Analytics** for performance monitoring

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (backend not included in this repository)

### Installation

1. **Clone the repository** (if not already done)

2. **Navigate to the client folder**
   ```bash
   cd client
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
   - `VITE_SUPABASE_URL`: (Optional) Supabase project URL for help requests
   - `VITE_SUPABASE_ANON_KEY`: (Optional) Supabase anon key

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3002`

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
client/
├── src/
│   ├── pages/              # Page components (5-step check-in flow)
│   │   ├── Landing.tsx      # Language selection and welcome
│   │   ├── InitialCheckIn.tsx    # Phone and name verification
│   │   ├── SpecialRequests.tsx   # Dietary preferences and needs
│   │   ├── AppointmentDetails.tsx # Appointment review
│   │   └── Confirmation.tsx      # Final confirmation
│   ├── components/         # Reusable components
│   │   ├── buttons/        # Button components (Primary, Assistance, Finish)
│   │   ├── layout/         # Layout components (PageLayout, ProgressSteps)
│   │   └── ui/             # UI components (PageHeader, LanguageSelector)
│   ├── hooks/              # Custom React hooks (useLanguageSelection)
│   ├── lib/                # API and service utilities
│   │   ├── api.ts          # API client configuration
│   │   ├── checkInService.ts # Check-in service layer
│   │   └── supabase.ts     # Supabase client (optional, for help requests)
│   ├── common/             # Shared utilities and config
│   │   ├── i18n.ts         # Internationalization (7 languages)
│   │   ├── theme.ts        # Chakra UI theme configuration
│   │   └── apiConfig.ts    # API base URL configuration
│   ├── utils/              # Utility functions
│   │   └── logger.ts       # Production-safe logging
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # Application entry point
├── public/                 # Static assets (logo, images)
└── dist/                   # Production build output
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the client code.

Required:
- `VITE_API_BASE_URL` - Backend API base URL

Optional:
- `VITE_SUPABASE_URL` - Supabase project URL (for help requests)
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development

### Check-In Flow

The application follows a 5-step check-in process:
1. **Landing** (`/`) - Language selection and welcome
2. **Initial Check-In** (`/initial-check-in`) - Phone and name verification
3. **Special Requests** (`/special-requests`) - Dietary preferences and needs
4. **Appointment Details** (`/appointment-details`) - Appointment review and reminder preferences
5. **Confirmation** (`/confirmation`) - Final confirmation with next appointment

### Adding a New Language

1. Add translations to `src/common/i18n.ts` in the `resources` object
2. Add language option to `LanguageSelector` component in `src/components/ui/LanguageSelector.tsx`
3. Test all pages in the new language to ensure proper formatting
4. Verify RTL (right-to-left) support if needed (Arabic, Hebrew, etc.)

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add translations for the new page in `src/common/i18n.ts`
4. Update `ProgressSteps` component if it's part of the check-in flow
5. Add navigation logic if needed

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
3. **Set environment variables** in your hosting platform:
   - `VITE_API_BASE_URL` (required) - Your backend API URL
   - `VITE_SUPABASE_URL` (optional) - For help request functionality
   - `VITE_SUPABASE_ANON_KEY` (optional) - For help request functionality
4. **Configure custom domain** if needed
5. **Verify** the application loads and can connect to the backend API

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - All Rights Reserved

Copyright © 2025 Lindsey D. Stead / Lifesaver Technology Services

