
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { TradingProvider } from '@/contexts/TradingContext';
import { AiTradingProvider } from '@/contexts/AiTradingContext';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('@/components/Dashboard'));
const EnhancedFakeTrading = React.lazy(() => import('@/components/trading/EnhancedFakeTrading'));
const ComprehensiveAiTradingDashboard = React.lazy(() => import('@/components/trading/ComprehensiveAiTradingDashboard'));
const LiveAnalyticsDashboard = React.lazy(() => import('@/components/analytics/LiveAnalyticsDashboard'));
const NewsAndSentimentDashboard = React.lazy(() => import('@/components/news/NewsAndSentimentDashboard'));
const Web3WalletDashboard = React.lazy(() => import('@/components/web3/Web3WalletDashboard'));
const SocialTradingDashboard = React.lazy(() => import('@/components/social/SocialTradingDashboard'));
const ProjectStatus = React.lazy(() => import('@/pages/ProjectStatus'));
const AuthPage = React.lazy(() => import('@/components/auth/AuthPage'));
const LandingPage = React.lazy(() => import('@/components/marketing/LandingPage'));
const SubscriptionPlans = React.lazy(() => import('@/components/subscription/SubscriptionPlans'));
const PlatformTestDashboard = React.lazy(() => import('@/components/testing/PlatformTestDashboard'));

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CurrencyProvider>
          <TradingProvider>
            <AiTradingProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="container mx-auto p-4">
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        {/* Main platform routes */}
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/trading" element={<EnhancedFakeTrading />} />
                        <Route path="/ai-bots" element={<ComprehensiveAiTradingDashboard />} />
                        <Route path="/analytics" element={<LiveAnalyticsDashboard />} />
                        <Route path="/news" element={<NewsAndSentimentDashboard />} />
                        <Route path="/web3" element={<Web3WalletDashboard />} />
                        <Route path="/social" element={<SocialTradingDashboard />} />
                        
                        {/* Utility routes */}
                        <Route path="/subscription" element={<SubscriptionPlans />} />
                        <Route path="/status" element={<ProjectStatus />} />
                        <Route path="/testing" element={<PlatformTestDashboard />} />
                        
                        {/* Auth and landing pages */}
                        <Route path="/landing" element={<LandingPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        
                        {/* Redirect unknown routes to dashboard */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </React.Suspense>
                  </main>
                  <Toaster />
                </div>
              </Router>
            </AiTradingProvider>
          </TradingProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
