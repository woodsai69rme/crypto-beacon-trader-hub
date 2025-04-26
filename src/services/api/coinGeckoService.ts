
import { toast } from "@/components/ui/use-toast";
import { CryptoData, CryptoChartData, getMockCryptoData } from "../cryptoApi";
import apiCache from "./cacheService";

const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchCoinsFromCoinGecko = async (limit: number): Promise<CryptoData[]> => {
  const response = await fetch(
    `${COINGECKO_API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch cryptocurrency data from CoinGecko");
  }
  
  return await response.json();
};

export const fetchCoinHistoryFromCoinGecko = async (
  coinId: string,
  days: number
): Promise<CryptoChartData> => {
  const response = await fetch(
    `${COINGECKO_API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch coin history from CoinGecko");
  }
  
  return await response.json();
};

export const searchCoinsFromCoinGecko = async (query: string): Promise<CryptoData[]> => {
  if (!query || query.length < 2) return [];
  
  const response = await fetch(`${COINGECKO_API_BASE_URL}/search?query=${query}`);
  
  if (!response.ok) {
    throw new Error("Search failed");
  }
  
  const data = await response.json();
  
  return data.coins.slice(0, 10).map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    market_cap_rank: coin.market_cap_rank || 9999,
    image: coin.large,
    // The search endpoint doesn't return these values, so we set defaults
    current_price: 0,
    market_cap: 0,
    price_change_percentage_24h: 0,
    ath: 0,
    total_volume: 0,
    circulating_supply: 0
  }));
};

export const fetchCoinDataFromCoinGecko = async (coinId: string): Promise<CryptoData | null> => {
  const response = await fetch(
    `${COINGECKO_API_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch coin data");
  }
  
  const data = await response.json();
  
  // Transform to match our interface
  return {
    id: data.id,
    name: data.name,
    symbol: data.symbol.toUpperCase(),
    current_price: data.market_data.current_price.usd,
    market_cap: data.market_data.market_cap.usd,
    market_cap_rank: data.market_cap_rank,
    price_change_percentage_24h: data.market_data.price_change_percentage_24h,
    image: data.image.small,
    ath: data.market_data.ath.usd,
    total_volume: data.market_data.total_volume.usd,
    circulating_supply: data.market_data.circulating_supply,
  };
};
