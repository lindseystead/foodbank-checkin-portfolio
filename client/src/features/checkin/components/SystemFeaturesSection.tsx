/**
 * @fileoverview System features showcase section.
 */

import React from 'react';
import { Box, HStack, Icon, SimpleGrid, Text, VStack, Heading } from '@chakra-ui/react';
import { FiGlobe, FiShield, FiUsers, FiZap } from 'react-icons/fi';

const SystemFeaturesSection: React.FC = () => {
  return (
    <Box mb={8} maxW={{ base: '100%', md: '900px' }} mx="auto">
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" mb={4}>
          <Heading size="md" color="gray.800" mb={2}>
            ✨ What to Expect
          </Heading>
          <Text fontSize="md" color="gray.600" maxW="600px" mx="auto">
            Our digital check-in system makes your visit quick and easy
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 4, md: 6 }} w="full">
          {/* Fast Check-In Feature */}
          <Box
            bg="blue.50"
            border="2px solid"
            borderColor="blue.200"
            borderRadius="xl"
            p={{ base: 5, md: 6 }}
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: 'lg',
              borderColor: 'blue.300',
            }}
            position="relative"
            overflow="hidden"
          >
            <VStack spacing={3} align="start">
              <HStack spacing={3} align="center">
                <Box bg="blue.500" borderRadius="lg" p={3} boxShadow="md">
                  <Icon as={FiZap} boxSize={6} color="white" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="700" color="blue.700">
                    Fast Check-In
                  </Text>
                  <Text fontSize="xs" color="blue.600">
                    Under 5 minutes
                  </Text>
                </VStack>
              </HStack>
              <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                Complete your check-in quickly with our streamlined digital process. No more waiting in long lines.
              </Text>
            </VStack>
          </Box>

          {/* Multilingual Support Feature */}
          <Box
            bg="purple.50"
            border="2px solid"
            borderColor="purple.200"
            borderRadius="xl"
            p={{ base: 5, md: 6 }}
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: 'lg',
              borderColor: 'purple.300',
            }}
            position="relative"
            overflow="hidden"
          >
            <VStack spacing={3} align="start">
              <HStack spacing={3} align="center">
                <Box bg="purple.500" borderRadius="lg" p={3} boxShadow="md">
                  <Icon as={FiGlobe} boxSize={6} color="white" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="700" color="purple.700">
                    Multilingual
                  </Text>
                  <Text fontSize="xs" color="purple.600">
                    7 languages available
                  </Text>
                </VStack>
              </HStack>
              <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                Use the system in your preferred language. We support English, French, Spanish, Chinese, Hindi, Arabic, and Punjabi.
              </Text>
            </VStack>
          </Box>

          {/* Privacy & Security Feature */}
          <Box
            bg="green.50"
            border="2px solid"
            borderColor="green.200"
            borderRadius="xl"
            p={{ base: 5, md: 6 }}
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: 'lg',
              borderColor: 'green.300',
            }}
            position="relative"
            overflow="hidden"
          >
            <VStack spacing={3} align="start">
              <HStack spacing={3} align="center">
                <Box bg="green.500" borderRadius="lg" p={3} boxShadow="md">
                  <Icon as={FiShield} boxSize={6} color="white" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="700" color="green.700">
                    Privacy First
                  </Text>
                  <Text fontSize="xs" color="green.600">
                    Your data is protected
                  </Text>
                </VStack>
              </HStack>
              <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                All check-in data is automatically deleted after 24 hours. Your privacy is our priority.
              </Text>
            </VStack>
          </Box>

          {/* Accessible Design Feature */}
          <Box
            bg="orange.50"
            border="2px solid"
            borderColor="orange.200"
            borderRadius="xl"
            p={{ base: 5, md: 6 }}
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: 'lg',
              borderColor: 'orange.300',
            }}
            position="relative"
            overflow="hidden"
          >
            <VStack spacing={3} align="start">
              <HStack spacing={3} align="center">
                <Box bg="orange.500" borderRadius="lg" p={3} boxShadow="md">
                  <Icon as={FiUsers} boxSize={6} color="white" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="700" color="orange.700">
                    Accessible
                  </Text>
                  <Text fontSize="xs" color="orange.600">
                    For everyone
                  </Text>
                </VStack>
              </HStack>
              <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                Designed with accessibility in mind. Works with screen readers, keyboard navigation, and large touch targets.
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default SystemFeaturesSection;
