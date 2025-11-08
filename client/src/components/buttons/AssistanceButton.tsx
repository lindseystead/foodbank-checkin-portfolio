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
  AlertDescription,
  Box,
  Divider
} from '@chakra-ui/react';
import { FiHelpCircle, FiPhone, FiUser, FiPhone as FiPhoneIcon, FiInfo } from 'react-icons/fi';
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
              duration: 3000,
              isClosable: true,
              position: 'bottom',
            });
          }).catch(() => {
            toast({
              title: t('assistance.callUs', 'Please call us'),
              description: formattedPhone,
              status: "info",
              duration: 5000,
              isClosable: true,
              position: 'bottom',
            });
          });
        } else {
          toast({
            title: t('assistance.callUs', 'Please call us'),
            description: formattedPhone,
            status: "info",
            duration: 5000,
            isClosable: true,
            position: 'bottom',
          });
        }
      }
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.message.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please describe how we can help you in the message field.',
        status: "warning",
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
          description: 'Please provide your phone number and last name so we can locate your appointment.',
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: 'bottom',
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
        title: 'Help Request Sent',
        description: 'Your request for assistance has been submitted. A staff member will contact you shortly.',
        status: "success",
        duration: 5000,
        isClosable: true,
        position: 'bottom',
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
        title: 'Request Failed',
        description: 'Unable to send your help request. Please try again or use the "Call Us" button for immediate assistance.',
        status: "error",
        duration: 7000,
        isClosable: true,
        position: 'bottom',
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

  // IMPORTANT: Ensure width, height, and fontSize are set for consistency with Continue buttons
  // Extract these props from buttonProps to ensure they're applied correctly
  const { width, height, fontSize, ...restButtonProps } = buttonProps;
  
  // Use props from buttonProps if provided, otherwise use defaults
  const buttonWidth = width || { base: "100%", md: "240px" };
  const buttonHeight = height || { base: "48px", md: "48px" };
  const buttonFontSize = fontSize || "md";
  
  // IMPORTANT: Set minW to match width to ensure consistent sizing (prevents any minW from theme from overriding)
  const minW = buttonWidth;

  // If custom onClick is provided, use simple button
  if (onClick) {
    return (
      <Button
        variant="outline"
        width={buttonWidth}
        height={buttonHeight}
        minW={minW}
        borderRadius="lg"
        fontSize={buttonFontSize}
        fontWeight="500"
        px={{ base: 4, md: 6 }}
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
        {...restButtonProps}
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
        width={buttonWidth}
        height={buttonHeight}
        minW={minW}
        borderRadius="lg"
        fontSize={buttonFontSize}
        fontWeight="500"
        px={{ base: 4, md: 6 }}
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
        {...restButtonProps}
      >
        {t('assistance.button', 'Need Help?')}
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size={{ base: "full", sm: "md", md: "lg" }} 
        isCentered
        scrollBehavior="inside"
        motionPreset="slideInBottom"
        closeOnOverlayClick={true}
        closeOnEsc={true}
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent 
          mx={{ base: 0, md: 0 }}
          my={{ base: 0, md: 0 }}
          maxH={{ base: "100vh", md: "90vh" }}
          borderRadius={{ base: "none", md: "xl" }}
          boxShadow="2xl"
        >
          <ModalHeader 
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="700"
            color="gray.800"
            pb={3}
            pt={{ base: 6, md: 6 }}
            px={{ base: 5, md: 6 }}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <HStack spacing={3} align="center">
              <Box
                as={FiHelpCircle}
                boxSize={6}
                color="blue.500"
              />
              <Text>{t('assistance.title', 'Need Help?')}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton 
            size="md"
            top={{ base: 4, md: 4 }}
            right={{ base: 4, md: 4 }}
            borderRadius="full"
            _hover={{ bg: 'gray.100' }}
          />
          
          <ModalBody 
            pb={{ base: 6, md: 6 }}
            px={{ base: 5, md: 6 }}
            pt={5}
          >
            <VStack spacing={5} align="stretch">
              {/* Welcome Message Section */}
              <Box>
                {hasExistingData ? (
                  <Alert 
                    status="info" 
                    borderRadius="lg"
                    variant="left-accent"
                    py={3}
                  >
                    <AlertIcon boxSize={5} />
                    <AlertDescription fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                      {t('assistance.existingData', 'We have your appointment information. How can we help you?')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Box
                    bg="blue.50"
                    border="1px solid"
                    borderColor="blue.200"
                    borderRadius="lg"
                    p={4}
                  >
                    <Text 
                      fontSize={{ base: "sm", md: "md" }}
                      color="blue.800"
                      fontWeight="500"
                      lineHeight="tall"
                    >
                      {t('assistance.description', 'Tell us how we can help you with your food bank check-in.')}
                    </Text>
                  </Box>
                )}
              </Box>

              {/* Contact Information Section */}
              {needsVerification && (
                <Box>
                  <Text 
                    fontSize={{ base: "sm", md: "md" }} 
                    fontWeight="600" 
                    color="gray.700"
                    mb={3}
                  >
                    Contact Information
                  </Text>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel 
                        fontSize={{ base: "sm", md: "sm" }} 
                        fontWeight="600" 
                        mb={2}
                        color="gray.700"
                      >
                        <HStack spacing={2} wrap="nowrap">
                          <FiPhoneIcon size={16} />
                          <Text whiteSpace="nowrap">{t('assistance.phone', 'Phone Number')}</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        type="tel"
                        placeholder={t('assistance.phonePlaceholder', '(250) 123-4567')}
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        size="md"
                        height="48px"
                        borderRadius="lg"
                        borderColor="gray.300"
                        fontSize="md"
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
                        }}
                        _hover={{
                          borderColor: 'gray.400'
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel 
                        fontSize={{ base: "sm", md: "sm" }} 
                        fontWeight="600" 
                        mb={2}
                        color="gray.700"
                      >
                        <HStack spacing={2} wrap="nowrap">
                          <FiUser size={16} />
                          <Text whiteSpace="nowrap">{t('assistance.lastName', 'Last Name')}</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder={t('assistance.lastNamePlaceholder', 'Smith')}
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        size="md"
                        height="48px"
                        borderRadius="lg"
                        borderColor="gray.300"
                        fontSize="md"
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
                        }}
                        _hover={{
                          borderColor: 'gray.400'
                        }}
                      />
                    </FormControl>
                  </VStack>
                </Box>
              )}

              {/* Message Section */}
              <Box>
                <Text 
                  fontSize={{ base: "sm", md: "md" }} 
                  fontWeight="600" 
                  color="gray.700"
                  mb={3}
                >
                  How Can We Help?
                </Text>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel 
                      fontSize={{ base: "sm", md: "sm" }} 
                      fontWeight="600" 
                      mb={2}
                      color="gray.700"
                    >
                      <HStack spacing={1} wrap="wrap" align="baseline">
                        <Text whiteSpace="nowrap">{t('assistance.email', 'Email (Optional)')}</Text>
                        <Text as="span" fontSize="xs" fontWeight="400" color="gray.500">
                          - We'll use this to respond if you provide it
                        </Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      type="email"
                      placeholder={t('assistance.emailPlaceholder', 'your.email@example.com')}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      size="md"
                      height="48px"
                      borderRadius="lg"
                      borderColor="gray.300"
                      fontSize="md"
                      _focus={{
                        borderColor: 'blue.500',
                        boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
                      }}
                      _hover={{
                        borderColor: 'gray.400'
                      }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel 
                      fontSize={{ base: "sm", md: "sm" }} 
                      fontWeight="600" 
                      mb={2}
                      color="gray.700"
                    >
                      {t('assistance.message', 'Message')}
                    </FormLabel>
                    <Textarea
                      placeholder={t('assistance.messagePlaceholder', 'Please describe how we can help you with your check-in...')}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={4}
                      minH="120px"
                      size="md"
                      borderRadius="lg"
                      borderColor="gray.300"
                      fontSize="md"
                      resize="vertical"
                      _focus={{
                        borderColor: 'blue.500',
                        boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
                      }}
                      _hover={{
                        borderColor: 'gray.400'
                      }}
                    />
                    <Text 
                      fontSize="xs" 
                      color="gray.500" 
                      mt={1}
                    >
                      Please provide as much detail as possible so we can assist you better.
                    </Text>
                  </FormControl>
                </VStack>
              </Box>

              {/* Action Buttons Section */}
              <Box pt={2}>
                <VStack spacing={3} align="stretch">
                  <Button
                    colorScheme="blue"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    loadingText={t('assistance.sending', 'Sending...')}
                    size="lg"
                    height="48px"
                    fontSize="md"
                    fontWeight="600"
                    borderRadius="lg"
                    leftIcon={<FiHelpCircle size={18} />}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg'
                    }}
                    _active={{
                      transform: 'translateY(0)'
                    }}
                    isDisabled={!formData.message.trim() || (needsVerification && (!formData.phoneNumber.trim() || !formData.lastName.trim()))}
                  >
                    {t('assistance.send', 'Send Help Request')}
                  </Button>
                  
                  <Divider borderColor="gray.200" />
                  
                  <Button
                    variant="outline"
                    onClick={handleCall}
                    size="lg"
                    height="48px"
                    fontSize="md"
                    fontWeight="600"
                    borderRadius="lg"
                    borderColor="gray.300"
                    color="gray.700"
                    bg="white"
                    leftIcon={<FiPhone size={18} />}
                    _hover={{
                      bg: 'gray.50',
                      borderColor: 'gray.400',
                      transform: 'translateY(-1px)'
                    }}
                    _active={{
                      transform: 'translateY(0)'
                    }}
                  >
                    {t('assistance.call', 'Call Us Now')}
                  </Button>
                </VStack>
              </Box>

              {/* Footer Information */}
              <Box
                bg="gray.50"
                borderRadius="lg"
                p={4}
                border="1px solid"
                borderColor="gray.200"
              >
                <VStack spacing={2} align="start">
                  <HStack spacing={2} align="center">
                    <Box
                      as={FiInfo}
                      boxSize={4}
                      color="blue.500"
                    />
                    <Text 
                      fontSize="xs" 
                      color="gray.600" 
                      fontWeight="500"
                    >
                      Response Time
                    </Text>
                  </HStack>
                  <Text 
                    fontSize="xs" 
                    color="gray.600"
                    pl={6}
                    lineHeight="tall"
                  >
                    {t('assistance.disclaimer', 'We typically respond within 24 hours. For urgent assistance, please call us directly.')}
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AssistanceButton;
