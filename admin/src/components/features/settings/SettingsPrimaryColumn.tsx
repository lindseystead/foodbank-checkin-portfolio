/**
 * @fileoverview Primary settings column (Link2Feed + system config)
 */

import React from 'react';
import {
  Badge,
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiInfo, FiLink, FiSettings } from 'react-icons/fi';
import Link2FeedStatus from '../dashboard/Link2FeedStatus';
import { surfaceCardProps } from './settingsStyles';

const SettingsPrimaryColumn: React.FC = () => {
  return (
    <VStack spacing={{ base: 6, sm: 6 }} align="stretch" w="full" maxW="100%" minW="0">
      <Card {...surfaceCardProps} w="full" maxW="100%" minW="0">
        <CardBody p={{ base: 4, sm: 5, md: 6 }} w="full" maxW="100%" minW="0">
          <VStack spacing={6} align="stretch" w="full">
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              justify="space-between"
              align={{ base: 'start', sm: 'center' }}
              gap={{ base: 3, sm: 4 }}
              w="full"
              flexWrap="wrap"
            >
              <HStack spacing={3} minW="0" flex={1}>
                <Box
                  p={2}
                  bg="blue.50"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon as={FiLink} color="admin.primary" boxSize={{ base: 4, sm: 5 }} />
                </Box>
                <VStack spacing={0} align="start" minW="0" flex={1}>
                  <Heading size={{ base: 'sm', sm: 'md' }} color="admin.primary" lineHeight="1.3">
                    Link2Feed API Integration
                  </Heading>
                  <Text color="gray.600" fontSize={{ base: 'xs', sm: 'sm' }} lineHeight="1.5" noOfLines={2}>
                    Connect to Link2Feed API for real-time data synchronization and enhanced appointment management
                  </Text>
                </VStack>
              </HStack>
              <Badge
                colorScheme="gray"
                variant="subtle"
                px={{ base: 2, sm: 3 }}
                py={1}
                borderRadius="full"
                fontSize={{ base: 'xs', sm: 'sm' }}
                flexShrink={0}
              >
                Optional
              </Badge>
            </Flex>

            <Divider borderColor="gray.200" />

            <Box w="full" minW="0">
              <Link2FeedStatus />
            </Box>
          </VStack>
        </CardBody>
      </Card>

      <Card {...surfaceCardProps} w="full" maxW="100%" minW="0">
        <CardBody p={{ base: 4, sm: 5, md: 6 }} w="full" maxW="100%" minW="0">
          <VStack spacing={4} align="stretch" w="full">
            <HStack spacing={3} flexWrap="wrap">
              <Box
                p={2}
                bg="blue.50"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon as={FiSettings} color="admin.primary" boxSize={{ base: 4, sm: 5 }} />
              </Box>
              <VStack spacing={0} align="start" minW="0" flex={1}>
                <Heading size={{ base: 'sm', sm: 'md' }} color="admin.primary" lineHeight="1.3">
                  System Configuration
                </Heading>
                <Text color="gray.600" fontSize={{ base: 'xs', sm: 'sm' }} lineHeight="1.5">
                  General system settings and operational preferences
                </Text>
              </VStack>
            </HStack>

            <Box bg="gray.50" p={{ base: 4, sm: 5 }} borderRadius="md" border="1px solid" borderColor="gray.200">
              <VStack spacing={3} align="start" w="full">
                <HStack spacing={2}>
                  <Icon as={FiInfo} color="blue.500" boxSize={{ base: 4, sm: 5 }} />
                  <Text fontSize={{ base: 'sm', sm: 'md' }} fontWeight="600" color="gray.800">
                    Configuration Status
                  </Text>
                </HStack>
                <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.700" lineHeight="1.6">
                  All system settings are managed through the Link2Feed API integration section above.
                  The system operates effectively in CSV-only mode without requiring API configuration.
                </Text>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default SettingsPrimaryColumn;
