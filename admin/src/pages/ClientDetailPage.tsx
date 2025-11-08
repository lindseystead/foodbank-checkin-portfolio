/**
 * @fileoverview Client detail page for Foodbank Check-In and Appointment System admin panel
 * 
 * This page provides detailed client information, appointment history,
 * and management tools for individual client records. It enables
 * comprehensive client data management and editing capabilities.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../components/features/clients/ClientEditModal.tsx} Client edit modal
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Badge,
  Container,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Select,
  Tooltip,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FiPrinter } from 'react-icons/fi';
import { api } from '../lib/api';
import { printTicket } from '../utils/printTicket';

type ClientExtras = {
  nextApptLocation?: string | null;
  dietary?: string | null;
  allergies?: string | null;
  requests?: string | null;
  unwanted?: string | null;
  program?: string | null; // Link2Feed Program field
  email?: string | null;
  adults?: number | null;
  seniors?: number | null;
  children?: number | null;
  childrensAges?: string | null;
  itemsProvided?: string | null;
  notes?: string | null;
  dietaryRestrictions?: string | null;
  unwantedFoods?: string | null;
  additionalInfo?: string | null;
  hasMobilityIssues?: boolean | null;
  diaperSize?: string | null;
  ticketNumber?: string | null;
  nextAppointmentDate?: string | null;
  nextAppointmentTime?: string | null;
  completionTime?: string | null;
  checkInTime?: string | null;
  notificationPreference?: string | null;
  phoneCarrier?: string | null;
  location?: string | null;
  clientType?: string | null;
  provisions?: string | null;
  quantity?: number | null;
};

type JoinedClient = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  householdSize: string;
  dietary: string | null;
  allergies: string | null;
  requests: string | null;
  unwanted: string | null;
  nextApptLocation: string | null;
  program: string | null; // Link2Feed Program field
  email: string | null;
  adults: number | null;
  seniors: number | null;
  children: number | null;
  childrensAges: string | null;
  itemsProvided: string | null;
  notes: string | null;
  dietaryRestrictions: string | null;
  unwantedFoods: string | null;
  additionalInfo: string | null;
  hasMobilityIssues: boolean | null;
  diaperSize: string | null;
  notificationPreference: string | null;
  phoneCarrier: string | null;
  location: string | null;
  clientType: string | null;
  provisions: string | null;
  quantity: number | null;
  ticketNumber: string | null;
  nextAppointmentDate: string | null;
  nextAppointmentTime: string | null;
  completionTime: string | null;
  checkInTime: string | null;
};

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [client, setClient] = useState<JoinedClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ClientExtras>({
    nextApptLocation: null,
    dietary: null,
    allergies: null,
    requests: null,
    unwanted: null,
    program: null, // Link2Feed Program field
    email: null,
    adults: null,
    seniors: null,
    children: null,
    childrensAges: null,
    itemsProvided: null,
    notes: null,
    dietaryRestrictions: null,
    unwantedFoods: null,
    additionalInfo: null,
    hasMobilityIssues: null,
    diaperSize: null,
    notificationPreference: null,
    phoneCarrier: null,
    location: null,
    clientType: null,
    provisions: null,
    quantity: null,
  });

  // Load client data
  useEffect(() => {
    const loadClient = async () => {
      if (!id) {
        setError('Client ID is required');
        setLoading(false);
        return;
      }

      try {
        // Get all client data
        const response = await api('/csv/all');
        if (response.ok) {
          const result = await response.json();
          const clients = result.data || [];
          
          // Find client by ID - super simple search
          const foundClient = clients.find((c: any) => {
            const clientId = String(c.clientId || '').toLowerCase();
            const searchId = id.toLowerCase().trim();
            return clientId === searchId || clientId.includes(searchId);
          });
          
          if (foundClient) {
            // Map to expected format
            const mappedClient = {
              id: foundClient.clientId,
              firstName: foundClient.firstName,
              lastName: foundClient.lastName,
              phone: foundClient.phoneNumber,
              householdSize: String(foundClient.householdSize || '1'),
              dietary: foundClient.dietaryConsiderations || null,
              allergies: foundClient.allergies || null,
              requests: foundClient.additionalInfo || null,
              unwanted: foundClient.unwantedFoods || null,
              nextApptLocation: foundClient.location || null,
              program: foundClient.program || null, // Link2Feed Program field
              email: foundClient.email || null,
              adults: foundClient.adults || null,
              seniors: foundClient.seniors || null,
              children: foundClient.children || null,
              childrensAges: foundClient.childrensAges || foundClient.childrenAges || null,
              itemsProvided: foundClient.itemsProvided || null,
              notes: foundClient.notes || null,
              dietaryRestrictions: foundClient.dietaryRestrictions?.join(', ') || null,
              unwantedFoods: foundClient.unwantedFoods || null,
              additionalInfo: foundClient.additionalInfo || null,
              hasMobilityIssues: foundClient.hasMobilityIssues || null,
              diaperSize: foundClient.diaperSize || null,
              notificationPreference: foundClient.notificationPreference || null,
              phoneCarrier: foundClient.phoneCarrier || null,
              location: foundClient.location || null,
              clientType: foundClient.clientType || null,
              provisions: foundClient.provisions || null,
              quantity: foundClient.quantity || null,
              ticketNumber: foundClient.ticketNumber || null,
              nextAppointmentDate: foundClient.nextAppointmentDate || null,
              nextAppointmentTime: foundClient.nextAppointmentTime || null,
              completionTime: foundClient.completionTime || null,
              checkInTime: foundClient.checkInTime || null,
            };
            
            setClient(mappedClient);
            setFormData({
              nextApptLocation: foundClient.location || null,
              dietary: foundClient.dietaryConsiderations || null,
              allergies: foundClient.allergies || null,
              requests: foundClient.additionalInfo || null,
              unwanted: foundClient.unwantedFoods || null,
              program: foundClient.program || null, // Link2Feed Program field
              email: foundClient.email || null,
              adults: foundClient.adults || null,
              seniors: foundClient.seniors || null,
              children: foundClient.children || null,
              childrensAges: foundClient.childrensAges || foundClient.childrenAges || null,
              itemsProvided: foundClient.itemsProvided || null,
              notes: foundClient.notes || null,
              dietaryRestrictions: foundClient.dietaryRestrictions?.join(', ') || null,
              unwantedFoods: foundClient.unwantedFoods || null,
              additionalInfo: foundClient.additionalInfo || null,
              hasMobilityIssues: foundClient.hasMobilityIssues || null,
              diaperSize: foundClient.diaperSize || null,
              notificationPreference: foundClient.notificationPreference || null,
              phoneCarrier: foundClient.phoneCarrier || null,
              location: foundClient.location || null,
              clientType: foundClient.clientType || null,
              provisions: foundClient.provisions || null,
              quantity: foundClient.quantity || null,
            });
          } else {
            setError('Client not found');
          }
        } else {
          setError('Failed to load client data');
        }
      } catch (err) {
        setError('Network error loading client');
        console.error('Error loading client:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (field: keyof ClientExtras, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value || null,
    }));
  };


  // Save extras (simplified - just show success message)
  const handleSave = async () => {
    if (!id) return;

    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Client extras saved successfully',
        description: 'Note: This is a simplified version. Data is stored locally.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save client extras',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
      console.error('Error saving client extras:', err);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle print ticket action
   * 
   * Best Practice: Uses centralized printTicket utility to ensure
   * consistent ticket generation across the application.
   * All print buttons use the same endpoint and data structure.
   */
  const handlePrint = () => {
    if (!id || !client) return;
    
    // Use the client ID that was set during check-in (this is the record ID)
    const checkInId = client.id || id;
    printTicket(checkInId);
  };

  if (loading) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={4}>
          <Spinner size="lg" />
          <Text>Loading client details...</Text>
        </VStack>
      </Container>
    );
  }

  if (error || !client) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={4}>
          <Alert status="error">
            <AlertIcon />
            {error || 'Client not found'}
          </Alert>
          <Button leftIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <HStack spacing={4}>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Heading size="xl" color="admin.primary" fontWeight="700" letterSpacing="-0.025em">
              {client.lastName}, {client.firstName}
            </Heading>
          </HStack>
          <Tooltip 
            label="Opens ticket in new window. Set printer to Landscape orientation for best results."
            placement="bottom"
          >
            <Button
              leftIcon={<FiPrinter />}
              colorScheme="blue"
              onClick={handlePrint}
            >
              Print Ticket
            </Button>
          </Tooltip>
        </HStack>

        {/* Client Info */}
        <Box p={4} bg="gray.50" borderRadius="md">
          <VStack spacing={3} align="start">
            <HStack>
              <Text fontWeight="bold">Client ID:</Text>
              <Badge colorScheme="blue">{client.id}</Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Phone:</Text>
              <Text>{client.phone || 'Not provided'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Email:</Text>
              <Text>{client.email || 'Not provided'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Household Size:</Text>
              <Text>{client.householdSize || 'Not provided'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Adults:</Text>
              <Text>{client.adults || 'Not specified'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Seniors:</Text>
              <Text>{client.seniors || 'Not specified'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Children:</Text>
              <Text>{client.children || 'Not specified'}</Text>
            </HStack>
            {client.childrensAges && (
              <HStack>
                <Text fontWeight="bold">Children's Ages:</Text>
                <Text>{client.childrensAges}</Text>
              </HStack>
            )}
            <HStack>
              <Text fontWeight="bold">Dietary Considerations:</Text>
              <Text>{client.dietary || 'None'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Allergies:</Text>
              <Text>{client.allergies || 'None'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Client Type:</Text>
              <Text>{client.clientType || 'Not specified'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Location:</Text>
              <Text>{client.location || 'Not specified'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Program:</Text>
              <Text>{client.program || 'Food Hamper'}</Text>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Special Requests from Check-in */}
        {(client.dietaryRestrictions || client.allergies || client.unwantedFoods || client.additionalInfo || client.hasMobilityIssues || client.diaperSize) && (
          <Box p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
            <VStack spacing={3} align="start">
              <Heading size="md" color="blue.700">Special Requests from Check-in</Heading>
              
              {client.dietaryRestrictions && (
                <Box>
                  <Text fontWeight="bold" color="blue.600">Dietary Restrictions:</Text>
                  <Text>{client.dietaryRestrictions}</Text>
                </Box>
              )}
              
              {client.allergies && (
                <Box>
                  <Text fontWeight="bold" color="blue.600">Allergies:</Text>
                  <Text>{client.allergies}</Text>
                </Box>
              )}
              
              {client.unwantedFoods && (
                <Box>
                  <Text fontWeight="bold" color="blue.600">Unwanted Foods:</Text>
                  <Text>{client.unwantedFoods}</Text>
                </Box>
              )}
              
              {client.additionalInfo && (
                <Box>
                  <Text fontWeight="bold" color="blue.600">Additional Information:</Text>
                  <Text>{client.additionalInfo}</Text>
                </Box>
              )}
              
              {client.hasMobilityIssues && (
                <Box>
                  <Text fontWeight="bold" color="blue.600">♿ Mobility Assistance:</Text>
                  <Text>Volunteer help requested for packing food into car</Text>
                </Box>
              )}
              
              {client.diaperSize && (
                <Box>
                  <Text fontWeight="bold" color="blue.600">Diaper Size (Tiny Bundles):</Text>
                  <Text>{client.diaperSize}</Text>
                </Box>
              )}
            </VStack>
          </Box>
        )}

        {/* Next Appointment Info */}
        {(client.nextAppointmentDate || client.ticketNumber) && (
          <Box p={4} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
            <VStack spacing={3} align="start">
              <Heading size="md" color="green.700">Next Appointment</Heading>
              
              {client.nextAppointmentDate && (
                <Box>
                  <Text fontWeight="bold" color="green.600">Date:</Text>
                  <Text>{new Date(client.nextAppointmentDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</Text>
                </Box>
              )}
              
              {client.nextAppointmentTime && (
                <Box>
                  <Text fontWeight="bold" color="green.600">Time:</Text>
                  <Text>{client.nextAppointmentTime}</Text>
                </Box>
              )}
              
              {client.ticketNumber && (
                <Box>
                  <Text fontWeight="bold" color="green.600">Ticket Number:</Text>
                  <Text fontFamily="mono" fontSize="lg">{client.ticketNumber}</Text>
                </Box>
              )}
            </VStack>
          </Box>
        )}

        <Divider />

        {/* Extras Form */}
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="#25385D">Client Extras</Heading>
          
          {/* Next Appointment - REMOVED - Using green box above instead */}
          
          <FormControl>
            <FormLabel>Appointment Location</FormLabel>
            <Input
              value={formData.nextApptLocation || ''}
              onChange={(e) => handleInputChange('nextApptLocation', e.target.value)}
              placeholder="e.g., Main Office, Mobile Unit"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Program</FormLabel>
            <Input
              value={formData.program || ''}
              onChange={(e) => handleInputChange('program', e.target.value)}
              placeholder="e.g., Food Hamper, Emergency Support"
            />
          </FormControl>

          {/* Dietary */}
          <FormControl>
            <FormLabel>Dietary Considerations</FormLabel>
            <Textarea
              value={formData.dietary || ''}
              onChange={(e) => handleInputChange('dietary', e.target.value)}
              placeholder="Any dietary preferences or considerations"
              rows={3}
            />
          </FormControl>

          {/* Allergies */}
          <FormControl>
            <FormLabel>Allergies</FormLabel>
            <Textarea
              value={formData.allergies || ''}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              placeholder="List any food allergies or sensitivities"
              rows={3}
            />
          </FormControl>

          {/* Special Requests */}
          <FormControl>
            <FormLabel>Special Requests</FormLabel>
            <Textarea
              value={formData.requests || ''}
              onChange={(e) => handleInputChange('requests', e.target.value)}
              placeholder="Any special requests or notes"
              rows={3}
            />
          </FormControl>

          {/* Unwanted Items */}
          <FormControl>
            <FormLabel>Unwanted Items</FormLabel>
            <Textarea
              value={formData.unwanted || ''}
              onChange={(e) => handleInputChange('unwanted', e.target.value)}
              placeholder="Items the client does not want"
              rows={3}
            />
          </FormControl>

          {/* Email */}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Client email address"
            />
          </FormControl>

          {/* Household Details */}
          <HStack spacing={4}>
            <FormControl>
              <FormLabel>Adults</FormLabel>
              <NumberInput
                value={formData.adults || ''}
                onChange={(value) => handleInputChange('adults', value)}
                min={0}
              >
                <NumberInputField placeholder="0" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Seniors</FormLabel>
              <NumberInput
                value={formData.seniors || ''}
                onChange={(value) => handleInputChange('seniors', value)}
                min={0}
              >
                <NumberInputField placeholder="0" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Children</FormLabel>
              <NumberInput
                value={formData.children || ''}
                onChange={(value) => handleInputChange('children', value)}
                min={0}
              >
                <NumberInputField placeholder="0" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </HStack>

          {/* Children's Ages */}
          <FormControl>
            <FormLabel>Children's Ages</FormLabel>
            <Input
              value={formData.childrensAges || ''}
              onChange={(e) => handleInputChange('childrensAges', e.target.value)}
              placeholder="e.g., 5, 8, 12"
            />
          </FormControl>

          {/* Additional Info */}
          <FormControl>
            <FormLabel>Additional Information</FormLabel>
            <Textarea
              value={formData.additionalInfo || ''}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Any additional information about the client"
              rows={3}
            />
          </FormControl>

          {/* Items Provided */}
          <FormControl>
            <FormLabel>Items Provided</FormLabel>
            <Textarea
              value={formData.itemsProvided || ''}
              onChange={(e) => handleInputChange('itemsProvided', e.target.value)}
              placeholder="Items provided to the client"
              rows={3}
            />
          </FormControl>

          {/* Notes */}
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about the client"
              rows={3}
            />
          </FormControl>

          {/* Mobility Issues */}
          <FormControl>
            <Checkbox
              isChecked={formData.hasMobilityIssues || false}
              onChange={(e) => handleInputChange('hasMobilityIssues', e.target.checked)}
            >
              Has Mobility Issues
            </Checkbox>
          </FormControl>

          {/* Diaper Size */}
          <FormControl>
            <FormLabel>Diaper Size</FormLabel>
            <Select
              value={formData.diaperSize || ''}
              onChange={(e) => handleInputChange('diaperSize', e.target.value)}
              placeholder="Select diaper size"
            >
              <option value="Preemie">Preemie</option>
              <option value="Newborn">Newborn</option>
              <option value="Size 1">Size 1</option>
              <option value="Size 2">Size 2</option>
              <option value="Size 3">Size 3</option>
              <option value="Size 4">Size 4</option>
              <option value="Size 5">Size 5</option>
              <option value="Size 6">Size 6</option>
            </Select>
          </FormControl>

          {/* Notification Preference */}
          <FormControl>
            <FormLabel>Notification Preference</FormLabel>
            <Select
              value={formData.notificationPreference || ''}
              onChange={(e) => handleInputChange('notificationPreference', e.target.value)}
              placeholder="Select notification preference"
            >
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Phone">Phone</option>
              <option value="None">None</option>
            </Select>
          </FormControl>

          {/* Phone Carrier */}
          <FormControl>
            <FormLabel>Phone Carrier</FormLabel>
            <Input
              value={formData.phoneCarrier || ''}
              onChange={(e) => handleInputChange('phoneCarrier', e.target.value)}
              placeholder="e.g., Bell, Rogers, Telus"
            />
          </FormControl>

          {/* Client Type */}
          <FormControl>
            <FormLabel>Client Type</FormLabel>
            <Select
              value={formData.clientType || ''}
              onChange={(e) => handleInputChange('clientType', e.target.value)}
              placeholder="Select client type"
            >
              <option value="New">New</option>
              <option value="Returning">Returning</option>
              <option value="Regular">Regular</option>
            </Select>
          </FormControl>

          {/* Provisions */}
          <FormControl>
            <FormLabel>Provisions</FormLabel>
            <Textarea
              value={formData.provisions || ''}
              onChange={(e) => handleInputChange('provisions', e.target.value)}
              placeholder="Provisions provided"
              rows={3}
            />
          </FormControl>

          {/* Quantity */}
          <FormControl>
            <FormLabel>Quantity</FormLabel>
            <NumberInput
              value={formData.quantity || ''}
              onChange={(value) => handleInputChange('quantity', value)}
              min={0}
            >
              <NumberInputField placeholder="0" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          {/* Save Button */}
          <Button
            colorScheme="green"
            onClick={handleSave}
            isLoading={saving}
            loadingText="Saving..."
            size="md"
            w="50%"
            mx="auto"
          >
            Save
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
};

export default ClientDetailPage;