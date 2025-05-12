
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import TradingOptimizationDashboard from './components/TradingOptimizationDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/trading-optimization" element={<TradingOptimizationDashboard />} />
    </Routes>
  );
}

export default App;
