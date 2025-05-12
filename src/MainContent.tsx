
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CustomizableDashboard from './components/CustomizableDashboard';
import OpenRouterSettings from './components/settings/OpenRouterSettings';
import TaxCalculator from './components/tools/TaxCalculator';
import NotFound from './pages/NotFound';
import SidebarPanel from './components/sidebar/SidebarPanel';
import Index from './pages/Index';

const MainContent = () => {
  return (
    <div className="flex min-h-screen">
      <SidebarPanel className="hidden md:flex" />
      <div className="container mx-auto py-6 px-4">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/custom-dashboard" element={<CustomizableDashboard />} />
          <Route path="/settings" element={<OpenRouterSettings />} />
          <Route path="/tax-calculator" element={<TaxCalculator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainContent;
