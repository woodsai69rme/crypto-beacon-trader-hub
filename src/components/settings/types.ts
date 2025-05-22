
import { UseFormReturn } from "react-hook-form";

export interface SettingsFormValues {
  displayName?: string;
  email?: string;
  username?: string;
  bio?: string;
  theme?: string;
  language?: string;
  appearance?: {
    colorScheme?: string;
    compactMode?: boolean;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
  };
  privacy?: {
    showOnlineStatus?: boolean;
    sharePortfolio?: boolean;
    shareTrades?: boolean;
    dataCollection?: boolean;
    marketingConsent?: boolean;
    thirdPartySharing?: boolean;
  };
  account?: {
    twoFactorEnabled?: boolean;
    loginAlerts?: boolean;
  };
  tradingPreferences?: {
    autoConfirm?: boolean;
    showAdvanced?: boolean;
    defaultAsset?: string;
  };
  ticker?: {
    enabled?: boolean;
    position?: string;
    speed?: number;
    direction?: string;
    autoPause?: boolean;
  };
  sidebar?: {
    enabled?: boolean;
    position?: string;
    collapsed?: boolean;
    showLabels?: boolean;
  };
}

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}
