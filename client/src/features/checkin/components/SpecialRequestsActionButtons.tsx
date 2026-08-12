/**
 * @fileoverview Action buttons for special requests page.
 */

import React from 'react';
import { Stack } from '@chakra-ui/react';
import AssistanceButton from '../../../shared/components/buttons/AssistanceButton';
import PrimaryButton from '../../../shared/components/buttons/PrimaryButton';

interface SpecialRequestsActionButtonsProps {
  onContinue: () => void;
  continueLabel: string;
}

const SpecialRequestsActionButtons: React.FC<SpecialRequestsActionButtonsProps> = ({
  onContinue,
  continueLabel,
}) => {
  return (
    <Stack
      spacing={{ base: 4, md: 6 }}
      direction={{ base: 'column', md: 'row' }}
      width="full"
      pt={{ base: 6, md: 8 }}
      justify="center"
      align="center"
      mt={{ base: 4, md: 6 }}
    >
      <AssistanceButton />
      <PrimaryButton onClick={onContinue}>
        {continueLabel}
      </PrimaryButton>
    </Stack>
  );
};

export default SpecialRequestsActionButtons;
