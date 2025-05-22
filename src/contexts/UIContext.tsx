
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TickerSettings, SidebarSettings } from '../types/trading';

interface UIContextType {
  tickerSettings: TickerSettings;
  updateTickerSettings: (settings: Partial<TickerSettings>) => void;
  sidebarSettings: SidebarSettings;
  updateSidebarSettings: (settings: Partial<SidebarSettings>) => void;
}

const defaultTickerSettings: TickerSettings = {
  enabled: true,
  position: 'both',
  speed: 40,
  direction: 'left',
  autoPause: true
};

const defaultSidebarSettings: SidebarSettings = {
  enabled: true,
  position: 'left',
  defaultCollapsed: false,
  collapsed: false,
  showLabels: true
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickerSettings, setTickerSettings] = useState<TickerSettings>(defaultTickerSettings);
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>(defaultSidebarSettings);
  
  useEffect(() => {
    // Load settings from localStorage
    const loadedSettings = localStorage.getItem('userSettings');
    if (loadedSettings) {
      try {
        const parsedSettings = JSON.parse(loadedSettings);
        if (parsedSettings.ticker) {
          setTickerSettings({
            ...defaultTickerSettings,
            ...parsedSettings.ticker
          });
        }
        if (parsedSettings.sidebar) {
          setSidebarSettings({
            ...defaultSidebarSettings,
            ...parsedSettings.sidebar
          });
        }
      } catch (e) {
        console.error('Failed to load UI settings from localStorage:', e);
      }
    }
  }, []);

  const updateTickerSettings = (newSettings: Partial<TickerSettings>) => {
    setTickerSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Update in localStorage
      const existingSettings = localStorage.getItem('userSettings');
      if (existingSettings) {
        try {
          const settings = JSON.parse(existingSettings);
          localStorage.setItem('userSettings', JSON.stringify({
            ...settings,
            ticker: updated
          }));
        } catch (e) {
          console.error('Failed to update ticker settings in localStorage:', e);
        }
      } else {
        localStorage.setItem('userSettings', JSON.stringify({
          ticker: updated
        }));
      }
      
      return updated;
    });
  };
  
  const updateSidebarSettings = (newSettings: Partial<SidebarSettings>) => {
    setSidebarSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Update in localStorage
      const existingSettings = localStorage.getItem('userSettings');
      if (existingSettings) {
        try {
          const settings = JSON.parse(existingSettings);
          localStorage.setItem('userSettings', JSON.stringify({
            ...settings,
            sidebar: updated
          }));
        } catch (e) {
          console.error('Failed to update sidebar settings in localStorage:', e);
        }
      } else {
        localStorage.setItem('userSettings', JSON.stringify({
          sidebar: updated
        }));
      }
      
      return updated;
    });
  };
  
  return (
    <UIContext.Provider value={{
      tickerSettings,
      updateTickerSettings,
      sidebarSettings,
      updateSidebarSettings
    }}>
      {children}
    </UIContext.Provider>
  );
};
