
import { useState, useEffect } from "react";
import { Theme, ColorScheme } from "@/types/trading";

export const useTheme = () => {
  // Initialize from localStorage or defaults
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return (savedTheme as Theme) || 'light';
    } catch {
      return 'light';
    }
  });
  
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    try {
      const savedColorScheme = localStorage.getItem('colorScheme');
      return (savedColorScheme as ColorScheme) || 'default';
    } catch {
      return 'default';
    }
  });

  // Update localStorage and document classes when theme changes
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [theme]);

  // Update localStorage and CSS variables when color scheme changes
  useEffect(() => {
    try {
      localStorage.setItem('colorScheme', colorScheme);
      document.documentElement.setAttribute('data-color-scheme', colorScheme);
    } catch (error) {
      console.error('Error setting color scheme:', error);
    }
  }, [colorScheme]);

  // Handle system preference changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    handleChange(); // Initial check
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Wrapped setters to ensure type safety
  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const setColorScheme = (newColorScheme: ColorScheme) => setColorSchemeState(newColorScheme);

  return { theme, setTheme, colorScheme, setColorScheme };
};
