/**
 * @fileoverview Client edit modal component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides a modal interface for editing client information,
 * including personal details, household information, and appointment data.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../ClientDetailPage.tsx} Client detail page
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Alert,
  AlertIcon,
  useToast,
  Divider,
  Badge,
  Box,
  SimpleGrid,
  Tag,
  TagLabel,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { api } from '../../../lib/api';

interface ClientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  onSave: (updatedClient: any) => void;
}

const ClientEditModal: React.FC<ClientEditModalProps> = ({
  isOpen,
  onClose,
  client,
  onSave
}) => {
  const [formData, setFormData] = useState<any>({});
  // const [loading, setLoading] = useState(false); // Removed unused variable
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [tempData, setTempData] = useState<any>(null);
  const toast = useToast();

  useEffect(() => {
    if (client) {
      setFormData({
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        phoneNumber: client.phoneNumber || '',
        email: client.email || '',
        dietaryConsiderations: client.dietaryConsiderations || '',
        adults: client.adults || 0,
        seniors: client.seniors || 0,
        children: client.children || 0,
        childrensAges: client.childrensAges || '',
        itemsProvided: client.itemsProvided || '',
        notes: client.notes || ''
      });
      setHasChanges(false);
      loadTempData();
    }
  }, [client]);

  const loadTempData = async () => {
    if (!client?.clientId) return;
    
    try {
      const response = await api(`/admin/clients/${client.clientId}/temp-data`);
      if (response.ok) {
        const result = await response.json();
        setTempData(result.tempData);
        
        if (result.tempData) {
          // Apply temp data to form
          setFormData((prev: any) => ({
            ...prev,
            ...result.tempData
          }));
          setHasChanges(true);
        }
      }
    } catch (err) {
      console.error('Failed to load temp data:', err);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!client?.clientId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await api(`/admin/clients/${client.clientId}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const result = await response.json();
        onSave(result.client);
        toast({
          title: 'Changes Saved',
          description: 'Client information has been updated successfully. Changes are saved temporarily until you confirm them permanently.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        setHasChanges(false);
        loadTempData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save changes');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error saving client:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = async () => {
    if (!client?.clientId) return;
    
    try {
      const response = await api(`/admin/clients/${client.clientId}/temp-data`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTempData(null);
        setHasChanges(false);
        setFormData({
          firstName: client.firstName || '',
          lastName: client.lastName || '',
          phoneNumber: client.phoneNumber || '',
          email: client.email || '',
          dietaryConsiderations: client.dietaryConsiderations || '',
          adults: client.adults || 0,
          seniors: client.seniors || 0,
          children: client.children || 0,
          childrensAges: client.childrensAges || '',
          itemsProvided: client.itemsProvided || '',
          notes: client.notes || ''
        });
        toast({
          title: 'Changes Discarded',
          description: 'All temporary changes have been discarded. The client information has been restored to the original values.',
          status: 'info',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error discarding changes:', err);
    }
  };

  const handlePermanentSave = async () => {
    if (!client?.clientId) return;
    
    setSaving(true);
    
    try {
      const response = await api(`/admin/clients/${client.clientId}/save`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Changes Saved Permanently',
          description: result.message || 'Client information has been saved permanently to the system.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        setHasChanges(false);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save permanently');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error saving permanently:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!client) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "xl" }} isCentered>
      <ModalOverlay />
      <ModalContent maxH="95vh" maxW={{ base: "100vw", md: "90vw" }} overflowY="auto" mx={{ base: 0, md: 4 }}>
        <ModalHeader>
          <HStack>
            <Text>Edit Client: {client.firstName} {client.lastName}</Text>
            {hasChanges && (
              <Badge colorScheme="orange" variant="subtle">
                Unsaved Changes
              </Badge>
            )}
            {tempData && (
              <Badge colorScheme="blue" variant="subtle">
                Temp Memory
              </Badge>
            )}
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {/* Basic Information */}
            <Box>
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" mb={4}>Basic Information</Text>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>First Name</FormLabel>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                    size={{ base: "sm", md: "md" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>Last Name</FormLabel>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last name"
                    size={{ base: "sm", md: "md" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>Phone Number</FormLabel>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Phone number"
                    size={{ base: "sm", md: "md" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>Email</FormLabel>
                  <Input
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email address"
                    size={{ base: "sm", md: "md" }}
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Household Information */}
            <Box>
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" mb={4}>Household Information</Text>
              <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>Adults</FormLabel>
                  <NumberInput
                    value={formData.adults}
                    onChange={(value) => handleInputChange('adults', parseInt(value) || 0)}
                    min={0}
                    size={{ base: "sm", md: "md" }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>Seniors</FormLabel>
                  <NumberInput
                    value={formData.seniors}
                    onChange={(value) => handleInputChange('seniors', parseInt(value) || 0)}
                    min={0}
                    size={{ base: "sm", md: "md" }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>Children</FormLabel>
                  <NumberInput
                    value={formData.children}
                    onChange={(value) => handleInputChange('children', parseInt(value) || 0)}
                    min={0}
                    size={{ base: "sm", md: "md" }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
              <FormControl mt={4}>
                <FormLabel fontSize={{ base: "sm", md: "md" }}>Children's Ages</FormLabel>
                <Input
                  value={formData.childrensAges}
                  onChange={(e) => handleInputChange('childrensAges', e.target.value)}
                  placeholder="e.g., 5, 8, 12"
                  size={{ base: "sm", md: "md" }}
                />
              </FormControl>
            </Box>

            <Divider />

            {/* Dietary and Special Information */}
            <Box>
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" mb={4}>Dietary & Special Information</Text>
              <FormControl>
                <FormLabel fontSize={{ base: "sm", md: "md" }}>Dietary Considerations</FormLabel>
                <Textarea
                  value={formData.dietaryConsiderations}
                  onChange={(e) => handleInputChange('dietaryConsiderations', e.target.value)}
                  placeholder="Any dietary preferences or considerations"
                  rows={3}
                  size={{ base: "sm", md: "md" }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel fontSize={{ base: "sm", md: "md" }}>Items Provided</FormLabel>
                <Textarea
                  value={formData.itemsProvided}
                  onChange={(e) => handleInputChange('itemsProvided', e.target.value)}
                  placeholder="Items provided to this client"
                  rows={2}
                  size={{ base: "sm", md: "md" }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel fontSize={{ base: "sm", md: "md" }}>Notes</FormLabel>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes about this client"
                  rows={3}
                  size={{ base: "sm", md: "md" }}
                />
              </FormControl>
            </Box>

            {/* Current Dietary Display */}
            {formData.dietaryConsiderations && formData.dietaryConsiderations !== 'None' && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Current Dietary Tags:</Text>
                <Wrap>
                  {formData.dietaryConsiderations.split(',').map((item: string, index: number) => (
                    <WrapItem key={index}>
                      <Tag colorScheme="orange" size="sm">
                        <TagLabel>{item.trim()}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2} wrap="wrap" width="100%" justify={{ base: "center", md: "flex-end" }}>
            <Button variant="outline" onClick={onClose} size={{ base: "sm", md: "md" }}>
              Cancel
            </Button>
            {hasChanges && (
              <Button colorScheme="red" variant="outline" onClick={handleDiscard} size={{ base: "sm", md: "md" }}>
                Discard Changes
              </Button>
            )}
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={saving}
              loadingText="Saving..."
              isDisabled={!hasChanges}
              size={{ base: "sm", md: "md" }}
            >
              Save to Temp Memory
            </Button>
            {tempData && (
              <Button
                colorScheme="green"
                onClick={handlePermanentSave}
                isLoading={saving}
                loadingText="Saving..."
                size={{ base: "sm", md: "md" }}
              >
                Save Permanently
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ClientEditModal;
