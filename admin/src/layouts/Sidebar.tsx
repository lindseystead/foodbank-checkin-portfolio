/**
 * @fileoverview Sidebar — clean, modern, full-coverage primary nav.
 *
 * Replaces the legacy glassmorphic sidebar. White background, subtle
 * dividers, active route indicator on the left, and a status pill for
 * CSV freshness in the footer.
 *
 * @version 2.0.0
 * @license Proprietary
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { FiLogOut, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchStatusDay } from '../lib/statusService';
import Logo from '../components/ui/Logo';
import { logger } from '../utils/logger';
import { PRIMARY_NAV, SECONDARY_NAV, isNavActive, type NavItem } from './navConfig';

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, isActive, onClick }) => {
  const Icon = item.icon as any;
  return (
    <Tooltip label={item.description} placement="right" openDelay={400} hasArrow>
      <HStack
        as="button"
        onClick={onClick}
        spacing={3}
        px={3}
        py={2.5}
        borderRadius="lg"
        position="relative"
        bg={isActive ? 'blackAlpha.50' : 'transparent'}
        color={isActive ? 'admin.primary' : 'gray.700'}
        fontWeight={isActive ? '600' : '500'}
        w="full"
        textAlign="left"
        transition="background 0.15s, color 0.15s"
        _hover={{ bg: isActive ? 'blackAlpha.100' : 'gray.100', color: 'admin.primary' }}
        _focusVisible={{ boxShadow: '0 0 0 2px var(--chakra-colors-admin-primary)', outline: 'none' }}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Active indicator bar */}
        {isActive && (
          <Box
            position="absolute"
            left="-1px"
            top="6px"
            bottom="6px"
            w="3px"
            bg="admin.primary"
            borderRadius="full"
          />
        )}
        <Box as={Icon} boxSize="18px" flexShrink={0} aria-hidden />
        <Text fontSize="sm" noOfLines={1} flex={1}>
          {item.label}
        </Text>
      </HStack>
    </Tooltip>
  );
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { tenant } = useTenant();

  const [csvStatus, setCsvStatus] = useState<{ loading: boolean; hasData: boolean; count: number }>({
    loading: true,
    hasData: false,
    count: 0,
  });

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const result = await fetchStatusDay();
        if (cancelled) return;
        if (result.success) {
          setCsvStatus({
            loading: false,
            hasData: result.data?.data?.present || false,
            count: result.data?.data?.count || 0,
          });
        } else {
          setCsvStatus({ loading: false, hasData: false, count: 0 });
        }
      } catch (err: any) {
        if (err?.message !== 'API_NOT_CONFIGURED' && err?.message !== 'RATE_LIMITED') {
          logger.debug('CSV status fetch:', err);
        }
        if (!cancelled) setCsvStatus({ loading: false, hasData: false, count: 0 });
      }
    };
    fetch();
    const handleImport = () => fetch();
    window.addEventListener('csvDataImported', handleImport);
    return () => {
      cancelled = true;
      window.removeEventListener('csvDataImported', handleImport);
    };
  }, []);

  const isActive = (path: string) => isNavActive(location.pathname, path);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      logger.error('Sign out error:', error);
      navigate('/login');
    }
  };

  return (
    <Box
      as="nav"
      aria-label="Primary navigation"
      w="260px"
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      display="flex"
      flexDirection="column"
      position="sticky"
      top={0}
    >
      {/* Brand header */}
      <Box px={5} py={5} borderBottom="1px solid" borderColor="gray.100">
        <HStack spacing={3} align="center">
          <Logo size="sm" />
          <Box minW={0}>
            <Text fontSize="sm" fontWeight="700" color="admin.primary" noOfLines={1}>
              {tenant?.name || 'Foodbank Admin'}
            </Text>
            <Text fontSize="2xs" color="gray.500" textTransform="uppercase" letterSpacing="0.05em">
              Check-In System
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* CSV status pill */}
      <Box px={4} pt={4} pb={2}>
        <HStack
          bg={csvStatus.loading ? 'gray.50' : csvStatus.hasData ? 'green.50' : 'orange.50'}
          border="1px solid"
          borderColor={csvStatus.loading ? 'gray.200' : csvStatus.hasData ? 'green.200' : 'orange.200'}
          borderRadius="lg"
          px={3}
          py={2}
          spacing={2}
          w="full"
        >
          {csvStatus.loading ? (
            <Spinner size="xs" color="gray.500" />
          ) : (
            <Box
              as={csvStatus.hasData ? FiCheckCircle : FiAlertCircle}
              color={csvStatus.hasData ? 'green.500' : 'orange.500'}
              boxSize="14px"
              aria-hidden
            />
          )}
          <Box flex={1} minW={0}>
            <Text fontSize="2xs" color="gray.500" textTransform="uppercase" letterSpacing="0.05em" lineHeight="1.2">
              Today's data
            </Text>
            <Text
              fontSize="xs"
              fontWeight="600"
              color={csvStatus.loading ? 'gray.500' : csvStatus.hasData ? 'green.700' : 'orange.700'}
              noOfLines={1}
              lineHeight="1.2"
            >
              {csvStatus.loading
                ? 'Checking…'
                : csvStatus.hasData
                ? `${csvStatus.count} records loaded`
                : 'No data yet'}
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* Primary nav */}
      <Box flex="1" overflowY="auto" px={3} py={2}>
        <Text fontSize="2xs" color="gray.400" textTransform="uppercase" letterSpacing="0.08em" px={3} mb={2} mt={2}>
          Workspace
        </Text>
        <VStack spacing={0.5} align="stretch">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.path}
              item={item}
              isActive={isActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </VStack>

        <Text fontSize="2xs" color="gray.400" textTransform="uppercase" letterSpacing="0.08em" px={3} mb={2} mt={5}>
          Account
        </Text>
        <VStack spacing={0.5} align="stretch">
          {SECONDARY_NAV.map((item) => (
            <NavLink
              key={item.path}
              item={item}
              isActive={isActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </VStack>
      </Box>

      {/* User footer */}
      <Box px={4} py={3} borderTop="1px solid" borderColor="gray.100">
        {user && (
          <HStack spacing={3} align="center">
            <Box flex={1} minW={0}>
              <Text fontSize="xs" color="gray.500" lineHeight="1.2">Signed in as</Text>
              <Text fontSize="xs" color="admin.primary" fontWeight="600" noOfLines={1}>
                {user.email}
              </Text>
            </Box>
            <Tooltip label="Sign out" hasArrow>
              <Box
                as="button"
                aria-label="Sign out"
                onClick={handleSignOut}
                p={2}
                borderRadius="md"
                color="gray.500"
                _hover={{ bg: 'red.50', color: 'red.600' }}
                _focusVisible={{ boxShadow: '0 0 0 2px var(--chakra-colors-admin-primary)', outline: 'none' }}
              >
                <Box as={FiLogOut} boxSize="16px" aria-hidden />
              </Box>
            </Tooltip>
          </HStack>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
