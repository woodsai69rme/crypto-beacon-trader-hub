
import React, { createContext, useContext, useState, useEffect } from "react";

type CurrencyContextType = {
  activeCurrency: string;
  setActiveCurrency: React.Dispatch<React.SetStateAction<string>>;
  convert: (value: number, from?: string, to?: string) => number;
  formatValue: (value: number, currency?: string) => string;
  rates: Record<string, number> | {
    USD: number;
    EUR: number;
    GBP: number;
    JPY: number;
    AUD: number;
    CAD: number;
    CHF: number;
    CNY: number;
    BTC: number;
    ETH: number;
  };
};

const DEFAULT_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 151.65,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.91,
  CNY: 7.24,
  BTC: 0.000021,
  ETH: 0.00034
};

const CurrencyContext = createContext<CurrencyContextType>({
  activeCurrency: "USD",
  setActiveCurrency: () => {},
  convert: (value) => value,
  formatValue: (value) => `$${value}`,
  rates: DEFAULT_RATES
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCurrency, setActiveCurrency] = useState<string>(() => {
    // Try to get from localStorage, default to USD
    return localStorage.getItem("activeCurrency") || "USD";
  });
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);
  
  // Save active currency to localStorage
  useEffect(() => {
    localStorage.setItem("activeCurrency", activeCurrency);
  }, [activeCurrency]);
  
  // In a real app, we would fetch rates from an API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // We'll use static rates for demo purposes
        setRates({
          ...DEFAULT_RATES,
          // Add a small random fluctuation to rates
          EUR: DEFAULT_RATES.EUR * (1 + (Math.random() * 0.01 - 0.005)),
          GBP: DEFAULT_RATES.GBP * (1 + (Math.random() * 0.01 - 0.005)),
          JPY: DEFAULT_RATES.JPY * (1 + (Math.random() * 0.01 - 0.005)),
          AUD: DEFAULT_RATES.AUD * (1 + (Math.random() * 0.01 - 0.005)),
          CAD: DEFAULT_RATES.CAD * (1 + (Math.random() * 0.01 - 0.005)),
          BTC: DEFAULT_RATES.BTC * (1 + (Math.random() * 0.05 - 0.025)),
          ETH: DEFAULT_RATES.ETH * (1 + (Math.random() * 0.05 - 0.025)),
        });
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };
    
    fetchRates();
    const interval = setInterval(fetchRates, 60000); // Update rates every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Convert between currencies
  const convert = (value: number, from: string = "USD", to: string = activeCurrency): number => {
    // Value in USD
    const valueInUSD = from === "USD" ? value : value / rates[from];
    
    // Convert from USD to target currency
    return to === "USD" ? valueInUSD : valueInUSD * rates[to];
  };
  
  // Format value with currency symbol
  const formatValue = (value: number, currency: string = activeCurrency): string => {
    // Basic formatting with 2 decimal places
    const formattedValue = value.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    // Currency symbols
    switch (currency) {
      case "USD":
        return `$${formattedValue}`;
      case "EUR":
        return `€${formattedValue}`;
      case "GBP":
        return `£${formattedValue}`;
      case "JPY":
        return `¥${formattedValue}`;
      case "AUD":
        return `A$${formattedValue}`;
      case "CAD":
        return `C$${formattedValue}`;
      case "CHF":
        return `CHF ${formattedValue}`;
      case "CNY":
        return `¥${formattedValue}`;
      case "BTC":
        return `₿${value.toFixed(8)}`;
      case "ETH":
        return `Ξ${value.toFixed(6)}`;
      default:
        return `${formattedValue} ${currency}`;
    }
  };
  
  return (
    <CurrencyContext.Provider 
      value={{ 
        activeCurrency, 
        setActiveCurrency, 
        convert, 
        formatValue,
        rates 
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

export default CurrencyContext;
