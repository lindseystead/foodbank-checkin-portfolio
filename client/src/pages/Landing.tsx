/**
 * @fileoverview Landing page for Foodbank Check-In and Appointment System client application
 * 
 * This is the main entry point for clients accessing the food bank check-in system.
 * It provides language selection, welcome information, and navigation to the check-in process.
 * 
 * Features:
 * - Language selection with persistent storage
 * - Welcome message and introduction
 * - Navigation to check-in flow
 * - Responsive, accessible Chakra UI layout
 * - Form validation for language selection
 * - Toast notifications for validation feedback
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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const { selectedLanguage, handleLanguageSelect } = useLanguageSelection();

  // Continue to check-in (make sure language is selected)
  const handleContinue = () => {
    if (!selectedLanguage) {
      toast({
        title: t('language.selectRequired'),
        status: 'warning',
        duration: 6000,
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

          <LanguageSelector
            onLanguageSelect={handleLanguageSelect}
            currentLanguage={selectedLanguage}
          />
        </Box>

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
            width={{ base: "100%", md: "240px" }}
            height={{ base: "48px", md: "48px" }}
            fontSize="md"
          >
            {t('common.continue')}
          </PrimaryButton>
        </Box>
      </VStack>
    </PageLayout>
  );
};

export default Landing;
