/**
 * @fileoverview Confirmation page component for Foodbank Check-In and Appointment System client application
 * 
 * This component handles the final step of the check-in process, displaying confirmation
 * details and completing the check-in transaction. It processes all collected data
 * including special requests and appointment details, then submits the complete
 * check-in information to the backend API.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../services/checkInService.ts} Check-in service for API communication
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade, useDisclosure } from '@chakra-ui/react';
import PageLayout from '../../../shared/components/layout/PageLayout';
import { logger } from '../../../utils/logger';
import { useTranslation } from 'react-i18next';
import { CheckInService, CompleteCheckInData } from '../services/checkInService';
import { useNextAppointment } from '../hooks/useNextAppointment';
import ProgressHeader from '../components/ProgressHeader';
import CheckInPageContainer from '../components/CheckInPageContainer';
import CheckInCard from '../components/CheckInCard';
import ConfirmationAppointmentSummary from '../components/ConfirmationAppointmentSummary';
import PreferencesSummarySection from '../components/PreferencesSummarySection';
import ThankYouModal from '../components/ThankYouModal';
import ConfirmationSuccessIcon from '../components/ConfirmationSuccessIcon';
import ConfirmationActionButtons from '../components/ConfirmationActionButtons';
import ConfirmationHeader from '../components/ConfirmationHeader';
import {
  buildTenantPath,
  useTenantConfig,
} from '../../../shared/contexts/TenantConfigContext';
import { calculateMilkJugs, calculateEggDozens, calculateSnackPacks } from '../../../shared/utils/allocationUtils';

const clearCheckInSession = () => {
  sessionStorage.removeItem('checkInInfo');
  sessionStorage.removeItem('specialRequestsData');
  sessionStorage.removeItem('appointmentData');
};

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { config, slug } = useTenantConfig();
  const [checkInId, setCheckInId] = useState<string | null>(null);
  const { nextAppointment, refreshNextAppointment } = useNextAppointment({
    checkInId,
    tenantTz: config?.timezone || 'America/Vancouver',
  });
  // Prevent duplicate complete-check-in when tenant config / callback identities change
  const hasCompletedRef = useRef(false);
  const locationNameRef = useRef(config?.name || 'Food Bank');
  const refreshRef = useRef(refreshNextAppointment);

  useEffect(() => {
    locationNameRef.current = config?.name || 'Food Bank';
  }, [config?.name]);

  useEffect(() => {
    refreshRef.current = refreshNextAppointment;
  }, [refreshNextAppointment]);

  // Complete the check-in process once on mount
  useEffect(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    let cancelled = false;

    const completeCheckIn = async () => {
      try {
        // Get all data from session storage
        const checkInInfo = JSON.parse(sessionStorage.getItem('checkInInfo') || '{}');
        const specialRequestsData = JSON.parse(sessionStorage.getItem('specialRequestsData') || '{}');
        const appointmentData = JSON.parse(sessionStorage.getItem('appointmentData') || '{}');

        // Validate required data
        if (!checkInInfo.checkInId || !checkInInfo.clientId) {
          logger.error('Missing required check-in data:', checkInInfo);
          navigate(buildTenantPath(slug));
          return;
        }
        if (!cancelled) setCheckInId(checkInInfo.checkInId);

        // Prepare complete check-in data
        const completeData: CompleteCheckInData = {
          checkInId: checkInInfo.checkInId,
          clientId: checkInInfo.clientId,
          clientName: checkInInfo.clientName || 'Unknown Client',
          phoneNumber: checkInInfo.phoneNumber || '',
          checkInTime: new Date().toISOString(),
          appointmentTime: checkInInfo.appointmentTime || null,
          completionTime: new Date().toISOString(),
          status: 'Pending',
          
          // Special requests data
          dietaryRestrictions: specialRequestsData.dietaryRestrictions || [],
          allergies: specialRequestsData.allergies || '',
          unwantedFoods: specialRequestsData.unwantedFoods || '',
          additionalInfo: specialRequestsData.additionalInfo || '',
          householdInfoChanged: specialRequestsData.householdInfoChanged || false,
          hasMobilityIssues: specialRequestsData.hasMobilityIssues || false,
          diaperSize: specialRequestsData.diaperSize || '',
          
          // Appointment details
          notificationPreference: appointmentData.notificationPreference || 'email',
          email: appointmentData.email || '',
          phone: appointmentData.phone || '',
          phoneCarrier: appointmentData.phoneCarrier || '',
          
          // Next appointment data is auto-generated by the backend
          
          // Location and type
          location: locationNameRef.current,
          clientType: 'returning'
        };

        // Send complete check-in data to backend
        const result = await CheckInService.completeCheckIn(completeData);
        if (cancelled) return;

        if (result.success) {
          // Update session storage with next appointment from response (if available)
          if (result.data?.nextAppointmentDate) {
            const updatedCheckInInfo = {
              ...checkInInfo,
              nextAppointmentDate: result.data.nextAppointmentDate,
              nextAppointmentTime: result.data.nextAppointmentTime,
              nextAppointmentISO: result.data.nextAppointmentISO,
              ticketNumber: result.data.ticketNumber,
              isAutoGenerated: result.data.isAutoGenerated
            };
            sessionStorage.setItem('checkInInfo', JSON.stringify(updatedCheckInInfo));
          }
          
          // Fetch next appointment data using checkInId (ensures latest data including admin changes)
          // Falls back to session storage if API call fails
          if (checkInInfo.checkInId) {
            await refreshRef.current(checkInInfo.checkInId);
          } else {
            refreshRef.current();
          }
        } else {
          logger.error('Failed to complete check-in:', result.error);
        }
      } catch (error) {
        logger.error('Error completing check-in:', error);
      }
    };

    completeCheckIn();
    return () => {
      cancelled = true;
    };
    // Mount-once: identity changes must not re-fire completion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add useEffect for auto-close
  React.useEffect(() => {
    let timer: number;
    if (isOpen) {
      timer = window.setTimeout(() => {
        onClose();
        clearCheckInSession();
        navigate(buildTenantPath(slug));
      }, 10000); // 10 seconds
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, navigate, onClose, slug]);


  // Get check-in data
  const checkInData = React.useMemo(() => {
    try {
      const data = JSON.parse(sessionStorage.getItem('checkInInfo') || '{}');
      return {
        ...data,
        lastName: data.clientName?.split(' ').pop() || 'Guest',
      };
    } catch (error) {
      return { lastName: 'Guest' };
    }
  }, []);

  // Get special requests data
  const specialRequestsData = React.useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('specialRequestsData') || '{}');
    } catch (error) {
      return {};
    }
  }, []);

  // Get appointment details for display
  const appointmentDetails = React.useMemo(() => {
    const checkInInfo = JSON.parse(sessionStorage.getItem('checkInInfo') || '{}');
    const appointment = checkInInfo.appointment;
    const client = checkInInfo.client;
    
    // Use the correct next appointment data from backend instead of session storage
    const nextAppointmentFormatted = nextAppointment?.formattedDate || "Loading...";
    const nextAppointmentTime = nextAppointment?.time || "10:00 AM";
    
    return {
      sortOd: checkInInfo.clientId || "1234",
      orderTypeOdd: "Regular",
      clientName: checkInData.lastName || "Guest",
      rebookMonth: nextAppointmentFormatted.split(' ')[1] || "October",
      rebookDay: nextAppointmentFormatted.split(' ')[2]?.replace(',', '') || "15",
      rebookDayName: nextAppointmentFormatted.split(' ')[0] || "Friday",
      rebookTime: nextAppointmentTime,
      householdSize: appointment?.householdSize || 4,
      orderTypeEven: "Regular",
      milk: calculateMilkJugs(appointment?.householdSize || 4),
      eggs: calculateEggDozens(appointment?.householdSize || 4),
      snackPacks: calculateSnackPacks(appointment?.householdSize || 4),
      dietaryRequirements: client?.dietary || "None",
      allergiesList: specialRequestsData.allergies || "None",
      unwantedFoods: specialRequestsData.unwantedFoods || "None",
      childrenUncategorized: "5, 7, 12",
      childrenMale: "5, 7",
      infantAge: "N/A",
      requests: specialRequestsData.additionalInfo || "",
      manualNotes: "",
      dietaryRestrictions: specialRequestsData.dietaryRestrictions || ["None"],
      householdInfoChanged: specialRequestsData.householdInfoChanged || false,
      hasMobilityIssues: specialRequestsData.hasMobilityIssues || false,
      additionalInfo: specialRequestsData.additionalInfo || "",
      provisions: appointment?.provisions || "Standard provisions"
    };
  }, [checkInData, nextAppointment, specialRequestsData]);
  // Dietary preference translation mapping
  const dietaryKeyMap: Record<string, string> = {
    'vegetarian': 'vegetarian',
    'vegan': 'vegan',
    'glutenFree': 'glutenFree',
    'dairyFree': 'dairyFree',
    'halal': 'halal',
    'kosher': 'kosher',
  };

  return (
    <PageLayout showBackButton={false} isScrollable>
      <ProgressHeader
        currentStep={4}
        totalSteps={4}
        insetBelowBackButton={false}
        boxShadow="sm"
      />

      {/* Main content container with responsive spacing and sizing */}
      <CheckInPageContainer py={{ base: 4, md: 6 }}>
        <CheckInCard
          maxW={{ base: '100%', md: '900px' }}
          p={{ base: 4, md: 6 }}
        >
          {/* Page Header */}
          <ConfirmationHeader />

          {/* Success Icon */}
          <ConfirmationSuccessIcon />

          {/* Appointment Summary - Compact */}
          <Fade in={true} delay={0.2}>
            <ConfirmationAppointmentSummary nextAppointment={nextAppointment} />
          </Fade>


          {/* Your Preferences Summary */}
          <PreferencesSummarySection
            appointmentDetails={appointmentDetails}
            specialRequestsData={specialRequestsData}
            dietaryKeyMap={dietaryKeyMap}
            t={t}
          />

          {/* Action Buttons */}
          <ConfirmationActionButtons onFinish={onOpen} doneLabel={t('common.done')} />
        </CheckInCard>
      </CheckInPageContainer>
      
      {/* Thank You Modal */}
      <ThankYouModal
        isOpen={isOpen}
        onClose={onClose}
        onDone={() => {
          onClose();
          clearCheckInSession();
          navigate(buildTenantPath(slug));
        }}
      />
    </PageLayout>
  );
};

export default Confirmation;
