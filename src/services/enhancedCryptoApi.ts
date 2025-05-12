
import { CoinOption, CryptoData } from '@/types/trading';

// Mock data for development
const MOCK_COINS: CryptoData[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    price: 65432.10,
    priceChange: 2341.50,
    changePercent: 3.7,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    marketCap: 1234567890123,
    volume: 32456789012
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    price: 3421.45,
    priceChange: 145.30,
    changePercent: 4.2,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    marketCap: 413456789012,
    volume: 15678901234
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    price: 142.35,
    priceChange: 12.35,
    changePercent: 9.5,
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    marketCap: 76543210987,
    volume: 5678901234
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    price: 0.62,
    priceChange: 0.04,
    changePercent: 6.8,
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    marketCap: 21987654321,
    volume: 1234567890
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'Binance Coin',
    price: 578.23,
    priceChange: 15.67,
    changePercent: 2.8,
    image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    marketCap: 89123456789,
    volume: 3456789012
  }
];

// Function to fetch top coins
export const getTopCoins = async (limit: number = 10): Promise<CoinOption[]> => {
  try {
    // In production, uncomment this to use the real API
    // const response = await fetch(
    //   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    // );
    // const data = await response.json();
    
    // For development, use mock data
    const data = MOCK_COINS.slice(0, limit);
    
    return data.map(normalizeCoinData);
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return MOCK_COINS.slice(0, limit).map(normalizeCoinData);
  }
};

// Function to search coins by name or symbol
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  if (!query || query.length < 2) {
    return [];
  }
  
  try {
    // In production, uncomment this to use the real API
    // const response = await fetch(
    //   `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
    // );
    // const data = await response.json();
    // const coins = data.coins || [];
    
    // For development, filter mock data
    const queryLower = query.toLowerCase();
    const filteredCoins = MOCK_COINS.filter(coin => 
      coin.name.toLowerCase().includes(queryLower) || 
      coin.symbol.toLowerCase().includes(queryLower) ||
      coin.id.toLowerCase().includes(queryLower)
    );
    
    return filteredCoins.map(normalizeCoinData);
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
};

// Function to get coin details by ID
export const getCoinDetails = async (coinId: string): Promise<CryptoData | null> => {
  try {
    // In production, uncomment this to use the real API
    // const response = await fetch(
    //   `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    // );
    // const data = await response.json();
    
    // For development, use mock data
    const coin = MOCK_COINS.find(c => c.id === coinId);
    if (!coin) return null;
    
    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      priceChange: coin.priceChange,
      changePercent: coin.changePercent,
      image: coin.image,
      marketCap: coin.marketCap,
      volume: coin.volume
    };
  } catch (error) {
    console.error(`Error fetching details for coin ${coinId}:`, error);
    return null;
  }
};

// Function to normalize coin data to our CoinOption format
export const normalizeCoinData = (coin: any): CoinOption => {
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.price || coin.current_price || 0,
    priceChange: coin.priceChange || coin.price_change_24h || 0,
    changePercent: coin.changePercent || coin.price_change_percentage_24h || 0,
    image: coin.image || coin.image?.small || coin.image?.thumb,
    marketCap: coin.marketCap || coin.market_cap || 0,
    volume: coin.volume || coin.total_volume || 0,
    value: coin.id,
    label: `${coin.name} (${coin.symbol.toUpperCase()})`
  };
};

// Function to get multiple coins' price data
export const getMultipleCoinPrices = async (coinIds: string[]): Promise<Record<string, CryptoData>> => {
  try {
    // In production, uncomment this to use the real API
    // const idsParam = coinIds.join('%2C');
    // const response = await fetch(
    //   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    // );
    // const data = await response.json();
    
    // For development, use mock data
    const data = MOCK_COINS.filter(coin => coinIds.includes(coin.id));
    
    const result: Record<string, CryptoData> = {};
    data.forEach(coin => {
      result[coin.id] = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.price,
        priceChange: coin.priceChange,
        changePercent: coin.changePercent,
        image: coin.image,
        marketCap: coin.marketCap,
        volume: coin.volume
      };
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching multiple coin prices:', error);
    
    // Return mock data if API fails
    const result: Record<string, CryptoData> = {};
    MOCK_COINS.filter(coin => coinIds.includes(coin.id)).forEach(coin => {
      result[coin.id] = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.price,
        priceChange: coin.priceChange,
        changePercent: coin.changePercent,
        image: coin.image,
        marketCap: coin.marketCap,
        volume: coin.volume
      };
    });
    
    return result;
  }
};

// Historical price data
export const getHistoricalPriceData = async (
  coinId: string,
  days: number = 30,
  interval: string = 'daily'
): Promise<{timestamps: number[], prices: number[]}> => {
  try {
    // In production, uncomment this to use the real API
    // const response = await fetch(
    //   `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
    // );
    // const data = await response.json();
    // return {timestamps: data.prices.map((p: any) => p[0]), prices: data.prices.map((p: any) => p[1])};
    
    // For development, generate mock historical data
    const timestamps: number[] = [];
    const prices: number[] = [];
    const startPrice = MOCK_COINS.find(c => c.id === coinId)?.price || 20000;
    const now = Date.now();
    const volatility = 0.05; // 5% price volatility
    
    for (let i = days; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      timestamps.push(timestamp);
      
      if (i === days) {
        // First price is the start price
        prices.push(startPrice);
      } else {
        // Random walk with drift
        const prevPrice = prices[prices.length - 1];
        const change = prevPrice * volatility * (Math.random() - 0.48); // Slight upward bias
        prices.push(prevPrice + change);
      }
    }
    
    return { timestamps, prices };
  } catch (error) {
    console.error(`Error fetching historical price data for ${coinId}:`, error);
    return { timestamps: [], prices: [] };
  }
};

export default {
  getTopCoins,
  searchCoins,
  getCoinDetails,
  normalizeCoinData,
  getMultipleCoinPrices,
  getHistoricalPriceData
};
