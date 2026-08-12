/**
 * @fileoverview Appointment details page for Foodbank Check-In and Appointment System client application
 * 
 * This page displays appointment information and allows clients to confirm their
 * next appointment. It shows appointment details, system features, and provides
 * a streamlined confirmation process.
 * 
 * Features:
 * - Auto-schedules the next appointment 21 days from today
 * - Displays the appointment date clearly
 * - Shows system features and benefits
 * - Includes important notices about arrival and policies
 * - Responsive Chakra UI layout with modern design
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../Confirmation.tsx} Confirmation page
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, useToast, useDisclosure } from "@chakra-ui/react";
import PrimaryButton from "../../../shared/components/buttons/PrimaryButton";
import AssistanceButton from "../../../shared/components/buttons/AssistanceButton";
import PageLayout from '../../../shared/components/layout/PageLayout';
import PageHeader from '../../../shared/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';
import { api } from '../../../shared/lib/api';
import { logger } from '../../../utils/logger';
import { useNextAppointment } from '../hooks/useNextAppointment';
import ProgressHeader from '../components/ProgressHeader';
import { VALID_TIMES } from '../../../shared/config/appointmentConfig';
import { formatTime24to12 } from '../../../shared/utils/appointmentDateUtils';
import {
  buildTenantPath,
  useTenantConfig,
} from '../../../shared/contexts/TenantConfigContext';
import CheckInPageContainer from '../components/CheckInPageContainer';
import CheckInCard from '../components/CheckInCard';
import RescheduleModal from '../components/RescheduleModal';
import NextAppointmentCard from '../components/NextAppointmentCard';
import SystemFeaturesSection from '../components/SystemFeaturesSection';
import ImportantInfoSection from '../components/ImportantInfoSection';
import CheckInSummaryCard from '../components/CheckInSummaryCard';


const AppointmentDetails: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen: isRescheduleOpen, onOpen: onRescheduleOpen, onClose: onRescheduleClose } = useDisclosure();
  const { config, slug } = useTenantConfig();
  const tenantTz = config?.timezone || 'America/Vancouver';

  const { t } = useTranslation();

  const [checkInId, setCheckInId] = useState<string | null>(null);

  const { nextAppointment, refreshNextAppointment, setNextAppointment } = useNextAppointment({
    checkInId,
    enablePolling: true,
    tenantTz,
  });
  
  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('10:00');
  const [isRescheduling, setIsRescheduling] = useState(false);
  
  // Valid time slots (from shared config)
  const validTimes = VALID_TIMES;

  // Load appointment data on mount (polling handled by hook)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkInData = window.sessionStorage.getItem('checkInInfo');
    if (!checkInData) {
      navigate(buildTenantPath(slug));
      return;
    }
    try {
      const parsed = JSON.parse(checkInData);
      if (parsed.checkInId) {
        setCheckInId(parsed.checkInId);
        refreshNextAppointment(parsed.checkInId);
      }
    } catch (error) {
      logger.error('Error parsing checkInData:', error);
    }
  }, [navigate, refreshNextAppointment, slug]);
  
  // Handle reschedule appointment
  const handleReschedule = async () => {
    if (isRescheduling) return;

    if (!checkInId || !rescheduleDate) {
      toast({
        title: 'Error',
        description: 'Please select a date and time for your appointment.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsRescheduling(true);
    
    try {
      const response = await api(`/checkin/${checkInId}/reschedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDate: rescheduleDate, newTime: rescheduleTime }),
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Update local state
        const newDate = new Date(data.data.nextAppointmentISO);

        setNextAppointment({
          date: data.data.nextAppointmentDate,
          time: formatTime24to12(data.data.nextAppointmentTime || '10:00'),
          formattedDate: newDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: tenantTz
          })
        });
        
        // Update sessionStorage
        const checkInData = window.sessionStorage.getItem('checkInInfo');
        if (checkInData) {
          try {
            const parsed = JSON.parse(checkInData);
            parsed.nextAppointmentDate = data.data.nextAppointmentDate;
            parsed.nextAppointmentTime = data.data.nextAppointmentTime;
            parsed.nextAppointmentISO = data.data.nextAppointmentISO;
            window.sessionStorage.setItem('checkInInfo', JSON.stringify(parsed));
          } catch (e) {
            logger.error('Error updating sessionStorage:', e);
          }
        }
        
        toast({
          title: 'Appointment Rescheduled',
          description: 'Your appointment has been successfully rescheduled.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        onRescheduleClose();
        setRescheduleDate('');
        setRescheduleTime('10:00');
      } else {
        throw new Error(data.error || 'Failed to reschedule appointment');
      }
    } catch (error: unknown) {
      logger.error('Reschedule error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to reschedule appointment. Please try again.';
      toast({
        title: 'Reschedule Failed',
        description: errorMessage,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsRescheduling(false);
    }
  };
  
  // Calculate minimum date (21 days from today, in the tenant timezone)
  const getMinDate = () => {
    // "Today" as seen in the tenant timezone (en-CA yields YYYY-MM-DD).
    const todayInTenantTz = new Date().toLocaleDateString('en-CA', { timeZone: tenantTz });
    const [year, month, day] = todayInTenantTz.split('-').map(Number);
    // Add 21 days using a UTC date so DST/local offsets don't shift the day.
    const minDate = new Date(Date.UTC(year, month - 1, day + 21));
    return minDate.toISOString().split('T')[0];
  };

  const handleSubmit = () => {
    if (!nextAppointment) {
      logger.error('No next appointment available');
      return;
    }
    
    const appointmentData = {
      date: nextAppointment.date,
      formattedDate: nextAppointment.formattedDate,
      time: nextAppointment.time,
    };
    sessionStorage.setItem("appointmentData", JSON.stringify(appointmentData));
    navigate(buildTenantPath(slug, '/confirmation'));
  };

  return (
    <PageLayout showBackButton isScrollable>
      <ProgressHeader currentStep={3} totalSteps={4} boxShadow="sm" />

      {/* Main content container with responsive spacing and sizing */}
      <CheckInPageContainer py={{ base: 4, md: 6 }}>
        <CheckInCard
          maxW={{ base: '100%', md: '1000px' }}
          p={{ base: 4, md: 8 }}
        >
          <PageHeader
            title={t('appointment.title')}
            subTitle={t('appointment.subtitle')}
            logoSize="sm"
            mb={4}
          />

          {/* Next Appointment Information - Enhanced Design */}
          <NextAppointmentCard nextAppointment={nextAppointment} onReschedule={onRescheduleOpen} />

          {/* System Features - Proof of Concept Showcase */}
          <SystemFeaturesSection />

          {/* Important Information - Enhanced */}
          <ImportantInfoSection />

          {/* Check-In Summary Card */}
          <CheckInSummaryCard nextAppointment={nextAppointment} />

          {/* Action Buttons */}
          <Stack
            spacing={{ base: 4, md: 4 }}
            direction={{ base: "column", md: "row" }}
            width="full"
            pt={{ base: 2, md: 4 }}
            justify="center"
            align="center"
            mt={{ base: 2, md: 4 }}
            maxW={{ base: "100%", md: "700px" }}
            mx="auto"
          >
            <AssistanceButton />
            <PrimaryButton onClick={handleSubmit}>
              {t('common.continue')}
            </PrimaryButton>
          </Stack>
        </CheckInCard>
      </CheckInPageContainer>
      
      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={onRescheduleClose}
        rescheduleDate={rescheduleDate}
        rescheduleTime={rescheduleTime}
        onDateChange={setRescheduleDate}
        onTimeChange={setRescheduleTime}
        validTimes={validTimes}
        getMinDate={getMinDate}
        onConfirm={handleReschedule}
        isSubmitting={isRescheduling}
        tenantTz={tenantTz}
      />
    </PageLayout>
  );
};

export default AppointmentDetails;
