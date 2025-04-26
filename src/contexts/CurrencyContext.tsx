import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrencyRates } from '@/services/currencyApi';
import { toast } from "@/components/ui/use-toast";

export type SupportedCurrency = 'USD' | 'AUD';

interface CurrencyContextType {
  activeCurrency: SupportedCurrency;
  setActiveCurrency: (currency: SupportedCurrency) => void;
  conversionRates: {
    USD_AUD: number;
    AUD_USD: number;
  };
  isLoading: boolean;
  formatCurrency: (amount: number, currency?: SupportedCurrency) => string;
  convertAmount: (amount: number, from: SupportedCurrency, to: SupportedCurrency) => number;
}

const defaultConversionRates = {
  USD_AUD: 1.45,
  AUD_USD: 0.69
};

const CurrencyContext = createContext<CurrencyContextType>({
  activeCurrency: 'USD',
  setActiveCurrency: () => {},
  conversionRates: defaultConversionRates,
  isLoading: false,
  formatCurrency: () => '',
  convertAmount: () => 0
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCurrency, setActiveCurrency] = useState<SupportedCurrency>(() => {
    // Try to load from localStorage, default to AUD instead of USD
    const saved = localStorage.getItem('preferred-currency');
    return (saved as SupportedCurrency) || 'AUD';
  });
  
  const [conversionRates, setConversionRates] = useState(defaultConversionRates);
  const [isLoading, setIsLoading] = useState(false);

  // Update localStorage when currency changes
  useEffect(() => {
    localStorage.setItem('preferred-currency', activeCurrency);
  }, [activeCurrency]);

  // Fetch conversion rates on mount and every 6 hours
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      try {
        const rates = await fetchCurrencyRates();
        setConversionRates(rates);
      } catch (error) {
        console.error('Failed to fetch currency rates:', error);
        toast({
          title: "Currency Conversion Issue",
          description: "Using default conversion rates due to API error",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
    
    // Refresh rates every 6 hours
    const intervalId = setInterval(fetchRates, 6 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Format currency based on active currency or override
  const formatCurrency = (amount: number, currency?: SupportedCurrency): string => {
    const currencyToUse = currency || activeCurrency;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyToUse,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Convert amount between currencies
  const convertAmount = (
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): number => {
    if (from === to) return amount;
    
    if (from === 'USD' && to === 'AUD') {
      return amount * conversionRates.USD_AUD;
    }
    
    if (from === 'AUD' && to === 'USD') {
      return amount * conversionRates.AUD_USD;
    }
    
    return amount;
  };

  return (
    <CurrencyContext.Provider
      value={{
        activeCurrency,
        setActiveCurrency,
        conversionRates,
        isLoading,
        formatCurrency,
        convertAmount
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
