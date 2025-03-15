'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported locales
export type Locale = 'en-US' | 'en-GB' | 'fr-FR' | 'de-DE' | 'es-ES';

// Define currency formats for each locale
const currencyFormats: Record<Locale, { currency: string; locale: string }> = {
  'en-US': { currency: 'USD', locale: 'en-US' },
  'en-GB': { currency: 'GBP', locale: 'en-GB' },
  'fr-FR': { currency: 'EUR', locale: 'fr-FR' },
  'de-DE': { currency: 'EUR', locale: 'de-DE' },
  'es-ES': { currency: 'EUR', locale: 'es-ES' },
};

// Define the locale context type
interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  currencyCode: string;
}

// Create the locale context with default values
const LocaleContext = createContext<LocaleContextType>({
  locale: 'en-US',
  setLocale: () => {},
  formatCurrency: () => '',
  formatDate: () => '',
  currencyCode: 'USD',
});

// Custom hook to use the locale context
export const useLocale = () => useContext(LocaleContext);

// Locale provider component
export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  // Initialize locale state from localStorage if available
  const [locale, setLocaleState] = useState<Locale>('en-US');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load locale from localStorage on component mount
  useEffect(() => {
    const storedLocale = localStorage.getItem('locale') as Locale;
    if (storedLocale && Object.keys(currencyFormats).includes(storedLocale)) {
      setLocaleState(storedLocale);
    } else {
      // Try to detect browser locale
      const browserLocale = navigator.language;
      const matchedLocale = Object.keys(currencyFormats).find(
        (l) => l.substring(0, 2) === browserLocale.substring(0, 2)
      ) as Locale;
      
      if (matchedLocale) {
        setLocaleState(matchedLocale);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save locale to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('locale', locale);
    }
  }, [locale, isInitialized]);

  // Set locale function
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  // Format currency based on current locale
  const formatCurrency = (amount: number) => {
    const { currency, locale: localeString } = currencyFormats[locale];
    return new Intl.NumberFormat(localeString, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Format date based on current locale
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Get current currency code
  const currencyCode = currencyFormats[locale].currency;

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        formatCurrency,
        formatDate,
        currencyCode,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};