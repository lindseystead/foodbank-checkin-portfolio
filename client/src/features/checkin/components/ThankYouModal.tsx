/**
 * @fileoverview Thank you modal for confirmation page.
 */

import React from 'react';
import {
  Box,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { FiThumbsUp } from 'react-icons/fi';
import PrimaryButton from '../../../shared/components/buttons/PrimaryButton';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose, onDone }) => {
  return (
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
          <PrimaryButton onClick={onDone} size="md">
            Close
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ThankYouModal;
