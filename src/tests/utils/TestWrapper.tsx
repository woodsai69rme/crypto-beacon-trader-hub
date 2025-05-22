
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface WrapperProps {
  children: React.ReactElement;
  storageKey?: string;
}

// Create a new QueryClient instance for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity,
    },
  },
});

export const TestWrapper: React.FC<WrapperProps> = ({ 
  children,
  storageKey = 'test-theme-key',
}) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider storageKey={storageKey}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
