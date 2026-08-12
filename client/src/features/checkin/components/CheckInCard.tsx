/**
 * @fileoverview Shared card container for check-in flow pages.
 */

import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface CheckInCardProps extends BoxProps {}

const CheckInCard: React.FC<CheckInCardProps> = ({ children, ...props }) => {
  return (
    <Box
      w="full"
      mx="auto"
      bg="white"
      borderRadius="xl"
      boxShadow="sm"
      p={{ base: 4, md: 6 }}
      overflow="visible"
      {...props}
    >
      {children}
    </Box>
  );
};

export default CheckInCard;
