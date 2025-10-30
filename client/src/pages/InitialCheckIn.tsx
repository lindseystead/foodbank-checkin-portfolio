/**
 * InitialCheckIn.tsx
 * ------------------
 * This is the first page in the check-in flow where clients enter their basic information.
 * It collects phone number and last name to identify the client.
 *
 * Main Features:
 * - Phone number input with automatic formatting
 * - Last name input for identification
 * - Form validation with error messages
 * - Progress step indicator (Step 1)
 * - Responsive, accessible Chakra UI layout
 * - Integration with hybrid client lookup service (API + CSV fallback)
 *
 * Author: Lindsey Stead
 * Date: 2025-08-25
 */

/**
 * @fileoverview Initial check-in page for Foodbank Check-In and Appointment System client application
 * 
 * This page handles the first step of the client check-in process,
 * collecting basic client information including phone number and
 * last name for appointment lookup and verification.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../SpecialRequests.tsx} Special requests page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { CheckInResponse } from '../common/types/CheckInResponse';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  Box,
  Stack,
} from '@chakra-ui/react';

import PageLayout from '../components/layout/PageLayout';
import ProgressSteps from '../components/layout/ProgressSteps';
import PageHeader from '../components/ui/PageHeader';
import PrimaryButton from '../components/buttons/PrimaryButton';
import AssistanceButton from '../components/buttons/AssistanceButton';

interface FormState {
  phone: string;
  lastName: string;
  errors: {
    phone: string;
    lastName: string;
  };
}



const InitialCheckIn: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    phone: '',
    lastName: '',
    errors: {
      phone: '',
      lastName: '',
    },
  });

  // Handles input changes and formatting for phone number
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');

      let formattedPhone = '';
      if (digitsOnly.length <= 3) {
        formattedPhone = digitsOnly;
      } else if (digitsOnly.length <= 6) {
        formattedPhone = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
      } else {
        formattedPhone = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
      }

      setFormState(prev => ({
        ...prev,
        [name]: formattedPhone,
        errors: {
          ...prev.errors,
          [name]: '',
        },
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: value,
        errors: {
          ...prev.errors,
          [name]: '',
        },
      }));
    }
  };

  // Validates both phone and last name fields
  // Phone must be exactly 10 digits after stripping formatting
  const validateForm = (): boolean => {
    const errors = {
      phone: '',
      lastName: '',
    };
    let isValid = true;

    if (!formState.phone.trim()) {
      errors.phone = t('checkIn.errors.phoneRequired');
      isValid = false;
    } else if (formState.phone.replace(/\D/g, '').length !== 10) {
      // Must be exactly 10 digits (North American format)
      errors.phone = t('checkIn.errors.phoneInvalid');
      isValid = false;
    }

    if (!formState.lastName.trim()) {
      errors.lastName = t('checkIn.errors.lastNameRequired');
      isValid = false;
    }

    setFormState(prev => ({
      ...prev,
      errors,
    }));

    return isValid;
  };

  // Handles form submission, validates and calls the check-in API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: t('checkIn.validationError'),
        description: t('checkIn.validationErrorDescription'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        variant: 'subtle',
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

    setIsSubmitting(true);

    try {
      // Call the hybrid check-in API
      const response = await api('/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formState.phone,
          lastName: formState.lastName,
        }),
      });

      const result: CheckInResponse = await response.json();

      if (result.success && result.data) {
        // Store check-in data for next steps
        // Using sessionStorage to persist across the multi-step flow
        const checkInData = {
          phone: formState.phone,
          lastName: formState.lastName,
          checkInTime: new Date().toISOString(),
          checkInId: result.data.checkInId,
          clientId: result.data.clientId,
          clientName: result.data.clientName,
          appointmentTime: result.data.appointmentTime,
          // Store additional data from CSV
          appointment: result.data.appointment,
          client: result.data.client
        };

        sessionStorage.setItem('checkInInfo', JSON.stringify(checkInData));

        // Show success message
        toast({
          title: 'Check-in Successful!',
          description: result.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
          variant: 'subtle',
          containerStyle: {
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            borderRadius: 'md',
            boxShadow: 'md',
          },
        });

        // Navigate to next step
        navigate('/special-requests');
      } else {
        // Handle error response
        const errorMessage = typeof result.error === 'string' ? result.error : result.error?.message || 'Check-in failed. Please try again.';
        
        toast({
          title: 'Appointment Not Found',
          description: errorMessage,
          status: 'error',
          duration: 8000,
          isClosable: true,
          position: 'bottom',
          variant: 'subtle',
          containerStyle: {
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            borderRadius: 'md',
            boxShadow: 'md',
          },
        });
      }
    } catch (error) {
      console.error('Check-in error:', error);
      
      toast({
        title: 'Appointment Not Found',
        description: 'There was an error finding your appointment. Please give us a call at (250) 763-7161 or wait in your car for a volunteer to assist you.',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'bottom',
        variant: 'subtle',
        containerStyle: {
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          borderRadius: 'md',
          boxShadow: 'md',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout showBackButton isScrollable={false}>
      {/* Progress Indicator */}
      <Box
        w="full"
        position="absolute"
        top={{ base: "60px", md: "0" }}
        left="0"
        right="0"
        bg="white"
        zIndex="1"
        pb={{ base: 1, md: 0.5 }}
        pt={0}
      >
        <ProgressSteps
          currentStep={1}
          totalSteps={4}
          labels={[
            'Initial Check-in',
            'Special Requests',
            'Appointment Details',
            'Confirmation'
          ]}
        />
      </Box>

      {/* Main Form Container */}
      <VStack 
        spacing={{ base: 2, md: 1 }} 
        width="full" 
        maxW={{ base: "100%", md: "1000px" }} 
        mx="auto" 
        mt={{ base: "120px", md: "80px" }}
        px={{ base: 1, md: 4 }}
        position="relative"
        zIndex="0"
        minH="auto"
        maxH="none"
        pb={{ base: 2, md: 2 }}
        overflowY={{ base: "auto", md: "hidden" }}
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
      >
        <Box
          w="full"
          maxW={{ base: "100%", md: "600px" }}
          mx="auto"
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          p={{ base: 3, md: 6 }}
          overflow="visible"
        >
          <PageHeader
            title={t('checkIn.title')}
            subTitle={t('checkIn.subtitle')}
            logoSize="sm"
            mb={2}
          />

          {/* Check-in Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={{ base: 4, md: 3 }} align="stretch" w="full">
              <FormControl isRequired isInvalid={!!formState.errors.phone}>
                <FormLabel mb={2} fontSize={{ base: "md", md: "md" }} fontWeight="medium">{t('checkIn.phoneLabel')}</FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 555-5555"
                  size="lg"
                  bg="white"
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                  borderRadius="lg"
                  fontSize={{ base: "md", md: "md" }}
                  height={{ base: "48px", md: "52px" }}
                  px={4}
                  maxLength={14}
                  aria-describedby="phone-error"
                />
                <FormErrorMessage id="phone-error" fontSize="sm" mt={1}>
                  {formState.errors.phone}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!formState.errors.lastName}>
                <FormLabel mb={2} fontSize={{ base: "md", md: "md" }} fontWeight="medium">{t('checkIn.lastNameLabel')}</FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  value={formState.lastName}
                  onChange={handleInputChange}
                  placeholder={t('checkIn.namePlaceholder', 'Last name')}
                  size="lg"
                  bg="white"
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                  borderRadius="lg"
                  fontSize={{ base: "md", md: "md" }}
                  height={{ base: "48px", md: "52px" }}
                  px={4}
                  aria-describedby="lastName-error"
                />
                <FormErrorMessage id="lastName-error" fontSize="sm" mt={1}>
                  {formState.errors.lastName}
                </FormErrorMessage>
              </FormControl>

              {/* Buttons Row */}
              <Stack
                spacing={{ base: 4, md: 3 }}
                direction={{ base: "column", md: "row" }}
                width="full"
                pt={{ base: 4, md: 2 }}
                justify="center"
                align="center"
                mt={{ base: 2, md: 1 }}
              >
                <AssistanceButton 
                  width={{ base: "100%", md: "320px" }}
                  height={{ base: "48px", md: "52px" }}
                  fontSize={{ base: "md", md: "md" }}
                />
                <PrimaryButton
                  type="submit"
                  isLoading={isSubmitting}
                  width={{ base: "100%", md: "320px" }}
                  height={{ base: "48px", md: "52px" }}
                  fontSize={{ base: "md", md: "md" }}
                  isDisabled={!formState.phone || !formState.lastName}
                >
                  {isSubmitting ? 'Checking In...' : t('common.continue')}
                </PrimaryButton>
              </Stack>
            </VStack>
          </form>
        </Box>
      </VStack>
    </PageLayout>
  );
};

export default InitialCheckIn;
