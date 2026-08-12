/**
 * @fileoverview Help request modal component
 *
 * Full-screen / responsive modal with a help-request form, call button,
 * and response-time footer. Extracted from AssistanceButton.
 *
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

import React from 'react';
import {
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
  Flex,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Divider,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FiHelpCircle,
  FiPhone,
  FiUser,
  FiPhone as FiPhoneIcon,
  FiInfo,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

import { useTenantConfig } from '../../contexts/TenantConfigContext';
import { usePhoneCall } from '../../hooks/usePhoneCall';
import { useHelpRequest } from '../../hooks/useHelpRequest';

export interface HelpRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData?: {
    phoneNumber?: string;
    lastName?: string;
  };
}

const HelpRequestModal: React.FC<HelpRequestModalProps> = ({
  isOpen,
  onClose,
  clientData,
}) => {
  const { t } = useTranslation();
  const { phoneDigits, phoneDisplay } = useTenantConfig();
  const iconSize = useBreakpointValue({ base: 16, md: 18 });

  const { handleCall } = usePhoneCall(phoneDigits, phoneDisplay);
  const {
    formData,
    isSubmitting,
    hasExistingData,
    needsVerification,
    handleInputChange,
    handleSubmit,
  } = useHelpRequest(clientData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: 'full', sm: 'md', md: 'lg' }}
      isCentered={false}
      scrollBehavior="inside"
      motionPreset="slideInBottom"
      closeOnOverlayClick={true}
      closeOnEsc={true}
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent
        mx={{ base: 0, md: 0 }}
        my={{ base: 0, md: 0 }}
        minH={{ base: '100dvh', md: 'auto' }}
        maxH={{ base: '100dvh', md: '90vh' }}
        maxW={{ base: '100%', md: '90vw', lg: '600px' }}
        w={{ base: '100%', md: 'auto' }}
        borderRadius={{ base: 'none', md: 'xl' }}
        boxShadow="2xl"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <ModalHeader
          fontSize={{ base: 'lg', md: 'xl' }}
          fontWeight="700"
          color="gray.800"
          pb={3}
          pt={{ base: 4, sm: 5, md: 6 }}
          px={{ base: 4, sm: 5, md: 6 }}
          pr={{ base: 12, md: 14 }}
          borderBottom="1px solid"
          borderColor="gray.200"
          flexShrink={0}
          w="full"
          maxW="100%"
          overflow="hidden"
        >
          <HStack spacing={3} align="center" w="full" maxW="100%">
            <Box
              as={FiHelpCircle}
              boxSize={{ base: 5, md: 6 }}
              color="blue.500"
              flexShrink={0}
            />
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="700"
              whiteSpace="normal"
              lineHeight="short"
              overflowWrap="anywhere"
              minW={0}
              flex={1}
            >
              {t('assistance.title', 'Need Help?')}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton
          size='md'
          top={{ base: 3, md: 4 }}
          right={{ base: 3, md: 4 }}
          borderRadius="full"
          _hover={{ bg: 'gray.100' }}
        />

        <ModalBody
          pb={{ base: 4, sm: 5, md: 6 }}
          px={{ base: 4, sm: 5, md: 6 }}
          pt={{ base: 4, md: 5 }}
          flex="1"
          minH={0}
          overflowY="auto"
          overflowX="hidden"
          w="full"
          maxW="100%"
        >
          <VStack
            spacing={{ base: 4, md: 5 }}
            align="stretch"
            w="full"
            maxW="100%"
          >
            {/* Welcome Message Section */}
            <Box w="full" maxW="100%" overflow="visible">
              {hasExistingData ? (
                <Alert
                  status="info"
                  borderRadius="lg"
                  variant="left-accent"
                  py={{ base: 2, md: 3 }}
                  px={{ base: 3, md: 4 }}
                >
                  <AlertIcon boxSize={{ base: 4, md: 5 }} />
                  <AlertDescription
                    fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                    fontWeight="500"
                    w="full"
                    maxW="100%"
                  >
                    {t(
                      'assistance.existingData',
                      'We have your appointment information. How can we help you?',
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <Box
                  bg="blue.50"
                  border="1px solid"
                  borderColor="blue.200"
                  borderRadius="lg"
                  p={{ base: 3, md: 4 }}
                  w="full"
                  maxW="100%"
                >
                  <Text
                    fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                    color="blue.800"
                    fontWeight="500"
                    lineHeight="tall"
                    w="full"
                    maxW="100%"
                  >
                    {t(
                      'assistance.description',
                      'Tell us how we can help you with your food bank check-in.',
                    )}
                  </Text>
                </Box>
              )}
            </Box>

            {/* Contact Information Section */}
            {needsVerification && (
              <Box w="full" maxW="100%" overflow="visible">
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="600"
                  color="gray.700"
                  mb={3}
                  w="full"
                  maxW="100%"
                >
                  Contact Information
                </Text>
                <VStack
                  spacing={{ base: 3, md: 4 }}
                  align="stretch"
                  w="full"
                  maxW="100%"
                >
                  <FormControl isRequired w="full" maxW="100%">
                    <FormLabel
                      fontSize={{ base: 'xs', sm: 'sm' }}
                      fontWeight="600"
                      mb={2}
                      color="gray.700"
                      w="full"
                      maxW="100%"
                      display="flex"
                      flexDirection="row"
                      alignItems="flex-start"
                      flexWrap="wrap"
                      gap={1}
                    >
                      {/* Flex avoids `.chakra-stack` global width:100%!important (same for Last Name below). */}
                      <Flex
                        align="flex-start"
                        gap={2}
                        flex={1}
                        minW={0}
                        flexWrap="wrap"
                      >
                        <Box as="span" display="inline-flex" pt="0.15em" flexShrink={0}>
                          <FiPhoneIcon size={14} />
                        </Box>
                        <Box
                          as="span"
                          whiteSpace="normal"
                          fontSize={{ base: 'xs', sm: 'sm' }}
                          overflowWrap="anywhere"
                          minW={0}
                          lineHeight="short"
                        >
                          {t('assistance.phone', 'Phone Number')}
                        </Box>
                      </Flex>
                    </FormLabel>
                    <Input
                      type="tel"
                      placeholder={t(
                        'assistance.phonePlaceholder',
                        '(250) 123-4567',
                      )}
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange('phoneNumber', e.target.value)
                      }
                      size='md'
                      
                      borderRadius="lg"
                      borderColor="gray.300"
                      fontSize={{ base: 'sm', md: 'md' }}
                      w="full"
                      maxW="100%"
                      _focus={{
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                      }}
                      _hover={{ borderColor: 'gray.400' }}
                    />
                  </FormControl>

                  <FormControl isRequired w="full" maxW="100%">
                    <FormLabel
                      fontSize={{ base: 'xs', sm: 'sm' }}
                      fontWeight="600"
                      mb={2}
                      color="gray.700"
                      w="full"
                      maxW="100%"
                      display="flex"
                      flexDirection="row"
                      alignItems="flex-start"
                      flexWrap="wrap"
                      gap={1}
                    >
                      <Flex
                        align="flex-start"
                        gap={2}
                        flex={1}
                        minW={0}
                        flexWrap="wrap"
                      >
                        <Box as="span" display="inline-flex" pt="0.15em" flexShrink={0}>
                          <FiUser size={14} />
                        </Box>
                        <Box
                          as="span"
                          whiteSpace="normal"
                          fontSize={{ base: 'xs', sm: 'sm' }}
                          overflowWrap="anywhere"
                          minW={0}
                          lineHeight="short"
                        >
                          {t('assistance.lastName', 'Last Name')}
                        </Box>
                      </Flex>
                    </FormLabel>
                    <Input
                      type="text"
                      placeholder={t(
                        'assistance.lastNamePlaceholder',
                        'Smith',
                      )}
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange('lastName', e.target.value)
                      }
                      size='md'
                      
                      borderRadius="lg"
                      borderColor="gray.300"
                      fontSize={{ base: 'sm', md: 'md' }}
                      w="full"
                      maxW="100%"
                      _focus={{
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                      }}
                      _hover={{ borderColor: 'gray.400' }}
                    />
                  </FormControl>
                </VStack>
              </Box>
            )}

            {/* Message Section */}
            <Box w="full" maxW="100%" overflow="visible">
              <Text
                fontSize={{ base: 'sm', md: 'md' }}
                fontWeight="600"
                color="gray.700"
                mb={3}
                w="full"
                maxW="100%"
              >
                How Can We Help?
              </Text>
              <VStack
                spacing={{ base: 3, md: 4 }}
                align="stretch"
                w="full"
                maxW="100%"
              >
                <FormControl w="full" maxW="100%">
                  <FormLabel
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    fontWeight="600"
                    mb={2}
                    color="gray.700"
                    w="full"
                    maxW="100%"
                  >
                    <VStack spacing={1} align="start" w="full" maxW="100%">
                      <Text
                        fontSize={{ base: 'xs', sm: 'sm' }}
                        whiteSpace="normal"
                        overflowWrap="anywhere"
                      >
                        {t('assistance.email', 'Email (Optional)')}
                      </Text>
                      <Text
                        as="span"
                        fontSize={{ base: '2xs', sm: 'xs' }}
                        fontWeight="400"
                        color="gray.500"
                        w="full"
                        maxW="100%"
                      >
                        We'll use this to respond if you provide it
                      </Text>
                    </VStack>
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder={t(
                      'assistance.emailPlaceholder',
                      'your.email@example.com',
                    )}
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange('email', e.target.value)
                    }
                    size='md'
                    
                    borderRadius="lg"
                    borderColor="gray.300"
                    fontSize={{ base: 'sm', md: 'md' }}
                    w="full"
                    maxW="100%"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                    _hover={{ borderColor: 'gray.400' }}
                  />
                </FormControl>

                <FormControl isRequired w="full" maxW="100%">
                  <FormLabel
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    fontWeight="600"
                    mb={2}
                    color="gray.700"
                    w="full"
                    maxW="100%"
                    display="flex"
                    flexDirection="row"
                    alignItems="baseline"
                    flexWrap="wrap"
                    gap={1}
                    lineHeight="short"
                  >
                    <Box as="span">{t('assistance.message', 'Message')}</Box>
                  </FormLabel>
                  <Textarea
                    placeholder={t(
                      'assistance.messagePlaceholder',
                      'Please describe how we can help you with your check-in...',
                    )}
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange('message', e.target.value)
                    }
                    rows={4}
                    minH={{ base: '100px', md: '120px' }}
                    size='md'
                    borderRadius="lg"
                    borderColor="gray.300"
                    fontSize={{ base: 'sm', md: 'md' }}
                    resize="vertical"
                    w="full"
                    maxW="100%"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                    _hover={{ borderColor: 'gray.400' }}
                  />
                  <Text
                    fontSize={{ base: '2xs', sm: 'xs' }}
                    color="gray.500"
                    mt={1}
                    w="full"
                    maxW="100%"
                  >
                    Please provide as much detail as possible so we can assist
                    you better.
                  </Text>
                </FormControl>
              </VStack>
            </Box>

            {/* Action Buttons Section */}
            <Box pt={2} w="full" maxW="100%" overflow="visible">
              <VStack spacing={3} align="stretch" w="full" maxW="100%">
                <Button
                  colorScheme="blue"
                  onClick={() => handleSubmit(onClose)}
                  isLoading={isSubmitting}
                  loadingText={t('assistance.sending', 'Sending...')}
                  size="md"
                  
                  fontSize="md"
                  fontWeight="600"
                  borderRadius="lg"
                  leftIcon={<FiHelpCircle size={iconSize} />}
                  w="full"
                  maxW="100%"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  isDisabled={
                    !formData.message.trim() ||
                    (needsVerification &&
                      (!formData.phoneNumber.trim() ||
                        !formData.lastName.trim()))
                  }
                >
                  {t('assistance.send', 'Send Help Request')}
                </Button>

                <Divider borderColor="gray.200" />

                <Button
                  variant="outline"
                  onClick={handleCall}
                  size="md"
                  
                  fontSize="md"
                  fontWeight="600"
                  borderRadius="lg"
                  borderColor="gray.300"
                  color="gray.700"
                  bg="white"
                  leftIcon={<FiPhone size={iconSize} />}
                  w="full"
                  maxW="100%"
                  _hover={{
                    bg: 'gray.50',
                    borderColor: 'gray.400',
                    transform: 'translateY(-1px)',
                  }}
                  _active={{ transform: 'translateY(0)' }}
                >
                  {t('assistance.call', 'Call Us Now')}
                </Button>
              </VStack>
            </Box>

            {/* Footer Information */}
            <Box
              bg="gray.50"
              borderRadius="lg"
              p={{ base: 3, md: 4 }}
              border="1px solid"
              borderColor="gray.200"
              w="full"
              maxW="100%"
              overflow="visible"
            >
              <VStack spacing={2} align="start" w="full" maxW="100%">
                <HStack spacing={2} align="center" w="full" maxW="100%">
                  <Box
                    as={FiInfo}
                    boxSize={{ base: 3, md: 4 }}
                    color="blue.500"
                    flexShrink={0}
                  />
                  <Text
                    fontSize={{ base: '2xs', sm: 'xs' }}
                    color="gray.600"
                    fontWeight="500"
                    minW={0}
                  >
                    Response Time
                  </Text>
                </HStack>
                <Text
                  fontSize={{ base: '2xs', sm: 'xs' }}
                  color="gray.600"
                  pl={{ base: 5, md: 6 }}
                  lineHeight="tall"
                  w="full"
                  maxW="100%"
                >
                  {t(
                    'assistance.disclaimer',
                    'We typically respond within 24 hours. For urgent assistance, please call us directly.',
                  )}
                </Text>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HelpRequestModal;
