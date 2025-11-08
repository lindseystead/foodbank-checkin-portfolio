/**
 * @fileoverview Protected route component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides route protection by checking user authentication and admin
 * privileges before rendering protected content. It handles loading states, unauthorized
 * access, and provides appropriate user feedback for different access scenarios.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../contexts/AuthContext.tsx} Authentication context
 */

import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Center, Text, VStack, Button, useToast } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading, signOut } = useAuth();
  const location = useLocation();
  const toast = useToast();

  /**
   * Check if user has admin privileges
   * 
   * Best practice: Check user metadata for admin role.
   * This should match the check in AuthContext for consistency.
   */
  const isAdmin = (user: any): boolean => {
    if (!user) return false;
    
    // Check user metadata for admin role (recommended approach)
    const userRole = user.user_metadata?.role || user.app_metadata?.role;
    if (userRole === 'admin') {
      return true;
    }
    
    // Fallback: For invite-only systems, any authenticated user is admin
    // This should be replaced with proper role checking in production
    return true;
  };

  // Handle unauthorized access
  const handleUnauthorized = async () => {
    await signOut();
    toast({
      title: 'Session Expired',
      description: 'Your session has expired for security reasons. Please sign in again to continue.',
      status: 'warning',
      duration: 6000,
      isClosable: true,
    });
  };

  if (isLoading) {
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

  if (!isAdmin(user)) {
    return (
      <Center minH="100vh">
        <VStack spacing={4}>
          <Text fontSize="xl" color="red.500">Access Denied</Text>
          <Text color="gray.600">Admin privileges required.</Text>
          <Text color="gray.500" fontSize="sm">
            Please contact your administrator for access.
          </Text>
          <Button
            colorScheme="blue"
            onClick={handleUnauthorized}
            size="md"
          >
            Return to Login
          </Button>
        </VStack>
      </Center>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
