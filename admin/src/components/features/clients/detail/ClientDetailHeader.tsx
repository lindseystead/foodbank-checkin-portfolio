/**
 * @fileoverview Header section for client detail page
 */

import React from 'react';
import { Button, Heading, HStack } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { JoinedClient } from './types';
import PrintTicketButton from '../../../ui/PrintTicketButton';

interface ClientDetailHeaderProps {
  client: JoinedClient;
  onBack: () => void;
  onPrint: () => void;
}

const ClientDetailHeader: React.FC<ClientDetailHeaderProps> = ({
  client,
  onBack,
  onPrint,
}) => {
  return (
    <HStack justify="space-between" align="center" w="full" maxW="100%" flexWrap="wrap" gap={{ base: 2, sm: 3 }}>
      <HStack spacing={4}>
        <Button leftIcon={<ArrowBackIcon />} variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Heading size="xl" color="admin.primary" fontWeight="700" letterSpacing="-0.025em">
          {client.lastName}, {client.firstName}
        </Heading>
      </HStack>
      <PrintTicketButton variant="full" onClick={onPrint} />
    </HStack>
  );
};

export default ClientDetailHeader;
