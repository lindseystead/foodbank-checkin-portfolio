/**
 * @fileoverview Main application component for Foodbank Check-In and Appointment System client application
 * 
 * This is the root component that sets up the core providers and routing structure
 * for the entire client application. It configures internationalization, theming,
 * routing, and performance monitoring.
 * 
 * Route Structure:
 * - /: Landing page with language selection
 * - /initial-check-in: Basic client information collection
 * - /special-requests: Special accommodations and requests
 * - /appointment-details: Appointment scheduling and details
 * - /confirmation: Final confirmation page
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import i18n from './common/i18n';
import theme from './common/theme';
import ErrorBoundary from './components/ErrorBoundary';

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
    </ErrorBoundary>
  );
}

export default App;
