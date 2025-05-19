
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ColorScheme } from '@/types/trading';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  resolvedTheme: Theme;
}

const defaultThemeContext: ThemeContextType = {
  theme: 'light',
  setTheme: () => {},
  colorScheme: 'default',
  setColorScheme: () => {},
  resolvedTheme: 'light'
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('default');
  const [resolvedTheme, setResolvedTheme] = useState<Theme>('light');

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
    
    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
    
    if (savedColorScheme) {
      setColorSchemeState(savedColorScheme);
    }
    
    // Set resolved theme based on system preference if theme is 'system'
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setResolvedTheme(theme === 'system' ? systemPreference : theme);
    
    // Add listener for changes in system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [theme]);

  // Apply theme and color scheme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme and color scheme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    const activeTheme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    
    root.classList.add(activeTheme);
    
    // Set theme in localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
    
    // Update data-theme attribute
    document.documentElement.setAttribute('data-theme', activeTheme);
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
    
  }, [theme, colorScheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Also update resolved theme if not system
    if (newTheme !== 'system') {
      setResolvedTheme(newTheme);
    } else {
      // If system, set based on system preference
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemPreference);
    }
  };

  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      colorScheme, 
      setColorScheme,
      resolvedTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
