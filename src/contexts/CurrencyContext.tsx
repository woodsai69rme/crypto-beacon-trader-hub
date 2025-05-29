
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedCurrency } from '@/types/trading';

interface CurrencyContextType {
  currency: SupportedCurrency;
  activeCurrency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  setActiveCurrency: (currency: SupportedCurrency) => void;
  formatCurrency: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency) => number;
  exchangeRates: Record<SupportedCurrency, number>;
}

const defaultExchangeRates: Record<SupportedCurrency, number> = {
  'USD': 0.65, // 1 AUD = 0.65 USD
  'EUR': 0.60, // 1 AUD = 0.60 EUR
  'GBP': 0.52, // 1 AUD = 0.52 GBP
  'AUD': 1.0,  // Base currency
  'CAD': 0.89,
  'JPY': 98.67,
  'CNY': 4.71
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'AUD',
  activeCurrency: 'AUD',
  setCurrency: () => {},
  setActiveCurrency: () => {},
  formatCurrency: () => '',
  convertAmount: () => 0,
  exchangeRates: defaultExchangeRates
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always default to AUD - Australian platform
  const [currency, setCurrencyState] = useState<SupportedCurrency>('AUD');
  const [activeCurrency, setActiveCurrencyState] = useState<SupportedCurrency>('AUD');
  const [exchangeRates, setExchangeRates] = useState<Record<SupportedCurrency, number>>(defaultExchangeRates);
  
  useEffect(() => {
    // Check for saved preference but still default to AUD
    const savedCurrency = localStorage.getItem('preferred-currency') as SupportedCurrency;
    if (savedCurrency && ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
      setActiveCurrencyState(savedCurrency);
    } else {
      // Ensure AUD is always the default
      setCurrencyState('AUD');
      setActiveCurrencyState('AUD');
      localStorage.setItem('preferred-currency', 'AUD');
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('preferred-currency', currency);
  }, [currency]);
  
  const formatCurrency = (amount: number): string => {
    const locale = currency === 'AUD' ? 'en-AU' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: amount < 1 ? 6 : 2,
    }).format(amount);
  };
  
  const convertAmount = (
    amount: number, 
    fromCurrency: SupportedCurrency, 
    toCurrency: SupportedCurrency
  ): number => {
    if (fromCurrency === toCurrency) return amount;
    // Convert from source to AUD first, then to target
    const amountInAud = fromCurrency === 'AUD' ? amount : amount / exchangeRates[fromCurrency];
    return toCurrency === 'AUD' ? amountInAud : amountInAud * exchangeRates[toCurrency];
  };

  const setCurrency = (newCurrency: SupportedCurrency) => {
    setCurrencyState(newCurrency);
    setActiveCurrencyState(newCurrency);
  };

  const setActiveCurrency = (newCurrency: SupportedCurrency) => {
    setActiveCurrencyState(newCurrency);
  };
  
  const value = {
    currency,
    activeCurrency,
    setCurrency,
    setActiveCurrency,
    formatCurrency,
    convertAmount,
    exchangeRates
  };
  
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
export default CurrencyContext;
