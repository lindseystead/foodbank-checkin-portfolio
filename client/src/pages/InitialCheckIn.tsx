/**
 * @fileoverview Initial check-in page for Foodbank Check-In and Appointment System client application
 * 
 * This page handles the first step of the client check-in process, collecting
 * basic client information including phone number and last name for appointment
 * lookup and verification.
 * 
 * Features:
 * - Phone number input with automatic formatting
 * - Last name input for identification
 * - Form validation with error messages
 * - Progress step indicator (Step 1)
 * - Responsive, accessible Chakra UI layout
 * - Integration with client lookup service
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

  // Format phone number as user types
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

  // Check if phone and last name are valid
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
      // Need exactly 10 digits
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

  // Submit form and check in client
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: t('checkIn.validationError'),
        description: t('checkIn.validationErrorDescription'),
        status: 'warning',
        duration: 6000,
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
      // Check in the client
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

      // IMPORTANT: Parse response body regardless of status code
      // Backend returns 400 for validation errors (too early/late) with error message in body
      let result: CheckInResponse;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      // Check if request was successful
      // Backend returns 400 status for validation errors (too early/late)
      // So we need to check both response.ok AND result.success
      if (!response.ok || !result.success || !result.data) {
        // Handle error response (400 status or success: false)
        // This includes: appointment not found, too early, too late, etc.
        let errorMessage = typeof result.error === 'string' 
          ? result.error 
          : result.error?.message || 'We could not find an appointment matching your information.';
        
        // Remove phone numbers from error messages (generic error messages only)
        errorMessage = errorMessage.replace(/\(?\d{3}\)?\s*-?\s*\d{3}\s*-?\s*\d{4}/g, '');
        errorMessage = errorMessage.replace(/call.*\d{3}.*\d{3}.*\d{4}/gi, 'contact us');
        errorMessage = errorMessage.replace(/Please call.*?\./gi, 'Please use the "Need Help?" button for assistance.');
        
        // Check if this is a time window validation error (too early or too late)
        // Backend returns these errors with specific messages like:
        // "Your appointment is at [time]. Please check in no more than 30 minutes before your appointment time."
        const isTimeWindowError = errorMessage.includes('30 minutes') || 
                                  errorMessage.includes('too early') || 
                                  errorMessage.includes('too late') ||
                                  errorMessage.includes('appointment is at') ||
                                  errorMessage.includes('Please check in no more than');
        
        toast({
          title: isTimeWindowError ? 'Cannot Check In Yet' : 'Appointment Not Found',
          description: `${errorMessage}${isTimeWindowError ? '' : ' Please verify your information and try again, or use the "Need Help?" button for assistance.'}`,
          status: isTimeWindowError ? 'warning' : 'error',
          duration: 10000,
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

      // Success - proceed with check-in
      if (result.data) {
        // Save check-in data for next steps
        // IMPORTANT: Include next appointment data from backend response
        // This ensures the auto-generated appointment is available immediately
        const checkInData = {
          phone: formState.phone,
          lastName: formState.lastName,
          checkInTime: new Date().toISOString(),
          checkInId: result.data.checkInId,
          clientId: result.data.clientId,
          clientName: result.data.clientName,
          appointmentTime: result.data.appointmentTime,
          // IMPORTANT: Include pickUpTime and pickUpDate for reliable time display
          // This avoids timezone conversion issues when parsing ISO strings
          pickUpTime: result.data.pickUpTime,
          pickUpDate: result.data.pickUpDate,
          // Include auto-generated next appointment data (available immediately)
          nextAppointmentDate: result.data.nextAppointmentDate,
          nextAppointmentTime: result.data.nextAppointmentTime,
          nextAppointmentISO: result.data.nextAppointmentISO,
          ticketNumber: result.data.ticketNumber,
          isAutoGenerated: result.data.isAutoGenerated,
          // Include CSV data if available
          appointment: result.data.appointment,
          client: result.data.client
        };

        sessionStorage.setItem('checkInInfo', JSON.stringify(checkInData));

        // Success!
        toast({
          title: 'Appointment Found',
          description: 'Your appointment has been verified. Please continue to the next step.',
          status: 'success',
          duration: 4000,
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

        // Go to next step
        navigate('/special-requests');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the system. Please check your internet connection and try again, or use the "Need Help?" button for assistance.',
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
        top={{ base: "50px", md: "0" }}
        left="0"
        right="0"
        bg="white"
        zIndex="1"
        pb={1}
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
        spacing={{ base: 4, md: 6 }} 
        width="full" 
        maxW={{ base: "100%", md: "1000px" }} 
        mx="auto" 
        pt={{ base: "100px", md: "70px" }}
        px={{ base: 4, md: 6 }}
        position="relative"
        zIndex="0"
        minH="auto"
        maxH="none"
        pb={{ base: 4, md: 6 }}
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
            mb={4}
          />

          {/* Check-in Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={{ base: 4, md: 3 }} align="stretch" w="full">
              <FormControl isRequired isInvalid={!!formState.errors.phone}>
                <FormLabel mb={2} fontSize="md" fontWeight="medium">{t('checkIn.phoneLabel')}</FormLabel>
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
                  fontSize="md"
                  height={{ base: "48px", md: "48px" }}
                  px={4}
                  maxLength={14}
                  aria-describedby="phone-error"
                />
                <FormErrorMessage id="phone-error" fontSize="sm" mt={1}>
                  {formState.errors.phone}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!formState.errors.lastName}>
                <FormLabel mb={2} fontSize="md" fontWeight="medium">{t('checkIn.lastNameLabel')}</FormLabel>
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
                  fontSize="md"
                  height={{ base: "48px", md: "48px" }}
                  px={4}
                  aria-describedby="lastName-error"
                />
                <FormErrorMessage id="lastName-error" fontSize="sm" mt={1}>
                  {formState.errors.lastName}
                </FormErrorMessage>
              </FormControl>

              {/* Buttons Row */}
              <Stack
                spacing={{ base: 4, md: 4 }}
                direction={{ base: "column", md: "row" }}
                width="full"
                pt={4}
                justify="center"
                align="center"
                mt={4}
              >
                <AssistanceButton 
                  width={{ base: "100%", md: "240px" }}
                  height={{ base: "48px", md: "48px" }}
                  fontSize="md"
                />
                <PrimaryButton
                  type="submit"
                  isLoading={isSubmitting}
                  width={{ base: "100%", md: "240px" }}
                  height={{ base: "48px", md: "48px" }}
                  fontSize="md"
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
