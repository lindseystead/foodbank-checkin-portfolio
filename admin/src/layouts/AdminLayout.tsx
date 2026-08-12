/**
 * @fileoverview Admin layout — top-level shell for the admin panel.
 *
 * Slim, modern shell with a sidebar (desktop) / drawer (mobile),
 * a compact top bar (page title + tenant + user menu), and a
 * scrollable content area. No redundant clocks or sub-titles.
 *
 * @version 2.0.0
 * @license Proprietary
 */

import React, { useEffect } from 'react';
import {
  Box,
  Flex,
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
  Tooltip,
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FiSettings, FiLogOut, FiUser, FiBell } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Logo from '../components/ui/Logo';
import { CSVHelpModal } from '../components/features/dashboard/CSVHelpModal';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const PAGE_META: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Daily operations overview' },
  '/dashboard': { title: 'Dashboard', subtitle: 'Daily operations overview' },
  '/check-ins': { title: 'Check-ins', subtitle: 'Manage today\'s appointments' },
  '/clients': { title: 'Clients', subtitle: 'Lookup and manage client records' },
  '/help-requests': { title: 'Help Requests', subtitle: 'Client assistance inbox' },
  '/volunteers': { title: 'Volunteers', subtitle: 'Roster approval + shift scheduling' },
  '/reports': { title: 'Reports', subtitle: 'Utilization metrics + HungerCount export' },
  '/csv-upload': { title: 'CSV Upload', subtitle: 'Import appointments from Link2Feed' },
  '/settings': { title: 'Settings', subtitle: 'Tenant + integration configuration' },
  '/profile': { title: 'Profile', subtitle: 'Account preferences' },
};

const getMeta = (pathname: string) => {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  if (pathname.startsWith('/clients/')) return { title: 'Client Detail', subtitle: 'Profile, history, special requests' };
  return { title: 'Admin Panel' };
};

const initialsFrom = (email?: string) => {
  if (!email) return 'A';
  const local = email.split('@')[0];
  const parts = local.split(/[._-]/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const drawer = useDisclosure();
  const help = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { tenant } = useTenant();

  const meta = getMeta(location.pathname);
  const userEmail = user?.email ?? '';
  const userName = (user?.user_metadata as any)?.full_name || userEmail.split('@')[0] || 'Admin';

  // External "openHelp" event
  useEffect(() => {
    const handler = () => help.onOpen();
    window.addEventListener('openHelp', handler);
    return () => window.removeEventListener('openHelp', handler);
  }, [help]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  return (
    <Box minH={{ base: '100dvh', md: '100vh' }} bg="admin.bg">
      <Flex direction={{ base: 'column', md: 'row' }} minH="100vh">
        {/* Desktop sidebar */}
        <Box display={{ base: 'none', md: 'block' }} flexShrink={0}>
          <Sidebar />
        </Box>

        {/* Mobile drawer */}
        <Drawer isOpen={drawer.isOpen} placement="left" onClose={drawer.onClose} size="xs">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px" bg="white">
              <HStack spacing={3}>
                <Logo size="sm" />
                <Text fontSize="sm" fontWeight="700" color="admin.primary" noOfLines={1}>
                  {tenant?.name || 'Admin Panel'}
                </Text>
              </HStack>
            </DrawerHeader>
            <DrawerBody p={0}>
              <MobileSidebar onClose={drawer.onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main column */}
        <Flex direction="column" flex="1" minW={0} minH="100vh">
          {/* Top bar */}
          <Flex
            as="header"
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.200"
            px={{ base: 3, sm: 4, md: 6 }}
            py={{ base: 2.5, md: 3 }}
            align="center"
            gap={{ base: 2, md: 4 }}
            position="sticky"
            top={0}
            zIndex={10}
            minH={{ base: '56px', md: '64px' }}
          >
            {/* Mobile hamburger */}
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              onClick={drawer.onOpen}
              variant="ghost"
              size="md"
              minW="44px"
              minH="44px"
              display={{ base: 'inline-flex', md: 'none' }}
              color="gray.700"
            />

            {/* Mobile compact logo */}
            <Box display={{ base: 'inline-flex', md: 'none' }}>
              <Logo size="sm" />
            </Box>

            {/* Page title */}
            <Box flex="1" minW={0}>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="700"
                color="admin.primary"
                noOfLines={1}
                lineHeight="1.2"
              >
                {meta.title}
              </Text>
              {meta.subtitle && (
                <Text
                  fontSize="xs"
                  color="gray.500"
                  noOfLines={1}
                  display={{ base: 'none', md: 'block' }}
                  lineHeight="1.2"
                >
                  {meta.subtitle}
                </Text>
              )}
            </Box>

            {/* Tenant pill (desktop) */}
            {tenant && (
              <HStack
                display={{ base: 'none', lg: 'inline-flex' }}
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="full"
                px={3}
                py={1}
                spacing={2}
                flexShrink={0}
              >
                <Box w="6px" h="6px" borderRadius="full" bg="accent.green.300" />
                <Text fontSize="xs" fontWeight="600" color="admin.primary" noOfLines={1}>
                  {tenant.name}
                </Text>
              </HStack>
            )}

            {/* Help bell (desktop) */}
            <Tooltip label="Quick help" hasArrow>
              <IconButton
                aria-label="Quick help"
                icon={<FiBell />}
                onClick={help.onOpen}
                variant="ghost"
                size="sm"
                color="gray.600"
                display={{ base: 'none', md: 'inline-flex' }}
              />
            </Tooltip>

            {/* User menu */}
            <Menu>
              <MenuButton
                as={HStack}
                px={2}
                py={1}
                borderRadius="lg"
                cursor="pointer"
                spacing={2}
                _hover={{ bg: 'gray.50' }}
                _active={{ bg: 'gray.100' }}
              >
                <HStack spacing={2}>
                  <Avatar
                    size="sm"
                    name={userName}
                    bg="admin.primary"
                    color="white"
                    getInitials={() => initialsFrom(userEmail)}
                  />
                  <Box display={{ base: 'none', md: 'block' }} textAlign="left">
                    <Text fontSize="xs" fontWeight="600" color="admin.primary" noOfLines={1} maxW="160px">
                      {userName}
                    </Text>
                    <Text fontSize="2xs" color="gray.500" noOfLines={1} maxW="160px">
                      {userEmail || 'Administrator'}
                    </Text>
                  </Box>
                  <ChevronDownIcon color="gray.500" boxSize={4} display={{ base: 'none', md: 'inline-flex' }} />
                </HStack>
              </MenuButton>
              <MenuList py={1} minW="200px">
                <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                  Profile
                </MenuItem>
                <MenuItem icon={<FiSettings />} onClick={() => navigate('/settings')}>
                  Settings
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<FiLogOut />} onClick={handleSignOut} color="red.600">
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          {/* Page content */}
          <Box flex="1" minH="0" overflowY="auto" bg="admin.bg">
            <Container
              maxW={{ base: '100%', xl: '1320px' }}
              px={{ base: 3, sm: 4, md: 6 }}
              py={{ base: 4, md: 6 }}
            >
              {children}
            </Container>
          </Box>
        </Flex>
      </Flex>

      <CSVHelpModal isOpen={help.isOpen} onClose={help.onClose} />
    </Box>
  );
};

export default AdminLayout;
