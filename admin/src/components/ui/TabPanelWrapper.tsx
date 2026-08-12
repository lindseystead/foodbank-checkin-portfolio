/**
 * @fileoverview Reusable tab panel wrapper component
 * 
 * Standardized wrapper for tab panel content with consistent padding,
 * scrolling behavior, and scrollbar styling.
 * 
 * @version 1.0.0
 * @since 2025-01-20
 */

import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface TabPanelWrapperProps extends BoxProps {
  children: React.ReactNode;
}

/**
 * Standardized tab panel wrapper
 * 
 * Features:
 * - Consistent padding across all tab panels
 * - Custom scrollbar styling
 * - Proper overflow handling
 * - Responsive spacing
 */
const TabPanelWrapper: React.FC<TabPanelWrapperProps> = ({
  children,
  ...boxProps
}) => {
  return (
    <Box
      flex="1"
      minH="0"
      overflowY="visible"
      overflowX="hidden"
      px={{ base: 3, sm: 4, md: 5 }}
      py={{ base: 3, sm: 4, md: 5 }}
      css={{
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '3px',
        },
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

export default TabPanelWrapper;

