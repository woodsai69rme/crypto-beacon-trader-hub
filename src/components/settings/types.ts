
export interface SettingsComponentProps {
  form?: any;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  app: boolean;
  trades?: boolean;
  pricing?: boolean;
  news?: boolean;
}

export interface TickerSettings {
  enabled: boolean;
  position: 'top' | 'bottom' | 'both';
  speed: number;
  direction: 'left' | 'right';
  autoPause: boolean;
}

export interface SidebarSettings {
  enabled: boolean;
  position: 'left' | 'right';
  defaultCollapsed: boolean;
  showLabels: boolean;
}

export interface AppearanceSettings {
  colorScheme: string;
  compactMode: boolean;
  animationsEnabled: boolean;
  highContrastMode: boolean;
}

export interface PrivacySettings {
  showOnlineStatus?: boolean;
  sharePortfolio?: boolean;
  shareTrades?: boolean;
  dataCollection: boolean;
  marketingConsent: boolean;
  thirdPartySharing?: boolean;
}

export interface AccountSettings {
  twoFactorEnabled?: boolean;
  loginAlerts?: boolean;
}

export interface TradingPreferences {
  autoConfirm?: boolean;
  showAdvanced?: boolean;
  defaultAsset?: string;
}

export interface SettingsFormValues {
  email?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  theme: string;
  currency: string;
  language?: string;
  notifications: NotificationSettings;
  tickerSettings?: TickerSettings;
  sidebarSettings?: SidebarSettings;
  sidebar?: boolean;
  appearance?: AppearanceSettings;
  privacy?: PrivacySettings;
  account?: AccountSettings;
  tradingPreferences?: TradingPreferences;
  autoSave?: boolean;
  dataRetention?: number;
  marketDataProvider?: string;
}
