/**
 * @fileoverview Header section for the Check-ins page
 */

import React from 'react';
import { Stack, Button, VStack } from '@chakra-ui/react';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';
import PageHeader from '../../ui/PageHeader';

interface CheckInsHeaderProps {
  onExport: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const CheckInsHeader: React.FC<CheckInsHeaderProps> = ({
  onExport,
  onRefresh,
  isLoading,
}) => {
  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch" mb={6}>
      <PageHeader
        title="Client Check-ins"
        description="Manage and view all client check-ins for today"
        textAlign="center"
      />

      <Stack
        direction={{ base: 'column', sm: 'row' }}
        spacing={3}
        w="full"
        justify={{ base: 'center', lg: 'flex-end' }}
      >
        <Button
          size={{ base: 'md', sm: 'sm' }}
          variant="outline"
          leftIcon={<FiDownload />}
          onClick={onExport}
          w={{ base: 'full', sm: 'auto' }}
        >
          Export All Appointments
        </Button>
        <Button
          size={{ base: 'md', sm: 'sm' }}
          variant="outline"
          leftIcon={<FiRefreshCw />}
          onClick={onRefresh}
          isLoading={isLoading}
          w={{ base: 'full', sm: 'auto' }}
        >
          Refresh Data
        </Button>
      </Stack>
    </VStack>
  );
};

export default CheckInsHeader;
