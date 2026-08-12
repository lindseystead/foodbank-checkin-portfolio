/**
 * @fileoverview CSV uploader component for Foodbank Check-In and Appointment System admin panel
 *
 * Handles CSV file uploads with drag-and-drop functionality,
 * file validation, duplicate detection, and date mismatch warnings.
 *
 * @version 2.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';
import { api } from '../../../lib/api';
import { invalidateStatusDayCache } from '../../../lib/statusService';
import { emitDataEvent } from '../../../utils/dataEvents';
import { useTenantTime } from '../../../utils/useTenantTime';
import { logger } from '../../../utils/logger';
import CSVDropZone from './CSVDropZone';
import CSVDateMismatchModal from './CSVDateMismatchModal';

interface CSVUploaderProps {
  onUploadSuccess?: () => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUploadSuccess }) => {
  const { formatDateTime, tz } = useTenantTime();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [dateMismatchWarning, setDateMismatchWarning] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  // ---- Consolidated upload logic ----

  const performUpload = async (file: File, allowDateMismatch = false) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    let progressInterval: ReturnType<typeof setInterval> | null = null;
    const clearProgress = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
    };

    try {
      const formData = new FormData();
      formData.append('csv', file);
      if (allowDateMismatch) {
        formData.append('allowDateMismatch', 'true');
      }

      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearProgress();
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await api('/admin/t/upload', {
        method: 'POST',
        body: formData,
      });

      clearProgress();
      setUploadProgress(100);

      const result = await response.json();

      if (result.success) {
        const message =
          result.duplicates > 0
            ? `Successfully imported ${result.added} new records (${result.duplicates} duplicates skipped)`
            : `Successfully imported ${result.added} records`;

        setUploadResult({
          success: true,
          count: result.added || result.count,
          expiresAt: result.expiresAt,
          message,
          warning: result.warning,
          csvDate: result.csvDate,
          todayDate: result.todayDate,
        });

        toast({
          title: 'CSV Import Complete',
          description: message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        if (result.warning) {
          toast({
            title: 'Date Mismatch Detected',
            description: result.warning,
            status: 'warning',
            duration: 7000,
            isClosable: true,
          });
        }

        setPendingFile(null);
        setDateMismatchWarning(null);
        setIsModalOpen(false);
        invalidateStatusDayCache();
        onUploadSuccess?.();

        emitDataEvent('data:csvImported', { count: result.count });
      } else if (result.requiresConfirmation) {
        setDateMismatchWarning(
          result.error ||
            result.warning ||
            'The CSV file date does not match today. Confirm the override to continue.',
        );
        setPendingFile(file);
        setIsModalOpen(true);
      } else {
        setUploadResult({
          success: false,
          message: result.error || 'Import failed',
          errors: result.errors || [],
        });

        toast({
          title: 'Import Failed',
          description:
            result.error ||
            'The CSV file could not be imported. Please verify the file format matches the Link2Feed export format and try again.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
      }
    } catch (error) {
      logger.error('Upload error:', error);
      setUploadResult({
        success: false,
        message: 'Upload failed. Please check your connection and try again.',
      });

      toast({
        title: 'Upload Failed',
        description:
          'Unable to upload the file. Please check your internet connection and try again. If the problem persists, contact technical support.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      clearProgress();
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ---- File selection with pre-upload check ----

  const handleFileSelect = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: 'Invalid File Type',
        description:
          'Please select a CSV file exported from Link2Feed. The file must have a .csv extension.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description:
          'The selected file exceeds the 10MB limit. Please export a smaller file from Link2Feed or contact support.',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
      return;
    }

    // Warn if data already exists
    try {
      const statusResponse = await api('/admin/t/status/day');
      const statusResult = await statusResponse.json();

      if (statusResult.success && statusResult.data?.present) {
        const confirmed = window.confirm(
          '⚠️ CSV data already exists in the system!\n\n' +
            `Current records: ${statusResult.data.count}\n\n` +
            'If you upload a new CSV file:\n' +
            '• Duplicate records will be skipped\n' +
            '• Only new clients will be added\n' +
            '• Existing client data will be preserved\n\n' +
            'Do you want to continue with the upload?',
        );
        if (!confirmed) return;
      }
    } catch {
      // Continue with upload if check fails
    }

    await performUpload(file);
  };

  // ---- Date mismatch confirm (re-upload bypassing date check) ----

  const handleConfirmDateMismatchUpload = async () => {
    if (pendingFile) {
      await performUpload(pendingFile, true);
    }
  };

  const handleCloseDateMismatchModal = () => {
    setIsModalOpen(false);
    setDateMismatchWarning(null);
    setPendingFile(null);
  };

  return (
    <Box>
      {/* Drop Zone + Progress */}
      <CSVDropZone
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onFileSelect={handleFileSelect}
      />

      {/* Results */}
      {uploadResult && (
        <Box mt={4}>
          {uploadResult.success ? (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>CSV Import Successful!</AlertTitle>
                <AlertDescription>
                  {uploadResult.message}
                  {uploadResult.expiresAt && (
                    <Text fontSize="sm" mt={1}>
                      Data expires:{' '}
                      {formatDateTime(uploadResult.expiresAt)}
                    </Text>
                  )}
                </AlertDescription>
              </Box>
            </Alert>
          ) : (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Import Failed</AlertTitle>
                <AlertDescription>{uploadResult.message}</AlertDescription>
              </Box>
            </Alert>
          )}
        </Box>
      )}

      {/* Expected Format Info */}
      <Box mt={4} p={4} bg="blue.50" borderRadius="md">
        <Flex align="center" mb={2}>
          <Icon as={FiInfo} color="blue.500" mr={2} />
          <Text fontSize="sm" fontWeight="medium" color="blue.700">
            Expected CSV Format
          </Text>
        </Flex>
        <Text fontSize="sm" color="blue.600" mb={2}>
          <strong>Required Headers:</strong>
        </Text>
        <VStack align="start" spacing={1} mt={2}>
          <Text fontSize="xs" color="blue.600">• <strong>Client #</strong> - Client ID number</Text>
          <Text fontSize="xs" color="blue.600">• <strong>Name</strong> - Full name</Text>
          <Text fontSize="xs" color="blue.600">• <strong>Pick Up Date</strong> - Format: &quot;{new Date().toLocaleDateString('en-CA', { timeZone: tz })} @ 9:00 AM&quot;</Text>
          <Text fontSize="xs" color="blue.600">• <strong>Dietary Considerations</strong> - Any dietary preferences</Text>
          <Text fontSize="xs" color="blue.600">• <strong>Items Provided</strong> - Items given to client</Text>
          <Text fontSize="xs" color="blue.600">• <strong>Adults</strong> - Number of adults</Text>
          <Text fontSize="xs" color="blue.600">• <strong>Seniors</strong> - Number of seniors</Text>
          <Text fontSize="xs" color="blue.600">• <strong>Children</strong> - Number of children</Text>
          <Text fontSize="xs" color="blue.600">• <strong>Children's Ages</strong> - Ages of children</Text>
          <Text fontSize="xs" color="blue.600">• <strong>Email</strong> - Client email</Text>
          <Text fontSize="xs" color="blue.600">• <strong>Phone Number</strong> - Client phone number</Text>
        </VStack>
      </Box>

      {/* Date Mismatch Modal */}
      <CSVDateMismatchModal
        isOpen={isModalOpen}
        onClose={handleCloseDateMismatchModal}
        onConfirm={handleConfirmDateMismatchUpload}
        warningMessage={dateMismatchWarning}
        isUploading={isUploading}
      />
    </Box>
  );
};

export default CSVUploader;
