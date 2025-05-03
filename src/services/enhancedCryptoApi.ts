
import axios from 'axios';
import { CoinOption, CryptoData, CryptoChartData } from '../types/trading';

const CACHE_EXPIRY = 60 * 1000; // 1 minute
let coinCache: { data: CoinOption[], timestamp: number } | null = null;
let searchResultsCache: Record<string, { data: CoinOption[], timestamp: number }> = {};

// Clear the API cache (useful for testing or force refresh)
export const clearApiCache = () => {
  coinCache = null;
  searchResultsCache = {};
};

// Mock data for top coins
const topCoins: CoinOption[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    price: 65423.52,
    priceChange: 2.34,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    price: 3421.18,
    priceChange: 1.56,
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    price: 562.37,
    priceChange: -0.82,
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    price: 143.21,
    priceChange: 3.67,
  },
  {
    id: 'xrp',
    symbol: 'xrp',
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    price: 0.5724,
    priceChange: -1.34,
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    price: 0.4352,
    priceChange: 0.78,
  },
  {
    id: 'avalanche-2',
    symbol: 'avax',
    name: 'Avalanche',
    image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
    price: 35.42,
    priceChange: 4.21,
  },
  {
    id: 'polkadot',
    symbol: 'dot',
    name: 'Polkadot',
    image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    price: 6.84,
    priceChange: -0.56,
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    price: 0.1375,
    priceChange: 2.11,
  },
  {
    id: 'shiba-inu',
    symbol: 'shib',
    name: 'Shiba Inu',
    image: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
    price: 0.00002015,
    priceChange: 1.98,
  },
];

// Get trending coins
export const getTrendingCoins = async (): Promise<CoinOption[]> => {
  if (coinCache && Date.now() - coinCache.timestamp < CACHE_EXPIRY) {
    return coinCache.data;
  }

  try {
    // In a real app, fetch from API:
    // const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    //   params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 10, page: 1 }
    // });
    // const data = response.data.map(coin => ({
    //   id: coin.id,
    //   symbol: coin.symbol,
    //   name: coin.name,
    //   image: coin.image,
    //   price: coin.current_price,
    //   priceChange: coin.price_change_percentage_24h,
    // }));

    // Using mock data for demo:
    const data = [...topCoins];
    
    // Add random variation to prices to simulate market movement
    data.forEach(coin => {
      const variation = (Math.random() * 2 - 1) * 0.5; // -0.5% to +0.5%
      coin.price = coin.price * (1 + variation / 100);
      coin.priceChange = coin.priceChange + variation;
    });

    coinCache = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return [];
  }
};

// Search for coins
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  if (query.length < 2) return [];

  const cacheKey = query.toLowerCase();
  if (
    searchResultsCache[cacheKey] &&
    Date.now() - searchResultsCache[cacheKey].timestamp < CACHE_EXPIRY
  ) {
    return searchResultsCache[cacheKey].data;
  }

  try {
    // In a real app, fetch from API:
    // const response = await axios.get(`https://api.coingecko.com/api/v3/search`, {
    //   params: { query }
    // });
    
    // Using mock data for demo:
    const filteredCoins = topCoins.filter(coin => 
      coin.name.toLowerCase().includes(cacheKey) || 
      coin.symbol.toLowerCase().includes(cacheKey)
    );
    
    const data = filteredCoins.map(coin => ({
      ...coin,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`
    }));

    searchResultsCache[cacheKey] = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    console.error('Error searching for coins:', error);
    return [];
  }
};

// Get coin details by ID
export const getCoinDetails = async (coinId: string): Promise<CryptoData | null> => {
  try {
    // In a real app, fetch from API:
    // const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    
    // Using mock data for demo:
    const coin = topCoins.find(c => c.id === coinId);
    
    if (!coin) return null;
    
    return {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      price: coin.price,
      current_price: coin.price,
      priceChange: coin.priceChange || 0,
      price_change_24h: coin.priceChange || 0,
      changePercent: coin.priceChange || 0,
      price_change_percentage_24h: coin.priceChange || 0,
      market_cap: coin.price * 19000000, // Mock market cap
      market_cap_rank: topCoins.findIndex(c => c.id === coinId) + 1,
      volume_24h: coin.price * 5000000, // Mock volume
      total_volume: coin.price * 5000000,
      circulating_supply: 19000000,
      rank: topCoins.findIndex(c => c.id === coinId) + 1
    };
  } catch (error) {
    console.error(`Error fetching details for coin ${coinId}:`, error);
    return null;
  }
};

// Get mock chart data for coins
export const fetchCoinChartData = async (
  coinId: string, 
  days: number = 7
): Promise<CryptoChartData> => {
  try {
    // In a real app, we would fetch from an API:
    // const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
    //   params: { vs_currency: 'usd', days }
    // });
    // return response.data;
    
    // Generate mock chart data
    const prices: [number, number][] = [];
    const market_caps: [number, number][] = [];
    const total_volumes: [number, number][] = [];
    
    // Find the coin in our mock data to get a base price
    const coin = topCoins.find(c => c.id === coinId);
    const basePrice = coin ? coin.price : 10000 + Math.random() * 50000;
    const baseVolume = basePrice * 10000;
    const baseCap = basePrice * 19000000;
    
    // Generate data points - one per day
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    for (let i = days; i >= 0; i--) {
      const timestamp = now - (i * oneDayMs);
      
      // Create some volatility
      const volatility = 0.03; // 3% daily volatility
      const dayChange = (Math.random() * 2 - 1) * volatility;
      
      const price = basePrice * (1 + dayChange * (days - i) / days);
      const volume = baseVolume * (0.8 + Math.random() * 0.4);
      const cap = baseCap * (1 + dayChange * (days - i) / days);
      
      prices.push([timestamp, price]);
      total_volumes.push([timestamp, volume]);
      market_caps.push([timestamp, cap]);
    }
    
    return { prices, market_caps, total_volumes };
  } catch (error) {
    console.error(`Error fetching chart data for ${coinId}:`, error);
    return { prices: [] };
  }
};

// Get mock news data
export const getLatestNews = async () => {
  const mockNews = [
    {
      id: '1',
      title: 'Bitcoin Surges Past $65,000 as ETF Demand Continues',
      source: 'CryptoNews',
      timestamp: '2 hours ago',
      url: '#'
    },
    {
      id: '2',
      title: 'Ethereum Layer 2 Solutions See Record Growth in Q1 2025',
      source: 'BlockchainDaily',
      timestamp: '4 hours ago',
      url: '#'
    },
    {
      id: '3',
      title: 'Central Banks Accelerate CBDC Development Amid Private Crypto Growth',
      source: 'FinancialTimes',
      timestamp: '6 hours ago',
      url: '#'
    },
    {
      id: '4',
      title: 'New Regulations Proposed for DeFi Platforms by SEC',
      source: 'CoinDesk',
      timestamp: '10 hours ago',
      url: '#'
    },
    {
      id: '5',
      title: 'Solana NFT Market Reaches New All-Time High in Trading Volume',
      source: 'NFTInsider',
      timestamp: '12 hours ago',
      url: '#'
    },
    {
      id: '6',
      title: 'Major Bank Announces Crypto Custody Services for Institutional Clients',
      source: 'WallStreetJournal',
      timestamp: '18 hours ago',
      url: '#'
    }
  ];
  
  return mockNews;
};
