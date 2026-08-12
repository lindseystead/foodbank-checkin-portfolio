/**
 * @fileoverview Dietary options grid for special requests.
 */

import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import ToggleButton from './ToggleButton';

interface DietaryOption {
  value: string;
  label: string;
  icon?: React.ElementType;
}

interface DietaryOptionsGridProps {
  options: DietaryOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

const DietaryOptionsGrid: React.FC<DietaryOptionsGridProps> = ({ options, selectedValues, onToggle }) => {
  return (
    <Box mb={8}>
      <Heading size="md" color="gray.800" mb={4}>
        Choose one or more of the options below that apply to you
      </Heading>

      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
        gap={3}
        mb={4}
      >
        {options.map((opt) => (
          <ToggleButton
            key={opt.value}
            isActive={selectedValues.includes(opt.value)}
            onToggle={() => onToggle(opt.value)}
            label={opt.label}
            icon={opt.icon}
          />
        ))}
      </Box>

      {selectedValues.length > 0 && (
        <Box
          bg="accent.green.50"
          border="1px solid"
          borderColor="accent.green.200"
          borderRadius="md"
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          animation="fadeIn 0.3s ease-in"
          maxW="400px"
          mx="auto"
        >
          <Box
            bg="accent.green.300"
            color="white"
            borderRadius="full"
            width="24px"
            height="24px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
            fontWeight="bold"
          >
            {selectedValues.length}
          </Box>
          <Text color="accent.green.500" fontSize="sm" fontWeight="500">
            {selectedValues.length === 1 ? '1 selected' : `${selectedValues.length} selected`}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default DietaryOptionsGrid;
