/**
 * @fileoverview Special requests section for client detail page
 */

import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { JoinedClient } from './types';

interface ClientSpecialRequestsProps {
  client: JoinedClient;
}

const ClientSpecialRequests: React.FC<ClientSpecialRequestsProps> = ({ client }) => {
  const hasRequests =
    client.dietaryRestrictions ||
    client.allergies ||
    client.unwantedFoods ||
    client.additionalInfo ||
    client.hasMobilityIssues ||
    client.diaperSize;

  if (!hasRequests) return null;

  return (
    <Box p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
      <VStack spacing={3} align="start">
        <Heading size="md" color="blue.700">
          Special Requests from Check-in
        </Heading>

        {client.dietaryRestrictions && (
          <Box>
            <Text fontWeight="bold" color="blue.600">
              Dietary Restrictions:
            </Text>
            <Text>{client.dietaryRestrictions}</Text>
          </Box>
        )}

        {client.allergies && (
          <Box>
            <Text fontWeight="bold" color="blue.600">
              Allergies:
            </Text>
            <Text>{client.allergies}</Text>
          </Box>
        )}

        {client.unwantedFoods && (
          <Box>
            <Text fontWeight="bold" color="blue.600">
              Unwanted Foods:
            </Text>
            <Text>{client.unwantedFoods}</Text>
          </Box>
        )}

        {client.additionalInfo && (
          <Box>
            <Text fontWeight="bold" color="blue.600">
              Additional Information:
            </Text>
            <Text>{client.additionalInfo}</Text>
          </Box>
        )}

        {client.hasMobilityIssues && (
          <Box>
            <Text fontWeight="bold" color="blue.600">
              ♿ Mobility Assistance:
            </Text>
            <Text>Volunteer help requested for packing food into car</Text>
          </Box>
        )}

        {client.diaperSize && (
          <Box>
            <Text fontWeight="bold" color="blue.600">
              Diaper Size (Tiny Bundles):
            </Text>
            <Text>{client.diaperSize}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ClientSpecialRequests;
