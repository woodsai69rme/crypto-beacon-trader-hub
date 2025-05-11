
import { AITradingStrategy, OptimizationResult, BacktestResult } from "@/types/trading";

// Default strategy parameters
export const DEFAULT_STRATEGY_PARAMETERS = {
  period: 14,
  threshold: 70,
  stopLoss: 5,
  takeProfit: 10,
  useVolume: true,
  indicator: 'rsi',
  allowWeekendTrading: false
};

/**
 * Create a custom trading strategy
 * 
 * @param name Strategy name
 * @param description Strategy description
 * @param type Strategy type
 * @param timeframe Strategy timeframe
 * @param parameters Custom parameters
 * @returns New strategy object
 */
export const createCustomStrategy = (
  name: string,
  description: string, 
  type: string, 
  timeframe: string,
  parameters: any
): AITradingStrategy => {
  return {
    id: `strategy-${Date.now()}`,
    name: name || 'Custom Strategy',
    description: description || 'A custom trading strategy',
    type: type as any,
    timeframe: timeframe || '1h',
    parameters: { ...DEFAULT_STRATEGY_PARAMETERS, ...parameters },
    riskLevel: getRiskLevel(parameters),
    performance: simulatePerformance()
  };
};

/**
 * Calculate risk level based on parameters
 * 
 * @param parameters Strategy parameters
 * @returns Risk level designation
 */
const getRiskLevel = (parameters: any): string => {
  const { stopLoss, takeProfit } = parameters;
  
  if (stopLoss <= 2) return 'Very High';
  if (stopLoss <= 5) return 'High';
  if (stopLoss <= 10) return 'Medium';
  return 'Low';
};

/**
 * Generate simulated performance for new strategies
 * 
 * @returns Performance metrics
 */
const simulatePerformance = () => {
  return {
    winRate: 40 + Math.random() * 30,
    profitFactor: 1 + Math.random(),
    sharpeRatio: 0.8 + Math.random() * 1.2,
    trades: Math.floor(50 + Math.random() * 200),
    profitLoss: -5 + Math.random() * 30,
    drawdown: 5 + Math.random() * 20,
    returns: -5 + Math.random() * 45
  };
};

/**
 * Run a backtest for the strategy
 * 
 * @param strategy Strategy configuration
 * @param startDate Start date for backtest
 * @param endDate End date for backtest
 * @param initialCapital Initial capital 
 * @param assetId Asset to backtest on
 * @returns Backtest results
 */
export const runBacktest = async (
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialCapital: number,
  assetId: string
): Promise<BacktestResult> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate realistic backtest results based on strategy parameters
  const winRate = 40 + Math.random() * 35;
  const trades = Math.floor(50 + Math.random() * 200);
  const winningTrades = Math.floor((winRate / 100) * trades);
  const losingTrades = trades - winningTrades;
  const returns = -10 + Math.random() * 50;
  
  // Generate fake trade history
  const tradeHistory = [];
  let currentBalance = initialCapital;
  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime();
  const timeRange = endTimestamp - startTimestamp;
  
  for (let i = 0; i < trades; i++) {
    const isWin = i < winningTrades;
    const tradeTime = new Date(startTimestamp + (timeRange * (i / trades))).toISOString();
    const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
    const price = 10000 + (Math.random() * 5000);
    const amount = 0.01 + (Math.random() * 0.5);
    const profit = isWin ? 
      (50 + Math.random() * 200) : 
      (-200 + Math.random() * 150);
    
    currentBalance += profit;
    
    tradeHistory.push({
      id: `trade-${i}`,
      coinId: assetId,
      coinName: assetId === 'bitcoin' ? 'Bitcoin' : 'Ethereum',
      coinSymbol: assetId === 'bitcoin' ? 'BTC' : 'ETH',
      type: tradeType,
      amount: amount,
      price: price,
      total: price * amount,
      totalValue: price * amount,
      timestamp: tradeTime,
      currency: 'USD' as any,
      profitLoss: profit
    });
  }
  
  // Calculate performance metrics
  const sharpeRatio = 0.8 + Math.random() * 1.2;
  const maxDrawdown = 5 + Math.random() * 15;

  return {
    returns,
    winRate,
    trades,
    sharpeRatio,
    maxDrawdown,
    tradeHistory
  };
};

/**
 * Optimize strategy parameters
 * 
 * @param strategy Strategy to optimize
 * @param parameterRanges Ranges for each parameter to test
 * @param optimizationTarget Metric to optimize for
 * @returns Optimized parameters and performance
 */
export const optimizeStrategy = async (
  strategy: AITradingStrategy,
  parameterRanges: any[],
  optimizationTarget: string
): Promise<OptimizationResult> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Clone the strategy parameters
  const currentParameters = { ...strategy.parameters };
  const optimizedParameters = { ...currentParameters };
  
  // Generate improved parameters within the specified ranges
  parameterRanges.forEach(param => {
    const currentValue = currentParameters[param.id] || 0;
    const range = param.max - param.min;
    
    // Calculate new value - slightly better than current
    let newValue = currentValue;
    
    // Determine if we should increase or decrease the parameter
    // based on optimization target
    if (optimizationTarget === 'profit' || optimizationTarget === 'sharpeRatio') {
      // For profit/sharpe, the optimization is somewhat unpredictable
      newValue = param.min + Math.random() * range;
      
      // Ensure it's different from current and within bounds
      while (Math.abs(newValue - currentValue) < range * 0.1) {
        newValue = param.min + Math.random() * range;
      }
    } else if (optimizationTarget === 'drawdown') {
      // For drawdown minimizing, we generally want tighter stops
      newValue = currentValue * (0.7 + Math.random() * 0.3);
      
      // Ensure within bounds
      newValue = Math.max(param.min, Math.min(param.max, newValue));
    } else {
      // For profitFactor, generic improvement
      newValue = param.min + Math.random() * range;
    }
    
    // Round to match step precision
    const precision = param.step.toString().split('.')[1]?.length || 0;
    newValue = parseFloat(newValue.toFixed(precision));
    
    // Update the parameter in optimized set
    optimizedParameters[param.id] = newValue;
  });
  
  // Calculate improvement percentage
  const improvement = 5 + Math.random() * 25;
  
  // Generate performance metrics that show improvement
  let performance: any = {};
  
  if (optimizationTarget === 'profit') {
    const baseProfit = 10 + Math.random() * 20;
    performance.profit = baseProfit * (1 + improvement/100);
    performance.maxDrawdown = 15 - Math.random() * 5;
    performance.sharpeRatio = 1.2 + Math.random() * 0.5;
    performance.winRate = 0.5 + Math.random() * 0.2;
  } else if (optimizationTarget === 'drawdown') {
    const baseDrawdown = 15 + Math.random() * 10;
    performance.profit = 10 + Math.random() * 15;
    performance.maxDrawdown = baseDrawdown * (1 - improvement/100);
    performance.sharpeRatio = 1.0 + Math.random() * 0.4;
    performance.winRate = 0.45 + Math.random() * 0.2;
  } else if (optimizationTarget === 'sharpeRatio') {
    const baseSharpe = 1.0 + Math.random() * 0.5;
    performance.profit = 12 + Math.random() * 18;
    performance.maxDrawdown = 12 + Math.random() * 6;
    performance.sharpeRatio = baseSharpe * (1 + improvement/100);
    performance.winRate = 0.52 + Math.random() * 0.18;
  } else { // profitFactor
    performance.profit = 15 + Math.random() * 20;
    performance.maxDrawdown = 10 + Math.random() * 5;
    performance.sharpeRatio = 1.3 + Math.random() * 0.6;
    performance.winRate = 0.55 + Math.random() * 0.15;
  }
  
  return {
    parameterValues: optimizedParameters,
    improvement,
    performance
  };
};
