
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { TradingProvider } from '@/contexts/TradingContext';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('@/components/Dashboard'));
const EnhancedFakeTrading = React.lazy(() => import('@/components/trading/EnhancedFakeTrading'));
const AiTradingDashboard = React.lazy(() => import('@/components/trading/AiTradingDashboard'));
const LiveAnalyticsDashboard = React.lazy(() => import('@/components/analytics/LiveAnalyticsDashboard'));
const ProjectStatus = React.lazy(() => import('@/pages/ProjectStatus'));

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <CurrencyProvider>
        <TradingProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto p-4">
                <React.Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/trading" element={<EnhancedFakeTrading />} />
                    <Route path="/ai-bots" element={<AiTradingDashboard />} />
                    <Route path="/analytics" element={<LiveAnalyticsDashboard />} />
                    <Route path="/status" element={<ProjectStatus />} />
                  </Routes>
                </React.Suspense>
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
