
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CustomDashboard from './pages/CustomDashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import TaxCalculator from './pages/TaxCalculator';
import Layout from './components/Layout';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Analytics from './pages/Analytics';
import { TradingProvider } from './contexts/TradingContext';

function App() {
  return (
    <TradingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="custom-dashboard" element={<CustomDashboard />} />
            <Route path="analytics-dashboard" element={<AnalyticsDashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="tax-calculator" element={<TaxCalculator />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </TradingProvider>
  );
}

export default App;
