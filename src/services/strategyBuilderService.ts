
import { AITradingStrategy, OptimizationResult, BacktestResult } from "@/types/trading";

// Default strategy parameters
export const DEFAULT_STRATEGY_PARAMETERS = {
  period: 14,
  threshold: 70,
  stopLoss: 5,
  takeProfit: 15,
  useVolume: true,
  indicator: 'rsi',
  allowWeekendTrading: false,
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9,
  upperBand: 70,
  lowerBand: 30,
  riskFactor: 0.5,
  sentimentThreshold: 0.6,
  sentimentTimeframe: '1d'
};

// Create a new custom strategy
export const createCustomStrategy = (
  name: string,
  description: string,
  type: string,
  timeframe: string,
  parameters: Record<string, any>
): AITradingStrategy => {
  return {
    id: `strategy-${Date.now()}`,
    name,
    description,
    type,
    timeframe,
    riskLevel: 'medium',
    parameters: { ...parameters },
    assets: ['bitcoin', 'ethereum'],
    performance: {
      winRate: 65,
      returnRate: 25.4,
      sharpeRatio: 2.1,
      maxDrawdown: 12.5,
      profitFactor: 1.8
    }
  };
};

// Run a backtest for a strategy
export const runBacktest = async (
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialBalance: number,
  asset: string
): Promise<BacktestResult> => {
  // Simulate backtest processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a simulated backtest result
  return {
    startDate,
    endDate,
    initialBalance,
    finalBalance: initialBalance * (1 + Math.random() * 0.4),
    profit: initialBalance * Math.random() * 0.4,
    profitPercentage: Math.random() * 40,
    maxDrawdown: Math.random() * 15,
    winRate: 0.6 + Math.random() * 0.2,
    trades: [
      {
        id: `trade-${Date.now()}-1`,
        timestamp: new Date(startDate).toISOString(),
        date: new Date(startDate).toLocaleDateString(),
        type: 'buy',
        price: 30000 + Math.random() * 2000,
        amount: Math.random() * 2,
        total: 30000 * Math.random() * 2,
        profit: 0,
        profitPercentage: 0
      },
      {
        id: `trade-${Date.now()}-2`,
        timestamp: new Date(endDate).toISOString(),
        date: new Date(endDate).toLocaleDateString(),
        type: 'sell',
        price: 32000 + Math.random() * 2000,
        amount: Math.random() * 2,
        total: 32000 * Math.random() * 2,
        profit: 2000 * Math.random() * 2,
        profitPercentage: Math.random() * 8
      }
    ],
    sharpeRatio: 1.5 + Math.random() * 1,
    profitFactor: 1.2 + Math.random() * 0.8,
    averageProfit: 500 + Math.random() * 200,
    averageLoss: -300 - Math.random() * 200,
    initialCapital: initialBalance,
    finalCapital: initialBalance * (1 + Math.random() * 0.4),
    totalReturn: Math.random() * 40,
    totalTrades: 10 + Math.floor(Math.random() * 20),
    winningTrades: 6 + Math.floor(Math.random() * 15),
    losingTrades: 4 + Math.floor(Math.random() * 5),
    sortinoRatio: 1.3 + Math.random() * 0.8
  };
};

/**
 * Optimize a trading strategy based on given parameter ranges and target metric
 * 
 * @param strategy The base strategy to optimize
 * @param paramRanges Parameter ranges to test
 * @param target The optimization target metric
 * @returns Optimization result with best parameters
 */
export const optimizeStrategy = async (
  strategy: AITradingStrategy,
  paramRanges: { id: string; min: number; max: number; step: number }[],
  target: 'profitFactor' | 'sharpeRatio' | 'profit' | 'drawdown'
): Promise<OptimizationResult> => {
  // This is a simulated optimization process
  // In a real application, this would call a backend service
  console.log(`Optimizing strategy ${strategy.name} for ${target}`);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create mock parameter values based on ranges
  const parameterValues: Record<string, number> = {};
  
  paramRanges.forEach(param => {
    // Generate a "better" value somewhere between min and max
    const originalValue = (strategy.parameters[param.id] as number) || param.min;
    
    // Random improvement between 5-20%
    const improvement = Math.random() * 0.15 + 0.05;
    
    // Direction of improvement (smaller or larger)
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    // Calculate optimized value with constraints
    let optimizedValue = originalValue * (1 + direction * improvement);
    
    // Ensure optimized value is within the specified range
    optimizedValue = Math.max(param.min, Math.min(param.max, optimizedValue));
    
    // Round to 2 decimal places
    optimizedValue = Math.round(optimizedValue * 100) / 100;
    
    parameterValues[param.id] = optimizedValue;
  });
  
  // Calculate performance improvements
  const basePerformance = {
    returns: strategy.performance?.returnRate || strategy.performance?.returns || 0,
    winRate: strategy.performance?.winRate || 0,
    profitFactor: strategy.performance?.profitFactor || 0,
    sharpeRatio: strategy.performance?.sharpeRatio || 0,
    maxDrawdown: strategy.performance?.maxDrawdown || strategy.performance?.drawdown || 0
  };
  
  // Generate improved performance metrics
  const returns = basePerformance.returns * (1 + Math.random() * 0.2);
  const winRate = Math.min(0.95, basePerformance.winRate * (1 + Math.random() * 0.15));
  const profitFactor = basePerformance.profitFactor * (1 + Math.random() * 0.25);
  const sharpeRatio = basePerformance.sharpeRatio * (1 + Math.random() * 0.2);
  const maxDrawdown = basePerformance.maxDrawdown * (1 - Math.random() * 0.2);
  
  // Calculate overall improvement
  const improvementPercent = target === 'drawdown'
    ? ((basePerformance.maxDrawdown - maxDrawdown) / basePerformance.maxDrawdown) * 100
    : ((returns - basePerformance.returns) / basePerformance.returns) * 100;
  
  return {
    strategyId: strategy.id,
    parameterValues,
    performance: {
      profit: returns,
      profitPercentage: returns,
      maxDrawdown,
      winRate,
      sharpeRatio,
      profitFactor,
      totalReturn: returns
    },
    improvement: improvementPercent,
    id: `opt-${Date.now()}`,
    parameters: parameterValues
  };
};

/**
 * Save a trading strategy
 * 
 * @param strategy Strategy to save
 * @returns Updated strategy with ID
 */
export const saveStrategy = async (strategy: AITradingStrategy): Promise<AITradingStrategy> => {
  // Simulated save implementation
  console.log('Saving strategy:', strategy.name);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return strategy with ID
  return {
    ...strategy,
    id: strategy.id || `strategy-${Date.now()}`
  };
};

/**
 * Delete a trading strategy
 * 
 * @param strategyId ID of strategy to delete
 * @returns Success status
 */
export const deleteStrategy = async (strategyId: string): Promise<boolean> => {
  // Simulated delete implementation
  console.log('Deleting strategy:', strategyId);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
};
