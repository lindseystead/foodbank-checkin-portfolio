/**
 * @fileoverview Logo component for Foodbank Check-In and Appointment System client application
 * 
 * This component displays the Foodbank Check-In and Appointment System logo with
 * consistent styling and responsive behavior. It provides the
 * main branding element for the client application interface.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../layout/PageLayout.tsx} Page layout component
 */

import React from 'react';
import { Image, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import logo1 from '../../assets/logo1.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const { t } = useTranslation();

  const sizes = {
    sm: { base: '100px', sm: '120px', md: '140px' },
    md: { base: '120px', sm: '140px', md: '160px' },
    lg: { base: '140px', sm: '160px', md: '180px' },
  };

  return (
    <Box
      w="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={{ base: 2, sm: 4 }}
    >
        <Image
          src={logo1}
        alt={t('branding.logoAlt')}
        w={sizes[size]}
        h="auto"
        objectFit="contain"
        transition="transform 0.2s"
        _hover={{
          transform: 'scale(1.05)',
        }}
      />
    </Box>
  );
};

export default Logo; 