// Import and re-export Theme and ColorScheme from ThemeContext
import { Theme, ColorScheme } from '@/contexts/ThemeContext';

export type { Theme, ColorScheme };

// Export everything from the trading module
export * from './trading';

// Add any additional type exports here
export type { AlertFrequency } from './alerts';
