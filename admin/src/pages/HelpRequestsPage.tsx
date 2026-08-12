/**
 * @fileoverview Help Requests page — wraps the existing HelpRequestsTable
 * as a top-level navigable page.
 */

import React from 'react';
import { Box } from '@chakra-ui/react';
import HelpRequestsTable from '../components/features/dashboard/HelpRequestsTable';

const HelpRequestsPage: React.FC = () => (
  <Box w="full">
    <HelpRequestsTable />
  </Box>
);

export default HelpRequestsPage;
