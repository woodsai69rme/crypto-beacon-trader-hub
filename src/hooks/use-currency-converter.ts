
import { useCurrency } from './use-currency';

// Type definition for SupportedCurrency
type SupportedCurrency = 'USD' | 'AUD' | 'EUR' | 'GBP';

export function useCurrencyConverter() {
  const { 
    baseCurrency, 
    convertCurrency, 
    formatCurrency,
    activeCurrency,
    setActiveCurrency,
    conversionRates,
    convertAndFormat 
  } = useCurrency();

  const formatValue = (value: number, currency?: SupportedCurrency): string => {
    return formatCurrency(value, currency || activeCurrency || baseCurrency);
  };

  const convertValue = (value: number, fromCurrency: SupportedCurrency, toCurrency?: SupportedCurrency): number => {
    return convertCurrency(value, fromCurrency, toCurrency || activeCurrency || baseCurrency);
  };

  return {
    formatValue,
    convertValue,
    baseCurrency,
    activeCurrency,
    setActiveCurrency,
    conversionRates,
    convertAndFormat
  };
}
