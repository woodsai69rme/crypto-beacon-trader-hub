
import { AITradingStrategy, BacktestResult } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

// Default strategy parameters
export const DEFAULT_STRATEGY_PARAMETERS = {
  period: 14,
  threshold: 70,
  stopLoss: 5,
  takeProfit: 10,
  useVolume: false,
  allowWeekendTrading: false
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
    id: `strategy-${uuidv4()}`,
    name,
    description,
    type,
    timeframe,
    parameters,
    assets: ['bitcoin', 'ethereum'],
    status: 'active'
  };
};

// Run a backtest for a strategy
export const runBacktest = async (
  strategy: AITradingStrategy,
  startDate: string,
  endDate: string,
  initialCapital: number,
  asset: string
): Promise<BacktestResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock backtest result
  const winRate = Math.floor(Math.random() * 30) + 50; // 50-80%
  const trades = Math.floor(Math.random() * 150) + 50; // 50-200 trades
  const returns = (Math.random() * 40) + 10; // 10-50% returns
  const maxDrawdown = (Math.random() * 15) + 5; // 5-20% drawdown
  const profitFactor = 1 + (Math.random() * 1.5); // 1.0-2.5 profit factor
  const sharpeRatio = 1 + (Math.random() * 2); // 1.0-3.0 sharpe ratio
  
  // Generate mock trade history
  const tradeHistory = [];
  const priceStart = asset === 'bitcoin' ? 50000 : 2000;
  let currentPrice = priceStart;
  let date = new Date(startDate);
  
  for (let i = 0; i < Math.min(trades, 100); i++) {
    // Add random days to date
    date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 1);
    
    // Random price movement
    currentPrice = currentPrice * (1 + ((Math.random() * 0.05) - 0.025));
    
    // Decide trade type
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    
    // Random trade amount
    const amount = Math.random() * (asset === 'bitcoin' ? 0.5 : 10);
    
    // Random profit/loss
    const profit = (Math.random() * 200) - 50;
    const profitPercentage = profit / (currentPrice * amount) * 100;
    
    tradeHistory.push({
      id: `trade-${i}`,
      timestamp: date.toISOString(),
      date: date.toLocaleDateString(),
      type,
      price: currentPrice,
      amount,
      total: currentPrice * amount,
      profit,
      profitPercentage,
      coin: asset,
      coinId: asset,
      coinName: asset === 'bitcoin' ? 'Bitcoin' : 'Ethereum',
      coinSymbol: asset === 'bitcoin' ? 'BTC' : 'ETH',
      currency: 'USD',
      totalValue: currentPrice * amount
    });
  }
  
  return {
    returns,
    winRate,
    trades,
    maxDrawdown,
    sharpeRatio,
    profitFactor,
    tradeHistory,
    profit: initialCapital * (returns / 100),
    profitPercentage: returns,
    finalBalance: initialCapital * (1 + returns / 100),
    totalTrades: trades
  };
};
