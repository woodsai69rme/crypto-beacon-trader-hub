
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TradingProvider } from '@/contexts/TradingContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

interface TestWrapperProps {
  children: React.ReactNode;
}

export const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <TradingProvider>
          {children}
        </TradingProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};
