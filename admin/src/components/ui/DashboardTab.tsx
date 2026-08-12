/**
 * @fileoverview Reusable dashboard tab component
 * 
 * Standardized tab component with consistent styling and hover effects.
 * 
 * @version 1.0.0
 * @since 2025-01-20
 */

import React from 'react';
import { Tab, TabProps } from '@chakra-ui/react';

interface DashboardTabProps extends TabProps {
  children: React.ReactNode;
}

/**
 * Standardized dashboard tab component
 * 
 * Features:
 * - Consistent styling across all tabs
 * - Responsive font sizes
 * - Hover and selected states
 * - Proper z-index handling
 */
const DashboardTab: React.FC<DashboardTabProps> = ({
  children,
  ...tabProps
}) => {
  return (
    <Tab
      whiteSpace="nowrap"
      fontSize={{ base: "xs", sm: "sm" }}
      px={{ base: 3, sm: 4 }}
      py={{ base: 2.5, sm: 3 }}
      minW="fit-content"
      flexShrink={0}
      borderRadius="md md 0 0"
      transition="all 0.2s ease"
      position="relative"
      _hover={{
        bg: 'blue.50',
        color: 'blue.600',
        zIndex: 1,
      }}
      _selected={{
        bg: 'white',
        color: 'blue.600',
        fontWeight: '600',
        zIndex: 2,
      }}
      {...tabProps}
    >
      {children}
    </Tab>
  );
};

export default DashboardTab;

