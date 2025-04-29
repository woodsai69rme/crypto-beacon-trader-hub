
import { CryptoData, CoinOption } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

// Base API URLs
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

/**
 * Fetch cryptocurrency data
 */
export const fetchCryptoData = async (limit: number = 10): Promise<CryptoData[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
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
 * Search for cryptocurrencies by name or symbol
 */
export const searchCryptos = async (query: string): Promise<CryptoData[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(`${COINGECKO_API_URL}/search?query=${encodeURIComponent(query)}`);
    
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
 * Fetch technical indicators for a cryptocurrency
 */
export const fetchTechnicalIndicators = async (coinId: string, days: number = 14) => {
  try {
    // In a real implementation, we would call a proper technical analysis API
    // For now, we'll generate mock data based on historical prices
    
    // First get price history
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const marketData = await response.json();
    const prices = marketData.prices || [];
    
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
    
    // Create mock response
    return {
      data: {
        time: prices.map((p: [number, number]) => p[0]),
        RSI: rsiValues.map(r => r.value),
        MovingAverage7: closePrices.slice(-days).map((_, i, arr) => {
          if (i < 7) return null;
          return arr.slice(i - 7, i).reduce((sum, val) => sum + val, 0) / 7;
        }),
        MovingAverage25: closePrices.slice(-days).map((_, i, arr) => {
          if (i < 25) return null;
          return arr.slice(i - 25, i).reduce((sum, val) => sum + val, 0) / 25;
        }),
        MovingAverage99: closePrices.slice(-days).map((_, i, arr) => {
          if (i < 99) return null;
          return arr.slice(i - 99, i).reduce((sum, val) => sum + val, 0) / 99;
        }),
        UpperBand: closePrices.slice(-days).map((val) => val * 1.02),
        MiddleBand: closePrices.slice(-days),
        LowerBand: closePrices.slice(-days).map((val) => val * 0.98),
        Real: closePrices.slice(-days),
        MACD: closePrices.slice(-days).map((_, i, arr) => {
          if (i < 26) return null;
          const ema12 = arr.slice(i - 12, i).reduce((sum, val) => sum + val, 0) / 12;
          const ema26 = arr.slice(i - 26, i).reduce((sum, val) => sum + val, 0) / 26;
          return ema12 - ema26;
        }),
        Signal: closePrices.slice(-days).map((_, i, arr) => {
          if (i < 26) return null;
          return arr.slice(Math.max(0, i - 9), i).reduce((sum, val) => sum + val, 0) / Math.min(9, i);
        }),
        Histogram: closePrices.slice(-days).map((_, i, arr) => {
          if (i < 26) return null;
          const ema12 = arr.slice(i - 12, i).reduce((sum, val) => sum + val, 0) / 12;
          const ema26 = arr.slice(i - 26, i).reduce((sum, val) => sum + val, 0) / 26;
          const macd = ema12 - ema26;
          const signal = arr.slice(Math.max(0, i - 9), i).reduce((sum, val) => sum + val, 0) / Math.min(9, i);
          return macd - signal;
        })
      }
    };
  } catch (error) {
    console.error("Error fetching technical indicators:", error);
    toast({
      title: "API Error",
      description: "Failed to load technical indicators.",
      variant: "destructive",
    });
    return {
      data: []
    };
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
      last_updated: new Date().toISOString(),
      // Add mapped properties for compatibility
      price: price,
      marketCap: marketCap,
      rank: index + 1,
      volume: volume,
      priceChange: priceChange,
      changePercent: priceChangePercent
    };
  });
};
