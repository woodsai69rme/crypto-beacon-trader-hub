
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';
export type ColorScheme = 'default' | 'midnight-tech' | 'cyber-pulse' | 'matrix-code' | 'neon-future' | 'sunset-gradient';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initialize from localStorage or user preference or default to dark
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    // Check user preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return 'dark'; // Default to dark theme
  });

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    // Initialize from localStorage or default
    return (localStorage.getItem('colorScheme') as ColorScheme) || 'default';
  });

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', theme);
    
    // Update document attributes
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // Update localStorage when color scheme changes
    localStorage.setItem('colorScheme', colorScheme);
    
    // Update document attributes
    const root = window.document.documentElement;
    root.classList.remove('default', 'midnight-tech', 'cyber-pulse', 'matrix-code', 'neon-future', 'sunset-gradient');
    root.classList.add(colorScheme);
  }, [colorScheme]);

  // Set the theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Set the color scheme
  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeState(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorScheme, setColorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
