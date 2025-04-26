
import { CryptoData, CryptoChartData } from "../cryptoApi";

const CRYPTOCOMPARE_API_BASE_URL = "https://min-api.cryptocompare.com/data";

export const fetchCoinsFromCryptoCompare = async (limit: number): Promise<CryptoData[]> => {
  const response = await fetch(
    `${CRYPTOCOMPARE_API_BASE_URL}/top/mktcapfull?limit=${limit}&tsym=USD`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch cryptocurrency data from CryptoCompare");
  }
  
  const data = await response.json();
  
  // Transform to match our CryptoData interface
  return data.Data.map((item: any) => ({
    id: item.CoinInfo.Name.toLowerCase(),
    name: item.CoinInfo.FullName,
    symbol: item.CoinInfo.Name,
    current_price: item.RAW?.USD?.PRICE || 0,
    market_cap: item.RAW?.USD?.MKTCAP || 0,
    market_cap_rank: item.CoinInfo.SortOrder,
    price_change_percentage_24h: item.RAW?.USD?.CHANGEPCT24HOUR || 0,
    image: `https://www.cryptocompare.com${item.CoinInfo.ImageUrl}`,
    ath: item.RAW?.USD?.HIGHDAY || 0,
    total_volume: item.RAW?.USD?.TOTALVOLUME24H || 0,
    circulating_supply: item.RAW?.USD?.SUPPLY || 0
  }));
};

export const fetchCoinHistoryFromCryptoCompare = async (
  coinId: string,
  days: number
): Promise<CryptoChartData> => {
  // For CryptoCompare, we need to map days to hours and get historical data
  const hours = days * 24;
  const limit = Math.min(hours, 2000); // API limit
  const response = await fetch(
    `${CRYPTOCOMPARE_API_BASE_URL}/v2/histohour?fsym=${coinId.toUpperCase()}&tsym=USD&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch coin history from CryptoCompare");
  }
  
  const data = await response.json();
  
  // Transform to match CryptoChartData
  const prices: [number, number][] = data.Data.Data.map((item: any) => [
    item.time * 1000, // Convert to milliseconds
    item.close
  ]);
  
  return {
    prices,
    market_caps: [], // CryptoCompare doesn't provide this
    total_volumes: [] // CryptoCompare doesn't provide this
  };
};

export const fetchTechnicalIndicatorsFromCryptoCompare = async (
  coinId: string,
  indicator: string
): Promise<any> => {
  // CryptoCompare provides technical indicators
  const endpoint = indicator.toLowerCase() === 'rsi' 
    ? 'rsi' 
    : indicator.toLowerCase() === 'macd' 
      ? 'macd' 
      : 'bbands'; // Default to Bollinger Bands
  
  const response = await fetch(
    `${CRYPTOCOMPARE_API_BASE_URL}/ta/${endpoint}?fsym=${coinId.toUpperCase()}&tsym=USD&limit=30`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${indicator} data`);
  }
  
  return await response.json();
};
