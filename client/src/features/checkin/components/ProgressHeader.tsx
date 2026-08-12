/**
 * @fileoverview Shared progress header for check-in flow pages.
 * Sits in normal document flow below the back button (no absolute overlap).
 */

import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import ProgressSteps from '../../../shared/components/layout/ProgressSteps';

interface ProgressHeaderProps extends BoxProps {
  currentStep: number;
  totalSteps: number;
  /**
   * When true (default), adds top margin so the bar clears the absolutely positioned back button.
   * Set false when there is no back button (e.g. confirmation).
   */
  insetBelowBackButton?: boolean;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentStep,
  totalSteps,
  insetBelowBackButton = true,
  ...boxProps
}) => {
  return (
    <Box
      w="full"
      position="relative"
      zIndex={2}
      mt={insetBelowBackButton ? { base: '40px', md: '44px' } : 0}
      mx={{ base: -4, sm: -5, md: -6 }}
      bg="white"
      {...boxProps}
    >
      <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />
    </Box>
  );
};

export default ProgressHeader;
