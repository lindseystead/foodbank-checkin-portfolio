/**
 * @fileoverview Back button component for Foodbank Check-In and Appointment System client application
 * 
 * This component provides a back navigation button with consistent
 * styling and behavior for returning to previous steps in the
 * check-in process.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../PrimaryButton.tsx} Primary button component
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonHoverBg = useColorModeValue('gray.50', 'gray.700');
  const iconColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Button
      leftIcon={<Icon as={ChevronLeftIcon} w={6} h={6} color={iconColor} />}
      onClick={() => navigate(-1)}
      variant="ghost"
      size="md"
      bg={buttonBg}
      _hover={{
        bg: buttonHoverBg,
        transform: 'translateX(-4px)',
      }}
      _active={{
        bg: buttonHoverBg,
        transform: 'translateX(-2px)',
      }}
      transition="all 0.2s"
      position="absolute"
      top={4}
      left={4}
      zIndex={1}
    >
      Back
    </Button>
  );
};

export default BackButton; 