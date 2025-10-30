/**
 * @fileoverview Appointment details page for Foodbank Check-In and Appointment System client application
 * 
 * This page displays appointment information and allows clients to
 * confirm or reschedule their appointments. It shows appointment
 * details, time slots, and provides rescheduling options.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../Confirmation.tsx} Confirmation page
 */

/**
 * AppointmentDetails.tsx
 * ----------------------
 * This page displays the user's next automatically scheduled appointment
 * and allows them to reschedule if desired.
 *
 * Main Features:
 * - Auto-schedules the next appointment 21 days from today
 * - Displays the appointment date clearly
 * - Provides options for how the user wants to receive reminders
 * - Includes an important notice about arrival and late policies
 * - Styled using Chakra UI components with responsive layout
 *
 * Author: Lindsey Stead
 * Date: 2025-05-05
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  VStack,
  Box,
  Text,
  Heading,
  RadioGroup,
  Select,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Stack,
  HStack,
} from "@chakra-ui/react";
import PrimaryButton from "../components/buttons/PrimaryButton";
import AssistanceButton from "../components/buttons/AssistanceButton";
import PageLayout from '../components/layout/PageLayout';
import ProgressSteps from '../components/layout/ProgressSteps';
import PageHeader from '../components/ui/PageHeader';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';


const AppointmentDetails: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
 
  const [nextAppointment, setNextAppointment] = useState<{
    date: string;
    time: string;
    formattedDate: string;
  } | null>(null);

  // Fetch next appointment data
  const fetchNextAppointment = async (clientId: string) => {
    try {
      const response = await api('/checkin');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Find the client's record
        const clientRecord = data.data.find((record: any) => 
          record.clientId === clientId && 
          record.nextAppointmentDate
        );
        
        if (clientRecord) {
          const nextDate = new Date(clientRecord.nextAppointmentDate);
          
          // Convert 24-hour time to 12-hour AM/PM format
          const formatTime = (timeStr: string): string => {
            if (!timeStr) return '10:00 AM';
            
            const [hours, minutes] = timeStr.split(':');
            const hour24 = parseInt(hours);
            const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
            const ampm = hour24 >= 12 ? 'PM' : 'AM';
            
            return `${hour12}:${minutes} ${ampm}`;
          };
          
          setNextAppointment({
            date: clientRecord.nextAppointmentDate,
            time: formatTime(clientRecord.nextAppointmentTime || '10:00'),
            formattedDate: nextDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch next appointment:', error);
    }
  };

  // Fetch next appointment data on component load
  React.useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== 'undefined') {
        const checkInData = window.sessionStorage.getItem('checkInInfo');
        if (checkInData) {
          try {
            const parsed = JSON.parse(checkInData);
            
            // Fetch next appointment if we have clientId
            if (parsed.clientId) {
              await fetchNextAppointment(parsed.clientId);
            }
          } catch (error) {
            console.error('Error parsing checkInData:', error);
          }
        }
      }
    };
    
    fetchData();
  }, []);

  const [notificationPreference, setNotificationPreference] =
    useState<string>("email");
  const [phoneCarrier, setPhoneCarrier] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [showErrors] = useState(false);

  const phoneCarriers = [
    { value: "verizon", label: "Verizon" },
    { value: "att", label: "AT&T" },
    { value: "tmobile", label: "T-Mobile" },
    { value: "sprint", label: "Sprint" },
    { value: "rogers", label: "Rogers" },
    { value: "bell", label: "Bell" },
    { value: "telus", label: "Telus" },
    { value: "other", label: "Other" },
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digitsOnly = inputValue.replace(/\D/g, '');

    let formattedPhone = '';
    if (digitsOnly.length <= 3) {
      formattedPhone = digitsOnly;
    } else if (digitsOnly.length <= 6) {
      formattedPhone = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
    } else {
      formattedPhone = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
    }

    setPhone(formattedPhone);
    setPhoneError('');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (): boolean => {
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      return false;
    } else if (phone.replace(/\D/g, '').length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSubmit = () => {
    if (!nextAppointment) {
      console.error('No next appointment available');
      return;
    }
    
    const appointmentData = {
      date: nextAppointment.date,
      formattedDate: nextAppointment.formattedDate,
      time: nextAppointment.time,
      notificationPreference,
      ...(notificationPreference === "email"
        ? { email }
        : { phone, phoneCarrier }),
    };
    sessionStorage.setItem("appointmentData", JSON.stringify(appointmentData));
    navigate("/confirmation");
  };



  return (
    <PageLayout showBackButton isScrollable>
      <Box
        w="full"
        position="absolute"
        top="0"
        left="0"
        right="0"
        bg="white"
        zIndex="1"
        pb={2}
        pt={{ base: "60px", md: "20px" }}
        boxShadow="sm"
      >
        <ProgressSteps
          currentStep={3}
          totalSteps={4}
          labels={[
            t('navigation.progressSteps.initialCheckIn'),
            t('navigation.progressSteps.specialRequests'),
            t('navigation.progressSteps.appointmentDetails'),
            t('navigation.progressSteps.confirmation')
          ]}
        />
      </Box>

      {/* Main content container with responsive spacing and sizing */}
      <VStack 
        spacing={{ base: 6, md: 8 }} 
        width="full" 
        maxW={{ base: "100%", md: "1200px" }} 
        mx="auto"
        px={{ base: 4, sm: 6, md: 6 }}
        py={{ base: 6, md: 8 }}
        pt={{ base: "120px", md: "140px" }}
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
          maxW={{ base: "100%", md: "1000px" }}
          mx="auto"
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          p={{ base: 4, md: 8 }}
          overflow="visible"
        >
          <PageHeader
            title={t('appointment.title')}
            subTitle={t('appointment.subtitle')}
            logoSize="sm"
            mb={6}
          />

          {/* Next Appointment Information */}
          <Box 
            bg="green.50"
            borderRadius="lg" 
            p={{ base: 4, md: 6 }}
            mb={6}
            border="1px solid"
            borderColor="green.200"
            w="full"
            maxW="600px"
            mx="auto"
          >
            <VStack spacing={3} align="center">
              <Text fontSize="xs" fontWeight="600" color="green.600" textTransform="uppercase" letterSpacing="wide">
                🗓️ Your Next Appointment
              </Text>
              <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                fontWeight="600" 
                color="green.700"
                textAlign="center"
                lineHeight="1.3"
                px={2}
                wordBreak="break-word"
              >
                {nextAppointment ? nextAppointment.formattedDate : 'Loading appointment...'}
              </Text>
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                fontWeight="500" 
                color="green.600"
                textAlign="center"
                px={2}
              >
                {nextAppointment ? `at ${nextAppointment.time}` : ''}
              </Text>
              <Text 
                fontSize="sm" 
                color="green.600"
                textAlign="center"
                px={2}
                fontStyle="italic"
              >
                This appointment has been automatically scheduled for you please call 
              </Text>
            </VStack>
          </Box>

          {/* Secondary Information - Reminder Preferences */}
          <Box mb={8} maxW={{ base: "100%", md: "900px" }} mx="auto">
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Heading size="md" color="gray.800" mb={4}>
                  📱 How would you like to receive your reminder?
                </Heading>
              </Box>
              
              <RadioGroup
                value={notificationPreference}
                onChange={setNotificationPreference}
              >
                <Box 
                  display="grid" 
                  gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={{ base: 3, md: 4 }}
                  w="full"
                  maxW={{ base: "100%", md: "800px" }}
                  mx="auto"
                  px={{ base: 2, md: 0 }}
                >
                  {/* Email Option */}
                  <Box
                    border="2px solid"
                    borderColor={notificationPreference === "email" ? "client.primary" : "gray.200"}
                    borderRadius="xl"
                    p={{ base: 4, md: 6 }}
                    bg={notificationPreference === "email" ? "brand.50" : "white"}
                    transition="all 0.3s ease"
                    _hover={{ 
                      borderColor: "client.primary", 
                      bg: "brand.25",
                      transform: "translateY(-2px)",
                      boxShadow: "lg"
                    }}
                    cursor="pointer"
                    onClick={() => setNotificationPreference("email")}
                    w="full"
                    position="relative"
                    overflow="hidden"
                    minH={{ base: "auto", md: "120px" }}
                  >
                    <VStack spacing={4} align="start">
                      <HStack spacing={3} align="center">
                        <Box
                          w={6}
                          h={6}
                          borderRadius="full"
                          border="2px solid"
                          borderColor={notificationPreference === "email" ? "client.primary" : "gray.300"}
                          bg={notificationPreference === "email" ? "client.primary" : "white"}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {notificationPreference === "email" && (
                            <Box w={2} h={2} bg="white" borderRadius="full" />
                          )}
                        </Box>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="lg" fontWeight="600" color="client.primary">
                            📧 Email Confirmation
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Get a detailed email with appointment details
                          </Text>
                        </VStack>
                      </HStack>
                      
                      {notificationPreference === "email" && (
                        <Box w="full" pl={{ base: 0, md: 9 }} mt={2}>
                          <FormControl isInvalid={showErrors && !!emailError}>
                            <FormLabel fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                              Email Address
                            </FormLabel>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                if (showErrors) validateEmail(e.target.value);
                              }}
                              placeholder="your.email@example.com"
                              size={{ base: "md", md: "lg" }}
                              height={{ base: "40px", md: "48px" }}
                              borderRadius="lg"
                              bg="white"
                              border="2px solid"
                              borderColor="brand.200"
                              _focus={{
                                borderColor: 'client.primary',
                                boxShadow: '0 0 0 3px rgba(37, 56, 93, 0.1)',
                              }}
                              _hover={{ borderColor: 'brand.300' }}
                              w="full"
                              maxW="100%"
                            />
                            <FormErrorMessage fontSize="xs" mt={1}>{emailError}</FormErrorMessage>
                          </FormControl>
                        </Box>
                      )}
                    </VStack>
                  </Box>

                  {/* SMS Option */}
                  <Box
                    border="2px solid"
                    borderColor={notificationPreference === "sms" ? "accent.green.400" : "gray.200"}
                    borderRadius="xl"
                    p={{ base: 4, md: 6 }}
                    bg={notificationPreference === "sms" ? "accent.green.50" : "white"}
                    transition="all 0.3s ease"
                    _hover={{ 
                      borderColor: "accent.green.400", 
                      bg: "accent.green.25",
                      transform: "translateY(-2px)",
                      boxShadow: "lg"
                    }}
                    cursor="pointer"
                    onClick={() => setNotificationPreference("sms")}
                    w="full"
                    position="relative"
                    overflow="hidden"
                    minH={{ base: "auto", md: "120px" }}
                  >
                    <VStack spacing={4} align="start">
                      <HStack spacing={3} align="center">
                        <Box
                          w={6}
                          h={6}
                          borderRadius="full"
                          border="2px solid"
                          borderColor={notificationPreference === "sms" ? "accent.green.400" : "gray.300"}
                          bg={notificationPreference === "sms" ? "accent.green.400" : "white"}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {notificationPreference === "sms" && (
                            <Box w={2} h={2} bg="white" borderRadius="full" />
                          )}
                        </Box>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="lg" fontWeight="600" color="accent.green.500">
                            📱 SMS Text Message
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Get a quick text reminder on your phone
                          </Text>
                        </VStack>
                      </HStack>
                      
                      {notificationPreference === "sms" && (
                        <Box w="full" pl={{ base: 0, md: 9 }} mt={2}>
                          <VStack spacing={3} align="stretch">
                            <FormControl isInvalid={showErrors && !!phoneError}>
                              <FormLabel fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                                Phone Number
                              </FormLabel>
                              <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                  handlePhoneChange(e);
                                  if (showErrors) validatePhone();
                                }}
                                placeholder="(555) 555-5555"
                                size={{ base: "md", md: "lg" }}
                                height={{ base: "40px", md: "48px" }}
                                borderRadius="lg"
                                bg="white"
                                border="2px solid"
                                borderColor="accent.green.200"
                                _focus={{
                                  borderColor: 'accent.green.400',
                                  boxShadow: '0 0 0 3px rgba(138, 171, 109, 0.1)',
                                }}
                                _hover={{ borderColor: 'accent.green.300' }}
                                maxLength={14}
                                w="full"
                                maxW="100%"
                              />
                              <FormErrorMessage fontSize="xs" mt={1}>{phoneError}</FormErrorMessage>
                            </FormControl>
                            
                            <FormControl isInvalid={showErrors && !phoneCarrier}>
                              <FormLabel fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                                Phone Carrier
                              </FormLabel>
                              <Select
                                id="phoneCarrier"
                                value={phoneCarrier}
                                onChange={(e) => setPhoneCarrier(e.target.value)}
                                placeholder="Choose your carrier"
                                size={{ base: "md", md: "lg" }}
                                height={{ base: "40px", md: "48px" }}
                                borderRadius="lg"
                                bg="white"
                                border="2px solid"
                                borderColor="accent.green.200"
                                _focus={{
                                  borderColor: 'accent.green.400',
                                  boxShadow: '0 0 0 3px rgba(138, 171, 109, 0.1)',
                                }}
                                _hover={{ borderColor: 'accent.green.300' }}
                                w="full"
                                maxW="100%"
                              >
                              {phoneCarriers.map((carrier) => (
                                <option key={carrier.value} value={carrier.value}>
                                  {carrier.label}
                                </option>
                              ))}
                            </Select>
                            {showErrors && !phoneCarrier && (
                              <FormErrorMessage fontSize="xs">Please select your phone carrier</FormErrorMessage>
                            )}
                            <FormHelperText fontSize="xs" color="gray.500">
                              Required for SMS notifications
                            </FormHelperText>
                          </FormControl>
                        </VStack>
                      </Box>
                    )}
                    </VStack>
                  </Box>
                </Box>
              </RadioGroup>
            </VStack>
          </Box>

          {/* Important Notice - Moved to bottom for better flow */}
          <Box
            bg="accent.orange.100"
            border="2px solid"
            borderColor="accent.orange.200"
            borderRadius="xl"
            p={6}
            mb={6}
            position="relative"
            maxW={{ base: "100%", md: "800px" }}
            mx="auto"
          >
            <Box position="absolute" top={3} right={3} fontSize="xl">⚠️</Box>
            <VStack spacing={4} align="center">
              <Text fontWeight="600" fontSize="lg" color="accent.orange.500" textAlign="center">
                Important Information
              </Text>
              <VStack spacing={3} align="center" fontSize="sm" color="gray.700">
                <Text textAlign="center">• We are experiencing high volume - please arrive on time</Text>
                <Text textAlign="center">• If you need to reschedule, call <strong>250-763-7161</strong></Text>
                <Text textAlign="center">• Questions? Email us at <strong>info@cofoodbank.com</strong></Text>
              </VStack>
            </VStack>
          </Box>

          {/* Action Buttons */}
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
              onClick={handleSubmit}
              width={{ base: "100%", md: "320px" }}
              height={{ base: "48px", md: "52px" }}
              fontSize={{ base: "md", md: "md" }}
            >
              {t('common.continue')}
            </PrimaryButton>
          </Stack>
        </Box>
      </VStack>


    </PageLayout>
  );
};

export default AppointmentDetails;
