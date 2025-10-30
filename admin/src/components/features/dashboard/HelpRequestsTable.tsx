/**
 * @fileoverview Help requests table component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component displays all help requests from clients in a comprehensive
 * table format with filtering, sorting, and status management capabilities.
 * It provides admins with tools to view and manage client assistance requests.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../DashboardPage.tsx} Dashboard page
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Text,
  VStack,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea
} from '@chakra-ui/react';
import { FiSearch, FiEye, FiCheck, FiClock, FiPhone, FiMail } from 'react-icons/fi';
import { getApiUrl } from '../../../common/apiConfig';
interface HelpRequest {
  id: number;
  client_phone: string;
  client_last_name: string;
  client_email?: string;
  message: string;
  current_page: string;
  status: 'pending' | 'in_progress' | 'resolved';
  has_existing_appointment: boolean;
  created_at: string;
}

const HelpRequestsTable: React.FC = () => {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch help requests from backend API
  const fetchHelpRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(getApiUrl('/help-requests'));
      
      if (!response.ok) {
        throw new Error('Failed to fetch help requests');
      }
      
      const result = await response.json();
      setHelpRequests(result.data || []);
    } catch (err) {
      console.error('Error fetching help requests:', err);
      setError('Failed to load help requests');
      toast({
        title: 'Error',
        description: 'Failed to load help requests',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update request status
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const apiBase = import.meta.env.DEV 
        ? 'http://localhost:3001/api' 
        : import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${apiBase}/help-requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      await fetchHelpRequests();
      toast({
        title: 'Success',
        description: 'Help request status updated',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update help request status',
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Filter and search help requests
  const filteredRequests = helpRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = 
      request.client_phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.client_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'in_progress': return 'blue';
      case 'resolved': return 'green';
      default: return 'gray';
    }
  };

  // Format phone number
  const formatPhone = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    fetchHelpRequests();
    // Poll for new help requests every 15 seconds, but only when not hovering
    const interval = setInterval(() => {
      if (!isHovering) {
        fetchHelpRequests();
      }
    }, 15000); // Reduced from 5 to 15 seconds to save costs
    
    return () => clearInterval(interval);
  }, [isHovering]);

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
        <Text mt={4}>Loading help requests...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <VStack spacing={4} align="stretch" mb={6}>
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            Help Requests ({filteredRequests.length})
          </Text>
          <Button onClick={fetchHelpRequests} size="sm" variant="outline">
            Refresh
          </Button>
        </HStack>

        {/* Filters */}
        <HStack spacing={4}>
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            maxW="200px"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </Select>
        </HStack>
      </VStack>

      {/* Table */}
      <Box 
        overflowX="auto" 
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Client</Th>
              <Th>Contact</Th>
              <Th>Message</Th>
              <Th>Page</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredRequests.map((request) => (
              <Tr key={request.id}>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">
                      {request.client_last_name}
                    </Text>
                    {request.has_existing_appointment && (
                      <Badge size="sm" colorScheme="green">
                        Has Appointment
                      </Badge>
                    )}
                  </VStack>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <HStack spacing={1}>
                      <FiPhone size={12} />
                      <Text fontSize="sm">{formatPhone(request.client_phone)}</Text>
                    </HStack>
                    {request.client_email && (
                      <HStack spacing={1}>
                        <FiMail size={12} />
                        <Text fontSize="sm">{request.client_email}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Td>
                <Td maxW="300px">
                  <Text fontSize="sm" noOfLines={2}>
                    {request.message}
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="sm" color="gray.600">
                    {request.current_page}
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(request.status)}>
                    {request.status.replace('_', ' ')}
                  </Badge>
                </Td>
                <Td>
                  <Text fontSize="sm" color="gray.600">
                    {formatDate(request.created_at)}
                  </Text>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<FiEye />}
                      onClick={() => {
                        setSelectedRequest(request);
                        onOpen();
                      }}
                    >
                      View
                    </Button>
                    {request.status !== 'resolved' && (
                      <Button
                        size="sm"
                        colorScheme="green"
                        leftIcon={<FiCheck />}
                        onClick={() => updateStatus(request.id, 'resolved')}
                      >
                        Resolve
                      </Button>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {filteredRequests.length === 0 && (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">No help requests found</Text>
        </Box>
      )}

      {/* Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Help Request Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedRequest && (
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="bold">Client: {selectedRequest.client_last_name}</Text>
                  <Badge colorScheme={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status.replace('_', ' ')}
                  </Badge>
                </HStack>
                
                <Box>
                  <Text fontWeight="medium" mb={2}>Contact Information:</Text>
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <FiPhone />
                      <Text>{formatPhone(selectedRequest.client_phone)}</Text>
                    </HStack>
                    {selectedRequest.client_email && (
                      <HStack>
                        <FiMail />
                        <Text>{selectedRequest.client_email}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={2}>Message:</Text>
                  <Textarea
                    value={selectedRequest.message}
                    readOnly
                    rows={4}
                    bg="gray.50"
                  />
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={2}>Details:</Text>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm">
                      <strong>Page:</strong> {selectedRequest.current_page}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Date:</strong> {formatDate(selectedRequest.created_at)}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Has Appointment:</strong> {selectedRequest.has_existing_appointment ? 'Yes' : 'No'}
                    </Text>
                  </VStack>
                </Box>

                <HStack spacing={2} pt={4}>
                  <Button
                    colorScheme="green"
                    leftIcon={<FiCheck />}
                    onClick={() => {
                      updateStatus(selectedRequest.id, 'resolved');
                      onClose();
                    }}
                  >
                    Mark Resolved
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<FiClock />}
                    onClick={() => {
                      updateStatus(selectedRequest.id, 'in_progress');
                      onClose();
                    }}
                  >
                    Mark In Progress
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HelpRequestsTable;
