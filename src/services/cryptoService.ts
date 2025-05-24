
import { CoinOption } from '@/types/trading';

export const fetchCoinHistory = async (coinId: string, timeframe: string = '7d') => {
  // Mock implementation for fetching coin history
  const mockData = {
    prices: Array.from({ length: 30 }, (_, i) => [
      Date.now() - (30 - i) * 24 * 60 * 60 * 1000,
      Math.random() * 50000 + 30000
    ])
  };
  return mockData;
};

export const convertToCoinOptions = (apiData: any[]): CoinOption[] => {
  return apiData.map(coin => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price || 0,
    priceChange: coin.price_change_24h || 0,
    changePercent: coin.price_change_percentage_24h || 0,
    image: coin.image,
    volume: coin.total_volume,
    marketCap: coin.market_cap,
    value: coin.id,
    label: `${coin.name} (${coin.symbol.toUpperCase()})`
  }));
};

export default {
  fetchCoinHistory,
  convertToCoinOptions
};
