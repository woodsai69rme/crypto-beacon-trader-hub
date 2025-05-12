
import { v4 as uuidv4 } from 'uuid';
import { AITradingStrategy, BacktestResult, OptimizationResult, Trade } from '@/types/trading';

// Default parameters for new strategies
export const DEFAULT_STRATEGY_PARAMETERS = {
  period: 14,
  threshold: 70,
  stopLoss: 5,
  takeProfit: 10,
  useVolume: true,
  indicator: 'RSI',
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9,
  upperBand: 70,
  lowerBand: 30,
  riskFactor: 2,
};

/**
 * Creates a new custom AI trading strategy
 */
export const createCustomStrategy = (
  name: string,
  description: string,
  type: string,
  timeframe: string,
  parameters: Record<string, any> = {}
): AITradingStrategy => {
  return {
    id: uuidv4(),
    name,
    description,
    type,
    timeframe,
    parameters: { 
      ...DEFAULT_STRATEGY_PARAMETERS, 
      ...parameters 
    },
    assets: ['bitcoin', 'ethereum'],
  };
};

/**
 * Runs a backtest for the specified strategy and parameters
 */
export const runBacktest = async (
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialCapital: number = 10000,
  asset: string = 'bitcoin'
): Promise<BacktestResult> => {
  // In a real implementation, this would call an API or run calculations
  // For now, we'll return mock data
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate random results based on strategy parameters
  const returns = Math.random() * (strategy.parameters.riskFactor || 1) * 30;
  const winRate = 40 + Math.random() * 30;
  const trades = 20 + Math.floor(Math.random() * 80);
  const maxDrawdown = 5 + Math.random() * 15;
  const sharpeRatio = 0.5 + Math.random() * 2;
  const profitFactor = 1 + Math.random() * 2;
  const profit = initialCapital * (returns / 100);
  const profitPercentage = returns;
  const finalBalance = initialCapital + profit;
  const totalTrades = trades;
  
  // Generate mock trade history
  const tradeHistory = generateMockTradeHistory(trades, returns);
  
  return {
    returns,
    winRate,
    trades,
    maxDrawdown,
    sharpeRatio,
    profitFactor,
    tradeHistory,
    profit,
    profitPercentage,
    finalBalance,
    totalTrades
  };
};

/**
 * Optimizes parameters for the given strategy
 */
export const optimizeStrategy = async (
  strategy: AITradingStrategy,
  parameterRanges: any,
  optimizationTarget: string = 'returns'
): Promise<OptimizationResult> => {
  // In a real implementation, this would run a grid search or other optimization algorithm
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a mock optimization result
  const originalParameters = { ...strategy.parameters };
  const optimizedParameters = { ...originalParameters };
  
  // Modify parameters within the ranges
  Object.entries(parameterRanges).forEach(([param, range]) => {
    if (typeof originalParameters[param] === 'number') {
      // Generate a slightly better value
      if (Array.isArray(range)) {
        // If range is provided as [min, max, step]
        const [min, max, step] = range;
        const steps = Math.floor((max - min) / step);
        const randomStep = Math.floor(Math.random() * steps);
        optimizedParameters[param] = min + (randomStep * step);
      } else if (typeof range === 'object' && range.min !== undefined) {
        // If range is provided as an object with min/max/step
        const { min, max, step } = range;
        const steps = Math.floor((max - min) / step);
        const randomStep = Math.floor(Math.random() * steps);
        optimizedParameters[param] = min + (randomStep * step);
      } else {
        // Generate a random improvement
        const variation = originalParameters[param] * (Math.random() * 0.4 - 0.1); // -10% to +30%
        optimizedParameters[param] = originalParameters[param] + variation;
      }
    }
  });
  
  // Generate random improvements
  const improvement = Math.random() * 20 + 5; // 5% to 25% improvement
  const baseReturns = 10 + Math.random() * 20;
  const returns = baseReturns + improvement;
  const winRate = 45 + Math.random() * 30;
  const maxDrawdown = 5 + Math.random() * 10;
  const sharpeRatio = 1 + Math.random() * 1.5;
  const profitFactor = 1.2 + Math.random() * 1.5;
  const trades = 50 + Math.floor(Math.random() * 100);
  
  const result: OptimizationResult = {
    id: uuidv4(),
    strategyId: strategy.id,
    parameters: optimizedParameters,
    parameterValues: optimizedParameters,
    performance: {
      returns,
      winRate,
      profitFactor,
      sharpeRatio,
      maxDrawdown
    },
    trades,
    timeframe: strategy.timeframe,
    optimizationDate: new Date().toISOString(),
    improvement
  };
  
  return result;
};

/**
 * Generate mock trade history for backtests
 */
const generateMockTradeHistory = (count: number, overallReturn: number): Trade[] => {
  const trades: Trade[] = [];
  let cumulativeProfit = 0;
  
  for (let i = 0; i < count; i++) {
    const isWin = Math.random() > 0.4;
    const profit = isWin 
      ? Math.random() * 5 
      : -Math.random() * 3;
    
    cumulativeProfit += profit;
    
    const date = new Date();
    date.setDate(date.getDate() - (count - i));
    
    trades.push({
      id: uuidv4(),
      timestamp: date.toISOString(),
      date: date.toLocaleDateString(),
      type: Math.random() > 0.5 ? 'buy' : 'sell',
      price: 20000 + Math.random() * 10000,
      amount: 0.1 + Math.random() * 0.9,
      total: 0, // Will be calculated below
      profit,
      profitPercentage: profit / 100,
      coin: 'bitcoin',
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'BTC',
      currency: 'USD',
      totalValue: 0 // Will be calculated below
    });
  }
  
  // Adjust final trade to match overall return goal
  if (trades.length > 0) {
    const lastTrade = trades[trades.length - 1];
    lastTrade.profit = overallReturn - (cumulativeProfit - lastTrade.profit);
  }
  
  // Calculate total values
  trades.forEach(trade => {
    trade.total = trade.price * trade.amount;
    trade.totalValue = trade.total + trade.profit;
  });
  
  return trades;
};
