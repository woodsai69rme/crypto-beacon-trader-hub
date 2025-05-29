
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { TradingProvider } from '@/contexts/TradingContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { AiTradingProvider } from '@/contexts/AiTradingContext';
import Navigation from '@/components/Navigation';
import ComprehensiveTradingDashboard from '@/components/trading/ComprehensiveTradingDashboard';
import LiveAnalyticsDashboard from '@/components/analytics/LiveAnalyticsDashboard';
import AiBotTrading from '@/components/trading/AiBotTrading';
import N8NWorkflowManager from '@/components/n8n/N8NWorkflowManager';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <CurrencyProvider>
        <TradingProvider>
          <AiTradingProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Navigation />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<ComprehensiveTradingDashboard />} />
                    <Route path="/analytics" element={<LiveAnalyticsDashboard />} />
                    <Route path="/bots" element={<AiBotTrading />} />
                    <Route path="/automation" element={<N8NWorkflowManager />} />
                  </Routes>
                </main>
                <Toaster />
              </div>
            </Router>
          </AiTradingProvider>
        </TradingProvider>
      </CurrencyProvider>
    </ErrorBoundary>
  );
}

export default App;
