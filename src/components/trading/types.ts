
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
  symbol?: string;
  timeframe?: string;
}

export interface FibonacciLevels {
  level: number;
  value: number;
  color: string;
  level0?: number;
  level236?: number;
  level382?: number;
  level500?: number;
  level618?: number;
  level786?: number;
  level1000?: number;
}

export interface HyblockLiquidityMapProps {
  coinId: string;
  timeframe?: string;
  width?: string;
  height?: number;
  showControls?: boolean;
  symbol?: string;
}

export interface HyblockLiquidityZone {
  priceRange: [number, number];
  volume: number;
  type: 'buy' | 'sell';
  strength: number;
  min?: number;
  max?: number;
}

export interface RealTimePriceChartProps {
  coinId: string;
  timeRange: string;
  height?: number;
  width?: string;
  showControls?: boolean;
}

export interface FakeTradingFormProps {
  onTrade: (trade: Trade) => void;
  availableCoins: CoinOption[];
  initialCoinId?: string;
  advancedMode?: boolean;
}
