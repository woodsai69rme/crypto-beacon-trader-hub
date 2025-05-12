
import { AITradingStrategy, BacktestResult, OptimizationResult } from "@/types/trading";

/**
 * Default strategy parameters for new strategies
 */
export const DEFAULT_STRATEGY_PARAMETERS = {
  period: 14,
  threshold: 70,
  useVolume: true,
  indicator: 'rsi',
  stopLoss: 5,
  takeProfit: 10,
  allowWeekendTrading: false
};

/**
 * Creates a new custom trading strategy
 */
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
    type: type as any,
    timeframe,
    parameters,
    riskLevel: calculateRiskLevel(parameters),
    creator: 'user',
    tags: generateTags(type, parameters)
  };
};

/**
 * Calculate risk level based on strategy parameters
 */
const calculateRiskLevel = (parameters: Record<string, any>): string => {
  const { stopLoss, takeProfit } = parameters;
  
  if (stopLoss >= 5) return 'high';
  if (stopLoss >= 3) return 'medium';
  return 'low';
};

/**
 * Generate relevant tags for the strategy
 */
const generateTags = (type: string, parameters: Record<string, any>): string[] => {
  const tags = [type];
  
  if (parameters.indicator) {
    tags.push(parameters.indicator);
  }
  
  if (parameters.useVolume) {
    tags.push('volume');
  }
  
  return tags;
};

/**
 * Run a backtest of the strategy against historical data
 */
export const runBacktest = async (
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialBalance: number,
  symbol: string
): Promise<BacktestResult> => {
  // In a real app, this would call a backend service to run the backtest
  // For this demo, simulate a backtest with mock results
  await simulateBacktestDelay();
  
  const profit = calculateMockProfit(strategy);
  const profitPercentage = (profit / initialBalance) * 100;
  const winRate = 0.5 + (Math.random() * 0.3); // 50-80% win rate
  const totalTrades = 30 + Math.floor(Math.random() * 50); // 30-80 trades
  const winningTrades = Math.floor(totalTrades * winRate);
  const maxDrawdown = 5 + Math.random() * 10; // 5-15% drawdown
  const sharpeRatio = 0.8 + Math.random() * 1.5; // 0.8-2.3 Sharpe ratio
  const profitFactor = 1 + Math.random() * 2; // 1-3 profit factor
  
  // Generate mock trades
  const trades = generateMockTrades(totalTrades, winRate, startDate, endDate, symbol);
  
  return {
    profit,
    profitPercentage,
    winRate,
    winningTrades,
    totalTrades,
    maxDrawdown,
    sharpeRatio,
    profitFactor,
    trades
  };
};

/**
 * Run optimization to find better strategy parameters
 */
export const optimizeStrategy = async (
  strategy: AITradingStrategy,
  parameterRanges: Array<{ id: string; min: number; max: number; step: number }>,
  target: 'profitFactor' | 'sharpeRatio' | 'profit' | 'drawdown'
): Promise<OptimizationResult> => {
  // In a real app, this would run multiple backtests with different parameters
  // For this demo, simulate an optimization with mock results
  await simulateOptimizationDelay();
  
  const originalParameters = strategy.parameters;
  const optimizedParameters = { ...originalParameters };
  
  // Simulate finding better parameters
  parameterRanges.forEach(param => {
    if (param.id in originalParameters) {
      // Generate a value in the range that's different from the original
      let newValue;
      do {
        const steps = Math.floor((param.max - param.min) / param.step);
        const randomSteps = Math.floor(Math.random() * steps);
        newValue = param.min + (randomSteps * param.step);
      } while (newValue === originalParameters[param.id]);
      
      optimizedParameters[param.id] = newValue;
    }
  });
  
  // Calculate improvement percentage
  const improvement = 5 + Math.random() * 25; // 5-30% improvement
  
  // Simulate performance metrics with the new parameters
  const performance = {
    profit: 15 + Math.random() * 15, // 15-30% profit
    maxDrawdown: 2 + Math.random() * 8, // 2-10% drawdown
    sharpeRatio: 1.2 + Math.random() * 1.5, // 1.2-2.7 Sharpe
    winRate: 0.6 + Math.random() * 0.25 // 60-85% win rate
  };
  
  return {
    parameterValues: optimizedParameters,
    improvement,
    performance
  };
};

/**
 * Helper functions for simulation
 */
const simulateBacktestDelay = (): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
};

const simulateOptimizationDelay = (): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1500));
};

const calculateMockProfit = (strategy: AITradingStrategy): number => {
  // Base profit on strategy type and parameters
  let baseProfitPercentage = 0;
  
  switch (strategy.type) {
    case 'trend-following':
      baseProfitPercentage = 12;
      break;
    case 'mean-reversion':
      baseProfitPercentage = 10;
      break;
    case 'breakout':
      baseProfitPercentage = 15;
      break;
    case 'sentiment':
      baseProfitPercentage = 8;
      break;
    case 'machine-learning':
      baseProfitPercentage = 18;
      break;
    default:
      baseProfitPercentage = 10;
  }
  
  // Add some randomness
  const profitVariation = (Math.random() * 15) - 5; // -5% to +10%
  const finalProfitPercentage = baseProfitPercentage + profitVariation;
  
  return finalProfitPercentage;
};

const generateMockTrades = (
  count: number,
  winRate: number,
  startDate: string,
  endDate: string,
  symbol: string
) => {
  const trades = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeSpan = end.getTime() - start.getTime();
  
  const basePrice = 50000; // Base price for BTC/USD
  
  for (let i = 0; i < count; i++) {
    const isWin = Math.random() < winRate;
    const tradeTime = new Date(start.getTime() + (Math.random() * timeSpan));
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const price = basePrice * (1 + ((Math.random() * 0.2) - 0.1)); // ±10% from base price
    const amount = 0.1 + (Math.random() * 0.4); // 0.1-0.5 BTC
    
    // Profit is positive for winners, negative for losers
    const profitPercentage = isWin 
      ? 1 + (Math.random() * 5) 
      : -1 * (Math.random() * 3);
    
    const profit = (price * amount) * (profitPercentage / 100);
    
    trades.push({
      id: `trade-${i}`,
      date: tradeTime.toISOString().split('T')[0],
      type,
      price,
      amount,
      profit
    });
  }
  
  // Sort by date
  trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return trades;
};
