import { CoinOption, TradingAccount, Trade, PortfolioBenchmark } from '@/types/trading';

export const generateMockTradingAccount = (id: string = 'mock-account'): TradingAccount => {
  const initialBalance = 100000;
  const trades: Trade[] = generateMockTrades(10);
  const assets = calculateAssets(trades, initialBalance);

  return {
    id: id,
    name: 'Mock Trading Account',
    trades: trades,
    balance: initialBalance,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    type: 'paper',
    assets: assets,
    initialBalance: initialBalance
  };
};

const calculateAssets = (trades: Trade[], initialBalance: number): any[] => {
  const assetMap: { [coinId: string]: number } = {};

  trades.forEach(trade => {
    if (!trade.coinId) return;

    if (!assetMap[trade.coinId]) {
      assetMap[trade.coinId] = 0;
    }

    assetMap[trade.coinId] += (trade.type === 'buy' ? trade.quantity : -trade.quantity);
  });

  return Object.keys(assetMap).map(coinId => {
    const coin = generateMockCoin(coinId);
    const amount = assetMap[coinId];
    const price = coin.price || 100;
    const value = amount * price;

    return {
      coinId: coinId,
      amount: amount,
      price: price,
      symbol: coin.symbol,
      name: coin.name,
      value: value,
      allocation: value / initialBalance * 100,
      change24h: Math.random() * 10 - 5,
      changePercent24h: Math.random() * 5 - 2.5
    };
  });
};

const generateMockTrades = (count: number = 10): Trade[] => {
  const coins = ['bitcoin', 'ethereum', 'cardano', 'solana'];
  const types = ['buy', 'sell'];

  return Array.from({ length: count }, (_, i) => {
    const coinId = coins[i % coins.length];
    const type = types[i % types.length];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const price = Math.floor(Math.random() * 50000) + 1000;
    const totalValue = quantity * price;

    return {
      id: `trade-${i}`,
      coinId: coinId,
      coinName: coinId.toUpperCase(),
      coinSymbol: coinId.substring(0, 3).toUpperCase(),
      symbol: coinId.substring(0, 3).toUpperCase(),
      type: type,
      quantity: quantity,
      price: price,
      totalValue: totalValue,
      timestamp: new Date().toISOString(),
      currency: 'USD',
      botGenerated: Math.random() > 0.5,
      strategyId: `strategy-${i % 3}`,
      botId: `bot-${i % 2}`,
      tags: ['AI', 'Trend Following']
    };
  });
};

export const generateMockCoin = (coinId: string): CoinOption => {
  const price = Math.floor(Math.random() * 50000) + 1000;
  const change = Math.random() * 10 - 5;
  const volume = Math.floor(Math.random() * 1000000000);
  const marketCap = Math.floor(Math.random() * 1000000000000);

  return {
    id: coinId,
    name: coinId.toUpperCase(),
    symbol: coinId.substring(0, 3).toUpperCase(),
    price: price,
    priceChange: change,
    changePercent: change / 100,
    volume: volume,
    marketCap: marketCap,
    image: '/placeholder.svg',
    value: coinId,
    label: `${coinId.toUpperCase()} (${coinId.substring(0, 3).toUpperCase()})`
  };
};

export const generateMockBenchmarks = (): PortfolioBenchmark[] => {
  const generateData = (baseValue: number, volatility: number) => {
    return Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (365 - i));
      const randomChange = (Math.random() - 0.5) * volatility;
      return baseValue * (1 + randomChange * i / 365);
    });
  };

  const generateDates = () => {
    return Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (365 - i));
      return date.toISOString().split('T')[0];
    });
  };

  return [
    {
      id: 'btc-benchmark',
      name: 'Bitcoin Benchmark',
      symbol: 'BTC',
      description: 'Pure Bitcoin holding strategy',
      type: 'crypto',
      data: generateData(100, 0.05),
      dates: generateDates(),
      currentValue: 156.78,
      performance: {
        daily: 2.34,
        weekly: 8.12,
        monthly: 15.67,
        yearly: 56.78
      }
    },
    {
      id: 'eth-benchmark',
      name: 'Ethereum Benchmark',
      symbol: 'ETH',
      description: 'Pure Ethereum holding strategy',
      type: 'crypto',
      data: generateData(100, 0.06),
      dates: generateDates(),
      currentValue: 134.56,
      performance: {
        daily: 1.23,
        weekly: 5.67,
        monthly: 12.34,
        yearly: 34.56
      }
    },
    {
      id: 'crypto-index',
      name: 'Crypto Market Index',
      symbol: 'CRYPTOIDX',
      description: 'Market cap weighted crypto index',
      type: 'index',
      data: generateData(100, 0.04),
      dates: generateDates(),
      currentValue: 145.23,
      performance: {
        daily: 1.78,
        weekly: 6.45,
        monthly: 13.89,
        yearly: 45.23
      }
    },
    {
      id: 'balanced-60-40',
      name: '60/40 Balanced Portfolio',
      symbol: 'BAL6040',
      description: '60% Crypto, 40% Stablecoins',
      type: 'custom',
      data: generateData(100, 0.03),
      dates: generateDates(),
      currentValue: 112.89,
      performance: {
        daily: 0.89,
        weekly: 3.45,
        monthly: 8.12,
        yearly: 12.89
      }
    },
    {
      id: 'defi-yield',
      name: 'DeFi Yield Strategy',
      symbol: 'DEFIYLD',
      description: 'DeFi yield farming strategy',
      type: 'custom',
      data: generateData(100, 0.07),
      dates: generateDates(),
      currentValue: 189.45,
      performance: {
        daily: 3.21,
        weekly: 12.34,
        monthly: 28.67,
        yearly: 89.45
      }
    },
    {
      id: 'conservative',
      name: 'Conservative Crypto',
      symbol: 'CONSV',
      description: 'Low-risk crypto strategy',
      type: 'custom',
      data: generateData(100, 0.02),
      dates: generateDates(),
      currentValue: 108.23,
      performance: {
        daily: 0.45,
        weekly: 2.12,
        monthly: 5.67,
        yearly: 8.23
      }
    }
  ];
};

export const generateMockPortfolioReturns = (
  startDate: Date,
  endDate: Date,
  initialValue: number = 10000
): { date: string; value: number; dailyReturn: number }[] => {
  const numDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const dailyVolatility = 0.01;
  let currentValue = initialValue;

  return Array.from({ length: numDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dailyReturn = (Math.random() - 0.5) * 2 * dailyVolatility;
    currentValue *= (1 + dailyReturn);

    return {
      date: date.toISOString().split('T')[0],
      value: currentValue,
      dailyReturn: dailyReturn
    };
  });
};
