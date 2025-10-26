import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptTranslations from './src/translations/pt/common.json';
import enTranslations from './src/translations/en/common.json'; 
import esTranslations from './src/translations/es/common.json';

const resources = {
  pt: { translation: ptTranslations },
  en: { translation: enTranslations },
  es: { translation: esTranslations }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt', 
    interpolation: {
      escapeValue: false 
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;