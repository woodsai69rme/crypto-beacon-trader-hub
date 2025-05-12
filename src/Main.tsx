
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CustomizableDashboard from './components/dashboard/CustomizableDashboard';
import OpenRouterSettings from './components/settings/OpenRouterSettings';
import TaxCalculator from './components/tools/TaxCalculator';

const Main = () => {
  return (
    <div className="container mx-auto py-6">
      <Routes>
        <Route path="/" element={<CustomizableDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<OpenRouterSettings />} />
        <Route path="/tax-calculator" element={<TaxCalculator />} />
      </Routes>
    </div>
  );
};

export default Main;
