/**
 * @fileoverview CSV uploader component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component handles CSV file uploads with drag-and-drop functionality,
 * file validation, and progress tracking. It provides a user-friendly
 * interface for bulk appointment data import.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../CSVUploadPage.tsx} CSV upload page
 */

import React, { useState, useCallback } from 'react';
import {
  Box, Button, VStack, Text, Progress, Alert, AlertIcon, AlertTitle, AlertDescription,
  useToast, Icon, Flex, Spinner, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
} from '@chakra-ui/react';
import { FiUpload, FiFile, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { api } from '../../../lib/api';

interface CSVUploaderProps {
  onUploadSuccess?: () => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [dateMismatchWarning, setDateMismatchWarning] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  
  const closeModal = () => setIsModalOpen(false);

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select a CSV file exported from Link2Feed. The file must have a .csv extension.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: 'File Too Large',
        description: 'The selected file exceeds the 10MB limit. Please export a smaller file from Link2Feed or contact support if you need to upload larger files.',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Warn if data already exists
    try {
      const statusResponse = await api('/status/day');
      const statusResult = await statusResponse.json();
      
      if (statusResult.success && statusResult.data?.present) {
        const confirmed = window.confirm(
          '⚠️ CSV data already exists in the system!\n\n' +
          `Current records: ${statusResult.data.count}\n\n` +
          'If you upload a new CSV file:\n' +
          '• Duplicate records will be skipped\n' +
          '• Only new clients will be added\n' +
          '• Existing client data will be preserved\n\n' +
          'Do you want to continue with the upload?'
        );
        
        if (!confirmed) {
          return;
        }
      }
    } catch (error) {
      // Continue with upload if check fails
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('csv', file);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await api('/csv/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success) {
        const message = result.duplicates > 0 
          ? `Successfully imported ${result.added} new records (${result.duplicates} duplicates skipped)`
          : `Successfully imported ${result.added} records`;
        
        setUploadResult({
          success: true,
          count: result.added || result.count,
          expiresAt: result.expiresAt,
          message: message,
          warning: result.warning,
          csvDate: result.csvDate,
          todayDate: result.todayDate
        });
        
        // Show success toast
        toast({
          title: 'CSV Import Complete',
          description: message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Show warning toast if date mismatch
        if (result.warning) {
          if (result.warning.includes('ERROR')) {
            // Show modal for errors
            setDateMismatchWarning(result.warning);
            setPendingFile(file);
            setIsModalOpen(true);
          } else {
            // Show toast for warnings
            toast({
              title: 'Date Mismatch Detected',
              description: result.warning,
              status: 'warning',
              duration: 6000,
              isClosable: true,
            });
          }
        }

        if (onUploadSuccess) {
          onUploadSuccess();
        }
        
        // Trigger immediate status refresh to start polling
        window.dispatchEvent(new CustomEvent('csvDataImported', { 
          detail: { count: result.count } 
        }));
      } else {
        setUploadResult({
          success: false,
          message: result.error || 'Import failed',
          errors: result.errors || []
        });

        toast({
          title: 'Import Failed',
          description: result.error || 'The CSV file could not be imported. Please verify the file format matches the Link2Feed export format and try again.',
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        message: 'Upload failed. Please check your connection and try again.'
      });

      toast({
        title: 'Upload Failed',
        description: 'Unable to upload the file. Please check your internet connection and try again. If the problem persists, contact technical support.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleConfirmDateMismatchUpload = async () => {
    if (pendingFile) {
      closeModal();
      setDateMismatchWarning(null);
      // Re-upload the file bypassing date check (force upload)
      await uploadFileDirectly(pendingFile);
      setPendingFile(null);
    }
  };

  const uploadFileDirectly = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('csv', file);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await api('/csv/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success) {
        const message = result.duplicates > 0 
          ? `Successfully imported ${result.added} new records (${result.duplicates} duplicates skipped)`
          : `Successfully imported ${result.added} records`;
        
        setUploadResult({
          success: true,
          count: result.added || result.count,
          expiresAt: result.expiresAt,
          message: message,
          warning: result.warning,
          csvDate: result.csvDate,
          todayDate: result.todayDate
        });
        
        toast({
          title: 'CSV Import Successful!',
          description: message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        if (onUploadSuccess) {
          onUploadSuccess();
        }
        
        window.dispatchEvent(new CustomEvent('csvDataImported', { 
          detail: { count: result.count } 
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Unable to upload file. Please try again.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <Box>
      {/* Upload Zone */}
      <Box
        border="2px dashed"
        borderColor={dragActive ? "blue.400" : "gray.300"}
        borderRadius="lg"
        p={8}
        textAlign="center"
        bg={dragActive ? "blue.50" : "gray.50"}
        transition="all 0.2s"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        cursor="pointer"
        _hover={{ borderColor: "blue.400", bg: "blue.50" }}
      >
        <VStack spacing={4}>
          <Icon as={FiUpload} boxSize={8} color="blue.500" />
          <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              Drop your CSV file here
            </Text>
            <Text fontSize="sm" color="gray.500">
              or click to browse files
            </Text>
          </VStack>
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={() => document.getElementById('csv-file-input')?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Spinner size="sm" /> : 'Select File'}
          </Button>
          <input
            id="csv-file-input"
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            disabled={isUploading}
          />
        </VStack>
      </Box>

      {/* Progress */}
      {isUploading && (
        <Box mt={4}>
          <Flex align="center" mb={2}>
            <Icon as={FiFile} mr={2} />
            <Text fontSize="sm" color="gray.600">Uploading CSV file...</Text>
          </Flex>
          <Progress value={uploadProgress} colorScheme="blue" size="sm" />
        </Box>
      )}

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
                      Data expires: {new Date(uploadResult.expiresAt).toLocaleString()}
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
                <AlertDescription>
                  {uploadResult.message}
                </AlertDescription>
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
          <Text fontSize="xs" color="blue.600">
            • <strong>Client #</strong> - Client ID number
          </Text>
          <Text fontSize="xs" color="blue.600">
            • <strong>Name</strong> - Full name
          </Text>
          <Text fontSize="xs" color="blue.600">
            • <strong>Pick Up Date</strong> - Format: "${new Date().toISOString().split('T')[0]} @ 9:00 AM"
          </Text>
          <Text fontSize="xs" color="blue.600">
            • <strong>Dietary Considerations</strong> - Any dietary preferences
          </Text>
          <Text fontSize="xs" color="blue.600">
            • <strong>Items Provided</strong> - Items given to client
          </Text>
          <Text fontSize="xs" color="blue.600">
            • <strong>Adults</strong> - Number of adults
          </Text>
          <Text fontSize="xs" color="blue.600">
            • <strong>Seniors</strong> - Number of seniors
          </Text>
          <Text fontSize="xs" color="blue.600">
            • <strong>Children</strong> - Number of children
          </Text>
          <Text fontSize="xs" color="blue.600">
            • <strong>Children's Ages</strong> - Ages of children
          </Text>
          <Text fontSize="xs" color="blue.600">
            • <strong>Email</strong> - Client email
          </Text>
          <Text fontSize="xs" color="blue.600">
            • <strong>Phone Number</strong> - Client phone number
          </Text>
        </VStack>
      </Box>

      {/* Date Mismatch Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>
            <Flex align="center" gap={3}>
              <Icon as={FiAlertCircle} color="orange.500" boxSize={6} />
              Date Mismatch Warning
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <AlertTitle>Incorrect Date in CSV File</AlertTitle>
                <AlertDescription fontSize="sm">
                  {dateMismatchWarning}
                </AlertDescription>
              </VStack>
            </Alert>
            
            <VStack spacing={4} align="stretch">
              <Text fontWeight="bold" color="orange.600">
                What this means:
              </Text>
              <Box bg="orange.50" p={4} borderRadius="md" border="1px" borderColor="orange.200">
                <VStack spacing={2} align="start">
                  <Text fontSize="sm">
                    ❌ <strong>Client check-ins will NOT work</strong> - clients won't be able to find their appointments
                  </Text>
                  <Text fontSize="sm">
                    ✅ <strong>Data will be stored</strong> - you can still view it in the admin panel
                  </Text>
                  <Text fontSize="sm">
                    ⚠️ <strong>Recommended:</strong> Fix the CSV date to match today ({new Date().toISOString().split('T')[0]}) before uploading
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={closeModal}>
              Cancel Upload
            </Button>
            <Button 
              colorScheme="orange" 
              onClick={handleConfirmDateMismatchUpload}
              isLoading={isUploading}
            >
              Upload Anyway (Not Recommended)
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CSVUploader;
