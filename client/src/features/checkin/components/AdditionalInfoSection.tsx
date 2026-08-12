/**
 * @fileoverview Additional info fields for special requests.
 */

import React from 'react';
import { Box, FormControl, FormLabel, Heading, Stack, Textarea } from '@chakra-ui/react';

interface AdditionalInfoSectionProps {
  allergies: string;
  unwantedFoods: string;
  additionalInfo: string;
  diaperSize: string;
  onAllergiesChange: (value: string) => void;
  onUnwantedFoodsChange: (value: string) => void;
  onAdditionalInfoChange: (value: string) => void;
  onDiaperSizeChange: (value: string) => void;
  t: (key: string, options?: any) => string;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  allergies,
  unwantedFoods,
  additionalInfo,
  diaperSize,
  onAllergiesChange,
  onUnwantedFoodsChange,
  onAdditionalInfoChange,
  onDiaperSizeChange,
  t,
}) => {
  return (
    <Box mb={8}>
      <Heading size="md" color="client.primary" mb={4}>
        Additional Information
      </Heading>

      <Stack spacing={6}>
        <FormControl>
          <FormLabel mb={2} fontSize="md" fontWeight="medium" color="gray.700">
            Allergies & Food Restrictions
          </FormLabel>
          <Textarea
            value={`${allergies}${unwantedFoods ? (allergies ? '\n\n' : '') + unwantedFoods : ''}`}
            onChange={(e) => {
              const value = e.target.value;
              const parts = value.split('\n\n');
              onAllergiesChange(parts[0] || '');
              onUnwantedFoodsChange(parts[1] || '');
            }}
            placeholder="Example: I'm allergic to peanuts, can't have dairy, don't like spicy food..."
            rows={4}
            borderRadius="lg"
            borderColor="gray.300"
            _focus={{
              borderColor: 'client.primary',
              boxShadow: '0 0 0 1px var(--chakra-colors-client-primary)',
              outline: 'none',
            }}
            _hover={{ borderColor: 'gray.400' }}
            resize="vertical"
          />
        </FormControl>

        <FormControl>
          <FormLabel mb={2} fontSize="md" fontWeight="medium" color="gray.700">
            Other Notes
          </FormLabel>
          <Textarea
            value={additionalInfo}
            onChange={(e) => onAdditionalInfoChange(e.target.value)}
            placeholder={t('common.additionalNotesPlaceholder')}
            rows={4}
            borderRadius="lg"
            borderColor="gray.300"
            _focus={{
              borderColor: 'client.primary',
              boxShadow: '0 0 0 1px var(--chakra-colors-client-primary)',
              outline: 'none',
            }}
            _hover={{ borderColor: 'gray.400' }}
            resize="vertical"
          />
        </FormControl>

        <FormControl>
          <FormLabel mb={2} fontSize="md" fontWeight="medium" color="gray.700">
            Diaper Size (for Tiny Bundles clients)
          </FormLabel>
          <Textarea
            placeholder="What size do you need? (like Size 3, Size 4, etc.)"
            value={diaperSize || ''}
            onChange={(e) => onDiaperSizeChange(e.target.value)}
            rows={2}
            bg="white"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            _focus={{
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
              outline: 'none',
            }}
            _hover={{ borderColor: 'gray.400' }}
            resize="vertical"
          />
        </FormControl>
      </Stack>
    </Box>
  );
};

export default AdditionalInfoSection;
