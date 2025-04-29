
import { useState } from "react";
import "./App.css";
import "./styles/reset.css"; // Import the reset styles
import { ThemeProvider } from "./contexts/ThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { AiTradingProvider } from "./contexts/AiTradingContext";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AiTradingProvider>
          <div className="themed-app min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto p-6 flex-1">
              <h1 className="text-3xl font-bold mb-8">Crypto Trading Platform</h1>
              <Dashboard />
            </div>
            <Toaster />
          </div>
        </AiTradingProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
