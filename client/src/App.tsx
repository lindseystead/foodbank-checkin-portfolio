/**
 * App.tsx
 * -------
 * This is the root component of the Foodbank Check-In and Appointment System check-in application.
 * It sets up the core providers and routing structure for the entire application.
 *
 * Main Features:
 * - Internationalization (i18n) setup with react-i18next
 * - Theme provider using Chakra UI
 * - Client-side routing with React Router
 * - Performance monitoring with Vercel Speed Insights
 * - Analytics tracking with Vercel Analytics
 *
 * Route Structure:
 * - /: Landing page with language selection
 * - /initial-check-in: Basic client information collection
 * - /special-requests: Special accommodations and requests
 * - /appointment-details: Appointment scheduling and details
 * - /confirmation: Final confirmation page
 *
 * Providers:
 * - I18nextProvider: Handles internationalization
 * - ChakraProvider: Provides theme and styling
 * - Router: Manages client-side routing
 *
 * Author: Lindsey Stead
 * Date: 2025-10-20
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import i18n from './common/i18n';
import theme from './common/theme';

// Import page components
import Landing from './pages/Landing';
import InitialCheckIn from './pages/InitialCheckIn';
import SpecialRequests from './pages/SpecialRequests';
import AppointmentDetails from './pages/AppointmentDetails';
import Confirmation from './pages/Confirmation';

/**
 * Root application component that sets up providers and routing
 * @returns {JSX.Element} The rendered application
 */
function App() {
  return (
    // Internationalization provider
    <I18nextProvider i18n={i18n}>
      {/* Theme provider for consistent styling */}
      <ChakraProvider theme={theme}>
        {/* Main application container */}
        <Box minH={{ base: "100dvh", md: "100vh" }} bg="gray.50">
          {/* Router setup for client-side navigation */}
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Main application routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/initial-check-in" element={<InitialCheckIn />} />
              <Route path="/special-requests" element={<SpecialRequests />} />
              <Route path="/appointment-details" element={<AppointmentDetails />} />
              <Route path="/confirmation" element={<Confirmation />} />
              
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
  );
}

export default App;
