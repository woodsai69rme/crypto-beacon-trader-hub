
import { CryptoData, CryptoChartData } from "../types/trading";

/**
 * Mock function to get cryptocurrency market data
 * @returns Promise resolving to an array of crypto data
 */
export const getMockCryptoData = async (): Promise<CryptoData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 61245.32,
      market_cap: 1203271283828,
      market_cap_rank: 1,
      fully_diluted_valuation: 1287542145259,
      total_volume: 28102841079,
      high_24h: 62541.79,
      low_24h: 60837.21,
      price_change_24h: 259.37,
      price_change_percentage_24h: 0.42581,
      market_cap_change_24h: 5078463822,
      market_cap_change_percentage_24h: 0.42375,
      circulating_supply: 19667925,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 68789.63,
      ath_change_percentage: -11.13,
      ath_date: "2021-11-10T14:24:11.849Z",
      atl: 67.81,
      atl_change_percentage: 90223.75,
      atl_date: "2013-07-06T00:00:00.000Z",
      roi: null,
      last_updated: "2023-04-26T14:30:09.235Z",
      price_change_percentage_1h_in_currency: 0.15,
      price_change_percentage_24h_in_currency: 0.42581,
      price_change_percentage_7d_in_currency: -1.23
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 3021.45,
      market_cap: 362847283828,
      market_cap_rank: 2,
      fully_diluted_valuation: 362847283828,
      total_volume: 15251789245,
      high_24h: 3087.42,
      low_24h: 2978.51,
      price_change_24h: 42.94,
      price_change_percentage_24h: 1.4378,
      market_cap_change_24h: 5236428731,
      market_cap_change_percentage_24h: 1.4629,
      circulating_supply: 120171000,
      total_supply: 120171000,
      max_supply: null,
      ath: 4878.26,
      ath_change_percentage: -38.06,
      ath_date: "2021-11-10T14:24:19.604Z",
      atl: 0.432979,
      atl_change_percentage: 697464.29,
      atl_date: "2015-10-20T00:00:00.000Z",
      roi: {
        times: 86.32,
        currency: "btc",
        percentage: 8632.42
      },
      last_updated: "2023-04-26T14:30:25.471Z",
      price_change_percentage_1h_in_currency: 0.25,
      price_change_percentage_24h_in_currency: 1.4378,
      price_change_percentage_7d_in_currency: -2.37
    }
  ];
};

/**
 * Mock function to fetch historical data for a specific coin
 * @param coinId - The ID of the cryptocurrency
 * @param days - Number of days of history to fetch
 * @returns Promise resolving to chart data
 */
export const fetchCoinHistory = async (coinId: string, days: number = 7): Promise<CryptoChartData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock historical data
  const now = Date.now();
  const oneDayMs = 86400000;
  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];
  
  let basePrice = coinId === "bitcoin" ? 61000 : coinId === "ethereum" ? 3000 : 1;
  let baseMarketCap = coinId === "bitcoin" ? 1200000000000 : coinId === "ethereum" ? 360000000000 : 10000000000;
  let baseVolume = coinId === "bitcoin" ? 25000000000 : coinId === "ethereum" ? 15000000000 : 1000000000;
  
  // Generate data points for each day
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * oneDayMs);
    
    // Add some randomness to the data
    const randomFactor = 0.95 + (Math.random() * 0.1);
    const priceVariation = basePrice * randomFactor;
    const marketCapVariation = baseMarketCap * randomFactor;
    const volumeVariation = baseVolume * (0.8 + (Math.random() * 0.4));
    
    prices.push([timestamp, priceVariation]);
    market_caps.push([timestamp, marketCapVariation]);
    total_volumes.push([timestamp, volumeVariation]);
    
    // Make the next day's base price dependent on the current day
    basePrice = priceVariation;
    baseMarketCap = marketCapVariation;
  }
  
  return {
    prices,
    market_caps,
    total_volumes
  };
};

/**
 * Mock function to fetch top coins by market cap
 * @param limit - Maximum number of coins to return
 * @returns Promise resolving to an array of crypto data
 */
export const fetchTopCoins = async (limit: number = 10): Promise<CryptoData[]> => {
  const allCoins = await getMockCryptoData();
  return allCoins.slice(0, limit);
};
