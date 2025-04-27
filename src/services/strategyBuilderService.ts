
import { AITradingStrategy, StrategyParameter, BacktestResult, OptimizationResult } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

// Default strategy parameters 
export const DEFAULT_STRATEGY_PARAMETERS: StrategyParameter[] = [
  {
    id: "period",
    name: "Period",
    description: "Number of candles to consider",
    type: "number",
    value: 14,
    min: 1,
    max: 100,
    step: 1
  },
  {
    id: "threshold",
    name: "Threshold",
    description: "Signal threshold",
    type: "number",
    value: 70,
    min: 0,
    max: 100,
    step: 1
  },
  {
    id: "useVolume",
    name: "Use Volume",
    description: "Consider volume in calculations",
    type: "boolean",
    value: true
  },
  {
    id: "indicator",
    name: "Indicator",
    description: "Technical indicator to use",
    type: "select",
    value: "rsi",
    options: ["rsi", "macd", "bollinger", "sma", "ema"]
  }
];

/**
 * Create a new custom trading strategy
 */
export function createCustomStrategy(
  name: string, 
  description: string, 
  type: string,
  timeframe: string,
  parameters: Record<string, any>
): AITradingStrategy {
  const strategy: AITradingStrategy = {
    id: `strategy-${Date.now()}`,
    name,
    description,
    type,
    timeframe,
    parameters
  };
  
  // In a real app, we'd save this to the backend
  // For now, just show a toast
  toast({
    title: "Strategy Created",
    description: `Successfully created ${name} strategy`
  });
  
  return strategy;
}

/**
 * Run a backtest simulation for a strategy
 */
export async function runBacktest(
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialBalance: number,
  symbol: string
): Promise<BacktestResult> {
  // Simulate backtest delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate random backtest results
  const winRate = 0.4 + Math.random() * 0.4;
  const profit = initialBalance * (Math.random() * 0.5);
  const finalBalance = initialBalance + profit;
  const profitPercentage = (profit / initialBalance) * 100;
  const maxDrawdown = 5 + Math.random() * 15;
  
  // Generate some mock trades
  const numTrades = 10 + Math.floor(Math.random() * 20);
  const trades = [];
  
  let currentDate = new Date(startDate);
  const endDateTime = new Date(endDate);
  
  for (let i = 0; i < numTrades && currentDate < endDateTime; i++) {
    // Move date forward
    currentDate = new Date(currentDate.getTime() + Math.random() * 86400000 * 5);
    if (currentDate > endDateTime) break;
    
    const price = 100 + Math.random() * 900;
    const amount = 0.1 + Math.random() * 0.9;
    const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
    const tradeProfit = Math.random() > 0.7 ? (Math.random() * 200) : -(Math.random() * 100);
    
    trades.push({
      id: `backtest-${i}`,
      timestamp: currentDate.toISOString(),
      date: currentDate.toLocaleDateString(),
      type: tradeType,
      price,
      amount,
      total: price * amount,
      profit: tradeProfit,
      profitPercentage: (tradeProfit / (price * amount)) * 100
    });
  }
  
  return {
    startDate,
    endDate,
    initialBalance,
    finalBalance,
    profit,
    profitPercentage,
    maxDrawdown,
    winRate,
    trades,
    sharpeRatio: 1 + Math.random(),
    profitFactor: 1.2 + Math.random() * 0.8,
    averageProfit: profit / numTrades,
    averageLoss: (profit / numTrades) * 0.5,
    initialCapital: initialBalance,
    finalCapital: finalBalance,
    totalReturn: profitPercentage,
    totalTrades: numTrades,
    winningTrades: Math.floor(numTrades * winRate),
    losingTrades: Math.floor(numTrades * (1 - winRate)),
    sortinoRatio: 1 + Math.random() * 0.5
  };
}

/**
 * Optimize a strategy's parameters
 */
export async function optimizeStrategy(
  strategy: AITradingStrategy,
  parameterRanges: Array<{
    id: string;
    min: number;
    max: number;
    step: number;
  }>,
  optimizationTarget: 'profitFactor' | 'sharpeRatio' | 'profit' | 'drawdown'
): Promise<OptimizationResult> {
  // Simulate optimization delay
  await new Promise(resolve => setTimeout(resolve, 3500));
  
  // Create a modified set of parameters that are supposedly optimized
  const optimizedParams = { ...strategy.parameters };
  
  parameterRanges.forEach(range => {
    if (typeof optimizedParams[range.id] === 'number') {
      // Randomly pick a "better" value within the range
      optimizedParams[range.id] = 
        range.min + Math.floor(Math.random() * ((range.max - range.min) / range.step)) * range.step;
    }
  });
  
  // Generate improvement metrics
  const improvementFactor = 1 + Math.random() * 0.5; // 1-1.5x improvement
  
  return {
    strategyId: strategy.id,
    parameterValues: optimizedParams,
    performance: {
      profit: 25 + Math.random() * 15,
      profitPercentage: 25 + Math.random() * 15,
      maxDrawdown: 8 + Math.random() * 7,
      winRate: 0.6 + Math.random() * 0.2,
      sharpeRatio: 1.5 + Math.random() * 0.5,
      profitFactor: 1.8 + Math.random() * 0.7,
      totalReturn: 25 + Math.random() * 15
    },
    improvement: (improvementFactor - 1) * 100 // Convert to percentage improvement
  };
}
