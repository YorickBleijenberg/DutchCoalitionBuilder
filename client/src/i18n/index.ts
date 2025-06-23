import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import nl from './nl.json';

const resources = {
  en: { translation: en },
  nl: { translation: nl }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('coalition-language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
