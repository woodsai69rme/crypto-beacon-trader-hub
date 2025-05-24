
import { CoinOption, NewsItem } from '@/types/trading';

// Mock trending coins data
const mockTrendingCoins: CoinOption[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 58352.12,
    priceChange: 1245.32,
    changePercent: 2.18,
    volume: 48941516789,
    marketCap: 1143349097968,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    value: 'bitcoin',
    label: 'Bitcoin (BTC)'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3105.78,
    priceChange: 65.43,
    changePercent: 2.15,
    volume: 21891456789,
    marketCap: 373952067386,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    value: 'ethereum',
    label: 'Ethereum (ETH)'
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'Binance Coin',
    price: 604.12,
    priceChange: 12.45,
    changePercent: 2.10,
    volume: 1862354123,
    marketCap: 93518794521,
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    value: 'binancecoin',
    label: 'Binance Coin (BNB)'
  }
];

// Mock news data
const mockNewsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Bitcoin reaches new all-time high',
    summary: 'Bitcoin surpasses previous records amid institutional adoption.',
    url: 'https://example.com/news/1',
    source: 'CryptoNews',
    publishedAt: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    sentiment: 'positive',
    relevance: 0.95,
    categories: ['market', 'bitcoin'],
    coins: ['bitcoin']
  },
  {
    id: '2',
    title: 'Ethereum 2.0 staking rewards increase',
    summary: 'New staking mechanisms provide higher yields for ETH holders.',
    url: 'https://example.com/news/2',
    source: 'EthereumDaily',
    publishedAt: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    sentiment: 'positive',
    relevance: 0.88,
    categories: ['ethereum', 'staking'],
    coins: ['ethereum']
  }
];

export async function getTrendingCoins(): Promise<CoinOption[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTrendingCoins;
}

export async function getLatestNews(): Promise<NewsItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockNewsItems;
}

export async function searchCoins(query: string): Promise<CoinOption[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Filter mock data based on query
  return mockTrendingCoins.filter(coin => 
    coin.name.toLowerCase().includes(query.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getCoinData(coinId: string): Promise<CoinOption | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockTrendingCoins.find(coin => coin.id === coinId) || null;
}
