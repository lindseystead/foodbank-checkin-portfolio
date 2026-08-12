/**
 * @fileoverview Summary card for client detail page
 */

import React from 'react';
import { Badge, Box, HStack, Text, VStack } from '@chakra-ui/react';
import { JoinedClient } from './types';

interface ClientSummaryCardProps {
  client: JoinedClient;
}

const ClientSummaryCard: React.FC<ClientSummaryCardProps> = ({ client }) => {
  return (
    <Box p={{ base: 3, sm: 4, md: 5 }} bg="gray.50" borderRadius="md" w="full" maxW="100%">
      <VStack spacing={3} align="start">
        <HStack>
          <Text fontWeight="bold">Client ID:</Text>
          <Badge colorScheme="blue">{client.id}</Badge>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Phone:</Text>
          <Text>{client.phone || 'Not provided'}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Email:</Text>
          <Text>{client.email || 'Not provided'}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Household Size:</Text>
          <Text>{client.householdSize || 'Not provided'}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Adults:</Text>
          <Text>{client.adults || 'Not specified'}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Seniors:</Text>
          <Text>{client.seniors || 'Not specified'}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Children:</Text>
          <Text>{client.children || 'Not specified'}</Text>
        </HStack>
        {client.childrensAges && (
          <HStack>
            <Text fontWeight="bold">Children's Ages:</Text>
            <Text>{client.childrensAges}</Text>
          </HStack>
        )}
        <HStack>
          <Text fontWeight="bold">Dietary Considerations:</Text>
          <Text>{client.dietary || 'None'}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Allergies:</Text>
          <Text>{client.allergies || 'None'}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Client Type:</Text>
          <Text>{client.clientType || 'Not specified'}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Location:</Text>
          <Text>{client.location || 'Not specified'}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Program:</Text>
          <Text>{client.program || 'Food Hamper'}</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ClientSummaryCard;
