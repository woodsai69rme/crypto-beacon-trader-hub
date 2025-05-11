
import { CoinOption, CryptoData } from '@/types/trading';

// Fetches basic data for a list of coins
export const fetchCryptoPrices = async (coinIds: string[] = ['bitcoin', 'ethereum', 'solana']): Promise<CryptoData[]> => {
  try {
    // In a real implementation, this would call an external API
    // For now, we'll return mock data
    const mockData = coinIds.map(id => {
      const basePrice = id === 'bitcoin' ? 60000 : 
                        id === 'ethereum' ? 3000 : 
                        id === 'solana' ? 120 : 
                        id === 'cardano' ? 0.45 : 
                        id === 'ripple' ? 0.6 : 
                        id === 'dogecoin' ? 0.14 : 500;
                        
      const priceChange = Math.random() > 0.5 ? basePrice * 0.02 : -basePrice * 0.01;
      const changePercent = (priceChange / basePrice) * 100;
      
      return {
        id,
        symbol: id.substring(0, 3).toUpperCase(),
        name: id.charAt(0).toUpperCase() + id.slice(1),
        image: `https://example.com/images/${id}.png`,
        price: basePrice,
        priceChange,
        changePercent,
        priceChangePercentage: changePercent,
        marketCap: basePrice * (Math.random() * 100000000 + 10000000),
        volume: Math.random() * 1000000000,
        circulatingSupply: Math.random() * 100000000
      };
    });
    
    return mockData;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    throw error;
  }
};

// Fetch chart data for a specific coin
export const fetchCoinChartData = async (coinId: string, days: number = 7): Promise<any[]> => {
  try {
    // Generate mock chart data
    const data = [];
    const now = new Date();
    const basePrice = coinId === 'bitcoin' ? 60000 : 
                      coinId === 'ethereum' ? 3000 : 
                      coinId === 'solana' ? 120 : 500;
                      
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      // Generate a somewhat realistic price progression
      const volatility = 0.03; // 3% daily volatility
      const dayVariation = (Math.random() * 2 - 1) * volatility;
      const price = basePrice * (1 + dayVariation);
      
      data.push({
        date: date.toLocaleDateString(),
        price
      });
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching coin chart data:", error);
    throw error;
  }
};

// Convert API data to CoinOption format
export const convertToCoinOptions = (cryptoData: CryptoData[]): CoinOption[] => {
  return cryptoData.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.price,
    priceChange: coin.priceChange,
    changePercent: coin.changePercent,
    image: coin.image,
    volume: coin.volume,
    marketCap: coin.marketCap,
    value: coin.id,
    label: `${coin.name} (${coin.symbol})`
  }));
};

// Fetch multiple crypto data
export const fetchMultipleCryptoData = async (coinIds: string[]): Promise<CryptoData[]> => {
  try {
    return await fetchCryptoPrices(coinIds);
  } catch (error) {
    console.error("Error fetching multiple crypto data:", error);
    throw error;
  }
};

// Market summary data
export const fetchMarketSummary = async (): Promise<any> => {
  try {
    // In a real implementation, this would call an API
    return {
      totalMarketCap: 2345678901234,
      totalVolume: 123456789012,
      btcDominance: 43.2,
      activeCryptocurrencies: 12345,
      markets: 678
    };
  } catch (error) {
    console.error("Error fetching market summary:", error);
    throw error;
  }
};
