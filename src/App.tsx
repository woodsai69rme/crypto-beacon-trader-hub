
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Spinner } from '@/components/ui/spinner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AiTradingProvider } from '@/contexts/AiTradingContext';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="trading-platform-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CurrencyProvider>
            <AiTradingProvider>
              <Router>
                <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><Spinner size="lg" /></div>}>
                  <Routes>
                    <Route path="/" element={<div>Loading...</div>} />
                  </Routes>
                </Suspense>
              </Router>
              <Toaster />
            </AiTradingProvider>
          </CurrencyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
