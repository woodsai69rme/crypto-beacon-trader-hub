
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedCurrency } from '@/types/trading';

interface CurrencyContextType {
  defaultCurrency: SupportedCurrency;
  setDefaultCurrency: (currency: SupportedCurrency) => void;
  formatCurrency: (amount: number, currency?: SupportedCurrency) => string;
  convertCurrency: (amount: number, from: SupportedCurrency, to: SupportedCurrency) => number;
  currencySymbol: (currency?: SupportedCurrency) => string;
  showBTC: boolean;
  setShowBTC: (show: boolean) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  defaultCurrency: 'AUD',
  setDefaultCurrency: () => {},
  formatCurrency: () => '',
  convertCurrency: () => 0,
  currencySymbol: () => '',
  showBTC: false,
  setShowBTC: () => {}
});

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [defaultCurrency, setDefaultCurrency] = useState<SupportedCurrency>('AUD');
  const [showBTC, setShowBTC] = useState<boolean>(false);
  
  // Load settings from localStorage
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
      if (settings.currency?.defaultCurrency) {
        setDefaultCurrency(settings.currency.defaultCurrency);
      }
      if (settings.currency?.showPriceInBTC !== undefined) {
        setShowBTC(settings.currency.showPriceInBTC);
      }
    } catch (error) {
      console.error('Error loading currency settings:', error);
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
      settings.currency = {
        ...settings.currency,
        defaultCurrency,
        showPriceInBTC: showBTC
      };
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving currency settings:', error);
    }
  }, [defaultCurrency, showBTC]);
  
  // Get currency symbol
  const currencySymbol = (currency?: SupportedCurrency): string => {
    const curr = currency || defaultCurrency;
    
    switch (curr) {
      case 'AUD':
        return 'A$';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return 'A$';
    }
  };
  
  // Format currency value
  const formatCurrency = (amount: number, currency?: SupportedCurrency): string => {
    const curr = currency || defaultCurrency;
    const symbol = currencySymbol(curr);
    
    // Format based on value size
    if (Math.abs(amount) >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(2)}M`;
    } else if (Math.abs(amount) >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(2)}K`;
    } else if (Math.abs(amount) >= 1) {
      return `${symbol}${amount.toFixed(2)}`;
    } else {
      // For small values, use more precision
      return `${symbol}${amount.toFixed(6)}`;
    }
  };
  
  // Simple currency conversion
  const convertCurrency = (
    amount: number, 
    from: SupportedCurrency, 
    to: SupportedCurrency
  ): number => {
    if (from === to) return amount;
    
    // Example conversion rates (simplified)
    const rates: Record<SupportedCurrency, Record<SupportedCurrency, number>> = {
      'USD': { 'AUD': 1.52, 'EUR': 0.92, 'GBP': 0.79, 'USD': 1 },
      'AUD': { 'USD': 0.66, 'EUR': 0.61, 'GBP': 0.52, 'AUD': 1 },
      'EUR': { 'USD': 1.09, 'AUD': 1.64, 'GBP': 0.86, 'EUR': 1 },
      'GBP': { 'USD': 1.27, 'AUD': 1.92, 'EUR': 1.17, 'GBP': 1 },
    };
    
    return amount * rates[from][to];
  };
  
  return (
    <CurrencyContext.Provider
      value={{
        defaultCurrency,
        setDefaultCurrency,
        formatCurrency,
        convertCurrency,
        currencySymbol,
        showBTC,
        setShowBTC
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(CurrencyContext);
