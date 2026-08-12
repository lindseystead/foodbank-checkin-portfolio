/**
 * @fileoverview Mobility assistance section for special requests.
 */

import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import ToggleButton from './ToggleButton';

interface MobilityAssistanceSectionProps {
  hasMobilityIssues: boolean;
  onToggleYes: () => void;
  onToggleNo: () => void;
}

const MobilityAssistanceSection: React.FC<MobilityAssistanceSectionProps> = ({
  hasMobilityIssues,
  onToggleYes,
  onToggleNo,
}) => {
  return (
    <Box mb={8}>
      <Heading size="md" color="gray.800" mb={4}>
        Would you like a volunteer to help pack your food into your car?
      </Heading>

      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
        gap={3}
        mb={4}
      >
        <ToggleButton isActive={hasMobilityIssues} onToggle={onToggleYes} label="Yes, I'd like volunteer help" />
        <ToggleButton isActive={!hasMobilityIssues} onToggle={onToggleNo} label="No, I'm all set" />
      </Box>

      {hasMobilityIssues && (
        <Box
          bg="brand.50"
          border="1px solid"
          borderColor="brand.200"
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
            bg="client.primary"
            color="white"
            borderRadius="full"
            width="24px"
            height="24px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
          >
            ✓
          </Box>
          <Text color="client.primary" fontSize="sm" fontWeight="500">
            Volunteer help requested
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default MobilityAssistanceSection;
