
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { TradingProvider } from "@/contexts/TradingContext";
import Layout from "@/components/Layout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardTrading from "@/components/dashboard/DashboardTrading";
import DashboardAnalytics from "@/components/dashboard/DashboardAnalytics";
import DashboardSettings from "@/components/dashboard/DashboardSettings";
import DashboardAdvanced from "@/components/dashboard/DashboardAdvanced";
import DashboardCollaboration from "@/components/dashboard/DashboardCollaboration";
import CustomizableDashboard from "@/components/dashboard/CustomizableDashboard";

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <TradingProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardOverview />} />
                  <Route path="/dashboard" element={<CustomizableDashboard />} />
                  <Route path="/trading" element={<DashboardTrading />} />
                  <Route path="/analytics" element={<DashboardAnalytics />} />
                  <Route path="/advanced" element={<DashboardAdvanced />} />
                  <Route path="/collaboration" element={<DashboardCollaboration />} />
                  <Route path="/settings" element={<DashboardSettings />} />
                </Routes>
              </Layout>
              <Toaster />
            </div>
          </Router>
        </TradingProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
