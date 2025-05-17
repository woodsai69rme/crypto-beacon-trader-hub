import React, { createContext, useContext, useState } from 'react';
import { Theme, ColorScheme } from '@/types/trading';

// Define explicit types for ticker and sidebar settings
interface TickerSettings {
  enabled: boolean;
  position: 'top' | 'bottom';
  direction: 'ltr' | 'rtl';
  speed: number;
  autoPause: boolean;
  coins?: string[];
  showVolume?: boolean;
  showPercentChange?: boolean;
}

interface SidebarSettings {
  expanded: boolean;
  position: 'left' | 'right';
  visible: boolean;
}

interface UIContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  sidebarSettings: SidebarSettings;
  tickerSettings: TickerSettings;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  updateSidebarSettings: (settings: Partial<SidebarSettings>) => void;
  updateTickerSettings: (settings: Partial<TickerSettings>) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('default');
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>({
    expanded: true,
    position: 'left',
    visible: true,
  });
  const [tickerSettings, setTickerSettings] = useState<TickerSettings>({
    enabled: true,
    position: 'bottom',
    direction: 'ltr',
    speed: 50,
    autoPause: true,
    coins: [],
    showVolume: true,
    showPercentChange: true
  });

  const updateSidebarSettings = (settings: Partial<SidebarSettings>) => {
    setSidebarSettings(prev => ({ ...prev, ...settings }));
  };

  const updateTickerSettings = (settings: Partial<TickerSettings>) => {
    setTickerSettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <UIContext.Provider value={{
      theme,
      colorScheme,
      sidebarSettings,
      tickerSettings,
      setTheme,
      setColorScheme,
      updateSidebarSettings,
      updateTickerSettings,
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};
