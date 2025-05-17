
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/types/trading";

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}

export interface SettingsFormValues {
  theme: string;
  displayName?: string;
  email?: string;
  username?: string;
  language?: string;
  currency?: {
    defaultCurrency: string;
    showConversion: boolean;
    showPriceInBTC?: boolean;
  };
  api?: {
    provider: string;
    key?: string;
    refreshInterval?: number;
    timeout?: number;
  };
  display?: {
    showPortfolio: boolean;
    showBalances?: boolean;
    defaultTab?: string;
    compactMode: boolean;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
    colorScheme?: string;
  };
  notifications?: {
    enableEmail: boolean;
    enablePush: boolean;
    alertPrice: boolean;
    alertNews: boolean;
    email?: boolean;
    push?: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
    priceAlerts?: boolean;
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
  ticker?: {
    enabled: boolean;
    position: string;
    speed: number;
    direction: string;
    autoPause: boolean;
  };
}
