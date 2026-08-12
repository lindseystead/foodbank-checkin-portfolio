/**
 * @fileoverview Shared page container for check-in flow pages.
 */

import React from 'react';
import { VStack, StackProps } from '@chakra-ui/react';

type CheckInPageContainerProps = React.PropsWithChildren<StackProps>;

const CheckInPageContainer: React.FC<CheckInPageContainerProps> = ({ children, ...props }) => {
  return (
    <VStack
      spacing={{ base: 4, md: 6 }}
      width="full"
      maxW={{ base: '100%', md: '1000px' }}
      mx="auto"
      pt={{ base: 4, md: 6 }}
      px={{ base: 4, md: 6 }}
      position="relative"
      zIndex="0"
      minH="auto"
      maxH="none"
      pb={{ base: 4, md: 6 }}
      overflowY={{ base: 'auto', md: 'hidden' }}
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '24px',
        },
      }}
      {...props}
    >
      {children}
    </VStack>
  );
};

export default CheckInPageContainer;
