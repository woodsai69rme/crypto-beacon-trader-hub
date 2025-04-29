import { CryptoData, CoinOption } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";
import apiCache from "./api/cacheService";

// Cache keys
const CACHE_KEYS = {
  SEARCH: 'crypto-search',
  TRENDING: 'crypto-trending',
  TECHNICAL: 'technical-indicators',
  MARKET_DATA: 'market-data',
};

// Base API URLs
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// Default options for fetch
const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

/**
 * Search for cryptocurrencies by name or symbol
 */
export const searchCryptos = async (query: string): Promise<CryptoData[]> => {
  if (!query || query.length < 2) return [];
  
  const cacheKey = `${CACHE_KEYS.SEARCH}-${query}`;
  const cachedResult = apiCache.get<CryptoData[]>(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }
  
  try {
    const response = await fetch(`${COINGECKO_API_URL}/search?query=${encodeURIComponent(query)}`, DEFAULT_FETCH_OPTIONS);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and map the response to our interface
    const coins: CryptoData[] = data.coins.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.large,
      market_cap_rank: coin.market_cap_rank,
      price_change_24h: 0,
      price_change_percentage_24h: 0,
      market_cap: 0,
      current_price: 0,
      total_volume: 0,
      high_24h: 0,
      low_24h: 0,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: 0,
      circulating_supply: 0,
      ath: 0,
      ath_change_percentage: 0,
      ath_date: "",
      atl: 0,
      atl_change_percentage: 0,
      atl_date: "",
      last_updated: new Date().toISOString()
    }));
    
    // Cache the results
    apiCache.set<CryptoData[]>(cacheKey, coins, 5 * 60 * 1000); // Cache for 5 minutes
    
    return coins;
  } catch (error) {
    console.error("Error searching cryptocurrencies:", error);
    toast({
      title: "Search Error",
      description: "Failed to search cryptocurrencies. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Get trending cryptocurrencies
 */
export const getTrendingCryptos = async (): Promise<CryptoData[]> => {
  const cacheKey = CACHE_KEYS.TRENDING;
  const cachedResult = apiCache.get<CryptoData[]>(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }
  
  try {
    const response = await fetch(`${COINGECKO_API_URL}/search/trending`, DEFAULT_FETCH_OPTIONS);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map to consistent interface
    const trendingCoins: CryptoData[] = data.coins.map((item: any) => {
      const coin = item.item;
      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.large,
        market_cap_rank: coin.market_cap_rank,
        price_change_24h: 0,
        price_change_percentage_24h: 0,
        market_cap: 0,
        current_price: 0,
        total_volume: 0,
        high_24h: 0,
        low_24h: 0,
        market_cap_change_24h: 0,
        market_cap_change_percentage_24h: 0,
        circulating_supply: 0,
        ath: 0,
        ath_change_percentage: 0,
        ath_date: "",
        atl: 0,
        atl_change_percentage: 0,
        atl_date: "",
        last_updated: new Date().toISOString()
      };
    });
    
    // Cache the results
    apiCache.set<CryptoData[]>(cacheKey, trendingCoins, 30 * 60 * 1000); // Cache for 30 minutes
    
    return trendingCoins;
  } catch (error) {
    console.error("Error fetching trending cryptocurrencies:", error);
    toast({
      title: "API Error",
      description: "Failed to load trending cryptocurrencies.",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Fetch technical indicators for a cryptocurrency
 */
export const fetchTechnicalIndicators = async (coinId: string, days: number = 14) => {
  const cacheKey = `${CACHE_KEYS.TECHNICAL}-${coinId}-${days}`;
  const cachedResult = apiCache.get(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }
  
  try {
    // In a real implementation, we would call a proper technical analysis API
    // For now, we'll generate mock data based on historical prices
    
    // First get price history
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      DEFAULT_FETCH_OPTIONS
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const prices = data.prices || [];
    
    // Calculate some basic indicators
    const closePrices = prices.map((item: [number, number]) => item[1]);
    
    // Mock RSI calculation
    const rsiValues = [];
    for (let i = 14; i < closePrices.length; i++) {
      // Simplified RSI calculation (not accurate, just for demonstration)
      const gains = [];
      const losses = [];
      
      for (let j = i - 14; j < i; j++) {
        const change = closePrices[j + 1] - closePrices[j];
        if (change >= 0) {
          gains.push(change);
          losses.push(0);
        } else {
          gains.push(0);
          losses.push(Math.abs(change));
        }
      }
      
      const avgGain = gains.reduce((sum, val) => sum + val, 0) / 14;
      const avgLoss = losses.reduce((sum, val) => sum + val, 0) / 14;
      
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      
      rsiValues.push({
        time: prices[i][0],
        value: rsi
      });
    }
    
    // Simple Moving Averages
    const sma20 = [];
    for (let i = 20; i < closePrices.length; i++) {
      const sum = closePrices.slice(i - 20, i).reduce((acc, val) => acc + val, 0);
      sma20.push({
        time: prices[i][0],
        value: sum / 20
      });
    }
    
    const sma50 = [];
    for (let i = 50; i < closePrices.length; i++) {
      const sum = closePrices.slice(i - 50, i).reduce((acc, val) => acc + val, 0);
      sma50.push({
        time: prices[i][0],
        value: sum / 50
      });
    }
    
    // MACD
    const ema12 = [];
    const ema26 = [];
    const macd = [];
    
    // Simplified EMA and MACD calculation
    let ema12Value = closePrices.slice(0, 12).reduce((sum, price) => sum + price, 0) / 12;
    let ema26Value = closePrices.slice(0, 26).reduce((sum, price) => sum + price, 0) / 26;
    
    for (let i = 0; i < closePrices.length; i++) {
      const multiplier12 = 2 / (12 + 1);
      const multiplier26 = 2 / (26 + 1);
      
      ema12Value = (closePrices[i] - ema12Value) * multiplier12 + ema12Value;
      if (i >= 11) {
        ema12.push({
          time: prices[i][0],
          value: ema12Value
        });
      }
      
      ema26Value = (closePrices[i] - ema26Value) * multiplier26 + ema26Value;
      if (i >= 25) {
        ema26.push({
          time: prices[i][0],
          value: ema26Value
        });
        
        macd.push({
          time: prices[i][0],
          value: ema12Value - ema26Value
        });
      }
    }
    
    const result = {
      prices: prices.map((item: [number, number]) => ({
        time: item[0],
        price: item[1]
      })),
      rsi: rsiValues,
      sma20,
      sma50,
      ema12,
      ema26,
      macd
    };
    
    // Cache the results
    apiCache.set(cacheKey, result, 60 * 60 * 1000); // Cache for 1 hour
    
    return result;
  } catch (error) {
    console.error("Error fetching technical indicators:", error);
    toast({
      title: "API Error",
      description: "Failed to load technical indicators.",
      variant: "destructive",
    });
    return {
      prices: [],
      rsi: [],
      sma20: [],
      sma50: [],
      ema12: [],
      ema26: [],
      macd: []
    };
  }
};

/**
 * Fetch cryptocurrency data
 */
export const fetchCryptoData = async (limit: number = 10): Promise<CryptoData[]> => {
  const cacheKey = `${CACHE_KEYS.MARKET_DATA}-${limit}`;
  const cachedResult = apiCache.get<CryptoData[]>(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }
  
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
      DEFAULT_FETCH_OPTIONS
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the results
    apiCache.set<CryptoData[]>(cacheKey, data, 5 * 60 * 1000); // Cache for 5 minutes
    
    return data;
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error);
    toast({
      title: "API Error",
      description: "Failed to fetch cryptocurrency data. Using mock data instead.",
      variant: "destructive",
    });
    
    // Return mock data
    return generateMockCryptoData(limit);
  }
};

/**
 * Generate mock cryptocurrency data
 */
const generateMockCryptoData = (count: number = 10): CryptoData[] => {
  const cryptos = [
    { id: "bitcoin", symbol: "btc", name: "Bitcoin", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
    { id: "ethereum", symbol: "eth", name: "Ethereum", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
    { id: "binancecoin", symbol: "bnb", name: "BNB", image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png" },
    { id: "solana", symbol: "sol", name: "Solana", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
    { id: "ripple", symbol: "xrp", name: "XRP", image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png" },
    { id: "cardano", symbol: "ada", name: "Cardano", image: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
    { id: "polkadot", symbol: "dot", name: "Polkadot", image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png" },
    { id: "dogecoin", symbol: "doge", name: "Dogecoin", image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
    { id: "avalanche-2", symbol: "avax", name: "Avalanche", image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png" },
    { id: "chainlink", symbol: "link", name: "Chainlink", image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png" },
    { id: "uniswap", symbol: "uni", name: "Uniswap", image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png" },
    { id: "litecoin", symbol: "ltc", name: "Litecoin", image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png" },
    { id: "polygon", symbol: "matic", name: "Polygon", image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png" },
    { id: "cosmos", symbol: "atom", name: "Cosmos", image: "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png" },
    { id: "stellar", symbol: "xlm", name: "Stellar", image: "https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png" },
  ];
  
  return cryptos.slice(0, count).map((crypto, index) => {
    const price = crypto.id === "bitcoin" ? 45000 + Math.random() * 5000 : 
                  crypto.id === "ethereum" ? 3000 + Math.random() * 500 : 
                  10 + Math.random() * 200;
    
    const priceChangePercent = (Math.random() * 16) - 8; // -8% to +8%
    const priceChange = price * (priceChangePercent / 100);
    const marketCap = price * (10000000 + Math.random() * 90000000);
    const volume = marketCap * (Math.random() * 0.3);
    
    return {
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      image: crypto.image,
      current_price: price,
      market_cap: marketCap,
      market_cap_rank: index + 1,
      fully_diluted_valuation: marketCap * 1.2,
      total_volume: volume,
      high_24h: price * (1 + Math.random() * 0.1),
      low_24h: price * (1 - Math.random() * 0.1),
      price_change_24h: priceChange,
      price_change_percentage_24h: priceChangePercent,
      market_cap_change_24h: marketCap * (priceChangePercent / 100),
      market_cap_change_percentage_24h: priceChangePercent,
      circulating_supply: 1000000 + Math.random() * 9000000,
      total_supply: 2100000 + Math.random() * 8000000,
      max_supply: crypto.id === "bitcoin" ? 21000000 : null,
      ath: price * 2,
      ath_change_percentage: -50,
      ath_date: "2021-11-10T14:24:11.849Z",
      atl: price * 0.1,
      atl_change_percentage: 900,
      atl_date: "2020-03-13T02:24:11.849Z",
      roi: null,
      last_updated: new Date().toISOString()
    };
  });
};

/**
 * Clear all cached API responses
 */
export const clearApiCache = () => {
  apiCache.clear();
  toast({
    title: "Cache Cleared",
    description: "All cached API responses have been cleared",
  });
};
