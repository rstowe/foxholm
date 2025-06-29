import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './translations/en';
import esTranslations from './translations/es';
import frTranslations from './translations/fr';

const languageOptions = {
  en: { translation: enTranslations, name: 'English' },
  es: { translation: esTranslations, name: 'Español' },
  fr: { translation: frTranslations, name: 'Français' }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: Object.keys(languageOptions),
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['navigator', 'htmlTag'],
      caches: ['cookie'],
    },
    resources: languageOptions,
  });

export const languages = Object.entries(languageOptions).map(([code, config]) => ({
  code,
  name: config.name
}));

export default i18n;
