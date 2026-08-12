/**
 * @fileoverview Clients page — wraps the existing ClientLookup feature
 * as a top-level navigable page (instead of being buried in a dashboard tab).
 */

import React from 'react';
import { Box } from '@chakra-ui/react';
import { ClientLookup } from '../components/features/clients/ClientLookup';

const ClientsPage: React.FC = () => (
  <Box w="full">
    <ClientLookup />
  </Box>
);

export default ClientsPage;
