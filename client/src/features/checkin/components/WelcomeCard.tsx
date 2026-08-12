/**
 * @fileoverview Welcome card for the special requests page.
 */

import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

interface WelcomeCardProps {
  clientName: string;
  appointmentDate: string;
  appointmentTime: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ clientName, appointmentDate, appointmentTime }) => {
  return (
    <Box
      bg="brand.50"
      border="1px solid"
      borderColor="brand.200"
      borderRadius="xl"
      p={6}
      mb={8}
      textAlign="center"
      boxShadow="sm"
    >
      <Heading size="md" color="client.primary" mb={2}>
        👋 Hello {clientName}! We found your appointment
      </Heading>
      <Box
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="center"
        gap={{ base: 1, sm: 2 }}
        flexWrap="wrap"
      >
        <Text color="brand.600" fontSize="sm" fontWeight="500">
          📅 {appointmentDate}
        </Text>
        <Text color="brand.500" fontSize="sm" fontWeight="600">
          at {appointmentTime}
        </Text>
      </Box>
    </Box>
  );
};

export default WelcomeCard;
