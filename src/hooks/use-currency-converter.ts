import { useEffect, useState } from "react";
import { fetchCurrencyRates } from "@/services/currencyApi";
import type { CurrencyConversion } from "@/types/trading";
import { formatCurrency } from "@/utils/formatters";

export function useCurrencyConverter(initialCurrency: 'USD' | 'AUD' = 'USD') {
  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'AUD'>(initialCurrency);
  const [conversionRates, setConversionRates] = useState<CurrencyConversion>({
    USD_AUD: 1.45, // Default fallback rate
    AUD_USD: 0.69, // Default fallback rate
    lastUpdated: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load currency preference from localStorage if available
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'AUD')) {
      setActiveCurrency(savedCurrency);
    }
    
    // Fetch latest conversion rates
    loadConversionRates();
  }, []);
  
  // Save currency preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('preferredCurrency', activeCurrency);
  }, [activeCurrency]);

  const loadConversionRates = async () => {
    setIsLoading(true);
    try {
      const rates = await fetchCurrencyRates();
      setConversionRates(rates);
    } catch (error) {
      console.error("Failed to load conversion rates:", error);
      // Keep using default rates
    } finally {
      setIsLoading(false);
    }
  };

  const convert = (value: number, fromCurrency: 'USD' | 'AUD', toCurrency: 'USD' | 'AUD'): number => {
    if (fromCurrency === toCurrency) return value;
    
    if (fromCurrency === 'USD' && toCurrency === 'AUD') {
      return value * conversionRates.USD_AUD;
    } else {
      return value * conversionRates.AUD_USD;
    }
  };
  
  const formatValue = (value: number): string => {
    return formatCurrency(value, activeCurrency);
  };
  
  const convertAndFormat = (value: number, fromCurrency: 'USD' | 'AUD'): string => {
    const convertedValue = convert(value, fromCurrency, activeCurrency);
    return formatValue(convertedValue);
  };

  return {
    activeCurrency,
    setActiveCurrency,
    conversionRates,
    isLoading,
    refreshRates: loadConversionRates,
    convert,
    formatValue,
    convertAndFormat
  };
}
