/**
 * @fileoverview Summary card for the appointment details page.
 */

import React from 'react';
import { Box, Divider, HStack, Icon, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import type { NextAppointment } from '../hooks/useNextAppointment';

interface CheckInSummaryCardProps {
  nextAppointment: NextAppointment | null;
}

const CheckInSummaryCard: React.FC<CheckInSummaryCardProps> = ({ nextAppointment }) => {
  return (
    <Box
      bg="gray.50"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={{ base: 5, md: 6 }}
      mb={6}
      maxW={{ base: '100%', md: '700px' }}
      mx="auto"
    >
      <VStack spacing={4} align="stretch">
        <HStack spacing={2} align="center" color="gray.700">
          <Icon as={FiCheckCircle} boxSize={5} color="green.500" />
          <Text fontWeight="600" fontSize="md" color="gray.800">
            Check-In Summary
          </Text>
        </HStack>

        <Divider borderColor="gray.300" />

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          <Box>
            <Text fontSize="xs" color="gray.600" mb={1} textTransform="uppercase" letterSpacing="wide">
              Current Visit
            </Text>
            <Text fontSize="sm" fontWeight="600" color="gray.800">
              ✓ Check-in Complete
            </Text>
          </Box>

          <Box>
            <Text fontSize="xs" color="gray.600" mb={1} textTransform="uppercase" letterSpacing="wide">
              Next Appointment
            </Text>
            <Text fontSize="sm" fontWeight="600" color="gray.800">
              {nextAppointment ? `${nextAppointment.formattedDate} at ${nextAppointment.time}` : 'Loading...'}
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default CheckInSummaryCard;
