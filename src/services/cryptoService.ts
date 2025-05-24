
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

export const fetchTopCryptoData = async (limit: number = 10): Promise<CoinOption[]> => {
  // Mock implementation for fetching top crypto data
  const mockCoins: CoinOption[] = [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 45000,
      priceChange: 1200,
      changePercent: 2.7,
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      volume: 25000000000,
      marketCap: 850000000000,
      value: 'bitcoin',
      label: 'Bitcoin (BTC)'
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3000,
      priceChange: 150,
      changePercent: 5.3,
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      volume: 15000000000,
      marketCap: 350000000000,
      value: 'ethereum',
      label: 'Ethereum (ETH)'
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      price: 120,
      priceChange: -5,
      changePercent: -4.0,
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      volume: 2000000000,
      marketCap: 50000000000,
      value: 'solana',
      label: 'Solana (SOL)'
    }
  ].slice(0, limit);
  
  return mockCoins;
};

export const fetchMultipleCryptoData = async (coinIds: string[]): Promise<CoinOption[]> => {
  // Mock implementation for fetching multiple crypto data
  const allCoins = await fetchTopCryptoData(20);
  return allCoins.filter(coin => coinIds.includes(coin.id));
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
  fetchTopCryptoData,
  fetchMultipleCryptoData,
  convertToCoinOptions
};
