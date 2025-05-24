
import { UseFormReturn } from 'react-hook-form';

// Updated settings form values to match the actual structure
export interface SettingsFormValues {
  email?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  theme: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    app: boolean;
  };
  tickerSettings: {
    enabled: boolean;
    position: 'top' | 'bottom' | 'both';
    speed: number;
    direction: 'left' | 'right';
    autoPause: boolean;
  };
  sidebarSettings: {
    enabled: boolean;
    position: 'left' | 'right';
    defaultCollapsed: boolean;
    showLabels: boolean;
  };
  sidebar?: boolean;
  ticker?: {
    enabled: boolean;
    position: 'top' | 'bottom' | 'both';
    speed: number;
    direction: 'left' | 'right';
    autoPause: boolean;
  };
  appearance?: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  privacy?: {
    showOnlineStatus?: boolean;
    sharePortfolio?: boolean;
    shareTrades?: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing?: boolean;
  };
  tradingPreferences?: {
    autoConfirm?: boolean;
    showAdvanced?: boolean;
    defaultAsset?: string;
  };
}

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}
