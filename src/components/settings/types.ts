
import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SupportedCurrency } from '@/types/trading';

export interface SettingsFormValues {
  theme: string;
  colorScheme?: string;
  displayName?: string;
  username?: string;
  contactEmail?: string;
  userLanguage?: string;
  currency: SupportedCurrency;
  display: {
    showPortfolio: boolean;
    defaultTab: string;
    compactMode: boolean;
    colorScheme?: string;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
    showBalances?: boolean; // Add this property
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
    enableEmail?: boolean; // Add these properties
    enablePush?: boolean;
    alertPrice?: boolean;
    alertNews?: boolean;
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
    autoConfirm: boolean;
    showAdvanced?: boolean;
    defaultAsset?: string;
    defaultTradeSize?: number;
    riskLevel?: "high" | "low" | "medium";
    tradingStrategy?: string;
    defaultLeverage?: number;
    showPnL?: boolean;
    defaultTimeframe?: string;
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
    coins?: string[]; // Add this property
    showVolume?: boolean;
    showPercentChange?: boolean;
  };
  exportFormat?: "CSV" | "JSON" | "PDF";
  layout?: string;
  sidebar?: {
    expanded: boolean;
    position: "left" | "right";
    visible: boolean;
  };
  bio?: string;
  tradingPreferences?: { // Add this property
    autoConfirm: boolean;
    showAdvanced: boolean;
    defaultAsset: string;
    defaultTradeSize: number;
    riskLevel: "high" | "low" | "medium";
  };
}

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}

export interface SettingsTabProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}
