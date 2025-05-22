
import { SupportedCurrency } from "@/types/trading";

export interface SettingsFormValues {
  theme: string;
  currency: SupportedCurrency;
  language: string;
  bio?: string;
  notifications: {
    email: boolean;
    push: boolean;
    app: boolean;
    trades?: boolean;
  };
  tickerSettings: {
    enabled: boolean;
    position: 'top' | 'bottom' | 'both';
    speed: number;
    direction: 'left' | 'right';
  };
  sidebarSettings: {
    enabled: boolean;
    position: 'left' | 'right';
    defaultCollapsed: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: string;
    speed: number;
    direction: string;
    autoPause: boolean;
  };
  sidebar?: {
    enabled: boolean;
    position: string;
    collapsed: boolean;
    showLabels: boolean;
    autoHide?: boolean;
  };
  tradingPreferences?: {
    autoConfirm: boolean;
    showAdvanced: boolean;
    defaultAsset: string;
  };
  email?: string;
  username?: string;
  displayName?: string;
  apiKeys?: Record<string, string>;
}
