/**
 * @fileoverview CSV upload page for Foodbank Check-In and Appointment System admin panel
 * 
 * This page handles CSV file uploads for bulk appointment data import.
 * It provides file validation, preview functionality, and processing
 * status updates for managing daily appointment schedules.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../components/features/csv/CSVUploader.tsx} Upload component
 */

import React, { useState, useEffect } from 'react';
import { clearAllData } from '../lib/api';
import { fetchStatusDay } from '../lib/statusService';
import {
  Box,
  VStack,
  Text,
  Grid,
  Alert,
  AlertIcon,
  Button,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { logger } from '../utils/logger';
import { useTenantTime } from '../utils/useTenantTime';
import PageHeader from '../components/ui/PageHeader';
import {
  CSVStatusOverview,
  CSVUploadSection,
  CSVInstructionsPanel,
  CSVHelpSupportPanel,
} from '../components/features/csv';

interface DayStatus {
  today: string;
  csvDate?: string;
  data: {
    present: boolean;
    count: number;
    expiresAt?: string;
  };
}

const CSVUploadPage: React.FC = () => {
  const [status, setStatus] = useState<DayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const { isOpen: isClearOpen, onOpen: onClearOpen, onClose: onClearClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const { tz } = useTenantTime();

  useEffect(() => {
    fetchStatus();
    // No auto-refresh - only update when manually triggered
  }, []);

  const fetchStatus = async (retryCount = 0) => {
    try {
      const result = await fetchStatusDay();
      
      if (result.success) {
        setStatus(result.data ?? null);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch status');
      }
    } catch (err: any) {
      // Handle API not configured gracefully (expected in CSV-only mode)
      if (err?.message === 'API_NOT_CONFIGURED') {
        logger.debug('API not configured - CSV-only mode');
      } else if (err?.message === 'RATE_LIMITED') {
        logger.debug('Rate limited - skipping status update');
      } else {
        logger.debug('Backend not available, showing upload prompt');
      }
      setStatus({
        today: new Date().toLocaleDateString('en-US', { timeZone: tz }),
        data: {
          present: false,
          count: 0
        }
      });
      setError(null);
      
      // Retry once after a short delay if this is the first attempt
      if (retryCount === 0) {
        setTimeout(() => fetchStatus(1), 2000);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!status) return 'red';
    if (status.data.present) return 'green';
    return 'red';
  };

  const getStatusText = () => {
    if (!status) return 'No Data';
    if (status.data.present) return 'Complete';
    return 'Missing';
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

  const handleUploadSuccess = () => {
    fetchStatus(); // Refresh status after successful upload
  };

  const handleClearAllData = async () => {
    onClearOpen();
  };

  const confirmClearData = async () => {
    if (isClearing) return;
    setIsClearing(true);
    onClearClose();
    
    try {
      const result = await clearAllData();
      
      if (result.success) {
        // Only clear non-auth storage to preserve user session
        // Save Supabase auth keys before clearing
        const authKeys: string[] = [];
        const supabaseKeys: { [key: string]: string | null } = {};
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('supabase.auth.')) {
            authKeys.push(key);
            supabaseKeys[key] = localStorage.getItem(key);
          }
        }
        
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Restore Supabase auth keys to keep user logged in
        authKeys.forEach(key => {
          const value = supabaseKeys[key];
          if (value) {
            localStorage.setItem(key, value);
          }
        });
        
        // Show success toast
        toast({
          title: 'Data Cleared Successfully',
          description: 'All operational data has been cleared. The page will refresh automatically.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        
        // Refresh the page to clear all data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: 'Clear Failed',
          description: result.error || 'Unable to clear data. Please try again or contact technical support.',
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      }
    } catch (error) {
      logger.error('Clear data error:', error);
      toast({
        title: 'Clear Failed',
        description: error instanceof Error ? error.message : 'Unable to clear data. Please try again or contact technical support.',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleDownloadSample = () => {
    // Create a sample CSV content matching the exact system format.
    // Use tenant-local "today" so the example pickup date matches the operator's day.
    const sampleDate = new Date().toLocaleDateString('en-CA', { timeZone: tz });
    const sampleCSV = `Client #,Name,Pick Up Date,Dietary Considerations,Items Provided,Adults,Seniors,Children,Children's Ages,Email,Phone Number
2964486,John Doe,${sampleDate} @ 9:00 AM,,1.00 x Snack Pack - $30, 1.00 x Multi - $300, 1.00 x Vitality Single - $10,2,0,1,,johndoe@gmail.com,2507637161
1367054,Wendy Sally,${sampleDate} @ 9:00 AM,,1.00 x Single - $175,1,0,0,,wendysally@gmail.com,2502125566
611361,Rosa Parks,${sampleDate} @ 9:00 AM,55+, Other (Specify),1.00 x Double - $200, 1.00 x Vitality Double - $15,0,2,0,,rosaparks@gmail.com,2505501155
785407,Sally Sepor,${sampleDate} @ 9:00 AM,Fibromyalgia, Diabetes, 55+,1.00 x Single - $175, 1.00 x Vitality Single - $10,0,1,0,,test@gmail.com,2506606666
3331009,Norma Ada,${sampleDate} @ 9:00 AM,,1.00 x Single - $175,1,0,0,,test@gmail.com,2502122525
5594238,Wendy Willy,${sampleDate} @ 9:00 AM,,1.00 x Double - $200,1,0,0,,test@gmail.com,2503003300`;

    // Create a blob and download
    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample-appointments.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch" w="full" maxW="100%" minW="0">
      {/* Header */}
      <PageHeader
        title="Data Upload"
        description="Upload your Link2Feed CSV file to see today's appointments and client check-ins"
        textAlign="center"
      />

      <CSVStatusOverview
        status={status}
        loading={loading}
        error={error}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        formatExpiryTime={formatExpiryTime}
        onRefresh={fetchStatus}
        onClearAllData={handleClearAllData}
      />

      <CSVUploadSection onUploadSuccess={handleUploadSuccess} />

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 4, md: 6 }} w="full" maxW="100%" minW="0">
        <CSVInstructionsPanel />
        <CSVHelpSupportPanel onDownloadSample={handleDownloadSample} />
      </Grid>

      {/* Clear Data Confirmation Dialog */}
      <AlertDialog
        isOpen={isClearOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClearClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="red.600">
              Clear All Data
            </AlertDialogHeader>
            <AlertDialogBody>
              <VStack align="stretch" spacing={3}>
                <Text>
                  <strong>Warning:</strong> This action will permanently delete all operational data from the system.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  This includes:
                </Text>
                <Box pl={4}>
                  <Text fontSize="sm">• All client data</Text>
                  <Text fontSize="sm">• All appointment data</Text>
                  <Text fontSize="sm">• All check-in records</Text>
                  <Text fontSize="sm">• All CSV uploads</Text>
                </Box>
                <Alert status="warning" borderRadius="md" mt={2}>
                  <AlertIcon />
                  <Text fontSize="sm">
                    This action cannot be undone. Your authentication session will be preserved.
                  </Text>
                </Alert>
                <Text fontSize="sm" color="gray.600">
                  Are you sure you want to continue?
                </Text>
              </VStack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClearClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmClearData}
                ml={3}
                isLoading={isClearing}
                isDisabled={isClearing}
              >
                Clear All Data
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default CSVUploadPage;

