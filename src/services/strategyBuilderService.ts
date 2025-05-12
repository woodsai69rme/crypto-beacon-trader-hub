
import { v4 as uuidv4 } from 'uuid';
import { AITradingStrategy, BacktestResult } from '@/types/trading';

// Default parameters for creating a strategy
export const DEFAULT_STRATEGY_PARAMETERS = {
  trend: {
    period: 14,
    threshold: 0.5,
    stopLoss: 2.0,
    takeProfit: 4.0,
    useVolume: true,
  },
  meanReversion: {
    period: 20,
    upperBand: 2.0,
    lowerBand: 2.0,
    stopLoss: 3.0,
    takeProfit: 6.0,
    useVolume: true,
  },
  breakout: {
    period: 20,
    threshold: 1.5,
    stopLoss: 3.0,
    takeProfit: 6.0,
  },
  sentiment: {
    sentimentThreshold: 0.65,
    sentimentTimeframe: 24,
    lookbackPeriod: 3,
    stopLoss: 5.0,
    takeProfit: 10.0,
  },
};

// Create a new custom strategy
export const createCustomStrategy = (name: string, description: string, type: string, parameters: Record<string, any>): AITradingStrategy => {
  return {
    id: uuidv4(),
    name,
    description,
    type,
    timeframe: '4h', // Default timeframe
    riskLevel: 'medium', // Default risk level
    parameters,
    assets: [], // Default empty assets
    status: 'backtest',
  };
};

// Run backtest function that was missing
export const runBacktest = async (
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialCapital: number,
  asset: string
): Promise<BacktestResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock results based on strategy parameters
  const riskFactor = strategy.riskLevel === 'high' ? 2.0 : 
                     strategy.riskLevel === 'medium' ? 1.5 : 1.0;
  
  const profitPercentage = Math.random() * 30 * riskFactor;
  const maxDrawdown = Math.random() * 15 * riskFactor;
  const winRate = 40 + Math.random() * 30;
  const totalTrades = 20 + Math.floor(Math.random() * 50);
  const winningTrades = Math.floor(totalTrades * (winRate / 100));
  const losingTrades = totalTrades - winningTrades;
  
  // Generate mock trade history
  const trades = [];
  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime();
  const timeIncrement = (endTimestamp - startTimestamp) / totalTrades;
  
  let balance = initialCapital;
  let highestBalance = initialCapital;
  
  for (let i = 0; i < totalTrades; i++) {
    const isWinning = i < winningTrades;
    const tradeTimestamp = new Date(startTimestamp + (i * timeIncrement));
    const price = 20000 + (Math.random() * 10000);
    const amount = (balance * 0.1) / price;
    const profitPercent = isWinning ? 
                        (Math.random() * 10) : 
                        -(Math.random() * 5);
    const profit = amount * price * (profitPercent / 100);
    
    // Update balance
    balance += profit;
    highestBalance = Math.max(balance, highestBalance);
    
    trades.push({
      id: uuidv4(),
      timestamp: tradeTimestamp.toISOString(),
      date: tradeTimestamp.toLocaleDateString(),
      type: Math.random() > 0.5 ? 'buy' : 'sell',
      price: price,
      amount: amount,
      total: price * amount,
      profit: profit,
      profitPercentage: profitPercent
    });
  }
  
  const finalBalance = balance;
  const profit = finalBalance - initialCapital;
  const sharpeRatio = (profitPercentage / 100) / (maxDrawdown / 100);
  const profitFactor = winningTrades / (losingTrades || 1);
  
  return {
    startDate,
    endDate,
    initialBalance: initialCapital,
    finalBalance,
    profit,
    profitPercentage,
    maxDrawdown,
    winRate,
    trades,
    sharpeRatio,
    profitFactor,
    averageProfit: profit / totalTrades,
    averageLoss: -maxDrawdown / losingTrades,
    initialCapital,
    finalCapital: finalBalance,
    totalReturn: profitPercentage,
    totalTrades,
    winningTrades,
    losingTrades,
    sortinoRatio: sharpeRatio * 1.2 // Just a mock calculation
  };
};

// Function to optimize strategy parameters
export const optimizeStrategy = async (strategy: AITradingStrategy, selectedMetric: string = "profit") => {
  // Simulate optimization delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create slightly improved parameters
  const optimizedParameters = { ...strategy.parameters };
  
  // Adjust parameters based on strategy type
  if (strategy.type.includes('trend')) {
    optimizedParameters.fastPeriod = Math.max(1, optimizedParameters.fastPeriod - 1);
    optimizedParameters.slowPeriod = optimizedParameters.slowPeriod + 2;
  } else if (strategy.type.includes('mean')) {
    optimizedParameters.period = optimizedParameters.period + 4;
    optimizedParameters.upperBand = optimizedParameters.upperBand * 1.1;
    optimizedParameters.lowerBand = optimizedParameters.lowerBand * 1.1;
  } else if (strategy.type.includes('sentiment')) {
    optimizedParameters.sentimentThreshold = Math.min(0.9, optimizedParameters.sentimentThreshold + 0.05);
  }
  
  // Simulate improved performance
  const improvement = 5 + Math.random() * 15;
  const winRateImprovement = 2 + Math.random() * 8;
  
  // Base performance on original if available
  const basePerformance = strategy.performance || {
    winRate: 50,
    returns: 10,
    sharpeRatio: 1.5,
    drawdown: 15,
    profitFactor: 1.5
  };
  
  return {
    parameters: optimizedParameters,
    parameterValues: optimizedParameters,
    improvement,
    performance: {
      winRate: basePerformance.winRate + winRateImprovement,
      profitPercentage: (basePerformance.returns || 10) * (1 + improvement/100),
      sharpeRatio: (basePerformance.sharpeRatio || 1.5) * 1.2,
      maxDrawdown: (basePerformance.drawdown || 15) * 0.85
    }
  };
};
