/**
 * @fileoverview Check-in analytics chart component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component provides visual analytics and charts for check-in data,
 * including trends, patterns, and statistical insights for
 * food bank operations monitoring and reporting.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../DashboardPage.tsx} Dashboard page
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Grid,
  GridItem,
  Spinner,
  Center
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../../../lib/api';
import { getApiUrl } from '../../../common/apiConfig';


interface ChartData {
  time: string;
  timeLabel: string;
  completed: number;
  pending: number;
  noShow: number;
  total: number;
  hour: number;
  minute: number;
  isEven: boolean;
}

interface DashboardStats {
  totalCheckIns: number;
  completed: number;
  pending: number;
  noShow: number;
  averageWaitTime: number;
  currentHour: number;
  peakHour: number;
  peakCount: number;
}

const CheckInAnalyticsChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCheckIns: 0,
    completed: 0,
    pending: 0,
    noShow: 0,
    averageWaitTime: 0,
    currentHour: new Date().getHours(),
    peakHour: 0,
    peakCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isHovering, setIsHovering] = useState(false);
  const [csvStatus, setCsvStatus] = useState<{
    loading: boolean;
    hasData: boolean;
    count: number;
    error: string | null;
  }>({
    loading: true,
    hasData: false,
    count: 0,
    error: null
  });



  // Fetch CSV status (same as sidebar)
  const fetchCsvStatus = async () => {
    try {
      const response = await api('/status/day');
      
      if (response.status === 429) {
        console.warn('Rate limited - skipping CSV status update');
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        const lastVersion = localStorage.getItem('dataVersion');
        if (result.dataVersion && result.dataVersion.toString() !== lastVersion) {
          localStorage.setItem('dataVersion', result.dataVersion.toString());
          window.location.reload();
          return;
        }
        
        setCsvStatus({
          loading: false,
          hasData: result.data?.data?.present || false,
          count: result.data?.data?.count || 0,
          error: null
        });
      } else {
        setCsvStatus({
          loading: false,
          hasData: false,
          count: 0,
          error: result.error || 'Failed to fetch status'
        });
      }
    } catch (err) {
      // Only log errors that aren't connection refused (server not running)
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        console.warn('Backend server not available for CSV status, will retry later');
      } else {
        console.error('CSV status fetch error:', err);
      }
      setCsvStatus({
        loading: false,
        hasData: false,
        count: 0,
        error: 'No CSV data available'
      });
    }
  };

  // Fetch real-time analytics data from appointments
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(getApiUrl('/checkin/appointments'), {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const appointments = data.data;
        
        // Calculate stats
        // Collected: Completed successfully (green)
        const completed = appointments.filter((a: any) => a.status === 'Collected' || a.status === 'Shipped').length;
        // Pending: Waiting to be collected or rescheduled (blue)
        const pending = appointments.filter((a: any) => a.status === 'Pending' || a.status === 'Rescheduled').length;
        // No Show: Not collected or cancelled (orange)
        const noShow = appointments.filter((a: any) => a.status === 'Not Collected' || a.status === 'Cancelled').length;
        
        setStats({
          totalCheckIns: appointments.length,
          completed,
          pending,
          noShow,
          averageWaitTime: 0,
          currentHour: new Date().getHours(),
          peakHour: 0,
          peakCount: 0
        });
        
        // Generate chart data
        setChartData(generateTimeIntervalChartData(appointments));
        setLastUpdate(new Date());
      } else {
        setStats({
          totalCheckIns: 0,
          completed: 0,
          pending: 0,
          noShow: 0,
          averageWaitTime: 0,
          currentHour: new Date().getHours(),
          peakHour: 0,
          peakCount: 0
        });
        setChartData([]);
        setLastUpdate(new Date());
      }
    } catch (error) {
      // Only log errors that aren't connection refused (server not running)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('Backend server not available for analytics, will retry later');
      } else {
        console.error('Error fetching analytics:', error);
      }
      // Don't reset stats on connection errors, keep existing data
      if (!(error instanceof TypeError && error.message.includes('Failed to fetch'))) {
        setStats({
          totalCheckIns: 0,
          completed: 0,
          pending: 0,
          noShow: 0,
          averageWaitTime: 0,
          currentHour: new Date().getHours(),
          peakHour: 0,
          peakCount: 0
        });
        setChartData([]);
        setLastUpdate(new Date());
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Generate chart data based on CSV appointments (by pickup times)
  const generateTimeIntervalChartData = (appointments: any[]): ChartData[] => {
    if (!Array.isArray(appointments) || appointments.length === 0) {
      return [];
    }
    
    const intervals: ChartData[] = [];
    
    // Build today's string once
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    // Accepted slots every 15 minutes between 08:00 and 20:00
    const isWithinWindow = (dt: Date) => dt.getHours() >= 8 && dt.getHours() < 20;

    // Generate full range from 8 AM to 8 PM (every 15 minutes)
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        // Build interval slot HH:MM
        // Count appointments for this exact time slot
        const intervalAppointments = appointments.filter((appointment: any) => {
          // Determine a Date for this appointment using available fields
          let dt: Date | null = null;
          if (appointment.appointmentTime) {
            const t = new Date(appointment.appointmentTime);
            if (!isNaN(t.getTime())) dt = t;
          }
          if (!dt && appointment.pickUpISO) {
            const t = new Date(appointment.pickUpISO);
            if (!isNaN(t.getTime())) dt = t;
          }
          if (!dt && typeof appointment.pickUpTime === 'string' && appointment.pickUpTime.match(/^\d{2}:\d{2}$/)) {
            const t = new Date(`${todayStr}T${appointment.pickUpTime}:00`);
            if (!isNaN(t.getTime())) dt = t;
          }

          if (!dt) return false;

          // Only include today's appointments in the 08:00–20:00 window
          const sameDay = dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth() && dt.getDate() === now.getDate();
          if (!sameDay || !isWithinWindow(dt)) return false;

          // Exact match for 15-minute slots
          return dt.getHours() === hour && dt.getMinutes() === minute;
        });
        
        // Count by status with proper color mapping
        // Green = Collected/Shipped, Blue = Pending/Rescheduled, Orange = Not Collected/Cancelled
        const completed = intervalAppointments.filter(a => a.status === 'Collected' || a.status === 'Shipped').length;
        const pending = intervalAppointments.filter(a => a.status === 'Pending' || a.status === 'Rescheduled').length;
        const noShow = intervalAppointments.filter(a => a.status === 'Not Collected' || a.status === 'Cancelled').length;
        
        
        // Convert to 12-hour format for display
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const timeLabel = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        
        intervals.push({
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          timeLabel,
          completed,
          pending,
          noShow,
          total: completed + pending + noShow,
          hour,
          minute,
          isEven: intervals.length % 2 === 0
        });
      }
    }
    
    return intervals;
  };

  // Real-time updates every 15 seconds, but pause when hovering over chart
  useEffect(() => {
    fetchCsvStatus();
    fetchAnalytics();
    const interval = setInterval(() => {
      if (!isHovering) {
        fetchCsvStatus();
        fetchAnalytics();
      }
    }, 20000); // 20 seconds for efficiency
    return () => clearInterval(interval);
  }, [isHovering]);

  // Track screen width changes for responsive chart
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const completed = payload.find((p: any) => p.dataKey === 'completed')?.value || 0;
      const pending = payload.find((p: any) => p.dataKey === 'pending')?.value || 0;
      const noShow = payload.find((p: any) => p.dataKey === 'noShow')?.value || 0;
      const total = completed + pending + noShow;
      
      return (
        <Box 
          bg="white" 
          p={5} 
          borderRadius="xl" 
          border="2px solid" 
          borderColor="gray.200" 
          boxShadow="2xl"
          minW="280px"
        >
          <VStack spacing={4} align="start">
            <Box textAlign="center" w="full">
              <Text fontWeight="bold" fontSize="lg" color="#2B7B8C" mb={1}>
                {label}
              </Text>
              <Text fontSize="sm" color="#2B7B8C">
                Appointment Summary
              </Text>
            </Box>
            
            <HStack spacing={4} justify="center" w="full">
              <VStack align="center" spacing={2} minW="70px">
                <Box
                  bg="cofb.green"
                  borderRadius="full"
                  p={2}
                  boxShadow="md"
                >
                  <Text fontSize="lg" color="white" fontWeight="bold">
                    {completed}
                  </Text>
                </Box>
                <Text fontSize="xs" color="#6B8E4A" fontWeight="600" textAlign="center">
                  ✅ Completed
                </Text>
              </VStack>
              
              <VStack align="center" spacing={2} minW="70px">
                <Box
                  bg="cofb.blue"
                  borderRadius="full"
                  p={2}
                  boxShadow="md"
                >
                  <Text fontSize="lg" color="white" fontWeight="bold">
                    {pending}
                  </Text>
                </Box>
                <Text fontSize="xs" color="#1E5A6B" fontWeight="600" textAlign="center">
                  📅 Pending
                </Text>
              </VStack>
              
              <VStack align="center" spacing={2} minW="70px">
                <Box
                  bg="cofb.orange"
                  borderRadius="full"
                  p={2}
                  boxShadow="md"
                >
                  <Text fontSize="lg" color="white" fontWeight="bold">
                    {noShow}
                  </Text>
                </Box>
                <Text fontSize="xs" color="#E76F51" fontWeight="600" textAlign="center">
                  ❌ No Show
                </Text>
              </VStack>
            </HStack>
            
            {total > 0 && (
              <Box 
                w="full" 
                bg="gray.50" 
                borderRadius="lg" 
                p={3} 
                textAlign="center"
                border="1px solid"
                borderColor="gray.200"
              >
                <Text fontSize="sm" color="gray.700" fontWeight="medium">
                  Total Appointments: <Text as="span" fontWeight="bold" color="#2B7B8C">{total}</Text>
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Center py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600" fontWeight="medium">Loading analytics data...</Text>
        </VStack>
      </Center>
    );
  }

  // Check if we have no data
  const hasNoData = stats.totalCheckIns === 0 && stats.completed === 0 && stats.pending === 0;

  return (
    <Box position="relative" overflow="hidden">
      {/* Background gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="gray.50"
        opacity={0.1}
        zIndex={0}
      />
      
      <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
        {/* Simple Header */}
        <Box p={4} bg="white" borderRadius="lg" border="2px solid" borderColor="gray.300" boxShadow="md">
          <HStack justify="space-between" align="center">
            <Text color="gray.600" fontSize="sm">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Text>
            <Badge 
              colorScheme="green" 
              fontSize="xs" 
              px={3} 
              py={1} 
              borderRadius="full"
            >
              LIVE
            </Badge>
          </HStack>
        </Box>

        {/* Statistics Cards */}
        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={{ base: 3, sm: 4, md: 4 }}>
          <GridItem>
            <Box 
              bg={hasNoData ? "gray.50" : "white"} 
              p={4} 
              borderRadius="xl" 
              border="2px solid" 
              borderColor={hasNoData ? "gray.200" : "#2B7B8C"} 
              boxShadow={hasNoData ? "sm" : "lg"}
              transition="all 0.2s"
            >
              <VStack spacing={2}>
                <Text fontSize={{ base: "xs", sm: "sm" }} color={hasNoData ? "neutral.500" : "#2B7B8C"} fontWeight="600">
                  📅 Total Appointments
                </Text>
                <Text fontSize={{ base: "xl", sm: "2xl" }} color={hasNoData ? "neutral.400" : "#2B7B8C"} fontWeight="bold">
                  {stats.totalCheckIns}
                </Text>
                <Text fontSize={{ base: "xs", sm: "xs" }} color={hasNoData ? "neutral.400" : "#2B7B8C"}>
                  {hasNoData ? "No data" : "Scheduled Today"}
                </Text>
              </VStack>
            </Box>
          </GridItem>
          
          <GridItem>
            <Box 
              bg={hasNoData ? "gray.50" : "white"} 
              p={4} 
              borderRadius="xl" 
              border="2px solid" 
              borderColor={hasNoData ? "gray.200" : "#8CAB6D"} 
              boxShadow={hasNoData ? "sm" : "lg"}
              transition="all 0.2s"
            >
              <VStack spacing={2}>
                <Text fontSize={{ base: "xs", sm: "sm" }} color={hasNoData ? "neutral.500" : "#8CAB6D"} fontWeight="600">
                  ✅ Completed Check-ins
                </Text>
                <Text fontSize={{ base: "xl", sm: "2xl" }} color={hasNoData ? "neutral.400" : "#8CAB6D"} fontWeight="bold">
                  {stats.completed}
                </Text>
                <Text fontSize={{ base: "xs", sm: "xs" }} color={hasNoData ? "neutral.400" : "#8CAB6D"}>
                  {hasNoData ? "No data" : `${stats.totalCheckIns > 0 ? Math.round((stats.completed / stats.totalCheckIns) * 100) : 0}% Complete`}
                </Text>
              </VStack>
            </Box>
          </GridItem>
          
          <GridItem>
            <Box 
              bg={hasNoData ? "gray.50" : "white"} 
              p={4} 
              borderRadius="xl" 
              border="2px solid" 
              borderColor={hasNoData ? "gray.200" : "#F4A261"} 
              boxShadow={hasNoData ? "sm" : "lg"}
              transition="all 0.2s"
            >
              <VStack spacing={2}>
                <Text fontSize={{ base: "xs", sm: "sm" }} color={hasNoData ? "neutral.500" : "#F4A261"} fontWeight="600">
                  ⏳ Pending Check-ins
                </Text>
                <Text fontSize={{ base: "xl", sm: "2xl" }} color={hasNoData ? "neutral.400" : "#F4A261"} fontWeight="bold">
                  {stats.pending}
                </Text>
                <Text fontSize={{ base: "xs", sm: "xs" }} color={hasNoData ? "neutral.400" : "#F4A261"}>
                  {hasNoData ? "No data" : "Waiting"}
                </Text>
              </VStack>
            </Box>
          </GridItem>
          
          <GridItem>
            <Box 
              bg={hasNoData ? "gray.50" : "white"} 
              p={4} 
              borderRadius="xl" 
              border="2px solid" 
              borderColor={hasNoData ? "gray.200" : "#E76F51"} 
              boxShadow={hasNoData ? "sm" : "lg"}
              transition="all 0.2s"
            >
              <VStack spacing={2}>
                <Text fontSize={{ base: "xs", sm: "sm" }} color={hasNoData ? "neutral.500" : "#E76F51"} fontWeight="600">
                  ❌ No Show Appointments
                </Text>
                <Text fontSize={{ base: "xl", sm: "2xl" }} color={hasNoData ? "neutral.400" : "#E76F51"} fontWeight="bold">
                  {stats.noShow}
                </Text>
                <Text fontSize={{ base: "xs", sm: "xs" }} color={hasNoData ? "neutral.400" : "#E76F51"}>
                  {hasNoData ? "No data" : "Missed"}
                </Text>
              </VStack>
            </Box>
          </GridItem>
          
        </Grid>

        {/* Enhanced Chart Container */}
        <Box 
          bg="white" 
          p={{ base: 4, sm: 6, md: 8, lg: 10 }} 
          borderRadius="2xl" 
          border="2px solid" 
          borderColor="gray.200" 
          boxShadow="xl"
          position="relative"
          overflow="hidden"
          minH={{ base: "500px", sm: "550px", md: "600px" }}
          w="100%"
        >
          {/* Background Pattern */}
          <Box
            position="absolute"
            top={0}
            right={0}
            w="200px"
            h="200px"
            bg="cofb.blue"
            opacity={0.1}
            borderRadius="full"
            transform="translate(50%, -50%)"
            zIndex={0}
          />
          
          <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
            <Box textAlign="center">
              <Text 
                fontSize={{ base: "xl", sm: "2xl", md: "2xl" }} 
                color="#25385D" 
                fontWeight="bold" 
                mb={2}
                bg="cofb.blue"
                bgClip="text"
                textFillColor="transparent"
              >
                📊 Appointment Time Slots Dashboard
              </Text>
              <Text fontSize={{ base: "sm", sm: "md", md: "md" }} color="#25385D" fontWeight="medium">
                Today's scheduled appointments grouped by pickup time slots
              </Text>
              <Box 
                w="60px" 
                h="2px" 
                bg="cofb.blue"
                opacity={0.3} 
                borderRadius="full" 
                mx="auto" 
                mt={3}
              />
            </Box>


            {/* Chart - Shows full range 8 AM - 4 PM but only populates valid CSV time slots */}
            <Box 
              h={{ base: "450px", sm: "500px", md: "550px", lg: "600px" }} 
              w="100%"
              minH={{ base: "450px", sm: "500px", md: "550px" }}
              maxH={{ base: "600px", sm: "700px", md: "800px" }}
              bg="white"
              borderRadius="2xl"
              p={8}
              boxShadow="2xl"
              border="1px solid"
              borderColor="gray.100"
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #8CAB6D, #2B7B8C, #F4A261)',
                borderRadius: '2xl 2xl 0 0'
              }}
              _hover={{
                boxShadow: '2xl',
                transform: 'translateY(-4px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {isLoading ? (
                <Center h="100%">
                  <VStack spacing={4}>
                    <Spinner size="xl" color="blue.500" />
                    <Text color="gray.600" fontWeight="medium">Loading chart data...</Text>
                  </VStack>
                </Center>
              ) : !csvStatus.hasData ? (
                <Center h="100%">
                  <VStack spacing={4}>
                    <Text fontSize="lg" color="gray.500" fontWeight="medium">
                      📊 No CSV Data Available
                    </Text>
                    <Text fontSize="sm" color="gray.400" textAlign="center" maxW="300px">
                      Upload CSV data with today's pickup date to see appointment time slots
                    </Text>
                  </VStack>
                </Center>
              ) : hasNoData ? (
                <Center h="100%">
                  <VStack spacing={4}>
                    <Text fontSize="lg" color="gray.500" fontWeight="medium">
                      📊 No Appointment Data
                    </Text>
                    <Text fontSize="sm" color="gray.400" textAlign="center" maxW="300px">
                      No appointments found in the uploaded CSV data
                    </Text>
                  </VStack>
                </Center>
              ) : (
                <Box
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  width="100%" 
                  height="100%"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                    data={Array.isArray(chartData) ? chartData : []} 
                    margin={{ top: 20, right: 30, left: 30, bottom: 100 }}
                    barCategoryGap={screenWidth < 768 ? "8%" : "12%"}
                    barGap={screenWidth < 768 ? "2%" : "4%"}
                    style={{ 
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderRadius: '16px',
                      padding: '12px',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                    }}
                  >
                  <defs>
                    <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8CAB6D" />
                      <stop offset="50%" stopColor="#7A9B5A" />
                      <stop offset="100%" stopColor="#6B8E4A" />
                    </linearGradient>
                    <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2B7B8C" />
                      <stop offset="50%" stopColor="#256A7A" />
                      <stop offset="100%" stopColor="#1E5A6B" />
                    </linearGradient>
                    <linearGradient id="noShowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F4A261" />
                      <stop offset="50%" stopColor="#F18F4A" />
                      <stop offset="100%" stopColor="#E76F51" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000020"/>
                    </filter>
                  </defs>
                  <XAxis 
                    dataKey="timeLabel" 
                    tick={{ 
                      fontSize: screenWidth < 768 ? 8 : 9, 
                      fill: '#2B7B8C',
                      fontWeight: '600'
                    }}
                    axisLine={{ stroke: '#2B7B8C', strokeWidth: 2 }}
                    tickLine={{ stroke: '#2B7B8C', strokeWidth: 1 }}
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={screenWidth < 768 ? 3 : 2}
                    tickMargin={15}
                  />
                  <YAxis 
                    tick={{ 
                      fontSize: 12, 
                      fill: '#2B7B8C',
                      fontWeight: '600'
                    }}
                    axisLine={{ stroke: '#2B7B8C', strokeWidth: 2 }}
                    tickLine={{ stroke: '#2B7B8C', strokeWidth: 1 }}
                    domain={[0, 'dataMax + 1']}
                    allowDecimals={false}
                    interval={0}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#2B7B8C',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '20px',
                      flexWrap: 'wrap',
                      alignItems: 'center'
                    }}
                    iconType="circle"
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                  <Bar 
                    dataKey="completed" 
                    fill="url(#completedGradient)"
                    name="✅ Completed Check-ins" 
                    radius={[12, 12, 0, 0]}
                    stroke="#6B8E4A"
                    strokeWidth={3}
                    filter="url(#shadow)"
                    style={{ 
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(_, __, event) => {
                      if (event?.target && 'style' in event.target) {
                        (event.target as HTMLElement).style.filter = 'url(#glow)';
                        (event.target as HTMLElement).style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(_, __, event) => {
                      if (event?.target && 'style' in event.target) {
                        (event.target as HTMLElement).style.filter = 'url(#shadow)';
                        (event.target as HTMLElement).style.transform = 'scale(1)';
                      }
                    }}
                  />
                  <Bar 
                    dataKey="pending" 
                    fill="url(#pendingGradient)"
                    name="📅 Pending Appointments" 
                    radius={[12, 12, 0, 0]}
                    stroke="#1B4A54"
                    strokeWidth={3}
                    filter="url(#shadow)"
                    style={{ 
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(_, __, event) => {
                      if (event?.target && 'style' in event.target) {
                        (event.target as HTMLElement).style.filter = 'url(#glow)';
                        (event.target as HTMLElement).style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(_, __, event) => {
                      if (event?.target && 'style' in event.target) {
                        (event.target as HTMLElement).style.filter = 'url(#shadow)';
                        (event.target as HTMLElement).style.transform = 'scale(1)';
                      }
                    }}
                  />
                  <Bar 
                    dataKey="noShow" 
                    fill="url(#noShowGradient)"
                    name="❌ No Show Appointments" 
                    radius={[12, 12, 0, 0]}
                    stroke="#D07433"
                    strokeWidth={3}
                    filter="url(#shadow)"
                    style={{ 
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(_, __, event) => {
                      if (event?.target && 'style' in event.target) {
                        (event.target as HTMLElement).style.filter = 'url(#glow)';
                        (event.target as HTMLElement).style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(_, __, event) => {
                      if (event?.target && 'style' in event.target) {
                        (event.target as HTMLElement).style.filter = 'url(#shadow)';
                        (event.target as HTMLElement).style.transform = 'scale(1)';
                      }
                    }}
                  />
                  </BarChart>
                </ResponsiveContainer>
                </Box>
              )}
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default CheckInAnalyticsChart;
