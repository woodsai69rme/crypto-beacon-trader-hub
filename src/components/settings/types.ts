
import { UseFormReturn } from "react-hook-form";

export interface SettingsFormValues {
  theme: "light" | "dark";
  colorScheme: "default" | "midnight-tech" | "cyber-pulse" | "matrix-code";
  layout: "default" | "compact" | "traderview" | "professional" | "custom";
  username: string;
  displayName: string;
  email: string;
  bio: string;
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
    marketUpdates: boolean;
    newsletterAndPromotions: boolean;
  };
  appearance: {
    compactMode: boolean;
    animationsEnabled: boolean;
    highContrastMode: boolean;
    showTradingHistory: boolean;
    showPortfolioChart: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
  };
  trading: {
    defaultOrder: "market" | "limit";
    confirmTradeExecutions: boolean;
    showPriceAlerts: boolean;
    autoSyncExchanges: boolean;
    tradingViewCharts: boolean;
  };
  ticker: {
    enabled: boolean;
    position: "top" | "bottom" | "both";
    speed: number;
    direction: "left" | "right";
    autoPause: boolean;
  };
  sidebar: {
    enabled: boolean;
    position: "left" | "right";
    defaultCollapsed: boolean;
    showLabels: boolean;
  };
  language: string;
  timeZone: string;
  darkMode: boolean;
  exportFormat: "CSV" | "JSON" | "PDF";
  dataPrivacy: {
    storeHistory: boolean;
    anonymizeData: boolean;
    enableTracking: boolean;
  };
}

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}
