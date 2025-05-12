
import React, { createContext, useContext, useState } from 'react';
import { SidebarSettings } from '@/types/trading';

interface UIContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setDarkMode: (isDark: boolean) => void;
  isDarkMode: boolean;
  sidebarSettings: SidebarSettings;
  updateSidebarSettings: (settings: Partial<SidebarSettings>) => void;
}

const defaultSidebarSettings: SidebarSettings = {
  defaultCollapsed: false,
  showLabels: true,
  position: 'left',
  width: 240,
};

const UIContext = createContext<UIContextType>({
  isSidebarOpen: true,
  toggleSidebar: () => {},
  setSidebarOpen: () => {},
  activeTab: 'dashboard',
  setActiveTab: () => {},
  setDarkMode: () => {},
  isDarkMode: false,
  sidebarSettings: defaultSidebarSettings,
  updateSidebarSettings: () => {},
});

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>(defaultSidebarSettings);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const setSidebarOpen = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  };

  const updateSidebarSettings = (settings: Partial<SidebarSettings>) => {
    setSidebarSettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <UIContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        activeTab,
        setActiveTab,
        isDarkMode,
        setDarkMode,
        sidebarSettings,
        updateSidebarSettings,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
