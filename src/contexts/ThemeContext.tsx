
import React, { createContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 
  'default' | 'midnight-tech' | 'cyber-pulse' | 'matrix-code' | 'neon-future' | 'sunset-gradient';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  resolvedTheme: 'light' | 'dark'; // Actual theme based on system preference if set to 'system'
}

// Export the ThemeContext directly
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('blue');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Check for system preference on mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    if (savedColorScheme) {
      setColorScheme(savedColorScheme);
    }
    
    // Initialize resolved theme based on system preference
    updateResolvedTheme(savedTheme || 'system');
    
    // Set up event listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateResolvedTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update resolved theme when theme changes
  useEffect(() => {
    updateResolvedTheme(theme);
  }, [theme]);

  // Function to update resolved theme based on theme setting
  const updateResolvedTheme = (currentTheme: Theme) => {
    if (currentTheme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDarkMode ? 'dark' : 'light');
    } else {
      setResolvedTheme(currentTheme as 'light' | 'dark');
    }
  };

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
    
    // Apply theme to document
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Apply color scheme
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
  }, [theme, colorScheme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, setColorScheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
