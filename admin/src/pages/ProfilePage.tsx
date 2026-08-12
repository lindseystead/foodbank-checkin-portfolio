/**
 * @fileoverview Profile page for Foodbank Check-In and Appointment System admin panel
 * 
 * This page displays user profile information, account settings,
 * and provides options for managing admin user preferences and
 * account details.
 * 
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
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FiMail, FiShield, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import Logo from '../components/ui/Logo';
import PageHeader from '../components/ui/PageHeader';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { tenant, role } = useTenant();

  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch" w="full" maxW="100%" minW="0">
        {/* Page Header */}
        <PageHeader
          title="User Profile"
          description="View your account information and administrative access details"
        />

        {/* Logo Section */}
        <Box w="full" maxW="100%" display="flex" justifyContent="center" py={{ base: 3, md: 5 }}>
          <Logo size="md" />
        </Box>

        {/* User Information Card */}
        <Card 
          bg="white" 
          border="1px solid" 
          borderColor="gray.200" 
          borderRadius="lg" 
          boxShadow="sm" 
          w="full" 
          maxW="100%" 
          minW="0"
        >
          <CardBody p={{ base: 4, sm: 5, md: 6 }} w="full" maxW="100%" minW="0">
            <VStack spacing={6} align="stretch" w="full">
              {/* User Header */}
              <Flex
                direction={{ base: "column", sm: "row" }}
                align={{ base: "center", sm: "start" }}
                gap={{ base: 4, sm: 4 }}
                w="full"
              >
                <Avatar 
                  size={{ base: "xl", sm: "2xl" }}
                  name={user?.email || 'Admin'}
                  bg="admin.primary"
                  flexShrink={0}
                />
                <VStack align={{ base: "center", sm: "start" }} spacing={2} flex={1} minW="0">
                  <Heading 
                    size={{ base: "md", sm: "lg" }} 
                    color="admin.primary"
                    textAlign={{ base: "center", sm: "left" }}
                    lineHeight="1.3"
                    noOfLines={2}
                  >
                    {user?.email || 'Admin User'}
                  </Heading>
                  <Badge 
                    colorScheme="blue" 
                    variant="subtle"
                    fontSize={{ base: "xs", sm: "sm" }}
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    Administrator
                  </Badge>
                </VStack>
              </Flex>

              <Divider borderColor="gray.200" />

              {/* Account Details */}
              <VStack spacing={4} align="stretch" w="full">
                <HStack spacing={3} align="start" flexWrap="wrap">
                  <Icon 
                    as={FiMail} 
                    color="gray.500" 
                    boxSize={{ base: 4, sm: 5 }}
                    flexShrink={0}
                    mt={1}
                  />
                  <VStack align="start" spacing={0} flex={1} minW="0">
                    <Text 
                      fontSize={{ base: "xs", sm: "sm" }} 
                      color="gray.600"
                      fontWeight="500"
                    >
                      Email Address
                    </Text>
                    <Text 
                      fontSize={{ base: "sm", sm: "md" }} 
                      color="gray.800"
                      wordBreak="break-word"
                      lineHeight="1.5"
                    >
                      {user?.email || 'Admin'}
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing={3} align="start" flexWrap="wrap">
                  <Icon 
                    as={FiShield} 
                    color="gray.500" 
                    boxSize={{ base: 4, sm: 5 }}
                    flexShrink={0}
                    mt={1}
                  />
                  <VStack align="start" spacing={0} flex={1} minW="0">
                    <Text 
                      fontSize={{ base: "xs", sm: "sm" }} 
                      color="gray.600"
                      fontWeight="500"
                    >
                      User Role
                    </Text>
                    <Text
                      fontSize={{ base: "sm", sm: "md" }}
                      color="gray.800"
                      lineHeight="1.5"
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                      {tenant ? ` — ${tenant.name}` : ''}
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing={3} align="start" flexWrap="wrap">
                  <Icon 
                    as={FiCalendar} 
                    color="gray.500" 
                    boxSize={{ base: 4, sm: 5 }}
                    flexShrink={0}
                    mt={1}
                  />
                  <VStack align="start" spacing={0} flex={1} minW="0">
                    <Text 
                      fontSize={{ base: "xs", sm: "sm" }} 
                      color="gray.600"
                      fontWeight="500"
                    >
                      Account Status
                    </Text>
                    <HStack spacing={2} align="center">
                      <Icon as={FiCheckCircle} color="green.500" boxSize={4} />
                      <Text 
                        fontSize={{ base: "sm", sm: "md" }} 
                        color="green.600"
                        fontWeight="500"
                        lineHeight="1.5"
                      >
                        Active
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* System Information Card */}
        <Card 
          bg="white" 
          border="1px solid" 
          borderColor="gray.200" 
          borderRadius="lg" 
          boxShadow="sm" 
          w="full" 
          maxW="100%" 
          minW="0"
        >
          <CardBody p={{ base: 4, sm: 5, md: 6 }} w="full" maxW="100%" minW="0">
            <VStack spacing={4} align="stretch" w="full">
              <Heading 
                size={{ base: "sm", sm: "md" }} 
                color="admin.primary"
                lineHeight="1.3"
              >
                System Access
              </Heading>
              
              <Box 
                bg="blue.50" 
                p={{ base: 4, sm: 5 }} 
                borderRadius="md" 
                border="1px solid" 
                borderColor="blue.200"
              >
                <VStack spacing={3} align="start" w="full">
                  <HStack spacing={2}>
                    <Icon as={FiShield} color="blue.600" boxSize={{ base: 4, sm: 5 }} />
                    <Text 
                      fontSize={{ base: "sm", sm: "md" }} 
                      color="blue.800" 
                      fontWeight="600"
                    >
                      Administrative Privileges
                    </Text>
                  </HStack>
                  <Text 
                    fontSize={{ base: "xs", sm: "sm" }} 
                    color="blue.700"
                    lineHeight="1.6"
                  >
                    As a system administrator, you have full access to all features including dashboard 
                    management, CSV data uploads, client check-in management, and system configuration. 
                    Your account is authenticated and authorized for all administrative functions.
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
  );
};

export default ProfilePage;
