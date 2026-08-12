/**
 * @fileoverview Dashboard card — slim wrapper used by DashboardOverview.
 * No default minH. Single padding layer. Auto-height by content.
 *
 * @version 2.0.0
 */

import React from 'react';
import { Box, Text, BoxProps } from '@chakra-ui/react';

interface DashboardCardProps extends Omit<BoxProps, 'title'> {
  title?: string;
  children: React.ReactNode;
  showHeader?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  showHeader = false,
  ...boxProps
}) => (
  <Box
    bg="white"
    borderRadius="xl"
    border="1px solid"
    borderColor="gray.200"
    boxShadow="sm"
    display="flex"
    flexDirection="column"
    minW={0}
    overflow="hidden"
    {...boxProps}
  >
    {showHeader && title && (
      <Box
        px={{ base: 4, md: 5 }}
        pt={{ base: 4, md: 5 }}
        pb={2}
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <Text fontSize="sm" fontWeight="700" color="admin.primary">
          {title}
        </Text>
      </Box>
    )}
    <Box flex="1" minW={0} px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
      {children}
    </Box>
  </Box>
);

export default DashboardCard;
