
import { AITradingStrategy, Trade } from '@/types/trading';

// Available strategies for the AI Trading system
export const AVAILABLE_STRATEGIES: AITradingStrategy[] = [
  {
    id: 'trend-follow-1',
    name: 'Trend Following',
    description: 'Identifies and follows market trends using moving averages',
    type: 'trend-following',
    timeframe: '4h',
    parameters: {
      riskLevel: 'medium',
      strategyType: 'trend',
      backtestResults: {
        winRate: 62.5,
        profitFactor: 1.85,
        sharpeRatio: 1.32,
        drawdown: 12.4,
        returns: 18.7
      }
    },
    tags: ['momentum', 'trend', 'moving-average']
  },
  {
    id: 'mean-rev-1',
    name: 'Mean Reversion',
    description: 'Capitalizes on price returning to average after deviation',
    type: 'mean-reversion',
    timeframe: '1h',
    parameters: {
      riskLevel: 'low',
      strategyType: 'reversion',
      backtestResults: {
        winRate: 68.2,
        profitFactor: 1.53,
        sharpeRatio: 1.12,
        drawdown: 8.6,
        returns: 12.3
      }
    },
    tags: ['reversion', 'oscillator', 'overbought']
  },
  {
    id: 'breakout-1',
    name: 'Breakout Detection',
    description: 'Identifies key levels and trades breakouts with volume confirmation',
    type: 'breakout',
    timeframe: '1d',
    parameters: {
      riskLevel: 'high',
      strategyType: 'breakout',
      backtestResults: {
        winRate: 52.1,
        profitFactor: 2.34,
        sharpeRatio: 1.65,
        drawdown: 18.2,
        returns: 26.7
      }
    },
    tags: ['breakout', 'volume', 'resistance']
  },
  {
    id: 'sentiment-1',
    name: 'News Sentiment',
    description: 'Analyzes news and social media for sentiment-based trading signals',
    type: 'sentiment',
    timeframe: '1d',
    parameters: {
      riskLevel: 'medium',
      strategyType: 'sentiment',
      backtestResults: {
        winRate: 58.9,
        profitFactor: 1.62,
        sharpeRatio: 1.25,
        drawdown: 14.8,
        returns: 16.3
      }
    },
    tags: ['news', 'sentiment', 'nlp']
  }
];

// Mock AI trading functions
export const createTradingBot = async (strategy: AITradingStrategy): Promise<{success: boolean, botId: string}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    botId: `bot-${Date.now()}-${Math.random().toString(36).substring(7)}`
  };
};

export const getStrategyPerformance = async (strategyId: string): Promise<{
  profit: number;
  trades: number;
  winRate: number;
  drawdown: number;
}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    profit: Math.random() * 20 - 5, // -5% to +15%
    trades: Math.floor(Math.random() * 50) + 10,
    winRate: Math.random() * 30 + 50, // 50% to 80%
    drawdown: Math.random() * 15 + 5 // 5% to 20%
  };
};

export const getTrades = async (botId: string): Promise<Trade[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate some mock trades
  const trades: Trade[] = [];
  const coins = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];
  const coinNames = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SOL': 'Solana',
    'ADA': 'Cardano',
    'DOT': 'Polkadot'
  };
  
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < 8; i++) {
    const coinIndex = Math.floor(Math.random() * coins.length);
    const coinSymbol = coins[coinIndex];
    const coinName = coinNames[coinSymbol as keyof typeof coinNames];
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const price = coinSymbol === 'BTC' ? 
      Math.random() * 5000 + 60000 : 
      coinSymbol === 'ETH' ? 
        Math.random() * 500 + 3000 : 
        Math.random() * 50 + 50;
    
    const amount = Math.random() * (coinSymbol === 'BTC' ? 0.1 : 5) + 0.01;
    const totalValue = price * amount;
    
    trades.push({
      id: `trade-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      coinId: coinSymbol.toLowerCase(),
      coinName,
      coinSymbol,
      type,
      amount,
      price,
      totalValue,
      total: totalValue,
      timestamp: new Date(now - Math.random() * 7 * dayInMs).toISOString(),
      currency: 'AUD',
      botGenerated: true,
      strategyId: botId
    });
  }
  
  return trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const runBacktest = async (
  strategyId: string, 
  params: any, 
  days: number = 30
): Promise<{
  returns: number;
  trades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    returns: Math.random() * 25 - 5, // -5% to +20%
    trades: Math.floor(Math.random() * 100) + 20,
    winRate: Math.random() * 30 + 50, // 50% to 80%
    profitFactor: Math.random() * 1 + 1.2, // 1.2 to 2.2
    sharpeRatio: Math.random() * 1.5 + 0.5, // 0.5 to 2.0
    maxDrawdown: Math.random() * 20 + 5 // 5% to 25%
  };
};
