/**
 * @fileoverview Important information notice for confirmation page.
 */

import React from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';

const ImportantInfoNotice: React.FC = () => {
  return (
    <Box
      bg="accent.orange.100"
      border="2px solid"
      borderColor="accent.orange.200"
      borderRadius="lg"
      p={{ base: 3, md: 4 }}
      position="relative"
      w="full"
    >
      <Box position="absolute" top={3} right={3} fontSize="xl">
        ⚠️
      </Box>
      <VStack spacing={3} align="center">
        <Text fontWeight="600" fontSize="md" color="accent.orange.500" textAlign="center">
          Important Information
        </Text>
        <VStack spacing={2} align="center" fontSize="sm" color="gray.700">
          <HStack spacing={3} align="center" justify="center">
            <Text fontSize="lg">🚗</Text>
            <Text textAlign="center" flex="1">
              Please arrive at your assigned time. Due to high demand, early arrivals may be asked to return.
            </Text>
          </HStack>
          <HStack spacing={3} align="center" justify="center">
            <Text fontSize="lg">📞</Text>
            <Text textAlign="center" flex="1">
              Running late? Need to change your appointment? Please give us a call and we are happy to help.
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default ImportantInfoNotice;
