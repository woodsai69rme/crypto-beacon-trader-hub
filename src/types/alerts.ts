
export type AlertFrequency = 'once' | 'daily' | 'hourly' | 'always';

export interface AlertBase {
  id: string;
  enabled: boolean;
  frequency: AlertFrequency;
  notifyVia: ("email" | "app" | "push")[];
}

export interface PriceAlert extends AlertBase {
  type: 'price';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
}

export interface VolumeAlert extends AlertBase {
  type: 'volume';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  volumeThreshold: number;
}

export interface TechnicalAlert extends AlertBase {
  type: 'technical';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  indicator: string;
  condition: string;
  value: number;
}

export type Alert = PriceAlert | VolumeAlert | TechnicalAlert;
