
// Base alert types
export interface AlertData {
  id?: string;
  type: 'price' | 'volume' | 'technical';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: string[];
  frequency: 'once' | 'always' | 'daily';
  createdAt?: string;
  lastTriggered?: string;
}

export interface PriceAlert extends AlertData {
  type: 'price';
  targetPrice?: number;
  isAbove?: boolean;
  priceThreshold?: number;
}

export interface VolumeAlert extends AlertData {
  type: 'volume';
  volumeThreshold?: number;
}

export interface TechnicalAlert extends AlertData {
  type: 'technical';
  indicator?: string;
  condition?: string;
  value?: number;
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
  frequency: 'once' | 'always' | 'daily';
  
  // Price alert fields
  targetPrice?: number;
  isAbove?: boolean;
  priceThreshold?: number;
  
  // Volume alert fields
  volumeThreshold?: number;
  
  // Technical alert fields
  indicator?: string;
  condition?: string;
  value?: number;
  timeframe?: string;
}
