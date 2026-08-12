/**
 * @fileoverview Compact status donut showing completed/pending/noShow split.
 * Click a segment to toggle the corresponding status filter on the main chart.
 */

import React from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { chartColors } from '../../../../config/designTokens';

export type StatusKey = 'completed' | 'pending' | 'noShow';

interface StatusDonutProps {
  completed: number;
  pending: number;
  noShow: number;
  activeFilters: Record<StatusKey, boolean>;
  onToggle: (key: StatusKey) => void;
}

/** Hex required by Recharts Cell fill; also valid for Chakra bg/color. */
const COLORS: Record<StatusKey, string> = {
  completed: chartColors.completed,
  pending: chartColors.pending,
  noShow: chartColors.noShow,
};

const LABELS: Record<StatusKey, string> = {
  completed: 'Completed',
  pending: 'Pending',
  noShow: 'No Show',
};

const StatusDonut: React.FC<StatusDonutProps> = ({
  completed,
  pending,
  noShow,
  activeFilters,
  onToggle,
}) => {
  const total = completed + pending + noShow;
  const data: Array<{ name: StatusKey; value: number }> = [
    { name: 'completed', value: completed },
    { name: 'pending', value: pending },
    { name: 'noShow', value: noShow },
  ];

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Box bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm" h="full">
      <VStack align="stretch" spacing={3} h="full">
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="700" color="admin.primary">
            Status Breakdown
          </Text>
          <Text fontSize="xs" color="gray.500">
            Click to filter
          </Text>
        </HStack>

        <Box position="relative" h="160px" w="full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name]}
                    fillOpacity={activeFilters[entry.name] ? 1 : 0.25}
                    style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s' }}
                    onClick={() => onToggle(entry.name)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <Box position="absolute" inset={0} display="flex" flexDirection="column" alignItems="center" justifyContent="center" pointerEvents="none">
            <Text fontSize="2xl" fontWeight="bold" color="admin.primary" lineHeight="1">
              {completionRate}%
            </Text>
            <Text fontSize="2xs" color="gray.500" textTransform="uppercase" letterSpacing="0.05em">
              Complete
            </Text>
          </Box>
        </Box>

        <VStack align="stretch" spacing={1.5}>
          {(Object.keys(COLORS) as StatusKey[]).map((key) => {
            const value = key === 'completed' ? completed : key === 'pending' ? pending : noShow;
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            const isActive = activeFilters[key];
            return (
              <HStack
                key={key}
                as="button"
                onClick={() => onToggle(key)}
                spacing={2}
                px={2}
                py={1}
                borderRadius="md"
                opacity={isActive ? 1 : 0.4}
                _hover={{ bg: 'gray.50' }}
                transition="opacity 0.15s"
                w="full"
              >
                <Box w="8px" h="8px" borderRadius="full" bg={COLORS[key]} flexShrink={0} />
                <Text fontSize="xs" color="gray.700" flex="1" textAlign="left">
                  {LABELS[key]}
                </Text>
                <Text fontSize="xs" fontWeight="600" color={COLORS[key]}>
                  {value}
                </Text>
                <Text fontSize="2xs" color="gray.400" w="32px" textAlign="right">
                  {pct}%
                </Text>
              </HStack>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
};

export default StatusDonut;
