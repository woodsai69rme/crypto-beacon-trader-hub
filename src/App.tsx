
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { TradingProvider } from '@/contexts/TradingContext';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <CurrencyProvider>
        <TradingProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </main>
              <Toaster />
            </div>
          </Router>
        </TradingProvider>
      </CurrencyProvider>
    </ErrorBoundary>
  );
}

export default App;
