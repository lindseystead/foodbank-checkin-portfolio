/**
 * @fileoverview Header system status component for Foodbank Check-In and Appointment System admin panel
 * 
 * This component displays real-time system status information in the
 * admin panel header, including connection status, data freshness,
 * and system health indicators for monitoring purposes.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../AdminLayout.tsx} Main layout component
 */

import React, { useState, useEffect } from 'react';
import { fetchLink2FeedStatus } from '../lib/statusService';
import {
  HStack,
  VStack,
  Text,
  Badge,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FiCheckCircle, FiXCircle, FiLink, FiUpload } from 'react-icons/fi';
import { logger } from '../utils/logger';

interface SystemStatus {
  link2Feed: boolean;
  csv: boolean;
}

const HeaderSystemStatus: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    link2Feed: false,
    csv: true,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await fetchLink2FeedStatus();
        
        setStatus({
          link2Feed: !!(data.success && data.data?.configured),
          csv: true,
        });
      } catch (error: any) {
        // Handle API not configured gracefully (expected in CSV-only mode)
        if (error?.message === 'API_NOT_CONFIGURED') {
          logger.debug('API not configured - CSV-only mode');
        } else if (error?.message === 'RATE_LIMITED') {
          logger.debug('Rate limited - using cached status');
        } else {
          logger.debug('Backend not available, using default status');
        }
        setStatus({
          link2Feed: false,
          csv: true, // CSV is always available as fallback
        });
      }
    };

    fetchStatus();
  }, []);

  const getStatusIcon = (isWorking: boolean) => {
    return isWorking ? FiCheckCircle : FiXCircle;
  };

  const getStatusColor = (isWorking: boolean) => {
    return isWorking ? 'green' : 'red';
  };

  return (
    <HStack spacing={3} pr={4} borderRight="1px solid" borderColor="gray.200">
      {/* Link2Feed Status */}
      <Tooltip label={status.link2Feed ? 'Link2Feed API Connected' : 'Link2Feed Not Configured'} placement="bottom">
        <VStack spacing={0} align="center">
          <HStack spacing={1}>
            <Icon as={FiLink} color="blue.500" boxSize={3} />
            <Icon as={getStatusIcon(status.link2Feed)} color={`${getStatusColor(status.link2Feed)}.500`} boxSize={3} />
          </HStack>
          <Text fontSize="xs" color="gray.500">
            API
          </Text>
        </VStack>
      </Tooltip>

      {/* CSV Status */}
      <Tooltip label="CSV Files Available" placement="bottom">
        <VStack spacing={0} align="center">
          <HStack spacing={1}>
            <Icon as={FiUpload} color="green.500" boxSize={3} />
            <Icon as={getStatusIcon(status.csv)} color={`${getStatusColor(status.csv)}.500`} boxSize={3} />
          </HStack>
          <Text fontSize="xs" color="gray.500">
            CSV
          </Text>
        </VStack>
      </Tooltip>

      {/* System Status Summary */}
      <VStack spacing={0} align="center">
        <Badge 
          colorScheme={status.link2Feed ? 'green' : 'red'} 
          variant="subtle" 
          fontSize="xs"
          px={2}
          py={1}
        >
          {status.link2Feed ? 'API + CSV' : 'CSV Only'}
        </Badge>
        <Text fontSize="xs" color="gray.500">
          System
        </Text>
      </VStack>
    </HStack>
  );
};

export default HeaderSystemStatus;
