/**
 * @fileoverview Hook for help request form state and submission
 *
 * Manages form data, validation, and API submission logic
 * extracted from AssistanceButton.
 *
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { getHelpRequestUrl } from '../config/apiConfig';
import { logger } from '../../utils/logger';

interface ClientData {
  phoneNumber?: string;
  lastName?: string;
}

interface FormData {
  phoneNumber: string;
  lastName: string;
  email: string;
  message: string;
}

export function useHelpRequest(clientData?: ClientData) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    lastName: '',
    email: '',
    message: '',
  });

  const hasExistingData = !!(clientData?.phoneNumber && clientData?.lastName);
  const needsVerification = !hasExistingData;

  // Initialize form with existing client data
  useEffect(() => {
    if (hasExistingData) {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: clientData?.phoneNumber || '',
        lastName: clientData?.lastName || '',
      }));
    }
  }, [hasExistingData, clientData?.phoneNumber, clientData?.lastName]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (onSuccess?: () => void) => {
      // Validate required fields
      if (!formData.message.trim()) {
        toast({
          title: 'Message Required',
          description:
            'Please describe how we can help you in the message field.',
          status: 'warning',
          duration: 4000,
          isClosable: true,
          position: 'bottom',
        });
        return;
      }

      if (needsVerification) {
        if (!formData.phoneNumber.trim() || !formData.lastName.trim()) {
          toast({
            title: 'Information Required',
            description:
              'Please provide your phone number and last name so we can locate your appointment.',
            status: 'warning',
            duration: 4000,
            isClosable: true,
            position: 'bottom',
          });
          return;
        }
      }

      setIsSubmitting(true);

      try {
        const response = await fetch(getHelpRequestUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_phone: formData.phoneNumber.trim(),
            client_last_name: formData.lastName.trim(),
            client_email: formData.email || null,
            message: formData.message.trim(),
            current_page: window.location.pathname,
            has_existing_appointment: hasExistingData,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send help request');
        }

        toast({
          title: 'Help Request Sent',
          description:
            'Your request for assistance has been submitted. A staff member will contact you shortly.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });

        // Reset form
        setFormData({
          phoneNumber: hasExistingData ? clientData?.phoneNumber || '' : '',
          lastName: hasExistingData ? clientData?.lastName || '' : '',
          email: '',
          message: '',
        });

        onSuccess?.();
      } catch (error) {
        logger.error('Error submitting help request:', error);
        toast({
          title: 'Request Failed',
          description:
            'Unable to send your help request. Please try again or use the "Call Us" button for immediate assistance.',
          status: 'error',
          duration: 7000,
          isClosable: true,
          position: 'bottom',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, needsVerification, hasExistingData, clientData, toast],
  );

  return {
    formData,
    isSubmitting,
    hasExistingData,
    needsVerification,
    handleInputChange,
    handleSubmit,
  };
}
