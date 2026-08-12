/**
 * @fileoverview Search section for Check-ins page
 */

import React from 'react';
import { Box, Heading, HStack, Icon, Input, VStack } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

interface CheckInsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const CheckInsSearch: React.FC<CheckInsSearchProps> = ({ value, onChange }) => {
  return (
    <Box mb={{ base: 3, sm: 4, md: 5 }} w="full" maxW="100%">
      <Heading
        size="lg"
        color="admin.primary"
        mb={4}
        textAlign="center"
        fontWeight="semibold"
      >
        Search & Filter
      </Heading>
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
        p={{ base: 3, sm: 4, md: 5 }}
        w="full"
        maxW="100%"
        mx="auto"
      >
        <VStack spacing={4} align="stretch">
          <HStack spacing={2}>
            <Icon as={FiSearch} color="admin.muted" boxSize={4} />
            <Input
              placeholder="Search by name, ID, or phone..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              flex={1}
              size="md"
              border="none"
              _focus={{ boxShadow: 'none' }}
            />
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default CheckInsSearch;
