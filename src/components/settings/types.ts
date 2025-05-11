
import { UseFormReturn } from "react-hook-form";

export interface SettingsFormValues {
  username?: string;
  displayName?: string;
  email?: string;
  theme?: string;
  bio?: string;
  language?: string; // Added language field
  notifications: {
    email: boolean;
    push: boolean;
    trades: boolean;
    pricing: boolean;
    news: boolean;
  };
  tradingPreferences: {
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
  ticker?: { // Added ticker settings
    enabled: boolean;
    position: string;
    speed: number;
    direction: string;
    autoPause: boolean;
  };
  sidebar?: { // Added sidebar settings
    enabled: boolean;
    position: string;
    collapsed: boolean;
    autoHide: boolean;
  };
}

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
  onSave?: (values: Partial<SettingsFormValues>) => void; // Added onSave
  defaultValues?: Partial<SettingsFormValues>; // Added defaultValues
}
