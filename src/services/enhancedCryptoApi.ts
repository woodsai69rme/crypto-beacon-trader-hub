
import { CryptoData } from '@/types/trading';
import { fetchTopCryptoData, searchCoins as searchCoinsImpl } from './cryptoService';

// Wrapper around fetchTopCryptoData to ensure type compatibility with CryptoData[]
export const fetchTopCryptoData = async (limit: number = 10): Promise<CryptoData[]> => {
  const data = await fetchTopCryptoData(limit);
  
  // Transform CoinOption to CryptoData format
  return data.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    currentPrice: coin.price,
    priceChangePercentage24h: coin.changePercent || 0,
    marketCap: coin.marketCap || 0,
    totalVolume: coin.volume || 0,
    high24h: coin.price * 1.05, // Mock high price
    low24h: coin.price * 0.95  // Mock low price
  }));
};

// Re-export the searchCoins function
export const searchCoins = searchCoinsImpl;
