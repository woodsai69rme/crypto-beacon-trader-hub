
import { useState } from "react";
import "./App.css";
import "./styles/reset.css"; // Import the reset styles
import "./styles/themes.css"; // Import the theme styles
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { AiTradingProvider } from "./contexts/AiTradingContext";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

// Create a themed container component that applies theme classes
const ThemedContainer = ({ children }: { children: React.ReactNode }) => {
  const { theme, colorScheme } = useTheme();
  
  return (
    <div className={`themed-app min-h-screen flex flex-col bg-background ${theme} ${colorScheme}`}>
      {children}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AiTradingProvider>
          <ThemedContainer>
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 py-6 flex-1 max-w-7xl">
              <h1 className="text-3xl font-bold mb-6 text-foreground bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Crypto Trading Platform</h1>
              <Dashboard />
            </div>
            <footer className="py-6 border-t border-border">
              <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0 text-muted-foreground">
                  CryptoTrader Platform © {new Date().getFullYear()}
                </div>
                <div className="flex gap-6">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Support</a>
                </div>
              </div>
            </footer>
            <Toaster />
          </ThemedContainer>
        </AiTradingProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
