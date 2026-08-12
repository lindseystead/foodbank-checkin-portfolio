/**
 * @fileoverview Action buttons for confirmation page.
 */

import React from 'react';
import { Fade, Stack, VStack } from '@chakra-ui/react';
import AssistanceButton from '../../../shared/components/buttons/AssistanceButton';
import FinishButton from '../../../shared/components/buttons/FinishButton';
import ImportantInfoNotice from './ImportantInfoNotice';
import { FiCheck } from 'react-icons/fi';

interface ConfirmationActionButtonsProps {
  onFinish: () => void;
  doneLabel: string;
}

const ConfirmationActionButtons: React.FC<ConfirmationActionButtonsProps> = ({ onFinish, doneLabel }) => {
  return (
    <Fade in={true} delay={0.6}>
      <VStack spacing={4} width="full">
        <ImportantInfoNotice />

        <Stack
          spacing={{ base: 4, md: 4 }}
          direction={{ base: 'column', md: 'row' }}
          width="full"
          maxW="100%"
          justify="center"
          align="center"
          pt={4}
        >
          <AssistanceButton />
          <FinishButton
            onClick={onFinish}
            rightIcon={<FiCheck />}
            borderRadius="lg"
          >
            {doneLabel}
          </FinishButton>
        </Stack>
      </VStack>
    </Fade>
  );
};

export default ConfirmationActionButtons;
