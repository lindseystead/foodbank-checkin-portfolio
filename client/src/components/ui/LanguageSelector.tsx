/**
 * @fileoverview Language selector component for Foodbank Check-In and Appointment System client application
 * 
 * This component provides language selection functionality with support
 * for English, Spanish, and French. It handles language switching
 * and persistence for the multilingual food bank system.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../common/i18n.ts} Internationalization configuration
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
  size?: 'sm' | 'md' | 'lg';
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
  size = 'md'
}) => {
  const { t } = useTranslation();
  
  const menuWidth = useBreakpointValue({ base: "100%", sm: "300px" });
  const flagSize = useBreakpointValue({ base: "20px", md: "24px" });
  
  const buttonHeight = size === 'sm' ? { base: "40px", md: "40px" } : { base: "48px", md: "48px" };
  const buttonFontSize = size === 'sm' ? { base: "sm", md: "sm" } : { base: "md", md: "md" };
  const buttonWidth = size === 'sm' ? { base: "140px", sm: "160px", md: "200px" } : { base: "160px", sm: "180px", md: "240px" };
  const buttonMaxWidth = size === 'sm' ? { base: "160px", md: "200px" } : { base: "180px", md: "240px" };
  const buttonMinWidth = size === 'sm' ? { base: "140px", sm: "160px", md: "200px" } : { base: "160px", sm: "180px", md: "240px" };

  const selectedLanguage = currentLanguage && languages.find(lang => lang.code === currentLanguage);

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
        maxW={{ base: "100%", md: "300px" }}
        spacing={{ base: 2, md: 6 }}
        justify="center"
        flexDir={{ base: "row", md: "row" }}
        wrap="wrap"
      >
        <Box width={buttonWidth} maxW={buttonMinWidth}>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              height={buttonHeight}
              borderRadius="lg"
              fontSize={buttonFontSize}
              fontWeight="500"
              borderColor="gray.300"
              color="gray.700"
              bg="white"
              _hover={{
                bg: 'gray.50',
                borderColor: 'gray.400',
                transform: 'translateY(-1px)',
                boxShadow: 'sm'
              }}
              _focus={{
                boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.3)',
                outline: 'none'
              }}
              _active={{
                bg: 'gray.100',
                transform: 'translateY(0)',
                boxShadow: 'sm'
              }}
              rightIcon={<FiChevronDown />}
              leftIcon={
                selectedLanguage ? (
                  <ReactCountryFlag
                    countryCode={selectedLanguage.countryCode}
                    svg
                    style={{
                      width: "20px",
                      height: "15px"
                    }}
                  />
                ) : (
                  <Box as={FiGlobe} color="gray.600" boxSize={5} />
                )
              }
              textAlign="center"
              isTruncated
              aria-label={t('language.selectAriaLabel')}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              maxW={buttonMaxWidth}
              minW={buttonMinWidth}
              px={4}
            >
              <Text color="gray.700" isTruncated flex={1} minW={0} textAlign="center" fontSize={buttonFontSize}>
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
              {/* Reset option */}
              <MenuItem
                onClick={() => onLanguageSelect('')}
                height={{ base: "56px", md: "64px" }}
                _hover={{
                  bg: 'blue.50',
                  color: 'blue.600'
                }}
                _focus={{
                  bg: 'blue.50',
                  color: 'blue.600'
                }}
                _active={{
                  bg: 'blue.100',
                  color: 'blue.700'
                }}
                px={4}
                borderBottom="1px"
                borderColor="gray.100"
                mb={2}
              >
                <HStack spacing={3} overflow="hidden" width="100%" flex={1} minW={0}>
                  <Box flexShrink={0}>
                    <Box as={FiGlobe} color="gray.600" boxSize={flagSize} />
                  </Box>
                  <Text isTruncated flex={1} minW={0} fontSize={{ base: "md", md: "md" }}>
                    {t('language.placeholder')}
                  </Text>
                </HStack>
              </MenuItem>
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  onClick={() => onLanguageSelect(lang.code)}
                  height={{ base: "56px", md: "64px" }}
                  _hover={{
                    bg: 'blue.50',
                    color: 'blue.600'
                  }}
                  _focus={{
                    bg: 'blue.50',
                    color: 'blue.600'
                  }}
                  _active={{
                    bg: 'blue.100',
                    color: 'blue.700'
                  }}
                  px={4}
                >
                  <HStack spacing={3} overflow="hidden" width="100%" flex={1} minW={0}>
                    <Box flexShrink={0}>
                      <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{
                          width: flagSize,
                          height: flagSize === "24px" ? "18px" : "15px"
                        }}
                      />
                    </Box>
                    <Text isTruncated flex={1} minW={0} fontSize={{ base: "md", md: "md" }}>
                      {lang.name}
                    </Text>
                  </HStack>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>

        <Box width={buttonWidth} maxW={buttonMinWidth}>
          <AssistanceButton
            width="100%"
            maxW={buttonMaxWidth}
            minW={buttonMinWidth}
            height={buttonHeight}
            size={size === 'sm' ? 'sm' : 'md'}
            fontSize={buttonFontSize}
            px={4}
          />
        </Box>
      </HStack>
    </VStack>
  );
};

export default LanguageSelector; 