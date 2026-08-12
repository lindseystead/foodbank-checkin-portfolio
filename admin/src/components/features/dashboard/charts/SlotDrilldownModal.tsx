/**
 * @fileoverview Drill-down modal: shows the appointments in a clicked time slot.
 */

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
} from '@chakra-ui/react';
import { FiClock, FiUsers } from 'react-icons/fi';

export interface DrilldownAppointment {
  clientName?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  phoneNumber?: string;
  appointmentTime?: string;
  pickUpTime?: string;
}

interface SlotDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotLabel: string;
  appointments: DrilldownAppointment[];
}

const statusColor = (status?: string): string => {
  switch (status) {
    case 'Collected':
    case 'Shipped':
      return 'green';
    case 'Pending':
    case 'Rescheduled':
      return 'teal';
    case 'Not Collected':
    case 'Cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const SlotDrilldownModal: React.FC<SlotDrilldownModalProps> = ({
  isOpen,
  onClose,
  slotLabel,
  appointments,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl">
        <ModalHeader pb={2}>
          <VStack align="start" spacing={1}>
            <HStack spacing={2}>
              <Icon as={FiClock} color="brand.500" />
              <Text fontSize="lg" color="admin.primary" fontWeight="bold">
                {slotLabel}
              </Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={FiUsers} color="gray.500" boxSize={3} />
              <Text fontSize="sm" color="gray.500" fontWeight="500">
                {appointments.length} appointment{appointments.length === 1 ? '' : 's'} in this slot
              </Text>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {appointments.length === 0 ? (
            <Box textAlign="center" py={10} color="gray.500">
              <Text>No appointments scheduled in this slot.</Text>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Client</Th>
                    <Th>Status</Th>
                    <Th>Phone</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {appointments.map((a, idx) => {
                    const name =
                      a.clientName ||
                      [a.firstName, a.lastName].filter(Boolean).join(' ') ||
                      '—';
                    return (
                      <Tr key={idx}>
                        <Td fontWeight="500" color="admin.primary">{name}</Td>
                        <Td>
                          <Badge colorScheme={statusColor(a.status)} borderRadius="full" px={2}>
                            {a.status || 'Unknown'}
                          </Badge>
                        </Td>
                        <Td color="gray.600" fontSize="xs">{a.phoneNumber || '—'}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SlotDrilldownModal;
