
import React, { useState, useEffect } from 'react';
import './App.css';
import { useTheme } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import ThemeSwitcher from './components/settings/ThemeSwitcher';

function App() {
  const { theme, colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show UI after component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`app themed-app ${theme} ${colorScheme}`}>
      <header className="themed-container border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="font-bold text-xl">Crypto Trading Platform</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      
      <main className="flex-grow themed-container">
        <div className="container py-4">
          <Dashboard />
        </div>
      </main>
      
      <footer className="themed-container border-t border-border">
        <div className="container py-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>© 2025 Crypto Trading Platform</div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
