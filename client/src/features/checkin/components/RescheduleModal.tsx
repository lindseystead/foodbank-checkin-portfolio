/**
 * @fileoverview Reschedule modal for appointment details.
 */

import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  rescheduleDate: string;
  rescheduleTime: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  validTimes: string[];
  getMinDate: () => string;
  onConfirm: () => void;
  isSubmitting: boolean;
  /** IANA timezone for the tenant, e.g. "America/Vancouver". Controls display formatting. */
  tenantTz?: string;
}

/**
 * Safely format a 'YYYY-MM-DD' date-input value for display without an
 * off-by-one shift. Constructs the date at noon UTC so timezone conversion
 * never crosses a day boundary, then formats in the tenant timezone.
 */
const formatDateInputValue = (value: string, tenantTz: string): string => {
  const [year, month, day] = value.split('-').map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day, 12));
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: tenantTz,
  });
};

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  rescheduleDate,
  rescheduleTime,
  onDateChange,
  onTimeChange,
  validTimes,
  getMinDate,
  onConfirm,
  isSubmitting,
  tenantTz = 'America/Vancouver',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reschedule Appointment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Please select a new date and time for your appointment. Appointments must be at least 21 days from today
              and available Monday through Friday.
            </Text>

            <FormControl isRequired>
              <FormLabel>New Appointment Date</FormLabel>
              <Input
                type="date"
                value={rescheduleDate}
                onChange={(e) => onDateChange(e.target.value)}
                min={getMinDate()}
                size="md"
                
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="reschedule-time" id="reschedule-time-label">
                New Appointment Time
              </FormLabel>
              <Select
                id="reschedule-time"
                name="reschedule-time"
                value={rescheduleTime}
                onChange={(e) => onTimeChange(e.target.value)}
                size="md"
                
                aria-label="New appointment time"
                title="New appointment time"
                aria-labelledby="reschedule-time-label"
              >
                {validTimes.map((time) => {
                  const [hours, minutes] = time.split(':');
                  const hour24 = parseInt(hours, 10);
                  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
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
                  <strong>New Appointment:</strong>{' '}
                  {formatDateInputValue(rescheduleDate, tenantTz)}{' '}
                  at {(() => {
                    const [hours, minutes] = rescheduleTime.split(':');
                    const hour24 = parseInt(hours, 10);
                    const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
                    const ampm = hour24 >= 12 ? 'PM' : 'AM';
                    return `${hour12}:${minutes} ${ampm}`;
                  })()}
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter
          as={Stack}
          direction={{ base: 'column-reverse', sm: 'row' }}
          spacing={3}
          w="full"
          justify="flex-end"
        >
          <Button variant="ghost" size="md" w={{ base: 'full', sm: 'auto' }} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            size="md"
            w={{ base: 'full', sm: 'auto' }}
            onClick={onConfirm}
            isLoading={isSubmitting}
            loadingText="Rescheduling..."
          >
            Confirm Reschedule
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RescheduleModal;
