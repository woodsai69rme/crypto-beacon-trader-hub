
export type AlertFrequency = 'once' | 'always' | 'daily';
export type NotificationMethod = 'app' | 'email' | 'push';

export interface BaseAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'price' | 'volume' | 'technical';
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

// Form data types
export interface BaseAlertFormData {
  type: 'price' | 'volume' | 'technical';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
  frequency?: AlertFrequency;
}

export interface PriceAlertFormData extends BaseAlertFormData {
  type: 'price';
  targetPrice?: number;
  isAbove?: boolean;
  recurring?: boolean;
  percentageChange?: number;
}

export interface VolumeAlertFormData extends BaseAlertFormData {
  type: 'volume';
  volumeThreshold?: number;
}

export interface TechnicalAlertFormData extends BaseAlertFormData {
  type: 'technical';
  indicator?: string;
  condition?: string;
  value?: number;
  timeframe?: string;
}

export type AlertFormData = PriceAlertFormData | VolumeAlertFormData | TechnicalAlertFormData;
