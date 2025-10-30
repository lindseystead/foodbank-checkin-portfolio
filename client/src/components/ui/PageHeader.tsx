/**
 * @fileoverview Page header component for Foodbank Check-In and Appointment System client application
 * 
 * This component provides consistent page headers with logo, title,
 * and navigation elements. It ensures consistent branding and
 * layout across all client pages.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../layout/PageLayout.tsx} Page layout component
 */

import React from 'react';
import { VStack, Box } from '@chakra-ui/react';
import Logo from './Logo';
import BodyText from './BodyText';
import PageTitle from '../layout/PageTitle';

interface PageHeaderProps {
  title: string;
  subTitle?: string;
  welcomeMessage?: string;
  showLogo?: boolean;
  logoSize?: 'sm' | 'md' | 'lg';
  mb?: number;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subTitle,
  welcomeMessage,
  showLogo = true,
  logoSize = 'md',
  mb = 4
}) => {
  return (
    <VStack 
      spacing={{ base: 2, md: 3 }} 
      align="center" 
      mb={mb}
      px={{ base: 2, md: 0 }}
      pt={{ base: 2, md: 3 }}
      w="full"
    >
      {showLogo && (
        <Box 
          w="full" 
          mb={{ base: 2, md: 3 }}
          position="relative"
        >
          <Logo size={logoSize} />
        </Box>
      )}
      <VStack 
        spacing={2} 
        mb={{ base: 2, md: 3 }}
        w="full"
        maxW="container.sm"
      >
        <PageTitle>{title}</PageTitle>
        {welcomeMessage && (
          <BodyText 
            color="gray.700"
            mt={{ base: 1, md: 2 }}
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="medium"
            lineHeight="tall"
            letterSpacing="wide"
            opacity={0.9}
            px={{ base: 2, md: 0 }}
            textAlign="center"
          >
            {welcomeMessage}
          </BodyText>
        )}
        {subTitle && (
          <BodyText 
            color="gray.600"
            mt={{ base: 2, md: 3 }}
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="normal"
            lineHeight="tall"
            letterSpacing="wide"
            opacity={0.9}
            maxW="container.sm"
            textAlign="center"
            px={{ base: 2, md: 0 }}
          >
            {subTitle}
          </BodyText>
        )}
      </VStack>
    </VStack>
  );
};

export default PageHeader; 