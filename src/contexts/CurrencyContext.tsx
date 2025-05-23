
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedCurrency } from '@/types/trading';

interface CurrencyContextType {
  currency: SupportedCurrency;
  activeCurrency: SupportedCurrency;  // Added for components that need it
  setCurrency: (currency: SupportedCurrency) => void;
  setActiveCurrency: (currency: SupportedCurrency) => void;  // Added setter
  formatCurrency: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency) => number;
  exchangeRates: Record<SupportedCurrency, number>;
}

const defaultExchangeRates: Record<SupportedCurrency, number> = {
  'USD': 1.0,
  'EUR': 0.93,
  'GBP': 0.80,
  'AUD': 1.53,
  'CAD': 1.37,
  'JPY': 151.67,
  'CNY': 7.24
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'AUD', // Changed default to AUD as per project requirements
  activeCurrency: 'AUD',
  setCurrency: () => {},
  setActiveCurrency: () => {},
  formatCurrency: () => '',
  convertAmount: () => 0,
  exchangeRates: defaultExchangeRates
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<SupportedCurrency>('AUD');
  const [activeCurrency, setActiveCurrencyState] = useState<SupportedCurrency>('AUD');
  const [exchangeRates, setExchangeRates] = useState<Record<SupportedCurrency, number>>(defaultExchangeRates);
  
  // Load saved currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency');
    if (savedCurrency) {
      const typedCurrency = savedCurrency as SupportedCurrency;
      setCurrencyState(typedCurrency);
      setActiveCurrencyState(typedCurrency);
    }
  }, []);
  
  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferred-currency', currency);
  }, [currency]);
  
  // Format amount based on current currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: amount < 1 ? 6 : 2,
    }).format(amount);
  };
  
  // Convert amount from one currency to another
  const convertAmount = (
    amount: number, 
    fromCurrency: SupportedCurrency, 
    toCurrency: SupportedCurrency
  ): number => {
    // Convert to USD first (base currency)
    const amountInUsd = amount / exchangeRates[fromCurrency];
    // Then convert from USD to target currency
    return amountInUsd * exchangeRates[toCurrency];
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
