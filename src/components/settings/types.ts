
export type SettingsFormValues = {
  darkMode: boolean;
  notifications: boolean;
  language: string;
  layout: string;
  timeZone: string;
  exportFormat: string;
  alertVolume: number;
  alertFrequency: string;
  dataPrivacy: {
    shareAnalytics: boolean;
    storeHistory: boolean;
  };
  dashboardCustomization: {
    showPortfolioValue: boolean;
    defaultCurrency: string;
    defaultTimeframe: string;
  };
};

export type LayoutOption = 'default' | 'compact' | 'expanded' | 'trading' | 'portfolio';
export type LanguageOption = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
export type TimeZoneOption = 'UTC' | 'EST' | 'CST' | 'MST' | 'PST' | 'GMT' | 'IST';
export type ExportFormatOption = 'csv' | 'json' | 'pdf' | 'excel';
export type AlertFrequencyOption = 'high' | 'medium' | 'low' | 'none';
export type CurrencyOption = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'BTC' | 'ETH';
export type TimeframeOption = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'MAX';
