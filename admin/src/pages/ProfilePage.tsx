/**
 * @fileoverview Profile page for Foodbank Check-In and Appointment System admin panel
 * 
 * This page displays user profile information, account settings,
 * and provides options for managing admin user preferences and
 * account details.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../contexts/AuthContext.tsx} Authentication context
 */

import {
  Box,
  VStack,
  Text,
  Card,
  CardBody,
  HStack,
  Heading,
  Avatar,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { FiUser, FiMail, FiShield, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" color="admin.primary" mb={2} fontWeight="700" letterSpacing="-0.025em">
            Profile
          </Heading>
          <Text color="gray.600" fontSize="lg" maxW="600px" mx="auto" fontWeight="500">
            Manage your account information and preferences
          </Text>
        </Box>

        {/* User Information Card */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <HStack spacing={4}>
                <Avatar 
                  size="xl" 
                  name={user?.email || 'Admin'}
                  bg="#25385D"
                />
                <VStack align="start" spacing={2}>
                  <Heading size="md" color="#25385D">
                    {user?.email || 'Admin User'}
                  </Heading>
                  <Badge colorScheme="blue" variant="subtle">
                    Administrator
                  </Badge>
                </VStack>
              </HStack>

              <Divider />

              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <FiMail color="gray.500" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.600">
                      Email Address
                    </Text>
                    <Text fontSize="md" color="gray.800">
                      {user?.email || 'admin@cofoodbank.com'}
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing={3}>
                  <FiShield color="gray.500" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.600">
                      Role
                    </Text>
                    <Text fontSize="md" color="gray.800">
                      System Administrator
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing={3}>
                  <FiCalendar color="gray.500" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.600">
                      Account Status
                    </Text>
                    <Text fontSize="md" color="gray.800">
                      Active
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Coming Soon Card */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="center" py={8}>
              <FiUser size={48} color="gray.400" />
              <VStack spacing={2} align="center">
                <Heading size="sm" color="#25385D">
                  Profile Management
                </Heading>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Profile editing and preferences will be available in a future update.
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
  );
};

export default ProfilePage;
