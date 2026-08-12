/**
 * @fileoverview Special requests page for Foodbank Check-In and Appointment System client application
 * 
 * This page allows clients to submit special accommodation requests,
 * dietary restrictions, accessibility needs, and other requirements
 * for their food bank visit.
 * 
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../AppointmentDetails.tsx} Appointment details page
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';
import { FaCarrot, FaLeaf, FaBreadSlice } from 'react-icons/fa';
import { MdMosque, MdSynagogue, MdNoFood } from 'react-icons/md';

import PageLayout from '../../../shared/components/layout/PageLayout';
import PageHeader from '../../../shared/components/ui/PageHeader';
import type { CheckInSession } from '../../../shared/types/CheckInResponse';
import { parseAppointmentDateTime } from '../../../shared/utils/appointmentDateUtils';
import { logger } from '../../../utils/logger';
import ProgressHeader from '../components/ProgressHeader';
import CheckInPageContainer from '../components/CheckInPageContainer';
import CheckInCard from '../components/CheckInCard';
import WelcomeCard from '../components/WelcomeCard';
import DietaryOptionsGrid from '../components/DietaryOptionsGrid';
import AdditionalInfoSection from '../components/AdditionalInfoSection';
import MobilityAssistanceSection from '../components/MobilityAssistanceSection';
import SpecialRequestsActionButtons from '../components/SpecialRequestsActionButtons';
import {
  buildTenantPath,
  useTenantConfig,
} from '../../../shared/contexts/TenantConfigContext';

// Mobile-friendly version with natural scrolling

interface SpecialRequest {
  dietaryRestrictions: string[];
  additionalInfo: string;
  unwantedFoods: string;
  allergies: string;
  hasMobilityIssues: boolean;
  diaperSize?: string;
}

const SpecialRequests: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { config, slug } = useTenantConfig();
  const tenantTz = config?.timezone || 'America/Vancouver';

  const [clientName, setClientName] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [checkInData, setCheckInData] = useState<CheckInSession | null>(null);
  const [formData, setFormData] = useState<SpecialRequest>({
    dietaryRestrictions: [],
    additionalInfo: '',
    unwantedFoods: '',
    allergies: '',
    hasMobilityIssues: false,
    diaperSize: '',
  });

  // Build once – avoids recreating on every render
  const dietaryOptions = useMemo(
    () => [
      { value: 'vegetarian', label: t('specialRequests.vegetarian'), icon: FaCarrot },
      { value: 'vegan', label: t('specialRequests.vegan'), icon: FaLeaf },
      { value: 'glutenFree', label: t('specialRequests.glutenFree'), icon: FaBreadSlice },
      { value: 'dairyFree', label: t('specialRequests.dairyFree'), icon: MdNoFood },
      { value: 'halal', label: t('specialRequests.halal'), icon: MdMosque },
      { value: 'kosher', label: t('specialRequests.kosher'), icon: MdSynagogue },
    ],
    // Recompute when language changes so labels update
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language]
  );

  useEffect(() => {
    // Defensive: sessionStorage may not exist on server or in certain embedded browsers
    if (typeof window === 'undefined') return;

    const raw = window.sessionStorage.getItem('checkInInfo');
    if (!raw) {
      navigate(buildTenantPath(slug));
      return;
    }

    try {
      const parsed: CheckInSession = JSON.parse(raw);
      setCheckInData(parsed);

      const name =
        parsed?.client?.firstName ||
        parsed?.client?.fullName ||
        parsed?.client?.lastName ||
        parsed?.firstName ||
        parsed?.fullName ||
        parsed?.lastName ||
        'Client';
      setClientName(name);

      // Parse appointment date/time using centralized utility
      const locale = (typeof navigator !== 'undefined' && navigator.language) || i18n.language || 'en-US';
      const { time, date } = parseAppointmentDateTime(parsed, locale, tenantTz);
      setAppointmentTime(time);
      setAppointmentDate(date);
    } catch (e) {
      logger.error('Invalid checkInData in sessionStorage', e);
    }
  }, [i18n.language, navigate, slug, tenantTz]);

  const toggleDietary = (value: string) => {
    setFormData((prev) => {
      const exists = prev.dietaryRestrictions.includes(value);
      return {
        ...prev,
        dietaryRestrictions: exists
          ? prev.dietaryRestrictions.filter((v) => v !== value)
          : [...prev.dietaryRestrictions, value],
      };
    });
  };

  const handleSubmit = () => {
    if (!checkInData) {
      toast({
        title: 'Session Expired',
        description: 'Your check-in session has expired. Please return to the start page and begin again.',
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'bottom',
        variant: 'subtle',
      });
      navigate(buildTenantPath(slug));
      return;
    }

    try {
      const payload = {
        checkInId: checkInData?.checkInId || String(Date.now()),
        clientId: checkInData?.clientId || 'unknown',
        dietaryRestrictions: formData.dietaryRestrictions,
        allergies: formData.allergies?.trim(),
        unwantedFoods: formData.unwantedFoods?.trim(),
        additionalInfo: formData.additionalInfo?.trim(),
        hasMobilityIssues: !!formData.hasMobilityIssues,
        diaperSize: formData.diaperSize?.trim(),
        submittedAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('specialRequestsData', JSON.stringify(payload));
      }

      toast({
        title: 'Preferences Saved',
        description: 'Your dietary preferences and special requests have been saved. Continuing to appointment details...',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
        variant: 'subtle',
      });

      navigate(buildTenantPath(slug, '/appointment-details'));
    } catch (e) {
      logger.error('Save error', e);
      toast({
        title: 'Save Failed',
        description: 'Unable to save your preferences. Please try again, or contact us if the problem persists.',
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'bottom',
        variant: 'subtle',
      });
    }
  };

  return (
    <PageLayout showBackButton isScrollable={false}>
      {/* Progress Indicator */}
      <ProgressHeader currentStep={2} totalSteps={4} />

      {/* Main Form Container */}
      <CheckInPageContainer
        css={{
          '@keyframes fadeIn': {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
          },
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
            '40%': { transform: 'translateY(-4px)' },
            '60%': { transform: 'translateY(-2px)' },
          },
        }}
      >
        <CheckInCard
          maxW={{ base: '100%', md: '700px', lg: '800px' }}
          p={{ base: 4, md: 6, lg: 8 }}
        >
          <PageHeader title={t('specialRequests.title')} subTitle={t('specialRequests.subtitle')} logoSize="sm" mb={4} />

          {/* Welcome Card */}
          <WelcomeCard
            clientName={clientName}
            appointmentDate={appointmentDate}
            appointmentTime={appointmentTime}
          />

          {/* Dietary Preferences */}
          <DietaryOptionsGrid
            options={dietaryOptions}
            selectedValues={formData.dietaryRestrictions}
            onToggle={toggleDietary}
          />

          {/* Volunteer Assistance */}
          <MobilityAssistanceSection
            hasMobilityIssues={formData.hasMobilityIssues}
            onToggleYes={() => setFormData((p) => ({ ...p, hasMobilityIssues: !p.hasMobilityIssues }))}
            onToggleNo={() => setFormData((p) => ({ ...p, hasMobilityIssues: false }))}
          />

          {/* Additional Notes */}
          <AdditionalInfoSection
            allergies={formData.allergies}
            unwantedFoods={formData.unwantedFoods}
            additionalInfo={formData.additionalInfo}
            diaperSize={formData.diaperSize || ''}
            onAllergiesChange={(value) => setFormData((p) => ({ ...p, allergies: value }))}
            onUnwantedFoodsChange={(value) => setFormData((p) => ({ ...p, unwantedFoods: value }))}
            onAdditionalInfoChange={(value) => setFormData((p) => ({ ...p, additionalInfo: value }))}
            onDiaperSizeChange={(value) => setFormData((p) => ({ ...p, diaperSize: value }))}
            t={t}
          />

          {/* Action Buttons */}
          <SpecialRequestsActionButtons onContinue={handleSubmit} continueLabel={t('common.continue')} />
        </CheckInCard>
      </CheckInPageContainer>
    </PageLayout>
  );
};

export default SpecialRequests;
