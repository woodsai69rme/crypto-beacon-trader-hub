import { AITradingStrategy, OptimizationResult, BacktestResult } from '@/types/trading';

// Add the runBacktest function that was missing
export const runBacktest = async (
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialCapital: number,
  asset: string
): Promise<BacktestResult> => {
  // Simulate backtesting process time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate simulated backtest results
  const winRate = 50 + Math.random() * 30; // 50-80% win rate
  const trades = Math.round(20 + Math.random() * 80); // 20-100 trades
  const winningTrades = Math.round(trades * winRate / 100);
  const losingTrades = trades - winningTrades;
  
  const profitPercentage = Math.round(10 + Math.random() * 40); // 10-50% profit
  const profit = initialCapital * (profitPercentage / 100);
  const finalBalance = initialCapital + profit;
  const maxDrawdown = Math.round(5 + Math.random() * 15); // 5-20% drawdown
  
  const averageProfit = profit / winningTrades;
  const averageLoss = (profit * 0.3) / losingTrades; // Simulate some losses
  const profitFactor = (winningTrades * averageProfit) / (losingTrades * averageLoss);
  const sharpeRatio = 1 + Math.random(); // 1-2 Sharpe ratio
  
  // Generate mock trade history
  const trades_history = Array.from({ length: Math.min(trades, 20) }).map((_, i) => {
    const isWin = Math.random() < (winRate / 100);
    const tradeProfit = isWin ? 
      (Math.random() * averageProfit * 1.5) : 
      -(Math.random() * averageLoss * 1.5);
    
    const tradeDate = new Date(
      new Date(startDate).getTime() + 
      (i / Math.min(trades, 20)) * (new Date(endDate).getTime() - new Date(startDate).getTime())
    );
    
    return {
      id: `trade-${i + 1}`,
      timestamp: tradeDate.toISOString(),
      date: tradeDate.toLocaleDateString(),
      type: isWin ? 'buy' : 'sell',
      price: 30000 + (Math.random() * 10000 - 5000),
      amount: (initialCapital * 0.1) / (30000 + (Math.random() * 10000 - 5000)),
      total: initialCapital * 0.1,
      profit: tradeProfit,
      profitPercentage: (tradeProfit / (initialCapital * 0.1)) * 100
    };
  });
  
  return {
    startDate,
    endDate,
    initialBalance: initialCapital,
    finalBalance,
    profit,
    profitPercentage,
    maxDrawdown,
    winRate,
    trades: trades_history,
    sharpeRatio,
    profitFactor,
    averageProfit,
    averageLoss,
    initialCapital,
    finalCapital: finalBalance,
    totalReturn: profitPercentage,
    totalTrades: trades,
    winningTrades,
    losingTrades,
    sortinoRatio: sharpeRatio * 1.1 // Simulated Sortino ratio
  };
};

// Mock parameter optimization function
export const optimizeStrategy = async (
  strategy: AITradingStrategy,
  parameterRanges: Array<{
    id: string;
    min: number;
    max: number;
    step: number;
  }>,
  target: 'profit' | 'profitFactor' | 'sharpeRatio' | 'drawdown' = 'profitFactor'
): Promise<OptimizationResult> => {
  // Simulate optimization processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate optimized parameters based on input ranges
  const parameterValues: Record<string, any> = {};
  
  // For each parameter, generate an "optimized" value
  parameterRanges.forEach(param => {
    // Generate a value between min and max that seems "better" than the original
    const range = param.max - param.min;
    const steps = Math.round(range / param.step);
    
    // Simulate optimization by choosing a value that's ~10-20% "better"
    const originalValue = strategy.parameters[param.id] || 0;
    
    let optimizedValue: number;
    
    switch (target) {
      case 'profit':
        // For profit optimization, increase periods slightly
        optimizedValue = originalValue * (1 + Math.random() * 0.2);
        break;
      case 'drawdown':
        // For drawdown optimization, decrease risk parameters
        optimizedValue = originalValue * (1 - Math.random() * 0.15);
        break;
      case 'sharpeRatio':
        // For Sharpe optimization, find a balance
        optimizedValue = originalValue + (Math.random() < 0.5 ? 1 : -1) * param.step * Math.floor(Math.random() * 5);
        break;
      default:
        // For profit factor, increase thresholds
        optimizedValue = originalValue + param.step * Math.floor(Math.random() * steps / 3);
    }
    
    // Ensure the value stays within the allowed range
    optimizedValue = Math.min(Math.max(optimizedValue, param.min), param.max);
    
    parameterValues[param.id] = optimizedValue;
  });
  
  // Create performance metrics that improve upon the original
  const originalPerformance = strategy.performance || {
    winRate: 60,
    returnRate: 20,
    sharpeRatio: 1.5,
    maxDrawdown: 15
  };
  
  const improvement = Math.round(Math.random() * 10 + 5); // 5-15% improvement
  
  return {
    strategyId: strategy.id,
    parameterValues,
    performance: {
      profit: originalPerformance.returnRate ? originalPerformance.returnRate * (1 + improvement / 100) : 25,
      profitPercentage: improvement,
      maxDrawdown: originalPerformance.maxDrawdown ? originalPerformance.maxDrawdown * (1 - improvement / 200) : 12,
      winRate: originalPerformance.winRate ? Math.min(originalPerformance.winRate * (1 + improvement / 200), 95) : 65,
      sharpeRatio: originalPerformance.sharpeRatio ? originalPerformance.sharpeRatio * (1 + improvement / 100) : 1.8,
      profitFactor: 1.8 * (1 + improvement / 100),
      totalReturn: originalPerformance.returnRate ? originalPerformance.returnRate * (1 + improvement / 100) : 25
    },
    improvement
  };
};

// Generate default strategy parameters based on the strategy type
export const getDefaultParameters = (type: string): Record<string, any> => {
  switch (type) {
    case 'trend-following':
      return {
        period: 14,
        threshold: 70,
        stopLoss: 5,
        takeProfit: 15,
        useVolume: true
      };
    case 'mean-reversion':
      return {
        period: 20,
        upperBand: 2,
        lowerBand: 2,
        stopLoss: 3,
        takeProfit: 6,
        useVolume: false
      };
    case 'breakout':
      return {
        period: 20,
        volatilityThreshold: 2.5,
        confirmationCandles: 2,
        stopLoss: 5,
        takeProfit: 15
      };
    case 'sentiment':
      return {
        lookback: 24,
        sentimentThreshold: 0.65,
        sourcesWeight: {
          twitter: 0.5,
          reddit: 0.3,
          news: 0.2
        },
        stopLoss: 5,
        takeProfit: 12
      };
    default:
      return {
        period: 14,
        threshold: 50,
        stopLoss: 5,
        takeProfit: 10,
        useVolume: true
      };
  }
};

// Create a new custom strategy
export const createCustomStrategy = (
  name: string,
  description: string,
  type: string,
  timeframe: string,
  assets: string[],
  parameters?: Record<string, any>
): AITradingStrategy => {
  const defaultParams = getDefaultParameters(type);
  
  return {
    id: `custom-${Date.now()}`,
    name,
    description,
    type,
    timeframe,
    riskLevel: calculateRiskLevel(type, parameters || defaultParams),
    parameters: parameters || defaultParams,
    assets,
    performance: {
      winRate: 0,
      returnRate: 0,
      sharpeRatio: 0,
      maxDrawdown: 0
    },
    status: 'backtest'
  };
};

// Calculate risk level based on strategy type and parameters
const calculateRiskLevel = (type: string, params: Record<string, any>): 'low' | 'medium' | 'high' => {
  if (type === 'breakout' || params.stopLoss > 8) {
    return 'high';
  }
  
  if (type === 'mean-reversion' || params.stopLoss < 3) {
    return 'low';
  }
  
  return 'medium';
};

// Default strategy parameters for new strategies
export const DEFAULT_STRATEGY_PARAMETERS = {
  trend: {
    period: 14,
    threshold: 70,
    stopLoss: 5,
    takeProfit: 15,
    useVolume: true
  },
  meanReversion: {
    period: 20,
    upperBand: 2,
    lowerBand: 2,
    stopLoss: 3,
    takeProfit: 6,
    useVolume: false
  },
  breakout: {
    period: 20,
    volatilityThreshold: 2.5,
    confirmationCandles: 2,
    stopLoss: 5,
    takeProfit: 15
  },
  sentiment: {
    lookback: 24,
    sentimentThreshold: 0.65,
    stopLoss: 5,
    takeProfit: 12
  }
};
