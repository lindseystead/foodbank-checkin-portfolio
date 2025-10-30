/**
 * ProgressSteps.tsx
 * ----------------
 * A reusable progress indicator component that displays the current step in a multi-step process.
 * Used throughout the application to show progress in the check-in flow.
 *
 * Main Features:
 * - Visual step indicators with numbers and checkmarks
 * - Progress line connecting steps
 * - Responsive design for mobile and desktop
 * - Color mode support (light/dark)
 * - Customizable labels and step count
 * - Active, completed, and pending states
 *
 * Components:
 * 1. Step:
 *    - Individual step indicator
 *    - Circle with number or checkmark
 *    - Step label
 *    - Progress line connector
 *
 * 2. ProgressSteps:
 *    - Container for all steps
 *    - Manages step state and layout
 *    - Handles responsive spacing
 *
 * Props:
 * - currentStep: Current active step number
 * - totalSteps: Total number of steps
 * - labels: Array of step labels
 *
 * Author: Lindsey Stead
 * Date: 2025-08-25
 */



/**
 * @fileoverview Progress steps component for Foodbank Check-In and Appointment System client application
 * 
 * This component displays the current step in the check-in process
 * with visual progress indicators and step labels. It provides
 * clear navigation context for users throughout the flow.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../PageLayout.tsx} Page layout component
 */

import React from 'react';
import { Box, HStack, Text, Circle, VStack, useColorModeValue } from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface StepProps {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  stepNumber: number;
}

const Step: React.FC<StepProps> = ({ label, isActive, isCompleted, stepNumber }) => {
  const activeColor = useColorModeValue('brand.500', 'brand.300');
  const completedColor = useColorModeValue('accent.green.300', 'accent.green.300');
  const inactiveColor = useColorModeValue('gray.300', 'gray.600');
  const textColor = useColorModeValue('brand.500', 'brand.300');
  const activeTextColor = useColorModeValue('brand.500', 'brand.300');
  const completedTextColor = useColorModeValue('brand.500', 'brand.300');
  const circleBg = isActive ? activeColor : isCompleted ? completedColor : 'white';
  const circleColor = isActive || isCompleted ? 'white' : textColor;

  return (
    <Box position="relative" flex="1" minW={{ base: "50px", md: "80px" }} maxW={{ base: "80px", md: "none" }}>
      <Box
        w={{ base: "80%", md: "full" }}
        h="2px"
        bg={isActive ? activeColor : isCompleted ? completedColor : inactiveColor}
        position="absolute"
        top="14px"
        left={{ base: "10%", md: "0" }}
        zIndex={0}
      />
      <VStack spacing={{ base: 0.5, md: 2 }} position="relative" align="center">
        <Circle
          size={{ base: "24px", md: "32px" }}
          bg={circleBg}
          color={circleColor}
          border="2px solid"
          borderColor={isActive ? activeColor : isCompleted ? completedColor : inactiveColor}
          zIndex={1}
        >
          {isCompleted ? <FiCheck size={12} /> : stepNumber}
        </Circle>
        <Text
          color={isActive ? activeTextColor : isCompleted ? completedTextColor : textColor}
          fontSize={{ base: '2xs', md: 'sm' }}
          fontWeight={isActive ? 'medium' : 'normal'}
          textAlign="center"
          lineHeight="tight"
          wordBreak="break-word"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxW="100%"
        >
          {label}
        </Text>
      </VStack>
    </Box>
  );
};

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  totalSteps
}) => {
  const { t } = useTranslation();
  
  const translatedLabels = [
    t('navigation.progressSteps.initialCheckIn'),
    t('navigation.progressSteps.specialRequests'),
    t('navigation.progressSteps.appointmentDetails'),
    t('navigation.progressSteps.confirmation')
  ];

  return (
    <Box w="full" py={{ base: 2, md: 4 }} px={{ base: 1, md: 4 }} bg="white" borderBottomWidth="1px" borderBottomColor="gray.100" position="relative" zIndex={10}>
      <HStack
        spacing={{ base: 0.5, md: 4 }}
        justify="space-between"
        position="relative"
        maxW="container.lg"
        mx="auto"
        wrap="nowrap"
        overflowX="auto"
        css={{
          '&::-webkit-scrollbar': {
            height: '2px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '2px',
          },
        }}
      >
        {translatedLabels.slice(0, totalSteps).map((label, index) => (
          <Step
            key={index}
            label={label}
            isActive={index === currentStep - 1}
            isCompleted={index < currentStep - 1}
            stepNumber={index + 1}
          />
        ))}
      </HStack>
    </Box>
  );
};

export default ProgressSteps; 