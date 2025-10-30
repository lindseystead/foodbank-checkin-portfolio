/**
 * @fileoverview Logo component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component displays the Food Bank logo with
 * consistent styling and responsive behavior. It provides the
 * main branding element for the admin panel interface.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../AdminLayout.tsx} Main layout component
 */

import React from 'react';
import { Image, Box } from '@chakra-ui/react';
import logo1 from '../../assets/logo1.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = false }) => {
  const sizes = {
    sm: { base: '60px', sm: '80px', md: '100px' },
    md: { base: '80px', sm: '100px', md: '120px' },
    lg: { base: '120px', sm: '140px', md: '160px' },
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Image
        src={logo1}
        alt="Foodbank Check-In and Appointment System Logo"
        w={sizes[size]}
        h="auto"
        objectFit="contain"
        transition="transform 0.2s"
        _hover={{
          transform: 'scale(1.05)',
        }}
      />
      {showText && (
        <Box textAlign="center" mt={2}>
          <Box
            fontSize="lg"
            fontWeight="600"
            color="brand.500"
          >
            Admin Panel
          </Box>
          <Box
            fontSize="sm"
            color="gray.600"
          >
            Foodbank Check-In and Appointment System
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Logo;
