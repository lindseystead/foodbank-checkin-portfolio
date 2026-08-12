/**
 * @fileoverview Main application component for Foodbank Check-In and Appointment System client application
 *
 * This is the root component that sets up the core providers and routing structure
 * for the entire client application. It configures internationalization, theming,
 * routing, and performance monitoring.
 *
 * Route Structure (multi-tenant):
 * - /:slug: Landing page with language selection
 * - /:slug/initial-check-in: Basic client information collection
 * - /:slug/special-requests: Special accommodations and requests
 * - /:slug/appointment-details: Appointment scheduling and details
 * - /:slug/confirmation: Final confirmation page
 *
 * Backwards-compatible routes (default tenant):
 * - /: Landing page (defaults to "cofb" tenant)
 * - /initial-check-in, /special-requests, etc.
 *
 * @version 2.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Outlet } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import i18n from './shared/config/i18n';
import theme from './shared/config/theme';
import ErrorBoundary from './shared/components/ErrorBoundary';
import {
  DEFAULT_TENANT_SLUG,
  TenantConfigProvider,
} from './shared/contexts/TenantConfigContext';

// Import page components
import Landing from './features/landing/pages/Landing';
import InitialCheckIn from './features/checkin/pages/InitialCheckIn';
import SpecialRequests from './features/checkin/pages/SpecialRequests';
import AppointmentDetails from './features/checkin/pages/AppointmentDetails';
import Confirmation from './features/checkin/pages/Confirmation';

/**
 * Layout wrapper that extracts the tenant slug from URL params
 * and provides it to all child routes via TenantConfigProvider.
 */
function TenantLayout() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <TenantConfigProvider slug={slug || DEFAULT_TENANT_SLUG}>
      <Outlet />
    </TenantConfigProvider>
  );
}

/**
 * Root application component that sets up providers and routing
 * @returns {JSX.Element} The rendered application
 */
function App() {
  return (
    <ErrorBoundary>
      {/* Internationalization provider */}
      <I18nextProvider i18n={i18n}>
        {/* Theme provider for consistent styling */}
        <ChakraProvider theme={theme}>
          {/* Main application container */}
          <Box minH={{ base: "100dvh", md: "100vh" }} bg="gray.50">
            {/* Router setup for client-side navigation */}
            <Router>
              <Routes>
                {/* Multi-tenant routes — /:slug/... */}
                <Route path="/:slug" element={<TenantLayout />}>
                  <Route index element={<Landing />} />
                  <Route path="initial-check-in" element={<InitialCheckIn />} />
                  <Route path="special-requests" element={<SpecialRequests />} />
                  <Route path="appointment-details" element={<AppointmentDetails />} />
                  <Route path="confirmation" element={<Confirmation />} />
                </Route>

                {/* Backwards-compatible routes — default tenant */}
                <Route
                  path="/"
                  element={
                    <TenantConfigProvider slug={DEFAULT_TENANT_SLUG}>
                      <Landing />
                    </TenantConfigProvider>
                  }
                />
                <Route
                  path="/initial-check-in"
                  element={
                    <TenantConfigProvider slug={DEFAULT_TENANT_SLUG}>
                      <InitialCheckIn />
                    </TenantConfigProvider>
                  }
                />
                <Route
                  path="/special-requests"
                  element={
                    <TenantConfigProvider slug={DEFAULT_TENANT_SLUG}>
                      <SpecialRequests />
                    </TenantConfigProvider>
                  }
                />
                <Route
                  path="/appointment-details"
                  element={
                    <TenantConfigProvider slug={DEFAULT_TENANT_SLUG}>
                      <AppointmentDetails />
                    </TenantConfigProvider>
                  }
                />
                <Route
                  path="/confirmation"
                  element={
                    <TenantConfigProvider slug={DEFAULT_TENANT_SLUG}>
                      <Confirmation />
                    </TenantConfigProvider>
                  }
                />

                {/* Fallback route for unknown paths */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>

            {/* Performance and analytics monitoring */}
            <SpeedInsights />
            <Analytics />
          </Box>
        </ChakraProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

export default App;
