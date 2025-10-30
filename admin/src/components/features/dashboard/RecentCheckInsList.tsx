/**
 * @fileoverview Recent check-ins list component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component displays a real-time list of recent client check-ins
 * with status updates, appointment details, and management actions.
 * It provides live data updates and filtering capabilities.
 * 
 * @author Lindsey D. Stead
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
import { FiUsers, FiMoreHorizontal, FiPrinter, FiEye, FiCalendar } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { formatToVancouverTimeOnly } from '../../../utils/timeFormatter'; 
import { CheckInRecord } from '../../../common/types/checkIn';
import { formatPhoneNumber } from '../../../common/utils/phoneFormatter';
import { getTicketUrl } from '../../../common/apiConfig';
import AppointmentRebookModal from '../appointments/AppointmentRebookModal';


interface RecentCheckInsListProps {
  checkIns: CheckInRecord[];
  isLoading?: boolean;
}

const RecentCheckInsList: React.FC<RecentCheckInsListProps> = ({ 
  checkIns = [], 
  isLoading = false 
}) => {
  const [selectedClient, setSelectedClient] = React.useState<any>(null);
  const [isRebookModalOpen, setIsRebookModalOpen] = React.useState(false);

  const getStatusColor = (status: string, checkIn: CheckInRecord) => {
    // Check if appointment is late or missed
    if (status === 'Pending' && checkIn.appointmentTime) {
      const appointmentTime = new Date(checkIn.appointmentTime);
      const now = new Date();
      const hoursPast = (now.getTime() - appointmentTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursPast >= 4) {
        return 'red'; // Missed - red
      } else if (hoursPast >= 1) {
        return 'orange'; // Late - orange
      }
    }
    
    switch (status) {
      case 'Collected':
        return 'green';
      case 'Shipped':
        return 'purple';
      case 'Pending':
        return 'yellow';
      case 'Not Collected':
        return 'red';
      case 'Rescheduled':
        return 'orange';
      case 'Cancelled':
        return 'gray';
      default:
        return 'gray';
    }
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
              <Text fontSize="lg" fontWeight="600" color="gray.900">
                Recent Check-ins
              </Text>
              <Text fontSize="sm" color="gray.500">
                Latest client arrivals
              </Text>
            </VStack>
          </HStack>
          
          <Button 
            size="sm" 
            variant="outline" 
            colorScheme="brand"
            rightIcon={<FiEye />}
          >
            View All
          </Button>
        </HStack>
      </CardHeader>
      
      <CardBody pt={0}>
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
          <VStack spacing={4} align="stretch">
            {checkIns.slice(0, 5).map((checkIn, index) => (
              <Box key={checkIn.id}>
                <HStack spacing={4} align="center">
                  <Avatar
                    name={checkIn.clientName}
                    size="md"
                    bg="brand.500"
                    color="white"
                  />
                  
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="500" color="gray.900">
                        {checkIn.clientName}
                      </Text>
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
                      >
                        {checkIn.source}
                      </Badge>
                    </HStack>
                    
                    <HStack spacing={4}>
                      <Text fontSize="sm" color="gray.500">
                        {checkIn.checkInTime ? formatDistanceToNow(new Date(checkIn.checkInTime), { addSuffix: true }) : 
                         checkIn.appointmentTime ? `Appointment: ${formatToVancouverTimeOnly(checkIn.appointmentTime)}` : 'No time available'}
                      </Text>
                      
                      {checkIn.phoneNumber && (
                        <Text fontSize="sm" color="gray.500">
                          {formatPhoneNumber(checkIn.phoneNumber)}
                        </Text>
                      )}
                    </HStack>
                  </VStack>
                  
                  <VStack spacing={2} align="end">
                    <Badge
                      colorScheme={getStatusColor(checkIn.status, checkIn)}
                      variant="solid"
                      fontSize="xs"
                      borderRadius="full"
                    >
                      {getStatusText(checkIn.status, checkIn)}
                    </Badge>
                    
                    <HStack spacing={1}>
                      <Tooltip label="Print Ticket" placement="top">
                        <Button
                          size="xs"
                          variant="ghost"
                          color="gray.500"
                          _hover={{ color: 'blue.500', bg: 'blue.50' }}
                          onClick={() => {
                            // Use the check-in record ID; backend expects /tickets/:checkInId
                            const id = (checkIn as any).id;
                            if (id) {
                              window.open(getTicketUrl(id), '_blank');
                            }
                          }}
                        >
                          <FiPrinter size="14px" />
                        </Button>
                      </Tooltip>
                      
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
                </HStack>
                
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
          // Refresh the data if needed
          window.location.reload();
        }}
      />
    )}
  </>
  );
};

export default RecentCheckInsList;
