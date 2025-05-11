
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'default' | 'midnight-tech' | 'cyber-pulse' | 'matrix-code';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleTheme: () => void;
  isDark: boolean;
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
    // Initialize from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      return savedTheme;
    }
    
    return 'system'; // Default to system
  });

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    // Initialize from localStorage or default
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
    return (savedColorScheme && ['default', 'midnight-tech', 'cyber-pulse', 'matrix-code'].includes(savedColorScheme))
      ? savedColorScheme 
      : 'default';
  });

  // Determine if we're in dark mode based on theme and system preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    // For 'system', check user preference
    return typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches 
      : true;
  });

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', theme);
    
    // Update isDark state
    if (theme === 'dark') {
      setIsDark(true);
    } else if (theme === 'light') {
      setIsDark(false);
    } else if (theme === 'system') {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    
    // Update document attributes
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      root.classList.add(isDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [theme, isDark]);

  useEffect(() => {
    // Update localStorage when color scheme changes
    localStorage.setItem('colorScheme', colorScheme);
    
    // Update document attributes
    const root = window.document.documentElement;
    root.classList.remove('default', 'midnight-tech', 'cyber-pulse', 'matrix-code');
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
    setThemeState(prevTheme => {
      if (prevTheme === 'system') {
        return isDark ? 'light' : 'dark';
      }
      return prevTheme === 'dark' ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      colorScheme, 
      setColorScheme, 
      toggleTheme, 
      isDark 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
