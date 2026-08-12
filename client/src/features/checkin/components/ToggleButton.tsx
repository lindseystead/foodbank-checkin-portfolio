/**
 * @fileoverview Toggle button used for special request options.
 * Height comes from theme Button size="md" (48px).
 */

import React from 'react';
import { Button } from '@chakra-ui/react';

interface ToggleButtonProps {
  isActive: boolean;
  onToggle: () => void;
  label: string;
  icon?: React.ElementType;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isActive, onToggle, label, icon: IconCmp }) => {
  return (
    <Button
      onClick={onToggle}
      width="100%"
      size="md"
      variant={isActive ? 'solid' : 'outline'}
      bg={isActive ? 'client.primary' : 'white'}
      color={isActive ? 'white' : 'gray.700'}
      borderColor={isActive ? 'client.primary' : 'gray.300'}
      borderRadius="lg"
      fontWeight="500"
      fontSize="sm"
      leftIcon={IconCmp ? <IconCmp size={16} /> : undefined}
      _hover={{
        bg: isActive ? 'client.primary' : 'brand.50',
        borderColor: isActive ? 'client.primary' : 'brand.300',
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
      _active={{
        transform: 'translateY(0)',
        boxShadow: 'sm',
      }}
      _focus={{
        boxShadow: '0 0 0 3px var(--chakra-colors-brand-200)',
      }}
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      whiteSpace="normal"
      textAlign="center"
      px={4}
    >
      {label}
    </Button>
  );
};

export default ToggleButton;
