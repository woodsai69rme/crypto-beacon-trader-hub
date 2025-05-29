
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { TradingProvider } from '@/contexts/TradingContext';
import { AiTradingProvider } from '@/contexts/AiTradingContext';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import Dashboard from '@/components/Dashboard';
import DashboardTrading from '@/components/dashboard/DashboardTrading';
import ComprehensiveAiTradingDashboard from '@/components/trading/ComprehensiveAiTradingDashboard';
import ComprehensiveSettings from '@/components/settings/ComprehensiveSettings';
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CurrencyProvider>
        <TradingProvider>
          <AiTradingProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <EnhancedNavigation />
                <main className="lg:ml-64">
                  <div className="container mx-auto px-4 py-6">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/trading/*" element={<DashboardTrading />} />
                      <Route path="/ai/*" element={<ComprehensiveAiTradingDashboard />} />
                      <Route path="/automation/*" element={<div className="text-center p-8"><h1 className="text-2xl">Automation Center</h1><p>N8N workflows and automation features</p></div>} />
                      <Route path="/settings" element={<ComprehensiveSettings />} />
                      <Route path="/portfolio" element={<div className="text-center p-8"><h1 className="text-2xl">Portfolio Management</h1><p>Portfolio tracking and analytics</p></div>} />
                      <Route path="/market" element={<div className="text-center p-8"><h1 className="text-2xl">Market Data</h1><p>Real-time market data and analysis</p></div>} />
                      <Route path="/social" element={<div className="text-center p-8"><h1 className="text-2xl">Social Trading</h1><p>Copy trading and social features</p></div>} />
                      <Route path="/education" element={<div className="text-center p-8"><h1 className="text-2xl">Education Center</h1><p>Trading tutorials and resources</p></div>} />
                    </Routes>
                  </div>
                </main>
                <Toaster />
              </div>
            </Router>
          </AiTradingProvider>
        </TradingProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
