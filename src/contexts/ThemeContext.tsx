
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme types for the context
export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'default' | 'midnight-tech' | 'cyber-pulse' | 'matrix-code' | 'neon-future' | 'sunset-gradient';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  resolvedTheme: 'light' | 'dark';
}

// Create context with proper default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  colorScheme: 'default',
  setColorScheme: () => {},
  resolvedTheme: 'dark'
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('default');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme);
    }

    const storedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
    if (storedColorScheme && ['default', 'midnight-tech', 'cyber-pulse', 'matrix-code', 'neon-future', 'sunset-gradient'].includes(storedColorScheme)) {
      setColorScheme(storedColorScheme);
    }

    // Set initial resolved theme
    updateResolvedTheme(storedTheme || 'system');
  }, []);

  // Function to update the resolved theme based on system preference and theme setting
  const updateResolvedTheme = (themeValue: Theme) => {
    if (themeValue === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(themeValue === 'dark' ? 'dark' : 'light');
    }
  };

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);

    // Update resolved theme
    updateResolvedTheme(theme);

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

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    resolvedTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export the useTheme hook directly from here
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
