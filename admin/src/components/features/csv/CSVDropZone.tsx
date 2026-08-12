/**
 * @fileoverview CSV drag-and-drop upload zone component
 *
 * Provides a styled drop zone with drag state highlighting,
 * file input button, and upload progress indicator.
 *
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 */

import React, { useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  Progress,
  Flex,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { FiUpload, FiFile } from 'react-icons/fi';

interface CSVDropZoneProps {
  isUploading: boolean;
  uploadProgress: number;
  onFileSelect: (file: File) => void;
}

const CSVDropZone: React.FC<CSVDropZoneProps> = ({
  isUploading,
  uploadProgress,
  onFileSelect,
}) => {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect],
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <>
      <Box
        border="2px dashed"
        borderColor={dragActive ? 'blue.400' : 'gray.300'}
        borderRadius="lg"
        p={8}
        textAlign="center"
        bg={dragActive ? 'blue.50' : 'gray.50'}
        transition="all 0.2s"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        cursor="pointer"
        _hover={{ borderColor: 'blue.400', bg: 'blue.50' }}
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
            onClick={() =>
              document.getElementById('csv-file-input')?.click()
            }
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

      {isUploading && (
        <Box mt={4}>
          <Flex align="center" mb={2}>
            <Icon as={FiFile} mr={2} />
            <Text fontSize="sm" color="gray.600">
              Uploading CSV file...
            </Text>
          </Flex>
          <Progress value={uploadProgress} colorScheme="blue" size="sm" />
        </Box>
      )}
    </>
  );
};

export default CSVDropZone;
