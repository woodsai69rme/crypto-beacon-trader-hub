
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
  colorScheme: 'blue',
  setColorScheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children,
  defaultTheme = 'system',
  defaultColorScheme = 'blue',
  storageKey = 'theme-preference'
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light');
  
  // Function to get system preference
  const getSystemTheme = (): 'dark' | 'light' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  
  // Update the DOM when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old theme class
    root.classList.remove('light', 'dark');
    
    // Determine which theme to apply
    let themeToApply: 'light' | 'dark';
    if (theme === 'system') {
      themeToApply = getSystemTheme();
    } else {
      themeToApply = theme;
    }
    
    // Apply the theme class
    root.classList.add(themeToApply);
    setResolvedTheme(themeToApply);
    
    // Apply color scheme
    root.setAttribute('data-color-scheme', colorScheme);
    
    // Store preferences
    localStorage.setItem(storageKey, JSON.stringify({ theme, colorScheme }));
  }, [theme, colorScheme, storageKey]);
  
  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const newTheme = getSystemTheme();
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      setResolvedTheme(newTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  // Load saved preferences
  useEffect(() => {
    const savedPreferences = localStorage.getItem(storageKey);
    if (savedPreferences) {
      try {
        const { theme: savedTheme, colorScheme: savedColorScheme } = JSON.parse(savedPreferences);
        if (savedTheme) setTheme(savedTheme as Theme);
        if (savedColorScheme) setColorScheme(savedColorScheme as ColorScheme);
      } catch (e) {
        console.error("Failed to parse saved theme preferences", e);
      }
    }
  }, [storageKey]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
