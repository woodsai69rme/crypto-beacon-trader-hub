
import { AITradingStrategy, BacktestResult, OptimizationResult } from '@/types/trading';
import { generateId } from '@/lib/utils';

// Mock optimization parameters
const OPTIMIZATION_PARAMETERS = {
  period: { min: 5, max: 30, step: 1 },
  threshold: { min: 20, max: 80, step: 5 },
  stopLoss: { min: 1, max: 10, step: 0.5 },
  takeProfit: { min: 2, max: 20, step: 1 },
  fastPeriod: { min: 5, max: 20, step: 1 },
  slowPeriod: { min: 10, max: 40, step: 2 },
  riskFactor: { min: 0.5, max: 3, step: 0.25 }
};

/**
 * Runs a backtest for the given trading strategy
 * @param strategy Trading strategy configuration
 * @returns Backtest result with performance metrics
 */
export const backtestStrategy = (strategy: AITradingStrategy): BacktestResult => {
  // This is a mock implementation
  // In a real app, this would run a complex backtest against historical data
  
  // Create somewhat realistic backtest results based on strategy type
  const isRsi = strategy.parameters.indicator === 'rsi';
  const isMacd = strategy.parameters.indicator === 'macd';
  const isBollinger = strategy.parameters.indicator === 'bb';
  
  // Generate random performance metrics with some bias based on strategy type
  const baseProfitability = Math.random() * 10 + (isRsi ? 5 : isMacd ? 7 : 3);
  const baseWinRate = Math.random() * 10 + (isRsi ? 50 : isMacd ? 45 : 55);
  const baseDrawdown = Math.random() * 5 + (isRsi ? 10 : isMacd ? 15 : 12);
  
  // Adjust metrics based on parameters
  const adjustedProfit = baseProfitability * (strategy.parameters.riskFactor || 1);
  const adjustedWinRate = Math.min(95, baseWinRate + (strategy.parameters.period || 0) / 10);
  const adjustedDrawdown = baseDrawdown * (strategy.parameters.riskFactor || 1);
  
  // Generate random number of trades
  const tradeCount = Math.floor(Math.random() * 100) + 50;
  
  // Generate trade history
  const tradeHistory = generateMockTradeHistory(tradeCount, adjustedWinRate / 100);
  
  return {
    returns: adjustedProfit,
    winRate: adjustedWinRate,
    trades: tradeCount,
    maxDrawdown: adjustedDrawdown,
    sharpeRatio: (adjustedProfit - 3) / (adjustedDrawdown / 100),
    profitFactor: adjustedProfit / (adjustedDrawdown / 3),
    tradeHistory
  };
};

/**
 * Optimizes the given trading strategy parameters
 * @param strategy Base trading strategy
 * @param parameters Parameters to optimize
 * @param iterations Number of optimization iterations
 * @returns Array of optimization results
 */
export const optimizeStrategyParameters = (
  strategy: AITradingStrategy, 
  parameters: string[] = ['period', 'threshold', 'stopLoss', 'takeProfit'],
  iterations: number = 20
): OptimizationResult[] => {
  // In a real app, this would run multiple backtests with different parameters
  // and return the best performing combinations
  
  const results: OptimizationResult[] = [];
  
  // Generate multiple parameter combinations
  for (let i = 0; i < iterations; i++) {
    // Create a copy of the strategy with modified parameters
    const modifiedParameters = { ...strategy.parameters };
    
    // Modify selected parameters
    parameters.forEach(param => {
      if (param in OPTIMIZATION_PARAMETERS) {
        const range = OPTIMIZATION_PARAMETERS[param as keyof typeof OPTIMIZATION_PARAMETERS];
        const randomValue = Math.floor(Math.random() * 
          ((range.max - range.min) / range.step + 1)) * range.step + range.min;
        modifiedParameters[param] = randomValue;
      }
    });
    
    // Run a backtest with the modified parameters
    const backtest = backtestStrategy({
      ...strategy,
      parameters: modifiedParameters
    });
    
    // Add result to results array
    results.push({
      id: generateId(),
      strategyId: strategy.id,
      parameters: modifiedParameters,
      performance: {
        returns: backtest.returns,
        winRate: backtest.winRate,
        profitFactor: backtest.profitFactor || 1.5,
        sharpeRatio: backtest.sharpeRatio || 1.2,
        maxDrawdown: backtest.maxDrawdown
      },
      trades: backtest.trades,
      timeframe: strategy.timeframe,
      optimizationDate: new Date().toISOString()
    });
  }
  
  // Sort by returns descending
  return results.sort((a, b) => b.performance.returns - a.performance.returns);
};

/**
 * Generates mock trade history data
 */
function generateMockTradeHistory(count: number, winRate: number) {
  const trades = [];
  let cumProfit = 0;
  
  const symbols = ['BTC', 'ETH', 'SOL', 'BNB', 'ADA'];
  const names = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SOL': 'Solana',
    'BNB': 'Binance Coin',
    'ADA': 'Cardano'
  };
  const ids = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'BNB': 'binancecoin',
    'ADA': 'cardano'
  };
  
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const isWin = Math.random() < winRate;
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const price = symbol === 'BTC' ? 50000 + Math.random() * 10000 : 
                 symbol === 'ETH' ? 3000 + Math.random() * 1000 :
                 symbol === 'SOL' ? 100 + Math.random() * 50 :
                 symbol === 'BNB' ? 500 + Math.random() * 100 :
                 10 + Math.random() * 5;
    
    const amount = (Math.random() * 5 + 0.1).toFixed(4);
    const profit = isWin ? Math.random() * 500 + 50 : -(Math.random() * 300 + 20);
    cumProfit += profit;
    
    // Calculate date backward from now
    const date = new Date(now);
    date.setDate(now.getDate() - (count - i) / 5);
    
    trades.push({
      id: `trade-${i + 1}`,
      timestamp: date.toISOString(),
      date: date.toLocaleDateString(),
      type: isWin ? 'buy' : 'sell',
      price: Math.round(price * 100) / 100,
      amount: parseFloat(amount),
      total: Math.round(price * parseFloat(amount) * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      profitPercentage: Math.round((profit / (price * parseFloat(amount))) * 10000) / 100,
      coin: symbol,
      coinId: ids[symbol as keyof typeof ids],
      coinName: names[symbol as keyof typeof names],
      coinSymbol: symbol.toLowerCase(),
      currency: 'USD',
      totalValue: Math.round(price * parseFloat(amount) * 100) / 100 // Adding the missing property
    });
  }
  
  return trades;
}
