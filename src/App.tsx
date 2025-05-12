
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import TradingOptimizationDashboard from './components/TradingOptimizationDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/trading-optimization" element={<TradingOptimizationDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
