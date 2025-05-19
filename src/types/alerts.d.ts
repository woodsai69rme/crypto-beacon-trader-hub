
// Base alert types
export type AlertFrequency = 'once' | 'recurring' | 'daily' | 'hourly' | '1h' | '4h' | '24h';

export interface AlertData {
  id?: string;
  type: 'price' | 'volume' | 'technical';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: string[];
  frequency: AlertFrequency;
  createdAt?: string;
  lastTriggered?: string;
}

export interface PriceAlert extends AlertData {
  type: 'price';
  targetPrice: number;
  isAbove: boolean;
  recurring?: boolean;
  percentageChange?: number;
}

export interface VolumeAlert extends AlertData {
  type: 'volume';
  volumeThreshold: number;
}

export interface TechnicalAlert extends AlertData {
  type: 'technical';
  indicator: string;
  condition: string;
  value: number;
  timeframe?: string;
}

// Form data for creating alerts
export interface AlertFormData {
  type: 'price' | 'volume' | 'technical';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: string[];
  frequency: AlertFrequency;
  
  // Price alert fields
  targetPrice?: number;
  isAbove?: boolean;
  recurring?: boolean;
  percentageChange?: number;
  
  // Volume alert fields
  volumeThreshold?: number;
  
  // Technical alert fields
  indicator?: string;
  condition?: string;
  value?: number;
  timeframe?: string;
}
