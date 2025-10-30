/**
 * @fileoverview Mobile sidebar component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides a mobile-optimized sidebar navigation with
 * drawer functionality and touch-friendly interface. It handles
 * mobile navigation patterns and responsive behavior.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../Sidebar.tsx} Desktop sidebar component
 */

import {
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Box,
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiUpload, 
  FiUsers, 
  FiPrinter, 
  FiSettings,
  FiHelpCircle,
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

interface MobileSidebarProps {
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: FiHome,
    },
    {
      label: 'CSV Upload',
      path: '/csv-upload',
      icon: FiUpload,
    },
    {
      label: 'Check-ins',
      path: '/check-ins',
      icon: FiUsers,
    },
    {
      label: 'Tickets',
      path: '/tickets',
      icon: FiPrinter,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: FiSettings,
    },
    {
      label: 'Help Center',
      path: '#help',
      icon: FiHelpCircle,
      isHelp: true,
    },
  ];

  const filteredMenuItems = menuItems;

  const handleNavigation = (path: string, isHelp?: boolean) => {
    if (isHelp) {
      window.dispatchEvent(new CustomEvent('openHelp'));
      onClose();
    } else {
      navigate(path);
      onClose();
    }
  };

  return (
    <VStack spacing={0} align="stretch" h="full" bg="white">
      {/* Navigation Menu */}
      <VStack spacing={2} align="stretch" p={4}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <Button
              key={item.path}
              onClick={() => handleNavigation(item.path, item.isHelp)}
              variant={isActive ? 'outline' : 'ghost'}
              colorScheme={isActive ? 'blue' : 'gray'}
              bg={isActive ? 'blue.50' : 'transparent'}
              color={isActive ? 'blue.700' : 'admin.primary'}
              borderColor={isActive ? 'blue.300' : 'transparent'}
              borderWidth={isActive ? '2px' : '0px'}
              justifyContent="flex-start"
              leftIcon={<IconComponent size="18px" />}
              size="lg"
              fontWeight={isActive ? '600' : '600'}
              _hover={{
                bg: 'blue.100',
                color: 'cofb.blue',
                borderColor: 'cofb.blue',
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
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              borderRadius="lg"
              h="48px"
              minH="44px"
              minW="44px"
              w="full"
            >
              <HStack justify="space-between" w="full">
                <Text>{item.label}</Text>

              </HStack>
            </Button>
          );
        })}
      </VStack>

      {/* Spacer */}
      <Box flex={1} />

      {/* Footer */}
      <Box p={4} bg="white" borderTop="1px solid" borderColor="neutral.200">
        <VStack spacing={3}>
          <Text fontSize="xs" color="neutral.700" fontWeight="600" textAlign="center">
            CSV PROCESSOR
          </Text>
          <Text fontSize="xs" color="neutral.600" textAlign="center">
            Upload Link2Feed Appointment List CSV
          </Text>
          
          <Divider />
          
          <VStack spacing={1} textAlign="center">
            <Text fontSize="xs" color="neutral.600">
              Admin Panel
            </Text>
            <Text fontSize="sm" fontWeight="500" color="neutral.700">
              CSV Data Processor
            </Text>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default MobileSidebar;
