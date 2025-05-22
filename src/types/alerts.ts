
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
}

export type AlertType = "price" | "volume" | "pattern";
