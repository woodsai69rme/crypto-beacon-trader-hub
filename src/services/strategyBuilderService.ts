
import { AITradingStrategy, BacktestResult } from '@/types/trading';

// Default strategy parameters for different strategy types
export const DEFAULT_STRATEGY_PARAMETERS = {
  trend: {
    period: 14,
    threshold: 1.5,
    stopLoss: 2.0,
    takeProfit: 5.0,
    useVolume: true
  },
  meanReversion: {
    period: 20,
    upperBand: 2.0,
    lowerBand: 2.0,
    stopLoss: 2.5,
    takeProfit: 4.0,
    useVolume: true
  },
  breakout: {
    period: 20,
    threshold: 2.0,
    confirmationCandles: 2,
    stopLoss: 3.0,
    takeProfit: 6.0
  },
  sentiment: {
    period: 24,
    threshold: 0.6,
    source: 'combined',
    useVolume: true,
    stopLoss: 3.0,
    takeProfit: 5.0
  }
};

// Function to create a new custom strategy
export const createCustomStrategy = (
  name: string,
  description: string,
  type: string,
  parameters: Record<string, any>,
  assets: string[] = ['BTC', 'ETH']
): AITradingStrategy => {
  return {
    id: `strategy-${Date.now()}`,
    name,
    description,
    type,
    timeframe: '1h',
    parameters,
    assets,
    performance: {
      winRate: 0,
      sharpeRatio: 0,
      returns: 0,
      profitFactor: 0,
      drawdown: 0,
      trades: 0
    },
    status: 'backtest'
  };
};

// Mock function to simulate running a backtest
export const runBacktest = async (
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialBalance: number = 10000,
  asset: string = 'BTC'
): Promise<BacktestResult> => {
  // In a real application, this would make API calls or run simulations
  // For now, we'll return mock data with some randomization
  
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const profit = Math.random() * 2000 - 500; // Random profit between -500 and 1500
  const winRate = 40 + Math.random() * 30; // Win rate between 40% and 70%
  const trades = 50 + Math.floor(Math.random() * 50); // Between 50 and 100 trades
  const winningTrades = Math.floor(trades * (winRate / 100));
  const losingTrades = trades - winningTrades;
  const maxDrawdown = 5 + Math.random() * 15; // Between 5% and 20%
  const sharpeRatio = 0.5 + Math.random() * 2; // Between 0.5 and 2.5
  const profitFactor = 0.8 + Math.random() * 2; // Between 0.8 and 2.8
  
  const finalBalance = initialBalance + profit;
  const profitPercentage = (profit / initialBalance) * 100;
  
  // Generate mock trade history
  const tradeHistory = Array.from({ length: trades }, (_, index) => {
    const isWinning = index < winningTrades;
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const price = 1000 + Math.random() * 1000;
    const amount = 0.1 + Math.random() * 0.9;
    const total = price * amount;
    const profitValue = isWinning 
      ? Math.random() * 200 
      : -Math.random() * 100;
    const profitPercentage = (profitValue / total) * 100;
    
    const date = new Date(
      new Date(startDate).getTime() + 
      (index / trades) * (new Date(endDate).getTime() - new Date(startDate).getTime())
    );
    
    return {
      id: `trade-${Date.now()}-${index}`,
      timestamp: date.toISOString(),
      date: date.toLocaleDateString(),
      type,
      price,
      amount,
      total,
      profit: profitValue,
      profitPercentage
    };
  });
  
  // Sort trades by timestamp
  tradeHistory.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  return {
    startDate,
    endDate,
    initialBalance,
    finalBalance,
    profit,
    profitPercentage,
    maxDrawdown,
    winRate,
    trades: tradeHistory,
    sharpeRatio,
    profitFactor,
    averageProfit: profit / trades,
    averageLoss: -profit / (2 * losingTrades),
    initialCapital: initialBalance,
    finalCapital: finalBalance,
    totalReturn: profitPercentage,
    totalTrades: trades,
    winningTrades,
    losingTrades,
    sortinoRatio: sharpeRatio * 0.8 // Approximation
  };
};

// Mock API for strategy optimization
export const optimizeStrategy = async (
  strategy: AITradingStrategy,
  targetMetric: string = 'profit'
): Promise<{
  parameters: Record<string, any>;
  performance: Record<string, number>;
  improvement: number;
  parameterValues: Record<string, any>;
  strategyId: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate slightly improved parameters
  const optimizedParameters = { ...strategy.parameters };
  
  // Modify a few parameters slightly
  Object.keys(optimizedParameters).forEach(param => {
    if (typeof optimizedParameters[param] === 'number') {
      // Adjust numeric parameters by up to ±20%
      const adjustment = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      optimizedParameters[param] = +(optimizedParameters[param] * adjustment).toFixed(2);
    }
  });
  
  // Generate improvement metrics
  const improvement = 5 + Math.random() * 20; // 5% to 25% improvement
  
  let winRate = strategy.performance?.winRate || 50;
  let sharpeRatio = strategy.performance?.sharpeRatio || 1.0;
  let maxDrawdown = strategy.performance?.drawdown || 15;
  let profitFactor = strategy.performance?.profitFactor || 1.2;
  
  winRate = Math.min(95, winRate * (1 + Math.random() * 0.2));
  sharpeRatio = sharpeRatio * (1 + Math.random() * 0.3);
  maxDrawdown = maxDrawdown * (0.7 + Math.random() * 0.2);
  profitFactor = profitFactor * (1 + Math.random() * 0.3);
  
  return {
    parameters: optimizedParameters,
    performance: {
      profit: 1500 + Math.random() * 1000,
      profitPercentage: 15 + Math.random() * 10,
      winRate,
      sharpeRatio,
      maxDrawdown,
      profitFactor,
      totalReturn: 15 + Math.random() * 10,
    },
    improvement,
    parameterValues: optimizedParameters,
    strategyId: strategy.id
  };
};
