
import { AITradingStrategy } from '@/types/trading';

// Available AI trading strategies
export const AVAILABLE_STRATEGIES: AITradingStrategy[] = [
  {
    id: 'trend-following',
    name: 'Trend Following',
    description: 'Follows market trends using moving averages and momentum indicators',
    type: 'trend-following',
    timeframe: 'medium',
    riskLevel: 'medium',
    profitPotential: 'medium',
    indicators: ['SMA', 'EMA', 'RSI'],
    triggers: ['Moving Average Crossover', 'RSI Divergence'],
    tags: ['technical', 'momentum']
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'Capitalizes on price movements that revert to the mean',
    type: 'mean-reversion',
    timeframe: 'short',
    riskLevel: 'low',
    profitPotential: 'low',
    indicators: ['Bollinger Bands', 'RSI', 'Stochastic'],
    triggers: ['Oversold/Overbought Signals', 'Support/Resistance'],
    tags: ['reversal', 'statistical']
  },
  {
    id: 'breakout-strategy',
    name: 'Breakout Strategy',
    description: 'Identifies and trades significant price breakouts',
    type: 'breakout',
    timeframe: 'medium',
    riskLevel: 'high',
    profitPotential: 'high',
    indicators: ['Volume', 'ATR', 'Support/Resistance'],
    triggers: ['Volume Spike', 'Price Breakout'],
    tags: ['momentum', 'volatility']
  }
];

// AI Trading Service functions
export const aiTradingService = {
  getStrategies: () => AVAILABLE_STRATEGIES,
  
  getStrategy: (id: string) => AVAILABLE_STRATEGIES.find(s => s.id === id),
  
  executeStrategy: async (strategyId: string, parameters: any) => {
    // Implementation for strategy execution
    console.log(`Executing strategy ${strategyId} with parameters:`, parameters);
  },
  
  backtestStrategy: async (strategyId: string, parameters: any) => {
    // Implementation for backtesting
    console.log(`Backtesting strategy ${strategyId}:`, parameters);
  }
};
