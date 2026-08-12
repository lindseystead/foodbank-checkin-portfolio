/**
 * @fileoverview Progress steps — horizontal stepper with explicit segment lines between columns.
 */

import React from 'react';
import {
  Box,
  HStack,
  Text,
  Circle,
  VStack,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface StepColumnProps {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  stepNumber: number;
}

const StepColumn: React.FC<StepColumnProps> = ({
  label,
  isActive,
  isCompleted,
  stepNumber,
}) => {
  const checkIconSize = useBreakpointValue({ base: 15, md: 17 }) ?? 15;
  /** Fewer lines on narrow screens keeps labels from towering past the connector row */
  const labelLineClamp = useBreakpointValue({ base: 2, md: 3 }) ?? 2;
  const activeColor = useColorModeValue('brand.500', 'brand.300');
  const completedColor = useColorModeValue('accent.green.300', 'accent.green.300');
  const inactiveColor = useColorModeValue('gray.300', 'gray.600');
  const textColor = useColorModeValue('brand.500', 'brand.300');
  const activeTextColor = useColorModeValue('brand.500', 'brand.300');
  const completedTextColor = useColorModeValue('brand.500', 'brand.300');
  const circleBg = isActive ? activeColor : isCompleted ? completedColor : 'white';
  const circleColor = isActive || isCompleted ? 'white' : textColor;

  return (
    <Box
      role="listitem"
      position="relative"
      flex="1 1 0%"
      minW={{ base: '44px', md: '64px' }}
      maxW={{ md: 'none' }}
      px={{ base: 0.5, md: 0 }}
    >
      <VStack spacing={{ base: 1, md: 2 }} position="relative" align="center">
        <Circle
          size={{ base: '28px', md: '32px' }}
          minW={{ base: '28px', md: '32px' }}
          minH={{ base: '28px', md: '32px' }}
          bg={circleBg}
          color={circleColor}
          border="2px solid"
          borderColor={
            isActive ? activeColor : isCompleted ? completedColor : inactiveColor
          }
          zIndex={1}
          fontSize={{ base: 'xs', md: 'sm' }}
          fontWeight="semibold"
          flexShrink={0}
        >
          {isCompleted ? (
            <FiCheck size={checkIconSize} strokeWidth={2.5} />
          ) : (
            stepNumber
          )}
        </Circle>
        <Text
          color={
            isActive ? activeTextColor : isCompleted ? completedTextColor : textColor
          }
          fontWeight={isActive ? 'semibold' : 'medium'}
          textAlign="center"
          lineHeight={{ base: '1.2', md: 'short' }}
          wordBreak="break-word"
          whiteSpace="normal"
          noOfLines={labelLineClamp}
          maxW="100%"
          w="full"
          sx={{
            hyphens: 'auto',
            WebkitHyphens: 'auto',
            // Smaller on phones so columns stay visually balanced with segment lines; ramp up at sm+.
            fontSize: {
              base: '0.6875rem !important',
              sm: '0.75rem !important',
              md: '0.875rem !important',
            },
            letterSpacing: { base: '-0.01em', md: 'normal' },
          }}
        >
          {label}
        </Text>
      </VStack>
    </Box>
  );
};

interface StepSegmentProps {
  segmentIndex: number;
  currentStep: number;
}

/** Horizontal track between step columns — shares flex growth so lines align with circle centers. */
const StepSegment: React.FC<StepSegmentProps> = ({ segmentIndex, currentStep }) => {
  const activeColor = useColorModeValue('brand.500', 'brand.300');
  const completedColor = useColorModeValue('accent.green.300', 'accent.green.300');
  const inactiveColor = useColorModeValue('gray.300', 'gray.600');
  const mt = useBreakpointValue({ base: '13px', md: '15px' }) ?? '13px';

  const s = segmentIndex;
  const isCompleted = s < currentStep - 1;
  const isActive = s === currentStep - 1;
  const bg = isActive ? activeColor : isCompleted ? completedColor : inactiveColor;

  return (
    <Box
      role="presentation"
      aria-hidden
      flex="1 1 0%"
      minW={{ base: '4px', md: '6px' }}
      h="2px"
      bg={bg}
      mt={mt}
      alignSelf="flex-start"
      flexShrink={1}
    />
  );
};

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, totalSteps }) => {
  const { t } = useTranslation();

  const translatedLabels = [
    t('navigation.progressSteps.initialCheckIn'),
    t('navigation.progressSteps.specialRequests'),
    t('navigation.progressSteps.appointmentDetails'),
    t('navigation.progressSteps.confirmation'),
  ];

  const steps = translatedLabels.slice(0, totalSteps);

  return (
    <Box
      w="full"
      py={{ base: 3, md: 4 }}
      px={{ base: 3, md: 4 }}
      pb={{ base: 'max(0.75rem, env(safe-area-inset-bottom, 0px))', md: 4 }}
      bg="white"
      borderBottomWidth="1px"
      borderBottomColor="gray.100"
      position="relative"
    >
      <HStack
        spacing={0}
        align="flex-start"
        justify="space-between"
        position="relative"
        w="full"
        maxW="container.lg"
        mx="auto"
        wrap="nowrap"
        overflowX={{ base: 'auto', md: 'visible' }}
        overflowY="hidden"
        role="list"
        sx={{
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.18)',
            borderRadius: '4px',
          },
        }}
      >
        {steps.flatMap((label, index) => {
          const nodes = [
            <StepColumn
              key={`step-${index}`}
              label={label}
              isActive={index === currentStep - 1}
              isCompleted={index < currentStep - 1}
              stepNumber={index + 1}
            />,
          ];
          if (index < steps.length - 1) {
            nodes.push(
              <StepSegment
                key={`seg-${index}`}
                segmentIndex={index}
                currentStep={currentStep}
              />,
            );
          }
          return nodes;
        })}
      </HStack>
    </Box>
  );
};

export default ProgressSteps;
