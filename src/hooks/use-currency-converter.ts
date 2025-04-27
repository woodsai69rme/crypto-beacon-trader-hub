
import { useCurrency } from './use-currency';

export function useCurrencyConverter() {
  const { baseCurrency, convertCurrency, formatCurrency } = useCurrency();

  /**
   * Format value based on the currency setting
   */
  const formatValue = (value: number, currency?: string): string => {
    return formatCurrency(value, currency || baseCurrency);
  };

  /**
   * Convert value from one currency to another
   */
  const convertValue = (value: number, fromCurrency: string, toCurrency?: string): number => {
    return convertCurrency(value, fromCurrency, toCurrency || baseCurrency);
  };

  return {
    formatValue,
    convertValue,
    baseCurrency
  };
}
