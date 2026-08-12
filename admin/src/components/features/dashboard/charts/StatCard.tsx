/**
 * @fileoverview Reusable statistics card for the analytics dashboard.
 */

import React from 'react';
import { Box, VStack, Text, GridItem } from '@chakra-ui/react';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  subtitle: string;
  noDataText?: string;
  color: string;
  hasNoData: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  noDataText = 'No data',
  color,
  hasNoData,
}) => (
  <GridItem minW="0" w="full" h="full">
    <Box
      bg={hasNoData ? 'gray.50' : 'white'}
      p={{ base: 3, sm: 4, md: 5 }}
      borderRadius="lg"
      border="1px solid"
      borderColor={hasNoData ? 'gray.200' : color}
      boxShadow="sm"
      transition="all 0.2s"
      h="100%"
      minH={{ base: '100px', sm: '120px', md: '140px' }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      w="full"
      maxW="100%"
      overflow="hidden"
    >
      <VStack
        spacing={{ base: 1.5, sm: 2, md: 3 }}
        align="center"
        justify="center"
        h="full"
        w="full"
        maxW="100%"
      >
        <Text
          fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }}
          color={hasNoData ? 'gray.500' : color}
          fontWeight="600"
          textAlign="center"
          w="full"
          maxW="100%"
          noOfLines={2}
          px={1}
        >
          {icon} {label}
        </Text>
        <Text
          fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
          color={hasNoData ? 'gray.400' : color}
          fontWeight="bold"
          lineHeight="1"
          whiteSpace="nowrap"
        >
          {value}
        </Text>
        <Text
          fontSize={{ base: '2xs', sm: 'xs' }}
          color={hasNoData ? 'gray.400' : color}
          textAlign="center"
          w="full"
          maxW="100%"
          noOfLines={1}
          px={1}
        >
          {hasNoData ? noDataText : subtitle}
        </Text>
      </VStack>
    </Box>
  </GridItem>
);

export default StatCard;
