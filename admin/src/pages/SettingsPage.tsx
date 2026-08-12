/**
 * @fileoverview Settings page for Foodbank Check-In and Appointment System admin panel
 * 
 * This page provides system configuration options, user preferences,
 * and administrative settings for customizing the food bank system
 * behavior and appearance.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../components/features/dashboard/Link2FeedStatus.tsx} Link2Feed status
 */

import { VStack, Grid, GridItem } from '@chakra-ui/react';
import PageHeader from '../components/ui/PageHeader';
import {
  SettingsOverviewCards,
  SettingsPrimaryColumn,
  SettingsSecondaryColumn,
} from '../components/features/settings';

const SettingsPage: React.FC = () => {
  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch" w="full" maxW="100%" minW="0">
        {/* Page Header */}
        <PageHeader
          title="System Settings"
          description="Manage system integrations, security settings, and configuration preferences. Configure your Link2Feed API connection or use CSV-only mode for data management."
          maxW="700px"
        />

        <SettingsOverviewCards />

        {/* Main Settings Sections */}
        <Grid 
          templateColumns={{ base: '1fr', lg: '2fr 1fr' }} 
          gap={{ base: 4, md: 6 }} 
          w="full" 
          maxW="100%" 
          minW="0"
        >
          {/* Primary Settings Column */}
          <GridItem w="full" maxW="100%" minW="0">
            <SettingsPrimaryColumn />
          </GridItem>

          {/* Secondary Settings Column */}
          <GridItem w="full" maxW="100%" minW="0">
            <SettingsSecondaryColumn />
          </GridItem>
        </Grid>
      </VStack>
  );
};

export default SettingsPage;
