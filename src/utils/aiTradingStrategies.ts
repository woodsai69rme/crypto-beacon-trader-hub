
import { AITradingStrategy } from '@/types/trading';

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
