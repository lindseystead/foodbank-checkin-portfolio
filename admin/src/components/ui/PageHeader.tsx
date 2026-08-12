/**
 * @fileoverview Reusable page header component
 * 
 * Standardizes title + description layout for admin pages.
 */

import React from 'react';
import { Box, Heading, Text, VStack, TextProps } from '@chakra-ui/react';

interface PageHeaderProps {
  title: string;
  description?: string;
  textAlign?: TextProps['textAlign'];
  maxW?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  textAlign = { base: 'left', sm: 'center' },
  maxW = '600px',
}) => {
  return (
    <Box textAlign={textAlign} w="full" maxW="100%" minW="0">
      <VStack spacing={{ base: 2, sm: 3 }} align="stretch">
        <Heading
          size={{ base: 'lg', sm: 'xl' }}
          color="admin.primary"
          fontWeight="700"
          lineHeight="1.2"
        >
          {title}
        </Heading>
        {description && (
          <Text
            color="gray.600"
            fontSize={{ base: 'sm', sm: 'md', md: 'lg' }}
            maxW={maxW}
            mx={textAlign === 'center' ? 'auto' : { base: 0, sm: 'auto' }}
            fontWeight="400"
            lineHeight="1.6"
          >
            {description}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default PageHeader;
