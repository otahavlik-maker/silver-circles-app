import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import JSON resources
import translationEN from './locales/en/translation.json';
import translationCS from './locales/cs/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  cs: {
    translation: translationCS
  }
};

i18n
  // Připojení detektoru jazyka (zejm. z URL nebo prohlížeče)
  .use(LanguageDetector) 
  // Předání instance i18n Reactu
  .use(initReactI18next) 
  // Inicializace
  .init({
    resources,
    fallbackLng: 'en', // Pokud jazyk chybí, použij angličtinu
    debug: false,
    
    // Konfigurace pro React - zde se definuje, jak se klíče načítají
    interpolation: {
      escapeValue: false, // Neescapovat HTML v klíčích
    },
    
    // Výchozí jmenný prostor
    ns: ['translation'],
    defaultNS: 'translation',
    
    react: {
      useSuspense: false, // Pro zjednodušení v MVP
    }
  });

export default i18n;