/**
 * @fileoverview Minimal layout for the volunteer self-service portal.
 * Distinct from AdminLayout (no admin sidebar); reuses tenant + auth context
 * and the same design tokens.
 */

import React from 'react';
import { Box, Flex, HStack, Heading, Text, Button, Spacer } from '@chakra-ui/react';
import { FiLogOut, FiHeart } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';

interface VolunteerLayoutProps {
  children: React.ReactNode;
}

const VolunteerLayout: React.FC<VolunteerLayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const { tenant } = useTenant();

  return (
    <Box minH={{ base: '100dvh', md: '100vh' }} bg="gray.50">
      <Flex
        as="header"
        align="center"
        px={{ base: 4, md: 8 }}
        py={3}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack spacing={3}>
          <Box color="admin.primary"><FiHeart size={22} /></Box>
          <Box>
            <Heading size="sm" color="admin.primary">Volunteer Portal</Heading>
            <Text fontSize="xs" color="gray.500">{tenant?.name || 'Food Bank'}</Text>
          </Box>
        </HStack>
        <Spacer />
        <Button size="sm" variant="ghost" leftIcon={<FiLogOut />} onClick={() => signOut()}>
          Sign out
        </Button>
      </Flex>

      <Box maxW="960px" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 4, md: 6 }}>
        {children}
      </Box>
    </Box>
  );
};

export default VolunteerLayout;
