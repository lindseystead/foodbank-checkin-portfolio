/**
 * @fileoverview CSV data viewer component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component displays uploaded CSV data in a structured table format
 * with preview capabilities, data validation indicators, and
 * processing status information.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../CSVUploader.tsx} CSV uploader component
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Heading,
  Divider,
  Stack,
} from '@chakra-ui/react';
import { FiSearch, FiRefreshCw, FiDownload, FiEye } from 'react-icons/fi';
import { useToast } from '@chakra-ui/react';
import { api } from '../../../lib/api';
import { logger } from '../../../utils/logger';
import { formatPhoneNumberShort } from '../../../utils/phoneFormatter';
import { useDataEvent } from '../../../utils/dataEvents';
import { useTenantTime } from '../../../utils/useTenantTime';

const CSVDataViewer: React.FC = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const toast = useToast();
  const { tz } = useTenantTime();
  const isMountedRef = useRef(true);

  // Load data on mount
  useEffect(() => {
    loadData();
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time refresh: re-fetch when a CSV upload finishes or any
  // data-version bump fires (e.g. kiosk check-in updates a record).
  useDataEvent('data:csvImported', () => loadData());
  useDataEvent('data:dataVersionChanged', () => loadData());

  // Filter data when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(allData);
    } else {
      const search = searchTerm.toLowerCase();
      const filtered = allData.filter(record => {
        const id = String(record.clientId || '').toLowerCase();
        const firstName = String(record.firstName || '').toLowerCase();
        const lastName = String(record.lastName || '').toLowerCase();
        const phone = String(record.phoneNumber || '').toLowerCase();
        const email = String(record.email || '').toLowerCase();
        
        return id.includes(search) || 
               firstName.includes(search) || 
               lastName.includes(search) || 
               phone.includes(search) ||
               email.includes(search);
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, allData]);

  const loadData = useCallback(async () => {
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await api('/admin/t/all');
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        if (isMountedRef.current) {
          setAllData(data);
          setFilteredData(data);
          setTotalRecords(data.length);
        }
      } else {
        if (isMountedRef.current) {
          setError('No client check-ins were found. Please upload a CSV file.');
        }
      }
    } catch (err: any) {
      // Handle API not configured gracefully (expected in CSV-only mode)
      if (err?.message === 'API_NOT_CONFIGURED') {
        logger.debug('API not configured - CSV-only mode');
        if (isMountedRef.current) {
          setError(null); // Don't show error for expected state
        }
      } else {
        logger.error('Error loading data:', err);
        if (isMountedRef.current) {
          setError('No client check-ins were found. Please upload a CSV file.');
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record);
    onOpen();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString();
      }
      const parsed = new Date(dateString);
      if (isNaN(parsed.getTime())) {
        return 'Invalid Date';
      }
      return parsed.toLocaleDateString('en-US', { timeZone: tz });
    } catch {
      return 'Invalid Date';
    }
  };

  const exportToCSV = () => {
    // Check if there's any data to export
    if (filteredData.length === 0) {
      toast({
        title: 'No Data to Export',
        description: 'There is no check-in data available to export. Please upload a CSV file first or ensure there are check-in records in the system.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    
    // Check if allData is empty (no data at all)
    if (allData.length === 0) {
      toast({
        title: 'No Check-In Data',
        description: 'There is no check-in data in the system. Please upload a CSV file from Link2Feed to import client data.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    
    const headers = [
      'Client ID', 'First Name', 'Last Name', 'Phone', 'Email', 
      'Household Size', 'Adults', 'Seniors', 'Children', 
      'Dietary Considerations', 'Status', 'Pickup Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredData.map(record => [
        record.clientId || '',
        record.firstName || '',
        record.lastName || '',
        record.phoneNumber || '',
        record.email || '',
        record.householdSize || '',
        record.adults || '',
        record.seniors || '',
        record.children || '',
        `"${(record.dietaryConsiderations || '').replace(/"/g, '""')}"`,
        record.status || '',
        record.pickUpDate || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients_${new Date().toLocaleDateString('en-CA', { timeZone: tz })}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    // Show success message
    toast({
      title: 'Export Successful',
      description: `Successfully exported ${filteredData.length} client record${filteredData.length === 1 ? '' : 's'} to CSV.`,
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" />
        <Text mt={4}>Loading client data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box w="full" maxW="100%" minW="0" overflow="hidden">
      {/* Header */}
      <Flex 
        justify="space-between" 
        align={{ base: "start", sm: "center" }} 
        mb={6}
        direction={{ base: "column", sm: "row" }}
        gap={{ base: 3, sm: 4 }}
        w="full"
        maxW="100%"
      >
        <VStack align="start" spacing={1} minW="0" flex={1}>
          <Heading size={{ base: "sm", sm: "md" }} color="admin.primary" noOfLines={1}>
            Client Data
          </Heading>
          <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" noOfLines={1}>
            {totalRecords} total records • {filteredData.length} shown
          </Text>
        </VStack>
        
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={2}
          flexShrink={0}
          w={{ base: 'full', sm: 'auto' }}
        >
          <Button
            leftIcon={<FiRefreshCw />}
            onClick={loadData}
            size={{ base: 'md', sm: 'sm' }}
            variant="outline"
            w={{ base: 'full', sm: 'auto' }}
          >
            Refresh
          </Button>
          <Button
            leftIcon={<FiDownload />}
            onClick={exportToCSV}
            size={{ base: 'md', sm: 'sm' }}
            colorScheme="blue"
            isDisabled={filteredData.length === 0}
            w={{ base: 'full', sm: 'auto' }}
          >
            Export CSV
          </Button>
        </Stack>
      </Flex>

      {/* Search */}
      <InputGroup mb={4} w="full" maxW="100%">
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search by ID, name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          w="full"
          maxW="100%"
        />
      </InputGroup>

      {/* Table - Responsive wrapper */}
      <Box 
        w="full" 
        maxW="100%" 
        minW="0" 
        overflow="hidden"
        position="relative"
      >
        <Box
          overflowX="auto"
          overflowY="visible"
          w="full"
          maxW="100%"
          css={{
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '3px',
            },
          }}
        >
          <Table variant="simple" size="sm" w="full" minW={{ base: "560px", md: "auto" }}>
            <Thead>
              <Tr>
                <Th whiteSpace={{ base: "nowrap", md: "normal" }} fontSize={{ base: "xs", sm: "sm" }}>Client ID</Th>
                <Th whiteSpace={{ base: "nowrap", md: "normal" }} fontSize={{ base: "xs", sm: "sm" }}>Name</Th>
                <Th whiteSpace={{ base: "nowrap", md: "normal" }} fontSize={{ base: "xs", sm: "sm" }}>Phone</Th>
                <Th whiteSpace={{ base: "nowrap", md: "normal" }} fontSize={{ base: "xs", sm: "sm" }} display={{ base: "none", md: "table-cell" }}>Email</Th>
                <Th whiteSpace={{ base: "nowrap", md: "normal" }} fontSize={{ base: "xs", sm: "sm" }}>Household</Th>
                <Th whiteSpace={{ base: "nowrap", md: "normal" }} fontSize={{ base: "xs", sm: "sm" }}>Status</Th>
                <Th whiteSpace={{ base: "nowrap", md: "normal" }} fontSize={{ base: "xs", sm: "sm" }} display={{ base: "none", lg: "table-cell" }}>Pickup Date</Th>
                <Th whiteSpace={{ base: "nowrap", md: "normal" }} fontSize={{ base: "xs", sm: "sm" }}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((record, index) => (
                <Tr key={index}>
                  <Td fontFamily="mono" fontSize={{ base: "2xs", sm: "xs" }} whiteSpace="nowrap" maxW={{ base: "80px", sm: "120px" }} overflow="hidden" textOverflow="ellipsis">
                    {record.clientId}
                  </Td>
                  <Td
                    fontSize={{ base: "xs", sm: "sm" }}
                    maxW={{ base: "140px", sm: "150px" }}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace={{ base: "normal", sm: "nowrap" }}
                    overflowWrap="anywhere"
                    wordBreak="break-word"
                  >
                    {record.firstName} {record.lastName}
                  </Td>
                  <Td fontFamily="mono" fontSize={{ base: "2xs", sm: "xs" }} whiteSpace="nowrap">
                    {formatPhoneNumberShort(record.phoneNumber)}
                  </Td>
                  <Td
                    fontSize={{ base: "xs", sm: "sm" }}
                    display={{ base: "none", md: "table-cell" }}
                    maxW="150px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflowWrap="anywhere"
                    wordBreak="break-word"
                  >
                    {record.email || 'N/A'}
                  </Td>
                  <Td textAlign="center" fontSize={{ base: "xs", sm: "sm" }}>
                    {record.householdSize || 'N/A'}
                  </Td>
                  <Td>
                    <Badge 
                      colorScheme={record.status === 'Booked' ? 'blue' : 'green'}
                      variant="subtle"
                      fontSize={{ base: "2xs", sm: "xs" }}
                      whiteSpace="nowrap"
                    >
                      {record.status || 'Unknown'}
                    </Badge>
                  </Td>
                  <Td fontSize={{ base: "xs", sm: "sm" }} display={{ base: "none", lg: "table-cell" }} whiteSpace="nowrap">
                    {formatDate(record.pickUpDate)}
                  </Td>
                  <Td>
                    <Button
                      size={{ base: "xs", sm: "sm" }}
                      leftIcon={<FiEye />}
                      onClick={() => handleViewDetails(record)}
                      whiteSpace="nowrap"
                    >
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {filteredData.length === 0 && (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">
            {searchTerm ? 'No records match your search' : 'No data available'}
          </Text>
        </Box>
      )}

      {/* Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Client Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedRecord && (
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Text fontWeight="bold">Client ID:</Text>
                  <Text fontFamily="mono">{selectedRecord.clientId}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{selectedRecord.firstName} {selectedRecord.lastName}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Phone:</Text>
                  <Text fontFamily="mono">{selectedRecord.phoneNumber || 'N/A'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{selectedRecord.email || 'N/A'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Household Size:</Text>
                  <Text>{selectedRecord.householdSize || 'N/A'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Adults:</Text>
                  <Text>{selectedRecord.adults || 0}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Seniors:</Text>
                  <Text>{selectedRecord.seniors || 0}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Children:</Text>
                  <Text>{selectedRecord.children || 0}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Status:</Text>
                  <Badge colorScheme={selectedRecord.status === 'Booked' ? 'blue' : 'green'}>
                    {selectedRecord.status || 'Unknown'}
                  </Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Pickup Date:</Text>
                  <Text>{formatDate(selectedRecord.pickUpDate)}</Text>
                </HStack>
                {selectedRecord.dietaryConsiderations && (
                  <>
                    <Divider />
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold">Dietary Considerations:</Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedRecord.dietaryConsiderations}
                      </Text>
                    </VStack>
                  </>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export { CSVDataViewer };