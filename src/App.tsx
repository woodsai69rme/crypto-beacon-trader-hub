
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { TradingProvider } from '@/contexts/TradingContext';
import { AiTradingProvider } from '@/contexts/AiTradingContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import Dashboard from '@/components/Dashboard';
import DashboardTrading from '@/components/dashboard/DashboardTrading';
import ComprehensiveAiTradingDashboard from '@/components/trading/ComprehensiveAiTradingDashboard';
import ComprehensiveSettings from '@/components/settings/ComprehensiveSettings';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="crypto-beacon-theme">
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
                      <Route path="/automation/*" element={
                        <div className="text-center p-8 space-y-4">
                          <h1 className="text-3xl font-bold">Automation Center</h1>
                          <p className="text-muted-foreground">N8N workflows and automation features</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                            <div className="p-6 bg-muted rounded-lg">
                              <h3 className="font-semibold mb-2">Trading Signals</h3>
                              <p className="text-sm text-muted-foreground">
                                Automatically distribute AI signals to Discord, Telegram, and email
                              </p>
                            </div>
                            <div className="p-6 bg-muted rounded-lg">
                              <h3 className="font-semibold mb-2">Portfolio Rebalancing</h3>
                              <p className="text-sm text-muted-foreground">
                                Automated portfolio optimization based on AI recommendations
                              </p>
                            </div>
                            <div className="p-6 bg-muted rounded-lg">
                              <h3 className="font-semibold mb-2">Risk Monitoring</h3>
                              <p className="text-sm text-muted-foreground">
                                Real-time alerts when portfolio risk exceeds thresholds
                              </p>
                            </div>
                          </div>
                        </div>
                      } />
                      <Route path="/settings" element={<ComprehensiveSettings />} />
                      <Route path="/portfolio" element={
                        <div className="text-center p-8 space-y-4">
                          <h1 className="text-3xl font-bold">Portfolio Management</h1>
                          <p className="text-muted-foreground">Portfolio tracking and analytics</p>
                          <div className="mt-8 p-6 bg-muted rounded-lg">
                            <p className="text-sm">
                              Comprehensive portfolio tracking features coming soon. 
                              Use the Dashboard to view current portfolio status.
                            </p>
                          </div>
                        </div>
                      } />
                      <Route path="/market" element={
                        <div className="text-center p-8 space-y-4">
                          <h1 className="text-3xl font-bold">Market Data</h1>
                          <p className="text-muted-foreground">Real-time market data and analysis</p>
                          <div className="mt-8 p-6 bg-muted rounded-lg">
                            <p className="text-sm">
                              Advanced market data and analysis tools. 
                              Check the Trading section for current market information.
                            </p>
                          </div>
                        </div>
                      } />
                      <Route path="/social" element={
                        <div className="text-center p-8 space-y-4">
                          <h1 className="text-3xl font-bold">Social Trading</h1>
                          <p className="text-muted-foreground">Copy trading and social features</p>
                          <div className="mt-8 p-6 bg-muted rounded-lg">
                            <p className="text-sm">
                              Social trading features for sharing strategies and copying successful traders.
                              Coming in future updates.
                            </p>
                          </div>
                        </div>
                      } />
                      <Route path="/education" element={
                        <div className="text-center p-8 space-y-4">
                          <h1 className="text-3xl font-bold">Education Center</h1>
                          <p className="text-muted-foreground">Trading tutorials and resources</p>
                          <div className="mt-8 p-6 bg-muted rounded-lg">
                            <p className="text-sm">
                              Comprehensive trading education including strategy guides, 
                              market analysis tutorials, and AI trading best practices.
                            </p>
                          </div>
                        </div>
                      } />
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
