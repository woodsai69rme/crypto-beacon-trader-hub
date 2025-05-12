
import { AITradingStrategy, TradingAccount } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

// Mock trading strategies
export const mockTradingStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-1',
    name: 'Trend Follower',
    description: 'A strategy that identifies and follows medium-term trends using moving averages.',
    type: 'trend-following',
    timeframe: '1h',
    riskLevel: 'medium',
    parameters: {
      period: 14,
      threshold: 70,
      stopLoss: 5,
      takeProfit: 10,
      useVolume: true,
      indicator: 'RSI'
    },
    assets: ['bitcoin', 'ethereum', 'solana', 'cardano']
  },
  {
    id: 'strategy-2',
    name: 'Mean Reversion',
    description: 'Captures short-term price reversals when assets move too far from their average.',
    type: 'mean-reversion',
    timeframe: '15m',
    riskLevel: 'high',
    parameters: {
      period: 20,
      upperBand: 75,
      lowerBand: 25,
      stopLoss: 3,
      takeProfit: 6,
      useVolume: false,
      indicator: 'Bollinger'
    },
    assets: ['bitcoin', 'ethereum', 'polkadot']
  },
  {
    id: 'strategy-3',
    name: 'MACD Crossover',
    description: 'Detects trend changes using the MACD indicator crossovers.',
    type: 'macd',
    timeframe: '4h',
    riskLevel: 'medium',
    parameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      stopLoss: 7,
      takeProfit: 14,
      useVolume: true
    },
    assets: ['bitcoin', 'ethereum', 'litecoin', 'ripple']
  }
];

// Mock trading accounts
export const mockTradingAccounts: TradingAccount[] = [
  {
    id: 'account-1',
    name: 'Main Trading Account',
    balance: 10000,
    initialBalance: 10000,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    positions: [
      {
        id: 'position-1',
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        coinSymbol: 'BTC',
        amount: 0.05,
        entryPrice: 29500,
        currentPrice: 30000,
        value: 1500,
        profitLoss: 25,
        profitLossPercentage: 1.69,
        openedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      },
      {
        id: 'position-2',
        coinId: 'ethereum',
        coinName: 'Ethereum',
        coinSymbol: 'ETH',
        amount: 1,
        entryPrice: 1900,
        currentPrice: 1800,
        value: 1800,
        profitLoss: -100,
        profitLossPercentage: -5.26,
        openedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      }
    ],
    trades: generateMockTrades(15),
    performance: {
      daily: 1.2,
      weekly: -0.8,
      monthly: 4.5,
      allTime: 7.3
    }
  },
  {
    id: 'account-2',
    name: 'Conservative Portfolio',
    balance: 25000,
    initialBalance: 20000,
    currency: 'USD',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    positions: [
      {
        id: 'position-3',
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        coinSymbol: 'BTC',
        amount: 0.2,
        entryPrice: 25000,
        currentPrice: 30000,
        value: 6000,
        profitLoss: 1000,
        profitLossPercentage: 20,
        openedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'position-4',
        coinId: 'cardano',
        coinName: 'Cardano',
        coinSymbol: 'ADA',
        amount: 5000,
        entryPrice: 0.4,
        currentPrice: 0.45,
        value: 2250,
        profitLoss: 250,
        profitLossPercentage: 12.5,
        openedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    trades: generateMockTrades(8),
    performance: {
      daily: 0.5,
      weekly: 2.3,
      monthly: 8.2,
      allTime: 25
    }
  }
];

// Helper function to generate mock trades
function generateMockTrades(count: number) {
  const trades = [];
  const coins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' }
  ];
  
  for (let i = 0; i < count; i++) {
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const coin = coins[Math.floor(Math.random() * coins.length)];
    const price = coin.id === 'bitcoin' ? 
      28000 + Math.random() * 4000 :
      coin.id === 'ethereum' ?
      1700 + Math.random() * 200 :
      coin.id === 'solana' ?
      40 + Math.random() * 10 :
      coin.id === 'cardano' ?
      0.4 + Math.random() * 0.1 :
      5 + Math.random();
    
    const amount = coin.id === 'bitcoin' ? 
      0.01 + Math.random() * 0.1 :
      coin.id === 'ethereum' ?
      0.1 + Math.random() * 2 :
      coin.id === 'solana' ?
      1 + Math.random() * 10 :
      coin.id === 'cardano' ?
      100 + Math.random() * 1000 :
      1 + Math.random() * 10;
      
    const total = price * amount;
    const profit = type === 'sell' ? (Math.random() * 2 - 0.5) * total * 0.1 : 0;
    const profitPercentage = profit / total * 100;
    
    // Create timestamp between 1 and 30 days ago
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30) - 1);
    
    trades.push({
      id: uuidv4(),
      timestamp: timestamp.toISOString(),
      date: timestamp.toLocaleDateString(),
      type,
      price,
      amount,
      total,
      profit,
      profitPercentage,
      coin: coin.id,
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      currency: 'USD',
      totalValue: total + profit
    });
  }
  
  // Sort by timestamp, newest first
  return trades.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Export strategy utilities
export default {
  mockTradingStrategies,
  mockTradingAccounts,
  
  // Generate a new strategy
  createStrategy(
    name: string,
    description: string,
    type: string,
    timeframe: string,
    parameters: Record<string, any> = {},
    assets: string[] = ['bitcoin', 'ethereum']
  ): AITradingStrategy {
    return {
      id: uuidv4(),
      name,
      description,
      type,
      timeframe,
      parameters: {
        period: 14,
        threshold: 70,
        stopLoss: 5,
        takeProfit: 10,
        ...parameters
      },
      assets
    };
  },
  
  // Get risk level based on parameters
  calculateRiskLevel(strategy: AITradingStrategy): string {
    const { stopLoss, takeProfit, riskFactor } = strategy.parameters;
    
    if (!stopLoss || stopLoss > 10) {
      return 'high';
    }
    
    if (riskFactor && riskFactor > 2) {
      return 'high';
    }
    
    if (stopLoss < 3) {
      return 'low';
    }
    
    return 'medium';
  }
};
