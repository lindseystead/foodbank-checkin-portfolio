/**
 * @fileoverview CSV status component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component displays the current status of CSV data processing,
 * including upload status, processing progress, and data
 * validation results for monitoring bulk operations.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../CSVUploadPage.tsx} CSV upload page
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Spinner,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiDatabase, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface DayStatus {
  today: string;
  csvDate: string;
  data: {
    present: boolean;
    count: number;
    expiresAt?: string;
  };
}

interface CSVStatusProps {
  onRefresh?: () => void;
}

const CSVStatus: React.FC<CSVStatusProps> = ({ onRefresh }) => {
  const [status, setStatus] = useState<DayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const bgColor = 'white'; // Fixed white background
  const borderColor = 'gray.300'; // More visible border

  useEffect(() => {
    fetchStatus();
    
    // Listen for CSV import events to start polling
    const handleCSVImport = () => {
      fetchStatus(); // Immediate refresh
    };
    
    window.addEventListener('csvDataImported', handleCSVImport);
    
    // Only start polling if we have data or are loading
    let interval: NodeJS.Timeout | null = null;
    
    if (status?.data?.present || loading) {
      // Auto-refresh every 30 seconds ONLY when data exists
      interval = setInterval(fetchStatus, 30000);
    }
    
    return () => {
      window.removeEventListener('csvDataImported', handleCSVImport);
      if (interval) clearInterval(interval);
    };
  }, [status?.data?.present, loading]); // Re-run when data presence changes

  const fetchStatus = async () => {
    try {
      const response = await api('/status/day');
      
      if (response.status === 429) {
        // Rate limited - don't show error, just skip this update
        console.warn('Rate limited - skipping status update');
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Check if data version changed (data was purged)
        const lastVersion = localStorage.getItem('dataVersion');
        if (result.dataVersion && result.dataVersion.toString() !== lastVersion) {
          localStorage.setItem('dataVersion', result.dataVersion.toString());
          // Trigger a page refresh to update all components
          window.location.reload();
          return;
        }
        
        setStatus(result.data);
        setError(null);
        // Call the refresh callback if provided
        if (onRefresh) {
          onRefresh();
        }
      } else {
        setError(result.error || 'Failed to fetch status');
      }
    } catch (err) {
      console.error('Status fetch error:', err);
      setError('No client check-ins were found. Please upload a CSV file.');
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function to parent components
  useEffect(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, [status, onRefresh]);


  const getStatusIcon = () => {
    if (!status) return FiDatabase;
    if (status.data.present) return FiCheckCircle;
    return FiXCircle;
  };

  const getStatusText = () => {
    if (!status) return 'No Data';
    if (!status.data.present) return 'Not Ready';
    
    // Check if CSV date matches today
    const isToday = status.csvDate === status.today;
    return isToday ? 'Ready' : 'Wrong Date';
  };

  const formatExpiryTime = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const formatTodayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Vancouver'
    });
  };

  const getStatusMessage = () => {
    if (!status) return 'No data available';
    if (!status.data.present) return 'No CSV data uploaded for today';
    
    const count = status.data.count;
    if (count === 0) return 'No records found';
    
    // Check if CSV date matches today
    const isToday = status.csvDate === status.today;
    const dateText = isToday ? 'today' : `from ${formatTodayDate(status.csvDate)}`;
    
    if (count === 1) return `1 client with appointment ${dateText}`;
    return `${count} clients with appointments ${dateText}`;
  };

  if (loading) {
    return (
      <VStack spacing={4} align="center" justify="center" h="full">
        <Spinner size="lg" color="#2B7B8C" />
        <Text fontSize="md" color="gray.600" fontWeight="500">
          Loading status...
        </Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Box
        p={5}
        bg={bgColor}
        border="2px solid"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="lg"
        position="relative"
        overflow="hidden"
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          top={0}
          right={0}
          w="100px"
          h="100px"
          bg="gray.50"
          borderRadius="full"
          transform="translate(30px, -30px)"
          opacity={0.3}
        />
        
        <VStack spacing={4} align="stretch">
          {/* Status Header */}
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Box
                p={2}
                bg="gray.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiDatabase} color="gray.600" boxSize={4} />
              </Box>
              <VStack spacing={0} align="start">
                <Text fontSize="md" fontWeight="bold" color="admin.primary">
                  Daily Data Status
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'America/Vancouver'
                  })}
                </Text>
              </VStack>
            </HStack>
            <Badge 
              colorScheme="gray" 
              size="md"
              px={3}
              py={1}
              borderRadius="full"
              fontWeight="medium"
            >
              No Data
            </Badge>
          </HStack>

          {/* Friendly Message */}
          <Box
            p={3}
            bg="blue.50"
            borderRadius="md"
            border="1px solid"
            borderColor="blue.200"
          >
            <VStack spacing={2}>
              <Text fontSize="sm" color="blue.700" fontWeight="medium" textAlign="center">
                💡 Upload today's CSV data to get started
              </Text>
              <Button
                size="xs"
                variant="outline"
                colorScheme="blue"
                onClick={fetchStatus}
                isLoading={loading}
              >
                Check for Data
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="center" justify="center" h="full">
      <Box
        p={4}
        bg="cofb.blue"
        color="white"
        borderRadius="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={getStatusIcon()} color="white" boxSize={6} />
      </Box>
      
      <VStack spacing={3} align="center" textAlign="center">
        <Text fontSize="lg" fontWeight="bold" color="white">
          {getStatusText()}
        </Text>

        <Text fontSize="sm" color="gray.600" textAlign="center" maxW="200px">
          {getStatusMessage()}
        </Text>
        {status?.data.present && (
          <VStack spacing={1} align="center">
            <Text fontSize="2xl" fontWeight="bold" color="#2B7B8C">
              {status.data.count}
            </Text>
            <Text fontSize="xs" color="gray.500">
              Total Records
            </Text>

            {/* Expiry Info */}
            {status.data.expiresAt && (
              <HStack justify="space-between" align="center">
                <HStack spacing={2}>
                  <Icon as={FiClock} color="orange.500" boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Data Expires:
                  </Text>
                </HStack>
                <Tooltip label={`Expires in ${formatExpiryTime(status.data.expiresAt)}`}>
                  <Badge colorScheme="orange" variant="subtle" px={2} py={1}>
                    {formatExpiryTime(status.data.expiresAt)}
                  </Badge>
                </Tooltip>
              </HStack>
            )}
          </VStack>
        )}

        {/* Action Hint */}
        {!status?.data.present && (
          <Box
            p={3}
            bg="blue.50"
            borderRadius="md"
            border="1px solid"
            borderColor="blue.200"
          >
            <VStack spacing={2}>
              <Text fontSize="xs" color="blue.700" textAlign="center">
                💡 Upload today's appointment data to begin
              </Text>
              <Button
                size="sm"
                colorScheme="blue"
                variant="solid"
                onClick={() => navigate('/csv-upload')}
                fontSize="xs"
                h="auto"
                py={2}
                px={4}
              >
                Upload CSV File
              </Button>
            </VStack>
          </Box>
        )}
      </VStack>
    </VStack>
  );
};

export { CSVStatus };
