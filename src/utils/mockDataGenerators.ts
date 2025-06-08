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
  const types: ('buy' | 'sell')[] = ['buy', 'sell'];

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
  return [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      performance: [100, 105, 98, 110, 108, 115, 112, 120, 125, 118, 130, 128],
      dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      daily: [100, 105, 98, 110, 108, 115, 112, 120, 125, 118, 130, 128]
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      performance: [100, 108, 95, 125, 120, 135, 128, 145, 140, 138, 155, 150],
      dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      daily: [100, 108, 95, 125, 120, 135, 128, 145, 140, 138, 155, 150]
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOL',
      performance: [100, 110, 88, 145, 135, 165, 155, 180, 170, 175, 200, 185],
      dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      daily: [100, 110, 88, 145, 135, 165, 155, 180, 170, 175, 200, 185]
    },
    {
      id: 'ada',
      name: 'Cardano',
      symbol: 'ADA',
      performance: [100, 95, 92, 105, 100, 108, 102, 115, 110, 108, 120, 118],
      dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      daily: [100, 95, 92, 105, 100, 108, 102, 115, 110, 108, 120, 118]
    },
    {
      id: 'avax',
      name: 'Avalanche',
      symbol: 'AVAX',
      performance: [100, 115, 85, 135, 125, 155, 145, 170, 160, 165, 185, 175],
      dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      daily: [100, 115, 85, 135, 125, 155, 145, 170, 160, 165, 185, 175]
    },
    {
      id: 'dot',
      name: 'Polkadot',
      symbol: 'DOT',
      performance: [100, 102, 88, 118, 112, 125, 120, 135, 130, 128, 145, 140],
      dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      daily: [100, 102, 88, 118, 112, 125, 120, 135, 130, 128, 145, 140]
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
