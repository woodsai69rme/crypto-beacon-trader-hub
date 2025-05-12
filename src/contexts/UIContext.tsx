
import React, { createContext, useState, useContext } from 'react';
import { SidebarSettings } from '@/types/trading';

interface ThemeSettings {
  mode: 'dark' | 'light';
  accent: 'blue' | 'green' | 'purple' | 'amber' | 'rose';
}

interface UIContextType {
  sidebarSettings: SidebarSettings;
  updateSidebarSettings: (settings: Partial<SidebarSettings>) => void;
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>({
    defaultCollapsed: false,
    position: 'left',
    showLabels: true,
    width: 240
  });
  
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    mode: 'dark',
    accent: 'blue'
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const updateSidebarSettings = (settings: Partial<SidebarSettings>) => {
    setSidebarSettings(prev => ({ ...prev, ...settings }));
  };
  
  const updateThemeSettings = (settings: Partial<ThemeSettings>) => {
    setThemeSettings(prev => ({ ...prev, ...settings }));
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  return (
    <UIContext.Provider value={{
      sidebarSettings,
      updateSidebarSettings,
      themeSettings,
      updateThemeSettings,
      isSidebarOpen,
      toggleSidebar
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export default UIContext;
