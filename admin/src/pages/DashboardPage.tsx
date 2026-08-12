/**
 * @fileoverview Dashboard page for Foodbank Check-In and Appointment System admin panel
 *
 * This is the main dashboard page that provides an overview of daily
 * operations, real-time check-in data, system status, and quick
 * access to all admin functions for the food bank system.
 *
 * @version 1.1.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 *
 * @see {@link ../components/features/dashboard/} Dashboard components
 */

import React from 'react';
import {
  Button,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Import components
import {
  CSVHelpModal,
  DashboardOverview,
  DashboardTabs,
} from '../components/features/dashboard';
import { useTodayAppointments } from '../hooks/useTodayAppointments';
import { useTenantTime } from '../utils/useTenantTime';

const DashboardPage: React.FC = () => {
  const { isOpen: isCSVHelpOpen, onClose: onCSVHelpClose } = useDisclosure();
  const navigate = useNavigate();
  const { formatTime, tz } = useTenantTime();

  const {
    appointments: checkIns,
    isLoading: isLoadingCheckIns,
    lastRefresh,
    refresh: fetchCheckIns,
  } = useTodayAppointments({ pollIntervalMs: 30_000 });

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: tz,
  });

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'link2feed-config':
        navigate('/settings');
        break;
      case 'upload-csv':
        navigate('/csv-upload');
        break;
      case 'view-checkins':
        navigate('/check-ins');
        break;
      case 'view-settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <VStack spacing={{ base: 4, md: 5 }} align="stretch" w="full" maxW="100%" minW="0">
        {/* Compact toolbar — page title is in AdminLayout top bar */}
        <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
          <Text fontSize="sm" color="gray.500" fontWeight="500">
            {formattedDate} · Last refreshed {formatTime(lastRefresh)}
          </Text>
          <Button
            size={{ base: 'md', md: 'sm' }}
            variant="outline"
            leftIcon={<FiRefreshCw />}
            onClick={fetchCheckIns}
            isLoading={isLoadingCheckIns}
            borderColor="gray.300"
            color="gray.700"
            _hover={{ bg: 'white', borderColor: 'admin.primary', color: 'admin.primary' }}
          >
            Refresh
          </Button>
        </HStack>

        <DashboardOverview onAction={handleQuickAction} />

        <DashboardTabs
          checkIns={checkIns}
          isLoadingCheckIns={isLoadingCheckIns}
          onRefreshCheckIns={fetchCheckIns}
        />
      </VStack>

      <CSVHelpModal isOpen={isCSVHelpOpen} onClose={onCSVHelpClose} />
    </>
  );
};

export default DashboardPage;
