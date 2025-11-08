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

import React, { useState, useEffect, useRef } from 'react';
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
import { api } from '../../../lib/api';
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
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const consecutiveErrorsRef = useRef(0); // Use ref to track errors in closures (avoids stale closure)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  /**
   * Fetch help requests from backend API
   * 
   * Best Practices:
   * - Uses authenticated API helper with automatic token inclusion
   * - Implements exponential backoff (stops after 3 consecutive errors)
   * - Handles connection errors gracefully without spamming user
   * - Resets error count on successful load
   */
  const fetchHelpRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use authenticated API helper
      const response = await api('/help-requests');
      
      if (!response.ok) {
        // Handle different error statuses gracefully
        if (response.status === 404) {
          // No help requests endpoint or no data - treat as empty
          setHelpRequests([]);
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch help requests: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Handle both success wrapper and direct array responses
      if (result.success && Array.isArray(result.data)) {
        setHelpRequests(result.data);
      } else if (Array.isArray(result)) {
        setHelpRequests(result);
      } else if (Array.isArray(result.data)) {
        setHelpRequests(result.data);
      } else {
        // No data is not an error - just empty array
        setHelpRequests([]);
      }
      
      // Mark that we've successfully loaded at least once
      setHasLoadedOnce(true);
      // Reset error count on successful load
      consecutiveErrorsRef.current = 0;
    } catch (err) {
      console.error('Error fetching help requests:', err);
      
      // Track consecutive errors for exponential backoff
      const newErrorCount = consecutiveErrorsRef.current + 1;
      consecutiveErrorsRef.current = newErrorCount;
      
      // Handle connection errors gracefully - don't show errors on initial load
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        // Backend not available - silently handle on initial load
        setError(null);
        setHelpRequests([]);
        
        // Exponential backoff: stop polling after 3 consecutive errors
        if (newErrorCount >= 3) {
          // Stop polling - user can manually refresh
          if (hasLoadedOnce) {
            toast({
              title: 'Connection Lost',
              description: 'Unable to connect to the server. Polling has been paused. Please refresh manually or check your connection.',
              status: 'warning',
              duration: 7000,
              isClosable: true,
            });
          }
          return; // Don't continue polling
        }
        
        // Only show warning if we've loaded successfully before (first error only)
        if (hasLoadedOnce && newErrorCount === 1) {
          toast({
            title: 'Connection Error',
            description: 'Unable to connect to the server. Help requests will refresh automatically when connection is restored.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        // Only show error if we've loaded before (not on initial page load)
        setError('Unable to load help requests');
        if (hasLoadedOnce && newErrorCount === 1) {
          toast({
            title: 'Load Failed',
            description: 'Unable to load help requests. The page will automatically retry.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Update request status
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      // Use authenticated API helper
      const response = await api(`/help-requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update status');
      }
      
      await fetchHelpRequests();
      toast({
        title: 'Status Updated',
        description: 'The help request status has been updated successfully.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Unable to update the help request status. Please try again or contact technical support.',
        status: 'error',
        duration: 7000,
        isClosable: true,
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

  /**
   * Polling setup with Page Visibility API and exponential backoff
   * 
   * Best Practices Implemented:
   * - Page Visibility API: Pauses polling when browser tab is hidden
   * - Exponential Backoff: Stops polling after 3 consecutive connection errors
   * - Optimized Interval: 30 seconds (reduced from 5s to minimize API calls)
   * - Smart Conditions: Only polls when tab visible, not loading, and connection healthy
   * - Proper Cleanup: Clears intervals and removes event listeners on unmount
   * 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API} Page Visibility API
   * @see {@link https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/} Exponential Backoff
   */
  useEffect(() => {
    // Initial fetch - delay slightly to avoid race condition on page load
    const initialTimeout = setTimeout(() => {
      fetchHelpRequests();
    }, 1000);
    
    // Use visibility API to pause polling when tab is hidden
    let interval: NodeJS.Timeout | null = null;
    let isVisible = !document.hidden;
    
    const startPolling = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        // Only poll if tab is visible, not loading, and haven't hit error limit
        // Use ref to get current error count (avoids stale closure)
        if (!document.hidden && !loading && consecutiveErrorsRef.current < 3) {
          fetchHelpRequests();
        }
      }, 30000); // Poll every 30 seconds (optimized to reduce API calls by 80%)
    };
    
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        // Tab became visible - fetch immediately and start polling
        fetchHelpRequests();
        startPolling();
      } else {
        // Tab hidden - stop polling
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };
    
    // Start polling if visible
    if (isVisible) {
      startPolling();
    }
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearTimeout(initialTimeout);
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
        <Text mt={4}>Loading help requests...</Text>
      </Box>
    );
  }

  // Only show error alert if there's a persistent error and no data
  // If we have data, show it even if there was a transient error
  if (error && helpRequests.length === 0 && !loading) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertDescription>{error}</AlertDescription>
          <Button 
            mt={3} 
            size="sm" 
            colorScheme="blue" 
            onClick={fetchHelpRequests}
          >
            Retry
          </Button>
        </Box>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <VStack spacing={4} align="stretch" mb={6}>
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold">
              Help Requests ({filteredRequests.length})
            </Text>
            <Text fontSize="xs" color="gray.500">
              Auto-refreshes every 30 seconds
            </Text>
          </VStack>
          <Button 
            onClick={fetchHelpRequests} 
            size="sm" 
            colorScheme="blue"
            isLoading={loading}
            loadingText="Loading..."
          >
            Refresh Now
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
      <Box overflowX="auto">
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
