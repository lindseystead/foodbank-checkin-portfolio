/**
 * @fileoverview Next appointment section for client detail page
 */

import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { JoinedClient } from './types';
import { useTenantTime } from '../../../../utils/useTenantTime';

interface ClientNextAppointmentProps {
  client: JoinedClient;
}

const ClientNextAppointment: React.FC<ClientNextAppointmentProps> = ({ client }) => {
  const { tz: tenantTz } = useTenantTime();
  if (!client.nextAppointmentDate && !client.ticketNumber) return null;

  return (
    <Box p={4} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
      <VStack spacing={3} align="start">
        <Heading size="md" color="green.700">
          Next Appointment
        </Heading>

        {client.nextAppointmentDate && (
          <Box>
            <Text fontWeight="bold" color="green.600">
              Date:
            </Text>
            <Text>
              {new Date(client.nextAppointmentDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: tenantTz,
              })}
            </Text>
          </Box>
        )}

        {client.nextAppointmentTime && (
          <Box>
            <Text fontWeight="bold" color="green.600">
              Time:
            </Text>
            <Text>{client.nextAppointmentTime}</Text>
          </Box>
        )}

        {client.ticketNumber && (
          <Box>
            <Text fontWeight="bold" color="green.600">
              Ticket Number:
            </Text>
            <Text fontFamily="mono" fontSize="lg">
              {client.ticketNumber}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ClientNextAppointment;
