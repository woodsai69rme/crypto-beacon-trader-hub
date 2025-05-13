
import { CoinOption } from '@/types/trading';

// Mock crypto data for development
const mockCoins: CoinOption[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 65000,
    priceChange: 1500,
    changePercent: 2.3,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    value: 'bitcoin',
    label: 'Bitcoin (BTC)'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3500,
    priceChange: -120,
    changePercent: -3.3,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    value: 'ethereum',
    label: 'Ethereum (ETH)'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 142,
    priceChange: 5.7,
    changePercent: 4.2,
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    value: 'solana',
    label: 'Solana (SOL)'
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.45,
    priceChange: 0.02,
    changePercent: 4.7,
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    value: 'cardano',
    label: 'Cardano (ADA)'
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'Binance Coin',
    price: 580,
    priceChange: 12.5,
    changePercent: 2.2,
    image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    value: 'binancecoin',
    label: 'Binance Coin (BNB)'
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    price: 0.58,
    priceChange: 0.01,
    changePercent: 1.75,
    image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    value: 'ripple',
    label: 'XRP (XRP)'
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.12,
    priceChange: -0.01,
    changePercent: -7.69,
    image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    value: 'dogecoin',
    label: 'Dogecoin (DOGE)'
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 6.50,
    priceChange: 0.25,
    changePercent: 4.0,
    image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    value: 'polkadot',
    label: 'Polkadot (DOT)'
  }
];

// Fetch data for a single crypto asset
export const fetchCryptoData = async (coinId: string): Promise<CoinOption | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const coin = mockCoins.find(c => c.id === coinId);
    
    if (!coin) return null;
    
    // Add some random variation to the price
    const priceVariation = coin.price * (Math.random() * 0.02 - 0.01);
    const updatedCoin = {
      ...coin,
      price: coin.price + priceVariation,
      priceChange: coin.priceChange * (1 + (Math.random() * 0.1 - 0.05)),
      changePercent: coin.changePercent * (1 + (Math.random() * 0.1 - 0.05))
    };
    
    return updatedCoin;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return null;
  }
};

// Fetch historical price data
export const fetchHistoricalData = async (
  coinId: string,
  days: number = 30,
  interval: string = 'daily'
): Promise<{ time: number; price: number }[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const coin = mockCoins.find(c => c.id === coinId);
    if (!coin) return [];
    
    const currentPrice = coin.price;
    const volatility = currentPrice * 0.15; // 15% volatility
    const dataPoints = days * (interval === 'hourly' ? 24 : 1);
    
    // Generate simulated historical data
    const now = Date.now();
    const millisecondsPerPoint = (days * 86400000) / dataPoints;
    
    const data = Array.from({ length: dataPoints }).map((_, i) => {
      const time = now - (dataPoints - i) * millisecondsPerPoint;
      const randomWalk = volatility * (Math.random() - 0.5);
      const price = Math.max(0.01, currentPrice - volatility / 2 + randomWalk * (i / dataPoints));
      return { time, price };
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};

// Fetch multiple crypto assets data
export const fetchMultipleCryptoData = async (limit: number = 10): Promise<CoinOption[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return the mock data with random variations
    return mockCoins.slice(0, limit).map(coin => {
      const priceVariation = coin.price * (Math.random() * 0.04 - 0.02);
      return {
        ...coin,
        price: coin.price + priceVariation,
        priceChange: coin.priceChange * (1 + (Math.random() * 0.2 - 0.1)),
        changePercent: coin.changePercent * (1 + (Math.random() * 0.2 - 0.1))
      };
    });
  } catch (error) {
    console.error('Error fetching multiple crypto data:', error);
    return [];
  }
};

// Convert API data to CoinOption format
export const convertToCoinOptions = (apiData: any[]): CoinOption[] => {
  try {
    return apiData.map(item => ({
      id: item.id || '',
      name: item.name || '',
      symbol: item.symbol?.toUpperCase() || '',
      price: item.current_price || 0,
      priceChange: item.price_change_24h || 0,
      changePercent: item.price_change_percentage_24h || 0,
      image: item.image || '',
      volume: item.total_volume || 0,
      marketCap: item.market_cap || 0,
      value: item.id || '',
      label: `${item.name} (${item.symbol?.toUpperCase() || ''})`
    }));
  } catch (error) {
    console.error('Error converting to coin options:', error);
    return [];
  }
};

// Get all available coins
export const getAllCoins = async (): Promise<CoinOption[]> => {
  // In a real app, this would fetch from an API
  return mockCoins;
};

// Search for coins by name or symbol
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  if (!query) return mockCoins;
  
  const normalizedQuery = query.toLowerCase();
  return mockCoins.filter(
    coin => 
      coin.name.toLowerCase().includes(normalizedQuery) || 
      coin.symbol.toLowerCase().includes(normalizedQuery)
  );
};

export default {
  fetchCryptoData,
  fetchHistoricalData,
  fetchMultipleCryptoData,
  convertToCoinOptions,
  getAllCoins,
  searchCoins
};
