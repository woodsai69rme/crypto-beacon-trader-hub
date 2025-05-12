
/**
 * Crypto Service
 * Provides functions for fetching cryptocurrency data from external APIs.
 */

import { CoinOption, CryptoData } from "@/types/trading";
import { toast } from "@/hooks/use-toast";

// Cache data to reduce API calls
const dataCache: { 
  [key: string]: { 
    data: any; 
    timestamp: number; 
    expiry: number; 
  } 
} = {};

// Default cache expiry time in milliseconds (5 minutes)
const DEFAULT_CACHE_EXPIRY = 5 * 60 * 1000;

/**
 * Check if cached data is valid
 */
const isValidCache = (cacheKey: string): boolean => {
  if (!dataCache[cacheKey]) return false;
  return Date.now() < dataCache[cacheKey].timestamp + dataCache[cacheKey].expiry;
};

/**
 * Get data from cache
 */
const getFromCache = (cacheKey: string): any => {
  return dataCache[cacheKey].data;
};

/**
 * Set data in cache
 */
const setInCache = (cacheKey: string, data: any, expiry: number = DEFAULT_CACHE_EXPIRY): void => {
  dataCache[cacheKey] = {
    data,
    timestamp: Date.now(),
    expiry
  };
};

/**
 * Fetch top cryptocurrencies by market cap
 */
export async function fetchTopCryptoData(limit: number = 10, cache: boolean = true): Promise<CoinOption[]> {
  const cacheKey = `top-crypto-${limit}`;
  
  if (cache && isValidCache(cacheKey)) {
    return getFromCache(cacheKey);
  }
  
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    const processedData = convertToCoinOptions(data);
    
    if (cache) {
      setInCache(cacheKey, processedData);
    }
    
    return processedData;
  } catch (error) {
    console.error("Error fetching top crypto data:", error);
    toast({
      title: "Data Fetch Error",
      description: "Failed to fetch cryptocurrency data. Using fallback data.",
      variant: "destructive",
    });
    
    // Return fallback data if API fails
    return generateFallbackData(limit);
  }
}

/**
 * Fetch data for multiple cryptocurrencies by their IDs
 */
export async function fetchMultipleCryptoData(coinIds: string[]): Promise<CryptoData[]> {
  if (!coinIds.length) return [];
  
  const idsString = coinIds.join(',');
  const cacheKey = `multi-crypto-${idsString}`;
  
  if (isValidCache(cacheKey)) {
    return getFromCache(cacheKey);
  }
  
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsString}&order=market_cap_desc&per_page=${coinIds.length}&page=1&sparkline=false`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    const processedData: CryptoData[] = data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      priceChange: coin.price_change_24h || 0,
      changePercent: coin.price_change_percentage_24h || 0,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      image: coin.image
    }));
    
    setInCache(cacheKey, processedData);
    return processedData;
  } catch (error) {
    console.error("Error fetching multiple crypto data:", error);
    toast({
      title: "Data Fetch Error",
      description: "Failed to fetch cryptocurrency data. Using cached or fallback data.",
      variant: "destructive",
    });
    
    // Generate fallback data for the specified coins
    return coinIds.map((id, index) => generateFallbackCoin(id, index));
  }
}

/**
 * Fetch historical data for a cryptocurrency
 */
export async function fetchHistoricalData(
  coinId: string,
  days: number = 30,
  interval: string = 'daily'
): Promise<{ timestamps: number[]; prices: number[] }> {
  const cacheKey = `historical-${coinId}-${days}-${interval}`;
  
  if (isValidCache(cacheKey)) {
    return getFromCache(cacheKey);
  }
  
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    const processedData = {
      timestamps: data.prices.map((item: [number, number]) => item[0]),
      prices: data.prices.map((item: [number, number]) => item[1])
    };
    
    setInCache(cacheKey, processedData);
    return processedData;
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    toast({
      title: "Data Fetch Error",
      description: "Failed to fetch historical price data. Using fallback data.",
      variant: "destructive",
    });
    
    // Return fallback historical data
    return generateFallbackHistoricalData(days);
  }
}

/**
 * Convert raw API data to CoinOption format
 */
export function convertToCoinOptions(data: any[]): CoinOption[] {
  return data.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price || 0,
    priceChange: coin.price_change_24h || 0,
    changePercent: coin.price_change_percentage_24h || 0,
    marketCap: coin.market_cap,
    volume: coin.total_volume,
    image: coin.image,
    value: coin.id,
    label: coin.name
  }));
}

/**
 * Generate fallback data when API fails
 */
function generateFallbackData(count: number): CoinOption[] {
  const fallbackCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 50000, priceChange: 1500, changePercent: 3.0, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3000, priceChange: 100, changePercent: 3.3, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 120, priceChange: 5, changePercent: 4.2, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 1.2, priceChange: 0.05, changePercent: 4.1, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.75, priceChange: 0.02, changePercent: 2.7, image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 22, priceChange: 0.8, changePercent: 3.6, image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', price: 1.8, priceChange: 0.09, changePercent: 5.0, image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png' },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: 85, priceChange: 3.2, changePercent: 3.8, image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', price: 28, priceChange: 1.1, changePercent: 3.9, image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png' },
    { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', price: 18, priceChange: 0.7, changePercent: 3.9, image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png' },
  ];
  
  // Return requested number of coins
  const result = fallbackCoins.slice(0, count).map(coin => ({
    ...coin,
    value: coin.id,
    label: coin.name
  }));
  
  return result;
}

/**
 * Generate fallback data for a specific coin
 */
function generateFallbackCoin(coinId: string, index: number = 0): CryptoData {
  const fallbackCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 50000, priceChange: 1500, changePercent: 3.0, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3000, priceChange: 100, changePercent: 3.3, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 120, priceChange: 5, changePercent: 4.2, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  ];
  
  const fallbackCoin = fallbackCoins.find(coin => coin.id === coinId);
  
  if (fallbackCoin) {
    return { ...fallbackCoin };
  }
  
  // If coin not found in fallback list, generate a random one
  return {
    id: coinId,
    name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
    symbol: coinId.substring(0, 3).toUpperCase(),
    price: 10 + Math.random() * 90,
    priceChange: Math.random() * 10 - 5,
    changePercent: Math.random() * 10 - 5,
    image: undefined
  };
}

/**
 * Generate fallback historical data
 */
function generateFallbackHistoricalData(days: number): { timestamps: number[]; prices: number[] } {
  const timestamps: number[] = [];
  const prices: number[] = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  let price = 100; // Starting price
  
  for (let i = days; i >= 0; i--) {
    timestamps.push(now - i * dayInMs);
    price = price * (1 + (Math.random() * 0.1 - 0.05)); // Random price change ±5%
    prices.push(price);
  }
  
  return { timestamps, prices };
}
