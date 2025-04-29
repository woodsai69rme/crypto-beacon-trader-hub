
import { toast } from "@/components/ui/use-toast";
import apiCache from "./cacheService";

// Mock API key storage
let apiKey: string | null = null;

export const setCryptoCompareApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('cryptoCompareApiKey', key);
  toast({
    title: "API Key Updated",
    description: "Your CryptoCompare API key has been updated successfully.",
  });
  return true;
};

export const getCryptoCompareApiKey = (): string | null => {
  if (!apiKey) {
    apiKey = localStorage.getItem('cryptoCompareApiKey');
  }
  return apiKey;
};

export const fetchMultipleSymbolPrices = async (symbols: string[], currency: string = 'USD') => {
  try {
    const symbolsStr = symbols.join(',');
    const cacheKey = `crypto-compare-multi-${symbolsStr}-${currency}`;
    const cachedData = apiCache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    const key = getCryptoCompareApiKey();
    const headers: HeadersInit = {};
    
    if (key) {
      headers['authorization'] = `Apikey ${key}`;
    }
    
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbolsStr}&tsyms=${currency}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch prices from CryptoCompare');
    }
    
    const data = await response.json();
    
    // Cache for 1 minute
    apiCache.set(cacheKey, data, 60 * 1000);
    
    return data;
  } catch (error) {
    console.error("Error fetching from CryptoCompare:", error);
    toast({
      title: "API Error",
      description: "Could not fetch data from CryptoCompare API.",
      variant: "destructive",
    });
    
    // Return a mock response
    return {
      RAW: symbols.reduce((acc, symbol) => {
        acc[symbol] = {
          USD: {
            PRICE: symbol === 'BTC' ? 45000 + Math.random() * 1000 : 
                  symbol === 'ETH' ? 2500 + Math.random() * 100 : 
                  100 + Math.random() * 50,
            CHANGE24HOUR: (Math.random() * 1000) - 500,
            CHANGEPCT24HOUR: (Math.random() * 10) - 5,
            VOLUME24HOUR: symbol === 'BTC' ? 30000000000 + Math.random() * 1000000000 : 
                        symbol === 'ETH' ? 20000000000 + Math.random() * 1000000000 : 
                        1000000000 + Math.random() * 100000000,
            MKTCAP: symbol === 'BTC' ? 800000000000 + Math.random() * 20000000000 : 
                  symbol === 'ETH' ? 300000000000 + Math.random() * 10000000000 : 
                  10000000000 + Math.random() * 1000000000
          }
        };
        return acc;
      }, {})
    };
  }
};

export const fetchHistoricalData = async (symbol: string, timeframe: string = 'day', limit: number = 30) => {
  try {
    const cacheKey = `crypto-compare-history-${symbol}-${timeframe}-${limit}`;
    const cachedData = apiCache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    const key = getCryptoCompareApiKey();
    const headers: HeadersInit = {};
    
    if (key) {
      headers['authorization'] = `Apikey ${key}`;
    }
    
    let endpoint = '';
    switch (timeframe) {
      case 'minute':
        endpoint = 'histominute';
        break;
      case 'hour':
        endpoint = 'histohour';
        break;
      default:
        endpoint = 'histoday';
    }
    
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/${endpoint}?fsym=${symbol}&tsym=USD&limit=${limit}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch historical data from CryptoCompare');
    }
    
    const data = await response.json();
    
    // Cache based on timeframe
    let cacheTTL = 60 * 1000; // 1 minute default
    
    if (timeframe === 'hour') {
      cacheTTL = 5 * 60 * 1000; // 5 minutes
    } else if (timeframe === 'day') {
      cacheTTL = 60 * 60 * 1000; // 1 hour
    }
    
    apiCache.set(cacheKey, data, cacheTTL);
    
    return data;
  } catch (error) {
    console.error("Error fetching historical data from CryptoCompare:", error);
    toast({
      title: "API Error",
      description: "Could not fetch historical data.",
      variant: "destructive",
    });
    
    // Return mock data
    const mockData = {
      Data: Array(limit).fill(0).map((_, i) => ({
        time: Math.floor(Date.now() / 1000) - (i * (timeframe === 'minute' ? 60 : timeframe === 'hour' ? 3600 : 86400)),
        close: symbol === 'BTC' ? 45000 + Math.random() * 5000 : 
                symbol === 'ETH' ? 2500 + Math.random() * 300 : 
                100 + Math.random() * 50,
        high: symbol === 'BTC' ? 46000 + Math.random() * 5000 : 
              symbol === 'ETH' ? 2600 + Math.random() * 300 : 
              110 + Math.random() * 50,
        low: symbol === 'BTC' ? 44000 + Math.random() * 5000 : 
            symbol === 'ETH' ? 2400 + Math.random() * 300 : 
            90 + Math.random() * 50,
        open: symbol === 'BTC' ? 44500 + Math.random() * 5000 : 
              symbol === 'ETH' ? 2450 + Math.random() * 300 : 
              95 + Math.random() * 50,
        volumefrom: Math.random() * 10000,
        volumeto: Math.random() * 1000000000
      }))
    };
    
    return mockData;
  }
};
