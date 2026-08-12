/**
 * @fileoverview Compact toolbar for the analytics dashboard:
 * bucket-size toggle, chart-type toggle, and CSV export.
 */

import React from 'react';
import { Box, ButtonGroup, Button, HStack, Tooltip, IconButton, Text } from '@chakra-ui/react';
import { FiBarChart2, FiTrendingUp, FiActivity, FiDownload } from 'react-icons/fi';

export type BucketSize = 15 | 30 | 60;
export type ChartStyle = 'bar' | 'area' | 'line';

interface AnalyticsToolbarProps {
  bucketSize: BucketSize;
  chartStyle: ChartStyle;
  onBucketChange: (b: BucketSize) => void;
  onStyleChange: (s: ChartStyle) => void;
  onExport: () => void;
  disabled?: boolean;
}

const bucketLabel: Record<BucketSize, string> = { 15: '15m', 30: '30m', 60: '1h' };

const AnalyticsToolbar: React.FC<AnalyticsToolbarProps> = ({
  bucketSize,
  chartStyle,
  onBucketChange,
  onStyleChange,
  onExport,
  disabled,
}) => {
  return (
    <HStack
      spacing={{ base: 2, sm: 3 }}
      justify="space-between"
      align="center"
      flexWrap="wrap"
      bg="white"
      px={{ base: 3, sm: 4 }}
      py={2}
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      w="full"
    >
      <HStack spacing={3} flexWrap="wrap">
        <Box>
          <Text fontSize="2xs" color="gray.500" textTransform="uppercase" letterSpacing="0.05em" mb={1}>
            Interval
          </Text>
          <ButtonGroup size="xs" isAttached variant="outline">
            {([15, 30, 60] as BucketSize[]).map((b) => (
              <Button
                key={b}
                onClick={() => onBucketChange(b)}
                bg={bucketSize === b ? 'admin.primary' : 'white'}
                color={bucketSize === b ? 'white' : 'gray.700'}
                borderColor="gray.300"
                _hover={{ bg: bucketSize === b ? 'admin.primary' : 'gray.50' }}
                fontWeight="600"
                isDisabled={disabled}
              >
                {bucketLabel[b]}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <Box>
          <Text fontSize="2xs" color="gray.500" textTransform="uppercase" letterSpacing="0.05em" mb={1}>
            View
          </Text>
          <ButtonGroup size="xs" isAttached variant="outline">
            <Tooltip label="Stacked bars" hasArrow>
              <IconButton
                aria-label="Stacked bars"
                icon={<FiBarChart2 />}
                onClick={() => onStyleChange('bar')}
                bg={chartStyle === 'bar' ? 'admin.primary' : 'white'}
                color={chartStyle === 'bar' ? 'white' : 'gray.700'}
                borderColor="gray.300"
                _hover={{ bg: chartStyle === 'bar' ? 'admin.primary' : 'gray.50' }}
                isDisabled={disabled}
              />
            </Tooltip>
            <Tooltip label="Stacked area" hasArrow>
              <IconButton
                aria-label="Stacked area"
                icon={<FiActivity />}
                onClick={() => onStyleChange('area')}
                bg={chartStyle === 'area' ? 'admin.primary' : 'white'}
                color={chartStyle === 'area' ? 'white' : 'gray.700'}
                borderColor="gray.300"
                _hover={{ bg: chartStyle === 'area' ? 'admin.primary' : 'gray.50' }}
                isDisabled={disabled}
              />
            </Tooltip>
            <Tooltip label="Line trend" hasArrow>
              <IconButton
                aria-label="Line trend"
                icon={<FiTrendingUp />}
                onClick={() => onStyleChange('line')}
                bg={chartStyle === 'line' ? 'admin.primary' : 'white'}
                color={chartStyle === 'line' ? 'white' : 'gray.700'}
                borderColor="gray.300"
                _hover={{ bg: chartStyle === 'line' ? 'admin.primary' : 'gray.50' }}
                isDisabled={disabled}
              />
            </Tooltip>
          </ButtonGroup>
        </Box>
      </HStack>

      <HStack spacing={2}>
        <Tooltip label="Export current view as CSV" hasArrow>
          <Button
            size="xs"
            variant="outline"
            leftIcon={<FiDownload />}
            onClick={onExport}
            isDisabled={disabled}
            borderColor="gray.300"
            color="gray.700"
            _hover={{ bg: 'gray.50', borderColor: 'admin.primary', color: 'admin.primary' }}
          >
            Export
          </Button>
        </Tooltip>
      </HStack>
    </HStack>
  );
};

export default AnalyticsToolbar;
