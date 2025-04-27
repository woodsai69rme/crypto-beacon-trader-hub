
import { AITradingStrategy, TimeframeOption } from '@/types/trading';

export const predefinedStrategies: AITradingStrategy[] = [
  {
    id: 'momentum-1',
    name: 'Momentum Strategy',
    description: 'Follows market momentum using multiple technical indicators',
    type: 'momentum',
    timeframe: '1h',
    parameters: {
      rsiPeriod: 14,
      macdFast: 12,
      macdSlow: 26,
      macdSignal: 9
    }
  },
  {
    id: 'mean-reversion-1',
    name: 'Mean Reversion',
    description: 'Identifies and trades price deviations from moving averages',
    type: 'mean-reversion',
    timeframe: '4h',
    parameters: {
      lookbackPeriod: 20,
      standardDeviations: 2,
      movingAveragePeriod: 50
    }
  },
  {
    id: 'trend-following-1',
    name: 'Trend Following',
    description: 'Follows established market trends using moving averages',
    type: 'trend-following',
    timeframe: '1d',
    parameters: {
      shortMaPeriod: 20,
      longMaPeriod: 50,
      trendStrengthThreshold: 0.02
    }
  }
];

// Sample strategies with additional data for demo purposes
export const sampleStrategies: AITradingStrategy[] = [
  ...predefinedStrategies,
  {
    id: 'volatility-breakout-1',
    name: 'Volatility Breakout',
    description: 'Identifies and trades breakouts from low volatility periods',
    type: 'custom',
    timeframe: '2h',
    parameters: {
      volatilityPeriod: 14,
      breakoutThreshold: 1.5,
      profitTarget: 2.0,
      stopLoss: 1.0
    }
  },
  {
    id: 'grid-trading-1',
    name: 'Grid Trading',
    description: 'Places buy and sell orders at preset intervals to profit from price oscillations',
    type: 'custom',
    timeframe: '15m',
    parameters: {
      upperLimit: 65000,
      lowerLimit: 55000,
      gridLevels: 10,
      orderSize: 0.01
    }
  }
];

// Available timeframe options
export const availableTimeframes: TimeframeOption[] = [
  { value: '1m', label: '1 Minute', description: 'One minute candlesticks', minutes: 1 },
  { value: '5m', label: '5 Minutes', description: 'Five minute candlesticks', minutes: 5 },
  { value: '15m', label: '15 Minutes', description: 'Fifteen minute candlesticks', minutes: 15 },
  { value: '30m', label: '30 Minutes', description: 'Thirty minute candlesticks', minutes: 30 },
  { value: '1h', label: '1 Hour', description: 'One hour candlesticks', minutes: 60 },
  { value: '2h', label: '2 Hours', description: 'Two hour candlesticks', minutes: 120 },
  { value: '4h', label: '4 Hours', description: 'Four hour candlesticks', minutes: 240 },
  { value: '6h', label: '6 Hours', description: 'Six hour candlesticks', minutes: 360 },
  { value: '8h', label: '8 Hours', description: 'Eight hour candlesticks', minutes: 480 },
  { value: '12h', label: '12 Hours', description: 'Twelve hour candlesticks', minutes: 720 },
  { value: '1d', label: '1 Day', description: 'One day candlesticks', minutes: 1440 },
  { value: '3d', label: '3 Days', description: 'Three day candlesticks', minutes: 4320 },
  { value: '1w', label: '1 Week', description: 'One week candlesticks', minutes: 10080 },
];
