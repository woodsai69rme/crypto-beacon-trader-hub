
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyConversion } from '@/types/trading';

interface CurrencyContextType {
  baseCurrency: string;
  setBaseCurrency: (currency: string) => void;
  conversionRates: CurrencyConversion;
  formatCurrency: (amount: number, currency?: string) => string;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => number;
}

const defaultConversionRates: CurrencyConversion = {
  USD_AUD: 1.48,
  AUD_USD: 0.675,
  USD_EUR: 0.92,
  EUR_USD: 1.09,
  USD_GBP: 0.79,
  GBP_USD: 1.27,
  lastUpdated: new Date().toISOString(),
};

const CurrencyContext = createContext<CurrencyContextType>({
  baseCurrency: 'USD',
  setBaseCurrency: () => {},
  conversionRates: defaultConversionRates,
  formatCurrency: () => '',
  convertCurrency: () => 0,
});

export const useCurrencyContext = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [conversionRates, setConversionRates] = useState<CurrencyConversion>(defaultConversionRates);
  
  // In a real app, you would fetch these rates from an API
  useEffect(() => {
    // Simulate fetching rates
    const fetchRates = async () => {
      try {
        // In a real app, fetch from API
        // const response = await fetch('https://api.example.com/rates');
        // const data = await response.json();
        // setConversionRates(data);
        
        // For demo, just use static rates
        setConversionRates(defaultConversionRates);
      } catch (error) {
        console.error('Failed to fetch currency rates:', error);
      }
    };
    
    fetchRates();
    
    // Set up a timer to refresh rates regularly
    const interval = setInterval(fetchRates, 60 * 60 * 1000); // Every hour
    
    return () => clearInterval(interval);
  }, []);
  
  // Format a number as a currency string
  const formatCurrency = (amount: number, currency?: string): string => {
    const currencyToUse = currency || baseCurrency;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyToUse,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // Convert an amount from one currency to another
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to USD as the intermediate step if needed
    let inUSD = amount;
    
    if (fromCurrency !== 'USD') {
      const rateKey = `${fromCurrency}_USD` as keyof CurrencyConversion;
      const rate = conversionRates[rateKey] || 1;
      inUSD = amount * rate;
    }
    
    // Convert from USD to target currency
    if (toCurrency !== 'USD') {
      const rateKey = `USD_${toCurrency}` as keyof CurrencyConversion;
      const rate = conversionRates[rateKey] || 1;
      return inUSD * rate;
    }
    
    return inUSD;
  };
  
  return (
    <CurrencyContext.Provider value={{
      baseCurrency,
      setBaseCurrency,
      conversionRates,
      formatCurrency,
      convertCurrency,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
