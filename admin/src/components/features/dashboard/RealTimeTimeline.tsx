/**
 * @fileoverview Real-time timeline component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component displays a live timeline of check-in activities and
 * system events with real-time updates. It provides visual
 * representation of daily operations and activity flow.
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
  Heading,
  Badge,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  Spinner,
  Center
} from '@chakra-ui/react';
import { formatPhoneNumber } from '../../../common/utils/phoneFormatter';
import { getApiUrl } from '../../../common/apiConfig';

interface CheckInRecord {
  id: string;
  clientId: string;
  clientName: string;
  phoneNumber: string;
  checkInTime: string;
  appointmentTime?: string;
  status: 'Pending' | 'Shipped' | 'Collected' | 'Not Collected' | 'Rescheduled' | 'Cancelled';
  source: 'csv' | 'manual' | 'api';
  dietaryRestrictions?: string[];
  hasMobilityIssues?: boolean;
  waitTime?: number;
  completionTime?: string;
}

interface TimelineData {
  hour: number;
  timeLabel: string;
  completed: number;
  pending: number;
  checkIns: CheckInRecord[];
}

interface DashboardStats {
  totalCheckIns: number;
  completed: number;
  pending: number;
  averageWaitTime: number;
  currentHour: number;
  peakHour: number;
  peakCount: number;
}

const RealTimeTimeline: React.FC = () => {
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCheckIns: 0,
    completed: 0,
    pending: 0,
    averageWaitTime: 0,
    currentHour: new Date().getHours(),
    peakHour: 0,
    peakCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Colors for different statuses
  const completedColor = 'green.500';
  const pendingColor = 'orange.500';
  const peakColor = 'blue.500';

  // Generate timeline data for 8 AM to 8 PM
  const generateTimelineData = (checkIns: CheckInRecord[]): TimelineData[] => {
    const timeline: TimelineData[] = [];
    
    for (let hour = 8; hour <= 20; hour++) {
      const hourCheckIns = checkIns.filter(checkIn => {
        const checkInHour = new Date(checkIn.checkInTime).getHours();
        return checkInHour === hour;
      });

      const completed = hourCheckIns.filter(c => c.status === 'Collected').length;
      const pending = hourCheckIns.filter(c => c.status === 'Pending').length;

      timeline.push({
        hour,
        timeLabel: hour > 12 ? `${hour - 12} PM` : `${hour} AM`,
        completed,
        pending,
        checkIns: hourCheckIns
      });
    }

    return timeline;
  };

  // Calculate statistics
  const calculateStats = (checkIns: CheckInRecord[]) => {
    const totalCheckIns = checkIns.length;
    const completed = checkIns.filter(c => c.status === 'Collected').length;
    const pending = checkIns.filter(c => c.status === 'Pending').length;
    
    const waitTimes = checkIns
      .filter(c => c.waitTime && c.waitTime > 0)
      .map(c => c.waitTime!);
    const averageWaitTime = waitTimes.length > 0 
      ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
      : 0;

    // Find peak hour
    const hourlyCounts = Array.from({ length: 13 }, (_, i) => {
      const hour = i + 8;
      return checkIns.filter(c => new Date(c.checkInTime).getHours() === hour).length;
    });
    
    const maxCount = Math.max(...hourlyCounts);
    const peakHour = hourlyCounts.indexOf(maxCount) + 8;

    return {
      totalCheckIns,
      completed,
      pending,
      averageWaitTime,
      peakHour,
      peakCount: maxCount,
      currentHour: new Date().getHours()
    };
  };

  // Fetch check-ins data
  const fetchCheckIns = async () => {
    try {
      // Use appointments endpoint to include CSV appointments
      const response = await fetch(getApiUrl('/checkin/appointments'));
      const data = await response.json();
      
      if (data.success && data.data) {
        // Filter to today's window (08:00–20:00)
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const todayStr = `${y}-${m}-${d}`;

        const todayCheckIns = (data.data as any[])
          .map((r: any) => ({
            ...r,
            checkInTime: r.checkInTime || r.pickUpISO || (r.pickUpTime ? `${todayStr}T${r.pickUpTime}:00` : undefined)
          }))
          .filter((r: any) => {
            if (!r.checkInTime) return false;
            const dt = new Date(r.checkInTime);
            const sameDay = dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth() && dt.getDate() === now.getDate();
            const hour = dt.getHours();
            return sameDay && hour >= 8 && hour < 20;
          });
        
        setTimelineData(generateTimelineData(todayCheckIns));
        setStats(calculateStats(todayCheckIns));
        setLastUpdate(new Date());
      } else {
        setTimelineData(generateTimelineData([]));
        setStats(calculateStats([]));
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      // Don't clear data on error, just log it
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time updates every 15 seconds for cost efficiency
  useEffect(() => {
    fetchCheckIns();
    const interval = setInterval(() => {
      fetchCheckIns();
    }, 15000); // Update every 15 seconds for cost efficiency
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Get color for timeline bar
  const getBarColor = (hour: number, completed: number, pending: number) => {
    if (hour === stats.peakHour && (completed + pending) === stats.peakCount) {
      return peakColor;
    }
    if (completed > 0 && pending > 0) {
      return completedColor; // Use completed color when both exist
    }
    if (completed > 0) {
      return completedColor;
    }
    if (pending > 0) {
      return pendingColor;
    }
    return 'gray.300';
  };

  if (isLoading) {
    return (
      <Center py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading real-time data...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box position="relative" overflow="hidden">
      {/* Animated background gradient */}
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
        {/* Enhanced Header */}
        <Box p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={2}>
              <HStack spacing={3}>
                <Heading size="lg" color="cofb.blue">
                  📊 Real-Time Analytics Dashboard
                </Heading>
                {isLoading && (
                  <Spinner size="sm" color="blue.500" />
                )}
              </HStack>
              <Text color="gray.600" fontSize="sm" fontWeight="500">
                Live graphical view of client check-ins as they happen • Updates every 3 seconds
              </Text>
              <Text color="gray.500" fontSize="xs">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Badge 
                colorScheme="green" 
                fontSize="sm" 
                px={4} 
                py={2} 
                borderRadius="full"
                animation="pulse 2s infinite"
                boxShadow="0 0 15px rgba(34, 197, 94, 0.3)"
              >
                <HStack spacing={2}>
                  <Box w={2} h={2} bg="white" borderRadius="full" animation="pulse 1s infinite" />
                  <Text fontWeight="bold">LIVE</Text>
                </HStack>
              </Badge>
              <Text fontSize="xs" color="green.600" fontWeight="bold">
                {stats.totalCheckIns} check-ins today
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Enhanced Statistics Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
          <GridItem>
            <Box 
              bg="white" 
              p={6} 
              borderRadius="xl" 
              border="1px solid" 
              borderColor="gray.200" 
              boxShadow="sm"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="4px"
                bg="#2B7B8C"
              />
              <Stat>
                <StatLabel color="gray.600" fontSize="sm" fontWeight="600">📈 Total Check-ins</StatLabel>
                <StatNumber color="#2B7B8C" fontSize="2xl" fontWeight="bold">
                  {stats.totalCheckIns}
                </StatNumber>
                <StatHelpText color="#2B7B8C" fontSize="xs">
                  <StatArrow type="increase" />
                  Today's activity
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
          
          <GridItem>
            <Box 
              bg="white" 
              p={6} 
              borderRadius="xl" 
              border="1px solid" 
              borderColor="gray.200" 
              boxShadow="sm"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="4px"
                bg="#8CAB6D"
              />
              <Stat>
                <StatLabel color="gray.600" fontSize="sm" fontWeight="600">✅ Completed</StatLabel>
                <StatNumber color="#8CAB6D" fontSize="2xl" fontWeight="bold">
                  {stats.completed}
                </StatNumber>
                <StatHelpText color="#8CAB6D" fontSize="xs">
                  {stats.totalCheckIns > 0 ? Math.round((stats.completed / stats.totalCheckIns) * 100) : 0}% completion rate
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
          
          <GridItem>
            <Box 
              bg="white" 
              p={6} 
              borderRadius="xl" 
              border="1px solid" 
              borderColor="gray.200" 
              boxShadow="sm"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="4px"
                bg="#F4A261"
              />
              <Stat>
                <StatLabel color="gray.600" fontSize="sm" fontWeight="600">⏳ Pending</StatLabel>
                <StatNumber color="#F4A261" fontSize="2xl" fontWeight="bold">
                  {stats.pending}
                </StatNumber>
                <StatHelpText color="#F4A261" fontSize="xs">
                  Currently waiting
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
          
          <GridItem>
            <Box 
              bg="white" 
              p={6} 
              borderRadius="xl" 
              border="1px solid" 
              borderColor="gray.200" 
              boxShadow="sm"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="4px"
                bg="#2B7B8C"
              />
              <Stat>
                <StatLabel color="gray.600" fontSize="sm" fontWeight="600">⏱️ Avg Wait Time</StatLabel>
                <StatNumber color="#2B7B8C" fontSize="2xl" fontWeight="bold">
                  {stats.averageWaitTime}m
                </StatNumber>
                <StatHelpText color="#2B7B8C" fontSize="xs">
                  Peak: {stats.peakHour > 12 ? `${stats.peakHour - 12} PM` : `${stats.peakHour} AM`}
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
        </Grid>

        {/* Enhanced Timeline Chart */}
        <Box bg="white" p={8} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="#25385D" fontWeight="bold">
                  📈 Live Check-in Activity Timeline
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Real-time view of client check-ins throughout the day (8 AM - 8 PM)
                </Text>
              </VStack>
              <HStack spacing={4}>
                <HStack spacing={2} bg="green.50" px={3} py={2} borderRadius="lg">
                  <Box w={3} h={3} bg={completedColor} borderRadius="full" />
                  <Text fontSize="sm" color="green.700" fontWeight="600">Completed</Text>
                </HStack>
                <HStack spacing={2} bg="orange.50" px={3} py={2} borderRadius="lg">
                  <Box w={3} h={3} bg={pendingColor} borderRadius="full" />
                  <Text fontSize="sm" color="orange.700" fontWeight="600">Pending</Text>
                </HStack>
                <HStack spacing={2} bg="blue.50" px={3} py={2} borderRadius="lg">
                  <Box w={3} h={3} bg={peakColor} borderRadius="full" />
                  <Text fontSize="sm" color="blue.700" fontWeight="600">Peak Hour</Text>
                </HStack>
              </HStack>
            </HStack>

            {/* Enhanced Timeline Bars */}
            <VStack spacing={4} align="stretch">
              {timelineData.map((data) => {
                const totalCheckIns = data.completed + data.pending;
                const maxHeight = 150;
                const barHeight = totalCheckIns > 0 ? Math.max(30, (totalCheckIns / Math.max(stats.peakCount, 1)) * maxHeight) : 0;
                const isCurrentHour = data.hour === stats.currentHour;
                const isPeakHour = data.hour === stats.peakHour && totalCheckIns === stats.peakCount;
                const completionRate = totalCheckIns > 0 ? (data.completed / totalCheckIns) * 100 : 0;
                
                return (
                  <Box key={data.hour} p={4} bg="gray.50" borderRadius="xl" border="1px solid" borderColor="gray.200">
                    <HStack spacing={6} align="center">
                      {/* Time Label */}
                      <Box w={20} textAlign="center">
                        <Text fontSize="lg" fontWeight="bold" color={isCurrentHour ? "blue.600" : "neutral.700"}>
                          {data.timeLabel}
                        </Text>
                        {isCurrentHour && (
                          <Badge colorScheme="blue" variant="solid" fontSize="xs" mt={1}>
                            NOW
                          </Badge>
                        )}
                        {isPeakHour && (
                          <Badge colorScheme="blue" variant="solid" fontSize="xs" mt={1}>
                            PEAK
                          </Badge>
                        )}
                      </Box>

                      {/* Visual Bar Container */}
                      <Box flex={1} position="relative">
                        {/* Background Grid */}
                        <Box h="120px" position="relative" bg="white" borderRadius="lg" border="1px solid" borderColor="gray.300" p={2}>
                          {/* Bar */}
                          <Tooltip
                            label={
                              <VStack align="start" spacing={2}>
                                <Text fontWeight="bold" fontSize="md">{data.timeLabel}</Text>
                                <HStack spacing={4}>
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" fontWeight="600">Total Check-ins</Text>
                                    <Text fontSize="lg" color="blue.500" fontWeight="bold">{totalCheckIns}</Text>
                                  </VStack>
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="green.600">Completed</Text>
                                    <Text fontSize="md" color="green.500" fontWeight="bold">{data.completed}</Text>
                                  </VStack>
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" color="orange.600">Pending</Text>
                                    <Text fontSize="md" color="orange.500" fontWeight="bold">{data.pending}</Text>
                                  </VStack>
                                </HStack>
                                <Text fontSize="xs" color="gray.500">
                                  Completion Rate: {Math.round(completionRate)}%
                                </Text>
                                {isPeakHour && <Text color="blue.400" fontWeight="bold">🔥 Peak Hour!</Text>}
                              </VStack>
                            }
                            placement="top"
                          >
                            <Box
                              position="absolute"
                              bottom={2}
                              left={2}
                              right={2}
                              h={`${Math.min(barHeight, 100)}px`}
                              bg={getBarColor(data.hour, data.completed, data.pending)}
                              borderRadius="md"
                              cursor="pointer"
                              _hover={{ 
                                opacity: 0.9,
                                transform: "scale(1.05)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
                              }}
                              transition="all 0.3s ease"
                              border={isCurrentHour ? "3px solid" : "none"}
                              borderColor={isCurrentHour ? "blue.500" : "transparent"}
                              boxShadow={isPeakHour ? "0 0 25px rgba(147, 51, 234, 0.5)" : "0 4px 8px rgba(0,0,0,0.1)"}
                              animation={isCurrentHour ? "pulse 2s infinite" : "none"}
                            >
                              {/* Check-in indicators */}
                              {data.checkIns.map((checkIn, index) => (
                                <Tooltip
                                  key={checkIn.id}
                                  label={
                                    <VStack align="start" spacing={1}>
                                      <Text fontWeight="bold">{checkIn.clientName}</Text>
                                      <Text fontSize="xs">Status: {checkIn.status}</Text>
                                      <Text fontSize="xs">Phone: {formatPhoneNumber(checkIn.phoneNumber)}</Text>
                                      {checkIn.dietaryRestrictions && checkIn.dietaryRestrictions.length > 0 && (
                                        <Text fontSize="xs" color="green.300">
                                          Dietary Preferences: {checkIn.dietaryRestrictions.join(', ')}
                                        </Text>
                                      )}
                                      {checkIn.hasMobilityIssues && (
                                        <Text fontSize="xs" color="blue.300">
                                          ♿ Mobility assistance needed
                                        </Text>
                                      )}
                                      {checkIn.waitTime && (
                                        <Text fontSize="xs" color="blue.300">
                                          Wait time: {checkIn.waitTime}m
                                        </Text>
                                      )}
                                    </VStack>
                                  }
                                  placement="top"
                                >
                                  <Box
                                    position="absolute"
                                    top={`${(index / data.checkIns.length) * 100}%`}
                                    left="50%"
                                    transform="translateX(-50%)"
                                    w={2}
                                    h={2}
                                    bg="white"
                                    borderRadius="full"
                                    border="1px solid"
                                    borderColor="gray.400"
                                  />
                                </Tooltip>
                              ))}
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Count Labels */}
                      <Box w={20} textAlign="left">
                        <Text fontSize="sm" fontWeight="bold" color={isPeakHour ? "blue.600" : "neutral.700"}>
                          {totalCheckIns}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {data.completed}/{data.pending}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          </VStack>
        </Box>

        {/* Hourly Summary */}
        <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="#25385D" fontWeight="bold">
              📊 Hourly Check-in Summary
            </Heading>
            
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              <Box p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                <VStack spacing={2}>
                  <Text fontSize="sm" color="blue.700" fontWeight="600">Peak Hour</Text>
                  <Text fontSize="2xl" color="blue.600" fontWeight="bold">
                    {stats.peakHour > 12 ? `${stats.peakHour - 12} PM` : `${stats.peakHour} AM`}
                  </Text>
                  <Text fontSize="sm" color="blue.500">
                    {stats.peakCount} check-ins
                  </Text>
                </VStack>
              </Box>
              
              <Box p={4} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
                <VStack spacing={2}>
                  <Text fontSize="sm" color="green.700" fontWeight="600">Current Hour</Text>
                  <Text fontSize="2xl" color="green.600" fontWeight="bold">
                    {stats.currentHour > 12 ? `${stats.currentHour - 12} PM` : `${stats.currentHour} AM`}
                  </Text>
                  <Text fontSize="sm" color="green.500">
                    {(timelineData.find(d => d.hour === stats.currentHour)?.completed || 0) + (timelineData.find(d => d.hour === stats.currentHour)?.pending || 0)} check-ins
                  </Text>
                </VStack>
              </Box>
            </Grid>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default RealTimeTimeline;