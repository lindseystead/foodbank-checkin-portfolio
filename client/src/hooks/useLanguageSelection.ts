/**
 * @fileoverview Language selection hook for Foodbank Check-In and Appointment System client application
 * 
 * This custom hook manages language selection state and provides methods
 * for changing the application language. It integrates with react-i18next
 * to handle language switching and persistence.
 * 
 * @author Lindsey D. Stead
 * @version 1.0.0
 * @since 2025-10-20
 * @license Proprietary - see LICENSE file for details
 * 
 * @see {@link ../common/i18n.ts} Internationalization configuration
 */

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageSelection = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const changeLanguage = useCallback((languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
  }, [i18n]);

  const handleLanguageSelect = useCallback((languageCode: string) => {
    changeLanguage(languageCode);
  }, [changeLanguage]);

  return {
    selectedLanguage,
    changeLanguage,
    handleLanguageSelect,
  };
};
