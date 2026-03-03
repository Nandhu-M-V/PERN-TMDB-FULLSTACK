import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en/translation.json';
import hi from '../locales/hi/translation.json';
import ja from '../locales/ja/translation.json';
import de from '../locales/de/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ja: { translation: ja },
      de: { translation: de },
    },
  });

export default i18n;
