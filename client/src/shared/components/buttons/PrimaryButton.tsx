/**
 * @fileoverview Primary CTA — sizing/color come from Button variant="primary".
 */

import React from 'react';
import { Button, ButtonProps, HStack, Box } from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, ...props }) => {
  return (
    <Button variant="primary" {...props}>
      <HStack spacing={2} justify="center" width="100%">
        <Box>{children}</Box>
        <Box as={FiArrowRight} boxSize={5} />
      </HStack>
    </Button>
  );
};

export default PrimaryButton;
