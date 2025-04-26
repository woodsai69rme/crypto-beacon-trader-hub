
import { PriceAlert, VolumeAlert, AlertFrequency } from "@/types/alerts";

export const createPriceAlert = (formData: {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  recurring?: boolean;
  percentageChange?: number;
  notifyVia?: ("email" | "app" | "push")[];
}): PriceAlert => {
  return {
    id: `alert-${Date.now()}`,
    createdAt: new Date(),
    enabled: true,
    recurring: formData.recurring || false,
    percentageChange: formData.percentageChange || 0,
    notifyVia: formData.notifyVia || ["app"],
    ...formData
  };
};

export const createVolumeAlert = (formData: {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  volumeThreshold: number;
  frequency: AlertFrequency;
  notifyVia?: ("email" | "app" | "push")[];
}): VolumeAlert => {
  return {
    id: `volume-alert-${Date.now()}`,
    createdAt: new Date(),
    enabled: true,
    notifyVia: formData.notifyVia || ["app"],
    ...formData
  };
};

export const formatAlertMessage = (alert: PriceAlert | VolumeAlert): string => {
  if ('targetPrice' in alert) {
    return `${alert.coinName} is ${alert.isAbove ? "above" : "below"} $${alert.targetPrice.toLocaleString()}`;
  } else {
    return `${alert.coinName} ${alert.frequency} volume increased by ${alert.volumeThreshold}%`;
  }
};
