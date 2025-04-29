
import { CryptoData, CryptoChartData } from "@/types/trading";

const BASE_URL = "https://min-api.cryptocompare.com/data";

// Helper function for API requests
const fetchFromCryptoCompare = async (endpoint: string, params: Record<string, string> = {}) => {
  const apiKey = localStorage.getItem('cryptocompare-api-key');
  
  const queryParams = new URLSearchParams(params);
  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
  
  const headers: HeadersInit = {};
  if (apiKey) {
    headers['authorization'] = `Apikey ${apiKey}`;
  }
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`CryptoCompare API request failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.Response === "Error") {
    throw new Error(`CryptoCompare API error: ${data.Message}`);
  }
  
  return data;
};

// Fetch top coins from CryptoCompare
export const fetchCoinsFromCryptoCompare = async (limit: number = 20): Promise<CryptoData[]> => {
  try {
    const data = await fetchFromCryptoCompare("/top/mktcapfull", {
      limit: limit.toString(),
      tsym: "USD"
    });
    
    if (!data.Data || !Array.isArray(data.Data)) {
      return [];
    }
    
    // Convert CryptoCompare format to our standard CryptoData format
    return data.Data.map(item => {
      const coinInfo = item.CoinInfo;
      const rawData = item.RAW?.USD;
      const displayData = item.DISPLAY?.USD;
      
      return {
        id: coinInfo.Name.toLowerCase(),
        symbol: coinInfo.Name.toLowerCase(),
        name: coinInfo.FullName,
        image: `https://www.cryptocompare.com${coinInfo.ImageUrl}`,
        current_price: rawData?.PRICE || 0,
        market_cap: rawData?.MKTCAP || 0,
        market_cap_rank: coinInfo.SortOrder || 0,
        fully_diluted_valuation: null,
        total_volume: rawData?.TOTALVOLUME24H || 0,
        high_24h: rawData?.HIGH24HOUR || null,
        low_24h: rawData?.LOW24HOUR || null,
        price_change_24h: rawData?.CHANGE24HOUR || 0,
        price_change_percentage_24h: rawData?.CHANGEPCT24HOUR || 0,
        market_cap_change_24h: 0,
        market_cap_change_percentage_24h: 0,
        circulating_supply: coinInfo.CirculatingSupply || 0,
        total_supply: coinInfo.TotalCoinSupply || null,
        max_supply: coinInfo.MaxSupply || null,
        ath: null,
        ath_change_percentage: null,
        ath_date: null,
        atl: null,
        atl_change_percentage: null,
        atl_date: null,
        roi: null,
        last_updated: new Date().toISOString()
      };
    });
  } catch (error) {
    console.error("CryptoCompare API Error:", error);
    throw new Error(`Failed to fetch coins from CryptoCompare: ${(error as Error).message}`);
  }
};

// Fetch historical data for a specific coin
export const fetchCoinHistoryFromCryptoCompare = async (coinId: string, days: number = 7): Promise<CryptoChartData> => {
  try {
    const limit = days <= 1 ? 24 : days; // hourly for 1 day, daily otherwise
    const aggregate = days <= 1 ? 1 : 1; // hourly for 1 day, daily otherwise
    
    const data = await fetchFromCryptoCompare("/v2/histoday", {
      fsym: coinId.toUpperCase(),
      tsym: "USD",
      limit: limit.toString(),
      aggregate: aggregate.toString()
    });
    
    if (!data.Data || !Array.isArray(data.Data.Data)) {
      throw new Error("Invalid response format");
    }
    
    // Convert to the expected CryptoChartData format
    const prices: [number, number][] = [];
    const marketCaps: [number, number][] = [];
    const totalVolumes: [number, number][] = [];
    
    data.Data.Data.forEach((item: any) => {
      const timestamp = item.time * 1000; // Convert to milliseconds
      prices.push([timestamp, item.close]);
      marketCaps.push([timestamp, item.close * (item.volumefrom || 1000000)]); // Estimate
      totalVolumes.push([timestamp, item.volumeto || 0]);
    });
    
    return {
      prices,
      market_caps: marketCaps,
      total_volumes: totalVolumes
    };
  } catch (error) {
    console.error("CryptoCompare API Error:", error);
    throw new Error(`Failed to fetch history for ${coinId}: ${(error as Error).message}`);
  }
};

// Fetch technical indicators from CryptoCompare
export const fetchTechnicalIndicatorsFromCryptoCompare = async (coinId: string, indicator: string): Promise<any> => {
  try {
    const data = await fetchFromCryptoCompare("/tradingsignals/intotheblock/latest", {
      fsym: coinId.toUpperCase()
    });
    
    return data.Data;
  } catch (error) {
    console.error("CryptoCompare API Error:", error);
    throw new Error(`Failed to fetch technical indicators for ${coinId}: ${(error as Error).message}`);
  }
};
