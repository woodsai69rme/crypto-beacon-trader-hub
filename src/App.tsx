
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import TradingOptimizationDashboard from './components/TradingOptimizationDashboard';
import CryptoTradingDashboard from './components/dashboard/CryptoTradingDashboard';
import AIStrategiesPage from './pages/AIStrategiesPage';
import StrategyBuilderPage from './pages/StrategyBuilderPage';
import PortfolioAnalyticsPage from './pages/PortfolioAnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import OnChainAnalyticsPage from './pages/OnChainAnalyticsPage';
import { UIProvider } from './contexts/UIContext';

function App() {
  return (
    <UIProvider>
      <Routes>
        <Route path="/" element={<CryptoTradingDashboard />} />
        <Route path="/trading-optimization" element={<TradingOptimizationDashboard />} />
        <Route path="/ai-strategies" element={<AIStrategiesPage />} />
        <Route path="/builder" element={<StrategyBuilderPage />} />
        <Route path="/analytics" element={<PortfolioAnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/on-chain" element={<OnChainAnalyticsPage />} />
      </Routes>
    </UIProvider>
  );
}

export default App;
