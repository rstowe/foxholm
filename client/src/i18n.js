import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './translations/en';
import esTranslations from './translations/es';
import frTranslations from './translations/fr';

// Custom storage for i18next
const languageDetector = new LanguageDetector(null, {
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  caches: ['localStorage', 'sessionStorage'],
  order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
  checkWhitelist: true
});

const languageOptions = {
  en: { translation: enTranslations, name: 'English' },
  es: { translation: esTranslations, name: 'Español' },
  fr: { translation: frTranslations, name: 'Français' }
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: Object.keys(languageOptions),
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
    },
    resources: languageOptions,
  });

// Save language preference to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('i18nextLng', lng);
  } catch (e) {
    console.warn('Could not save language preference to localStorage', e);
  }
});

export const languages = Object.entries(languageOptions).map(([code, config]) => ({
  code,
  name: config.name
}));

export default i18n;
