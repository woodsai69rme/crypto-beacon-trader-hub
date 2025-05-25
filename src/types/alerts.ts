
// Alert types
export type AlertType = 'price' | 'volume' | 'pattern' | 'technical';
export type NotificationMethod = 'email' | 'push' | 'app';
export type AlertFrequency = 'once' | 'always' | 'daily' | 'hourly' | '1h' | '4h' | '24h';

// Base alert interface
export interface BaseAlert {
  id: string;
  type: AlertType;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
  createdAt?: Date;
}

// Price alert
export interface PriceAlert extends BaseAlert {
  type: 'price';
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  percentageChange?: number;
}

// Volume alert
export interface VolumeAlert extends BaseAlert {
  type: 'volume';
  targetVolume: number;
  isAbove: boolean;
  volumeThreshold: number;
  frequency: AlertFrequency;
}

// Pattern alert
export interface PatternAlert extends BaseAlert {
  type: 'pattern';
  pattern: string;
}

// Technical alert
export interface TechnicalAlert extends BaseAlert {
  type: 'technical';
  indicator: string;
  threshold: number;
  condition: string;
  value: number;
  timeframe: string;
}

export type Alert = PriceAlert | VolumeAlert | PatternAlert | TechnicalAlert;

export interface AlertFormData {
  id?: string;
  type: AlertType;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
  targetPrice?: number;
  isAbove?: boolean;
  recurring?: boolean;
  percentageChange?: number;
  targetVolume?: number;
  volumeThreshold?: number;
  frequency?: AlertFrequency;
  pattern?: string;
  indicator?: string;
  threshold?: number;
  condition?: string;
  value?: number;
  timeframe?: string;
}
