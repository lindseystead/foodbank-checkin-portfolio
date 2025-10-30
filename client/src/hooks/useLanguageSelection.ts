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
