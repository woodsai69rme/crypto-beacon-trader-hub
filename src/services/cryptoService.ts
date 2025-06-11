import { CoinOption } from '@/types/trading';

export const fetchCoinHistory = async (coinId: string, days: number = 30) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    const data = await response.json();
    
    return {
      prices: data.prices || [],
      market_caps: data.market_caps || [],
      total_volumes: data.total_volumes || []
    };
  } catch (error) {
    console.error('Error fetching coin history:', error);
    return { prices: [], market_caps: [], total_volumes: [] };
  }
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

export const convertToCoinOptions = (data: any[]): CoinOption[] => {
  return data.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price || 0,
    priceChange: coin.price_change_24h || 0,
    changePercent: coin.price_change_percentage_24h || 0,
    marketCap: coin.market_cap || 0,
    volume: coin.total_volume || 0,
    image: coin.image || '',
    value: coin.id,
    label: `${coin.name} (${coin.symbol.toUpperCase()})`,
    rank: coin.market_cap_rank || 0
  }));
};

export default {
  fetchCoinHistory,
  fetchTopCryptoData,
  fetchMultipleCryptoData,
  convertToCoinOptions
};
