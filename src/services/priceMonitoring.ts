
import { fetchCryptoData } from "./enhancedCryptoApi";
import { CoinOption } from "@/types/trading";

type PriceUpdateCallback = (coins: CoinOption[]) => void;

let monitoringInterval: number | null = null;
let coinCache: CoinOption[] = [];

/**
 * Starts monitoring prices for the specified coins
 * @param coinIds Array of coin IDs to monitor
 * @param callback Function to call when prices update
 * @param interval Interval in ms (default 10 seconds)
 * @returns A function to stop monitoring
 */
export const startPriceMonitoring = (
  coinIds: string[],
  callback: PriceUpdateCallback,
  interval: number = 10000
): () => void => {
  // Stop any existing monitoring
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
  
  // Initial fetch
  fetchPrices(coinIds, callback);
  
  // Start interval
  monitoringInterval = window.setInterval(() => {
    fetchPrices(coinIds, callback);
  }, interval);
  
  // Return function to stop monitoring
  return () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      monitoringInterval = null;
    }
  };
};

/**
 * Fetches prices for the specified coins
 */
const fetchPrices = async (coinIds: string[], callback: PriceUpdateCallback) => {
  try {
    const allCoins = await fetchCryptoData(50);
    
    // Filter to just the coins we want
    const filteredCoins = allCoins.filter(coin => coinIds.includes(coin.id));
    
    // Map to the format expected by the callback
    const mappedCoins: CoinOption[] = filteredCoins.map(coin => {
      // Get previous price if we have it
      const previousCoin = coinCache.find(c => c.id === coin.id);
      const previousPrice = previousCoin?.price;
      
      // Calculate price change for UI effects
      const currentPrice = coin.current_price || coin.price || 0;
      const priceChange = previousPrice ? currentPrice - previousPrice : 0;
      const changePercent = previousPrice ? (priceChange / previousPrice) * 100 : 0;
      
      return {
        id: coin.id,
        value: coin.id,
        label: `${coin.name} (${coin.symbol.toUpperCase()})`,
        name: coin.name,
        symbol: coin.symbol,
        price: currentPrice,
        image: coin.image,
        priceChange,
        changePercent,
        volume: coin.total_volume || coin.volume,
        marketCap: coin.market_cap || coin.marketCap,
        rank: coin.market_cap_rank || coin.rank
      };
    });
    
    // Update cache
    coinCache = mappedCoins;
    
    // Call callback
    callback(mappedCoins);
  } catch (error) {
    console.error("Error fetching prices for monitoring:", error);
    
    // If we have cached data, use that
    if (coinCache.length > 0) {
      callback(coinCache);
    } else {
      // Generate mock data as fallback
      const mockCoins: CoinOption[] = coinIds.map((id, index) => {
        const price = id === "bitcoin" ? 58000 : 
                     id === "ethereum" ? 3500 : 
                     id === "solana" ? 110 : 
                     id === "cardano" ? 0.45 : 
                     100 - (index * 10);
                     
        return {
          id,
          value: id,
          label: `${id.charAt(0).toUpperCase() + id.slice(1)} (${id.substring(0, 3).toUpperCase()})`,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          symbol: id.substring(0, 3),
          price,
          image: `https://via.placeholder.com/32/3${index}45${index}8/${index}e${index}fff?text=${id.substring(0, 1).toUpperCase()}`,
          priceChange: 0,
          changePercent: 0,
          volume: 1000000 * (index + 1),
          marketCap: 10000000 * (10 - index),
          rank: index + 1
        };
      });
      
      coinCache = mockCoins;
      callback(mockCoins);
    }
  }
};
