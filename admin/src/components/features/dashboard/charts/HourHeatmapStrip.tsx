/**
 * @fileoverview Hour-density heatmap strip.
 * One cell per hour, colored by total appointment volume.
 */

import React from 'react';
import { Box, HStack, VStack, Text, Tooltip } from '@chakra-ui/react';
import { palette } from '../../../../config/designTokens';

interface HourHeatmapStripProps {
  /** Hourly totals for the configured operating window. */
  hourTotals: Array<{ hour: number; total: number; completed: number }>;
  currentHour: number;
}

const formatHour = (h: number): string => {
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${h12}${ampm}`;
};

const HourHeatmapStrip: React.FC<HourHeatmapStripProps> = ({ hourTotals, currentHour }) => {
  const max = Math.max(1, ...hourTotals.map((h) => h.total));

  return (
    <Box bg="white" px={4} py={3} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em">
            Daily intensity
          </Text>
          <Text fontSize="xs" color="gray.400">
            Hours with more appointments are darker
          </Text>
        </HStack>
        <HStack spacing={1} w="full">
          {hourTotals.map(({ hour, total, completed }) => {
            const intensity = total === 0 ? 0 : 0.15 + (total / max) * 0.85;
            const isNow = hour === currentHour;
            return (
              <Tooltip
                key={hour}
                label={`${formatHour(hour)} · ${total} appt${total === 1 ? '' : 's'} · ${completed} completed`}
                hasArrow
                placement="top"
                fontSize="xs"
              >
                <Box
                  flex="1"
                  h="32px"
                  borderRadius="md"
                  bg={total === 0 ? 'gray.100' : `rgba(${palette.brandRgb}, ${intensity})`}
                  border={isNow ? '2px solid' : '1px solid'}
                  borderColor={isNow ? 'accent.coral.300' : 'transparent'}
                  position="relative"
                  cursor="pointer"
                  transition="transform 0.15s"
                  _hover={{ transform: 'translateY(-2px)' }}
                >
                  {isNow && (
                    <Box
                      position="absolute"
                      top="-6px"
                      left="50%"
                      transform="translateX(-50%)"
                      w="4px"
                      h="4px"
                      borderRadius="full"
                      bg="accent.coral.300"
                      boxShadow={`0 0 0 3px rgba(${palette.coralRgb}, 0.25)`}
                    />
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </HStack>
        <HStack spacing={1} w="full">
          {hourTotals.map(({ hour }) => (
            <Box key={hour} flex="1" textAlign="center">
              <Text fontSize="2xs" color={hour === currentHour ? 'accent.coral.300' : 'gray.400'} fontWeight={hour === currentHour ? 700 : 500}>
                {formatHour(hour)}
              </Text>
            </Box>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};

export default HourHeatmapStrip;
