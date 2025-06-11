import { AITradingStrategy } from '@/types/trading';

export const AVAILABLE_STRATEGIES: AITradingStrategy[] = [
  {
    id: 'trend-following',
    name: 'Trend Following',
    description: 'Follows market momentum and trends',
    type: 'trend-following',
    timeframe: 'medium',
    parameters: {},
    performance: {
      winRate: 68,
      profitFactor: 1.8,
      sharpeRatio: 1.2
    }
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'Exploits price reversals',
    type: 'mean-reversion',
    timeframe: 'short',
    parameters: {},
    performance: {
      winRate: 72,
      profitFactor: 2.1,
      sharpeRatio: 1.4
    }
  }
];
