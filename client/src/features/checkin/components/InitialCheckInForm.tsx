/**
 * @fileoverview Form fields + actions for initial check-in.
 */

import React from 'react';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  VStack,
} from '@chakra-ui/react';
import AssistanceButton from '../../../shared/components/buttons/AssistanceButton';
import PrimaryButton from '../../../shared/components/buttons/PrimaryButton';

interface InitialCheckInFormProps {
  phone: string;
  lastName: string;
  errors: {
    phone: string;
    lastName: string;
  };
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string, options?: any) => string;
}

const InitialCheckInForm: React.FC<InitialCheckInFormProps> = ({
  phone,
  lastName,
  errors,
  isSubmitting,
  onSubmit,
  onInputChange,
  t,
}) => {
  return (
    <Box as="form" onSubmit={onSubmit} w="full">
      <VStack spacing={{ base: 4, md: 3 }} align="stretch" w="full">
        <FormControl isRequired isInvalid={!!errors.phone}>
          <FormLabel mb={2} fontSize="md" fontWeight="medium">
            {t('checkIn.phoneLabel')}
          </FormLabel>
          <Input
            type="tel"
            name="phone"
            value={phone}
            onChange={onInputChange}
            placeholder="(555) 555-5555"
            size="md"
            bg="white"
            _hover={{ borderColor: 'gray.300' }}
            _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
            borderRadius="lg"
            px={4}
            maxLength={14}
            aria-describedby="phone-error"
          />
          <FormErrorMessage id="phone-error" fontSize="sm" mt={1}>
            {errors.phone}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.lastName}>
          <FormLabel mb={2} fontSize="md" fontWeight="medium">
            {t('checkIn.lastNameLabel')}
          </FormLabel>
          <Input
            type="text"
            name="lastName"
            value={lastName}
            onChange={onInputChange}
            placeholder={t('checkIn.namePlaceholder', 'Last name')}
            size="md"
            bg="white"
            _hover={{ borderColor: 'gray.300' }}
            _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
            borderRadius="lg"
            px={4}
            aria-describedby="lastName-error"
          />
          <FormErrorMessage id="lastName-error" fontSize="sm" mt={1}>
            {errors.lastName}
          </FormErrorMessage>
        </FormControl>

        {/* Buttons Row */}
        <Stack
          spacing={{ base: 4, md: 4 }}
          direction={{ base: 'column', md: 'row' }}
          width="full"
          pt={4}
          justify="center"
          align="center"
          mt={4}
        >
          <AssistanceButton />
          <PrimaryButton
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!phone || !lastName}
          >
            {isSubmitting ? 'Checking In...' : t('common.continue')}
          </PrimaryButton>
        </Stack>
      </VStack>
    </Box>
  );
};

export default InitialCheckInForm;
