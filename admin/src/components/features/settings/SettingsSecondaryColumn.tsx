/**
 * @fileoverview Secondary settings column (security + help)
 */

import React from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiCheckCircle, FiExternalLink, FiInfo, FiMail, FiShield } from 'react-icons/fi';
import {
  calloutBrand,
  calloutSuccess,
  calloutWarning,
  iconChipProps,
  surfaceCardProps,
} from './settingsStyles';

const SettingsSecondaryColumn: React.FC = () => {
  return (
    <VStack spacing={{ base: 6, sm: 6 }} align="stretch" w="full" maxW="100%" minW="0">
      <Card {...surfaceCardProps} w="full" maxW="100%" minW="0">
        <CardBody p={{ base: 4, sm: 5, md: 6 }} w="full" maxW="100%" minW="0">
          <VStack spacing={4} align="stretch" w="full">
            <HStack spacing={3} flexWrap="wrap">
              <Box {...iconChipProps} bg="accent.green.50">
                <Icon as={FiShield} color="accent.green.300" boxSize={{ base: 4, sm: 5 }} />
              </Box>
              <VStack spacing={0} align="start" minW="0" flex={1}>
                <Heading size={{ base: 'sm', sm: 'md' }} color="admin.primary" lineHeight="1.3">
                  Security & Access
                </Heading>
                <Text color="admin.muted" fontSize={{ base: 'xs', sm: 'sm' }} lineHeight="1.5">
                  Authentication and access control settings
                </Text>
              </VStack>
            </HStack>

            <Box {...calloutSuccess} p={{ base: 4, sm: 5 }}>
              <VStack spacing={3} align="start" w="full">
                <HStack spacing={2}>
                  <Icon as={FiCheckCircle} color="accent.green.300" boxSize={{ base: 4, sm: 5 }} />
                  <Text fontSize={{ base: 'sm', sm: 'md' }} fontWeight="600" color="accent.green.500">
                    Security Status: Active
                  </Text>
                </HStack>
                <Text fontSize={{ base: 'xs', sm: 'sm' }} color="accent.green.500" lineHeight="1.6">
                  All security measures are currently active and up to date. The system uses secure authentication
                  protocols and encrypted data transmission. Access control is managed through role-based permissions
                  for administrative users.
                </Text>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      <Card {...surfaceCardProps} w="full" maxW="100%" minW="0">
        <CardBody p={{ base: 4, sm: 5, md: 6 }} w="full" maxW="100%" minW="0">
          <VStack spacing={4} align="stretch" w="full">
            <Heading size={{ base: 'sm', sm: 'md' }} color="admin.primary" mb={2} lineHeight="1.3">
              Help & Support
            </Heading>

            <VStack spacing={4} align="stretch" w="full">
              <Box {...calloutBrand} p={{ base: 4, sm: 5 }}>
                <VStack spacing={3} align="start" w="full">
                  <HStack spacing={2}>
                    <Icon as={FiMail} color="brand.500" boxSize={{ base: 4, sm: 5 }} />
                    <Text fontSize={{ base: 'sm', sm: 'md' }} color="brand.700" fontWeight="600">
                      Technical Support
                    </Text>
                  </HStack>
                  <Text fontSize={{ base: 'xs', sm: 'sm' }} color="brand.700" lineHeight="1.6">
                    For technical support, bug reports, feature requests, or general questions about the system,
                    please contact our support team.
                  </Text>
                  <Button
                    as="a"
                    href="https://github.com/lindseystead/foodbank-checkin-system/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    size={{ base: 'sm', sm: 'md' }}
                    colorScheme="brand"
                    variant="solid"
                    rightIcon={<FiExternalLink />}
                    w={{ base: 'full', sm: 'auto' }}
                    minW={{ base: 'auto', sm: '200px' }}
                  >
                    Contact Support
                  </Button>
                  <Text fontSize={{ base: '2xs', sm: 'xs' }} color="brand.600" fontWeight="500">
                    GitHub Issues
                  </Text>
                </VStack>
              </Box>

              <Box {...calloutBrand} p={{ base: 4, sm: 5 }}>
                <VStack spacing={2} align="start" w="full">
                  <HStack spacing={2}>
                    <Icon as={FiInfo} color="brand.500" boxSize={{ base: 4, sm: 5 }} />
                    <Text fontSize={{ base: 'sm', sm: 'md' }} color="brand.700" fontWeight="600">
                      About Link2Feed Integration
                    </Text>
                  </HStack>
                  <Text fontSize={{ base: 'xs', sm: 'sm' }} color="brand.700" lineHeight="1.6">
                    The Link2Feed API integration is completely optional. The system functions fully using CSV exports
                    from Link2Feed or any compatible appointment management system. API integration provides real-time
                    data synchronization and enhanced features, but is not required for basic operations.
                  </Text>
                </VStack>
              </Box>

              <Box {...calloutSuccess} p={{ base: 4, sm: 5 }}>
                <VStack spacing={2} align="start" w="full">
                  <HStack spacing={2}>
                    <Icon as={FiShield} color="accent.green.300" boxSize={{ base: 4, sm: 5 }} />
                    <Text fontSize={{ base: 'sm', sm: 'md' }} color="accent.green.500" fontWeight="600">
                      System Administrator
                    </Text>
                  </HStack>
                  <Text fontSize={{ base: 'xs', sm: 'sm' }} color="accent.green.500" lineHeight="1.6">
                    For system-level configuration changes, user access management, or critical technical issues,
                    please contact your organization's system administrator. They have the necessary permissions to
                    make system-wide changes and manage user accounts.
                  </Text>
                </VStack>
              </Box>

              <Box {...calloutWarning} p={{ base: 4, sm: 5 }}>
                <VStack spacing={2} align="start" w="full">
                  <HStack spacing={2}>
                    <Icon as={FiAlertTriangle} color="accent.orange.300" boxSize={{ base: 4, sm: 5 }} />
                    <Text fontSize={{ base: 'sm', sm: 'md' }} color="accent.orange.500" fontWeight="600">
                      Important Notice
                    </Text>
                  </HStack>
                  <Text fontSize={{ base: 'xs', sm: 'sm' }} color="accent.orange.500" lineHeight="1.6">
                    Changes to integration settings, API credentials, or system configuration may affect data
                    processing and system functionality. Please ensure you understand the implications of any changes
                    before saving new configurations. If you are unsure, contact technical support for assistance.
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default SettingsSecondaryColumn;
