
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrencyRates } from "@/services/enhancedCryptoApi";

interface CurrencyContextType {
  activeCurrency: string;
  setActiveCurrency: React.Dispatch<React.SetStateAction<string>>;
  convert: (value: number, from?: string, to?: string) => number;
  formatValue: (value: number, currency?: string) => string;
  rates: Record<string, Record<string, number>> | { [key: string]: number };
  conversionRates: Record<string, number>;
}

const CurrencyContext = createContext<CurrencyContextType>({
  activeCurrency: "USD",
  setActiveCurrency: () => {},
  convert: () => 0,
  formatValue: () => "",
  rates: {},
  conversionRates: {},
});

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [activeCurrency, setActiveCurrency] = useState("USD");
  const [rates, setRates] = useState<Record<string, Record<string, number>>>({});
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({
    USD: 1,
    EUR: 0.93,
    GBP: 0.82,
    AUD: 1.52,
    CAD: 1.35,
    JPY: 113.5,
  });

  // Fetch rates on component mount and when activeCurrency changes
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const cryptos = ["BTC", "ETH", "SOL", "ADA", "DOGE"];
        const currencies = ["USD", "EUR", "GBP", "AUD", "CAD", "JPY"];
        
        const ratesData = await fetchCurrencyRates(cryptos, currencies);
        setRates(ratesData);
      } catch (error) {
        console.error("Error fetching currency rates:", error);
      }
    };

    fetchRates();
  }, []);

  // Convert a value from one currency to another
  const convert = (value: number, from: string = "USD", to: string = activeCurrency): number => {
    if (from === to) return value;

    // If direct conversion is available
    if (conversionRates[from] && conversionRates[to]) {
      // Convert from source to USD first (as base), then to target
      const valueInUSD = value / conversionRates[from];
      return valueInUSD * conversionRates[to];
    }

    // Fallback for crypto conversions or when direct rates aren't available
    if (rates[from] && rates[from][to]) {
      return value * rates[from][to];
    } else if (rates[from] && rates[from]["USD"] && rates["USD"] && rates["USD"][to]) {
      // Use USD as intermediate if direct conversion not available
      const valueInUSD = value * rates[from]["USD"];
      return valueInUSD * rates["USD"][to];
    }

    // If all else fails, just return the original value
    console.warn(`No conversion rate found for ${from} to ${to}`);
    return value;
  };

  // Format a value according to the active currency or specified currency
  const formatValue = (value: number, currency: string = activeCurrency): string => {
    if (isNaN(value)) return "N/A";
    
    let formatter: Intl.NumberFormat;
    
    switch (currency) {
      case "USD":
        formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        break;
      case "EUR":
        formatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
        break;
      case "GBP":
        formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
        break;
      case "AUD":
        formatter = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });
        break;
      case "CAD":
        formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
        break;
      case "JPY":
        formatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
        break;
      default:
        formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    }
    
    return formatter.format(value);
  };

  return (
    <CurrencyContext.Provider value={{ 
      activeCurrency, 
      setActiveCurrency, 
      convert, 
      formatValue, 
      rates,
      conversionRates
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
