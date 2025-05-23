
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark';
type ColorScheme = 'default' | 'midnight-tech' | 'cyber-pulse' | 'matrix-code';

interface ThemeContextType {
  theme: ThemeType;
  colorScheme: ColorScheme;
  setTheme: (theme: ThemeType) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colorScheme: 'default',
  setTheme: () => {},
  setColorScheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('dark');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('default');
  
  // On mount, read theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme | null;
    
    // Set theme from saved preference, system preference, or default to dark
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    }
    
    // Set color scheme from saved preference or default
    if (savedColorScheme) {
      setColorSchemeState(savedColorScheme);
      document.documentElement.dataset.colorScheme = savedColorScheme;
    }
  }, []);
  
  const setTheme = (newTheme: ThemeType) => {
    // Remove old theme class
    document.documentElement.classList.remove('light', 'dark');
    // Add new theme class
    document.documentElement.classList.add(newTheme);
    // Save to state and localStorage
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  const setColorScheme = (newScheme: ColorScheme) => {
    // Set color scheme data attribute
    document.documentElement.dataset.colorScheme = newScheme;
    // Save to state and localStorage
    setColorSchemeState(newScheme);
    localStorage.setItem('colorScheme', newScheme);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, setColorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// Export wrapper for app root
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};
