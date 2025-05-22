
export type AlertType = 'price' | 'volume' | 'technical';
export type AlertFrequency = 'once' | 'always' | 'daily';
export type NotificationMethod = 'email' | 'app' | 'push';

export interface AlertFormData {
  type: AlertType;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
  frequency?: AlertFrequency;
  targetPrice?: number;
  isAbove?: boolean;
  recurring?: boolean;
  percentageChange?: number;
  volumeThreshold?: number;
  indicator?: string;
  condition?: string;
  value?: number;
  timeframe?: string;
}

export interface BaseAlert {
  id: string;
  type: AlertType;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
  frequency: AlertFrequency;
  createdAt: string;
}

export interface PriceAlert extends BaseAlert {
  type: 'price';
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  percentageChange: number;
}

export interface VolumeAlert extends BaseAlert {
  type: 'volume';
  volumeThreshold: number;
}

export interface TechnicalAlert extends BaseAlert {
  type: 'technical';
  indicator: string;
  condition: string;
  value: number;
  timeframe: string;
}

export type AlertData = PriceAlert | VolumeAlert | TechnicalAlert;
