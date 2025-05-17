
export type AlertFrequency = 'once' | 'recurring' | 'daily' | 'hourly' | '1h' | '4h' | '24h';

export interface AlertFormData {
  type: 'price' | 'volume' | 'technical';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  frequency?: AlertFrequency;
  notifyVia?: Array<"email" | "app" | "push">;
  targetPrice?: number;
  isAbove?: boolean;
  recurring?: boolean;
  percentageChange?: number;
  volumeThreshold?: number;
  indicator?: string;
  condition?: string;
  value?: number;
}

export interface BaseAlertData {
  id: string;
  createdAt: Date;
  type: 'price' | 'volume' | 'technical';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  frequency: AlertFrequency;
  notifyVia: Array<"email" | "app" | "push">;
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
