
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme types for the context
export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'blue' | 'green' | 'orange' | 'purple' | 'red';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

// Create context with proper default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  colorScheme: 'blue',
  setColorScheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('blue');

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme);
    }

    const storedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
    if (storedColorScheme && ['blue', 'green', 'orange', 'purple', 'red'].includes(storedColorScheme)) {
      setColorScheme(storedColorScheme);
    }
  }, []);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);

    // Apply theme to document
    if (theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Update localStorage when color scheme changes
  useEffect(() => {
    localStorage.setItem('colorScheme', colorScheme);
    
    // Apply color scheme to document
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
  }, [colorScheme]);

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    colorScheme,
    setColorScheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export the useTheme hook directly from here
export const useTheme = () => useContext(ThemeContext);
