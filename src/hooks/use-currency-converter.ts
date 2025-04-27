
import { useCurrency } from './use-currency';

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

  const formatValue = (value: number, currency?: string): string => {
    return formatCurrency(value, currency || activeCurrency || baseCurrency);
  };

  const convertValue = (value: number, fromCurrency: string, toCurrency?: string): number => {
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
