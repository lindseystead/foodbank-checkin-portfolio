/**
 * @fileoverview Simplified appointment rebooking modal for Foodbank Check-In and Appointment System admin panel
 * 
 * This component allows admins to edit the next appointment date for clients.
 * It focuses solely on updating the appointment date that appears on printed tickets.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../DashboardPage.tsx} Dashboard page
 */

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Box
} from '@chakra-ui/react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { api } from '../../../lib/api';

interface AppointmentRebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  onUpdated?: () => void;
}

const AppointmentRebookModal: React.FC<AppointmentRebookModalProps> = ({
  isOpen,
  onClose,
  client,
  onUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const toast = useToast();

  const handleSubmit = async () => {
    if (!newDate) {
      toast({
        title: 'Date Required',
        description: 'Please select a new appointment date to reschedule.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    // Ensure future date/time
    try {
      const candidate = new Date(`${newDate}T${newTime || '10:00'}:00`);
      if (candidate.getTime() <= Date.now()) {
        toast({
          title: 'Invalid Date',
          description: 'The appointment date must be in the future. Please select a date after today.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
        return;
      }
    } catch {}

    setIsLoading(true);
    try {
      // IMPORTANT: Use checkInId (not clientId) to ensure we update the correct check-in record
      // This ensures the update appears on tickets and throughout the app
      const checkInId = client.id || client.checkInId;
      if (!checkInId) {
        toast({
          title: 'Error',
          description: 'Check-in ID is required to update appointment.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }
      
      const response = await api(`/admin/appointments/${checkInId}/update-next-date`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newDate, newTime }),
      });

      if (response.ok) {
        toast({
          title: 'Appointment Rescheduled',
          description: 'The client\'s next appointment has been successfully rescheduled.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        
        onUpdated?.();
        onClose();
        setNewDate('');
        setNewTime('10:00');
      } else {
        const error = await response.json();
        toast({
          title: 'Reschedule Failed',
          description: error.error || 'Unable to reschedule the appointment. Please verify the date and time, then try again.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please check your internet connection and try again.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with current next appointment date if available
  React.useEffect(() => {
    if (client?.nextAppointmentDate) {
      setNewDate(client.nextAppointmentDate);
    }
    if (client?.nextAppointmentTime) {
      setNewTime(client.nextAppointmentTime);
    }
  }, [client]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack spacing={3}>
            <FiCalendar />
            <Text>Edit Next Appointment Date</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Client Info */}
            <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
              <HStack spacing={2} mb={1}>
                <FiUser color="blue.500" />
                <Text fontWeight="semibold" color="blue.700" fontSize="sm">Client</Text>
              </HStack>
              <Text fontSize="sm" color="blue.600">
                {client.firstName || ''} {client.lastName || ''} (ID: {client.clientId})
              </Text>
            </Box>

            {/* Date & Time Inputs */}
            <FormControl isRequired>
              <FormLabel>Next Appointment Date</FormLabel>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Next Appointment Time</FormLabel>
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                step={300}
              />
            </FormControl>

            {/* Info */}
            <Alert status="info">
              <AlertIcon />
              <AlertDescription fontSize="sm">
                This updates the next appointment date and time shown on the printed ticket.
              </AlertDescription>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Updating..."
            >
              Update Date
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AppointmentRebookModal;
