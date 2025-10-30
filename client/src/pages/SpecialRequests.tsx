/**
 * @fileoverview Special requests page for Foodbank Check-In and Appointment System client application
 * 
 * This page allows clients to submit special accommodation requests,
 * dietary restrictions, accessibility needs, and other requirements
 * for their food bank visit.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../AppointmentDetails.tsx} Appointment details page
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { FaCarrot, FaLeaf, FaBreadSlice } from 'react-icons/fa';
import { MdMosque, MdSynagogue, MdNoFood } from 'react-icons/md';

import PageLayout from '../components/layout/PageLayout';
import ProgressSteps from '../components/layout/ProgressSteps';
import PrimaryButton from '../components/buttons/PrimaryButton';
import AssistanceButton from '../components/buttons/AssistanceButton';
import PageHeader from '../components/ui/PageHeader';

/**
 * Mobile‑safe Special Requests page.
 * - Removes nested animated containers + absolute positioning
 * - Uses natural page scroll with sticky progress header
 * - Defensive parsing of sessionStorage
 * - Touch‑friendly toggle pills for dietary preferences
 */

interface SpecialRequest {
  dietaryRestrictions: string[];
  additionalInfo: string;
  unwantedFoods: string;
  allergies: string;
  hasMobilityIssues: boolean;
  diaperSize?: string;
}

// Interactive toggle button with theme colors
const ToggleButton: React.FC<{
  isActive: boolean;
  onToggle: () => void;
  label: string;
  icon?: React.ElementType;
}> = ({ isActive, onToggle, label, icon: IconCmp }) => {
  return (
    <Button
      onClick={onToggle}
      width="100%"
      height="52px"
      variant={isActive ? 'solid' : 'outline'}
      bg={isActive ? 'client.primary' : 'white'}
      color={isActive ? 'white' : 'gray.700'}
      borderColor={isActive ? 'client.primary' : 'gray.300'}
      borderRadius="lg"
      fontWeight="500"
      fontSize="sm"
      leftIcon={IconCmp ? <IconCmp size={16} /> : undefined}
      _hover={{
        bg: isActive ? 'client.primary' : 'brand.50',
        borderColor: isActive ? 'client.primary' : 'brand.300',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(37, 56, 93, 0.2)',
        _before: {
          left: '100%',
        },
      }}
      _active={{
        transform: 'translateY(0)',
        boxShadow: '0 2px 4px rgba(37, 56, 93, 0.2)',
      }}
      _focus={{
        boxShadow: '0 0 0 3px rgba(37, 56, 93, 0.3)',
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      whiteSpace="normal"
      textAlign="center"
      px={4}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: 'left 0.5s',
      }}
    >
      {label}
    </Button>
  );
};

const SpecialRequests: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const [clientName, setClientName] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [checkInData, setCheckInData] = useState<any>(null);
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
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
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

      // Note: We don't pre-select dietary restrictions to avoid showing "1 selected" 
      // when the user hasn't actually made a selection
      // const csvDiet = parsed?.client?.dietary;
      // const pre = csvDiet && `${csvDiet}`.toLowerCase() !== 'none' ? [String(csvDiet)] : [];
      // if (pre.length) {
      //   setFormData((prev) => ({ ...prev, dietaryRestrictions: pre }));
      // }

      const locale = (typeof navigator !== 'undefined' && navigator.language) || i18n.language || 'en-US';
      
      // Use the actual appointment time from CSV data
      if (parsed.appointmentTime) {
        // Parse the ISO string directly to get Pacific time components
        // Format expected: "2025-10-27T09:00:00-07:00" or "2025-10-27T09:00:00"
        const isoString = parsed.appointmentTime;
        
        // Extract date and time components from the ISO string
        const match = isoString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
        
        if (match) {
          const [, year, month, day, hour, minute] = match.map(Number);
          
          // Format time with AM/PM
          const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const timeStr = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
          
          // Format date (create Date object with these values to get weekday name)
          const dateObj = new Date(year, month - 1, day);
          const dateStr = dateObj.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
          
          setAppointmentTime(timeStr);
          setAppointmentDate(dateStr);
        } else {
          // Fallback to Date parsing if format is unexpected
          const appointmentDate = new Date(parsed.appointmentTime);
          setAppointmentTime(
            appointmentDate.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true })
          );
          setAppointmentDate(
            appointmentDate.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })
          );
        }
      } else {
        // Fallback to current time if no appointment time available
        const now = new Date();
        setAppointmentTime(
          now.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Vancouver' })
        );
        setAppointmentDate(
          now.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Vancouver' })
        );
      }
    } catch (e) {
      console.error('Invalid checkInData in sessionStorage', e);
    }
  }, [i18n.language]);

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
        title: t('errors.title') || 'Error',
        description: t('errors.checkinMissing') || 'Check-in data not found. Please start over.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
        title: 'Saved',
        description: 'Your special requests have been saved.',
        status: 'success',
        duration: 2500,
        isClosable: true,
      });

      navigate('/appointment-details');
    } catch (e) {
      console.error('Save error', e);
      toast({
        title: t('errors.title') || 'Error',
        description: t('errors.saveFailed') || 'Failed to save your preferences. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <PageLayout showBackButton isScrollable={false}>
      {/* Progress Indicator */}
      <Box
        w="full"
        position="absolute"
        top={{ base: "60px", md: "0" }}
        left="0"
        right="0"
        bg="white"
        zIndex="1"
        pb={{ base: 1, md: 0.5 }}
        pt={0}
      >
        <ProgressSteps
          currentStep={2}
          totalSteps={4}
          labels={[
            t('navigation.progressSteps.initialCheckIn'),
            t('navigation.progressSteps.specialRequests'),
            t('navigation.progressSteps.appointmentDetails'),
            t('navigation.progressSteps.confirmation'),
          ]}
        />
      </Box>

      {/* Main Form Container */}
      <VStack 
        spacing={{ base: 4, md: 6, lg: 8 }} 
        width="full" 
        maxW={{ base: "100%", sm: "90%", md: "800px", lg: "900px", xl: "1000px" }} 
        mx="auto" 
        mt={{ base: "100px", md: "60px" }}
        px={{ base: 4, md: 6, lg: 8 }}
        position="relative"
        zIndex="0"
        minH="auto"
        maxH="none"
        pb={{ base: 4, md: 6 }}
        overflowY={{ base: "auto", md: "hidden" }}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '24px',
          },
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
        <Box
          w="full"
          maxW={{ base: "100%", md: "700px", lg: "800px" }}
          mx="auto"
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          p={{ base: 4, md: 6, lg: 8 }}
          overflow="visible"
        >
          <PageHeader title={t('specialRequests.title')} subTitle={t('specialRequests.subtitle')} logoSize="sm" mb={2} />

          {/* Welcome Card */}
          <Box 
            bg="brand.50" 
            border="1px solid" 
            borderColor="brand.200" 
            borderRadius="xl" 
            p={6} 
            mb={8}
            textAlign="center"
            boxShadow="sm"
          >
            <Heading size="lg" color="client.primary" mb={2}>
              👋 Hello {clientName}! We found your appointment
            </Heading>
            <Box 
              display="flex" 
              flexDirection={{ base: "column", sm: "row" }} 
              alignItems="center" 
              justifyContent="center" 
              gap={{ base: 1, sm: 2 }}
              flexWrap="wrap"
            >
              <Text color="brand.600" fontSize="sm" fontWeight="500">
                📅 {appointmentDate}
              </Text>
              <Text color="brand.500" fontSize="sm" fontWeight="600">
                at {appointmentTime}
              </Text>
            </Box>
          </Box>

          {/* Dietary Preferences */}
          <Box mb={8}>
            <Heading size="md" color="gray.800" mb={6}>
              Choose one or more of the options below that apply to you
            </Heading>
            
            <Box
              display="grid"
              gridTemplateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)"
              }}
              gap={3}
              mb={4}
            >
              {dietaryOptions.map((opt) => (
                <ToggleButton
                  key={opt.value}
                  isActive={formData.dietaryRestrictions.includes(opt.value)}
                  onToggle={() => toggleDietary(opt.value)}
                  label={opt.label}
                  icon={opt.icon}
                />
              ))}
            </Box>
            
            {/* Interactive feedback */}
            {formData.dietaryRestrictions.length > 0 && (
              <Box
                bg="accent.green.50"
                border="1px solid"
                borderColor="accent.green.200"
                borderRadius="md"
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                animation="fadeIn 0.3s ease-in"
                maxW="400px"
                mx="auto"
              >
                <Box
                  bg="accent.green.300"
                  color="white"
                  borderRadius="full"
                  width="24px"
                  height="24px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {formData.dietaryRestrictions.length}
                </Box>
                <Text color="accent.green.500" fontSize="sm" fontWeight="500">
                  {formData.dietaryRestrictions.length === 1 ? '1 selected' : `${formData.dietaryRestrictions.length} selected`}
                </Text>
              </Box>
            )}
          </Box>

          {/* Volunteer Assistance */}
          <Box mb={8}>
            <Heading size="md" color="gray.800" mb={6}>
              Would you like a volunteer to help pack your food into your car?
            </Heading>
            
            <Box
              display="grid"
              gridTemplateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)"
              }}
              gap={3}
              mb={4}
            >
              <ToggleButton
                isActive={formData.hasMobilityIssues}
                onToggle={() => setFormData((p) => ({ ...p, hasMobilityIssues: !p.hasMobilityIssues }))}
                label="Yes, I'd like volunteer help"
              />
              <ToggleButton
                isActive={!formData.hasMobilityIssues}
                onToggle={() => setFormData((p) => ({ ...p, hasMobilityIssues: false }))}
                label="No, I'm all set"
              />
            </Box>
            
            {/* Interactive feedback */}
            {formData.hasMobilityIssues && (
              <Box
                bg="brand.50"
                border="1px solid"
                borderColor="brand.200"
                borderRadius="md"
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                animation="fadeIn 0.3s ease-in"
                maxW="400px"
                mx="auto"
              >
                <Box
                  bg="client.primary"
                  color="white"
                  borderRadius="full"
                  width="24px"
                  height="24px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                >
                  ✓
                </Box>
                <Text color="client.primary" fontSize="sm" fontWeight="500">
                  Volunteer help requested
                </Text>
              </Box>
            )}
          </Box>

          {/* Additional Notes */}
          <Box mb={8}>
            <Heading size="md" color="client.primary" mb={6}>
              Additional Information
            </Heading>
            
            <Stack spacing={6}>
              <FormControl>
                <FormLabel mb={3} fontSize="md" fontWeight="600" color="gray.700">
                  Allergies & Food Restrictions
                </FormLabel>
                <Textarea
                  value={`${formData.allergies}${formData.unwantedFoods ? (formData.allergies ? '\n\n' : '') + formData.unwantedFoods : ''}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Split by double newline to separate allergies and unwanted foods
                    const parts = value.split('\n\n');
                    setFormData((p) => ({
                      ...p,
                      allergies: parts[0] || '',
                      unwantedFoods: parts[1] || ''
                    }));
                  }}
                  placeholder="Example: I'm allergic to peanuts, can't have dairy, don't like spicy food..."
                  rows={4}
                  borderRadius="lg"
                  borderColor="gray.300"
                  _focus={{ 
                    borderColor: '#25385D', 
                    boxShadow: '0 0 0 1px #25385D',
                    outline: 'none'
                  }}
                  _hover={{ borderColor: 'gray.400' }}
                  resize="vertical"
                />
              </FormControl>

              <FormControl>
                <FormLabel mb={3} fontSize="md" fontWeight="600" color="gray.700">
                  Other Notes
                </FormLabel>
                <Textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData((p) => ({ ...p, additionalInfo: e.target.value }))}
                  placeholder={t('common.additionalNotesPlaceholder')}
                  rows={4}
                  borderRadius="lg"
                  borderColor="gray.300"
                  _focus={{ 
                    borderColor: '#25385D', 
                    boxShadow: '0 0 0 1px #25385D',
                    outline: 'none'
                  }}
                  _hover={{ borderColor: 'gray.400' }}
                  resize="vertical"
                />
              </FormControl>

              {/* Diaper Size for Tiny Bundles */}
              <FormControl>
                <FormLabel mb={3} fontSize="md" fontWeight="600" color="gray.700">
                  Diaper Size (for Tiny Bundles clients)
                </FormLabel>
                <Textarea
                  placeholder="What size do you need? (like Size 3, Size 4, etc.)"
                  value={formData.diaperSize || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, diaperSize: e.target.value }))}
                  rows={2}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px #3182ce',
                    outline: 'none'
                  }}
                  _hover={{ borderColor: 'gray.400' }}
                  resize="vertical"
                />
              </FormControl>
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Stack
            spacing={{ base: 4, md: 6 }}
            direction={{ base: "column", md: "row" }}
            width="full"
            pt={{ base: 6, md: 8 }}
            justify="center"
            align="center"
            mt={{ base: 4, md: 6 }}
          >
            <AssistanceButton 
              width={{ base: "100%", md: "320px" }}
              height={{ base: "48px", md: "52px" }}
              fontSize={{ base: "md", md: "md" }}
            />
            <PrimaryButton 
              onClick={handleSubmit} 
              width={{ base: "100%", md: "320px" }}
              height={{ base: "48px", md: "52px" }}
              fontSize={{ base: "md", md: "md" }}
            >
              {t('common.continue')}
            </PrimaryButton>
          </Stack>
        </Box>
      </VStack>
    </PageLayout>
  );
};

export default SpecialRequests;
