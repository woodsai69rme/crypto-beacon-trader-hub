
// Define alert types for the application
export type AlertFrequency = 'once' | 'recurring' | 'daily' | 'hourly';

export interface BaseAlertData {
  id?: string;
  type: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  frequency: AlertFrequency;
  notifyVia: Array<"email" | "app" | "push">;
  createdAt?: string;
  lastTriggered?: string;
}

export interface PriceAlert extends BaseAlertData {
  type: 'price';
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  percentageChange: number;
}

export interface VolumeAlert extends BaseAlertData {
  type: 'volume';
  volumeThreshold: number;
}

export interface TechnicalAlert extends BaseAlertData {
  type: 'technical';
  indicator: string;
  condition: string;
  value: number;
}

export type AlertData = PriceAlert | VolumeAlert | TechnicalAlert;
