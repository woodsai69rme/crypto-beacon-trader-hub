
import React, { createContext, useState, useContext, useEffect } from "react";

interface CurrencyContextType {
  baseCurrency: string;
  setBaseCurrency: (currency: string) => void;
  exchangeRates: Record<string, number>;
  formatCurrency: (value: number, currency?: string) => string;
  convertCurrency: (value: number, from: string, to: string) => number;
  availableCurrencies: string[];
  conversionRates: {
    USD_AUD: number;
    USD_EUR: number;
    USD_GBP: number;
    USD_JPY: number;
  };
}

const defaultExchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.82,
  JPY: 147.32,
  AUD: 1.54,
  CAD: 1.38,
  CNY: 7.23,
  BTC: 0.000019,
  ETH: 0.00032
};

const defaultCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CNY", "BTC", "ETH"];

const CurrencyContext = createContext<CurrencyContextType>({
  baseCurrency: "USD",
  setBaseCurrency: () => {},
  exchangeRates: defaultExchangeRates,
  formatCurrency: () => "",
  convertCurrency: () => 0,
  availableCurrencies: defaultCurrencies,
  conversionRates: {
    USD_AUD: 1.54,
    USD_EUR: 0.93,
    USD_GBP: 0.82,
    USD_JPY: 147.32,
  }
});

export const useCurrency = () => useContext(CurrencyContext);

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState(defaultExchangeRates);
  
  // Define conversion rates for trading components
  const conversionRates = {
    USD_AUD: 1.54,
    USD_EUR: 0.93,
    USD_GBP: 0.82,
    USD_JPY: 147.32,
  };

  // In a real app, we would fetch the latest exchange rates from an API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, use static rates, but in production this would be an API call
        setExchangeRates(defaultExchangeRates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      }
    };
    
    fetchExchangeRates();
  }, []);
  
  const convertCurrency = (value: number, from: string, to: string): number => {
    if (from === to) return value;
    
    // First convert to USD as the base
    const valueInUSD = from === "USD" ? value : value / exchangeRates[from];
    
    // Convert from USD to target currency
    return to === "USD" ? valueInUSD : valueInUSD * exchangeRates[to];
  };
  
  const formatCurrency = (value: number, currency = baseCurrency): string => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      AUD: "A$",
      CAD: "C$",
      CNY: "¥",
      BTC: "₿",
      ETH: "Ξ"
    };
    
    // Format number based on currency
    const options: Intl.NumberFormatOptions = {
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
      minimumFractionDigits: currency === "JPY" ? 0 : 2
    };
    
    if (currency === "BTC" || currency === "ETH") {
      options.maximumFractionDigits = 8;
      options.minimumFractionDigits = 4;
    }
    
    return `${symbols[currency] || currency}${value.toLocaleString(undefined, options)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        baseCurrency,
        setBaseCurrency,
        exchangeRates,
        formatCurrency,
        convertCurrency,
        availableCurrencies: defaultCurrencies,
        conversionRates
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
