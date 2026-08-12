/**
 * @fileoverview Preferences summary section for confirmation page.
 */

import React from 'react';
import { Box, Fade, Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';

interface PreferencesSummarySectionProps {
  appointmentDetails: {
    dietaryRestrictions?: string[];
    hasMobilityIssues?: boolean;
    additionalInfo?: string;
  };
  specialRequestsData: {
    allergies?: string;
    unwantedFoods?: string;
    additionalInfo?: string;
  };
  dietaryKeyMap: Record<string, string>;
  t: (key: string, options?: any) => string;
}

const PreferencesSummarySection: React.FC<PreferencesSummarySectionProps> = ({
  appointmentDetails,
  specialRequestsData,
  dietaryKeyMap,
  t,
}) => {
  return (
    <Fade in={true} delay={0.4}>
      <Box mb={4} w="full">
        <VStack spacing={3} align="stretch">
          <Box textAlign="center">
            <Heading as="h2" fontSize={{ base: 'md', md: 'lg' }} color="client.primary" fontWeight="bold" mb={1}>
              📋 Special Requests Summary
            </Heading>
            <Text fontSize="xs" color="gray.600">
              Here's what we've recorded for your visit
            </Text>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={{ base: 3, md: 4 }}
            w="full"
            maxW="100%"
          >
            {/* Dietary Preferences */}
            <Box
              bg="white"
              border="2px solid"
              borderColor="accent.green.200"
              borderRadius="xl"
              p={{ base: 3, md: 4 }}
              _hover={{ borderColor: 'accent.green.300', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              w="full"
              overflow="hidden"
            >
              <VStack spacing={3} align="start">
                <HStack spacing={3}>
                  <Text fontSize="lg">🥗</Text>
                  <Text fontWeight="600" color="accent.green.500" fontSize="md">
                    Dietary Preferences
                  </Text>
                </HStack>

                {appointmentDetails.dietaryRestrictions?.length ? (
                  <VStack spacing={2} align="stretch" w="full">
                    {appointmentDetails.dietaryRestrictions.map((restriction) => (
                      <HStack
                        key={restriction}
                        spacing={3}
                        bg="accent.green.50"
                        p={3}
                        borderRadius="lg"
                        _hover={{ bg: 'accent.green.100' }}
                        transition="all 0.2s"
                      >
                        <Icon as={FiCheck} color="accent.green.400" boxSize={4} />
                        <Text color="accent.green.600" fontSize="sm">
                          {t(`specialRequests.${dietaryKeyMap[restriction] || restriction.toLowerCase()}`)}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500" fontSize="sm" fontStyle="italic">
                    No dietary preferences specified
                  </Text>
                )}
              </VStack>
            </Box>

            {/* Special Requests */}
            <Box
              bg="white"
              border="2px solid"
              borderColor="accent.purple.200"
              borderRadius="xl"
              p={{ base: 3, md: 4 }}
              _hover={{ borderColor: 'accent.purple.300', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              w="full"
              overflow="hidden"
            >
              <VStack spacing={3} align="start">
                <HStack spacing={3}>
                  <Text fontSize="lg">♿</Text>
                  <Text fontWeight="600" color="accent.purple.500" fontSize="md">
                    Special Requests
                  </Text>
                </HStack>

                <VStack spacing={3} align="stretch" w="full">
                  <HStack spacing={3} bg="accent.purple.50" p={3} borderRadius="lg">
                    <Icon as={FiCheck} color="accent.purple.400" boxSize={4} />
                    <Text color="accent.purple.600" fontSize="sm">
                      {appointmentDetails.hasMobilityIssues ? 'Mobility assistance requested' : 'No mobility assistance needed'}
                    </Text>
                  </HStack>

                  {(specialRequestsData.allergies || specialRequestsData.unwantedFoods) && (
                    <HStack spacing={3} bg="accent.purple.50" p={3} borderRadius="lg">
                      <Icon as={FiCheck} color="accent.purple.400" boxSize={4} />
                      <Text color="accent.purple.600" fontSize="sm">
                        Food restrictions noted
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </Box>
          </Box>

          {/* Additional Information */}
          {(specialRequestsData.additionalInfo ||
            specialRequestsData.allergies ||
            specialRequestsData.unwantedFoods) && (
            <Box
              bg="white"
              border="2px solid"
              borderColor="brand.200"
              borderRadius="xl"
              p={{ base: 3, md: 4 }}
              _hover={{ borderColor: 'brand.300', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              w="full"
              overflow="hidden"
            >
              <VStack spacing={3} align="start">
                <HStack spacing={3}>
                  <Text fontSize="lg">📝</Text>
                  <Text fontWeight="600" color="client.primary" fontSize="md">
                    Additional Information
                  </Text>
                </HStack>

                <VStack spacing={3} align="stretch" w="full">
                  {specialRequestsData.allergies && (
                    <Box>
                      <Text fontSize="sm" fontWeight="500" color="gray.600" mb={1}>
                        Allergies & Food Restrictions:
                      </Text>
                      <Text color="gray.700" fontSize="sm" bg="gray.50" p={3} borderRadius="lg">
                        {specialRequestsData.allergies}
                      </Text>
                    </Box>
                  )}

                  {specialRequestsData.additionalInfo && (
                    <Box>
                      <Text fontSize="sm" fontWeight="500" color="gray.600" mb={1}>
                        Additional Notes:
                      </Text>
                      <Text color="gray.700" fontSize="sm" bg="gray.50" p={3} borderRadius="lg">
                        {specialRequestsData.additionalInfo}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </Fade>
  );
};

export default PreferencesSummarySection;
