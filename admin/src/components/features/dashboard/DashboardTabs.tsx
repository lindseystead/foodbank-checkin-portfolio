/**
 * @fileoverview Dashboard tabs — slim wrapper over Chakra Tabs.
 * No outer card, no centered "Client Check-Ins" heading (page title is
 * already in the AdminLayout top bar). Each panel renders its own card.
 *
 * @version 2.0.0
 */

import React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { CSVDataViewer } from '../csv/CSVDataViewer';
import { ClientLookup } from '../clients/ClientLookup';
import CheckInAnalyticsChart from './CheckInAnalyticsChart';
import HelpRequestsTable from './HelpRequestsTable';
import RecentCheckInsList from './RecentCheckInsList';
import { CheckInRecord } from '../../../types/checkIn';

interface DashboardTabsProps {
  checkIns: CheckInRecord[];
  isLoadingCheckIns: boolean;
  onRefreshCheckIns: () => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  checkIns,
  isLoadingCheckIns,
  onRefreshCheckIns,
}) => {
  return (
    <Box w="full" minW={0}>
      <Tabs variant="line" colorScheme="brand" isLazy>
        <TabList
          overflowX="auto"
          overflowY="hidden"
          borderBottomColor="gray.200"
          css={{
            '&::-webkit-scrollbar': { height: '4px' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.2)' },
            scrollbarWidth: 'thin',
          }}
        >
          {['Analytics', 'Recent Activity', 'Find Client', 'Clients', 'Help Requests'].map((label) => (
            <Tab
              key={label}
              fontSize="sm"
              fontWeight="600"
              color="gray.600"
              _selected={{ color: 'admin.primary', borderColor: 'admin.primary' }}
              _focusVisible={{ boxShadow: '0 0 0 2px var(--chakra-colors-admin-primary)', outline: 'none' }}
              whiteSpace="nowrap"
            >
              {label}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel px={0} pt={4}>
            <CheckInAnalyticsChart />
          </TabPanel>
          <TabPanel px={0} pt={4}>
            <RecentCheckInsList
              checkIns={checkIns}
              isLoading={isLoadingCheckIns}
              onRefresh={onRefreshCheckIns}
            />
          </TabPanel>
          <TabPanel px={0} pt={4}>
            <ClientLookup />
          </TabPanel>
          <TabPanel px={0} pt={4}>
            <CSVDataViewer />
          </TabPanel>
          <TabPanel px={0} pt={4}>
            <HelpRequestsTable />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default DashboardTabs;
