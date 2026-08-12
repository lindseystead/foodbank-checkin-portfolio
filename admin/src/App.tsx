/**
 * @fileoverview Main application component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component sets up the React Router and provides the main application structure
 * for the admin panel. It includes authentication context, protected routes, and
 * all the main page components for managing the food bank check-in system.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./contexts/AuthContext.tsx} Authentication context provider
 */

import { Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { TenantProvider, PAID_STAFF_ROLES } from './contexts/TenantContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/DashboardPage'

import CheckInsPage from './pages/CheckInsPage'
import SettingsPage from './pages/SettingsPage'
import ClientDetailPage from './pages/ClientDetailPage'
import ClientsPage from './pages/ClientsPage'
import CSVUploadPage from './pages/CSVUploadPage'
import HelpRequestsPage from './pages/HelpRequestsPage'
import ReportsPage from './pages/ReportsPage'
import ProfilePage from './pages/ProfilePage'
import VolunteersPage from './pages/VolunteersPage'
import VolunteerPortalPage from './pages/volunteer/VolunteerPortalPage'
import AdminLayout from './layouts/AdminLayout'
import VolunteerLayout from './layouts/VolunteerLayout'

// Paid staff (director/coordinator/staff) may use the admin panel; volunteers
// are redirected to their own portal by ProtectedRoute.
const STAFF = [...PAID_STAFF_ROLES]

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TenantProvider>
          <Box minH={{ base: "100dvh", md: "100vh" }} bg="gray.50">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Volunteer self-service portal (role: volunteer) */}
              <Route path="/volunteer" element={<ProtectedRoute allowedRoles={['volunteer']}><VolunteerLayout><VolunteerPortalPage /></VolunteerLayout></ProtectedRoute>} />

              {/* Admin panel — paid staff only */}
              <Route path="/" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/csv-upload" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><CSVUploadPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/check-ins" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><CheckInsPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><ClientsPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/clients/:id" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><ClientDetailPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/help-requests" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><HelpRequestsPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/volunteers" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><VolunteersPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><ReportsPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><SettingsPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute allowedRoles={STAFF}><AdminLayout><ProfilePage /></AdminLayout></ProtectedRoute>} />
            </Routes>
          </Box>
        </TenantProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
