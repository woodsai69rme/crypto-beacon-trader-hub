
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorScheme = 'default' | 'midnight-tech' | 'cyber-pulse' | 'matrix-code';
export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  colorScheme: 'default',
  setTheme: () => {},
  setColorScheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('default');
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme | null;
    
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
    }
    
    if (savedColorScheme) {
      setColorSchemeState(savedColorScheme);
    }
  }, []);
  
  // Apply theme to document when it changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
    
    // Apply color scheme
    root.setAttribute('data-color-scheme', colorScheme);
    
    // Save preferences
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
  }, [theme, colorScheme]);
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme);
  };
  
  const toggleTheme = () => {
    setThemeState(prevTheme => {
      if (prevTheme === 'dark') return 'light';
      if (prevTheme === 'light') return 'dark';
      // If system, check current preference and toggle to opposite
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'light' : 'dark';
    });
  };
  
  return (
    <ThemeContext.Provider value={{
      theme,
      colorScheme,
      setTheme,
      setColorScheme,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
