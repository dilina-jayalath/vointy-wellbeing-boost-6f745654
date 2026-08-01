// @refresh reset
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

// Page/area translation modules (deep-merged onto the base bundles above)
const moduleBundles = import.meta.glob('../translations/modules/*/*.json', { eager: true }) as Record<
  string,
  { default: any }
>;

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

const deepMerge = (target: any, source: any): any => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return source ?? target;
  const out = { ...(target && typeof target === 'object' && !Array.isArray(target) ? target : {}) };
  for (const [k, v] of Object.entries(source)) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v) ? deepMerge(out[k], v) : v;
  }
  return out;
};

const translations: Record<Language, any> = {
  en, de, fr, es, it, fi, sv, nl, da
};

for (const [path, mod] of Object.entries(moduleBundles)) {
  const lang = path.split('/').pop()!.replace('.json', '') as Language;
  if (translations[lang]) {
    translations[lang] = deepMerge(translations[lang], (mod as any).default);
  }
}


type TVars = Record<string, string | number>;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallbackOrVars?: string | TVars) => any;
}

const interpolate = (value: any, vars?: TVars): any => {
  if (typeof value !== 'string' || !vars) return value;
  return value.replace(/\{\{?\s*(\w+)\s*\}?\}/g, (m, name) =>
    name in vars ? String(vars[name]) : m
  );
};

const lookup = (lang: Language, key: string): any => {
  const keys = key.split('.');
  let value: any = translations[lang];
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) value = value[k];
    else return undefined;
  }
  return value;
};

// Reuse the same context instance across hot reloads so already-mounted
// consumers keep matching the provider.
const g = globalThis as any;
const I18nContext: React.Context<I18nContextType | undefined> =
  g.__vointyI18nContext ??
  (g.__vointyI18nContext = createContext<I18nContextType | undefined>(undefined));


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

  const t = useCallback((key: string, fallbackOrVars?: string | TVars): any => {
    const vars = typeof fallbackOrVars === 'object' ? fallbackOrVars : undefined;
    const fallback = typeof fallbackOrVars === 'string' ? fallbackOrVars : undefined;

    let value = lookup(language, key);
    if (value === undefined && language !== 'en') value = lookup('en', key);

    if (value === undefined) {
      if (fallback !== undefined) return interpolate(fallback, vars);
      return key.split('.').pop();
    }

    return interpolate(value, vars);
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

const fallbackT = (key: string, fallbackOrVars?: string | TVars): any => {
  const vars = typeof fallbackOrVars === 'object' ? fallbackOrVars : undefined;
  const fallback = typeof fallbackOrVars === 'string' ? fallbackOrVars : undefined;
  const value = lookup('en', key);
  if (value === undefined) {
    return fallback !== undefined ? interpolate(fallback, vars) : key.split('.').pop();
  }
  return interpolate(value, vars);
};


export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    // Can happen transiently during hot reloads; fall back to English instead of crashing.
    return { language: 'en' as Language, setLanguage: () => {}, t: fallbackT };
  }
  return context;
};

