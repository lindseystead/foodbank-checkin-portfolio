/**
 * @fileoverview Language selector — uses Button variant="language" for sizing.
 */

import React from 'react';
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiGlobe } from 'react-icons/fi';
import ReactCountryFlag from 'react-country-flag';
import AssistanceButton from '../buttons/AssistanceButton';

interface LanguageSelectorProps {
  onLanguageSelect: (language: string) => void;
  currentLanguage?: string;
  size?: 'sm' | 'md';
}

const languages = [
  { code: 'en', name: 'English', countryCode: 'CA' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
  { code: 'es', name: 'Español', countryCode: 'ES' },
  { code: 'zh', name: '中文', countryCode: 'CN' },
  { code: 'hi', name: 'हिंदी', countryCode: 'IN' },
  { code: 'ar', name: 'العربية', countryCode: 'SA' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', countryCode: 'IN' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageSelect,
  currentLanguage,
  size = 'md',
}) => {
  const { t } = useTranslation();
  const menuWidth = useBreakpointValue({ base: '100%', sm: '300px' });
  const flagSize = useBreakpointValue({ base: '20px', md: '24px' });
  const selectedLanguage = currentLanguage && languages.find((lang) => lang.code === currentLanguage);

  return (
    <VStack
      width="100%"
      maxW="container.md"
      mx="auto"
      px={{ base: 0, md: 6 }}
      align="center"
      spacing={4}
      py={2}
    >
      <HStack
        width="100%"
        maxW={{ base: '100%', md: '520px' }}
        spacing={{ base: 2, md: 4 }}
        justify="center"
        align="stretch"
        flexDir={{ base: 'column', md: 'row' }}
        wrap="wrap"
      >
        <Box flex="1" minW={{ base: '100%', md: '160px' }} maxW={{ base: '100%', md: '240px' }}>
          <Menu>
            <MenuButton
              as={Button}
              variant="language"
              size={size}
              rightIcon={<FiChevronDown />}
              leftIcon={
                selectedLanguage ? (
                  <ReactCountryFlag
                    countryCode={selectedLanguage.countryCode}
                    svg
                    style={{ width: '20px', height: '15px' }}
                  />
                ) : (
                  <Box as={FiGlobe} color="gray.600" boxSize={5} />
                )
              }
              textAlign="center"
              isTruncated
              aria-label={t('language.selectAriaLabel')}
              width="100%"
            >
              <Text color="gray.700" isTruncated flex={1} minW={0} textAlign="center">
                {selectedLanguage ? selectedLanguage.name : t('language.placeholder')}
              </Text>
            </MenuButton>
            <MenuList
              maxH="300px"
              overflowY="auto"
              width={menuWidth}
              borderRadius="lg"
              boxShadow="xl"
              py={2}
              zIndex={1000}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
            >
              <MenuItem
                onClick={() => onLanguageSelect('')}
                minH="48px"
                _hover={{ bg: 'brand.50', color: 'brand.600' }}
                _focus={{ bg: 'brand.50', color: 'brand.600' }}
                px={4}
                borderBottom="1px"
                borderColor="gray.100"
                mb={2}
              >
                <HStack spacing={3} overflow="hidden" width="100%" flex={1} minW={0}>
                  <Box flexShrink={0}>
                    <Box as={FiGlobe} color="gray.600" boxSize={flagSize} />
                  </Box>
                  <Text isTruncated flex={1} minW={0} fontSize="md">
                    {t('language.placeholder')}
                  </Text>
                </HStack>
              </MenuItem>
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  onClick={() => onLanguageSelect(lang.code)}
                  minH="48px"
                  _hover={{ bg: 'brand.50', color: 'brand.600' }}
                  _focus={{ bg: 'brand.50', color: 'brand.600' }}
                  px={4}
                >
                  <HStack spacing={3} overflow="hidden" width="100%" flex={1} minW={0}>
                    <Box flexShrink={0}>
                      <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{
                          width: flagSize,
                          height: flagSize === '24px' ? '18px' : '15px',
                        }}
                      />
                    </Box>
                    <Text isTruncated flex={1} minW={0} fontSize="md">
                      {lang.name}
                    </Text>
                  </HStack>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>

        <Box flex="1" minW={{ base: '100%', md: '160px' }} maxW={{ base: '100%', md: '240px' }}>
          <AssistanceButton width="100%" minW="100%" size={size} />
        </Box>
      </HStack>
    </VStack>
  );
};

export default LanguageSelector;
