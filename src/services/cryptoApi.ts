
import { CryptoChartData, CryptoData } from "@/types/trading";

// Mock data for when API calls fail
export const getMockCryptoData = (limit: number = 10): CryptoData[] => {
  const mockCoins: CryptoData[] = [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 50123.45,
      market_cap: 928374982734,
      market_cap_rank: 1,
      fully_diluted_valuation: 1050000000000,
      total_volume: 32893749823,
      high_24h: 51000,
      low_24h: 49000,
      price_change_24h: 1200,
      price_change_percentage_24h: 2.4,
      market_cap_change_24h: 19273492834,
      market_cap_change_percentage_24h: 2.1,
      circulating_supply: 18923812,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 68000,
      ath_change_percentage: -26.5,
      ath_date: "2021-11-10T14:24:11.849Z",
      atl: 67.81,
      atl_change_percentage: 73732.25,
      atl_date: "2013-07-06T00:00:00.000Z",
      roi: null,
      last_updated: new Date().toISOString()
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 3010.45,
      market_cap: 328947982734,
      market_cap_rank: 2,
      fully_diluted_valuation: 350000000000,
      total_volume: 12893749823,
      high_24h: 3100,
      low_24h: 2900,
      price_change_24h: -120,
      price_change_percentage_24h: -1.5,
      market_cap_change_24h: -5273492834,
      market_cap_change_percentage_24h: -1.2,
      circulating_supply: 120923812,
      total_supply: null,
      max_supply: null,
      ath: 4800,
      ath_change_percentage: -37.5,
      ath_date: "2021-11-10T14:24:11.849Z",
      atl: 0.43,
      atl_change_percentage: 700732.25,
      atl_date: "2015-10-20T00:00:00.000Z",
      roi: {
        times: 100.5,
        currency: "usd",
        percentage: 10050
      },
      last_updated: new Date().toISOString()
    }
    // Add more mock coins if needed
  ];

  // If limit is less than the number of mock coins, return only the requested number
  return mockCoins.slice(0, limit);
};

// Mock function to fetch historical data
export const fetchCoinHistory = async (
  coinId: string,
  days: number = 7
): Promise<CryptoChartData | null> => {
  try {
    // In a real app, this would call an API
    // For now, generate mock data
    const mockPrices: [number, number][] = [];
    const mockMarketCaps: [number, number][] = [];
    const mockTotalVolumes: [number, number][] = [];
    
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const interval = (days <= 1) ? dayInMs / 24 : dayInMs; // Hourly for 1 day view, daily otherwise
    
    // Base price depends on the coin
    const basePrice = coinId === 'bitcoin' ? 50000 : 
                     coinId === 'ethereum' ? 3000 : 
                     coinId === 'cardano' ? 0.45 : 
                     coinId === 'solana' ? 120 : 
                     coinId === 'ripple' ? 0.6 : 1.0;
    
    // Generate data points
    for (let i = 0; i <= days; i++) {
      const timestamp = now - ((days - i) * dayInMs);
      
      // Add some random fluctuation
      const randomChange = (Math.random() - 0.5) * 0.05; // +/- 2.5%
      const price = basePrice * (1 + randomChange);
      
      // Generate higher volumes and market caps for more popular coins
      const popularityFactor = coinId === 'bitcoin' ? 100 : 
                              coinId === 'ethereum' ? 50 : 
                              coinId === 'cardano' ? 10 : 
                              coinId === 'solana' ? 20 : 5;
      
      // Add data points
      mockPrices.push([timestamp, price]);
      mockMarketCaps.push([timestamp, price * 1000000 * popularityFactor]);
      mockTotalVolumes.push([timestamp, price * 100000 * popularityFactor * (Math.random() + 0.5)]);
    }
    
    return {
      prices: mockPrices,
      market_caps: mockMarketCaps,
      total_volumes: mockTotalVolumes
    };
  } catch (error) {
    console.error("Error fetching coin history:", error);
    return null;
  }
};

// Export types
export type { CryptoData, CryptoChartData };
