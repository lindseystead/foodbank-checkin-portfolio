/**
 * @fileoverview Page title — uses theme heading font/color tokens.
 */

import React from 'react';
import { Heading, HeadingProps } from '@chakra-ui/react';

interface PageTitleProps extends HeadingProps {
  children: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ children, ...props }) => {
  return (
    <Heading
      as="h1"
      size="lg"
      fontSize={{ base: '2xl', md: '3xl' }}
      color="client.primary"
      fontWeight="bold"
      letterSpacing="tight"
      lineHeight="shorter"
      textAlign="center"
      mb={0}
      {...props}
    >
      {children}
    </Heading>
  );
};

export default PageTitle;
