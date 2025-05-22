
import React, { createContext, useState, useContext } from 'react';
import { SupportedCurrency, CurrencyContextType } from '@/types/trading';

const defaultCurrency: SupportedCurrency = 'AUD';

const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  setCurrency: () => {},
  formatCurrency: () => '',
  activeCurrency: defaultCurrency,
  setActiveCurrency: () => {},
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<SupportedCurrency>(defaultCurrency);
  const [activeCurrency, setActiveCurrency] = useState<SupportedCurrency>(defaultCurrency);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatCurrency,
      activeCurrency,
      setActiveCurrency,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

export default CurrencyContext;
