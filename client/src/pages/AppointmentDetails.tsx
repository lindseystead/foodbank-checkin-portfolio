/**
 * @fileoverview Appointment details page for Foodbank Check-In and Appointment System client application
 * 
 * This page displays appointment information and allows clients to confirm their
 * next appointment. It shows appointment details, system features, and provides
 * a streamlined confirmation process.
 * 
 * Features:
 * - Auto-schedules the next appointment 21 days from today
 * - Displays the appointment date clearly
 * - Shows system features and benefits
 * - Includes important notices about arrival and policies
 * - Responsive Chakra UI layout with modern design
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../Confirmation.tsx} Confirmation page
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  VStack,
  Box,
  Text,
  Heading,
  Stack,
  HStack,
  Icon,
  Divider,
  Badge,
  SimpleGrid,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiInfo, 
  FiShield,
  FiZap,
  FiGlobe,
  FiUsers,
  FiEdit3
} from "react-icons/fi";
import PrimaryButton from "../components/buttons/PrimaryButton";
import AssistanceButton from "../components/buttons/AssistanceButton";
import PageLayout from '../components/layout/PageLayout';
import ProgressSteps from '../components/layout/ProgressSteps';
import PageHeader from '../components/ui/PageHeader';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';


const AppointmentDetails: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen: isRescheduleOpen, onOpen: onRescheduleOpen, onClose: onRescheduleClose } = useDisclosure();

  const { t } = useTranslation();
 
  const [nextAppointment, setNextAppointment] = useState<{
    date: string;
    time: string;
    formattedDate: string;
  } | null>(null);
  
  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('10:00');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [checkInId, setCheckInId] = useState<string | null>(null);
  
  // Valid time slots
  const validTimes = [
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45'
  ];

  /**
   * Get next appointment for client
   * 
   * IMPORTANT: Uses checkInId endpoint for efficiency and reliability.
   * This ensures we get the latest appointment data, including any admin changes.
   * Falls back to session storage if API call fails.
   */
  const fetchNextAppointment = async (checkInId: string) => {
    try {
      // Use checkInId endpoint - more efficient and always gets latest data
      // This ensures admin changes are reflected immediately
      const response = await api(`/checkin/${checkInId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const checkInRecord = data.data;
        
        // Use nextAppointmentISO (preferred) or nextAppointmentDate (fallback)
        const appointmentDate = checkInRecord.nextAppointmentISO 
          ? checkInRecord.nextAppointmentISO 
          : checkInRecord.nextAppointmentDate;
        
        if (appointmentDate) {
          const nextDate = new Date(appointmentDate);
          
          // Convert to 12-hour format
          const formatTime = (timeStr: string): string => {
            if (!timeStr) return '10:00 AM';
            
            const [hours, minutes] = timeStr.split(':');
            const hour24 = parseInt(hours);
            const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
            const ampm = hour24 >= 12 ? 'PM' : 'AM';
            
            return `${hour12}:${minutes} ${ampm}`;
          };
          
          setNextAppointment({
            date: checkInRecord.nextAppointmentDate || appointmentDate,
            time: formatTime(checkInRecord.nextAppointmentTime || '10:00'),
            formattedDate: nextDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          });
          return;
        }
      }
      
      // Fallback: Try session storage if API doesn't have appointment yet
      const checkInData = window.sessionStorage.getItem('checkInInfo');
      if (checkInData) {
        try {
          const parsed = JSON.parse(checkInData);
          if (parsed.nextAppointmentDate) {
            const nextDate = new Date(parsed.nextAppointmentDate);
            const formatTime = (timeStr: string): string => {
              if (!timeStr) return '10:00 AM';
              const [hours, minutes] = timeStr.split(':');
              const hour24 = parseInt(hours);
              const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
              const ampm = hour24 >= 12 ? 'PM' : 'AM';
              return `${hour12}:${minutes} ${ampm}`;
            };
            
            setNextAppointment({
              date: parsed.nextAppointmentDate,
              time: formatTime(parsed.nextAppointmentTime || '10:00'),
              formattedDate: nextDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            });
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    } catch (error) {
      console.error('Failed to fetch next appointment:', error);
      
      // Fallback: Try session storage
      const checkInData = window.sessionStorage.getItem('checkInInfo');
      if (checkInData) {
        try {
          const parsed = JSON.parse(checkInData);
          if (parsed.nextAppointmentDate) {
            const nextDate = new Date(parsed.nextAppointmentDate);
            const formatTime = (timeStr: string): string => {
              if (!timeStr) return '10:00 AM';
              const [hours, minutes] = timeStr.split(':');
              const hour24 = parseInt(hours);
              const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
              const ampm = hour24 >= 12 ? 'PM' : 'AM';
              return `${hour12}:${minutes} ${ampm}`;
            };
            
            setNextAppointment({
              date: parsed.nextAppointmentDate,
              time: formatTime(parsed.nextAppointmentTime || '10:00'),
              formattedDate: nextDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            });
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  };

  // Load appointment data on mount and poll for updates
  // IMPORTANT: Uses checkInId for reliable, efficient fetching
  // This ensures we always get the latest appointment (including admin changes)
  // Polls every 30 seconds to catch admin updates during check-in process
  React.useEffect(() => {
    let checkInIdForPolling: string | null = null;
    
    const fetchData = async () => {
      if (typeof window !== 'undefined') {
        const checkInData = window.sessionStorage.getItem('checkInInfo');
        if (checkInData) {
          try {
            const parsed = JSON.parse(checkInData);
            
            // Store checkInId for rescheduling and polling
            if (parsed.checkInId) {
              setCheckInId(parsed.checkInId);
              checkInIdForPolling = parsed.checkInId;
            }
            
            // Use checkInId for reliable fetching (preferred)
            // Falls back to clientId if checkInId not available
            if (parsed.checkInId) {
              await fetchNextAppointment(parsed.checkInId);
            } else if (parsed.clientId) {
              // Fallback: Try to get from session storage first
              if (parsed.nextAppointmentDate) {
                const nextDate = new Date(parsed.nextAppointmentDate);
                const formatTime = (timeStr: string): string => {
                  if (!timeStr) return '10:00 AM';
                  const [hours, minutes] = timeStr.split(':');
                  const hour24 = parseInt(hours);
                  const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
                  const ampm = hour24 >= 12 ? 'PM' : 'AM';
                  return `${hour12}:${minutes} ${ampm}`;
                };
                
                setNextAppointment({
                  date: parsed.nextAppointmentDate,
                  time: formatTime(parsed.nextAppointmentTime || '10:00'),
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
            console.error('Error parsing checkInData:', error);
          }
        }
      }
    };
    
    // Initial fetch
    fetchData();
    
    // Polling setup with Page Visibility API for real-time updates
    // IMPORTANT: This ensures admin changes to appointments are reflected immediately
    // Polls every 30 seconds when tab is visible to catch admin updates
    let interval: NodeJS.Timeout | null = null;
    let isVisible = !document.hidden;
    
    const startPolling = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        // Only poll if tab is visible and we have a checkInId
        if (!document.hidden && checkInIdForPolling) {
          fetchNextAppointment(checkInIdForPolling);
        }
      }, 30000); // Poll every 30 seconds
    };
    
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        // Tab became visible - fetch immediately and start polling
        if (checkInIdForPolling) {
          fetchNextAppointment(checkInIdForPolling);
        }
        startPolling();
      } else {
        // Tab hidden - stop polling
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };
    
    // Wait a bit for checkInId to be set, then start polling
    const timeoutId = setTimeout(() => {
      if (checkInIdForPolling && isVisible) {
        startPolling();
      }
    }, 1000);
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearTimeout(timeoutId);
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array - only run once on mount
  
  // Handle reschedule appointment
  const handleReschedule = async () => {
    if (!checkInId || !rescheduleDate) {
      toast({
        title: 'Error',
        description: 'Please select a date and time for your appointment.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsRescheduling(true);
    
    try {
      const response = await api(`/checkin/${checkInId}/reschedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDate: rescheduleDate, newTime: rescheduleTime }),
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Update local state
        const newDate = new Date(data.data.nextAppointmentISO);
        const formatTime = (timeStr: string): string => {
          if (!timeStr) return '10:00 AM';
          const [hours, minutes] = timeStr.split(':');
          const hour24 = parseInt(hours);
          const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
          const ampm = hour24 >= 12 ? 'PM' : 'AM';
          return `${hour12}:${minutes} ${ampm}`;
        };
        
        setNextAppointment({
          date: data.data.nextAppointmentDate,
          time: formatTime(data.data.nextAppointmentTime || '10:00'),
          formattedDate: newDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        });
        
        // Update sessionStorage
        const checkInData = window.sessionStorage.getItem('checkInInfo');
        if (checkInData) {
          try {
            const parsed = JSON.parse(checkInData);
            parsed.nextAppointmentDate = data.data.nextAppointmentDate;
            parsed.nextAppointmentTime = data.data.nextAppointmentTime;
            parsed.nextAppointmentISO = data.data.nextAppointmentISO;
            window.sessionStorage.setItem('checkInInfo', JSON.stringify(parsed));
          } catch (e) {
            console.error('Error updating sessionStorage:', e);
          }
        }
        
        toast({
          title: 'Appointment Rescheduled',
          description: 'Your appointment has been successfully rescheduled.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        onRescheduleClose();
        setRescheduleDate('');
        setRescheduleTime('10:00');
      } else {
        throw new Error(data.error || 'Failed to reschedule appointment');
      }
    } catch (error: any) {
      console.error('Reschedule error:', error);
      toast({
        title: 'Reschedule Failed',
        description: error.message || 'Failed to reschedule appointment. Please try again.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsRescheduling(false);
    }
  };
  
  // Calculate minimum date (21 days from today)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 21);
    return minDate.toISOString().split('T')[0];
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
    };
    sessionStorage.setItem("appointmentData", JSON.stringify(appointmentData));
    navigate("/confirmation");
  };

  return (
    <PageLayout showBackButton isScrollable>
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
        spacing={{ base: 4, md: 6 }} 
        width="full" 
        maxW={{ base: "100%", md: "1000px" }} 
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 6 }}
        pt={{ base: "100px", md: "70px" }}
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
            mb={4}
          />

          {/* Next Appointment Information - Enhanced Design */}
          <Box 
            bg="linear-gradient(135deg, #8CAB6D 0%, #7A9A5B 100%)"
            borderRadius="2xl" 
            p={{ base: 6, md: 8 }}
            mb={8}
            border="2px solid"
            borderColor="green.300"
            w="full"
            maxW="700px"
            mx="auto"
            boxShadow="lg"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none'
            }}
          >
            <VStack spacing={4} align="center" position="relative" zIndex={1}>
              <HStack spacing={2} align="center">
                <Icon as={FiCheckCircle} boxSize={6} color="white" />
                <Text fontSize="sm" fontWeight="600" color="white" textTransform="uppercase" letterSpacing="wide">
                  Appointment Confirmed
                </Text>
              </HStack>
              
              <Box
                bg="white"
                borderRadius="xl"
                p={{ base: 4, md: 6 }}
                w="full"
                boxShadow="md"
              >
                <VStack spacing={3} align="center">
                  <HStack spacing={2} align="center" color="green.600">
                    <Icon as={FiCalendar} boxSize={5} />
                    <Text fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                      Your Next Appointment
                    </Text>
                  </HStack>
                  
                  <Text 
                    fontSize={{ base: "xl", md: "2xl" }} 
                    fontWeight="700" 
                    color="gray.800"
                    textAlign="center"
                    lineHeight="1.2"
                    px={2}
                    wordBreak="break-word"
                  >
                    {nextAppointment ? nextAppointment.formattedDate : 'Loading appointment...'}
                  </Text>
                  
                  <HStack spacing={2} align="center" color="green.600" mt={2}>
                    <Icon as={FiClock} boxSize={4} />
                    <Text 
                      fontSize={{ base: "lg", md: "xl" }} 
                      fontWeight="600" 
                      color="green.600"
                      textAlign="center"
                    >
                      {nextAppointment ? nextAppointment.time : ''}
                    </Text>
                  </HStack>
                  
                  <Badge 
                    colorScheme="green" 
                    variant="subtle" 
                    fontSize="xs" 
                    px={3} 
                    py={1} 
                    borderRadius="full"
                    mt={2}
                  >
                    ✓ Auto-Scheduled
                  </Badge>
                </VStack>
              </Box>
              
              <Text 
                fontSize="sm" 
                color="white"
                textAlign="center"
                px={2}
                opacity={0.95}
                maxW="500px"
              >
                Your next appointment has been automatically scheduled. Please arrive on time for your visit.
              </Text>
              
              {/* Reschedule Button */}
              <Button
                leftIcon={<Icon as={FiEdit3} />}
                onClick={onRescheduleOpen}
                colorScheme="whiteAlpha"
                variant="outline"
                size="sm"
                mt={2}
                borderColor="white"
                color="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              >
                Reschedule Appointment
              </Button>
            </VStack>
          </Box>

          {/* System Features - Proof of Concept Showcase */}
          <Box mb={8} maxW={{ base: "100%", md: "900px" }} mx="auto">
            <VStack spacing={6} align="stretch">
              <Box textAlign="center" mb={4}>
                <Heading size="md" color="gray.800" mb={2}>
                  ✨ What to Expect
                </Heading>
                <Text fontSize="md" color="gray.600" maxW="600px" mx="auto">
                  Our digital check-in system makes your visit quick and easy
                </Text>
              </Box>
              
              <SimpleGrid 
                columns={{ base: 1, sm: 2 }} 
                spacing={{ base: 4, md: 6 }}
                w="full"
              >
                {/* Fast Check-In Feature */}
                <Box
                  bg="blue.50"
                  border="2px solid"
                  borderColor="blue.200"
                  borderRadius="xl"
                  p={{ base: 5, md: 6 }}
                  transition="all 0.3s ease"
                  _hover={{ 
                    transform: "translateY(-4px)",
                    boxShadow: "lg",
                    borderColor: "blue.300"
                  }}
                  position="relative"
                  overflow="hidden"
                >
                  <VStack spacing={3} align="start">
                    <HStack spacing={3} align="center">
                      <Box
                        bg="blue.500"
                        borderRadius="lg"
                        p={3}
                        boxShadow="md"
                      >
                        <Icon as={FiZap} boxSize={6} color="white" />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="lg" fontWeight="700" color="blue.700">
                          Fast Check-In
                        </Text>
                        <Text fontSize="xs" color="blue.600">
                          Under 5 minutes
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                      Complete your check-in quickly with our streamlined digital process. No more waiting in long lines.
                    </Text>
                  </VStack>
                </Box>

                {/* Multilingual Support Feature */}
                <Box
                  bg="purple.50"
                  border="2px solid"
                  borderColor="purple.200"
                  borderRadius="xl"
                  p={{ base: 5, md: 6 }}
                  transition="all 0.3s ease"
                  _hover={{ 
                    transform: "translateY(-4px)",
                    boxShadow: "lg",
                    borderColor: "purple.300"
                  }}
                  position="relative"
                  overflow="hidden"
                >
                  <VStack spacing={3} align="start">
                    <HStack spacing={3} align="center">
                      <Box
                        bg="purple.500"
                        borderRadius="lg"
                        p={3}
                        boxShadow="md"
                      >
                        <Icon as={FiGlobe} boxSize={6} color="white" />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="lg" fontWeight="700" color="purple.700">
                          Multilingual
                        </Text>
                        <Text fontSize="xs" color="purple.600">
                          7 languages available
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                      Use the system in your preferred language. We support English, French, Spanish, Chinese, Hindi, Arabic, and Punjabi.
                    </Text>
                  </VStack>
                </Box>

                {/* Privacy & Security Feature */}
                <Box
                  bg="green.50"
                  border="2px solid"
                  borderColor="green.200"
                  borderRadius="xl"
                  p={{ base: 5, md: 6 }}
                  transition="all 0.3s ease"
                  _hover={{ 
                    transform: "translateY(-4px)",
                    boxShadow: "lg",
                    borderColor: "green.300"
                  }}
                  position="relative"
                  overflow="hidden"
                >
                  <VStack spacing={3} align="start">
                    <HStack spacing={3} align="center">
                      <Box
                        bg="green.500"
                        borderRadius="lg"
                        p={3}
                        boxShadow="md"
                      >
                        <Icon as={FiShield} boxSize={6} color="white" />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="lg" fontWeight="700" color="green.700">
                          Privacy First
                        </Text>
                        <Text fontSize="xs" color="green.600">
                          Your data is protected
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                      All check-in data is automatically deleted after 24 hours. Your privacy is our priority.
                    </Text>
                  </VStack>
                </Box>

                {/* Accessible Design Feature */}
                <Box
                  bg="orange.50"
                  border="2px solid"
                  borderColor="orange.200"
                  borderRadius="xl"
                  p={{ base: 5, md: 6 }}
                  transition="all 0.3s ease"
                  _hover={{ 
                    transform: "translateY(-4px)",
                    boxShadow: "lg",
                    borderColor: "orange.300"
                  }}
                  position="relative"
                  overflow="hidden"
                >
                  <VStack spacing={3} align="start">
                    <HStack spacing={3} align="center">
                      <Box
                        bg="orange.500"
                        borderRadius="lg"
                        p={3}
                        boxShadow="md"
                      >
                        <Icon as={FiUsers} boxSize={6} color="white" />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="lg" fontWeight="700" color="orange.700">
                          Accessible
                        </Text>
                        <Text fontSize="xs" color="orange.600">
                          For everyone
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                      Designed with accessibility in mind. Works with screen readers, keyboard navigation, and large touch targets.
                    </Text>
                  </VStack>
                </Box>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Important Information - Enhanced */}
          <Box
            bg="gradient-to-br"
            bgGradient="linear(to-br, orange.50, yellow.50)"
            border="2px solid"
            borderColor="orange.200"
            borderRadius="2xl"
            p={{ base: 6, md: 8 }}
            mb={8}
            position="relative"
            maxW={{ base: "100%", md: "800px" }}
            mx="auto"
            boxShadow="md"
          >
            <VStack spacing={5} align="center">
              <HStack spacing={3} align="center" color="orange.600">
                <Icon as={FiInfo} boxSize={6} />
                <Text fontWeight="700" fontSize="xl" color="orange.700" textAlign="center">
                  Important Information
                </Text>
              </HStack>
              
              <Divider borderColor="orange.200" />
              
              <VStack spacing={4} align="stretch" w="full" maxW="600px">
                <HStack spacing={3} align="start">
                  <Box
                    bg="orange.100"
                    borderRadius="full"
                    p={2}
                    mt={1}
                    flexShrink={0}
                  >
                    <Text fontSize="sm">⏰</Text>
                  </Box>
                  <Box flex={1}>
                    <Text fontWeight="600" fontSize="sm" color="gray.800" mb={1}>
                      Arrival Time
                    </Text>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                      Please arrive on time for your scheduled appointment. We experience high volume and appreciate your punctuality.
                    </Text>
                  </Box>
                </HStack>
                
                <HStack spacing={3} align="start">
                  <Box
                    bg="orange.100"
                    borderRadius="full"
                    p={2}
                    mt={1}
                    flexShrink={0}
                  >
                    <Text fontSize="sm">📞</Text>
                  </Box>
                  <Box flex={1}>
                    <Text fontWeight="600" fontSize="sm" color="gray.800" mb={1}>
                      Need to Reschedule?
                    </Text>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                      If you need to change your appointment time, please contact us in advance. We're here to help.
                    </Text>
                  </Box>
                </HStack>
                
                <HStack spacing={3} align="start">
                  <Box
                    bg="orange.100"
                    borderRadius="full"
                    p={2}
                    mt={1}
                    flexShrink={0}
                  >
                    <Text fontSize="sm">✅</Text>
                  </Box>
                  <Box flex={1}>
                    <Text fontWeight="600" fontSize="sm" color="gray.800" mb={1}>
                      What to Bring
                    </Text>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                      Please bring a valid ID and be ready to provide your appointment confirmation when you arrive.
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Check-In Summary Card */}
          <Box
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={{ base: 5, md: 6 }}
            mb={6}
            maxW={{ base: "100%", md: "700px" }}
            mx="auto"
          >
            <VStack spacing={4} align="stretch">
              <HStack spacing={2} align="center" color="gray.700">
                <Icon as={FiCheckCircle} boxSize={5} color="green.500" />
                <Text fontWeight="600" fontSize="md" color="gray.800">
                  Check-In Summary
                </Text>
              </HStack>
              
              <Divider borderColor="gray.300" />
              
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Box>
                  <Text fontSize="xs" color="gray.600" mb={1} textTransform="uppercase" letterSpacing="wide">
                    Current Visit
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.800">
                    ✓ Check-in Complete
                  </Text>
                </Box>
                
                <Box>
                  <Text fontSize="xs" color="gray.600" mb={1} textTransform="uppercase" letterSpacing="wide">
                    Next Appointment
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.800">
                    {nextAppointment ? `${nextAppointment.formattedDate} at ${nextAppointment.time}` : 'Loading...'}
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Action Buttons */}
          <Stack
            spacing={{ base: 4, md: 4 }}
            direction={{ base: "column", md: "row" }}
            width="full"
            pt={{ base: 2, md: 4 }}
            justify="center"
            align="center"
            mt={{ base: 2, md: 4 }}
            maxW={{ base: "100%", md: "700px" }}
            mx="auto"
          >
            <AssistanceButton 
              width={{ base: "100%", md: "240px" }}
              height={{ base: "48px", md: "48px" }}
              fontSize="md"
            />
            <PrimaryButton
              onClick={handleSubmit}
              width={{ base: "100%", md: "240px" }}
              height={{ base: "48px", md: "48px" }}
              fontSize="md"
            >
              {t('common.continue')}
            </PrimaryButton>
          </Stack>
        </Box>
      </VStack>
      
      {/* Reschedule Modal */}
      <Modal isOpen={isRescheduleOpen} onClose={onRescheduleClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reschedule Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Please select a new date and time for your appointment. Appointments must be at least 21 days from today and available Monday through Friday.
              </Text>
              
              <FormControl isRequired>
                <FormLabel>New Appointment Date</FormLabel>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={getMinDate()}
                  size="lg"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>New Appointment Time</FormLabel>
                <Select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  size="lg"
                >
                  {validTimes.map((time) => {
                    const [hours, minutes] = time.split(':');
                    const hour24 = parseInt(hours);
                    const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
                    const ampm = hour24 >= 12 ? 'PM' : 'AM';
                    const displayTime = `${hour12}:${minutes} ${ampm}`;
                    return (
                      <option key={time} value={time}>
                        {displayTime}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              
              {rescheduleDate && (
                <Box
                  bg="blue.50"
                  border="1px solid"
                  borderColor="blue.200"
                  borderRadius="md"
                  p={3}
                >
                  <Text fontSize="sm" color="blue.700">
                    <strong>New Appointment:</strong> {new Date(rescheduleDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {(() => {
                      const [hours, minutes] = rescheduleTime.split(':');
                      const hour24 = parseInt(hours);
                      const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
                      const ampm = hour24 >= 12 ? 'PM' : 'AM';
                      return `${hour12}:${minutes} ${ampm}`;
                    })()}
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRescheduleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleReschedule}
              isLoading={isRescheduling}
              loadingText="Rescheduling..."
            >
              Confirm Reschedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
};

export default AppointmentDetails;
