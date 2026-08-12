/**
 * @fileoverview Upload card section for CSV upload page
 */

import React from 'react';
import { Box, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';
import CSVUploader from './CSVUploader';

interface CSVUploadSectionProps {
  onUploadSuccess: () => void;
}

const CSVUploadSection: React.FC<CSVUploadSectionProps> = ({ onUploadSuccess }) => {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      w="full"
      maxW="100%"
    >
      <Box bg="admin.primary" color="white" textAlign="center" py={4} px={4}>
        <VStack spacing={3}>
          <Box bg="whiteAlpha.200" borderRadius="full" p={3} display="inline-flex">
            <Icon as={FiUpload} boxSize={6} />
          </Box>
          <VStack spacing={1}>
            <Heading size="md" color="white">
              Upload Today's Data
            </Heading>
            <Text color="whiteAlpha.900" fontSize="sm" maxW="400px">
              Drag and drop your CSV file or click to browse. This enables client check-ins for today.
            </Text>
          </VStack>
        </VStack>
      </Box>

      <Box p={{ base: 4, sm: 5, md: 6 }} w="full" maxW="100%">
        <CSVUploader onUploadSuccess={onUploadSuccess} />
      </Box>
    </Box>
  );
};

export default CSVUploadSection;
