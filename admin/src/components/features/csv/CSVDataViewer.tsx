/**
 * @fileoverview CSV data viewer component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component displays uploaded CSV data in a structured table format
 * with preview capabilities, data validation indicators, and
 * processing status information.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../CSVUploader.tsx} CSV uploader component
 */

import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { FiSearch, FiRefreshCw, FiDownload, FiEye } from 'react-icons/fi';
import { useToast } from '@chakra-ui/react';
import { api } from '../../../lib/api';
import { formatPhoneNumberShort } from '../../../common/utils/phoneFormatter';

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

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

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

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api('/csv/all');
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        setAllData(data);
        setFilteredData(data);
        setTotalRecords(data.length);
      } else {
        setError('No client check-ins were found. Please upload a CSV file.');
      }
    } catch (err) {
      setError('No client check-ins were found. Please upload a CSV file.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record);
    onOpen();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
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
    a.download = `clients_${new Date().toISOString().split('T')[0]}.csv`;
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
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={1}>
          <Heading size="md" color="#25385D">
            Client Data
          </Heading>
          <Text fontSize="sm" color="gray.600">
            {totalRecords} total records • {filteredData.length} shown
          </Text>
        </VStack>
        
        <HStack spacing={2}>
          <Button
            leftIcon={<FiRefreshCw />}
            onClick={loadData}
            size="sm"
            variant="outline"
          >
            Refresh
          </Button>
          <Button
            leftIcon={<FiDownload />}
            onClick={exportToCSV}
            size="sm"
            colorScheme="blue"
            isDisabled={filteredData.length === 0}
          >
            Export CSV
          </Button>
        </HStack>
      </Flex>

      {/* Search */}
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search by ID, name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Client ID</Th>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>Email</Th>
              <Th>Household</Th>
              <Th>Status</Th>
              <Th>Pickup Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((record, index) => (
              <Tr key={index}>
                <Td fontFamily="mono" fontSize="xs">
                  {record.clientId}
                </Td>
                <Td>
                  {record.firstName} {record.lastName}
                </Td>
                <Td fontFamily="mono" fontSize="xs">
                  {formatPhoneNumberShort(record.phoneNumber)}
                </Td>
                <Td fontSize="xs">
                  {record.email || 'N/A'}
                </Td>
                <Td textAlign="center">
                  {record.householdSize || 'N/A'}
                </Td>
                <Td>
                  <Badge 
                    colorScheme={record.status === 'Booked' ? 'blue' : 'green'}
                    variant="subtle"
                  >
                    {record.status || 'Unknown'}
                  </Badge>
                </Td>
                <Td fontSize="xs">
                  {formatDate(record.pickUpDate)}
                </Td>
                <Td>
                  <Button
                    size="xs"
                    leftIcon={<FiEye />}
                    onClick={() => handleViewDetails(record)}
                  >
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
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