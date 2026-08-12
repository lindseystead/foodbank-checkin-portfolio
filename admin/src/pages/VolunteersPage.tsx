/**
 * @fileoverview Volunteer management page (coordinator/director).
 * Tabs: Roster (approve/reject) and Shifts (schedule management).
 */

import React from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { VolunteerRoster } from '../components/features/volunteers/VolunteerRoster';
import { ShiftManager } from '../components/features/volunteers/ShiftManager';

const VolunteersPage: React.FC = () => (
  <Box w="full">
    <Tabs colorScheme="blue" variant="enclosed" isLazy>
      <TabList>
        <Tab>Roster</Tab>
        <Tab>Shifts</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <VolunteerRoster />
        </TabPanel>
        <TabPanel px={0}>
          <ShiftManager />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Box>
);

export default VolunteersPage;
