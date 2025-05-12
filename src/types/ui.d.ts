
export interface SidebarSettings {
  defaultCollapsed: boolean;
  showLabels: boolean;
  position: 'left' | 'right';
  width: number;
}

export interface ChartSettings {
  defaultStyle: 'candles' | 'lines';
  theme: 'light' | 'dark';
  indicators: string[];
  showVolume: boolean;
  timeframe: string;
  autoRefresh: boolean;
}

export interface NotificationSettings {
  priceAlerts: boolean;
  sentimentAlerts: boolean;
  portfolioAlerts: boolean;
  tradingBotAlerts: boolean;
  whaleAlerts: boolean;
  soundEffects: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
}

export type ViewMode = 'standard' | 'compact' | 'expanded';

export interface LayoutSettings {
  viewMode: ViewMode;
  hiddenElements: string[];
  widgetOrder: string[];
  customLayouts: Record<string, any>;
}

export interface AppTheme {
  mode: 'light' | 'dark' | 'system';
  color: 'blue' | 'green' | 'purple' | 'amber' | 'rose';
  fontSize: 'sm' | 'md' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export type ColorScheme = 'blue' | 'green' | 'purple' | 'amber' | 'rose'; 

export interface DateRangeOption {
  label: string;
  value: string;
  days: number;
}
