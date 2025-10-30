/**
 * @fileoverview Admin layout component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides the main layout structure for the admin panel,
 * including the sidebar navigation, header, and main content area.
 * It handles responsive design and provides consistent layout
 * across all admin pages.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../ui/ProtectedRoute.tsx} Route protection
 */

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Container,
  Icon,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { 
  HamburgerIcon, 
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { 
  FiSettings, 
  FiLogOut,
  FiUser,
  FiLink,
  FiUpload,
  FiClock,
  FiCalendar,
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Logo from '../ui/Logo';
import HeaderSystemStatus from './HeaderSystemStatus';
import { CSVHelpModal } from '../features/dashboard/CSVHelpModal';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isHelpOpen, onOpen: onHelpOpen, onClose: onHelpClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleLogout = () => {
    // Redirect to login page
    navigate('/login');
  };

  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/csv-upload':
        return 'CSV Upload';
      case '/check-ins':
        return 'Check-ins';
      case '/tickets':
        return 'Tickets';
      case '/settings':
        return 'Settings';
      default:
        return 'Admin Panel';
    }
  };

  // Format date and time helpers
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  // Listen for help button clicks
  useEffect(() => {
    const handleHelpClick = () => {
      onHelpOpen();
    };

    window.addEventListener('openHelp', handleHelpClick);
    return () => window.removeEventListener('openHelp', handleHelpClick);
  }, [onHelpOpen]);

  // Live clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);



  return (
    <Box 
      minH={{ base: "100dvh", md: "100vh" }} 
      bg="#f8fafc"
      position="relative"
    >
      {/* Mobile Header */}
      <Box
        display={{ base: "flex", md: "none" }}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={{ base: 3, sm: 4 }}
        py={3}
        position="sticky"
        top={0}
        zIndex={10}
        boxShadow="md"
      >
        <HStack justify="space-between" w="full" spacing={2}>
          <HStack spacing={{ base: 2, sm: 3 }} minW={0} flex={1}>
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="ghost"
              color="gray.600"
              size="sm"
            />
            <Logo size="sm" />
            <VStack align="start" spacing={0} display={{ base: "none", sm: "flex" }}>
              <Text fontSize="xs" fontWeight="600" color="admin.primary" lineHeight="tight">
                Foodbank Check-In and Appointment System
              </Text>
            </VStack>
          </HStack>
          
          <HStack spacing={{ base: 1, sm: 2 }} minW={0} flexShrink={0}>
            {/* Mobile Date and Time Display - Hidden on very small screens */}
            <VStack spacing={0} align="end" display={{ base: "none", xs: "flex" }}>
              <HStack spacing={1}>
                <Icon as={FiCalendar} color="blue.500" boxSize={2} />
                <Text fontSize="xs" fontWeight="medium" color="gray.600" whiteSpace="nowrap">
                  {formatDate(currentTime).split(',')[0]}
                </Text>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FiClock} color="blue.500" boxSize={2} />
                <Text fontSize="xs" fontWeight="bold" color="admin.primary" whiteSpace="nowrap">
                  {formatTime(currentTime)}
                </Text>
              </HStack>
            </VStack>

            {/* Mobile System Status */}
            <HStack spacing={1} display={{ base: "none", sm: "flex" }}>
              <Icon as={FiLink} color="blue.500" boxSize={3} />
              <Icon as={FiUpload} color="green.500" boxSize={3} />
            </HStack>
            
            <Menu>
              <MenuButton
                as={IconButton}
                icon={
                  <HStack spacing={1}>
                    <Avatar size="sm" name="Admin" bg="admin.primary" />
                    <ChevronDownIcon color="admin.primary" boxSize={3} />
                  </HStack>
                }
                variant="ghost"
                color="admin.primary"
                size="sm"
              />
              <MenuList>
                <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                  Profile
                </MenuItem>
                <MenuItem icon={<FiSettings />} onClick={() => navigate('/settings')}>
                  Settings
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<FiLogOut />} onClick={handleLogout} color="red.500">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </Box>

      <Flex direction={{ base: "column", md: "row" }} w="full" minH={{ base: "calc(100dvh - 64px)", md: "100vh" }}>
        {/* Desktop Sidebar */}
        <Box 
          display={{ base: "none", md: "block" }}
          boxShadow="lg"
          zIndex={1}
        >
          <Sidebar />
        </Box>

        {/* Mobile Sidebar Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
                      <DrawerHeader borderBottomWidth="1px" bg="white">
            <HStack spacing={3}>
              <Logo size="sm" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="600" color="brand.500">
                  Admin Panel
                </Text>
                <Text fontSize="xs" color="gray.500">
                  ADMIN
                </Text>
              </VStack>
            </HStack>
          </DrawerHeader>
            <DrawerBody p={0}>
              <MobileSidebar onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content - Using Frontend's Layout Pattern */}
        <Box
          flex={1}
          minH={{ base: "calc(100dvh - 64px)", md: "100vh" }}
          overflowY="auto"
          bg="transparent"
          w="full"
          position="relative"
          zIndex={1}
        >
          {/* Desktop Header */}
          <Flex
            display={{ base: "none", md: "flex" }}
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.200"
            px={{ md: 4, lg: 6 }}
            py={4}
            justify="space-between"
            align="center"
            boxShadow="md"
            minH="80px"
          >
            <VStack align="start" spacing={1} minW={0} flex={1}>
              <HStack spacing={2} align="center">
                <Text 
                  fontSize={{ md: "lg", lg: "xl" }} 
                  fontWeight="600" 
                  color="admin.primary"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {getPageTitle(location.pathname)}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.500" whiteSpace="nowrap" fontWeight="500">
                Foodbank Check-In and Appointment System
              </Text>
            </VStack>
            
            <HStack spacing={{ md: 2, lg: 4 }} minW={0} flexShrink={0}>
              {/* Date and Time Display */}
              <VStack spacing={1} align="end" display={{ base: "none", lg: "flex" }}>
                <HStack spacing={2}>
                  <Icon as={FiCalendar} color="blue.500" boxSize={3} />
                  <Text fontSize="xs" fontWeight="medium" color="gray.600" whiteSpace="nowrap">
                    {formatDate(currentTime)}
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FiClock} color="blue.500" boxSize={3} />
                  <Text fontSize="sm" fontWeight="bold" color="admin.primary" whiteSpace="nowrap">
                    {formatTime(currentTime)}
                  </Text>
                </HStack>
              </VStack>

              {/* Compact Date/Time for medium screens */}
              <VStack spacing={0} align="end" display={{ base: "none", md: "flex", lg: "none" }}>
                <HStack spacing={1}>
                  <Icon as={FiCalendar} color="blue.500" boxSize={2} />
                  <Text fontSize="xs" fontWeight="medium" color="gray.600" whiteSpace="nowrap">
                    {formatDate(currentTime).split(',')[0]}
                  </Text>
                </HStack>
                <HStack spacing={1}>
                  <Icon as={FiClock} color="blue.500" boxSize={2} />
                  <Text fontSize="xs" fontWeight="bold" color="admin.primary" whiteSpace="nowrap">
                    {formatTime(currentTime)}
                  </Text>
                </HStack>
              </VStack>

              {/* System Status */}
              <HeaderSystemStatus />
              
              {/* User Menu */}
              <Menu>
                <MenuButton>
                  <HStack spacing={{ md: 2, lg: 3 }} cursor="pointer">
                    <VStack align="end" spacing={0} display={{ base: "none", lg: "flex" }}>
                      <Text fontSize="sm" fontWeight="500" color="gray.700">
                        Admin User
                      </Text>
                      <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                        Administrator
                      </Text>
                    </VStack>
                    <Avatar 
                      size="sm" 
                      name="Admin"
                      bg="admin.primary"
                    />
                    <ChevronDownIcon color="admin.primary" />
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                    Profile
                  </MenuItem>
                  <MenuItem icon={<FiSettings />} onClick={() => navigate('/settings')}>
                    Settings
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<FiLogOut />} onClick={handleLogout} color="red.500">
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          {/* Page Content - Expanded Layout */}
          <Flex
            h={{ base: "calc(100dvh - 64px)", md: "calc(100vh - 80px)" }}
            alignItems="flex-start"
            justifyContent="flex-start"
            width="100%"
            overflow="hidden"
            p={0}
          >
            <Container
              maxW={{ base: "100%", sm: "100%", md: "100%", lg: "100%", xl: "100%" }}
              h="full"
              display="flex"
              alignItems="flex-start"
              py={{ base: 2, sm: 2, md: 2 }}
              px={{ base: 2, sm: 4, md: 6 }}
              w="full"
              overflow="auto"
            >
              <Box 
                position="relative"
                textAlign="left"
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(20px)"
                borderRadius="3xl"
                boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.2)"
                p={{ base: 6, sm: 8, md: 10, lg: 12 }}
                w="full"
                minH="fit-content"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: '#2B7B8C',
                  opacity: 0.2,
                  borderRadius: '3xl 3xl 0 0',
                }}
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '24px',
                  },
                }}
              >
                {children}
              </Box>
            </Container>
          </Flex>
        </Box>
      </Flex>

      {/* Help Modal */}
      <CSVHelpModal isOpen={isHelpOpen} onClose={onHelpClose} />
    </Box>
  );
};

export default AdminLayout;
