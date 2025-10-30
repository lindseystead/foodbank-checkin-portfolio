/**
 * @fileoverview Sidebar navigation component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides the main navigation sidebar with menu items
 * for all admin panel sections. It handles navigation state, active
 * route highlighting, and responsive behavior for mobile devices.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../AdminLayout.tsx} Main layout component
 */

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  Divider,
  Badge,
  Tooltip,
  useBreakpointValue,
  usePrefersReducedMotion,
  Spinner
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiSettings, 
  FiUpload,
  FiUsers,
  FiLogOut,
  FiHelpCircle,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../lib/api';
import Logo from '../ui/Logo';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  
  // CSV Status state
  const [csvStatus, setCsvStatus] = useState<{
    loading: boolean;
    hasData: boolean;
    count: number;
    error: string | null;
  }>({
    loading: true,
    hasData: false,
    count: 0,
    error: null
  });

  // Responsive breakpoint values
  const sidebarWidth = useBreakpointValue({ 
    base: '100%', 
    md: '280px' 
  });
  
  // Accessibility and theme preferences
  const prefersReducedMotion = usePrefersReducedMotion();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: FiHome,
      description: 'View dashboard overview and statistics',
    },
    {
      label: 'CSV Upload',
      path: '/csv-upload',
      icon: FiUpload,
      description: 'Upload Link2Feed Appointment List CSV',
    },
    {
      label: 'Check-ins',
      path: '/check-ins',
      icon: FiUsers,
      description: 'Manage client check-ins',
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: FiSettings,
      description: 'Configure system settings',
    },
  ];

  // Fetch CSV status
  const fetchCsvStatus = async () => {
    try {
      const response = await api('/status/day');
      
      if (response.status === 429) {
        // Rate limited - don't show error, just skip this update
        console.warn('Rate limited - skipping CSV status update');
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Check if data version changed (data was purged)
        const lastVersion = localStorage.getItem('dataVersion');
        if (result.dataVersion && result.dataVersion.toString() !== lastVersion) {
          localStorage.setItem('dataVersion', result.dataVersion.toString());
          // Trigger a page refresh to update all components
          window.location.reload();
          return;
        }
        
        setCsvStatus({
          loading: false,
          hasData: result.data?.data?.present || false,
          count: result.data?.data?.count || 0,
          error: null
        });
      } else {
        setCsvStatus({
          loading: false,
          hasData: false,
          count: 0,
          error: result.error || 'Failed to fetch status'
        });
      }
    } catch (err) {
      console.error('CSV status fetch error:', err);
      setCsvStatus({
        loading: false,
        hasData: false,
        count: 0,
        error: 'No CSV data available'
      });
    }
  };

  useEffect(() => {
    fetchCsvStatus();
    
    // Listen for CSV import events
    const handleCSVImport = () => {
      fetchCsvStatus();
    };
    
    window.addEventListener('csvDataImported', handleCSVImport);
    
    return () => {
      window.removeEventListener('csvDataImported', handleCSVImport);
    };
  }, []);

  // Refresh CSV status when navigating to CSV upload page
  useEffect(() => {
    if (location.pathname === '/csv-upload') {
      fetchCsvStatus();
    }
  }, [location.pathname]);

  const getCsvStatusInfo = () => {
    if (csvStatus.loading) {
      return { 
        icon: FiClock, 
        color: 'gray.500', 
        label: 'Checking CSV Status...',
        badge: { text: 'Loading', color: 'gray' }
      };
    }
    
    if (csvStatus.error) {
      return { 
        icon: FiXCircle, 
        color: 'red.500', 
        label: 'CSV Data Unavailable',
        badge: { text: 'No Data', color: 'red' }
      };
    }
    
    if (csvStatus.hasData) {
      return { 
        icon: FiCheckCircle, 
        color: 'green.500', 
        label: `CSV Data Available (${csvStatus.count} records)`,
        badge: { text: 'Active', color: 'green' }
      };
    }
    
    return { 
      icon: FiXCircle, 
      color: 'orange.500', 
      label: 'No CSV Data for Today',
      badge: { text: 'No Data', color: 'orange' }
    };
  };

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent, path: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(path);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };


  return (
    <Box
      w={sidebarWidth}
      h={{ base: '100%', md: '100vh' }}
      bg="rgba(255, 255, 255, 0.95)"
      backdropFilter="blur(20px)"
      borderRight="1px solid"
      borderColor="rgba(255, 255, 255, 0.2)"
      display="flex"
      flexDirection="column"
      boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      role="navigation"
      aria-label="Main navigation"
      position={{ base: 'relative', md: 'relative' }}
      zIndex={{ base: 1, md: 'auto' }}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: '#2B7B8C',
        opacity: 0.2,
      }}
    >
      {/* Header */}
      <Box 
        p={6} 
        borderBottom="1px solid" 
        borderColor="rgba(255, 255, 255, 0.1)"
        bg="rgba(255, 255, 255, 0.1)"
        position="relative"
        zIndex={2}
      >
        <VStack spacing={3} align="center">
          <Logo size="lg" />
        </VStack>
      </Box>

      {/* Data Source Status */}
      <Box p={4} bg="rgba(255, 255, 255, 0.1)" borderBottom="1px solid" borderColor="rgba(255, 255, 255, 0.1)" position="relative" zIndex={2}>
        <Tooltip label={getCsvStatusInfo().label} placement="right">
          <HStack spacing={3} justify="center">
            {csvStatus.loading ? (
              <Spinner size="sm" color="gray.500" />
            ) : (
              <Box 
                as={getCsvStatusInfo().icon} 
                color={getCsvStatusInfo().color} 
                size="16px"
                aria-hidden="true"
              />
            )}
            <Text fontSize="sm" color="gray.700" fontWeight="500" textAlign="center">
              {csvStatus.loading ? 'Checking...' : 'CSV Data Status'}
            </Text>
            <Badge 
              colorScheme={getCsvStatusInfo().badge.color} 
              size="sm" 
              aria-label={`Status: ${getCsvStatusInfo().badge.text}`}
            >
              {getCsvStatusInfo().badge.text}
            </Badge>
          </HStack>
        </Tooltip>
      </Box>

      {/* Navigation Menu */}
      <Box flex={1} p={4} role="menu" bg="transparent" position="relative" zIndex={2}>
        <VStack spacing={2} align="stretch">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            
            return (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                onKeyDown={(e) => handleKeyDown(e, item.path)}
                variant={isActive ? 'outline' : 'ghost'}
                colorScheme={isActive ? 'blue' : 'gray'}
                bg={isActive ? 'blue.50' : 'transparent'}
                color={isActive ? 'blue.700' : 'admin.primary'}
                borderColor={isActive ? 'blue.300' : 'transparent'}
                borderWidth={isActive ? '2px' : '0px'}
                justifyContent="flex-start"
                leftIcon={<IconComponent size="18px" aria-hidden="true" />}
                size="lg"
                fontWeight={isActive ? '600' : '600'}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${item.label} - ${item.description}`}
                tabIndex={0}
                _hover={{
                  bg: 'blue.100',
                  color: 'cofb.blue',
                  borderColor: 'cofb.blue',
                  transform: prefersReducedMotion ? 'none' : 'translateX(4px)',
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                _active={{
                  bg: isActive ? 'blue.200' : 'gray.200',
                  color: isActive ? 'blue.900' : 'admin.primary',
                  borderColor: isActive ? 'blue.500' : 'transparent',
                }}
                _focus={{
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
                  outline: 'none',
                }}
                transition={prefersReducedMotion ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'}
                borderRadius="lg"
                h="48px"
                minH="44px"
                minW="44px"
              >
                <HStack justify="space-between" w="full">
                  <Text>{item.label}</Text>
                </HStack>
              </Button>
            );
          })}
        </VStack>
      </Box>

      {/* Help Section */}
      <Box p={4} borderTop="1px solid" borderColor="rgba(255, 255, 255, 0.1)" bg="rgba(255, 255, 255, 0.1)" position="relative" zIndex={2}>
        <VStack spacing={3}>
          <Button
            variant="ghost"
            colorScheme="blue"
            leftIcon={<FiHelpCircle size="18px" aria-hidden="true" />}
            size="lg"
            justifyContent="center"
            w="full"
            fontWeight="600"
            color="blue.600"
            _hover={{
              bg: 'blue.100',
              color: 'cofb.blue',
            }}
            onClick={() => {
              // This will be handled by the parent component
              window.dispatchEvent(new CustomEvent('openHelp'));
            }}
            role="button"
            aria-label="Open help center"
            tabIndex={0}
          >
            Help Center
          </Button>
        </VStack>
      </Box>

      {/* Footer */}
      <Box p={4} borderTop="1px solid" borderColor="rgba(255, 255, 255, 0.1)" bg="rgba(255, 255, 255, 0.1)" role="contentinfo" position="relative" zIndex={2}>
        <VStack spacing={3}>
          <VStack spacing={2} w="full">
            <Text fontSize="xs" color="gray.700" fontWeight="600" textAlign="center">
              CSV PROCESSOR
            </Text>
            <Text fontSize="xs" color="gray.600" textAlign="center">
              Upload Link2Feed Appointment List CSV
            </Text>
          </VStack>
          
          <Divider />
          
          {/* User Info & Sign Out */}
          {user && (
            <>
              <Divider />
              <VStack spacing={1} w="full">
                <Text fontSize="xs" color="gray.600" textAlign="center" noOfLines={1}>
                  Signed in as
                </Text>
                <Text fontSize="xs" color="gray.700" fontWeight="500" textAlign="center" noOfLines={2} wordBreak="break-all">
                  {user.email}
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  colorScheme="red"
                  leftIcon={<Box as={FiLogOut} size="14px" aria-hidden="true" />}
                  onClick={handleSignOut}
                  w="full"
                  fontSize="xs"
                  color="red.600"
                  fontWeight="500"
                  aria-label="Sign out of admin panel"
                  tabIndex={0}
                  _hover={{ 
                    bg: 'red.50',
                    color: 'red.700'
                  }}
                  _active={{
                    bg: 'red.100',
                    color: 'red.800'
                  }}
                  _focus={{
                    boxShadow: '0 0 0 3px rgba(245, 101, 101, 0.5)',
                    outline: 'none',
                  }}
                  minH="44px"
                  minW="44px"
                >
                  Sign Out
                </Button>
              </VStack>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Sidebar;
