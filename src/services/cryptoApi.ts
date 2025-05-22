import { CryptoData, CryptoChartData } from '@/types/trading';

// Mock data for Bitcoin price history
const generateMockPriceHistory = (days = 30, startPrice = 50000): CryptoChartData[] => {
  const data: CryptoChartData[] = [];
  let currentPrice = startPrice;
  
  for (let i = days; i >= 0; i--) {
    // Create a timestamp for each day (in milliseconds)
    const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000);
    
    // Random price movement between -5% and +5%
    const change = currentPrice * (Math.random() * 0.1 - 0.05);
    currentPrice += change;
    
    // Random volume between 10B and 40B
    const volume = 10000000000 + Math.random() * 30000000000;
    
    data.push({
      timestamp,
      price: currentPrice,
      volume
    });
  }
  
  return data;
};

// Mock API response for getting coin list
export const getCoinsList = async (): Promise<CryptoData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      currentPrice: 58750,
      priceChange: 2345,
      priceChangePercentage24h: 4.15,
      marketCap: 1145789432345,
      totalVolume: 45687943234,
      high24h: 59200,
      low24h: 56400,
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      currentPrice: 3245.78,
      priceChange: 124.56,
      priceChangePercentage24h: 3.98,
      marketCap: 389547895432,
      totalVolume: 19875432198,
      high24h: 3300.45,
      low24h: 3100.56,
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      currentPrice: 102.45,
      priceChange: 5.67,
      priceChangePercentage24h: 5.86,
      marketCap: 43675489754,
      totalVolume: 2345678901,
      high24h: 104.56,
      low24h: 96.78,
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      currentPrice: 0.45,
      priceChange: 0.02,
      priceChangePercentage24h: 4.65,
      marketCap: 15897654321,
      totalVolume: 789456123,
      high24h: 0.46,
      low24h: 0.43,
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png'
    },
    {
      id: 'ripple',
      symbol: 'xrp',
      name: 'XRP',
      currentPrice: 0.57,
      priceChange: 0.03,
      priceChangePercentage24h: 5.56,
      marketCap: 30456789012,
      totalVolume: 1567890123,
      high24h: 0.58,
      low24h: 0.54,
      image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png'
    }
  ];
};

// Mock API for getting market chart data
export const getCoinMarketChart = async (coinId: string, days = 30): Promise<CryptoChartData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Set different starting prices for different coins
  let startPrice = 50000;
  if (coinId === 'ethereum') startPrice = 3200;
  else if (coinId === 'solana') startPrice = 100;
  else if (coinId === 'cardano') startPrice = 0.45;
  else if (coinId === 'ripple') startPrice = 0.55;
  
  // Generate mock price history
  return generateMockPriceHistory(days, startPrice);
};

// Mock API for getting coin details
export const getCoinDetails = async (coinId: string): Promise<CryptoData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return different data based on coinId
  switch(coinId) {
    case 'bitcoin':
      return {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        currentPrice: 58750,
        priceChange: 2345, 
        priceChangePercentage24h: 4.15,
        marketCap: 1145789432345,
        totalVolume: 45687943234,
        high24h: 59200,
        low24h: 56400,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
      };
    case 'ethereum':
      return {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        currentPrice: 3245.78,
        priceChange: 124.56,
        priceChangePercentage24h: 3.98,
        marketCap: 389547895432,
        totalVolume: 19875432198,
        high24h: 3300.45,
        low24h: 3100.56,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
      };
    case 'solana':
      return {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
        currentPrice: 102.45,
        priceChange: 5.67,
        priceChangePercentage24h: 5.86,
        marketCap: 43675489754,
        totalVolume: 2345678901,
        high24h: 104.56,
        low24h: 96.78,
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
      };
    default:
      return {
        id: coinId,
        symbol: coinId.substring(0, 3),
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        currentPrice: 100,
        priceChange: 5,
        priceChangePercentage24h: 5,
        marketCap: 1000000000,
        totalVolume: 100000000,
        high24h: 105,
        low24h: 95,
        image: ''
      };
  }
};

// Mock API for getting trending coins
export const getTrendingCoins = async (): Promise<CryptoData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return [
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      currentPrice: 102.45,
      priceChange: 5.67,
      priceChangePercentage24h: 5.86,
      marketCap: 43675489754,
      totalVolume: 2345678901,
      high24h: 104.56,
      low24h: 96.78,
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      currentPrice: 0.45,
      priceChange: 0.02,
      priceChangePercentage24h: 4.65,
      marketCap: 15897654321,
      totalVolume: 789456123,
      high24h: 0.46,
      low24h: 0.43,
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png'
    }
  ];
};

export const getCoinHistory = async (coinId: string, days: string | number = '7d') => {
  // Implementation based on your API structure
  try {
    const response = await fetch(`/api/coins/${coinId}/market_chart?days=${days}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching coin history:', error);
    throw error;
  }
};

export const getTopCoins = async (limit: number = 10) => {
  try {
    const response = await fetch(`/api/coins/markets?limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching top coins:', error);
    throw error;
  }
};
