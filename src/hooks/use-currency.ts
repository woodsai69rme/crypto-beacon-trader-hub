
import { useEffect, useState } from 'react';

interface CurrencyHookResult {
  currency: string;
  symbol: string;
  formatValue: (value: number) => string;
  convertValue: (value: number, fromCurrency: string, toCurrency: string) => number;
}

export function useCurrency(): CurrencyHookResult {
  const [currency, setCurrency] = useState('AUD');
  const [symbol, setSymbol] = useState('A$');
  
  // Load settings from localStorage
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
      if (settings.currency?.defaultCurrency) {
        setCurrency(settings.currency.defaultCurrency);
        
        // Set symbol based on currency
        switch (settings.currency.defaultCurrency) {
          case 'AUD':
            setSymbol('A$');
            break;
          case 'USD':
            setSymbol('$');
            break;
          case 'EUR':
            setSymbol('€');
            break;
          case 'GBP':
            setSymbol('£');
            break;
          default:
            setSymbol('A$'); // Default to AUD
        }
      }
    } catch (error) {
      console.error('Error loading currency settings:', error);
    }
  }, []);
  
  // Format value according to currency
  const formatValue = (value: number): string => {
    if (isNaN(value)) return `${symbol}0.00`;
    
    // Format based on the value size
    if (Math.abs(value) >= 1000000) {
      return `${symbol}${(value / 1000000).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${symbol}${(value / 1000).toFixed(2)}K`;
    } else if (Math.abs(value) >= 1) {
      return `${symbol}${value.toFixed(2)}`;
    } else {
      // For small values, use more precision
      return `${symbol}${value.toFixed(6)}`;
    }
  };
  
  // Simple currency conversion (in a real app, this would use real exchange rates)
  const convertValue = (value: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return value;
    
    // Example conversion rates (simplified)
    const rates: Record<string, Record<string, number>> = {
      'USD': { 'AUD': 1.52, 'EUR': 0.92, 'GBP': 0.79 },
      'AUD': { 'USD': 0.66, 'EUR': 0.61, 'GBP': 0.52 },
      'EUR': { 'USD': 1.09, 'AUD': 1.64, 'GBP': 0.86 },
      'GBP': { 'USD': 1.27, 'AUD': 1.92, 'EUR': 1.17 },
    };
    
    if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
      return value * rates[fromCurrency][toCurrency];
    }
    
    return value; // Default to no conversion if rate not found
  };
  
  return {
    currency,
    symbol,
    formatValue,
    convertValue
  };
}

export default useCurrency;
