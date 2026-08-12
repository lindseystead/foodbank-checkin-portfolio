/**
 * @fileoverview Check-ins management page for Foodbank Check-In and Appointment System admin panel
 * 
 * This page provides comprehensive check-in management functionality
 * including viewing all check-ins, filtering, searching, and managing
 * client appointments and status updates.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../components/features/dashboard/} Dashboard components
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Card,
  CardBody,
  Skeleton,
  SkeletonCircle,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { logger } from '../utils/logger';
import {
  CheckInsHeader,
  CheckInStats,
  CheckInsSearch,
  CheckInsList,
  CheckInDetailModal,
} from '../components/features/checkins';
import { CheckInRecord } from '../types/checkIn';
import { api } from '../lib/api';
import { printTicket } from '../utils/printTicket';
import { useTodayAppointments } from '../hooks/useTodayAppointments';
import { useTenantTime } from '../utils/useTenantTime';

const CheckInsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  const { tz } = useTenantTime();
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckInRecord | null>(null);
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();

  const {
    appointments: checkIns,
    isLoading,
    error,
    refresh: fetchCheckIns,
  } = useTodayAppointments({ pollIntervalMs: 30_000, filterHours: { start: 8, end: 20 } });

  // Filter check-ins based on search
  const filteredCheckIns = useMemo(() => {
    if (!searchTerm) return checkIns;
    const search = searchTerm.toLowerCase();
    return checkIns.filter(checkIn =>
      checkIn.clientName.toLowerCase().includes(search) ||
      checkIn.clientId.toLowerCase().includes(search) ||
      checkIn.phoneNumber.includes(search) ||
      checkIn.firstName?.toLowerCase().includes(search) ||
      checkIn.lastName?.toLowerCase().includes(search)
    );
  }, [checkIns, searchTerm]);


  /**
   * Handle print ticket action
   * 
   * Best Practice: Uses centralized printTicket utility to ensure
   * consistent ticket generation across the application.
   * All print buttons use the same endpoint and data structure.
   */
  const handlePrintTicket = (checkIn: CheckInRecord) => {
    if (checkIn.id) {
      printTicket(checkIn.id);
    }
  };

  const handleViewDetails = (checkIn: CheckInRecord) => {
    setSelectedCheckIn(checkIn);
    onDetailOpen();
  };

  const handleCancelAppointment = async (checkIn: CheckInRecord) => {
    try {
      // IMPORTANT: Use api() helper to include authentication headers
      const response = await api(`/admin/t/checkin/${checkIn.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Cancelled',
          notes: 'Cancelled by admin'
        })
      });
      
      if (response.ok) {
        // Refresh the data
        await fetchCheckIns();
      } else {
        logger.error('Failed to cancel appointment');
      }
    } catch (error) {
      logger.error('Error cancelling appointment:', error);
    }
  };

  /**
   * Export all CSV records with updates
   * 
   * Exports EVERY person from the original CSV upload with:
   * - Same headers and order as original upload
   * - Updated status from check-ins
   * - Next appointment date (or "NA" if missed)
   * - Special requests from client check-in
   * - Original data preserved unless updated
   */
  const handleExportCSV = async () => {
    try {
      // Check if there's any check-in data before attempting export
      if (checkIns.length === 0) {
        toast({
          title: 'No Data to Export',
          description: 'There is no check-in data available to export. Please upload a CSV file first or ensure there are check-in records in the system.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
        return;
      }
      
      // Use the new export-all endpoint that exports everyone with updates
      // IMPORTANT: Use api() helper to include authentication headers
      const response = await api('/admin/t/export-all');
      
      if (response.ok) {
        const blob = await response.blob();
        
        // Check if blob is empty
        if (blob.size === 0) {
          toast({
            title: 'No Data to Export',
            description: 'There is no check-in data available to export. Please ensure there are check-in records in the system.',
            status: 'error',
            duration: 7000,
            isClosable: true,
          });
          return;
        }
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appointments-export-${new Date().toLocaleDateString('en-CA', { timeZone: tz })}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message
        toast({
          title: 'Export Successful',
          description: 'All appointment data has been exported to CSV with updates. The file includes everyone from the original upload with updated statuses and next appointments.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Handle error response
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Export Failed',
          description: errorData.error || 'Unable to export check-in data. Please ensure there is check-in data in the system and try again.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
      }
    } catch (error) {
      logger.error('Error exporting CSV:', error);
      toast({
        title: 'Export Failed',
        description: 'Unable to export check-in data. Please check your connection and try again.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box p={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          <HStack justify="space-between">
            <Skeleton height="32px" width="200px" />
            <Skeleton height="40px" width="120px" />
          </HStack>
          <Skeleton height="60px" width="100%" />
          <VStack spacing={{ base: 3, md: 4 }} align="stretch">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardBody>
                  <HStack spacing={4}>
                    <SkeletonCircle size="40px" />
                    <VStack align="start" spacing={2} flex={1}>
                      <Skeleton height="20px" width="200px" />
                      <Skeleton height="16px" width="150px" />
                    </VStack>
                    <Skeleton height="24px" width="80px" />
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch" w="full" maxW="100%" minW="0">
      <CheckInsHeader
        onExport={handleExportCSV}
        onRefresh={fetchCheckIns}
        isLoading={isLoading}
      />

      <CheckInStats checkIns={checkIns} />

      <CheckInsSearch value={searchTerm} onChange={setSearchTerm} />

      <CheckInsList
        checkIns={filteredCheckIns}
        error={error}
        searchTerm={searchTerm}
        onViewDetails={handleViewDetails}
        onPrintTicket={handlePrintTicket}
        onCancelAppointment={handleCancelAppointment}
      />

      <CheckInDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        checkIn={selectedCheckIn}
        onPrintTicket={handlePrintTicket}
      />
    </VStack>
  );
};

export default CheckInsPage;
