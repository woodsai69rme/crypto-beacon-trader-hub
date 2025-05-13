
import { SupportedCurrency } from "@/types/trading";
import { UseFormReturn } from "react-hook-form";

export interface SettingsFormValues {
  currency: {
    defaultCurrency: SupportedCurrency;
    showPriceInBTC: boolean;
  };
  api: {
    provider: string;
    key: string;
    selectedProvider?: string;
    refreshInterval?: number;
    timeout?: number;
  };
  display: {
    theme?: string;
    showPortfolio: boolean;
    defaultTab: string;
    compactMode: boolean;
    showAllDecimals?: boolean;
  };
  // User profile settings
  displayName?: string;
  email?: string;
  username?: string;
  language?: string;
  theme?: string;
  // Notifications
  notifications?: {
    email: boolean;
    push: boolean;
    trades: boolean;
    pricing: boolean;
    news: boolean;
    priceAlerts?: boolean;
  };
  // Trading preferences
  tradingPreferences?: {
    autoConfirm: boolean;
    showAdvanced: boolean;
    defaultAsset: string;
  };
  // Privacy settings
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
  };
  // Account settings
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  // Appearance settings
  appearance?: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  // Ticker settings
  ticker?: {
    enabled: boolean;
    position: string;
    speed: number;
    direction: string;
    autoPause: boolean;
  };
}

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}
