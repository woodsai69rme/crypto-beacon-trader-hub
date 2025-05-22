
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import TradingDashboard from '@/components/TradingDashboard';
import AiTradingBots from '@/components/trading/AiTradingBots';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import AiChatAssistant from '@/components/AiChatAssistant';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/trading" element={
          <Layout>
            <TradingDashboard />
          </Layout>
        } />
        <Route path="/ai-trading" element={
          <Layout>
            <AiTradingBots />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <Settings />
          </Layout>
        } />
      </Routes>
      <AiChatAssistant />
      <Toaster />
    </>
  );
}

export default App;
