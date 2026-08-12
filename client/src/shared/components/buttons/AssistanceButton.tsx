/**
 * @fileoverview Assistance CTA — uses Button variant="assistance" from theme.
 */

import React from 'react';
import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';
import { FiHelpCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import HelpRequestModal from '../modals/HelpRequestModal';

interface AssistanceButtonProps extends ButtonProps {
  onClick?: () => void;
  clientData?: {
    phoneNumber?: string;
    lastName?: string;
  };
}

const AssistanceButton: React.FC<AssistanceButtonProps> = ({
  onClick,
  clientData,
  ...buttonProps
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (onClick) {
    return (
      <Button
        variant="assistance"
        leftIcon={<FiHelpCircle />}
        onClick={onClick}
        {...buttonProps}
      >
        {t('assistance.button', 'Need Help?')}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="assistance"
        leftIcon={<FiHelpCircle />}
        onClick={onOpen}
        {...buttonProps}
      >
        {t('assistance.button', 'Need Help?')}
      </Button>

      <HelpRequestModal
        isOpen={isOpen}
        onClose={onClose}
        clientData={clientData}
      />
    </>
  );
};

export default AssistanceButton;
