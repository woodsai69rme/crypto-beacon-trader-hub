
import { useState } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AUD';

export type CurrencyRates = {
  [key in CurrencyCode]: number;
};

// Default rates relative to USD
const defaultRates: CurrencyRates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.75,
  AUD: 1.43,
};

export function useCurrencyConverter() {
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('USD');
  const [rates, setRates] = useState<CurrencyRates>(defaultRates);

  const convert = (amount: number, from: CurrencyCode = 'USD', to: CurrencyCode = activeCurrency): number => {
    if (from === to) return amount;
    
    const inUSD = amount / rates[from];
    return inUSD * rates[to];
  };

  const formatCurrency = (amount: number, currency: CurrencyCode = activeCurrency): string => {
    const formatter = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency 
    });
    
    return formatter.format(amount);
  };

  const getCurrencySymbol = (currency: CurrencyCode = activeCurrency): string => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'AUD':
        return 'A$';
      default:
        return '$';
    }
  };

  return {
    activeCurrency,
    setActiveCurrency,
    rates,
    setRates,
    convert,
    formatCurrency,
    getCurrencySymbol,
  };
}

export default useCurrencyConverter;
