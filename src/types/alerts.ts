
export interface PriceAlert {
  id: string;
  createdAt: Date;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  enabled: boolean;
  recurring: boolean;
  percentageChange: number;
  notifyVia: ("email" | "app" | "push")[];
  type: "price";
}

export type AlertFrequency = "1h" | "4h" | "24h";

export interface VolumeAlert {
  id: string;
  createdAt: Date;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  volumeThreshold: number;
  enabled: boolean;
  frequency: AlertFrequency;
  notifyVia: ("email" | "app" | "push")[];
  type: "volume";
}

export interface PatternAlert {
  id: string;
  createdAt: Date;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  pattern: string;
  enabled: boolean;
  notifyVia: ("email" | "app" | "push")[];
  type: "pattern";
}

export interface TechnicalAlert {
  id: string;
  createdAt: Date;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  indicator: string;
  condition: string;
  value: number;
  enabled: boolean;
  notifyVia: ("email" | "app" | "push")[];
  type: "technical";
  timeframe?: string;
}

export type AlertData = PriceAlert | VolumeAlert | PatternAlert | TechnicalAlert;

export type AlertType = "price" | "volume" | "pattern" | "technical";

export type NotificationMethod = "email" | "app" | "push";

export interface AlertFormData {
  type: AlertType;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
  
  // Price alert fields
  targetPrice?: number;
  isAbove?: boolean;
  recurring?: boolean;
  percentageChange?: number;
  
  // Volume alert fields
  volumeThreshold?: number;
  frequency?: AlertFrequency;
  
  // Technical alert fields
  indicator?: string;
  condition?: string;
  value?: number;
  timeframe?: string;
  
  // Pattern alert fields
  pattern?: string;
}
