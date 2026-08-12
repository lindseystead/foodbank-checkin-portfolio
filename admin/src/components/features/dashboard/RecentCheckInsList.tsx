/**
 * @fileoverview Recent check-ins list component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component displays a real-time list of recent client check-ins
 * with status updates, appointment details, and management actions.
 * It provides live data updates and filtering capabilities.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../DashboardPage.tsx} Dashboard page
 */

import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  VStack,
  HStack,
  Flex,
  Text,
  Badge,
  Avatar,
  Button,
  Box,
  Divider,
  Skeleton,
  SkeletonCircle,
  Tooltip,
} from '@chakra-ui/react';
import { FiUsers, FiMoreHorizontal, FiEye, FiCalendar } from 'react-icons/fi';
import PrintTicketButton from '../../ui/PrintTicketButton';
import { formatDistanceToNow } from 'date-fns';
import { formatToVancouverTimeOnly } from '../../../utils/timeFormatter'; 
import { CheckInRecord } from '../../../types/checkIn';
import { formatPhoneNumber } from '../../../utils/phoneFormatter';
import AppointmentRebookModal from '../appointments/AppointmentRebookModal';
import { getStatusColorScheme } from '../../../utils/statusColors';


interface RecentCheckInsListProps {
  checkIns: CheckInRecord[];
  isLoading?: boolean;
  onRefresh?: () => void; // Callback to refresh data after updates
}

const RecentCheckInsList: React.FC<RecentCheckInsListProps> = ({ 
  checkIns = [], 
  isLoading = false,
  onRefresh
}) => {
  const [selectedClient, setSelectedClient] = React.useState<any>(null);
  const [isRebookModalOpen, setIsRebookModalOpen] = React.useState(false);

  const formatPickUpTime = (pickUpTime?: string) => {
    if (!pickUpTime || !/^\d{2}:\d{2}$/.test(pickUpTime)) {
      return null;
    }
    const [hour24, minute] = pickUpTime.split(':').map(Number);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  // IMPORTANT: Use consistent status colors matching analytics chart
  // Use shared utility for consistency across all admin features
  const getStatusColor = (status: string, checkIn: CheckInRecord) => {
    // Use shared utility for consistent colors across admin panel
    return getStatusColorScheme(status, checkIn);
  };

  const getStatusText = (status: string, checkIn: CheckInRecord) => {
    // Check if appointment is late or missed
    if (status === 'Pending' && checkIn.appointmentTime) {
      const appointmentTime = new Date(checkIn.appointmentTime);
      const now = new Date();
      const hoursPast = (now.getTime() - appointmentTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursPast >= 4) {
        return 'Missed';
      } else if (hoursPast >= 1) {
        const hours = Math.floor(hoursPast);
        const minutes = Math.floor((hoursPast - hours) * 60);
        if (minutes > 0) {
          return `Late by ${hours}h ${minutes}m`;
        } else {
          return `Late by ${hours}h`;
        }
      }
    }
    
    switch (status) {
      case 'Collected':
        return 'Completed';
      case 'Shipped':
        return 'In Transit';
      case 'Pending':
        return 'Pending';
      case 'Not Collected':
        return 'Not Collected';
      case 'Rescheduled':
        return 'Rescheduled';
      case 'Cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <Card layerStyle="adminCard">
        <CardHeader pb={4}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <Box
                p={2}
                bg="brand.50"
                borderRadius="lg"
                color="brand.500"
              >
                <FiUsers size="18px" />
              </Box>
              <VStack align="start" spacing={0}>
                <Skeleton height="20px" width="120px" />
                <Skeleton height="16px" width="80px" mt={1} />
              </VStack>
            </HStack>
            <Skeleton height="32px" width="80px" />
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            {[1, 2, 3, 4, 5].map((i) => (
              <HStack key={i} spacing={4}>
                <SkeletonCircle size="40px" />
                <VStack align="start" spacing={1} flex={1}>
                  <Skeleton height="16px" width="150px" />
                  <Skeleton height="14px" width="100px" />
                </VStack>
                <Skeleton height="20px" width="60px" />
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
    <Card layerStyle="adminCard" w="full" maxW="100%" overflow="hidden">
      <CardHeader pb={4} w="full" maxW="100%">
        <Flex 
          direction={{ base: "column", sm: "row" }}
          justify="space-between" 
          align={{ base: "start", sm: "center" }}
          gap={3}
          w="full"
          maxW="100%"
        >
          <HStack spacing={3} minW={0} flex={1}>
            <Box
              p={2}
              bg="brand.50"
              borderRadius="lg"
              color="brand.500"
              flexShrink={0}
            >
              <FiUsers size="18px" />
            </Box>
            <VStack align="start" spacing={0} minW={0} flex={1}>
              <Text 
                fontSize={{ base: "md", sm: "lg" }} 
                fontWeight="600" 
                color="gray.900"
                noOfLines={1}
              >
                Recent Check-ins
              </Text>
              <Text 
                fontSize={{ base: "xs", sm: "sm" }} 
                color="gray.500"
                noOfLines={1}
              >
                Latest client arrivals
              </Text>
            </VStack>
          </HStack>
          
          <Button 
            size={{ base: "xs", sm: "sm" }}
            variant="outline" 
            colorScheme="brand"
            rightIcon={<FiEye />}
            flexShrink={0}
            w={{ base: "full", sm: "auto" }}
          >
            View All
          </Button>
        </Flex>
      </CardHeader>
      
      <CardBody pt={0} w="full" maxW="100%" overflow="hidden">
        {checkIns.length === 0 ? (
          <VStack spacing={4} py={8} textAlign="center">
            <Box
              p={4}
              bg="gray.50"
              borderRadius="full"
              color="gray.400"
            >
              <FiUsers size="32px" />
            </Box>
            <VStack spacing={1}>
              <Text fontSize="md" fontWeight="500" color="gray.600">
                No client check-ins were found
              </Text>
              <Text fontSize="sm" color="gray.500">
                Please upload a CSV file to get started
              </Text>
            </VStack>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch" w="full" maxW="100%">
            {checkIns.slice(0, 5).map((checkIn, index) => (
              <Box key={checkIn.id} w="full" maxW="100%" overflow="hidden">
                <Flex 
                  direction={{ base: "column", sm: "row" }}
                  align={{ base: "start", sm: "center" }}
                  gap={{ base: 3, sm: 4 }}
                  w="full"
                  maxW="100%"
                >
                  <Avatar
                    name={checkIn.clientName}
                    size={{ base: "sm", sm: "md" }}
                    bg="brand.500"
                    color="white"
                    flexShrink={0}
                  />
                  
                  <VStack align="start" spacing={1} flex={1} minW={0} w={{ base: "full", sm: "auto" }}>
                    <Flex 
                      direction={{ base: "column", sm: "row" }}
                      align={{ base: "start", sm: "center" }}
                      gap={2}
                      wrap="wrap"
                      w="full"
                    >
                      <Text 
                        fontSize={{ base: "sm", sm: "md" }} 
                        fontWeight="500" 
                        color="gray.900"
                        noOfLines={1}
                        minW={0}
                      >
                        {checkIn.clientName}
                      </Text>
                      <HStack spacing={2} flexShrink={0}>
                        {(checkIn as any).hasMobilityIssues && (
                          <Tooltip label="Mobility Assistance Required" placement="top">
                            <Box color="orange.500" cursor="help" fontSize="16px">
                              ♿
                            </Box>
                          </Tooltip>
                        )}
                        <Badge
                          colorScheme="blue"
                          variant="subtle"
                          fontSize="xs"
                          borderRadius="full"
                          whiteSpace="nowrap"
                        >
                          {checkIn.source}
                        </Badge>
                      </HStack>
                    </Flex>
                    
                    <Flex 
                      direction={{ base: "column", sm: "row" }}
                      gap={{ base: 1, sm: 4 }}
                      wrap="wrap"
                      w="full"
                    >
                      <Text 
                        fontSize={{ base: "xs", sm: "sm" }} 
                        color="gray.500"
                        noOfLines={1}
                        minW={0}
                      >
                        {(() => {
                          if (checkIn.checkInTime) {
                            return formatDistanceToNow(new Date(checkIn.checkInTime), { addSuffix: true });
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
                      
                      {checkIn.phoneNumber && (
                        <Text 
                          fontSize={{ base: "xs", sm: "sm" }} 
                          color="gray.500"
                          whiteSpace="nowrap"
                        >
                          {formatPhoneNumber(checkIn.phoneNumber)}
                        </Text>
                      )}
                    </Flex>
                  </VStack>
                  
                  <VStack 
                    spacing={2} 
                    align={{ base: "start", sm: "end" }}
                    flexShrink={0}
                    w={{ base: "full", sm: "auto" }}
                  >
                    <Badge
                      colorScheme={getStatusColor(checkIn.status, checkIn)}
                      variant="solid"
                      fontSize="xs"
                      borderRadius="full"
                      whiteSpace="nowrap"
                    >
                      {getStatusText(checkIn.status, checkIn)}
                    </Badge>
                    
                    <HStack spacing={1} flexWrap="wrap">
                      <PrintTicketButton checkInId={(checkIn as any).id} />
                      
                      <Tooltip label="Edit Next Appointment Date" placement="top">
                        <Button
                          size="xs"
                          variant="ghost"
                          color="gray.500"
                          _hover={{ color: 'blue.500', bg: 'blue.50' }}
                          onClick={() => {
                            setSelectedClient(checkIn);
                            setIsRebookModalOpen(true);
                          }}
                        >
                          <FiCalendar size="14px" />
                        </Button>
                      </Tooltip>
                      
                      <Tooltip label="More Actions" placement="top">
                        <Button
                          size="xs"
                          variant="ghost"
                          color="gray.500"
                          _hover={{ color: 'gray.700', bg: 'gray.100' }}
                        >
                          <FiMoreHorizontal size="14px" />
                        </Button>
                      </Tooltip>
                    </HStack>
                  </VStack>
                </Flex>
                
                {index < checkIns.slice(0, 5).length - 1 && (
                  <Divider mt={4} />
                )}
              </Box>
            ))}
          </VStack>
        )}
      </CardBody>
    </Card>

    {/* Rebook Modal */}
    {selectedClient && (
      <AppointmentRebookModal
        isOpen={isRebookModalOpen}
        onClose={() => {
          setIsRebookModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onUpdated={() => {
          // IMPORTANT: Refresh data after appointment update
          // This ensures the updated appointment appears throughout the app
          if (onRefresh) {
            onRefresh();
          }
        }}
      />
    )}
  </>
  );
};

export default RecentCheckInsList;
