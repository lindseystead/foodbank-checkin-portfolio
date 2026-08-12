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
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../SpecialRequests.tsx} Special requests page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../../shared/lib/api';
import { CheckInResponse } from '../../../shared/types/CheckInResponse';
import { useToast, Checkbox, Text, Box, Link } from '@chakra-ui/react';
import { logger } from '../../../utils/logger';
import {
  buildTenantPath,
  useTenantConfig,
} from '../../../shared/contexts/TenantConfigContext';

import PageLayout from '../../../shared/components/layout/PageLayout';
import PageHeader from '../../../shared/components/ui/PageHeader';
import ProgressHeader from '../components/ProgressHeader';
import CheckInPageContainer from '../components/CheckInPageContainer';
import CheckInCard from '../components/CheckInCard';
import InitialCheckInForm from '../components/InitialCheckInForm';

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
  const { slug } = useTenantConfig();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
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
    if (isSubmitting) return;

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

    if (!consentGiven) {
      toast({
        title: t('checkIn.consentRequiredTitle', 'Consent required'),
        description: t(
          'checkIn.consentRequiredDescription',
          'Please agree to the collection and use of your information to continue.',
        ),
        status: 'warning',
        duration: 6000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // BC PIPA s.7 — record explicit data-collection consent before check-in.
      // The backend enforces this gate; recording here satisfies it. Best-effort
      // failure is surfaced as a connection error below if the check-in then fails.
      await api('/consent/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formState.phone,
          consentType: 'data_collection',
          consentGiven: true,
          privacyVersion: '1.0',
          consentMethod: 'kiosk',
        }),
      });

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
        logger.error('Failed to parse response:', parseError);
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
        navigate(buildTenantPath(slug, '/special-requests'));
      }
    } catch (error) {
      logger.error('Check-in error:', error);
      
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
      <ProgressHeader currentStep={1} totalSteps={4} />

      {/* Main Form Container */}
      <CheckInPageContainer>
        <CheckInCard
          maxW={{ base: '100%', md: '600px' }}
          p={{ base: 3, md: 6 }}
        >
          <PageHeader
            title={t('checkIn.title')}
            subTitle={t('checkIn.subtitle')}
            logoSize="sm"
            mb={4}
          />

          {/* Check-in Form */}
          <InitialCheckInForm
            phone={formState.phone}
            lastName={formState.lastName}
            errors={formState.errors}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            t={t}
          />

          {/* BC PIPA consent — must be given before check-in */}
          <Box mt={4}>
            <Checkbox
              isChecked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              alignItems="flex-start"
            >
              <Text fontSize="sm" color="gray.700">
                {t(
                  'checkIn.consentLabel',
                  'I agree to the collection and use of my information for the purpose of receiving food support, as described in the',
                )}{' '}
                <Link href="https://cofb-checkin.ca/privacy" isExternal color="blue.600" textDecoration="underline">
                  {t('checkIn.privacyNotice', 'Privacy Notice')}
                </Link>
                .
              </Text>
            </Checkbox>
          </Box>
        </CheckInCard>
      </CheckInPageContainer>
    </PageLayout>
  );
};

export default InitialCheckIn;
