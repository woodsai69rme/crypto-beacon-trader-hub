
export interface NotificationsSettings {
  email: boolean;
  push: boolean;
  priceAlerts: boolean;
  marketUpdates: boolean;
  newsletterAndPromotions: boolean;
}

export interface PrivacySettings {
  showOnlineStatus: boolean;
  sharePortfolio: boolean;
  shareTrades: boolean;
}

export interface AppearanceSettings {
  compactMode: boolean;
  animationsEnabled: boolean;
  showTradingHistory: boolean;
  showPortfolioChart: boolean;
  highContrastMode: boolean;
}

export interface AccountSettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
}

export interface TradingSettings {
  confirmTradeExecutions: boolean;
  showPriceAlerts: boolean;
  defaultOrder: "market" | "limit" | "stop";
}

export interface DashboardCustomizationSettings {
  defaultCurrency: string;
  defaultTimeframe: string;
  alertVolume: number;
  alertFrequency: "low" | "medium" | "high";
}

export interface DataPrivacySettings {
  storeHistory: boolean;
  enableTracking: boolean;
}

export interface SettingsFormValues {
  email: string;
  username: string;
  displayName: string;
  bio: string;
  darkMode: boolean;
  language: string;
  timeZone: string;
  layout: string;
  theme: "light" | "dark";
  colorScheme: "default" | "midnight-tech" | "cyber-pulse" | "matrix-code" | "golden-sunset";
  notifications: NotificationsSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
  account: AccountSettings;
  trading: TradingSettings;
  dashboardCustomization: DashboardCustomizationSettings;
  dataPrivacy: DataPrivacySettings;
  exportFormat: "CSV" | "JSON" | "PDF" | "EXCEL";
}
