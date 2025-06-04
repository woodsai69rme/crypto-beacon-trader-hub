
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SettingsFormValues, TickerSettings, SidebarSettings } from '@/types/trading';

interface UIContextType {
  tickerSettings: TickerSettings;
  sidebarSettings: SidebarSettings;
  updateTickerSettings: (settings: Partial<TickerSettings>) => void;
  updateSidebarSettings: (settings: Partial<SidebarSettings>) => void;
  updateSettings: (settings: Partial<SettingsFormValues>) => void;
  settings: SettingsFormValues;
}

// Default settings
const defaultTickerSettings: TickerSettings = {
  enabled: true,
  position: 'top',
  speed: 50,
  direction: 'left',
  autoPause: true
};

const defaultSidebarSettings: SidebarSettings = {
  enabled: true,
  position: 'left',
  defaultCollapsed: false,
  showLabels: true,
  collapsed: false
};

const defaultSettings: SettingsFormValues = {
  theme: 'dark',
  currency: 'AUD',
  language: 'en',
  notifications: {
    email: false,
    push: false,
    app: true
  },
  tickerSettings: defaultTickerSettings,
  sidebarSettings: defaultSidebarSettings
};

const UIContext = createContext<UIContextType>({
  tickerSettings: defaultTickerSettings,
  sidebarSettings: defaultSidebarSettings,
  updateTickerSettings: () => {},
  updateSidebarSettings: () => {},
  updateSettings: () => {},
  settings: defaultSettings
});

export const UIContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsFormValues>(defaultSettings);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('ui-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as SettingsFormValues;
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);
  
  // Update ticker settings
  const updateTickerSettings = (newSettings: Partial<TickerSettings>) => {
    setSettings(prevSettings => {
      const updatedTickerSettings = {
        ...prevSettings.tickerSettings,
        ...newSettings
      };
      
      const updatedSettings = {
        ...prevSettings,
        tickerSettings: updatedTickerSettings
      };
      
      // Save to localStorage
      localStorage.setItem('ui-settings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    });
  };
  
  // Update sidebar settings
  const updateSidebarSettings = (newSettings: Partial<SidebarSettings>) => {
    setSettings(prevSettings => {
      const updatedSidebarSettings = {
        ...prevSettings.sidebarSettings,
        ...newSettings
      };
      
      const updatedSettings = {
        ...prevSettings,
        sidebarSettings: updatedSidebarSettings
      };
      
      // Save to localStorage
      localStorage.setItem('ui-settings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    });
  };
  
  // Update all settings
  const updateSettings = (newSettings: Partial<SettingsFormValues>) => {
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings
      };
      
      // Save to localStorage
      localStorage.setItem('ui-settings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    });
  };
  
  const value = {
    tickerSettings: settings.tickerSettings,
    sidebarSettings: settings.sidebarSettings,
    updateTickerSettings,
    updateSidebarSettings,
    updateSettings,
    settings
  };
  
  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);

// Also export as UIProvider for compatibility
export const UIProvider = UIContextProvider;
