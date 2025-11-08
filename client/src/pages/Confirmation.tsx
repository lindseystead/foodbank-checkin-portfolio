/**
 * @fileoverview Confirmation page component for Foodbank Check-In and Appointment System client application
 * 
 * This component handles the final step of the check-in process, displaying confirmation
 * details and completing the check-in transaction. It processes all collected data
 * including special requests and appointment details, then submits the complete
 * check-in information to the backend API.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../lib/checkInService.ts} Check-in service for API communication
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  Box,
  Text,
  HStack,
  Heading,
  Icon,
  Fade,
  ScaleFade,
  Circle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Stack
} from '@chakra-ui/react';
import { FiCheck, FiCalendar, FiCheckCircle, FiThumbsUp } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';
import ProgressSteps from '../components/layout/ProgressSteps';
import PageHeader from '../components/ui/PageHeader';
import AssistanceButton from '../components/buttons/AssistanceButton';
import FinishButton from '../components/buttons/FinishButton';
import { useTranslation } from 'react-i18next';
import { CheckInService, CompleteCheckInData } from '../lib/checkInService';
import { api } from '../lib/api';
import PrimaryButton from '../components/buttons/PrimaryButton';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nextAppointment, setNextAppointment] = useState<{
    date: string;
    time: string;
    formattedDate: string;
  } | null>(null);

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

  // Complete the check-in process when component mounts
  React.useEffect(() => {
    const completeCheckIn = async () => {
      try {
        // Get all data from session storage
        const checkInInfo = JSON.parse(sessionStorage.getItem('checkInInfo') || '{}');
        const specialRequestsData = JSON.parse(sessionStorage.getItem('specialRequestsData') || '{}');
        const appointmentData = JSON.parse(sessionStorage.getItem('appointmentData') || '{}');

        // Validate required data
        if (!checkInInfo.checkInId || !checkInInfo.clientId) {
          console.error('Missing required check-in data:', checkInInfo);
          return;
        }

        // Prepare complete check-in data
        const completeData: CompleteCheckInData = {
          checkInId: checkInInfo.checkInId,
          clientId: checkInInfo.clientId,
          clientName: checkInInfo.clientName || 'Unknown Client',
          phoneNumber: checkInInfo.phoneNumber || '',
          checkInTime: new Date().toISOString(),
          appointmentTime: checkInInfo.appointmentTime || null,
          completionTime: new Date().toISOString(),
          status: 'Collected',
          
          // Special requests data
          dietaryRestrictions: specialRequestsData.dietaryRestrictions || [],
          allergies: specialRequestsData.allergies || '',
          unwantedFoods: specialRequestsData.unwantedFoods || '',
          additionalInfo: specialRequestsData.additionalInfo || '',
          householdInfoChanged: specialRequestsData.householdInfoChanged || false,
          hasMobilityIssues: specialRequestsData.hasMobilityIssues || false,
          diaperSize: specialRequestsData.diaperSize || '',
          
          // Appointment details
          notificationPreference: appointmentData.notificationPreference || 'email',
          email: appointmentData.email || '',
          phone: appointmentData.phone || '',
          phoneCarrier: appointmentData.phoneCarrier || '',
          
          // Next appointment data is auto-generated by the backend
          
          // Location and type
          location: 'Foodbank Check-In and Appointment System',
          clientType: 'returning'
        };

        // Send complete check-in data to backend
        const result = await CheckInService.completeCheckIn(completeData);

        if (result.success) {
          // Update session storage with next appointment from response (if available)
          if (result.data?.nextAppointmentDate) {
            const updatedCheckInInfo = {
              ...checkInInfo,
              nextAppointmentDate: result.data.nextAppointmentDate,
              nextAppointmentTime: result.data.nextAppointmentTime,
              nextAppointmentISO: result.data.nextAppointmentISO,
              ticketNumber: result.data.ticketNumber,
              isAutoGenerated: result.data.isAutoGenerated
            };
            sessionStorage.setItem('checkInInfo', JSON.stringify(updatedCheckInInfo));
          }
          
          // Fetch next appointment data using checkInId (ensures latest data including admin changes)
          // Falls back to session storage if API call fails
          if (checkInInfo.checkInId) {
            await fetchNextAppointment(checkInInfo.checkInId);
          } else if (checkInInfo.nextAppointmentDate) {
            // Fallback: Use session storage data
            const nextDate = new Date(checkInInfo.nextAppointmentDate);
            const formatTime = (timeStr: string): string => {
              if (!timeStr) return '10:00 AM';
              const [hours, minutes] = timeStr.split(':');
              const hour24 = parseInt(hours);
              const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
              const ampm = hour24 >= 12 ? 'PM' : 'AM';
              return `${hour12}:${minutes} ${ampm}`;
            };
            
            setNextAppointment({
              date: checkInInfo.nextAppointmentDate,
              time: formatTime(checkInInfo.nextAppointmentTime || '10:00'),
              formattedDate: nextDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            });
          }
        } else {
          console.error('Failed to complete check-in:', result.error);
        }
      } catch (error) {
        console.error('Error completing check-in:', error);
      }
    };

    // Complete the check-in process
    completeCheckIn();
  }, []);

  // Add useEffect for auto-close
  React.useEffect(() => {
    let timer: number;
    if (isOpen) {
      timer = window.setTimeout(() => {
        onClose();
        navigate('/');
      }, 10000); // 10 seconds
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, onClose, navigate]);


  // Get check-in data
  const checkInData = React.useMemo(() => {
    try {
      const data = JSON.parse(sessionStorage.getItem('checkInInfo') || '{}');
      return {
        ...data,
        lastName: data.clientName?.split(' ').pop() || 'Guest',
      };
    } catch (error) {
      return { lastName: 'Guest' };
    }
  }, []);

  // Get special requests data
  const specialRequestsData = React.useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('specialRequestsData') || '{}');
    } catch (error) {
      return {};
    }
  }, []);

  // Get appointment details for display
  const appointmentDetails = React.useMemo(() => {
    const checkInInfo = JSON.parse(sessionStorage.getItem('checkInInfo') || '{}');
    const appointment = checkInInfo.appointment;
    const client = checkInInfo.client;
    
    // Use the correct next appointment data from backend instead of session storage
    const nextAppointmentFormatted = nextAppointment?.formattedDate || "Loading...";
    const nextAppointmentTime = nextAppointment?.time || "10:00 AM";
    
    return {
      sortOd: checkInInfo.clientId || "1234",
      orderTypeOdd: "Regular",
      clientName: checkInData.lastName || "Guest",
      rebookMonth: nextAppointmentFormatted.split(' ')[1] || "October",
      rebookDay: nextAppointmentFormatted.split(' ')[2]?.replace(',', '') || "15",
      rebookDayName: nextAppointmentFormatted.split(' ')[0] || "Friday",
      rebookTime: nextAppointmentTime,
      householdSize: appointment?.householdSize || 4,
      orderTypeEven: "Regular",
      milk: 2,
      eggs: 1,
      snackPacks: 2,
      dietaryRequirements: client?.dietary || "None",
      allergiesList: specialRequestsData.allergies || "None",
      unwantedFoods: specialRequestsData.unwantedFoods || "None",
      childrenUncategorized: "5, 7, 12",
      childrenMale: "5, 7",
      infantAge: "N/A",
      requests: specialRequestsData.additionalInfo || "",
      manualNotes: "",
      dietaryRestrictions: specialRequestsData.dietaryRestrictions || ["None"],
      householdInfoChanged: specialRequestsData.householdInfoChanged || false,
      hasMobilityIssues: specialRequestsData.hasMobilityIssues || false,
      additionalInfo: specialRequestsData.additionalInfo || "",
      provisions: appointment?.provisions || "Standard provisions"
    };
  }, [checkInData, nextAppointment, specialRequestsData]);
  // Dietary preference translation mapping
  const dietaryKeyMap: Record<string, string> = {
    'vegetarian': 'vegetarian',
    'vegan': 'vegan',
    'glutenFree': 'glutenFree',
    'dairyFree': 'dairyFree',
    'halal': 'halal',
    'kosher': 'kosher',
  };

  return (
    <PageLayout showBackButton={false} isScrollable>
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
          currentStep={4}
          totalSteps={4}
          labels={[
            'Initial Check-in',
            'Special Requests',
            'Appointment Details',
            'Confirmation'
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
          maxW={{ base: "100%", md: "900px" }}
          mx="auto"
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          p={{ base: 4, md: 6 }}
          overflow="visible"
        >
          {/* Page Header */}
          <PageHeader
            title="Check-in Complete!"
            subTitle="Your check-in is complete and your next appointment has been scheduled. Please contact us if you need to reschedule."
            logoSize="sm"
            mb={4}
          />

          {/* Success Icon */}
          <ScaleFade in={true} initialScale={0.9}>
            <VStack spacing={4} align="center" mb={6}>
              <Circle
                size={{ base: "50px", md: "60px" }}
                bg="accent.green.50"
                color="accent.green.400"
                transition="all 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
                boxShadow="md"
                border="2px solid"
                borderColor="accent.green.200"
              >
                <Icon as={FiCheckCircle} boxSize={{ base: "25px", md: "30px" }} />
              </Circle>
            </VStack>
          </ScaleFade>

          {/* Appointment Summary - Compact */}
          <Fade in={true} delay={0.2}>
            <Box 
              bg="brand.50"
              borderRadius="lg" 
              p={{ base: 3, md: 4 }}
              mb={8}
              border="1px solid"
              borderColor="client.primary"
              w="full"
              maxW={{ base: "100%", md: "400px" }}
              mx="auto"
              boxShadow="sm"
            >
              <VStack spacing={3} align="center">
                <HStack spacing={2} align="center" justify="center">
                  <Box
                    bg="client.primary"
                    borderRadius="full"
                    p={1.5}
                    boxShadow="sm"
                  >
                    <Icon as={FiCalendar} color="white" boxSize={4} />
                  </Box>
                  <Text 
                    fontSize={{ base: "sm", md: "md" }} 
                    fontWeight="700" 
                    color="client.primary"
                    textTransform="uppercase"
                    letterSpacing="wide"
                    textAlign="center"
                  >
                    Your Next Appointment
                  </Text>
                </HStack>
                
                <Box
                  bg="white"
                  borderRadius="lg"
                  p={{ base: 2, md: 3 }}
                  border="1px solid"
                  borderColor="client.primary"
                  boxShadow="sm"
                  w="full"
                  maxW="350px"
                >
                  <Text 
                    fontSize={{ base: "md", md: "lg" }} 
                    fontWeight="700" 
                    color="client.primary"
                    textAlign="center"
                    lineHeight="1.2"
                    px={1}
                    wordBreak="break-word"
                  >
                    {nextAppointment ? nextAppointment.formattedDate : 'Loading...'}
                  </Text>
                  <Text 
                    fontSize={{ base: "sm", md: "md" }} 
                    fontWeight="600" 
                    color="brand.700"
                    textAlign="center"
                    px={1}
                  >
                    at {nextAppointment ? nextAppointment.time : 'Loading...'}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Fade>


          {/* Your Preferences Summary */}
          <Fade in={true} delay={0.4}>
            <Box mb={4} w="full">
              <VStack spacing={3} align="stretch">
                <Box textAlign="center">
                  <Heading 
                    as="h2"
                    fontSize={{ base: "md", md: "lg" }}
                    color="client.primary" 
                    fontWeight="bold"
                    mb={1}
                  >
                    📋 Special Requests Summary
                  </Heading>
                  <Text fontSize="xs" color="gray.600">
                    Here's what we've recorded for your visit
                  </Text>
                </Box>

                <Box 
                  display="grid" 
                  gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={{ base: 3, md: 4 }}
                  w="full"
                  maxW="100%"
                >
                  {/* Dietary Preferences */}
                  <Box
                    bg="white"
                    border="2px solid"
                    borderColor="accent.green.200"
                    borderRadius="xl"
                    p={{ base: 3, md: 4 }}
                    _hover={{ borderColor: "accent.green.300", transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                    w="full"
                    overflow="hidden"
                  >
                    <VStack spacing={3} align="start">
                      <HStack spacing={3}>
                        <Text fontSize="lg">🥗</Text>
                        <Text fontWeight="600" color="accent.green.500" fontSize="md">
                          Dietary Preferences
                        </Text>
                      </HStack>
                      
                      {appointmentDetails.dietaryRestrictions?.length > 0 ? (
                        <VStack spacing={2} align="stretch" w="full">
                          {appointmentDetails.dietaryRestrictions.map((restriction: any) => (
                            <HStack 
                              key={restriction} 
                              spacing={3} 
                              bg="accent.green.50" 
                              p={3} 
                              borderRadius="lg"
                              _hover={{ bg: 'accent.green.100' }}
                              transition="all 0.2s"
                            >
                              <Icon as={FiCheck} color="accent.green.400" boxSize={4} />
                              <Text color="accent.green.600" fontSize="sm">
                                {t(`specialRequests.${dietaryKeyMap[restriction] || restriction.toLowerCase()}`)}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      ) : (
                        <Text color="gray.500" fontSize="sm" fontStyle="italic">
                          No dietary preferences specified
                        </Text>
                      )}
                    </VStack>
                  </Box>

                  {/* Special Requests */}
                  <Box
                    bg="white"
                    border="2px solid"
                    borderColor="accent.purple.200"
                    borderRadius="xl"
                    p={{ base: 3, md: 4 }}
                    _hover={{ borderColor: "accent.purple.300", transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                    w="full"
                    overflow="hidden"
                  >
                    <VStack spacing={3} align="start">
                      <HStack spacing={3}>
                        <Text fontSize="lg">♿</Text>
                        <Text fontWeight="600" color="accent.purple.500" fontSize="md">
                          Special Requests
                        </Text>
                      </HStack>
                      
                      <VStack spacing={3} align="stretch" w="full">
                        <HStack 
                          spacing={3} 
                          bg="accent.purple.50" 
                          p={3} 
                          borderRadius="lg"
                        >
                          <Icon as={FiCheck} color="accent.purple.400" boxSize={4} />
                          <Text color="accent.purple.600" fontSize="sm">
                            {appointmentDetails.hasMobilityIssues 
                              ? "Mobility assistance requested"
                              : "No mobility assistance needed"}
                          </Text>
                        </HStack>
                        
                        {(specialRequestsData.allergies || specialRequestsData.unwantedFoods) && (
                          <HStack 
                            spacing={3} 
                            bg="accent.purple.50" 
                            p={3} 
                            borderRadius="lg"
                          >
                            <Icon as={FiCheck} color="accent.purple.400" boxSize={4} />
                            <Text color="accent.purple.600" fontSize="sm">
                              Food restrictions noted
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </VStack>
                  </Box>
                </Box>

                {/* Additional Information */}
                {(specialRequestsData.additionalInfo || specialRequestsData.allergies || specialRequestsData.unwantedFoods) && (
                  <Box
                    bg="white"
                    border="2px solid"
                    borderColor="brand.200"
                    borderRadius="xl"
                    p={{ base: 3, md: 4 }}
                    _hover={{ borderColor: "brand.300", transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                    w="full"
                    overflow="hidden"
                  >
                    <VStack spacing={3} align="start">
                      <HStack spacing={3}>
                        <Text fontSize="lg">📝</Text>
                        <Text fontWeight="600" color="client.primary" fontSize="md">
                          Additional Information
                        </Text>
                      </HStack>
                      
                      <VStack spacing={3} align="stretch" w="full">
                        {specialRequestsData.allergies && (
                          <Box>
                            <Text fontSize="sm" fontWeight="500" color="gray.600" mb={1}>
                              Allergies & Food Restrictions:
                            </Text>
                            <Text color="gray.700" fontSize="sm" bg="gray.50" p={3} borderRadius="lg">
                              {specialRequestsData.allergies}
                            </Text>
                          </Box>
                        )}
                        
                        {specialRequestsData.additionalInfo && (
                          <Box>
                            <Text fontSize="sm" fontWeight="500" color="gray.600" mb={1}>
                              Additional Notes:
                            </Text>
                            <Text color="gray.700" fontSize="sm" bg="gray.50" p={3} borderRadius="lg">
                              {specialRequestsData.additionalInfo}
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Box>
          </Fade>

          {/* Action Buttons */}
          <Fade in={true} delay={0.6}>
            <VStack spacing={4} width="full">
              {/* Important Information */}
              <Box
                bg="accent.orange.100"
                border="2px solid"
                borderColor="accent.orange.200"
                borderRadius="lg"
                p={{ base: 3, md: 4 }}
                position="relative"
                w="full"
              >
                <Box position="absolute" top={3} right={3} fontSize="xl">⚠️</Box>
                <VStack spacing={3} align="center">
                  <Text fontWeight="600" fontSize="md" color="accent.orange.500" textAlign="center">
                    Important Information
                  </Text>
                  <VStack spacing={2} align="center" fontSize="sm" color="gray.700">
                    <HStack spacing={3} align="center" justify="center">
                      <Text fontSize="lg">🚗</Text>
                      <Text textAlign="center" flex="1">Please arrive at your assigned time. Due to high demand, early arrivals may be asked to return.</Text>
                    </HStack>
                    <HStack spacing={3} align="center" justify="center">
                      <Text fontSize="lg">📞</Text>
                      <Text textAlign="center" flex="1">Running late? Need to change your appointment? Please give us a call and we are happy to help.</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
              
              {/* Action Buttons */}
              <Stack 
                spacing={{ base: 4, md: 4 }}
                direction={{ base: "column", md: "row" }}
                width="full"
                maxW="100%"
                justify="center"
                align="center"
                pt={4}
              >
                <AssistanceButton 
                  width={{ base: "100%", md: "240px" }}
                  height={{ base: "48px", md: "48px" }}
                  fontSize="md"
                />
                <FinishButton
                  onClick={onOpen}
                  width={{ base: "100%", md: "240px" }}
                  height={{ base: "48px", md: "48px" }}
                  fontSize="md"
                  rightIcon={<FiCheck />}
                  borderRadius="lg"
                >
                  {t('common.done')}
                </FinishButton>
              </Stack>
            </VStack>
          </Fade>
        </Box>
      </VStack>
      
      {/* Thank You Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" boxShadow="2xl" p={6}>
          <ModalCloseButton />
          <ModalHeader textAlign="center" fontWeight="bold" fontSize="2xl" color="client.primary" pb={2}>
            Thank You!
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="center">
              <Box bg="brand.100" borderRadius="full" p={4} mb={2} boxShadow="md">
                <Icon as={FiThumbsUp} color="client.primary" boxSize={14} />
              </Box>
              <Box fontSize="lg" color="gray.700" fontWeight="semibold" textAlign="center">
                Check-in Complete
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <PrimaryButton onClick={() => { onClose(); navigate('/'); }} size="md">
              Close
            </PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
};

export default Confirmation;