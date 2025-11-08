/**
 * @fileoverview CSV upload page for Foodbank Check-In and Appointment System admin panel
 * 
 * This page handles CSV file uploads for bulk appointment data import.
 * It provides file validation, preview functionality, and processing
 * status updates for managing daily appointment schedules.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../components/features/csv/CSVUploader.tsx} Upload component
 */

import React, { useState, useEffect } from 'react';
import { api, clearAllData } from '../lib/api';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Badge,
  Icon,
  Alert,
  AlertIcon,
  Spinner,
  Button,
  Wrap,
  WrapItem,
  Divider,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { 
  FiInfo, 
  FiCalendar, 
  FiUpload, 
  FiClock,
  FiRefreshCw,
  FiFileText,
  FiDatabase,
  FiDownload,
  FiTrash2
} from 'react-icons/fi';
import CSVUploader from '../components/features/csv/CSVUploader';

interface DayStatus {
  today: string;
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
  const { isOpen: isClearOpen, onOpen: onClearOpen, onClose: onClearClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    fetchStatus();
    // No auto-refresh - only update when manually triggered
  }, []);

  const fetchStatus = async (retryCount = 0) => {
    try {
      const response = await api('/status/day');
      const result = await response.json();
      
      if (result.success) {
        setStatus(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch status');
      }
    } catch (err) {
      // Backend not running - show friendly message instead of error
      console.log('Backend not available, showing upload prompt');
      setStatus({
        today: new Date().toLocaleDateString(),
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
      console.error('Clear data error:', error);
      toast({
        title: 'Clear Failed',
        description: error instanceof Error ? error.message : 'Unable to clear data. Please try again or contact technical support.',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  const handleDownloadSample = () => {
    // Create a sample CSV content matching the exact system format
    const sampleCSV = `Client #,Name,Pick Up Date,Dietary Considerations,Items Provided,Adults,Seniors,Children,Children's Ages,Email,Phone Number
2964486,John Doe,${new Date().toISOString().split('T')[0]} @ 9:00 AM,,1.00 x Snack Pack - $30, 1.00 x Multi - $300, 1.00 x Vitality Single - $10,2,0,1,,johndoe@gmail.com,2507637161
1367054,Wendy Sally,${new Date().toISOString().split('T')[0]} @ 9:00 AM,,1.00 x Single - $175,1,0,0,,wendysally@gmail.com,2502125566
611361,Rosa Parks,${new Date().toISOString().split('T')[0]} @ 9:00 AM,55+, Other (Specify),1.00 x Double - $200, 1.00 x Vitality Double - $15,0,2,0,,rosaparks@gmail.com,2505501155
785407,Sally Sepor,${new Date().toISOString().split('T')[0]} @ 9:00 AM,Fibromyalgia, Diabetes, 55+,1.00 x Single - $175, 1.00 x Vitality Single - $10,0,1,0,,test@gmail.com,2506606666
3331009,Norma Ada,${new Date().toISOString().split('T')[0]} @ 9:00 AM,,1.00 x Single - $175,1,0,0,,test@gmail.com,2502122525
5594238,Wendy Willy,${new Date().toISOString().split('T')[0]} @ 9:00 AM,,1.00 x Double - $200,1,0,0,,test@gmail.com,2503003300`;

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
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Box textAlign="center" mb={2}>
        <Heading size="xl" color="admin.primary" mb={2} fontWeight="700" letterSpacing="-0.025em">
          Data Upload
        </Heading>
        <Text color="gray.600" fontSize="lg" maxW="600px" mx="auto" fontWeight="500">
          Upload your Link2Feed CSV file to see today's appointments and client check-ins
        </Text>
      </Box>

      {/* Status Overview */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        {/* Today's Date */}
        <GridItem>
          <Box 
            bg="white" 
            borderRadius="2xl" 
            boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
            p={6} 
            textAlign="center" 
            h="full"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: '#2B7B8C',
              borderRadius: '2xl 2xl 0 0',
            }}
          >
            <VStack spacing={4} h="full" justify="center">
              <Box
                bg="cofb.blue"
                color="white"
                borderRadius="xl"
                p={4}
                display="inline-flex"
              >
                <Icon as={FiCalendar} color="#2B7B8C" boxSize={6} />
              </Box>
              <VStack spacing={2}>
                <Text fontSize="sm" color="#2B7B8C" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                  Today's Date
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="#25385D">
                  {status?.today || 'Loading...'}
                </Text>
              </VStack>
            </VStack>
          </Box>
        </GridItem>

        {/* Data Status */}
        <GridItem>
          <Box 
            bg="white" 
            borderRadius="2xl" 
            boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
            p={6} 
            textAlign="center" 
            h="full"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: getStatusColor() === 'green' ? '#8CAB6D' : '#E76F51',
              borderRadius: '2xl 2xl 0 0',
            }}
          >
            <VStack spacing={4} h="full" justify="center">
              <Box
                bg={getStatusColor() === 'green' ? 'cofb.green' : 'cofb.coral'}
                color="white"
                borderRadius="xl"
                p={4}
                display="inline-flex"
              >
                <Icon as={FiDatabase} color={getStatusColor() === 'green' ? '#8CAB6D' : '#E76F51'} boxSize={6} />
              </Box>
              <VStack spacing={2}>
                <Text fontSize="sm" color={getStatusColor() === 'green' ? '#8CAB6D' : '#E76F51'} fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                  Data Status
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="#25385D">
                  {getStatusText()}
                </Text>
              </VStack>
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      {/* Quick Stats */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
        {/* Records Count */}
        <GridItem>
          <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.200" p={5} textAlign="center" h="full">
            <VStack spacing={3} h="full" justify="center">
              <Box
                bg="blue.100"
                borderRadius="full"
                p={3}
                display="inline-flex"
              >
                <Icon as={FiDatabase} color="#2B7B8C" boxSize={5} />
              </Box>
              <VStack spacing={1}>
                <Text fontSize="xs" color="#2B7B8C" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                  Client Appointments Loaded
                </Text>
                {loading ? (
                  <Spinner size="md" color="#25385D" />
                ) : error ? (
                  <Text color="#E76F51" fontSize="sm">Error</Text>
                ) : (
                  <Text fontSize="2xl" fontWeight="bold" color="#25385D">
                    {status?.data.count || 0}
                  </Text>
                )}
                {status?.data.present && status.data.expiresAt && (
                  <Text color="#F4A261" fontSize="xs">
                    <Icon as={FiClock} mr={1} />
                    Expires in {formatExpiryTime(status.data.expiresAt)}
                  </Text>
                )}
              </VStack>
            </VStack>
          </Box>
        </GridItem>

        {/* System Status */}
        <GridItem>
          <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.200" p={5} textAlign="center" h="full">
            <VStack spacing={3} h="full" justify="center">
              <Box
                bg="green.100"
                borderRadius="full"
                p={3}
                display="inline-flex"
              >
                <Icon as={FiUpload} color="#8CAB6D" boxSize={5} />
              </Box>
              <VStack spacing={1}>
                <Text fontSize="xs" color="#8CAB6D" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                  System Status
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="#25385D">
                  Ready
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Ready to accept uploads
                </Text>
              </VStack>
            </VStack>
          </Box>
        </GridItem>

        {/* Quick Actions */}
        <GridItem>
          <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.200" p={5} h="full">
            <VStack spacing={3} h="full" justify="center">
              <Box
                bg="blue.100"
                borderRadius="full"
                p={3}
                display="inline-flex"
              >
                <Icon as={FiRefreshCw} color="#2B7B8C" boxSize={5} />
              </Box>
              <VStack spacing={2} w="full">
                <Button
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<FiRefreshCw />}
                  onClick={() => fetchStatus()}
                  isLoading={loading}
                  w="full"
                  borderRadius="md"
                >
                  Refresh Status
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  leftIcon={<FiDownload />}
                  w="full"
                  borderRadius="md"
                  isDisabled
                >
                  Download Template
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  leftIcon={<FiTrash2 />}
                  onClick={handleClearAllData}
                  w="full"
                  borderRadius="md"
                >
                  Clear All Data
                </Button>
              </VStack>
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      {/* Main Upload Section */}
      <Box bg="white" borderRadius="xl" boxShadow="lg" border="2px solid" borderColor="#25385D" overflow="hidden">
        <Box 
          bg="#25385D"
          color="white"
          textAlign="center"
          py={4}
          px={4}
        >
          <VStack spacing={3}>
            <Box
              bg="whiteAlpha.200"
              borderRadius="full"
              p={3}
              display="inline-flex"
            >
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
        
        <Box p={6}>
          <CSVUploader onUploadSuccess={handleUploadSuccess} />
        </Box>
      </Box>

      {/* Instructions & Help */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {/* Instructions */}
        <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden">
          <Box bg="blue.50" px={6} py={4} borderBottom="1px solid" borderColor="blue.100">
            <HStack spacing={3}>
              <Icon as={FiFileText} color="blue.600" boxSize={6} />
              <Heading size="md" color="#25385D">
                How to Upload Data
              </Heading>
            </HStack>
          </Box>
          <Box p={6}>
            <VStack spacing={4} align="stretch">
              {/* Step 1 */}
              <Box>
                <Text fontWeight="600" color="gray.700" mb={2}>1. Export the CSV from Link2Feed</Text>
                <VStack spacing={2} align="stretch" fontSize="sm" color="gray.600">
                  <Text>• Log in to Link2Feed</Text>
                  <Text>• Go to <Text as="span" fontFamily="mono" bg="gray.100" px={1} borderRadius="sm">Clients → Appointment List</Text></Text>
                  <Text>• Set filters: Location = your food bank site, Start/End Date = today's date, Status = Pending</Text>
                  <Text>• Click Filter to generate the list</Text>
                  <Text>• Choose <Text as="span" fontWeight="semibold" color="red.600">CSV (⚠️ not Mail Merge)</Text></Text>
                  <Text>• Save as <Text as="span" fontFamily="mono" bg="gray.100" px={1} borderRadius="sm">data_YYYY-MM-DD.csv</Text></Text>
                </VStack>
              </Box>

              <Divider />

              {/* Step 2 */}
              <Box>
                <Text fontWeight="600" color="gray.700" mb={2}>2. Upload to the Dashboard</Text>
                <VStack spacing={2} align="stretch" fontSize="sm" color="gray.600">
                  <Text>• Click "Upload CSV" above and select your file</Text>
                  <Text>• Wait a few seconds — the dashboard will refresh automatically</Text>
                </VStack>
              </Box>

              <Divider />

              {/* Step 3 */}
              <Box>
                <Text fontWeight="600" color="gray.700" mb={2}>3. Confirm Success</Text>
                <VStack spacing={2} align="stretch" fontSize="sm" color="gray.600">
                  <Text>• Data Status shows "Complete"</Text>
                  <Text>• Records Loaded shows the number of rows imported</Text>
                  <Text>• Upload Progress shows 100%</Text>
                  <Text>• Sidebar shows "CSV Data Available: ACTIVE"</Text>
                </VStack>
              </Box>

              <Divider />

              {/* Required Headers */}
              <Box>
                <Text fontWeight="600" color="gray.700" mb={2}>Required Headers:</Text>
                <Wrap spacing={2}>
                  {['Client #', 'Name', 'Pick Up Date', 'Dietary Considerations', 'Items Provided', 'Adults', 'Seniors', 'Children', 'Children\'s Ages', 'Email', 'Phone Number'].map((header) => (
                    <WrapItem key={header}>
                      <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                        {header}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>

              <Divider />

              {/* Common Errors */}
              <Box>
                <Text fontWeight="600" color="red.600" mb={2}>Common Errors:</Text>
                <VStack spacing={2} align="stretch" fontSize="sm" color="gray.600">
                  <Text><Text as="span" fontWeight="semibold">Wrong File Error</Text> → Export "Appointment List (CSV)" not "Mail Merge" or "Client List"</Text>
                  <Text><Text as="span" fontWeight="semibold">Missing Columns Error</Text> → File must contain all required headers listed above</Text>
                </VStack>
              </Box>

              <Divider />

              {/* Daily Reminder */}
              <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                <Text fontSize="sm" color="blue.700" fontWeight="medium" mb={1}>
                  📅 Daily Reminder
                </Text>
                <Text fontSize="xs" color="blue.600">
                  Upload must be done once per day (data expires after 24 hours). If not uploaded, the dashboard and check-in system will not show appointments.
                </Text>
              </Box>
            </VStack>
          </Box>
        </Box>

        {/* Help & Support */}
        <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden">
          <Box bg="green.50" px={6} py={4} borderBottom="1px solid" borderColor="green.100">
            <HStack spacing={3}>
              <Icon as={FiInfo} color="green.600" boxSize={6} />
              <Heading size="md" color="#25385D">
                Help & Support
              </Heading>
            </HStack>
          </Box>
          <Box p={6}>
            <VStack spacing={4} align="stretch">
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <Text fontSize="sm" fontWeight="500">Need Help?</Text>
                  <Text fontSize="xs" color="gray.600">
                    Contact your system administrator for assistance with CSV formatting or upload issues.
                  </Text>
                </Box>
              </Alert>
              
              <VStack spacing={3} align="stretch">
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  leftIcon={<FiFileText />}
                  onClick={() => window.dispatchEvent(new CustomEvent('openHelp'))}
                >
                  Open Help Center
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  leftIcon={<FiDownload />}
                  onClick={handleDownloadSample}
                >
                  Download Sample CSV
                </Button>
              </VStack>
              
              <Box bg="gray.50" p={4} borderRadius="lg">
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  <Icon as={FiClock} mr={1} />
                  Last updated: {new Date().toLocaleDateString()}
                </Text>
              </Box>
            </VStack>
          </Box>
        </Box>
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
              <Button colorScheme="red" onClick={confirmClearData} ml={3}>
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

