
export interface SettingsFormValues {
  email?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  darkMode: boolean;
  language: string;
  timeZone: string;
  layout: string;
  theme: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    trading?: boolean;
    marketAlerts?: boolean;
    newFeatures?: boolean;
  };
  privacy?: {
    publicProfile?: boolean;
    showPortfolio?: boolean;
    shareActivity?: boolean;
  };
  appearance?: {
    compactMode?: boolean;
    animationsEnabled?: boolean;
    showTradingHistory?: boolean;
    showPortfolioChart?: boolean;
    highContrastMode?: boolean;
  };
  account?: {
    twoFactorEnabled?: boolean;
    loginAlerts?: boolean;
  };
  trading?: {
    confirmTradeExecutions?: boolean;
    showPriceAlerts?: boolean;
    defaultTradingPair?: string;
  };
  dashboardCustomization?: {
    defaultCurrency: string;
    defaultTimeframe: string;
    alertVolume: number;
    alertFrequency: string;
  };
  dataPrivacy?: {
    shareAnalytics: boolean;
    storeHistory: boolean;
  };
  exportFormat?: string;
}

export interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface SettingsFooterProps {
  isSaving?: boolean;
  onReset?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export type AlertFrequencyOption = 'high' | 'medium' | 'low' | 'none';
