
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { TradingProvider } from './contexts/TradingContext';
import AppLayout from './components/layout/AppLayout';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import CustomDashboard from './pages/CustomDashboard';
import "./App.css";
import { Toaster } from "./components/ui/toaster";

function App() {
  // Initialize application settings on load
  useEffect(() => {
    // Set default currency to AUD if not already set
    try {
      const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
      if (!settings.currency) {
        const defaultSettings = {
          ...settings,
          currency: {
            defaultCurrency: 'AUD',
            showPriceInBTC: false
          }
        };
        localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
      } else if (settings.currency.defaultCurrency !== 'AUD') {
        // Ensure AUD is the default currency as per requirements
        settings.currency.defaultCurrency = 'AUD';
        localStorage.setItem('appSettings', JSON.stringify(settings));
      }
    } catch (error) {
      console.error('Error setting default currency:', error);
      // Set minimal default settings if error
      localStorage.setItem('appSettings', JSON.stringify({
        currency: {
          defaultCurrency: 'AUD',
          showPriceInBTC: false
        }
      }));
    }
  }, []);
  
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <TradingProvider>
          <Router>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="settings" element={<Settings />} />
                <Route path="custom-dashboard" element={<CustomDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
        </TradingProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
