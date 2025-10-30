/**
 * @fileoverview Main application component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component sets up the React Router and provides the main application structure
 * for the admin panel. It includes authentication context, protected routes, and
 * all the main page components for managing the food bank check-in system.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ./contexts/AuthContext.tsx} Authentication context provider
 */

import { Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ui/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/DashboardPage'

import CheckInsPage from './pages/CheckInsPage'
import SettingsPage from './pages/SettingsPage'
import ClientDetailPage from './pages/ClientDetailPage'
import CSVUploadPage from './pages/CSVUploadPage'
import ProfilePage from './pages/ProfilePage'
import AdminLayout from './components/layout/AdminLayout'

function App() {
  return (
    <AuthProvider>
      <Box minH={{ base: "100dvh", md: "100vh" }} bg="gray.50">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/csv-upload" element={<ProtectedRoute><AdminLayout><CSVUploadPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/check-ins" element={<ProtectedRoute><AdminLayout><CheckInsPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AdminLayout><SettingsPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AdminLayout><ProfilePage /></AdminLayout></ProtectedRoute>} />
          <Route path="/clients/:id" element={<ProtectedRoute><AdminLayout><ClientDetailPage /></AdminLayout></ProtectedRoute>} />
        </Routes>
      </Box>
    </AuthProvider>
  )
}

export default App
