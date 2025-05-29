
import React, { createContext, useContext, useState } from 'react';
import { SupportedCurrency } from '@/types/trading';

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  formatCurrency: (amount: number) => string;
  convertFromUSD: (usdAmount: number) => number;
  convertToUSD: (amount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Mock exchange rates (in a real app, these would come from an API)
const EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  AUD: 1.0,
  USD: 0.67,
  EUR: 0.62,
  GBP: 0.54,
  JPY: 98.5,
  CAD: 0.89
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<SupportedCurrency>('AUD');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const convertFromUSD = (usdAmount: number): number => {
    return usdAmount / EXCHANGE_RATES[currency];
  };

  const convertToUSD = (amount: number): number => {
    return amount * EXCHANGE_RATES[currency];
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatCurrency,
      convertFromUSD,
      convertToUSD
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
