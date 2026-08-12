/**
 * @fileoverview Appointment summary card for confirmation page.
 */

import React from 'react';
import { Box, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FiCalendar } from 'react-icons/fi';
import type { NextAppointment } from '../hooks/useNextAppointment';

interface ConfirmationAppointmentSummaryProps {
  nextAppointment: NextAppointment | null;
}

const ConfirmationAppointmentSummary: React.FC<ConfirmationAppointmentSummaryProps> = ({ nextAppointment }) => {
  return (
    <Box
      bg="brand.50"
      borderRadius="lg"
      p={{ base: 3, md: 4 }}
      mb={8}
      border="1px solid"
      borderColor="client.primary"
      w="full"
      maxW={{ base: '100%', md: '400px' }}
      mx="auto"
      boxShadow="sm"
    >
      <VStack spacing={3} align="center">
        <HStack spacing={2} align="center" justify="center">
          <Box bg="client.primary" borderRadius="full" p={1.5} boxShadow="sm">
            <Icon as={FiCalendar} color="white" boxSize={4} />
          </Box>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="700"
            color="client.primary"
            textTransform="uppercase"
            letterSpacing="wide"
            textAlign="center"
          >
            Your Next Appointment
          </Text>
        </HStack>

        <Box
          bg="white"
          borderRadius="lg"
          p={{ base: 2, md: 3 }}
          border="1px solid"
          borderColor="client.primary"
          boxShadow="sm"
          w="full"
          maxW="350px"
        >
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            fontWeight="700"
            color="client.primary"
            textAlign="center"
            lineHeight="1.2"
            px={1}
            wordBreak="break-word"
          >
            {nextAppointment ? nextAppointment.formattedDate : 'Loading...'}
          </Text>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="600"
            color="brand.700"
            textAlign="center"
            px={1}
          >
            at {nextAppointment ? nextAppointment.time : 'Loading...'}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default ConfirmationAppointmentSummary;
