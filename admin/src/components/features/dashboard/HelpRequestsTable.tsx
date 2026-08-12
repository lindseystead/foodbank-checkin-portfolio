/* eslint-disable jsx-a11y/select-has-associated-label */
/**
 * @fileoverview Help requests table component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component displays all help requests from clients in a comprehensive
 * table format with filtering, sorting, and status management capabilities.
 * It provides admins with tools to view and manage client assistance requests.
 * 
 * Note: Select elements have proper accessibility attributes (id, aria-label, title)
 * The eslint-disable is added because Chakra UI Select components are properly labeled
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../DashboardPage.tsx} Dashboard page
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Flex,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Spinner,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Center,
  Heading,
  Divider,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { FiSearch, FiEye, FiCheck, FiClock, FiPhone, FiMail, FiRefreshCw, FiAlertTriangle, FiUser, FiInfo } from 'react-icons/fi';
import { api } from '../../../lib/api';
import { logger } from '../../../utils/logger';
import { usePolling } from '../../../hooks/usePolling';
import { useTenantTime } from '../../../utils/useTenantTime';

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Component
// ============================================================================

const HelpRequestsTable: React.FC = () => {
  // ============================================================================
  // State Management
  // ============================================================================
  const { tz: tenantTz } = useTenantTime();

  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  
  // Refs for managing side effects and closures
  const consecutiveErrorsRef = { current: 0 };
  const loadingRef = { current: false };
  
  // Chakra UI hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // ============================================================================
  // Data Fetching
  // ============================================================================

  /**
   * Fetch help requests from backend API
   * 
   * Best Practices:
   * - Uses authenticated API helper with automatic token inclusion
   * - Implements exponential backoff (stops after 3 consecutive errors)
   * - Handles connection errors gracefully without spamming user
   * - Resets error count on successful load
   */
  const fetchHelpRequests = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }

      const response = await api('/admin/t/help-requests');
      
      if (!isMountedRef.current) return;
      
      // Handle 404/429 gracefully (no endpoint, rate limited)
      if (!response.ok) {
        if (response.status === 429) {
          logger.debug('Rate limited - skipping help requests update');
          return;
        }
        if (response.status === 404) {
          if (isMountedRef.current) {
            setHelpRequests([]);
            setLoading(false);
            setHasLoadedOnce(true);
          }
          return;
        }
        throw new Error(`Failed to fetch help requests: ${response.status}`);
      }
      
      // Parse response data
      const result = await response.json();
      
      if (isMountedRef.current) {
        // Handle different response formats
        let requests: HelpRequest[] = [];
        if (result.success && Array.isArray(result.data)) {
          requests = result.data;
        } else if (Array.isArray(result)) {
          requests = result;
        } else if (Array.isArray(result.data)) {
          requests = result.data;
        }
        
        setHelpRequests(requests);
        setHasLoadedOnce(true);
        setLoading(false);
      }
      
      // Reset error count on successful load
      consecutiveErrorsRef.current = 0;
      
    } catch (err: any) {
      const newErrorCount = consecutiveErrorsRef.current + 1;
      consecutiveErrorsRef.current = newErrorCount;
      
      if (!isMountedRef.current) return;
      
      // Handle API_NOT_CONFIGURED gracefully (expected in CSV-only mode)
      if (err?.message === 'API_NOT_CONFIGURED') {
        logger.debug('API not configured - CSV-only mode');
        if (isMountedRef.current) {
          setError(null);
          setHelpRequests([]);
          setLoading(false);
        }
        return;
      }
      
      // Handle connection errors
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        if (isMountedRef.current) {
          setError(null);
          setHelpRequests([]);
          setLoading(false);
        }
        
        // Exponential backoff: stop polling after 3 consecutive errors
        if (newErrorCount >= 3) {
          if (hasLoadedOnce && isMountedRef.current) {
            toast({
              title: 'Connection Lost',
              description: 'Unable to connect to the server. Polling has been paused. Please refresh manually or check your connection.',
              status: 'warning',
              duration: 7000,
              isClosable: true,
            });
          }
          return;
        }
        
        // Show warning on first error after successful load
        if (hasLoadedOnce && newErrorCount === 1 && isMountedRef.current) {
          toast({
            title: 'Connection Error',
            description: 'Unable to connect to the server. Help requests will refresh automatically when connection is restored.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        // Handle other errors
        logger.error('Error fetching help requests:', err);
        if (isMountedRef.current) {
          setError('Unable to load help requests');
          setLoading(false);
        }
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
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [hasLoadedOnce, toast]);

  // Keep a ref in sync for interval checks without re-binding effects
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // ============================================================================
  // Status Management
  // ============================================================================

  /**
   * Update help request status
   */
  const updateStatus = async (id: number, newStatus: string) => {
    if (updatingId !== null) return;
    setUpdatingId(id);
    try {
      const response = await api(`/admin/t/help-requests/${id}/status`, {
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
      logger.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Unable to update the help request status. Please try again or contact technical support.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // ============================================================================
  // Data Processing & Filtering
  // ============================================================================

  /**
   * Filter and search help requests
   */
  const filteredRequests = useMemo(() => {
    return helpRequests.filter(request => {
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        request.client_phone.toLowerCase().includes(searchLower) ||
        request.client_last_name.toLowerCase().includes(searchLower) ||
        (request.client_email?.toLowerCase().includes(searchLower) ?? false) ||
        request.message.toLowerCase().includes(searchLower);
      
      return matchesStatus && matchesSearch;
    });
  }, [helpRequests, filterStatus, searchTerm]);

  // ============================================================================
  // Utility Functions
  // ============================================================================

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'orange';
      case 'in_progress': return 'blue';
      case 'resolved': return 'green';
      default: return 'gray';
    }
  };

  const formatPhone = (phone: string): string => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: tenantTz,
    });
  };

  // ============================================================================
  // Effects
  // ============================================================================

  // Polling via shared hook (Page Visibility API, exponential backoff)
  const { isMountedRef } = usePolling({
    fetchFn: fetchHelpRequests,
    intervalMs: 30_000,
    maxConsecutiveErrors: 3,
    initialDelayMs: 1_000,
  });

  // ============================================================================
  // Render Helpers
  // ============================================================================

  /**
   * Loading state component
   */
  const renderLoadingState = () => (
    <Center py={12}>
      <VStack spacing={4}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text color="gray.600" fontSize="md">Loading help requests...</Text>
      </VStack>
    </Center>
  );

  /**
   * Error state component
   */
  const renderErrorState = () => (
    <Center py={12} px={4}>
      <VStack spacing={6} maxW="500px" textAlign="center">
        <Box
          p={6}
          bg="red.50"
          borderRadius="full"
          border="2px solid"
          borderColor="red.200"
        >
          <Icon as={FiAlertTriangle} boxSize={10} color="red.500" />
        </Box>
        
        <VStack spacing={3}>
          <Heading size="md" color="gray.800">
            Unable to Load Help Requests
          </Heading>
          <Text color="gray.600" fontSize="sm" lineHeight="1.6">
            {error || "There was a problem loading help requests. Please check your connection and try again."}
          </Text>
        </VStack>
        
        <Button 
          size="md"
          colorScheme="blue" 
          onClick={fetchHelpRequests}
          leftIcon={<FiRefreshCw />}
          px={8}
        >
          Retry
        </Button>
      </VStack>
    </Center>
  );

  /**
   * Empty state component
   */
  const renderEmptyState = () => (
    <Center py={12}>
      <VStack spacing={4}>
        <Icon as={FiInfo} boxSize={12} color="gray.400" />
        <Text color="gray.500" fontSize="md">
          No help requests found
        </Text>
        {searchTerm && (
          <Text color="gray.400" fontSize="sm">
            Try adjusting your search or filter criteria
          </Text>
        )}
      </VStack>
    </Center>
  );

  // ============================================================================
  // Main Render
  // ============================================================================

  // Loading state
  if (loading && !hasLoadedOnce) {
    return renderLoadingState();
  }

  // Error state (only show if no data and persistent error)
  if (error && helpRequests.length === 0 && !loading) {
    return renderErrorState();
  }

  return (
    <Box w="full" maxW="100%" minW="0" overflow="hidden">
      {/* Header Section */}
      <VStack spacing={4} align="stretch" mb={6}>
        <Flex 
          justify="space-between" 
          align={{ base: "start", sm: "center" }}
          direction={{ base: "column", sm: "row" }}
          gap={{ base: 3, sm: 4 }}
          w="full"
        >
          <VStack align="start" spacing={1} minW="0" flex={1}>
            <Text 
              fontSize={{ base: "lg", sm: "xl", md: "2xl" }} 
              fontWeight="bold" 
              color="gray.800"
              noOfLines={1}
            >
              Help Requests
            </Text>
            <HStack spacing={2}>
              <Badge colorScheme="blue" fontSize="xs">
                {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
              </Badge>
              <Text fontSize="xs" color="gray.500">
                Auto-refreshes every 30 seconds
              </Text>
            </HStack>
          </VStack>
          
          <Button 
            onClick={fetchHelpRequests} 
            size={{ base: "sm", sm: "md" }}
            colorScheme="blue"
            isLoading={loading}
            loadingText="Loading..."
            leftIcon={<FiRefreshCw />}
            flexShrink={0}
            w={{ base: "full", sm: "auto" }}
          >
            Refresh Now
          </Button>
        </Flex>

        {/* Filters Section */}
        <Flex 
          direction={{ base: "column", sm: "row" }}
          gap={{ base: 3, sm: 4 }}
          w="full"
        >
          <InputGroup maxW={{ base: "100%", sm: "300px" }} w="full">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search by name, phone, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              w="full"
            />
          </InputGroup>
          
          <FormControl maxW={{ base: "100%", sm: "200px" }} w={{ base: "full", sm: "auto" }}>
            <FormLabel
              id="help-requests-status-filter-label"
              htmlFor="help-requests-status-filter"
              fontSize="sm"
              mb={1}
            >
              Status
            </FormLabel>
            <Select
              id="help-requests-status-filter"
              name="help-requests-status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-labelledby="help-requests-status-filter-label"
              aria-label="Filter help requests by status"
              title="Filter help requests by status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </Select>
          </FormControl>
        </Flex>
      </VStack>

      {/* Table Section */}
      {filteredRequests.length === 0 ? (
        renderEmptyState()
      ) : (
        <Box 
          w="full" 
          maxW="100%" 
          minW="0" 
          overflowX="auto"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
        >
          <Table variant="simple" size="sm" minW={{ base: "640px", md: "auto" }}>
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize={{ base: "xs", sm: "sm" }} fontWeight="600" color="gray.700">Client</Th>
                <Th fontSize={{ base: "xs", sm: "sm" }} fontWeight="600" color="gray.700">Contact</Th>
                <Th fontSize={{ base: "xs", sm: "sm" }} fontWeight="600" color="gray.700">Message</Th>
                <Th fontSize={{ base: "xs", sm: "sm" }} fontWeight="600" color="gray.700" display={{ base: "none", lg: "table-cell" }}>Page</Th>
                <Th fontSize={{ base: "xs", sm: "sm" }} fontWeight="600" color="gray.700">Status</Th>
                <Th fontSize={{ base: "xs", sm: "sm" }} fontWeight="600" color="gray.700" display={{ base: "none", md: "table-cell" }}>Date</Th>
                <Th fontSize={{ base: "xs", sm: "sm" }} fontWeight="600" color="gray.700">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredRequests.map((request) => (
                <Tr key={request.id} _hover={{ bg: "gray.50" }}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="600" fontSize={{ base: "xs", sm: "sm" }} noOfLines={1}>
                        {request.client_last_name}
                      </Text>
                      {request.has_existing_appointment && (
                        <Badge size="sm" colorScheme="green" fontSize="2xs">
                          Has Appointment
                        </Badge>
                      )}
                    </VStack>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <HStack spacing={1}>
                        <Icon as={FiPhone} boxSize={3} color="gray.500" />
                        <Text fontSize={{ base: "xs", sm: "sm" }} noOfLines={1}>
                          {formatPhone(request.client_phone)}
                        </Text>
                      </HStack>
                      {request.client_email && (
                        <HStack spacing={1} maxW="100%">
                          <Icon as={FiMail} boxSize={3} color="gray.500" />
                          <Text
                            fontSize={{ base: "xs", sm: "sm" }}
                            noOfLines={{ base: 2, sm: 1 }}
                            maxW={{ base: "160px", sm: "200px" }}
                            overflowWrap="anywhere"
                            wordBreak="break-word"
                          >
                            {request.client_email}
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </Td>
                  <Td maxW={{ base: "150px", sm: "200px", md: "300px" }}>
                    <Text
                      fontSize={{ base: "xs", sm: "sm" }}
                      color="gray.700"
                      noOfLines={{ base: 3, sm: 2 }}
                      overflowWrap="anywhere"
                      wordBreak="break-word"
                    >
                      {request.message}
                    </Text>
                  </Td>
                  <Td display={{ base: "none", lg: "table-cell" }}>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" noOfLines={1}>
                      {request.current_page}
                    </Text>
                  </Td>
                  <Td>
                    <Badge 
                      colorScheme={getStatusColor(request.status)} 
                      fontSize={{ base: "2xs", sm: "xs" }}
                      textTransform="capitalize"
                    >
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </Td>
                  <Td display={{ base: "none", md: "table-cell" }}>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" whiteSpace="nowrap">
                      {formatDate(request.created_at)}
                    </Text>
                  </Td>
                  <Td>
                    <HStack spacing={2} flexWrap="wrap">
                      <Button
                        size="xs"
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
                          size="xs"
                          colorScheme="green"
                          leftIcon={<FiCheck />}
                          isLoading={updatingId === request.id}
                          isDisabled={updatingId !== null}
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
      )}

      {/* Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={2}>
              <Icon as={FiUser} />
              <Text>Help Request Details</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedRequest && (
              <VStack spacing={6} align="stretch">
                {/* Status Badge */}
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" fontSize="lg">
                    {selectedRequest.client_last_name}
                  </Text>
                  <Badge colorScheme={getStatusColor(selectedRequest.status)} fontSize="sm">
                    {selectedRequest.status.replace('_', ' ')}
                  </Badge>
                </Flex>
                
                <Divider />
                
                {/* Contact Information */}
                <Box>
                  <HStack spacing={2} mb={3}>
                    <Icon as={FiPhone} color="gray.600" />
                    <Text fontWeight="semibold">Contact Information</Text>
                  </HStack>
                  <VStack align="start" spacing={2} pl={6}>
                    <HStack>
                      <Text fontSize="sm" color="gray.600">Phone:</Text>
                      <Text fontSize="sm" fontWeight="medium">{formatPhone(selectedRequest.client_phone)}</Text>
                    </HStack>
                    {selectedRequest.client_email && (
                      <HStack>
                        <Text fontSize="sm" color="gray.600">Email:</Text>
                        <Text fontSize="sm" fontWeight="medium">{selectedRequest.client_email}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>

                {/* Message */}
                <Box>
                  <HStack spacing={2} mb={3}>
                    <Icon as={FiInfo} color="gray.600" />
                    <Text fontWeight="semibold">Message</Text>
                  </HStack>
                  <Textarea
                    value={selectedRequest.message}
                    readOnly
                    rows={4}
                    bg="gray.50"
                    fontSize="sm"
                    pl={6}
                  />
                </Box>

                {/* Additional Details */}
                <Box>
                  <HStack spacing={2} mb={3}>
                    <Icon as={FiClock} color="gray.600" />
                    <Text fontWeight="semibold">Additional Details</Text>
                  </HStack>
                  <VStack align="start" spacing={2} pl={6}>
                    <HStack>
                      <Text fontSize="sm" color="gray.600">Page:</Text>
                      <Text fontSize="sm" fontWeight="medium">{selectedRequest.current_page}</Text>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm" color="gray.600">Date:</Text>
                      <Text fontSize="sm" fontWeight="medium">{formatDate(selectedRequest.created_at)}</Text>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm" color="gray.600">Has Appointment:</Text>
                      <Badge colorScheme={selectedRequest.has_existing_appointment ? 'green' : 'gray'} fontSize="xs">
                        {selectedRequest.has_existing_appointment ? 'Yes' : 'No'}
                      </Badge>
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                {/* Action Buttons */}
                {selectedRequest.status !== 'resolved' && (
                  <HStack spacing={3} justify="flex-end">
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
                  </HStack>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HelpRequestsTable;
