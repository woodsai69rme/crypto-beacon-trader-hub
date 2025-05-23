
import { CoinOption, CryptoData } from '@/types/trading';

// Sample data for development purposes
const sampleCoins: CoinOption[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 65423.45, priceChange: 1245.67, changePercent: 1.94, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', value: 'bitcoin', label: 'Bitcoin (BTC)' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3480.12, priceChange: -45.23, changePercent: -1.28, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', value: 'ethereum', label: 'Ethereum (ETH)' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 608.78, priceChange: 12.44, changePercent: 2.09, image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', value: 'binancecoin', label: 'BNB (BNB)' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 143.56, priceChange: 5.67, changePercent: 4.12, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', value: 'solana', label: 'Solana (SOL)' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.458, priceChange: 0.012, changePercent: 2.69, image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png', value: 'cardano', label: 'Cardano (ADA)' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.572, priceChange: -0.018, changePercent: -3.05, image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png', value: 'ripple', label: 'XRP (XRP)' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 6.82, priceChange: 0.23, changePercent: 3.49, image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png', value: 'polkadot', label: 'Polkadot (DOT)' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: 0.142, priceChange: 0.008, changePercent: 5.97, image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png', value: 'dogecoin', label: 'Dogecoin (DOGE)' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', price: 35.67, priceChange: 1.54, changePercent: 4.51, image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png', value: 'avalanche-2', label: 'Avalanche (AVAX)' },
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB', price: 0.00001824, priceChange: 0.00000052, changePercent: 2.94, image: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png', value: 'shiba-inu', label: 'Shiba Inu (SHIB)' },
];

// Function to fetch top cryptocurrency data
export const fetchTopCryptoData = async (
  limit: number = 10
): Promise<CoinOption[]> => {
  try {
    // In a production environment, this would fetch from a real API
    // For now, return sample data
    console.log(`Fetching top ${limit} cryptocurrencies`);
    return sampleCoins.slice(0, limit);
  } catch (error) {
    console.error('Error fetching top crypto data:', error);
    return [];
  }
};

// Function to fetch data for a specific cryptocurrency
export const fetchCryptoData = async (
  coinId: string
): Promise<CoinOption | null> => {
  try {
    // In a production environment, this would fetch from a real API
    // For now, return sample data
    console.log(`Fetching data for ${coinId}`);
    const coin = sampleCoins.find((c) => c.id === coinId);
    return coin || null;
  } catch (error) {
    console.error(`Error fetching data for ${coinId}:`, error);
    return null;
  }
};

// Function to fetch data for multiple cryptocurrencies
export const fetchMultipleCryptoData = async (
  coinIds: string[]
): Promise<CoinOption[]> => {
  try {
    // In a production environment, this would fetch from a real API
    // For now, filter from sample data
    console.log(`Fetching data for multiple coins: ${coinIds.join(', ')}`);
    const coins = sampleCoins.filter((c) => coinIds.includes(c.id));
    return coins;
  } catch (error) {
    console.error('Error fetching multiple crypto data:', error);
    return [];
  }
};

// Function to fetch historical price data
export const fetchHistoricalPrices = async (
  coinId: string,
  days: number = 30
): Promise<{ prices: [number, number][]; timestamps: string[] }> => {
  try {
    // In a production environment, this would fetch from a real API
    // For now, generate mock data
    console.log(`Fetching ${days} days of historical data for ${coinId}`);
    
    const now = Date.now();
    const oneDayMs = 86400000; // 24 hours in milliseconds
    const prices: [number, number][] = [];
    const timestamps: string[] = [];
    
    // Generate some price data with a starting point based on coin id
    const basePrice = sampleCoins.find(c => c.id === coinId)?.price || 100;
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const timestamp = now - i * oneDayMs;
      const change = (Math.random() - 0.5) * 0.05; // Random price change between -2.5% and +2.5%
      currentPrice = currentPrice * (1 + change);
      prices.push([timestamp, currentPrice]);
      timestamps.push(new Date(timestamp).toISOString());
    }
    
    return { prices, timestamps };
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    return { prices: [], timestamps: [] };
  }
};

// Enhanced API for real-time market data
export const enhancedCryptoApi = {
  getTopCoins: async (limit: number = 10): Promise<CoinOption[]> => {
    return fetchTopCryptoData(limit);
  },
  
  getCoinDetails: async (coinId: string): Promise<CryptoData | null> => {
    const coin = await fetchCryptoData(coinId);
    return coin as CryptoData;
  },
  
  getMultipleCoins: async (coinIds: string[]): Promise<CoinOption[]> => {
    return fetchMultipleCryptoData(coinIds);
  },
  
  getHistoricalData: async (
    coinId: string, 
    days: number = 30
  ): Promise<{ prices: [number, number][]; timestamps: string[] }> => {
    return fetchHistoricalPrices(coinId, days);
  },
  
  getMarketStats: async (): Promise<{
    marketCap: number;
    volume24h: number;
    btcDominance: number;
    activeCryptos: number;
  }> => {
    // Mock market stats
    return {
      marketCap: 2.45e12, // $2.45 trillion
      volume24h: 98.7e9,  // $98.7 billion
      btcDominance: 52.8, // 52.8%
      activeCryptos: 10892
    };
  }
};

// Export default for compatibility
export default {
  fetchTopCryptoData,
  fetchCryptoData,
  fetchMultipleCryptoData,
  fetchHistoricalPrices,
  enhancedCryptoApi
};
