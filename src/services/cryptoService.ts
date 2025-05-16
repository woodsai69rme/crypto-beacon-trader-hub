import axios from 'axios';
import { CoinOption, PricePoint, SupportedCurrency } from '@/types/trading.d';
import { toast } from "@/components/ui/use-toast";

// Base URLs for different API providers
const API_URLS = {
  coingecko: 'https://api.coingecko.com/api/v3',
  coinlore: 'https://api.coinlore.net/api',
  binance: 'https://api.binance.com/api/v3',
  okx: 'https://www.okx.com/api/v5'
};

// Cache mechanism to avoid hitting API rate limits
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Get API provider from settings or use default
const getApiProvider = (): string => {
  try {
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    return settings?.api?.provider || 'coingecko';
  } catch (error) {
    return 'coingecko';
  }
};

// Get preferred currency from settings or use default
export const getPreferredCurrency = (): SupportedCurrency => {
  try {
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    return settings?.currency?.defaultCurrency || 'AUD';
  } catch (error) {
    return 'AUD';
  }
};

// Function to fetch data with caching
const fetchWithCache = async (url: string, params: any = {}): Promise<any> => {
  const cacheKey = `${url}?${new URLSearchParams(params).toString()}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }
  
  try {
    const response = await axios.get(url, { params });
    const data = response.data;
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error: any) {
    // Fall back to mock data if API fails
    console.error("API Error:", error?.message);
    if (error?.response?.status === 429) {
      toast({
        title: "API Rate Limit Exceeded",
        description: "Falling back to mock data. Please try again later.",
        variant: "destructive"
      });
    }
    throw error;
  }
};

// Fetch data for a specific coin
export const fetchCryptoData = async (coinId: string): Promise<any> => {
  const provider = getApiProvider();
  const currency = getPreferredCurrency().toLowerCase();
  
  try {
    if (provider === 'coingecko') {
      return await fetchWithCache(`${API_URLS.coingecko}/coins/${coinId}`, {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      });
    }
    else if (provider === 'coinlore') {
      const data = await fetchWithCache(`${API_URLS.coinlore}/ticker/`, { id: coinId });
      return data[0];
    }
    else if (provider === 'binance') {
      // Map common coinIds to Binance symbols
      const symbolMap: Record<string, string> = {
        'bitcoin': 'BTCUSDT',
        'ethereum': 'ETHUSDT',
        'cardano': 'ADAUSDT',
        'solana': 'SOLUSDT',
        'ripple': 'XRPUSDT',
      };
      const symbol = symbolMap[coinId] || `${coinId.toUpperCase()}USDT`;
      return await fetchWithCache(`${API_URLS.binance}/ticker/24hr`, { symbol });
    }
    else {
      // Fallback to mock data
      return generateMockCoinData(coinId);
    }
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    // Return mock data as fallback
    return generateMockCoinData(coinId);
  }
};

// Fetch historical price data for a coin
export const fetchHistoricalData = async (coinId: string, days: number | string = 7): Promise<PricePoint[]> => {
  const provider = getApiProvider();
  const currency = getPreferredCurrency().toLowerCase();
  
  try {
    if (provider === 'coingecko') {
      const data = await fetchWithCache(`${API_URLS.coingecko}/coins/${coinId}/market_chart`, {
        vs_currency: currency,
        days: days,
        interval: days > 30 ? 'daily' : undefined
      });
      
      // Transform to PricePoint array
      return data.prices.map((item: [number, number]) => ({
        time: item[0],
        timestamp: item[0],
        price: item[1]
      }));
    }
    else if (provider === 'binance') {
      // Map common coinIds to Binance symbols
      const symbolMap: Record<string, string> = {
        'bitcoin': 'BTCUSDT',
        'ethereum': 'ETHUSDT',
        'cardano': 'ADAUSDT',
        'solana': 'SOLUSDT',
        'ripple': 'XRPUSDT',
      };
      const symbol = symbolMap[coinId] || `${coinId.toUpperCase()}USDT`;
      const interval = days <= 1 ? '15m' : days <= 7 ? '1h' : '1d';
      const limit = 500; // Maximum allowed by Binance API
      
      const data = await fetchWithCache(`${API_URLS.binance}/klines`, {
        symbol,
        interval,
        limit
      });
      
      // Transform Binance kline data to PricePoint array
      return data.map((item: any[]) => ({
        time: item[0], // Open time
        price: parseFloat(item[4]), // Close price
        volume: parseFloat(item[5]) // Volume
      }));
    }
    else {
      // Fallback to mock historical data
      return generateMockHistoricalData(typeof days === 'string' ? parseInt(days) : days);
    }
  } catch (error) {
    console.error("Error fetching coin history:", error);
    // Return mock data as fallback
    return generateMockHistoricalData(typeof days === 'string' ? parseInt(days) : days);
  }
};

// Fetch data for multiple coins at once
export const fetchMultipleCryptoData = async (coinIds: string[] = []): Promise<CoinOption[]> => {
  const provider = getApiProvider();
  const currency = getPreferredCurrency().toLowerCase();
  
  if (!coinIds.length) {
    coinIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot', 'ripple', 'dogecoin'];
  }
  
  try {
    if (provider === 'coingecko') {
      const data = await fetchWithCache(`${API_URLS.coingecko}/coins/markets`, {
        vs_currency: currency,
        ids: coinIds.join(','),
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      });
      
      return convertCoingeckoToCoinOptions(data);
    }
    else if (provider === 'coinlore') {
      // CoinLore uses a different endpoint for multiple coins
      const data = await fetchWithCache(`${API_URLS.coinlore}/tickers/`);
      const filteredData = data.data.filter((coin: any) => 
        coinIds.includes(coin.id) || coinIds.includes(coin.symbol.toLowerCase())
      );
      
      return convertCoinloreToCoinOptions(filteredData);
    }
    else if (provider === 'binance') {
      // Fetch multiple tickers from Binance
      const data = await fetchWithCache(`${API_URLS.binance}/ticker/24hr`);
      
      // Filter and convert data
      const filteredData = data.filter((item: any) => {
        const baseAsset = item.symbol.replace(/USDT$|BUSD$|USDC$/, '').toLowerCase();
        return coinIds.includes(baseAsset);
      });
      
      return convertBinanceToCoinOptions(filteredData);
    }
    else {
      // Fallback to mock data
      return coinIds.map(id => generateMockCoinOption(id));
    }
  } catch (error) {
    console.error("Error fetching multiple crypto data:", error);
    // Return mock data as fallback
    return coinIds.map(id => generateMockCoinOption(id));
  }
};

// Fetch top cryptocurrencies
export const fetchTopCryptoData = async (limit: number = 10): Promise<CoinOption[]> => {
  const provider = getApiProvider();
  const currency = getPreferredCurrency().toLowerCase();
  
  try {
    if (provider === 'coingecko') {
      const data = await fetchWithCache(`${API_URLS.coingecko}/coins/markets`, {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      });
      
      return convertCoingeckoToCoinOptions(data);
    }
    else if (provider === 'coinlore') {
      const data = await fetchWithCache(`${API_URLS.coinlore}/tickers/`, { limit });
      return convertCoinloreToCoinOptions(data.data.slice(0, limit));
    }
    else if (provider === 'binance') {
      // For Binance, we'll get 24hr stats for the top trading pairs
      const data = await fetchWithCache(`${API_URLS.binance}/ticker/24hr`);
      
      // Sort by volume and filter USDT pairs
      const topCoins = data
        .filter((item: any) => item.symbol.endsWith('USDT'))
        .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
        .slice(0, limit);
      
      return convertBinanceToCoinOptions(topCoins);
    }
    else {
      // Fallback to mock data
      return generateMockTopCoins(limit);
    }
  } catch (error) {
    console.error("Error fetching top crypto data:", error);
    // Return mock data as fallback
    return generateMockTopCoins(limit);
  }
};

// Fetch market correlation data
export const fetchMarketCorrelationData = async (coinIds: string[] = []): Promise<number[][]> => {
  // Get historical data for each coin
  try {
    const priceData = await Promise.all(
      coinIds.map(id => fetchCoinHistory(id, 30))
    );
    
    // Extract just the prices
    const prices = priceData.map(data => 
      data.map(point => point.price)
    );
    
    // Calculate correlation matrix
    return calculateCorrelationMatrix(prices);
  } catch (error) {
    console.error("Error calculating correlation matrix:", error);
    // Return mock correlation matrix
    return generateMockCorrelationMatrix(coinIds.length);
  }
};

// Helpers to convert API data to our CoinOption format
const convertCoingeckoToCoinOptions = (data: any[]): CoinOption[] => {
  return data.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price || 0,
    priceChange: coin.price_change_24h || 0,
    changePercent: coin.price_change_percentage_24h || 0,
    image: coin.image,
    volume: coin.total_volume || 0,
    marketCap: coin.market_cap || 0,
    value: coin.id,
    label: `${coin.name} (${coin.symbol.toUpperCase()})`
  }));
};

const convertCoinloreToCoinOptions = (data: any[]): CoinOption[] => {
  return data.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: parseFloat(coin.price_usd) || 0,
    priceChange: 0, // CoinLore doesn't provide this directly
    changePercent: parseFloat(coin.percent_change_24h) || 0,
    image: `https://www.coinlore.com/img/25x25/${coin.nameid}.png`,
    volume: parseFloat(coin.volume24) || 0,
    marketCap: parseFloat(coin.market_cap_usd) || 0,
    value: coin.id,
    label: `${coin.name} (${coin.symbol})`
  }));
};

const convertBinanceToCoinOptions = (data: any[]): CoinOption[] => {
  return data.map(item => {
    const symbol = item.symbol.replace(/USDT$|BUSD$|USDC$/, '');
    return {
      id: symbol.toLowerCase(),
      name: symbol,
      symbol: symbol,
      price: parseFloat(item.lastPrice) || 0,
      priceChange: parseFloat(item.priceChange) || 0,
      changePercent: parseFloat(item.priceChangePercent) || 0,
      image: `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/200`,
      volume: parseFloat(item.volume) || 0,
      marketCap: 0, // Binance doesn't provide market cap
      value: symbol.toLowerCase(),
      label: symbol
    };
  });
};

// Mock data generators for fallbacks
const generateMockCoinData = (coinId: string): any => {
  const name = coinId.charAt(0).toUpperCase() + coinId.slice(1);
  const symbol = coinId.substring(0, 3).toUpperCase();
  
  return {
    id: coinId,
    name,
    symbol,
    market_data: {
      current_price: {
        usd: Math.random() * 50000,
        aud: Math.random() * 70000,
        eur: Math.random() * 45000,
        gbp: Math.random() * 40000,
      },
      price_change_24h: (Math.random() * 1000) - 500,
      price_change_percentage_24h: (Math.random() * 10) - 5,
      market_cap: {
        usd: Math.random() * 1000000000000,
      },
      total_volume: {
        usd: Math.random() * 50000000000,
      },
    },
    image: {
      thumb: `https://cryptoicons.org/api/icon/${coinId}/200`,
      small: `https://cryptoicons.org/api/icon/${coinId}/200`,
      large: `https://cryptoicons.org/api/icon/${coinId}/200`,
    }
  };
};

const generateMockCoinOption = (coinId: string): CoinOption => {
  const name = coinId.charAt(0).toUpperCase() + coinId.slice(1);
  const symbol = coinId.substring(0, 3).toUpperCase();
  const price = Math.random() * (coinId === 'bitcoin' ? 50000 : 5000);
  const priceChange = (Math.random() * 10) - 5;
  
  return {
    id: coinId,
    name,
    symbol,
    price,
    priceChange,
    changePercent: priceChange,
    image: `https://cryptoicons.org/api/icon/${coinId}/200`,
    volume: Math.random() * 50000000000,
    marketCap: Math.random() * 1000000000000,
    value: coinId,
    label: `${name} (${symbol})`
  };
};

const generateMockTopCoins = (limit: number): CoinOption[] => {
  const defaultCoins = [
    'bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano', 
    'ripple', 'polkadot', 'dogecoin', 'avalanche', 'chainlink', 
    'litecoin', 'uniswap', 'polygon', 'stellar', 'cosmos'
  ];
  
  const selectedCoins = defaultCoins.slice(0, limit);
  return selectedCoins.map(generateMockCoinOption);
};

const generateMockHistoricalData = (days: number): PricePoint[] => {
  const now = Date.now();
  const oneDayMs = 86400000;
  const intervalMs = days <= 1 ? 3600000 : oneDayMs; // 1 hour or 1 day
  const points = days <= 1 ? 24 : days;
  const result: PricePoint[] = [];
  
  let currentPrice = 10000 + Math.random() * 40000;
  
  for (let i = points; i >= 0; i--) {
    const timestamp = now - (i * intervalMs);
    const change = (Math.random() * 500) - 250;
    currentPrice = Math.max(100, currentPrice + change);
    
    result.push({
      timestamp,
      price: currentPrice,
      volume: Math.random() * 30000000000,
    });
  }
  
  return result;
};

const generateMockCorrelationMatrix = (size: number): number[][] => {
  const matrix: number[][] = [];
  
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      if (i === j) {
        row.push(1); // Perfect correlation with self
      } else if (matrix[j]?.[i] !== undefined) {
        row.push(matrix[j][i]); // Mirror existing values for symmetry
      } else {
        // Generate random correlation between -1 and 1, but bias toward positive
        row.push((Math.random() * 1.6) - 0.6);
      }
    }
    matrix.push(row);
  }
  
  return matrix;
};

// Calculate the correlation coefficient between two arrays
const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = Math.min(x.length, y.length);
  
  if (n === 0) return 0;
  
  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate correlation
  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }
  
  const denominator = Math.sqrt(xDenominator * yDenominator);
  return denominator === 0 ? 0 : numerator / denominator;
};

// Calculate correlation matrix for multiple arrays
const calculateCorrelationMatrix = (data: number[][]): number[][] => {
  const n = data.length;
  const matrix: number[][] = [];
  
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        row.push(1); // Perfect correlation with self
      } else if (matrix[j]?.[i] !== undefined) {
        row.push(matrix[j][i]); // Mirror existing values for symmetry
      } else {
        row.push(calculateCorrelation(data[i], data[j]));
      }
    }
    matrix.push(row);
  }
  
  return matrix;
};

// Format price with currency symbol
export const formatPrice = (price: number, currency: SupportedCurrency = getPreferredCurrency()): string => {
  const symbols: Record<string, string> = {
    AUD: 'A$',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  
  const symbol = symbols[currency] || currency;
  
  const options: Intl.NumberFormatOptions = {
    maximumFractionDigits: price < 1 ? 6 : price < 100 ? 4 : 2,
    minimumFractionDigits: price < 1 ? 2 : 2
  };
  
  return `${symbol}${price.toLocaleString(undefined, options)}`;
};

// Convert currencies
export const convertCurrency = (amount: number, from: SupportedCurrency, to: SupportedCurrency): number => {
  // Get current exchange rates - in a real app these would be fetched from an API
  const rates: Record<string, Record<string, number>> = {
    USD: { AUD: 1.50, EUR: 0.92, GBP: 0.79, USD: 1 },
    AUD: { USD: 0.67, EUR: 0.61, GBP: 0.53, AUD: 1 },
    EUR: { USD: 1.09, AUD: 1.64, GBP: 0.86, EUR: 1 },
    GBP: { USD: 1.27, AUD: 1.90, EUR: 1.16, GBP: 1 }
  };
  
  return amount * (rates[from]?.[to] || 1);
};

// Fetch coin details
export const fetchCoinDetails = async (coinId: string): Promise<CoinOption> => {
  try {
    const data = await fetchCryptoData(coinId);
    
    // Convert to CoinOption format
    return {
      id: coinId,
      name: data.name || coinId.charAt(0).toUpperCase() + coinId.slice(1),
      symbol: data.symbol?.toUpperCase() || coinId.substring(0, 3).toUpperCase(),
      price: data.market_data?.current_price?.aud || 30000 + Math.random() * 5000,
      image: data.image?.thumb || `https://cryptoicons.org/api/icon/${coinId}/200`,
      value: coinId,
      label: data.name || coinId.charAt(0).toUpperCase() + coinId.slice(1),
    };
  } catch (error) {
    // Return mock data on error
    return {
      id: coinId,
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      symbol: coinId.substring(0, 3).toUpperCase(),
      price: 30000 + Math.random() * 5000,
      image: `https://cryptoicons.org/api/icon/${coinId}/200`,
      value: coinId,
      label: coinId.charAt(0).toUpperCase() + coinId.slice(1),
    };
  }
};

/**
 * Fetch historical price data for a coin for charting
 * This is an alias for fetchHistoricalData to maintain compatibility with components using fetchCoinHistory
 */
export const fetchCoinHistory = async (coinId: string, days: number | string = 7): Promise<PricePoint[]> => {
  return fetchHistoricalData(coinId, days);
};
