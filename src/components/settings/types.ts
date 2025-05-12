
import { SupportedCurrency } from "@/types/trading";

export interface SettingsFormValues {
  currency: {
    defaultCurrency: SupportedCurrency;
    showPriceInBTC: boolean;
  };
  api: {
    selectedProvider: string;
    refreshInterval: number;
    timeout: number;
  };
  display: {
    theme: string;
    compactMode: boolean;
    showAllDecimals: boolean;
  };
}
