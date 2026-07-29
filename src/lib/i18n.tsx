import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../translations/en.json';
import de from '../translations/de.json';
import fr from '../translations/fr.json';
import es from '../translations/es.json';
import it from '../translations/it.json';
import fi from '../translations/fi.json';
import sv from '../translations/sv.json';
import nl from '../translations/nl.json';
import da from '../translations/da.json';

export type Language = 'en' | 'de' | 'fr' | 'es' | 'it' | 'fi' | 'sv' | 'nl' | 'da';

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'da', label: 'Dansk', flag: '🇩🇰' },
];

const translations: Record<Language, any> = {
  en, de, fr, es, it, fi, sv, nl, da
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vointy-language');
      if (saved && (translations as any)[saved]) {
        return saved as Language;
      }
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vointy-language', lang);
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string, fallback?: string): any => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined) {
      if (fallback !== undefined) return fallback;
      return keys[keys.length - 1];
    }

    return value;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
