
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

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(theme === 'light' ? 'light' : 'dark');

  // Update localStorage and document classes when theme changes
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
      
      if (theme === 'system') {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(isSystemDark ? 'dark' : 'light');
        if (isSystemDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        setResolvedTheme(theme === 'dark' ? 'dark' : 'light');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
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
      const isDark = mediaQuery.matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
      if (isDark) {
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

  return { theme, setTheme, colorScheme, setColorScheme, resolvedTheme };
};
