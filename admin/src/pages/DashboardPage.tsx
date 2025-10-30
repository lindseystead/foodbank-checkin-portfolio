/**
 * @fileoverview Dashboard page for Foodbank Check-In and Appointment System admin panel
 * 
 * This is the main dashboard page that provides an overview of daily
 * operations, real-time check-in data, system status, and quick
 * access to all admin functions for the food bank system.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../components/features/dashboard/} Dashboard components
 */

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  GridItem, 
  Heading, 
  Text, 
  VStack,
  HStack,
  Button, 
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { FiSettings, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Import components
import QuickActions from '../components/features/dashboard/QuickActions';
import { CSVHelpModal } from '../components/features/dashboard/CSVHelpModal';
import { CSVStatus } from '../components/features/dashboard/CSVStatus';
import { CSVDataViewer } from '../components/features/csv/CSVDataViewer';
import { ClientLookup } from '../components/features/clients/ClientLookup';
import RecentCheckInsList from '../components/features/dashboard/RecentCheckInsList';
import CheckInAnalyticsChart from '../components/features/dashboard/CheckInAnalyticsChart';
import HelpRequestsTable from '../components/features/dashboard/HelpRequestsTable';
import { CheckInRecord } from '../common/types/checkIn';
import { getApiUrl } from '../common/apiConfig';

const DashboardPage: React.FC = () => {
  const { isOpen: isCSVHelpOpen, onOpen: onCSVHelpOpen, onClose: onCSVHelpClose } = useDisclosure();
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [isLoadingCheckIns, setIsLoadingCheckIns] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const navigate = useNavigate();

  // Real-time data fetching
  const fetchCheckIns = async () => {
    try {
      // Use direct API call to ensure we get real-time data
      const response = await fetch(getApiUrl('/checkin/appointments'));
      const data = await response.json();
      
      if (data.success && data.data) {
        // Use the same data source as Analytics chart for consistency
        const appointments = data.data;
        
        // Filter for today's appointments only (same logic as analytics)
        const todayAppointments = appointments.filter((appointment: CheckInRecord) => {
          if (appointment.appointmentTime) {
            const appointmentDate = new Date(appointment.appointmentTime);
            const today = new Date();
            return appointmentDate.toDateString() === today.toDateString();
          }
          return false;
        });
        
        setCheckIns(todayAppointments);
      } else {
        setCheckIns([]);
      }
    } catch (error) {
      // Only log errors that aren't connection refused (server not running)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('Backend server not available for check-ins, will retry later');
      } else {
        console.error('Failed to fetch check-ins:', error);
      }
      // Don't clear check-ins on connection errors, keep existing data
      if (!(error instanceof TypeError && error.message.includes('Failed to fetch'))) {
        setCheckIns([]);
      }
    } finally {
      setIsLoadingCheckIns(false);
      setLastRefresh(new Date());
    }
  };

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchCheckIns();
    
    // Auto-refresh every 60 seconds (reduced frequency to prevent excessive API calls)
    const interval = setInterval(fetchCheckIns, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Format date helper
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleQuickAction = (actionId: string) => {
    
    switch (actionId) {
      case 'link2feed-config':
        // Navigate to settings page for Link2Feed configuration
        navigate('/settings');
        break;
      case 'upload-csv':
        // Navigate to CSV upload page
        navigate('/csv-upload');
        break;
      case 'view-checkins':
        // Navigate to check-ins page
        navigate('/check-ins');
        break;
      case 'view-settings':
        // Navigate to settings page
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Header Section */}
      <Box mb={{ base: 1, md: 2, lg: 2 }}>
        <VStack 
          spacing={{ base: 3, md: 4 }} 
          align="stretch"
        >
          {/* Title and Description */}
          <VStack align="center" spacing={{ base: 2, md: 3 }} w="full">
            <Heading 
              size="lg" 
              color="admin.primary"
              fontWeight="bold"
              textAlign="center"
              w="full"
            >
              Daily Operations Dashboard
            </Heading>
            <VStack spacing={1}>
              <Text 
                color="gray.600" 
                fontSize="md"
                maxW="600px"
                textAlign="center"
                w="full"
                mx="auto"
              >
                Welcome to the Foodbank Check-In and Appointment System
              </Text>
              <Text 
                fontSize="xs" 
                color="gray.500" 
                textAlign="center"
              >
                Last updated: {lastRefresh.toLocaleTimeString()}
              </Text>
            </VStack>
          </VStack>
          
          {/* Controls Row */}
          <HStack 
            justify="space-between" 
            align="center"
            w="full"
            spacing={4}
            flexWrap="wrap"
          >
            {/* Date */}
            <Box
              bg="#25385D"
              px={{ base: 3, sm: 4 }}
              py={{ base: 2, sm: 3 }}
              borderRadius="lg"
              flexShrink={0}
            >
              <Text 
                fontSize={{ base: "sm", sm: "md" }} 
                fontWeight="bold" 
                color="white" 
                textAlign="center"
                whiteSpace="nowrap"
              >
                {formatDate(new Date())}
              </Text>
            </Box>
            
            {/* Refresh Button */}
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FiRefreshCw />}
              onClick={fetchCheckIns}
              isLoading={isLoadingCheckIns}
              colorScheme="blue"
              flexShrink={0}
            >
              Refresh Data
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Quick Actions and Status */}
      <Box mb={{ base: 1, md: 2 }}>
        <Grid 
          templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }}
          gap={4}
          mb={3}
          alignItems="stretch"
          w="full"
          maxW="1200px"
          mx="auto"
          minH="0"
        >
          <GridItem>
            <Box 
              h={{ base: "400px", md: "450px", lg: "450px" }}
              minH={{ base: "400px", md: "450px", lg: "450px" }}
              maxH={{ base: "500px", md: "550px", lg: "550px" }}
              display="flex" 
              flexDirection="column"
              bg="white"
              borderRadius="2xl"
              boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              overflow="hidden"
              minW="0"
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
              <Box flex="1" overflow="hidden" minH="0" display="flex" flexDirection="column" px={6} py={6}>
                <QuickActions onAction={handleQuickAction} />
              </Box>
            </Box>
          </GridItem>
          <GridItem>
            <Box 
              h={{ base: "400px", md: "450px", lg: "450px" }}
              minH={{ base: "400px", md: "450px", lg: "450px" }}
              maxH={{ base: "500px", md: "550px", lg: "550px" }}
              display="flex" 
              flexDirection="column"
              bg="white"
              borderRadius="2xl"
              boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              overflow="hidden"
              minW="0"
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
              <Heading 
                size="md" 
                color="admin.primary" 
                mb={4} 
                textAlign="center" 
                fontWeight="700"
                fontSize="lg"
                letterSpacing="-0.025em"
                pt={6}
              >
                Data Status
              </Heading>
              <Box flex="1" overflow="hidden" minH="0" display="flex" flexDirection="column" px={6} pb={6}>
                <CSVStatus />
              </Box>
            </Box>
          </GridItem>
          <GridItem>
            <Box 
              h={{ base: "400px", md: "450px", lg: "450px" }}
              minH={{ base: "400px", md: "450px", lg: "450px" }}
              maxH={{ base: "500px", md: "550px", lg: "550px" }}
              display="flex" 
              flexDirection="column"
              bg="white"
              borderRadius="2xl"
              boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              overflow="hidden"
              minW="0"
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
              <Box flex="1" overflow="hidden" minH="0" display="flex" flexDirection="column" px={6} py={6}>
                <ClientLookup />
              </Box>
            </Box>
          </GridItem>
          </Grid>
        </Box>

      {/* Main Dashboard Tabs */}
      <Box 
        mt={2}
        bg="white"
        borderRadius="2xl"
        boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        overflow="hidden"
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
        <Heading 
          size="lg" 
          color="admin.primary" 
          mb={2} 
          textAlign="center" 
          fontWeight="700"
          fontSize="xl"
          letterSpacing="-0.025em"
          pt={4}
        >
          Client Check-Ins
        </Heading>
        <Tabs 
          variant="enclosed" 
          colorScheme="blue" 
          size="md" 
          w="full"
        >
            <TabList 
              overflowX="auto" 
              overflowY="hidden"
              mb={2}
              w="full"
              css={{
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '2px',
                },
              }}
            >
              <Tab 
                whiteSpace="nowrap" 
                minW="100px"
                maxW="150px"
                fontSize="md"
                px={4}
                py={3}
                flex="1"
              >
                Analytics
              </Tab>
              <Tab 
                whiteSpace="nowrap" 
                minW="100px"
                maxW="150px"
                fontSize="md"
                px={4}
                py={3}
                flex="1"
              >
                Recent Activity
              </Tab>
              <Tab 
                whiteSpace="nowrap" 
                minW="100px"
                maxW="150px"
                fontSize="md"
                px={4}
                py={3}
                flex="1"
              >
                Find Client
              </Tab>
              <Tab 
                whiteSpace="nowrap" 
                minW="100px"
                maxW="150px"
                fontSize="md"
                px={4}
                py={3}
                flex="1"
              >
                Clients
              </Tab>
              <Tab 
                whiteSpace="nowrap" 
                minW="100px"
                maxW="150px"
                fontSize="md"
                px={4}
                py={3}
                flex="1"
              >
                Help Requests
              </Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
                <CheckInAnalyticsChart />
              </TabPanel>
              <TabPanel px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
                <RecentCheckInsList checkIns={checkIns} isLoading={isLoadingCheckIns} />
              </TabPanel>
              <TabPanel px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
                <ClientLookup />
              </TabPanel>
              <TabPanel px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
                <CSVDataViewer />
              </TabPanel>
              <TabPanel px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
                <HelpRequestsTable />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* CSV Help Button */}
        <Box 
          position="fixed" 
          bottom={{ base: 4, sm: 4, md: 4 }} 
          right={{ base: 4, sm: 4, md: 4 }}
          zIndex={10}
          display={{ base: "none", md: "block" }}
        >
          <Button
            onClick={onCSVHelpOpen}
            colorScheme="brand"
            size="md"
            borderRadius="full"
            boxShadow="lg"
            leftIcon={<FiSettings />}
            color="white"
            _hover={{ color: "white" }}
            _active={{ color: "white" }}
          >
            Quick Help
          </Button>
        </Box>

      {/* Modals */}
      <CSVHelpModal isOpen={isCSVHelpOpen} onClose={onCSVHelpClose} />
    </>
  );
};

export default DashboardPage;
