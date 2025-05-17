
import { UseFormReturn } from "react-hook-form";

// Instead of importing, we reference the type directly
// to avoid conflicts with isolatedModules
export interface SettingsFormValues {
  theme: string;
  colorScheme?: string;
  displayName?: string;
  username?: string;
  contactEmail?: string;
  userLanguage?: string;
  currency: string;
  display: {
    showPortfolio: boolean;
    defaultTab: string;
    compactMode: boolean;
    colorScheme?: string;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
    marketUpdates?: boolean;
    newsletterAndPromotions?: boolean;
  };
  api: {
    provider: string;
    key: string;
    refreshInterval?: number;
    timeout?: number;
  };
  privacy: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
    publicProfile?: boolean;
  };
  appearance: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  trading?: {
    defaultOrder?: "market" | "limit";
    confirmTradeExecutions?: boolean;
    showPriceAlerts?: boolean;
    autoSyncExchanges?: boolean;
    tradingViewCharts?: boolean;
    defaultTradingPair?: string;
  };
  dataPrivacy?: {
    storeHistory?: boolean;
    anonymizeData?: boolean;
    enableTracking?: boolean;
    shareAnalytics?: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: "top" | "bottom";
    direction: "ltr" | "rtl";
    speed: number;
    autoPause: boolean;
    coins?: string[];
  };
  language?: string;
  email?: string;
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

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD';

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}

export interface SettingsTabProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
