
import { AITradingStrategy, TradingAccount, CryptoData, CoinOption } from '@/types/trading';

// Mock cryptocurrency data
export const mockCoinData: CoinOption[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 30000,
    priceChange: 1500,
    changePercent: 5.0,
    value: 'bitcoin',
    label: 'Bitcoin (BTC)',
    marketCap: 580000000000,
    volume: 25000000000,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 1800,
    priceChange: -50,
    changePercent: -2.7,
    value: 'ethereum',
    label: 'Ethereum (ETH)',
    marketCap: 220000000000,
    volume: 12000000000,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 45,
    priceChange: 3,
    changePercent: 7.1,
    value: 'solana',
    label: 'Solana (SOL)',
    marketCap: 18000000000,
    volume: 1500000000,
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png'
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.45,
    priceChange: 0.02,
    changePercent: 4.6,
    value: 'cardano',
    label: 'Cardano (ADA)',
    marketCap: 14000000000,
    volume: 500000000,
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png'
  }
];

export const mockAIStrategies: AITradingStrategy[] = [
  {
    id: "ai-strategy-1",
    name: "BTC EMA Crossover",
    description: "Uses exponential moving average crossovers to determine entry and exit points",
    type: "trend-following",
    timeframe: "4h",
    riskLevel: "medium",
    parameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      stopLoss: 2.5,
      takeProfit: 5.0,
      useVolume: true
    },
    assets: ["BTC", "ETH"],
    performance: {
      winRate: 62.5,
      returns: 18.7,
      sharpeRatio: 1.8,
      drawdown: 12.4,
      profitFactor: 1.9,
      trades: 48
    },
    status: "active"
  },
  {
    id: "ai-strategy-2",
    name: "ETH Mean Reversion",
    description: "Identifies overbought and oversold conditions using statistical analysis",
    type: "mean-reversion",
    timeframe: "1d",
    riskLevel: "low",
    parameters: {
      period: 20,
      upperBand: 2.0,
      lowerBand: 2.0,
      stopLoss: 3.0,
      takeProfit: 6.0,
      useVolume: true
    },
    assets: ["ETH"],
    performance: {
      winRate: 72.4,
      returns: 14.2,
      sharpeRatio: 2.1,
      drawdown: 8.5,
      profitFactor: 2.3,
      trades: 29
    },
    status: "active"
  },
  {
    id: "ai-strategy-3",
    name: "Altcoin Sentiment",
    description: "Uses natural language processing to analyze market sentiment on social media",
    type: "sentiment",
    timeframe: "12h",
    riskLevel: "high",
    parameters: {
      sentimentThreshold: 0.65,
      sentimentTimeframe: "24h",
      lookbackPeriod: 3,
      stopLoss: 5.0,
      takeProfit: 12.0
    },
    assets: ["SOL", "ADA", "DOT"],
    performance: {
      winRate: 58.6,
      returns: 31.4,
      sharpeRatio: 1.6,
      drawdown: 22.7,
      profitFactor: 1.7,
      trades: 35
    },
    status: "paused"
  }
];

export const mockTradingAccounts: TradingAccount[] = [
  {
    id: "account-1",
    name: "Main Trading Account",
    type: "spot",
    provider: "Binance",
    balance: 12450.75,
    initialBalance: 10000,
    currency: "USD",
    lastUpdated: new Date().toISOString(),
    isActive: true,
    positions: [
      {
        id: "pos-1",
        coinId: "bitcoin",
        coinName: "Bitcoin",
        coinSymbol: "BTC",
        amount: 0.25,
        entryPrice: 42500,
        currentPrice: 45000,
        value: 11250,
        profitLoss: 625,
        profitLossPercentage: 5.88,
        openedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "pos-2",
        coinId: "ethereum",
        coinName: "Ethereum",
        coinSymbol: "ETH",
        amount: 2.5,
        entryPrice: 2800,
        currentPrice: 3100,
        value: 7750,
        profitLoss: 750,
        profitLossPercentage: 10.71,
        openedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    trades: [],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    performance: {
      daily: 1.2,
      weekly: 3.8,
      monthly: 8.5,
      allTime: 24.5
    }
  }
];
