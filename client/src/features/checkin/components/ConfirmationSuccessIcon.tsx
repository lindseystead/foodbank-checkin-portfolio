/**
 * @fileoverview Success icon block for confirmation page.
 */

import React from 'react';
import { Circle, Icon, ScaleFade, VStack } from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';

const ConfirmationSuccessIcon: React.FC = () => {
  return (
    <ScaleFade in={true} initialScale={0.9}>
      <VStack spacing={4} align="center" mb={6}>
        <Circle
          size={{ base: '50px', md: '60px' }}
          bg="accent.green.50"
          color="accent.green.400"
          transition="all 0.3s"
          _hover={{ transform: 'scale(1.05)' }}
          boxShadow="md"
          border="2px solid"
          borderColor="accent.green.200"
        >
          <Icon as={FiCheckCircle} boxSize={{ base: '25px', md: '30px' }} />
        </Circle>
      </VStack>
    </ScaleFade>
  );
};

export default ConfirmationSuccessIcon;
