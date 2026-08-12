/**
 * @fileoverview Important information section.
 */

import React from 'react';
import { Box, Divider, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';

const ImportantInfoSection: React.FC = () => {
  return (
    <Box
      bg="gradient-to-br"
      bgGradient="linear(to-br, orange.50, yellow.50)"
      border="2px solid"
      borderColor="orange.200"
      borderRadius="2xl"
      p={{ base: 6, md: 8 }}
      mb={8}
      position="relative"
      maxW={{ base: '100%', md: '800px' }}
      mx="auto"
      boxShadow="md"
    >
      <VStack spacing={5} align="center">
        <HStack spacing={3} align="center" color="orange.600">
          <Icon as={FiInfo} boxSize={6} />
          <Text fontWeight="700" fontSize="xl" color="orange.700" textAlign="center">
            Important Information
          </Text>
        </HStack>

        <Divider borderColor="orange.200" />

        <VStack spacing={4} align="stretch" w="full" maxW="600px">
          <HStack spacing={3} align="start">
            <Box bg="orange.100" borderRadius="full" p={2} mt={1} flexShrink={0}>
              <Text fontSize="sm">⏰</Text>
            </Box>
            <Box flex={1}>
              <Text fontWeight="600" fontSize="sm" color="gray.800" mb={1}>
                Arrival Time
              </Text>
              <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                Please arrive on time for your scheduled appointment. We experience high volume and appreciate your punctuality.
              </Text>
            </Box>
          </HStack>

          <HStack spacing={3} align="start">
            <Box bg="orange.100" borderRadius="full" p={2} mt={1} flexShrink={0}>
              <Text fontSize="sm">📞</Text>
            </Box>
            <Box flex={1}>
              <Text fontWeight="600" fontSize="sm" color="gray.800" mb={1}>
                Need to Reschedule?
              </Text>
              <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                If you need to change your appointment time, please contact us in advance. We're here to help.
              </Text>
            </Box>
          </HStack>

          <HStack spacing={3} align="start">
            <Box bg="orange.100" borderRadius="full" p={2} mt={1} flexShrink={0}>
              <Text fontSize="sm">✅</Text>
            </Box>
            <Box flex={1}>
              <Text fontWeight="600" fontSize="sm" color="gray.800" mb={1}>
                What to Bring
              </Text>
              <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                Please bring a valid ID and be ready to provide your appointment confirmation when you arrive.
              </Text>
            </Box>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default ImportantInfoSection;
