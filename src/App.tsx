
import { useState } from "react";
import "./App.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { AiTradingProvider } from "./contexts/AiTradingContext";
import { Toaster } from "@/components/ui/toaster";
import UserSettings from "./components/UserSettings";
import AiTradingDashboard from "./components/trading/AiTradingDashboard";
import Settings from "./components/settings/Settings";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AiTradingProvider>
          <div className="themed-app min-h-screen">
            <Navbar />
            <div className="container mx-auto p-6">
              <h1 className="text-3xl font-bold mb-8">Crypto Trading Platform</h1>
              <UserSettings />
              <Dashboard />
              <div className="mt-8">
                <Settings />
              </div>
              <div className="mt-8">
                <AiTradingDashboard />
              </div>
            </div>
            <Toaster />
          </div>
        </AiTradingProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
