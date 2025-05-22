
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'red'
  | 'default'
  | 'midnight-tech'
  | 'cyber-pulse'
  | 'matrix-code'
  | 'neon-future'
  | 'sunset-gradient';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  storageKey = 'crypto-platform-theme',
}) => {
  // Initialize theme from localStorage or default to system
  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(`${storageKey}-mode`);
    return (storedTheme as Theme) || 'dark';
  });

  // Initialize color scheme from localStorage or default
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const storedScheme = localStorage.getItem(`${storageKey}-color`);
    return (storedScheme as ColorScheme) || 'default';
  });

  // Update localStorage and document classes when theme changes
  useEffect(() => {
    localStorage.setItem(`${storageKey}-mode`, theme);
    
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, storageKey]);
  
  // Update localStorage and document classes when color scheme changes
  useEffect(() => {
    localStorage.setItem(`${storageKey}-color`, colorScheme);
    
    const root = window.document.documentElement;
    
    // Remove all color scheme classes
    root.classList.remove('blue-theme', 'green-theme', 'orange-theme', 'purple-theme', 'red-theme', 
      'midnight-tech-theme', 'cyber-pulse-theme', 'matrix-code-theme', 'neon-future-theme', 'sunset-gradient-theme');
    
    // Add the selected color scheme class
    if (colorScheme !== 'default') {
      root.classList.add(`${colorScheme}-theme`);
    }
  }, [colorScheme, storageKey]);
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const setColorScheme = (newScheme: ColorScheme) => {
    setColorSchemeState(newScheme);
  };
  
  const toggleTheme = () => {
    setThemeState(prevTheme => 
      prevTheme === 'dark' ? 'light' : 'dark'
    );
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
