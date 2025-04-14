
export type SettingsFormValues = {
  darkMode: boolean;
  notifications: boolean;
  language: LanguageOption;
  layout: LayoutOption;
  timeZone: TimeZoneOption;
  exportFormat: ExportFormatOption;
  alertVolume: number;
  alertFrequency: AlertFrequencyOption;
  dataPrivacy: {
    shareAnalytics: boolean;
    storeHistory: boolean;
    autoDeleteData?: boolean;
    dataRetentionPeriod?: DataRetentionPeriodOption;
  };
  dashboardCustomization: {
    showPortfolioValue: boolean;
    defaultCurrency: CurrencyOption;
    defaultTimeframe: TimeframeOption;
    defaultChartType?: ChartTypeOption;
    chartColors?: ChartColorSchemeOption;
  };
  security?: {
    enableTwoFactor: boolean;
    autoLock: boolean;
    lockTimeout: number; // minutes
  };
};

export type LayoutOption = 'default' | 'compact' | 'expanded' | 'trading' | 'portfolio';
export type LanguageOption = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
export type TimeZoneOption = 'UTC' | 'EST' | 'CST' | 'MST' | 'PST' | 'GMT' | 'IST';
export type ExportFormatOption = 'csv' | 'json' | 'pdf' | 'excel';
export type AlertFrequencyOption = 'high' | 'medium' | 'low' | 'none';
export type CurrencyOption = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'BTC' | 'ETH';
export type TimeframeOption = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'MAX';
export type ChartTypeOption = 'line' | 'candle' | 'bar' | 'area';
export type ChartColorSchemeOption = 'default' | 'monochrome' | 'colorblind' | 'custom';
export type DataRetentionPeriodOption = '30days' | '90days' | '1year' | 'forever';

// Tab definitions
export type SettingsTab = 'general' | 'appearance' | 'notifications' | 'data';
