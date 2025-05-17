
import { UseFormReturn } from 'react-hook-form';
import { SupportedCurrency, Theme, ColorScheme } from "@/types/trading";

// Settings component props interface
export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}

// Import settings form types from trading.d.ts
export interface SettingsFormValues {
  theme: Theme;
  displayName?: string;
  username?: string;
  contactEmail?: string;
  userLanguage?: string;
  display?: {
    showPortfolio: boolean;
    showBalances?: boolean;
    defaultTab?: string;
    compactMode: boolean;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
    colorScheme?: string;
  };
  currency?: {
    defaultCurrency: SupportedCurrency;
    showConversion: boolean;
    showPriceInBTC?: boolean;
  };
  notifications?: {
    enablePush: boolean;
    enableEmail: boolean;
    alertPrice: boolean;
    alertNews: boolean;
    email?: boolean;
    push?: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
    priceAlerts?: boolean;
  };
  api?: {
    provider: string;
    key: string;
    refreshInterval?: number;
    timeout?: number;
  };
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
    publicProfile?: boolean;
  };
  appearance?: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: 'top' | 'bottom';
    speed: number;
    direction: 'ltr' | 'rtl';
    coins: string[];
    showVolume: boolean;
    showPercentChange: boolean;
    autoPause: boolean;
  };
  tradingPreferences?: {
    autoConfirm: boolean;
    showAdvanced?: boolean;
    defaultAsset?: string;
    defaultTradeSize?: number;
    riskLevel?: 'low' | 'medium' | 'high';
    tradingStrategy?: string;
    defaultLeverage?: number;
    showPnL?: boolean;
    defaultTimeframe?: string;
  };
  exportFormat?: "CSV" | "JSON" | "PDF";
  layout?: string;
  sidebar?: {
    expanded: boolean;
    position: "left" | "right";
    visible: boolean;
  };
  bio?: string;
}

// User UI settings
export interface UISettings {
  theme: Theme;
  colorScheme: ColorScheme;
  compactMode: boolean;
  animationsEnabled: boolean;
  highContrastMode: boolean;
  sidebarExpanded: boolean;
  sidebarPosition: 'left' | 'right';
  defaultTab: string;
  showBalances: boolean;
}

// Ticker settings
export interface TickerSettings {
  enabled: boolean;
  position: 'top' | 'bottom';
  speed: number;
  direction: 'ltr' | 'rtl';
  coins: string[];
  showVolume: boolean;
  showPercentChange: boolean;
  autoPause: boolean;
}
