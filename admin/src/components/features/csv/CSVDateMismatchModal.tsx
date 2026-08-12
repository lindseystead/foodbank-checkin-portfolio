/**
 * @fileoverview Date mismatch warning modal for CSV uploads
 *
 * Displays a warning when the uploaded CSV has dates that don't match
 * today's date, explaining the implications and allowing the user to
 * proceed or cancel.
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
  ModalFooter,
  ModalCloseButton,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  Text,
  Box,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import { useTenantTime } from '../../../utils/useTenantTime';

interface CSVDateMismatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warningMessage: string | null;
  isUploading: boolean;
}

const CSVDateMismatchModal: React.FC<CSVDateMismatchModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  warningMessage,
  isUploading,
}) => {
  const { tz } = useTenantTime();
  const tenantToday = new Date().toLocaleDateString('en-CA', { timeZone: tz });
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Icon as={FiAlertCircle} color="orange.500" boxSize={6} />
            Date Mismatch Warning
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <AlertTitle>Incorrect Date in CSV File</AlertTitle>
              <AlertDescription fontSize="sm">
                {warningMessage}
              </AlertDescription>
            </VStack>
          </Alert>

          <VStack spacing={4} align="stretch">
            <Text fontWeight="bold" color="orange.600">
              What this means:
            </Text>
            <Box
              bg="orange.50"
              p={4}
              borderRadius="md"
              border="1px"
              borderColor="orange.200"
            >
              <VStack spacing={2} align="start">
                <Text fontSize="sm">
                  ❌ <strong>Client check-ins will NOT work</strong> - clients
                  won't be able to find their appointments
                </Text>
                <Text fontSize="sm">
                  ✅ <strong>Data will be stored</strong> - you can still view
                  it in the admin panel
                </Text>
                <Text fontSize="sm">
                  ⚠️ <strong>Recommended:</strong> Fix the CSV date to match
                  today ({tenantToday}) before
                  uploading
                </Text>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>
            Cancel Upload
          </Button>
          <Button
            colorScheme="orange"
            onClick={onConfirm}
            isLoading={isUploading}
          >
            Upload Anyway (Not Recommended)
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CSVDateMismatchModal;
