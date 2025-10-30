/**
 * @fileoverview Reschedule button component for Foodbank Check-In and Appointment System client application
 * 
 * This component provides a reschedule button for appointment
 * management. It handles rescheduling functionality and
 * navigation to appointment modification interfaces.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../PrimaryButton.tsx} Primary button component
 */

import React, { ReactElement } from 'react';
import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface RescheduleButtonProps {
  onClick: () => void;
  leftIcon?: ReactElement;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
}

const RescheduleButton: React.FC<RescheduleButtonProps> = ({ onClick, leftIcon, size = 'md', colorScheme = 'blue' }) => {
  const { t } = useTranslation();
  const isOrange = colorScheme === 'orange';
  return (
    <Button
      onClick={onClick}
      colorScheme={colorScheme}
      variant={isOrange ? 'solid' : 'outline'}
      size={size}
      leftIcon={leftIcon}
      px={6}
      py={2}
      borderRadius="2xl"
      fontWeight="bold"
      fontSize="md"
      boxShadow={isOrange ? 'md' : undefined}
      display="inline-flex"
      alignItems="center"
      transition="background 0.2s, box-shadow 0.2s"
      _hover={{
        bg: isOrange ? 'orange.400' : 'blue.50',
        color: isOrange ? 'white' : undefined,
        boxShadow: isOrange ? 'lg' : 'md',
        transform: 'translateY(-2px)'
      }}
    >
      {t('appointment.rescheduleButton')}
    </Button>
  );
};

export default RescheduleButton; 