
import { CoinOption, PricePoint } from '@/types/trading';

// Mock data for coin options
const mockCoins: CoinOption[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 58352.12,
    priceChange: 1245.32,
    changePercent: 2.18,
    marketCap: 1143349097968,
    volume: 48941516789,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    value: 'bitcoin',
    label: 'Bitcoin (BTC)'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3105.78,
    priceChange: 65.43,
    changePercent: 2.15,
    marketCap: 373952067386,
    volume: 21891456789,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    value: 'ethereum',
    label: 'Ethereum (ETH)'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 128.45,
    priceChange: 3.28,
    changePercent: 2.62,
    marketCap: 59873245678,
    volume: 4897234567,
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    value: 'solana',
    label: 'Solana (SOL)'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.45,
    priceChange: 0.01,
    changePercent: 2.27,
    marketCap: 19873245678,
    volume: 987234567,
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    value: 'cardano',
    label: 'Cardano (ADA)'
  },
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    price: 587.32,
    priceChange: 12.43,
    changePercent: 2.16,
    marketCap: 90873245678,
    volume: 2897234567,
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    value: 'binancecoin',
    label: 'BNB (BNB)'
  }
];

// Function to fetch coin data
export const fetchCoinData = async (limit = 10): Promise<CoinOption[]> => {
  // In a real implementation, this would call an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCoins.slice(0, limit));
    }, 500);
  });
};

// Add the missing fetchTopCryptoData function (alias to fetchCoinData for compatibility)
export const fetchTopCryptoData = fetchCoinData;

// Simulated price history data for coins
export const fetchCoinHistory = async (
  coinId: string, 
  days: number = 30
): Promise<PricePoint[]> => {
  // Generate mock historical data
  const pricePoints: PricePoint[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const coin = mockCoins.find(c => c.id === coinId);
  const currentPrice = coin?.price || 50000;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * dayMs);
    const volatility = 0.02; // 2% daily volatility
    const randomChange = (Math.random() - 0.5) * volatility;
    const price = currentPrice * (1 + randomChange * i);
    
    pricePoints.push({
      timestamp,
      price,
      volume: Math.random() * 10000000000,
      date: new Date(timestamp).toISOString(),
      time: timestamp,
    });
  }
  
  return pricePoints;
};

// Create alias for backward compatibility
export const fetchCoinPriceHistory = fetchCoinHistory;

// Add formatPrice utility function
export const formatPrice = (price?: number): string => {
  if (price === undefined) return '$0.00';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Add fetchCryptoHistory function for RealTimePriceChart.tsx
export const fetchCryptoHistory = async (
  coinId: string,
  timeframe: string = '7d',
  currency: string = 'aud'
): Promise<[number, number][]> => {
  // Convert timeframe to days
  let days = 7;
  switch (timeframe) {
    case '24h': days = 1; break;
    case '7d': days = 7; break;
    case '30d': days = 30; break;
    case '90d': days = 90; break;
    case '1y': days = 365; break;
    default: days = parseInt(timeframe) || 7;
  }

  const pricePoints = await fetchCoinHistory(coinId, days);
  
  // Transform to the format expected by RealTimePriceChart
  return pricePoints.map(point => [point.timestamp, point.price]);
};

