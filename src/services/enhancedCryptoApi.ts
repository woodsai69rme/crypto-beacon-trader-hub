
import { toast } from "@/components/ui/use-toast";
import { getMockCryptoData } from "./cryptoApi";
import apiCache from "./api/cacheService";
import { CryptoData, CryptoChartData } from "@/types/trading";
import { 
  fetchCoinsFromCoinGecko, 
  fetchCoinHistoryFromCoinGecko,
  searchCoinsFromCoinGecko 
} from "./api/coinGeckoService";
import { fetchPriceMulti } from "./api/cryptoCompareService";
import { fetchLatestListings } from "./api/coinMarketCapService";

// API selection preference
type ApiProvider = "coinGecko" | "cryptoCompare" | "coinMarketCap";
let preferredProvider: ApiProvider = "coinGecko";

export const setPreferredApiProvider = (provider: ApiProvider) => {
  preferredProvider = provider;
  localStorage.setItem("preferredApiProvider", provider);
};

export const getPreferredApiProvider = (): ApiProvider => {
  const storedPreference = localStorage.getItem("preferredApiProvider");
  if (storedPreference && ["coinGecko", "cryptoCompare", "coinMarketCap"].includes(storedPreference)) {
    preferredProvider = storedPreference as ApiProvider;
  }
  return preferredProvider;
};

/**
 * Fetches cryptocurrency data from the preferred API provider with caching
 */
export const fetchCryptoData = async (limit: number = 10): Promise<CryptoData[]> => {
  const cacheKey = `crypto-data-${limit}`;
  const cached = apiCache.get<CryptoData[]>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    let data: CryptoData[];
    const provider = getPreferredApiProvider();
    
    switch (provider) {
      case "coinGecko":
        data = await fetchCoinsFromCoinGecko(limit);
        break;
      case "coinMarketCap":
        data = await fetchLatestListings(limit);
        break;
      default:
        // CryptoCompare doesn't have a direct mapping API for this
        // Fallback to CoinGecko
        data = await fetchCoinsFromCoinGecko(limit);
    }
    
    // Process the data for consistency across APIs
    const processedData = data.map(coin => ({
      ...coin,
      // Add calculated fields that might be missing
      price: coin.current_price,
      marketCap: coin.market_cap,
      rank: coin.market_cap_rank,
      volume: coin.total_volume,
      priceChange: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
    }));
    
    // Cache the data
    apiCache.set(cacheKey, processedData, 5 * 60 * 1000); // Cache for 5 minutes
    
    return processedData;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    toast({
      title: "Data Fetch Error",
      description: "Failed to fetch cryptocurrency data. Using fallback data.",
      variant: "destructive",
    });
    
    // Use mock data as fallback
    const mockData = getMockCryptoData().slice(0, limit);
    return mockData;
  }
};

/**
 * Fetches historical price data for a cryptocurrency
 */
export const fetchCryptoHistory = async (
  coinId: string,
  days: number = 30
): Promise<CryptoChartData> => {
  const cacheKey = `crypto-history-${coinId}-${days}`;
  const cached = apiCache.get<CryptoChartData>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const data = await fetchCoinHistoryFromCoinGecko(coinId, days);
    
    // Cache the data
    apiCache.set(cacheKey, data, 30 * 60 * 1000); // Cache for 30 minutes
    
    return data;
  } catch (error) {
    console.error("Error fetching crypto history:", error);
    // Don't show toast here, coinGeckoService already does
    
    // Use CryptoAPI's fetchCoinHistory as fallback
    const fallbackData = await import("./cryptoApi").then(module => module.fetchCoinHistory(coinId, days));
    return fallbackData;
  }
};

/**
 * Searches for cryptocurrencies by name or symbol
 */
export const searchCryptos = async (query: string): Promise<CryptoData[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const cacheKey = `crypto-search-${query}`;
  const cached = apiCache.get<CryptoData[]>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const data = await searchCoinsFromCoinGecko(query);
    
    // Cache the search results for a short time
    apiCache.set(cacheKey, data, 10 * 60 * 1000); // Cache for 10 minutes
    
    return data;
  } catch (error) {
    console.error("Error searching cryptocurrencies:", error);
    // Don't show toast here, coinGeckoService already does
    
    // Use mock data as fallback and filter it
    return getMockCryptoData().filter(coin => 
      coin.name.toLowerCase().includes(query.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );
  }
};

/**
 * Fetches currency conversion rates for cryptocurrencies
 */
export const fetchCurrencyRates = async (
  cryptos: string[] = ["BTC", "ETH"], 
  currencies: string[] = ["USD", "EUR", "GBP"]
): Promise<Record<string, Record<string, number>>> => {
  const cacheKey = `currency-rates-${cryptos.join("-")}-${currencies.join("-")}`;
  const cached = apiCache.get<Record<string, Record<string, number>>>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const data = await fetchPriceMulti(cryptos, currencies);
    
    // Cache the data
    apiCache.set(cacheKey, data, 5 * 60 * 1000); // Cache for 5 minutes
    
    return data;
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    toast({
      title: "API Error",
      description: "Could not fetch currency conversion rates. Using fallback data.",
      variant: "destructive",
    });
    
    // Return mock data
    const mockData: Record<string, Record<string, number>> = {};
    
    cryptos.forEach(crypto => {
      mockData[crypto] = {};
      currencies.forEach(currency => {
        let rate = 1;
        if (crypto === "BTC" && currency === "USD") rate = 58000;
        else if (crypto === "ETH" && currency === "USD") rate = 3500;
        else if (crypto === "BTC" && currency === "EUR") rate = 54000;
        else if (crypto === "ETH" && currency === "EUR") rate = 3250;
        else if (crypto === "BTC" && currency === "GBP") rate = 48000;
        else if (crypto === "ETH" && currency === "GBP") rate = 2900;
        mockData[crypto][currency] = rate;
      });
    });
    
    return mockData;
  }
};

/**
 * Refreshes cached data to ensure it's up-to-date
 */
export const refreshCryptoData = async (): Promise<boolean> => {
  try {
    // Clear relevant caches
    const cacheKeys = [
      "crypto-data-10", 
      "crypto-data-20", 
      "crypto-data-50",
      "currency-rates-BTC-ETH-USD-EUR-GBP"
    ];
    
    cacheKeys.forEach(key => apiCache.remove(key));
    
    // Make new requests to repopulate the cache
    await Promise.all([
      fetchCryptoData(10),
      fetchCurrencyRates()
    ]);
    
    toast({
      title: "Data Refreshed",
      description: "Cryptocurrency data has been updated successfully.",
    });
    
    return true;
  } catch (error) {
    console.error("Error refreshing crypto data:", error);
    toast({
      title: "Refresh Failed",
      description: "Could not refresh cryptocurrency data.",
      variant: "destructive",
    });
    
    return false;
  }
};
