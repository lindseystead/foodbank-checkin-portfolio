/**
 * @fileoverview Protected route component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides route protection by checking user authentication and admin
 * privileges before rendering protected content. It handles loading states, unauthorized
 * access, and provides appropriate user feedback for different access scenarios.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../../contexts/AuthContext.tsx} Authentication context
 */

import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Center, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant, TenantRole } from '../../contexts/TenantContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * If provided, the user's tenant role must be one of these to view the route.
   * When the role doesn't match, the user is redirected to the home route for
   * their role (volunteers → /volunteer, paid staff → /). When omitted, any
   * authenticated user may view the route.
   */
  allowedRoles?: TenantRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { role, isPaidStaff, isLoading: tenantLoading } = useTenant();
  const location = useLocation();

  // Wait for both auth AND tenant/role resolution before deciding access,
  // so we never flash the wrong UI to a volunteer (or vice-versa).
  if (authLoading || (isAuthenticated && tenantLoading)) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600" fontSize="lg">Loading...</Text>
          <Text color="gray.500" fontSize="sm">Please wait while we verify your access</Text>
        </VStack>
      </Center>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role gating: send users to the area appropriate for their role.
  if (allowedRoles && !allowedRoles.includes(role)) {
    const home = isPaidStaff ? '/' : '/volunteer';
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

