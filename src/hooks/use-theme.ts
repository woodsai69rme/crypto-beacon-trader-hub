
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  // Calculate resolvedTheme based on system preference if theme is set to 'system'
  const resolvedTheme = context.theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : context.theme;
  
  return {
    ...context,
    resolvedTheme
  };
}

export default useTheme;
