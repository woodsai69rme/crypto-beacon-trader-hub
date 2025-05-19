
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import TradingDashboard from '@/components/TradingDashboard';
import AiTradingBots from '@/pages/AiTradingBots';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import AiChatAssistant from '@/components/AiChatAssistant';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trading" element={<TradingDashboard />} />
          <Route path="/ai-trading" element={<AiTradingBots />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <AiChatAssistant />
        <Toaster />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
