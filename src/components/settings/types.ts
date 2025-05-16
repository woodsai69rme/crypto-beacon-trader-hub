
import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';

export interface SettingsFormValues {
  theme: string;
  display: {
    showPortfolio: boolean;
    defaultTab: string;
    compactMode: boolean;
    colorScheme?: string;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
  };
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
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
  displayName?: string;
  username?: string;
  contactEmail?: string;
  userLanguage?: string;
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
