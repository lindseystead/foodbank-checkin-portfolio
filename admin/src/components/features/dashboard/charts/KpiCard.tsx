/**
 * @fileoverview KPI card with inline sparkline and delta indicator.
 * Replaces the flat StatCard with a richer, more glanceable summary.
 */

import React from 'react';
import { Box, HStack, VStack, Text, GridItem } from '@chakra-ui/react';
import { ResponsiveContainer, AreaChart, Area, Bar, BarChart } from 'recharts';
import AnimatedNumber from './AnimatedNumber';

interface KpiCardProps {
  icon: string;
  label: string;
  value: number;
  subtitle: string;
  color: string;
  hasNoData: boolean;
  /** Per-bucket counts used to render the sparkline */
  spark: number[];
  /** Optional delta string e.g. "+12% vs avg" */
  delta?: string;
  /** "area" | "bar" — sparkline rendering style */
  sparkType?: 'area' | 'bar';
  /** Highlight when active (e.g., currently filtered) */
  active?: boolean;
  onClick?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  color,
  hasNoData,
  spark,
  delta,
  sparkType = 'area',
  active,
  onClick,
}) => {
  const sparkData = spark.map((v, i) => ({ i, v }));
  const gradientId = `spark-${label.replace(/\s+/g, '-')}`;
  const interactive = !!onClick;

  return (
    <GridItem minW="0" w="full" h="full">
      <Box
        as={interactive ? 'button' : 'div'}
        onClick={onClick}
        textAlign="left"
        bg={hasNoData ? 'gray.50' : 'white'}
        p={{ base: 3, sm: 4 }}
        borderRadius="xl"
        border="1px solid"
        borderColor={active ? color : hasNoData ? 'gray.200' : 'gray.200'}
        boxShadow={active ? `0 0 0 2px ${color}33` : 'sm'}
        transition="all 0.2s"
        h="100%"
        minH={{ base: '110px', sm: '128px' }}
        w="full"
        cursor={interactive ? 'pointer' : 'default'}
        _hover={
          interactive
            ? { borderColor: color, transform: 'translateY(-1px)', boxShadow: 'md' }
            : undefined
        }
        position="relative"
        overflow="hidden"
      >
        <VStack align="stretch" spacing={1} h="full">
          <HStack justify="space-between" align="start">
            <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="0.04em" noOfLines={1}>
              {icon} {label}
            </Text>
          </HStack>

          <HStack align="baseline" spacing={2}>
            <Text fontSize={{ base: '2xl', sm: '3xl' }} color={hasNoData ? 'gray.400' : color} fontWeight="bold" lineHeight="1">
              <AnimatedNumber value={value} />
            </Text>
            {delta && (
              <Text fontSize="xs" color={hasNoData ? 'gray.400' : color} fontWeight="600" opacity={0.85}>
                {delta}
              </Text>
            )}
          </HStack>

          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {hasNoData ? 'No data yet' : subtitle}
          </Text>

          {/* Sparkline */}
          <Box flex="1" minH="32px" mt={1} opacity={hasNoData ? 0.3 : 1}>
            <ResponsiveContainer width="100%" height="100%">
              {sparkType === 'bar' ? (
                <BarChart data={sparkData}>
                  <Bar dataKey="v" fill={color} radius={[2, 2, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#${gradientId})`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </Box>
        </VStack>
      </Box>
    </GridItem>
  );
};

export default KpiCard;
