/**
 * Landing.tsx
 * ----------
 * This is the main landing page for the Foodbank Check-In and Appointment System check-in application.
 * It serves as the entry point for clients and handles language selection.
 *
 * Main Features:
 * - Language selection with persistent storage
 * - Welcome message and introduction
 * - Navigation to check-in flow
 * - Responsive, accessible Chakra UI layout
 * - Form validation for language selection
 * - Responsive design for mobile and desktop views
 * - Toast notifications for validation feedback
 *
 * Layout Structure:
 * - Full-width container with responsive max-width
 * - Centered content with responsive spacing
 * - Language selector component
 * - Continue button with responsive sizing
 *
 * Author: Lindsey Stead
 * Date: 2025-08-25
 */

/**
 * @fileoverview Landing page for Foodbank Check-In and Appointment System client application
 * 
 * This is the main entry point for clients accessing the food bank
 * check-in system. It provides language selection, welcome information,
 * and navigation to the check-in process.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../InitialCheckIn.tsx} Initial check-in page
 */

import React from 'react';
import { VStack, useToast, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import LanguageSelector from '../components/ui/LanguageSelector';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { useLanguageSelection } from '../hooks/useLanguageSelection';

const Landing: React.FC = () => {
  // Initialize hooks for navigation, translation, and toast notifications
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  
  // Get language selection state and handler from custom hook
  const { selectedLanguage, handleLanguageSelect } = useLanguageSelection();

  /**
   * Handles the continue button click event
   * Validates language selection and navigates to initial check-in
   * Shows warning toast if no language is selected
   */
  const handleContinue = () => {
    if (!selectedLanguage) {
      toast({
        title: t('language.selectRequired'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        variant: 'subtle',
        description: t('language.selectRequiredDescription'),
        containerStyle: {
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          borderRadius: 'md',
          boxShadow: 'md',
        },
      });
      return;
    }
    
    toast.closeAll();
    navigate('/initial-check-in');
  };

  return (
    <PageLayout showBackButton={false} isScrollable={false}>
      {/* Main content container with responsive spacing and sizing */}
      <VStack 
        spacing={{ base: 4, md: 8 }} 
        width="full" 
        maxW={{ base: "100%", sm: "90%", md: "300px" }} 
        mx="auto"
        px={{ base: 4, sm: 6, md: 0 }}
        height={{ base: "100dvh", md: "auto" }}
        justifyContent={{ base: "center", md: "flex-start" }}
        mt={{ base: 8, md: 12 }}
        pt={0}
      >
        {/* Header and language selector container */}
        <Box 
          width="full"
          mb={{ base: 3, md: 4 }}
        >
          <PageHeader
            title={t('welcome')}
            welcomeMessage={t('welcomeMessage')}
            subTitle={t('welcomeSubtitle')}
            logoSize="lg"
            mb={3}
          />

          {/* Language selection component */}
          <LanguageSelector
            onLanguageSelect={handleLanguageSelect}
            currentLanguage={selectedLanguage}
          />
        </Box>

        {/* Continue button container with responsive positioning */}
        <Box 
          width="full" 
          display="flex"
          justifyContent="center"
          mt={{ base: 2, md: 4 }}
          mb={{ base: 3, md: 4 }}
          px={{ base: 4, md: 0 }}
          position={{ base: "relative", md: "relative" }}
          bottom={{ base: 0, md: "auto" }}
          bg={{ base: "white", md: "transparent" }}
          pt={0}
        >
          <PrimaryButton
            onClick={handleContinue}
            size="lg"
            width={{ base: "160px", sm: "180px", md: "240px" }}
            height={{ base: "48px", md: "48px" }}
            fontSize={{ base: "md", md: "md" }}
            px={{ base: 6, md: 6 }}
            maxW={{ base: "180px", md: "240px" }}
          >
            {t('common.continue')}
          </PrimaryButton>
        </Box>
      </VStack>
    </PageLayout>
  );
};

export default Landing;
