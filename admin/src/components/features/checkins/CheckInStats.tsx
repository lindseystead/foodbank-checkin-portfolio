/**
 * @fileoverview Statistics section for Check-ins page
 */

import React from 'react';
import { Box, Grid, Heading, Text, VStack } from '@chakra-ui/react';
import { CheckInRecord } from '../../../types/checkIn';

interface CheckInStatsProps {
  checkIns: CheckInRecord[];
}

const StatCard: React.FC<{
  value: number;
  label: string;
  accentColor?: string;
}> = ({ value, label, accentColor }) => {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
      p={6}
      position="relative"
      _before={
        accentColor
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: accentColor,
              borderRadius: '2xl 2xl 0 0',
            }
          : undefined
      }
    >
      <VStack align="center" spacing={3}>
        <Text fontSize="3xl" fontWeight="bold" color={accentColor || 'admin.primary'}>
          {value}
        </Text>
        <Text fontSize="md" color="gray.600" textAlign="center" fontWeight="500">
          {label}
        </Text>
      </VStack>
    </Box>
  );
};

const CheckInStats: React.FC<CheckInStatsProps> = ({ checkIns }) => {
  const total = checkIns.length;
  const completed = checkIns.filter((c) => c.status === 'Collected').length;
  const checkedIn = checkIns.filter((c) => c.status === 'Pending' && c.checkInTime).length;
  const pending = checkIns.filter((c) => c.status === 'Pending').length;

  return (
    <Box mb={{ base: 3, sm: 4, md: 5 }} w="full" maxW="100%">
      <Heading
        size="lg"
        color="admin.primary"
        mb={4}
        textAlign="center"
        fontWeight="semibold"
      >
        Check-in Statistics
      </Heading>
      <Grid
        templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gap={{ base: 3, sm: 3, md: 4 }}
        alignItems="stretch"
        w="full"
        maxW="100%"
        mx="auto"
        minH="0"
      >
        <StatCard value={total} label="Total Appointments" />
        <StatCard value={completed} label="Completed" accentColor="accent.green.300" />
        <StatCard value={checkedIn} label="Checked In" accentColor="brand.500" />
        <StatCard value={pending} label="Pending" accentColor="accent.orange.300" />
      </Grid>
    </Box>
  );
};

export default CheckInStats;
