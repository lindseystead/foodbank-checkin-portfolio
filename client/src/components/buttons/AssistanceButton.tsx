/**
 * @fileoverview Assistance button component for Foodbank Check-In and Appointment System client application
 * 
 * This component provides an assistance request button for clients
 * who need help during the check-in process. It handles
 * assistance requests and contact functionality.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../PrimaryButton.tsx} Primary button component
 */

import React, { useState, useEffect } from 'react';
import { 
  Button, 
  ButtonProps, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  useToast,
  useDisclosure,
  Text,
  Alert,
  AlertIcon,
  AlertDescription
} from '@chakra-ui/react';
import { FiHelpCircle, FiPhone, FiUser, FiPhone as FiPhoneIcon } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { getHelpRequestUrl } from '../../common/apiConfig';

interface AssistanceButtonProps extends ButtonProps {
  onClick?: () => void;
  clientData?: {
    phoneNumber?: string;
    lastName?: string;
  };
}

const AssistanceButton: React.FC<AssistanceButtonProps> = ({ 
  onClick, 
  clientData,
  ...buttonProps 
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    lastName: '',
    email: '',
    message: ''
  });

  // Check if we have existing client data
  const hasExistingData = clientData?.phoneNumber && clientData?.lastName;
  const needsVerification = !hasExistingData;

  // Initialize form with existing data if available
  useEffect(() => {
    if (hasExistingData) {
      setFormData(prev => ({
        ...prev,
        phoneNumber: clientData.phoneNumber || '',
        lastName: clientData.lastName || ''
      }));
    }
  }, [hasExistingData, clientData]);

  const handleCall = () => {
    const phoneNumber = '2507637161';
    const formattedPhone = '(250) 763-7161';
    
    // Check if it's a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile: Open phone dialer
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // Desktop: Use location.href instead of window.open to avoid blank page
      try {
        window.location.href = `tel:${phoneNumber}`;
      } catch (error) {
        // Fallback: Copy phone number to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(formattedPhone).then(() => {
            toast({
              title: t('assistance.phoneCopied', 'Phone number copied!'),
              description: t('assistance.phoneCopiedDesc', `Copied ${formattedPhone} to clipboard`),
              status: "success",
              duration: 5000,
            });
          }).catch(() => {
            toast({
              title: t('assistance.callUs', 'Please call us'),
              description: formattedPhone,
              status: "info",
              duration: 5000,
            });
          });
        } else {
          toast({
            title: t('assistance.callUs', 'Please call us'),
            description: formattedPhone,
            status: "info",
            duration: 5000,
          });
        }
      }
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.message.trim()) {
      toast({
        title: t('assistance.messageRequired', 'Message required'),
        description: t('assistance.messageRequiredDesc', 'Please enter your message'),
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (needsVerification) {
      if (!formData.phoneNumber.trim() || !formData.lastName.trim()) {
        toast({
          title: t('assistance.clientInfoRequired', 'Client information required'),
          description: t('assistance.clientInfoRequiredDesc', 'Please enter your phone number and last name'),
          status: "warning",
          duration: 3000,
        });
        return;
      }
    }

    // Help requests go to a public backend endpoint; proceed even if Supabase isn't configured

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
          has_existing_appointment: hasExistingData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send help request');
      }

      toast({
        title: t('assistance.requestSent', 'Help request sent!'),
        description: t('assistance.requestSentDesc', 'We\'ll get back to you soon'),
        status: "success",
        duration: 5000,
      });

      // Reset form and close modal
      setFormData({ 
        phoneNumber: hasExistingData ? clientData?.phoneNumber || '' : '',
        lastName: hasExistingData ? clientData?.lastName || '' : '',
        email: '', 
        message: '' 
      });
      onClose();
    } catch (error) {
      console.error('Error submitting help request:', error);
      toast({
        title: t('assistance.errorSending', 'Error sending request'),
        description: t('assistance.errorSendingDesc', 'Please try calling us instead'),
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // If custom onClick is provided, use simple button
  if (onClick) {
    return (
      <Button
        variant="outline"
        height={{ base: "48px", md: "48px" }}
        borderRadius="lg"
        fontSize={{ base: "md", md: "md" }}
        fontWeight="500"
        borderColor="gray.300"
        color="gray.700"
        bg="white"
        _hover={{
          bg: 'gray.50',
          borderColor: 'gray.400',
          transform: 'translateY(-1px)',
          boxShadow: 'sm'
        }}
        _focus={{
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.3)',
          outline: 'none'
        }}
        _active={{
          bg: 'gray.100',
          transform: 'translateY(0)',
          boxShadow: 'sm'
        }}
        transition="all 0.2s ease-in-out"
        leftIcon={<FiHelpCircle />}
        onClick={onClick}
        textAlign="center"
        isTruncated
        display="flex"
        alignItems="center"
        justifyContent="center"
        {...buttonProps}
      >
        {t('assistance.button', 'Need Help?')}
      </Button>
    );
  }

  // Default behavior - show modal with form
  return (
    <>
      <Button
        variant="outline"
        height={{ base: "48px", md: "48px" }}
        borderRadius="lg"
        fontSize={{ base: "md", md: "md" }}
        fontWeight="500"
        borderColor="gray.300"
        color="gray.700"
        bg="white"
        _hover={{
          bg: 'gray.50',
          borderColor: 'gray.400',
          transform: 'translateY(-1px)',
          boxShadow: 'sm'
        }}
        _focus={{
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.3)',
          outline: 'none'
        }}
        _active={{
          bg: 'gray.100',
          transform: 'translateY(0)',
          boxShadow: 'sm'
        }}
        transition="all 0.2s ease-in-out"
        leftIcon={<FiHelpCircle />}
        onClick={onOpen}
        textAlign="center"
        isTruncated
        display="flex"
        alignItems="center"
        justifyContent="center"
        {...buttonProps}
      >
        {t('assistance.button', 'Need Help?')}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent 
          mx={{ base: 4, md: 0 }}
          borderRadius="xl"
          boxShadow="2xl"
        >
          <ModalHeader 
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="600"
            color="gray.800"
            pb={2}
          >
            {t('assistance.title', 'Need Help?')}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {hasExistingData ? (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    {t('assistance.existingData', 'We have your appointment information. How can we help you?')}
                  </AlertDescription>
                </Alert>
              ) : (
                <Text 
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.600"
                  textAlign="center"
                >
                  {t('assistance.description', 'Tell us how we can help you with your food bank check-in.')}
                </Text>
              )}

              {needsVerification && (
                <>
                  <FormControl>
                    <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                      <HStack spacing={2}>
                        <FiPhoneIcon />
                        <Text>{t('assistance.phone', 'Phone Number')} *</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      type="tel"
                      placeholder={t('assistance.phonePlaceholder', '(250) 123-4567')}
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      borderRadius="lg"
                      borderColor="gray.300"
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.3)'
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                      <HStack spacing={2}>
                        <FiUser />
                        <Text>{t('assistance.lastName', 'Last Name')} *</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      type="text"
                      placeholder={t('assistance.lastNamePlaceholder', 'Smith')}
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      borderRadius="lg"
                      borderColor="gray.300"
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.3)'
                      }}
                    />
                  </FormControl>
                </>
              )}

              <FormControl>
                <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                  {t('assistance.email', 'Email (Optional)')}
                </FormLabel>
                <Input
                  type="email"
                  placeholder={t('assistance.emailPlaceholder', 'your.email@example.com')}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  borderRadius="lg"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.3)'
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                  {t('assistance.message', 'Message')} *
                </FormLabel>
                <Textarea
                  placeholder={t('assistance.messagePlaceholder', 'Describe how we can help you...')}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  borderRadius="lg"
                  borderColor="gray.300"
                  resize="vertical"
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.3)'
                  }}
                />
              </FormControl>

              <HStack spacing={3} pt={2}>
                <Button
                  variant="outline"
                  onClick={handleCall}
                  leftIcon={<FiPhone />}
                  flex={1}
                  height={{ base: "44px", md: "48px" }}
                  fontSize={{ base: "sm", md: "md" }}
                  borderRadius="lg"
                  borderColor="gray.300"
                  color="gray.700"
                  _hover={{
                    bg: 'gray.50',
                    borderColor: 'gray.400'
                  }}
                >
                  {t('assistance.call', 'Call Us')}
                </Button>
                
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  loadingText={t('assistance.sending', 'Sending...')}
                  flex={1}
                  height={{ base: "44px", md: "48px" }}
                  fontSize={{ base: "sm", md: "md" }}
                  borderRadius="lg"
                  fontWeight="500"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'md'
                  }}
                >
                  {t('assistance.send', 'Send Message')}
                </Button>
              </HStack>

              <Text 
                fontSize="xs" 
                color="gray.500" 
                textAlign="center"
                mt={2}
              >
                {t('assistance.disclaimer', 'We typically respond within 24 hours')}
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AssistanceButton;
