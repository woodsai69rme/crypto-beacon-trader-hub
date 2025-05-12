
import { SupportedCurrency } from "@/types/trading";
import { UseFormReturn } from "react-hook-form";

export interface SettingsFormValues {
  currency: {
    defaultCurrency: SupportedCurrency;
    showPriceInBTC: boolean;
  };
  api: {
    selectedProvider: string;
    refreshInterval: number;
    timeout: number;
  };
  display: {
    theme: string;
    compactMode: boolean;
    showAllDecimals: boolean;
  };
  // Extended properties for UserSettings component
  displayName?: string;
  email?: string;
  theme?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    trades: boolean;
    pricing: boolean;
    news: boolean;
  };
  tradingPreferences?: {
    autoConfirm: boolean;
    showAdvanced: boolean;
    defaultAsset: string;
  };
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  appearance?: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
}

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}
