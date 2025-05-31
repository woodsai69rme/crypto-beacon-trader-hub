
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { TradingProvider } from '@/contexts/TradingContext';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('@/components/Dashboard'));
const EnhancedFakeTrading = React.lazy(() => import('@/components/trading/EnhancedFakeTrading'));
const AiTradingDashboard = React.lazy(() => import('@/components/trading/AiTradingDashboard'));
const LiveAnalyticsDashboard = React.lazy(() => import('@/components/analytics/LiveAnalyticsDashboard'));
const ProjectStatus = React.lazy(() => import('@/pages/ProjectStatus'));
const AuthPage = React.lazy(() => import('@/components/auth/AuthPage'));
const LandingPage = React.lazy(() => import('@/components/marketing/LandingPage'));
const SubscriptionPlans = React.lazy(() => import('@/components/subscription/SubscriptionPlans'));

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Public route wrapper (redirects to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {user && <Navigation />}
      <main className={user ? "container mx-auto p-4" : ""}>
        <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/landing" 
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/auth" 
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trading" 
              element={
                <ProtectedRoute>
                  <EnhancedFakeTrading />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-bots" 
              element={
                <ProtectedRoute>
                  <AiTradingDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <LiveAnalyticsDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subscription" 
              element={
                <ProtectedRoute>
                  <SubscriptionPlans />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/status" 
              element={
                <ProtectedRoute>
                  <ProjectStatus />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to landing for non-authenticated users */}
            <Route 
              path="*" 
              element={
                user ? <Navigate to="/" replace /> : <Navigate to="/landing" replace />
              } 
            />
          </Routes>
        </React.Suspense>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CurrencyProvider>
          <TradingProvider>
            <Router>
              <AppContent />
            </Router>
          </TradingProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
