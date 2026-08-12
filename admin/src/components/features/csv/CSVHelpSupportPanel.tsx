/**
 * @fileoverview CSV help & support panel
 */

import React from 'react';
import { Alert, AlertIcon, Box, Button, Heading, HStack, Icon, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { FiClock, FiDownload, FiFileText, FiInfo } from 'react-icons/fi';
import { useTenantTime } from '../../../utils/useTenantTime';

interface CSVHelpSupportPanelProps {
  onDownloadSample: () => void;
}

const CSVHelpSupportPanel: React.FC<CSVHelpSupportPanelProps> = ({ onDownloadSample }) => {
  const { tz } = useTenantTime();
  return (
    <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden" w="full" maxW="100%">
      <Box bg="green.50" px={{ base: 4, sm: 5, md: 6 }} py={{ base: 3, sm: 3, md: 4 }} borderBottom="1px solid" borderColor="green.100">
        <HStack spacing={3}>
          <Icon as={FiInfo} color="green.600" boxSize={6} />
          <Heading size="md" color="admin.primary">
            Help & Support
          </Heading>
        </HStack>
      </Box>
      <Box p={{ base: 4, sm: 5, md: 6 }} w="full" maxW="100%">
        <VStack spacing={4} align="stretch">
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <Box>
              <Text fontSize="sm" fontWeight="500">
                Need Help?
              </Text>
              <Text fontSize="xs" color="gray.600">
                Contact your system administrator for assistance with CSV formatting or upload issues.
              </Text>
            </Box>
          </Alert>

          <SimpleGrid
            columns={{ base: 1, sm: 2 }}
            spacing={3}
            minChildWidth="200px"
            w="full"
          >
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              leftIcon={<FiFileText />}
              onClick={() => window.dispatchEvent(new CustomEvent('openHelp'))}
              w="full"
            >
              Open Help Center
            </Button>

            <Button
              size="sm"
              variant="outline"
              colorScheme="gray"
              leftIcon={<FiDownload />}
              onClick={onDownloadSample}
              w="full"
            >
              Download Sample CSV
            </Button>
          </SimpleGrid>

          <Box bg="gray.50" p={4} borderRadius="lg">
            <Text fontSize="xs" color="gray.600" textAlign="center">
              <Icon as={FiClock} mr={1} />
              Last updated: {new Date().toLocaleDateString('en-US', { timeZone: tz })}
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default CSVHelpSupportPanel;
