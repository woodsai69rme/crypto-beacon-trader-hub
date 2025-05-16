
import { CoinOption, CryptoData, PricePoint } from '@/types/trading';

export const fetchCryptoData = async (coins: string[]): Promise<CoinOption[]> => {
  // Mock implementation
  return coins.map((coin, index) => ({
    id: coin,
    name: coin.charAt(0).toUpperCase() + coin.slice(1),
    symbol: coin.substring(0, 3).toUpperCase(),
    price: 1000 * (index + 1),
    priceChange: Math.random() * 10 - 5,
    changePercent: Math.random() * 10 - 5,
    image: `https://assets.coingecko.com/coins/images/${index + 1}/small/${coin}.png`,
    value: coin,
    label: `${coin.charAt(0).toUpperCase() + coin.slice(1)} (${coin.substring(0, 3).toUpperCase()})`
  }));
};

export const fetchTopCryptoData = async (limit: number = 10): Promise<CoinOption[]> => {
  // Mock implementation of top cryptocurrencies
  const mockCoins = [
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 61245.32,
      priceChange: 1200,
      changePercent: 2.3,
      marketCap: 1180000000000,
      volume: 28000000000,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      value: "bitcoin",
      label: "Bitcoin (BTC)" 
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 3010.45,
      priceChange: -120,
      changePercent: -1.5,
      marketCap: 360000000000,
      volume: 15000000000,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      value: "ethereum",
      label: "Ethereum (ETH)"
    },
    { 
      id: "solana", 
      name: "Solana", 
      symbol: "SOL", 
      price: 121.33,
      priceChange: 3.56,
      changePercent: 3.1,
      marketCap: 90000000000,
      volume: 5200000000,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      value: "solana",
      label: "Solana (SOL)"
    },
    { 
      id: "cardano", 
      name: "Cardano", 
      symbol: "ADA", 
      price: 0.45,
      priceChange: -0.02,
      changePercent: -2.6,
      marketCap: 24000000000,
      volume: 890000000,
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      value: "cardano",
      label: "Cardano (ADA)"
    },
    { 
      id: "binancecoin", 
      name: "BNB", 
      symbol: "BNB", 
      price: 450,
      priceChange: 12.5,
      changePercent: 1.8,
      marketCap: 70000000000,
      volume: 2200000000,
      image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
      value: "binancecoin",
      label: "BNB (BNB)"
    },
    { 
      id: "ripple", 
      name: "XRP", 
      symbol: "XRP", 
      price: 0.52,
      priceChange: 0.003,
      changePercent: 0.5,
      marketCap: 28000000000,
      volume: 900000000,
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      value: "ripple",
      label: "XRP (XRP)"
    },
    { 
      id: "polkadot", 
      name: "Polkadot", 
      symbol: "DOT", 
      price: 6.50,
      priceChange: -0.05,
      changePercent: -0.8,
      marketCap: 8100000000,
      volume: 300000000,
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      value: "polkadot",
      label: "Polkadot (DOT)"
    },
    { 
      id: "chainlink", 
      name: "Chainlink", 
      symbol: "LINK", 
      price: 15.80,
      priceChange: 0.78,
      changePercent: 5.2,
      marketCap: 9200000000,
      volume: 720000000,
      image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
      value: "chainlink",
      label: "Chainlink (LINK)"
    },
    { 
      id: "litecoin", 
      name: "Litecoin", 
      symbol: "LTC", 
      price: 75.20,
      priceChange: 0.82,
      changePercent: 1.1,
      marketCap: 5500000000,
      volume: 420000000,
      image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
      value: "litecoin",
      label: "Litecoin (LTC)"
    },
    { 
      id: "uniswap", 
      name: "Uniswap", 
      symbol: "UNI", 
      price: 8.90,
      priceChange: 0.29,
      changePercent: 3.4,
      marketCap: 6800000000,
      volume: 310000000,
      image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
      value: "uniswap",
      label: "Uniswap (UNI)"
    },
    { 
      id: "bitcoin-cash", 
      name: "Bitcoin Cash", 
      symbol: "BCH", 
      price: 245,
      priceChange: 5.30,
      changePercent: 2.2,
      marketCap: 4800000000,
      volume: 180000000,
      image: "https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png",
      value: "bitcoin-cash",
      label: "Bitcoin Cash (BCH)"
    },
    { 
      id: "stellar", 
      name: "Stellar", 
      symbol: "XLM", 
      price: 0.11,
      priceChange: -0.002,
      changePercent: -1.8,
      marketCap: 3100000000,
      volume: 98000000,
      image: "https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png",
      value: "stellar",
      label: "Stellar (XLM)"
    },
    { 
      id: "avalanche", 
      name: "Avalanche", 
      symbol: "AVAX", 
      price: 32.80,
      priceChange: 1.20,
      changePercent: 3.8,
      marketCap: 12000000000,
      volume: 540000000,
      image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
      value: "avalanche",
      label: "Avalanche (AVAX)"
    },
    { 
      id: "algorand", 
      name: "Algorand", 
      symbol: "ALGO", 
      price: 0.17,
      priceChange: 0.005,
      changePercent: 3.0,
      marketCap: 1300000000,
      volume: 56000000,
      image: "https://assets.coingecko.com/coins/images/4380/large/download.png",
      value: "algorand",
      label: "Algorand (ALGO)"
    },
    { 
      id: "cosmos", 
      name: "Cosmos", 
      symbol: "ATOM", 
      price: 9.12,
      priceChange: 0.23,
      changePercent: 2.6,
      marketCap: 3500000000,
      volume: 120000000,
      image: "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png",
      value: "cosmos",
      label: "Cosmos (ATOM)"
    }
  ];
  
  return mockCoins.slice(0, limit);
};

// Add the fetchCoinHistory function
export const fetchCoinHistory = async (
  coinId: string,
  days: number,
  currency: string = 'aud'
): Promise<[number, number][]> => {
  // Mock implementation
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const points = 100;
  
  const timeRange = days * dayInMs;
  
  const startPrice = 1000 + Math.random() * 9000;
  const volatility = 0.02;
  
  return Array.from({ length: points }, (_, i) => {
    const timestamp = now - (timeRange * (1 - i / points));
    
    // Simple random walk for price simulation
    const timeFactor = i / points;
    const trendFactor = Math.sin(timeFactor * Math.PI) * 0.5 + 0.5; // Trend goes up and down
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    
    const price = startPrice * (1 + trendFactor * 0.5 + randomFactor);
    
    return [timestamp, price];
  });
};

export const fetchCryptoHistory = async (
  coinId: string,
  timeframe: string,
  currency: string = 'aud'
): Promise<[number, number][]> => {
  // Convert timeframe to days for consistency
  let days: number;
  switch (timeframe) {
    case '24h': days = 1; break;
    case '7d': days = 7; break;
    case '30d': days = 30; break;
    case '90d': days = 90; break;
    case '1y': days = 365; break;
    default: days = 7;
  }
  
  return fetchCoinHistory(coinId, days, currency);
};

export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // Mock implementation
  const mockCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 65000 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3500 },
    { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB', price: 450 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 150 },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45 },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 6.50 },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', price: 15.80 },
    { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', price: 75.20 },
    { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH', price: 245 },
    { id: 'stellar', name: 'Stellar', symbol: 'XLM', price: 0.11 }
  ];
  
  // Filter coins based on query
  const filteredCoins = mockCoins.filter(coin => 
    coin.name.toLowerCase().includes(query.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(query.toLowerCase())
  );
  
  // Transform to CoinOption format
  return filteredCoins.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.price,
    value: coin.id,
    label: `${coin.name} (${coin.symbol})`
  }));
};

export const formatPrice = (price: number, currency: string = 'AUD'): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency
  }).format(price);
};
