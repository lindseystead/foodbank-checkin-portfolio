/**
 * @fileoverview CSV help modal component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides help documentation and instructions for CSV uploads,
 * including format requirements, field mappings, and troubleshooting tips
 * for admin staff using the system.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../CSVUploadPage.tsx} CSV upload page
 */

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Box,
  Divider,
  List,
  ListItem,
  ListIcon,
  Code,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';

interface CSVHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CSVHelpModal: React.FC<CSVHelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="white" color="gray.800">
        <ModalHeader color="admin.primary" fontWeight="semibold">Admin Help Center</ModalHeader>
        <ModalCloseButton color="gray.600" />
        <ModalBody pb={6} color="gray.800">
          <VStack spacing={6} align="stretch">
            {/* Overview */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={3} color="admin.primary">
                Foodbank Check-In and Appointment System — Admin Staff
              </Text>
              <Text fontSize="sm" color="gray.700" mb={4}>
                The dashboard shows today's data only after you upload the Link2Feed CSV file. Follow these steps every day.
              </Text>
              
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Important:</AlertTitle>
                  <AlertDescription>
                    Only upload CSV files exported from Link2Feed Appointment List. Choose CSV (⚠️ not Mail Merge) when exporting.
                  </AlertDescription>
                </Box>
              </Alert>
            </Box>

            <Divider />

            {/* Step 1 */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="admin.primary">
                1. Export the CSV from Link2Feed
              </Text>
              <List spacing={2} fontSize="sm">
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  Log in to Link2Feed
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  Go to <Code color="admin.primary">Clients → Appointment List</Code>
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  At the top, set filters: Location = the food bank site, Start Date / End Date = today's date, Status = Booked/Confirmed (or Any if unsure)
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  Click Filter to generate the list
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  In the export options, choose <Text as="span" fontWeight="semibold" color="red.600">CSV (⚠️ not Mail Merge)</Text>
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  Save the file as <Code color="admin.primary">data_YYYY-MM-DD.csv</Code> (example: data_${new Date().toISOString().split('T')[0]}.csv)
                </ListItem>
              </List>
            </Box>

            <Divider />

            {/* Step 2 */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="admin.primary">
                2. Upload to the Dashboard
              </Text>
              <List spacing={2} fontSize="sm">
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  Log in to the Foodbank Check-In and Appointment System admin panel
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  On the sidebar, click CSV Upload
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  Click Upload CSV and select the file you saved
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  Wait a few seconds — the dashboard will refresh automatically
                </ListItem>
              </List>
            </Box>

            <Divider />

            {/* Step 3 */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="admin.primary">
                3. Confirm Success
              </Text>
              <List spacing={2} fontSize="sm">
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  Data Status will show: Records Loaded → number of rows imported
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  Status: Complete
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  Upload Progress: 100%
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  You should see "CSV Data Available: ACTIVE" in the sidebar
                </ListItem>
              </List>
            </Box>

            <Divider />

            {/* Required Headers */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="admin.primary">
                Required Headers
              </Text>
              <Text fontSize="sm" color="gray.700" mb={3}>
                The file must contain: Client #, Name, Pick Up Date, Dietary Considerations, Items Provided, Adults, Seniors, Children, Children's Ages, Email, Phone Number
              </Text>
            </Box>

            <Divider />

            {/* Common Errors */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="admin.primary">
                Common Errors
              </Text>
              <VStack spacing={3} align="stretch">
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Wrong File Error</AlertTitle>
                    <AlertDescription fontSize="sm">
                      This happens if you export "Mail Merge" or "Client List" instead of "Appointment List (CSV)." Fix: Go back to Link2Feed → Appointment List → Export → CSV.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Missing Columns Error</AlertTitle>
                    <AlertDescription fontSize="sm">
                      The file must contain all required headers listed above. Check that your Link2Feed export includes all necessary columns.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </Box>

            <Divider />

            {/* Daily Reminder */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="admin.primary">
                Daily Reminder
              </Text>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Important:</AlertTitle>
                  <AlertDescription fontSize="sm">
                    Upload must be done once per day (data expires after 24 hours). If the file is not uploaded, the dashboard and check-in system will not show appointments.
                  </AlertDescription>
                </Box>
              </Alert>
            </Box>

            <Divider />

            {/* Admin System Overview */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="admin.primary">
                🏠 Admin System Overview
              </Text>
              <Text fontSize="sm" color="gray.700" mb={3}>
                The Foodbank Check-In and Appointment System Admin System helps you manage daily operations efficiently.
              </Text>
              
              <List spacing={2} fontSize="sm">
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  <Text as="span" fontWeight="semibold" color="admin.primary">Dashboard:</Text> View today's overview, data status, and quick actions
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  <Text as="span" fontWeight="semibold" color="admin.primary">CSV Upload:</Text> Import daily appointment data from Link2Feed
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  <Text as="span" fontWeight="semibold" color="admin.primary">Check-ins:</Text> Monitor client check-ins and appointment status
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  <Text as="span" fontWeight="semibold" color="admin.primary">Settings:</Text> Configure system preferences and integrations
                </ListItem>
              </List>
            </Box>

            <Divider />

            {/* Quick Start Guide */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="admin.primary">
                🚀 Daily Workflow
              </Text>
              <List spacing={2} fontSize="sm">
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="blue.500" />
                  <Text as="span" fontWeight="semibold" color="admin.primary">Morning:</Text> Upload today's CSV file from Link2Feed
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="blue.500" />
                  <Text as="span" fontWeight="semibold" color="admin.primary">During Day:</Text> Monitor check-ins and client activity
                </ListItem>
                <ListItem color="gray.800">
                  <ListIcon as={FiCheckCircle} color="blue.500" />
                  <Text as="span" fontWeight="semibold" color="admin.primary">Evening:</Text> Review daily reports and prepare for tomorrow
                </ListItem>
              </List>
            </Box>

            <Divider />

            {/* Troubleshooting */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="admin.primary">
                🔧 Common Issues & Solutions
              </Text>
              <VStack spacing={3} align="stretch">
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Dashboard shows "No Data"</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Solution: Upload today's CSV file from Link2Feed. Data expires after 24 hours.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>CSV Upload fails</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Check: File must be "Appointment List (CSV)" not "Mail Merge". Ensure all required columns are present.
                    </AlertDescription>
                  </Box>
                </Alert>

                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Client search not working</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Solution: Ensure CSV data is uploaded and contains client information. Try searching by ID, name, or phone.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </Box>

            <Divider />

            {/* Contact Support */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="admin.primary">
                📞 Need More Help?
              </Text>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Contact Support</AlertTitle>
                  <AlertDescription fontSize="sm">
                    For technical issues or questions not covered here, contact your system administrator or IT support team.
                  </AlertDescription>
                </Box>
              </Alert>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { CSVHelpModal };
