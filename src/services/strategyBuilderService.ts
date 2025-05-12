
import { AITradingStrategy, BacktestResult, OptimizationResult } from '@/types/trading';
import { generateId } from '@/lib/utils';
import { DEFAULT_STRATEGY_PARAMETERS } from '@/utils/aiTradingStrategies';

/**
 * Create a custom trading strategy
 */
export function createCustomStrategy(
  name: string,
  description: string,
  type: string,
  timeframe: string,
  parameters: any
): AITradingStrategy {
  return {
    id: `strategy-${generateId()}`,
    name,
    description,
    type: type as any,
    timeframe,
    parameters,
    riskLevel: calculateRiskLevel(parameters),
    indicators: getIndicatorsFromParameters(parameters)
  };
}

/**
 * Calculate the risk level of a strategy based on its parameters
 */
function calculateRiskLevel(parameters: any): string {
  let riskScore = 0;
  
  // Factor in stop loss - smaller stop loss means higher risk
  if (parameters.stopLoss <= 2) riskScore += 3;
  else if (parameters.stopLoss <= 5) riskScore += 2;
  else if (parameters.stopLoss <= 10) riskScore += 1;
  
  // Factor in take profit - higher take profit can mean higher risk
  if (parameters.takeProfit >= 20) riskScore += 2;
  else if (parameters.takeProfit >= 10) riskScore += 1;
  
  // Consider indicator choice
  if (parameters.indicator === 'bb') riskScore += 1;
  
  // Map score to risk level
  if (riskScore >= 4) return 'High';
  if (riskScore >= 2) return 'Medium';
  return 'Low';
}

/**
 * Get the indicators used in a strategy based on its parameters
 */
function getIndicatorsFromParameters(parameters: any): string[] {
  const indicators: string[] = [];
  
  if (parameters.indicator) {
    indicators.push(parameters.indicator);
  }
  
  if (parameters.useVolume) {
    indicators.push('volume');
  }
  
  // Add additional indicators based on parameters
  if (parameters.fastPeriod && parameters.slowPeriod) {
    indicators.push('ma');
  }
  
  return indicators.length > 0 ? indicators : ['rsi'];
}

/**
 * Run a backtest for a trading strategy
 */
export async function runBacktest(
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialCapital: number,
  coinId: string
): Promise<BacktestResult> {
  // This would normally call an API but we'll simulate it for now
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock backtest results
      const profitFactor = Math.random() * 0.4 + 1.2;
      const winRate = Math.random() * 0.3 + 0.5;
      const trades = Math.floor(Math.random() * 50) + 50;
      const winningTrades = Math.floor(trades * winRate);
      const losingTrades = trades - winningTrades;
      const returns = Math.random() * 40 - 10;
      const maxDrawdown = Math.random() * 15 + 5;
      
      // Generate mock trade history
      const tradeHistory = Array(10).fill(0).map((_, i) => ({
        id: `trade-${i}`,
        timestamp: new Date(Date.now() - (i * 86400000)).toISOString(),
        date: new Date(Date.now() - (i * 86400000)).toLocaleDateString(),
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        price: 10000 + Math.random() * 10000,
        amount: Math.random() * 2,
        total: Math.random() * 10000,
        profit: Math.random() * 1000 - 200,
        profitPercentage: Math.random() * 20 - 5,
        coin: coinId,
        coinId: coinId,
        coinName: 'Bitcoin',
        coinSymbol: 'BTC',
        currency: 'USD'
      }));
      
      resolve({
        startDate,
        endDate,
        initialBalance: initialCapital,
        finalBalance: initialCapital * (1 + returns / 100),
        profit: returns > 0 ? returns * initialCapital / 100 : 0,
        profitPercentage: returns,
        maxDrawdown,
        winRate: winRate * 100,
        trades,
        tradeHistory,
        sharpeRatio: Math.random() * 2 + 0.5,
        profitFactor,
        averageProfit: Math.random() * 500 + 200,
        averageLoss: Math.random() * 300 + 100,
        initialCapital,
        finalCapital: initialCapital * (1 + returns / 100),
        totalReturn: returns,
        totalTrades: trades,
        winningTrades,
        losingTrades,
        sortinoRatio: Math.random() * 2 + 0.3,
        returns
      });
    }, 1000);
  });
}

/**
 * Optimize strategy parameters to improve performance
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
  // This would normally call an API but we'll simulate it for now
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock optimization results
      const parameterValues: Record<string, any> = {};
      
      // Generate optimized parameters within the specified ranges
      parameterRanges.forEach(param => {
        const range = param.max - param.min;
        // Generate a value within the range but slightly different from current
        const optimizedValue = param.min + Math.random() * range;
        parameterValues[param.id] = parseFloat(optimizedValue.toFixed(2));
      });
      
      // Mock performance improvement
      const improvement = Math.random() * 25 + 5;
      
      resolve({
        strategyId: strategy.id,
        parameterValues,
        performance: {
          profit: Math.random() * 50 + 10,
          profitPercentage: Math.random() * 50 + 10,
          maxDrawdown: Math.random() * 15 + 3,
          winRate: Math.random() * 0.3 + 0.6,
          sharpeRatio: Math.random() * 1.5 + 1,
          profitFactor: Math.random() * 1 + 1.5,
          totalReturn: Math.random() * 50 + 10
        },
        improvement
      });
    }, 1500);
  });
}

// Export default strategy parameters
export { DEFAULT_STRATEGY_PARAMETERS };
