
import { AITradingStrategy, BacktestResult, OptimizationResult } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

// Default strategy parameters
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
 * Create a new trading strategy
 */
export const createCustomStrategy = (
  name: string,
  description: string,
  type: string,
  timeframe: string,
  parameters: Record<string, any>
): AITradingStrategy => {
  // Generate a unique ID
  const id = `strategy-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create the strategy object
  const strategy: AITradingStrategy = {
    id,
    name,
    description,
    type: type as any,
    timeframe,
    parameters,
    indicators: getIndicatorsForStrategy(parameters)
  };
  
  // Save to localStorage for persistence
  try {
    const strategies = JSON.parse(localStorage.getItem('trading-strategies') || '[]');
    localStorage.setItem('trading-strategies', JSON.stringify([...strategies, strategy]));
  } catch (err) {
    console.error('Failed to save strategy to localStorage', err);
  }
  
  return strategy;
};

/**
 * Run a backtest on a strategy
 */
export const runBacktest = async (
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialBalance: number,
  symbol: string
): Promise<BacktestResult> => {
  // In a real app, this would call an API or run a simulation
  // For demo, we'll generate simulated results
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate simulated trades
    const trades = generateSimulatedTrades(strategy, startDate, endDate, symbol);
    
    // Calculate performance metrics
    const profit = calculateProfit(trades);
    const profitPercentage = (profit / initialBalance) * 100;
    const { drawdown, maxDrawdown } = calculateDrawdown(trades, initialBalance);
    const { winningTrades, losingTrades } = countWinningLosingTrades(trades);
    const winRate = winningTrades / (winningTrades + losingTrades);
    const profitFactor = calculateProfitFactor(trades);
    const sharpeRatio = calculateSharpeRatio(trades);
    
    return {
      profit,
      profitPercentage,
      drawdown,
      maxDrawdown,
      winRate,
      winningTrades,
      losingTrades,
      totalTrades: trades.length,
      sharpeRatio,
      profitFactor,
      trades
    };
  } catch (error) {
    console.error('Backtest failed:', error);
    throw new Error('Failed to run backtest');
  }
};

/**
 * Optimize strategy parameters
 */
export const optimizeStrategy = async (
  strategy: AITradingStrategy,
  parameterRanges: { id: string; min: number; max: number; step: number }[],
  optimizationTarget: 'profitFactor' | 'sharpeRatio' | 'profit' | 'drawdown'
): Promise<OptimizationResult> => {
  // In a real app, this would run multiple backtests with different parameters
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate optimized parameters
    const optimizedParams = { ...strategy.parameters };
    
    // Make some improvements to parameters
    parameterRanges.forEach(param => {
      // For demo, we'll just pick a "better" value
      const currentValue = optimizedParams[param.id] || param.min;
      const range = param.max - param.min;
      const change = Math.random() * range * 0.2; // Up to 20% change
      
      // Randomly increase or decrease
      if (Math.random() > 0.5) {
        optimizedParams[param.id] = Math.min(param.max, currentValue + change);
      } else {
        optimizedParams[param.id] = Math.max(param.min, currentValue - change);
      }
      
      // Round to step if needed
      if (param.step) {
        optimizedParams[param.id] = Math.round(optimizedParams[param.id] / param.step) * param.step;
      }
    });
    
    // Generate fake improvement metrics
    const improvement = Math.random() * 15 + 5; // 5-20% improvement
    
    return {
      improvement,
      parameterValues: optimizedParams,
      performance: {
        profit: 12.5,
        maxDrawdown: 7.8,
        sharpeRatio: 1.85,
        winRate: 0.68
      }
    };
  } catch (error) {
    console.error('Optimization failed:', error);
    throw new Error('Failed to optimize strategy');
  }
};

// Helper Functions

const getIndicatorsForStrategy = (parameters: Record<string, any>): string[] => {
  const indicators: string[] = [];
  
  // Add indicators based on strategy parameters
  if (parameters.indicator) {
    indicators.push(parameters.indicator);
  }
  
  if (parameters.useVolume) {
    indicators.push('volume');
  }
  
  // Add some default indicators
  indicators.push('sma');
  
  return indicators;
};

const generateSimulatedTrades = (
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  symbol: string
) => {
  const trades = [];
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const dayMs = 86400000; // Milliseconds in a day
  
  // Determine avg price based on symbol
  let basePrice = 30000; // Default for BTC/USD
  if (symbol.includes('ETH')) basePrice = 2000;
  if (symbol.includes('SOL')) basePrice = 100;
  if (symbol.includes('ADA')) basePrice = 0.5;
  
  // Generate a series of trades
  let currentDate = start;
  let position = null;
  let tradeId = 1;
  
  while (currentDate < end) {
    const date = new Date(currentDate);
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip weekends if the strategy doesn't allow weekend trading
    if (!strategy.parameters.allowWeekendTrading && (date.getDay() === 0 || date.getDay() === 6)) {
      currentDate += dayMs;
      continue;
    }
    
    // Simulate price with some randomness
    const volatility = 0.02; // 2% daily volatility
    const priceChange = basePrice * (Math.random() * volatility * 2 - volatility);
    basePrice += priceChange;
    
    // Decide whether to make a trade
    const tradeChance = Math.random();
    
    if (position === null && tradeChance > 0.7) {
      // Open position
      position = {
        entryPrice: basePrice,
        amount: 1,
        entryDate: dateStr
      };
      
      trades.push({
        id: `trade-${tradeId++}`,
        date: dateStr,
        type: 'buy',
        price: basePrice,
        amount: 1,
        profit: 0
      });
    } else if (position !== null && tradeChance > 0.8) {
      // Close position
      const profit = (basePrice - position.entryPrice) * position.amount;
      
      trades.push({
        id: `trade-${tradeId++}`,
        date: dateStr,
        type: 'sell',
        price: basePrice,
        amount: position.amount,
        profit
      });
      
      position = null;
    }
    
    currentDate += dayMs;
  }
  
  return trades;
};

const calculateProfit = (trades: any[]): number => {
  return trades.reduce((total, trade) => total + (trade.profit || 0), 0);
};

const calculateDrawdown = (trades: any[], initialBalance: number): { drawdown: number; maxDrawdown: number } => {
  let balance = initialBalance;
  let peak = initialBalance;
  let maxDrawdown = 0;
  
  trades.forEach(trade => {
    balance += (trade.profit || 0);
    
    if (balance > peak) {
      peak = balance;
    }
    
    const drawdown = ((peak - balance) / peak) * 100;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  });
  
  return {
    drawdown: ((peak - balance) / peak) * 100,
    maxDrawdown
  };
};

const countWinningLosingTrades = (trades: any[]): { winningTrades: number; losingTrades: number } => {
  let winning = 0;
  let losing = 0;
  
  trades.forEach(trade => {
    if (trade.type === 'sell') {
      if (trade.profit > 0) winning++;
      else if (trade.profit < 0) losing++;
    }
  });
  
  return { winningTrades: winning, losingTrades: losing };
};

const calculateProfitFactor = (trades: any[]): number => {
  let grossProfit = 0;
  let grossLoss = 0;
  
  trades.forEach(trade => {
    if (trade.profit > 0) grossProfit += trade.profit;
    else if (trade.profit < 0) grossLoss += Math.abs(trade.profit);
  });
  
  return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
};

const calculateSharpeRatio = (trades: any[]): number => {
  // Simplified Sharpe Ratio calculation for demo
  if (trades.length === 0) return 0;
  
  const returns = trades
    .filter(t => t.type === 'sell')
    .map(t => t.profit);
  
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  
  if (avgReturn === 0) return 0;
  
  const stdDev = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  );
  
  return stdDev === 0 ? 0 : avgReturn / stdDev;
};
