/**
 * @fileoverview Primary button component for Foodbank Check-In and Appointment System client application
 * 
 * This component provides a primary action button with consistent
 * styling, accessibility features, and responsive design for
 * main user actions throughout the client application.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../theme.ts} Theme configuration
 */

import React from 'react';
import { Button, ButtonProps, HStack, Box } from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, width, height, ...props }) => {
  // IMPORTANT: Override variant defaults to ensure props take precedence
  // If width is provided, set minW to match to prevent variant minW from overriding
  const minW = width ? (typeof width === 'object' ? width : { base: width, md: width }) : undefined;
  
  return (
    <Button
      variant="primary"
      width={width}
      height={height}
      minW={minW}
      {...props}
    >
      <HStack spacing={2} justify="center" width="100%">
        <Box>{children}</Box>
        <Box as={FiArrowRight} size="20px" />
      </HStack>
    </Button>
  );
};

export default PrimaryButton; 