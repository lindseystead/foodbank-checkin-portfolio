/**
 * @fileoverview Mobile drawer body — reuses navConfig so the menu stays
 * in lock-step with the desktop sidebar.
 *
 * @version 2.0.0
 * @license Proprietary
 */

import React from 'react';
import { Box, VStack, HStack, Text, Divider } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';
import { PRIMARY_NAV, SECONDARY_NAV, isNavActive, type NavItem } from './navConfig';

interface MobileSidebarProps {
  onClose: () => void;
}

const MobileNavLink: React.FC<{ item: NavItem; isActive: boolean; onClick: () => void }> = ({
  item,
  isActive,
  onClick,
}) => {
  const Icon = item.icon as any;
  return (
    <HStack
      as="button"
      onClick={onClick}
      spacing={3}
      px={4}
      py={3}
      borderRadius="md"
      bg={isActive ? 'blackAlpha.50' : 'transparent'}
      color={isActive ? 'admin.primary' : 'gray.700'}
      fontWeight={isActive ? '600' : '500'}
      w="full"
      textAlign="left"
      _hover={{ bg: 'gray.100' }}
      _focusVisible={{ boxShadow: '0 0 0 2px var(--chakra-colors-admin-primary)', outline: 'none' }}
      aria-current={isActive ? 'page' : undefined}
    >
      <Box as={Icon} boxSize="18px" flexShrink={0} aria-hidden />
      <Text fontSize="sm" flex={1}>
        {item.label}
      </Text>
    </HStack>
  );
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

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
    <Box display="flex" flexDirection="column" h="100%">
      <Box flex="1" overflowY="auto" px={2} py={3}>
        <Text fontSize="2xs" color="gray.400" textTransform="uppercase" letterSpacing="0.08em" px={4} mb={2}>
          Workspace
        </Text>
        <VStack spacing={1} align="stretch">
          {PRIMARY_NAV.map((item) => (
            <MobileNavLink
              key={item.path}
              item={item}
              isActive={isNavActive(location.pathname, item.path)}
              onClick={() => go(item.path)}
            />
          ))}
        </VStack>

        <Text fontSize="2xs" color="gray.400" textTransform="uppercase" letterSpacing="0.08em" px={4} mb={2} mt={5}>
          Account
        </Text>
        <VStack spacing={1} align="stretch">
          {SECONDARY_NAV.map((item) => (
            <MobileNavLink
              key={item.path}
              item={item}
              isActive={isNavActive(location.pathname, item.path)}
              onClick={() => go(item.path)}
            />
          ))}
        </VStack>
      </Box>

      {user && (
        <>
          <Divider />
          <Box p={4}>
            <Text fontSize="xs" color="gray.500">Signed in as</Text>
            <Text fontSize="xs" color="admin.primary" fontWeight="600" noOfLines={1}>
              {user.email}
            </Text>
            <HStack
              as="button"
              onClick={handleSignOut}
              mt={3}
              px={3}
              py={3}
              minH="44px"
              borderRadius="md"
              spacing={2}
              w="full"
              color="red.600"
              _hover={{ bg: 'red.50' }}
              _focusVisible={{ boxShadow: '0 0 0 2px var(--chakra-colors-admin-primary)', outline: 'none' }}
            >
              <Box as={FiLogOut} boxSize="16px" aria-hidden />
              <Text fontSize="sm" fontWeight="600">Sign out</Text>
            </HStack>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MobileSidebar;
