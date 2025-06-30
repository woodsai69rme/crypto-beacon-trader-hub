
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/navigation/Navigation';
import TradingPage from '@/pages/TradingPage';
import AiBotsPage from '@/pages/AiBotsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import IntegrationSettings from '@/components/settings/IntegrationSettings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/trading" replace />} />
            <Route path="/trading" element={<TradingPage />} />
            <Route path="/ai-bots" element={<AiBotsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={
              <div className="container mx-auto p-6">
                <IntegrationSettings />
              </div>
            } />
            <Route path="*" element={<Navigate to="/trading" replace />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
