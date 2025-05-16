
import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';

export interface SettingsFormValues {
  theme: string;
  display: {
    showPortfolio: boolean;
    defaultTab: string;
    compactMode: boolean;
    // Add any missing properties
    colorScheme?: string;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
  };
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
  };
  api: {
    provider: string;
    key: string;
    // Add the missing properties
    refreshInterval?: number;
    timeout?: number;
  };
  // Add missing sections
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
    dataCollection: boolean;
    marketingConsent: boolean;
    thirdPartySharing: boolean;
  };
  appearance?: {
    colorScheme: string;
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
  };
  // Add any other missing sections
  displayName?: string;
  username?: string;
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
