
import { CoinOption } from '@/types/trading';

// Mock data for crypto prices
const mockCryptoData: CoinOption[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 65000,
    priceChange: 2.5,
    changePercent: 2.5,
    marketCap: 1254000000000,
    volume: 35600000000,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    value: 'bitcoin',
    label: 'Bitcoin (BTC)',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3500,
    priceChange: 3.2,
    changePercent: 3.2,
    marketCap: 421000000000,
    volume: 21500000000,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    value: 'ethereum',
    label: 'Ethereum (ETH)',
  },
  // Add more coins as needed
];

// Fetch top crypto data
export const fetchTopCryptoData = async (limit = 10): Promise<CoinOption[]> => {
  // In a real application, this would be replaced with an API call
  // Example API: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10'
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCryptoData.slice(0, limit));
    }, 500); // Simulate network latency
  });
};

// Fetch data for a specific crypto
export const fetchCryptoData = async (coinId: string): Promise<CoinOption | null> => {
  // In a real application, this would be replaced with an API call
  // Example API: `https://api.coingecko.com/api/v3/coins/${coinId}`
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const coin = mockCryptoData.find(c => c.id === coinId);
      resolve(coin || null);
    }, 300);
  });
};

// Fetch historical price data for a crypto
interface PricePoint {
  timestamp: number;
  price: number;
}

export const fetchCoinHistory = async (
  coinId: string, 
  days = 30
): Promise<PricePoint[]> => {
  // In a real application, this would be replaced with an API call
  // Example API: `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  
  return new Promise((resolve) => {
    // Generate mock historical data
    const now = Date.now();
    const oneDayMs = 86400000;
    const startPrice = coinId === 'bitcoin' ? 60000 : 3200;
    const volatility = coinId === 'bitcoin' ? 2000 : 200;
    
    const pricePoints: PricePoint[] = Array.from({ length: days }).map((_, i) => {
      const timestamp = now - ((days - i) * oneDayMs);
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = startPrice + randomChange;
      
      return {
        timestamp,
        price,
      };
    });
    
    setTimeout(() => {
      resolve(pricePoints);
    }, 500);
  });
};

// Search for coins
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // In a real application, this would be replaced with an API call
  // Example API: `https://api.coingecko.com/api/v3/search?query=${query}`
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockCryptoData.filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 300);
  });
};

// Get market overview stats
export interface MarketOverview {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  activeCryptocurrencies: number;
}

export const getMarketOverview = async (): Promise<MarketOverview> => {
  // In a real application, this would be replaced with an API call
  // Example API: 'https://api.coingecko.com/api/v3/global'
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalMarketCap: 2621000000000,
        totalVolume24h: 98700000000,
        btcDominance: 47.8,
        activeCryptocurrencies: 10825,
      });
    }, 400);
  });
};
