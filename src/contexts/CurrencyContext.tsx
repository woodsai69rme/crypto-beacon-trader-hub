
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchExchangeRates, CurrencyRates } from "@/services/currencyApi";

type CurrencyContextType = {
  activeCurrency: string;
  setActiveCurrency: React.Dispatch<React.SetStateAction<string>>;
  convert: (value: number, from?: string, to?: string) => number;
  formatValue: (value: number, currency?: string) => string;
  rates: CurrencyRates;
  isLoading: boolean;
};

const DEFAULT_CURRENCY = "AUD"; // Set AUD as the default currency

const CurrencyContext = createContext<CurrencyContextType>({
  activeCurrency: DEFAULT_CURRENCY,
  setActiveCurrency: () => {},
  convert: (value) => value,
  formatValue: (value) => `A$${value}`,
  rates: {
    USD_AUD: 1.48,
    AUD_USD: 0.676,
    USD_EUR: 0.92,
    EUR_USD: 1.087,
    USD_GBP: 0.8,
    GBP_USD: 1.25,
    lastUpdated: new Date().toISOString()
  },
  isLoading: true
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCurrency, setActiveCurrency] = useState<string>(() => {
    // Try to get from localStorage, default to AUD
    return localStorage.getItem("activeCurrency") || DEFAULT_CURRENCY;
  });
  const [rates, setRates] = useState<CurrencyRates>({
    USD_AUD: 1.48,
    AUD_USD: 0.676,
    USD_EUR: 0.92,
    EUR_USD: 1.087,
    USD_GBP: 0.8,
    GBP_USD: 1.25,
    lastUpdated: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Save active currency to localStorage
  useEffect(() => {
    localStorage.setItem("activeCurrency", activeCurrency);
  }, [activeCurrency]);
  
  // Fetch exchange rates
  useEffect(() => {
    const getRates = async () => {
      try {
        setIsLoading(true);
        const latestRates = await fetchExchangeRates();
        setRates(latestRates);
      } catch (error) {
        console.error("Error fetching currency rates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getRates();
    
    // Update rates every 30 minutes
    const interval = setInterval(getRates, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Convert between currencies
  const convert = (value: number, from: string = "USD", to: string = activeCurrency): number => {
    if (from === to) return value;
    
    if (from === "USD" && to === "AUD") {
      return value * rates.USD_AUD;
    } else if (from === "AUD" && to === "USD") {
      return value * rates.AUD_USD;
    } else if (from === "USD" && to === "EUR") {
      return value * rates.USD_EUR;
    } else if (from === "EUR" && to === "USD") {
      return value * rates.EUR_USD;
    } else if (from === "USD" && to === "GBP") {
      return value * rates.USD_GBP;
    } else if (from === "GBP" && to === "USD") {
      return value * rates.GBP_USD;
    } else if (from === "AUD" && to === "EUR") {
      // Convert AUD to USD first, then USD to EUR
      return value * rates.AUD_USD * rates.USD_EUR;
    } else if (from === "EUR" && to === "AUD") {
      // Convert EUR to USD first, then USD to AUD
      return value * rates.EUR_USD * rates.USD_AUD;
    } else if (from === "AUD" && to === "GBP") {
      // Convert AUD to USD first, then USD to GBP
      return value * rates.AUD_USD * rates.USD_GBP;
    } else if (from === "GBP" && to === "AUD") {
      // Convert GBP to USD first, then USD to AUD
      return value * rates.GBP_USD * rates.USD_AUD;
    } else {
      console.warn(`Conversion from ${from} to ${to} not directly supported.`);
      return value;
    }
  };
  
  // Format value with currency symbol
  const formatValue = (value: number, currency: string = activeCurrency): string => {
    if (isNaN(value)) return "Invalid amount";
    
    // Use Intl.NumberFormat for locale-aware formatting
    const formatter = new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(value);
  };
  
  return (
    <CurrencyContext.Provider 
      value={{ 
        activeCurrency, 
        setActiveCurrency, 
        convert, 
        formatValue,
        rates,
        isLoading
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

export default CurrencyContext;
