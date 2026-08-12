/**
 * @fileoverview Custom tooltip for the analytics bar chart.
 */

import React from 'react';
import { Box, VStack, HStack, Text } from '@chakra-ui/react';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number }>;
  label?: string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const completed = payload.find(p => p.dataKey === 'completed')?.value || 0;
  const pending = payload.find(p => p.dataKey === 'pending')?.value || 0;
  const noShow = payload.find(p => p.dataKey === 'noShow')?.value || 0;
  const total = completed + pending + noShow;

  return (
    <Box
      bg="white"
      p={5}
      borderRadius="xl"
      border="2px solid"
      borderColor="gray.200"
      boxShadow="2xl"
      minW={{ base: '200px', md: '280px' }}
      maxW="90vw"
    >
      <VStack spacing={4} align="start">
        <Box textAlign="center" w="full">
          <Text fontWeight="bold" fontSize="lg" color="brand.500" mb={1}>
            {label}
          </Text>
          <Text fontSize="sm" color="brand.500">
            Appointment Summary
          </Text>
        </Box>

        <HStack spacing={4} justify="center" w="full">
          <VStack align="center" spacing={2} minW="70px">
            <Box bg="cofb.green" borderRadius="full" p={2} boxShadow="md">
              <Text fontSize="lg" color="white" fontWeight="bold">
                {completed}
              </Text>
            </Box>
            <Text fontSize="xs" color="accent.green.500" fontWeight="600" textAlign="center">
              Completed
            </Text>
          </VStack>

          <VStack align="center" spacing={2} minW="70px">
            <Box bg="brand.500" borderRadius="full" p={2} boxShadow="md">
              <Text fontSize="lg" color="white" fontWeight="bold">
                {pending}
              </Text>
            </Box>
            <Text fontSize="xs" color="brand.500" fontWeight="600" textAlign="center">
              Pending
            </Text>
          </VStack>

          <VStack align="center" spacing={2} minW="70px">
            <Box bg="accent.coral.300" borderRadius="full" p={2} boxShadow="md">
              <Text fontSize="lg" color="white" fontWeight="bold">
                {noShow}
              </Text>
            </Box>
            <Text fontSize="xs" color="accent.coral.300" fontWeight="600" textAlign="center">
              No Show
            </Text>
          </VStack>
        </HStack>

        {total > 0 && (
          <Box
            w="full"
            bg="gray.50"
            borderRadius="lg"
            p={3}
            textAlign="center"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="sm" color="gray.700" fontWeight="medium">
              Total Appointments:{' '}
              <Text as="span" fontWeight="bold" color="brand.500">
                {total}
              </Text>
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ChartTooltip;
