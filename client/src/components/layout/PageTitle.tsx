/**
 * @fileoverview Page title component for Foodbank Check-In and Appointment System client application
 * 
 * This component provides consistent page titles with proper styling,
 * responsive design, and accessibility features for all client
 * pages in the food bank check-in system.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../PageLayout.tsx} Page layout component
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
      fontSize={{ base: "2xl", sm: "2xl", md: "3xl", lg: "3xl" }}
      color="#25385D"
      fontWeight="bold"
      letterSpacing="tight"
      lineHeight="shorter"
      fontFamily="'Inter', sans-serif"
      textAlign="center"
      mb={0}
      {...props}
    >
      {children}
    </Heading>
  );
};

export default PageTitle; 