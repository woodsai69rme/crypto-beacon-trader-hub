
import { useContext } from 'react';
import { ThemeContext, Theme, ColorScheme } from '@/contexts/ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

export type { Theme, ColorScheme };
