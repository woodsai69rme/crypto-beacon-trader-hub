
import { useState } from 'react';

interface CurrencyConverterOptions {
  defaultCurrency?: string;
  rates?: Record<string, number>;
}

export const useCurrencyConverter = (options: CurrencyConverterOptions = {}) => {
  const [activeCurrency, setActiveCurrency] = useState(options.defaultCurrency || 'USD');
  
  // Default exchange rates (static for now, would be fetched from API in real app)
  const defaultRates = {
    USD: 1,
    EUR: 0.93,
    GBP: 0.82,
    JPY: 147.32,
    AUD: 1.54,
    CAD: 1.38,
    CHF: 0.91,
    CNY: 7.23,
    BTC: 0.000019,
    ETH: 0.00032
  };
  
  const rates = options.rates || defaultRates;

  // Pre-calculated conversion rates for common pairs
  const conversionRates = {
    USD_AUD: 1.54,
    USD_EUR: 0.93,
    USD_GBP: 0.82,
    USD_JPY: 147.32,
  };

  /**
   * Convert a value from one currency to another
   */
  const convert = (value: number, from: string = 'USD', to: string = activeCurrency): number => {
    if (from === to) return value;
    
    // Convert to USD first (as base currency)
    const valueInUSD = from === 'USD' ? value : value / rates[from];
    
    // Convert from USD to target currency
    return to === 'USD' ? valueInUSD : valueInUSD * rates[to];
  };

  /**
   * Format a value with currency symbol
   */
  const formatValue = (value: number, currency: string = activeCurrency): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      AUD: 'A$',
      CAD: 'C$',
      CHF: 'CHF',
      CNY: '¥',
      BTC: '₿',
      ETH: 'Ξ'
    };
    
    const symbol = symbols[currency] || currency;
    
    // Format number based on currency
    const options: Intl.NumberFormatOptions = {
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2
    };
    
    if (currency === 'BTC' || currency === 'ETH') {
      options.maximumFractionDigits = 8;
      options.minimumFractionDigits = 2;
    }
    
    return `${symbol}${value.toLocaleString(undefined, options)}`;
  };

  return {
    activeCurrency,
    setActiveCurrency,
    convert,
    formatValue,
    rates,
    conversionRates
  };
};

export type SupportedCurrency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "BTC" | "ETH";
