import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dynamic import of all translation files using Vite's import.meta.glob
const translationFiles = import.meta.glob('./locales/**/translation.json', { eager: true });

// Array to store available language codes
const availableLanguageCodes: string[] = [];

// Function to build resources object for i18next
function loadTranslations() {
  const resources: Record<string, { translation: string }> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.entries(translationFiles).forEach(([path, module]: [string, any]) => {
    // Extract language code from path (e.g., './locales/en/translation.json' -> 'en')
    const langCode = path.match(/\.\/locales\/([^/]+)\/translation\.json/)?.[1];

    if (langCode) {
      resources[langCode] = {
        translation: module.default || module
      };
      // Add to available languages
      if (!availableLanguageCodes.includes(langCode)) {
        availableLanguageCodes.push(langCode);
      }
    }
  });

  return resources;
}

// Function to get available languages with their native names
export function getAvailableLanguages(): string[] {
  return availableLanguageCodes;
}

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    resources: loadTranslations()
  });

export default i18n;
export const availableLanguages = getAvailableLanguages();
