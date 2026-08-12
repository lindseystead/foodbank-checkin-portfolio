/**
 * @fileoverview Check-ins list and empty/error states
 */

import React from 'react';
import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { FiClock, FiEye, FiMail, FiPhone, FiUsers, FiX } from 'react-icons/fi';
import PrintTicketButton from '../../ui/PrintTicketButton';
import { formatDistanceToNow } from 'date-fns';
import { CheckInRecord } from '../../../types/checkIn';
import { formatToVancouverTimeOnly } from '../../../utils/timeFormatter';
import { formatPhoneNumber } from '../../../utils/phoneFormatter';
import { getStatusColorHex } from '../../../utils/statusColors';
import { getStatusText } from './checkInUtils';

interface CheckInsListProps {
  checkIns: CheckInRecord[];
  error: string | null;
  searchTerm: string;
  onViewDetails: (checkIn: CheckInRecord) => void;
  onPrintTicket: (checkIn: CheckInRecord) => void;
  onCancelAppointment: (checkIn: CheckInRecord) => void;
}

const CheckInsList: React.FC<CheckInsListProps> = ({
  checkIns,
  error,
  searchTerm,
  onViewDetails,
  onPrintTicket,
  onCancelAppointment,
}) => {
  const formatPickUpTime = (pickUpTime?: string) => {
    if (!pickUpTime || !/^\d{2}:\d{2}$/.test(pickUpTime)) {
      return null;
    }
    const [hour24, minute] = pickUpTime.split(':').map(Number);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <Box mt={4}>
      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold" mb={2}>
              {error}
            </Text>
          </Box>
        </Alert>
      )}

      <Box w="full" maxW="100%" mx="auto">
        {checkIns.length === 0 ? (
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            p={8}
          >
            <Center py={8}>
              <VStack spacing={4}>
                <Box p={4} bg="gray.50" borderRadius="full" color="gray.400">
                  <FiUsers size="32px" />
                </Box>
                <VStack spacing={1}>
                  <Text fontSize="md" fontWeight="500" color="gray.600">
                    No check-ins found
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {searchTerm ? 'Try adjusting your search' : 'Upload a CSV file to get started'}
                  </Text>
                </VStack>
              </VStack>
            </Center>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {checkIns.map((checkIn) => (
              <Box
                key={checkIn.id}
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.200"
                p={{ base: 3, sm: 4, md: 5 }}
                w="full"
                maxW="100%"
                _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
                transition="all 0.2s"
              >
                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  gap={4}
                  align={{ base: 'stretch', sm: 'start' }}
                >
                  <HStack spacing={3} align="start">
                    <Avatar name={checkIn.clientName} size="md" bg="brand.500" color="white" />
                    <VStack align="start" spacing={2} flex={1} minW={0}>
                      <HStack spacing={3} wrap="wrap">
                        <HStack spacing={2} align="center">
                          <Box
                            px={2}
                            py={1}
                            borderRadius="sm"
                            fontSize="xs"
                            fontWeight="600"
                            color="white"
                            bg={getStatusColorHex(checkIn.status, checkIn)}
                          >
                            {getStatusText(checkIn.status, checkIn)}
                          </Box>
                          <Text fontSize="lg" fontWeight="600" color="gray.900">
                            {checkIn.clientName}
                          </Text>
                        </HStack>
                        <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                          ID: {checkIn.clientId}
                        </Badge>
                        {checkIn.hasMobilityIssues && (
                          <Tooltip label="Mobility Assistance Required" placement="top">
                            <Box color="accent.orange.300" cursor="help" fontSize="16px">
                              ♿
                            </Box>
                          </Tooltip>
                        )}
                      </HStack>

                      <HStack spacing={4} wrap="wrap">
                        <HStack spacing={1}>
                          <Icon as={FiClock} boxSize={3.5} color="admin.muted" />
                          <Text fontSize="sm" color="gray.600">
                            {(() => {
                              if (checkIn.checkInTime) {
                                return `Checked in ${formatDistanceToNow(new Date(checkIn.checkInTime), {
                                  addSuffix: true,
                                })}`;
                              }
                              const pickUpDisplay = formatPickUpTime(checkIn.pickUpTime);
                              if (pickUpDisplay) {
                                return `Appointment: ${pickUpDisplay}`;
                              }
                              return checkIn.appointmentTime
                                ? `Appointment: ${formatToVancouverTimeOnly(checkIn.appointmentTime)}`
                                : 'No time available';
                            })()}
                          </Text>
                        </HStack>

                        {checkIn.phoneNumber && (
                          <HStack spacing={1}>
                            <Icon as={FiPhone} boxSize={3.5} color="admin.muted" />
                            <Text fontSize="sm" color="gray.600">
                              {formatPhoneNumber(checkIn.phoneNumber)}
                            </Text>
                          </HStack>
                        )}

                        {checkIn.email && (
                          <HStack spacing={1}>
                            <Icon as={FiMail} boxSize={3.5} color="admin.muted" />
                            <Text fontSize="sm" color="gray.600">
                              {checkIn.email}
                            </Text>
                          </HStack>
                        )}
                      </HStack>

                      <HStack spacing={4} wrap="wrap" fontSize="sm" color="gray.500">
                        {checkIn.householdSize && (
                          <Text>Household: {checkIn.householdSize} people</Text>
                        )}
                        {checkIn.dietaryConsiderations && (
                          <Text>Dietary: {checkIn.dietaryConsiderations}</Text>
                        )}
                        {checkIn.location && <Text>Location: {checkIn.location}</Text>}
                        {checkIn.program && <Text>Program: {checkIn.program}</Text>}
                      </HStack>
                    </VStack>
                  </HStack>

                  <HStack
                    spacing={1}
                    justify={{ base: 'flex-end', sm: 'flex-end' }}
                    alignSelf={{ base: 'stretch', sm: 'flex-start' }}
                  >
                    <Tooltip label="View Details" placement="top">
                      <IconButton
                        size={{ base: 'md', sm: 'sm' }}
                        minW="44px"
                        minH="44px"
                        variant="ghost"
                        color="gray.500"
                        _hover={{ color: 'blue.500', bg: 'blue.50' }}
                        onClick={() => onViewDetails(checkIn)}
                        icon={<FiEye size="16px" />}
                        aria-label="View Details"
                      />
                    </Tooltip>

                    <PrintTicketButton onClick={() => onPrintTicket(checkIn)} />

                    {checkIn.status === 'Pending' && (
                      <Tooltip label="Cancel Appointment" placement="top">
                        <IconButton
                          size={{ base: 'md', sm: 'sm' }}
                          minW="44px"
                          minH="44px"
                          variant="ghost"
                          color="gray.500"
                          _hover={{ color: 'red.500', bg: 'red.50' }}
                          onClick={() => onCancelAppointment(checkIn)}
                          icon={<FiX size="16px" />}
                          aria-label="Cancel Appointment"
                        />
                      </Tooltip>
                    )}
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default CheckInsList;
