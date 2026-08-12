/**
 * @fileoverview CSV instructions panel
 */

import React from 'react';
import { Badge, Box, Divider, HStack, Heading, Icon, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';

const REQUIRED_HEADERS = [
  'Client #',
  'Name',
  'Pick Up Date',
  'Dietary Considerations',
  'Items Provided',
  'Adults',
  'Seniors',
  'Children',
  "Children's Ages",
  'Email',
  'Phone Number',
];

const CSVInstructionsPanel: React.FC = () => {
  return (
    <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden" w="full" maxW="100%">
      <Box bg="blue.50" px={{ base: 4, sm: 5, md: 6 }} py={{ base: 3, sm: 3, md: 4 }} borderBottom="1px solid" borderColor="blue.100">
        <HStack spacing={3}>
          <Icon as={FiFileText} color="blue.600" boxSize={6} />
          <Heading size="md" color="admin.primary">
            How to Upload Data
          </Heading>
        </HStack>
      </Box>
      <Box p={{ base: 4, sm: 5, md: 6 }} w="full" maxW="100%">
        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontWeight="600" color="gray.700" mb={2}>
              1. Export the CSV from Link2Feed
            </Text>
            <VStack spacing={2} align="stretch" fontSize="sm" color="gray.600">
              <Text>• Log in to Link2Feed</Text>
              <Text>
                • Go to{' '}
                <Text as="span" fontFamily="mono" bg="gray.100" px={1} borderRadius="sm">
                  Clients → Appointment List
                </Text>
              </Text>
              <Text>• Set filters: Location = your food bank site, Start/End Date = today's date, Status = Pending</Text>
              <Text>• Click Filter to generate the list</Text>
              <Text>
                • Choose{' '}
                <Text as="span" fontWeight="semibold" color="red.600">
                  CSV (⚠️ not Mail Merge)
                </Text>
              </Text>
              <Text>
                • Save as{' '}
                <Text as="span" fontFamily="mono" bg="gray.100" px={1} borderRadius="sm">
                  data_YYYY-MM-DD.csv
                </Text>
              </Text>
            </VStack>
          </Box>

          <Divider />

          <Box>
            <Text fontWeight="600" color="gray.700" mb={2}>
              2. Upload to the Dashboard
            </Text>
            <VStack spacing={2} align="stretch" fontSize="sm" color="gray.600">
              <Text>• Click "Upload CSV" above and select your file</Text>
              <Text>• Wait a few seconds — the dashboard will refresh automatically</Text>
            </VStack>
          </Box>

          <Divider />

          <Box>
            <Text fontWeight="600" color="gray.700" mb={2}>
              3. Confirm Success
            </Text>
            <VStack spacing={2} align="stretch" fontSize="sm" color="gray.600">
              <Text>• Data Status shows "Complete"</Text>
              <Text>• Records Loaded shows the number of rows imported</Text>
              <Text>• Upload Progress shows 100%</Text>
              <Text>• Sidebar shows "CSV Data Available: ACTIVE"</Text>
            </VStack>
          </Box>

          <Divider />

          <Box>
            <Text fontWeight="600" color="gray.700" mb={2}>
              Required Headers:
            </Text>
            <Wrap spacing={2}>
              {REQUIRED_HEADERS.map((header) => (
                <WrapItem key={header}>
                  <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                    {header}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
          </Box>

          <Divider />

          <Box>
            <Text fontWeight="600" color="red.600" mb={2}>
              Common Errors:
            </Text>
            <VStack spacing={2} align="stretch" fontSize="sm" color="gray.600">
              <Text>
                <Text as="span" fontWeight="semibold">
                  Wrong File Error
                </Text>{' '}
                → Export "Appointment List (CSV)" not "Mail Merge" or "Client List"
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold">
                  Missing Columns Error
                </Text>{' '}
                → File must contain all required headers listed above
              </Text>
            </VStack>
          </Box>

          <Divider />

          <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
            <Text fontSize="sm" color="blue.700" fontWeight="medium" mb={1}>
              📅 Daily Reminder
            </Text>
            <Text fontSize="xs" color="blue.600">
              Upload must be done once per day (data expires after 24 hours). If not uploaded, the dashboard and
              check-in system will not show appointments.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default CSVInstructionsPanel;
