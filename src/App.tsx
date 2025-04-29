
import { useState } from "react";
import "./App.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { AiTradingProvider } from "./contexts/AiTradingContext";
import { Toaster } from "@/components/ui/toaster";
import UserSettings from "./components/UserSettings";
import AiTradingDashboard from "./components/trading/AiTradingDashboard";
import Settings from "./components/settings/Settings";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AiTradingProvider>
          <div className="themed-app min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-8">Crypto Trading Platform</h1>
            <UserSettings />
            <div className="mt-8">
              <Settings />
            </div>
            <div className="mt-8">
              <AiTradingDashboard />
            </div>
            <Toaster />
          </div>
        </AiTradingProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
