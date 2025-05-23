
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedCurrency } from '@/types/trading';

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
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
  currency: 'USD',
  setCurrency: () => {},
  formatCurrency: () => '',
  convertAmount: () => 0,
  exchangeRates: defaultExchangeRates
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<SupportedCurrency, number>>(defaultExchangeRates);
  
  // Load saved currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency');
    if (savedCurrency) {
      setCurrency(savedCurrency as SupportedCurrency);
    }
  }, []);
  
  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferred-currency', currency);
  }, [currency]);
  
  // Format amount based on current currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
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
  
  const value = {
    currency,
    setCurrency,
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
