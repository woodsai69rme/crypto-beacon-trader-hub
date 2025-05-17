
import { PricePoint, CoinOption, Trade } from '@/types/trading';

// Export the commonly used types
export type { PricePoint, CoinOption, Trade };

// Add the necessary types for components
export interface FibonacciAnalysisProps {
  coinId: string;
  timeRange?: string;
  data?: PricePoint[];
  height?: number;
  width?: string;
}

export interface FibonacciLevels {
  level: number;
  value: number;
  color: string;
}

export interface HyblockLiquidityMapProps {
  coinId: string;
  timeframe?: string;
  width?: string;
  height?: number;
  showControls?: boolean;
}

export interface HyblockLiquidityZone {
  priceRange: [number, number];
  volume: number;
  type: 'buy' | 'sell';
  strength: number;
}

export interface RealTimePriceChartProps {
  coinId: string;
  timeRange: string;
  height?: number;
  width?: string;
  showControls?: boolean;
}
