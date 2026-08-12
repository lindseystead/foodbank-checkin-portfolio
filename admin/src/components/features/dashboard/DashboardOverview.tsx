/**
 * @fileoverview Dashboard overview row — Quick Actions + Data Status.
 * (Find Client is already a sidebar link and a dashboard tab, so it's
 * not duplicated here.)
 *
 * @version 2.1.0
 */

import React from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import QuickActions from './QuickActions';
import { CSVStatus } from './CSVStatus';
import DashboardCard from '../../ui/DashboardCard';

interface DashboardOverviewProps {
  onAction: (actionId: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onAction }) => (
  <Box w="full" minW={0}>
    <Grid
      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
      gap={{ base: 3, md: 4 }}
      alignItems="start"
    >
      <GridItem minW={0}>
        {/* QuickActions renders its own header internally */}
        <DashboardCard>
          <QuickActions onAction={onAction} />
        </DashboardCard>
      </GridItem>
      <GridItem minW={0}>
        <DashboardCard title="Data Status" showHeader>
          <CSVStatus />
        </DashboardCard>
      </GridItem>
    </Grid>
  </Box>
);

export default DashboardOverview;
