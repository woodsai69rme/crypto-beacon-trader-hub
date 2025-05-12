
import { CoinOption } from '@/types/trading';

// Helper to create realistic crypto data
const createCryptoData = (
  id: string, 
  name: string, 
  symbol: string, 
  price: number, 
  changePercent: number
): CoinOption => {
  const priceChange = price * (changePercent / 100);
  const volume = price * 1000000 * (Math.random() * 10 + 1);
  const marketCap = price * 1000000 * (Math.random() * 100 + 10);

  return {
    id,
    name,
    symbol,
    price,
    priceChange,
    changePercent,
    image: `https://assets.coingecko.com/coins/images/${id}/small.png`,
    volume,
    marketCap,
    value: id,
    label: `${symbol} - ${name}`
  };
};

// List of available cryptocurrencies for search
const availableCoins: CoinOption[] = [
  createCryptoData('bitcoin', 'Bitcoin', 'BTC', 61245.32, 2.3),
  createCryptoData('ethereum', 'Ethereum', 'ETH', 3010.45, -1.5),
  createCryptoData('solana', 'Solana', 'SOL', 142.87, 5.4),
  createCryptoData('ripple', 'XRP', 'XRP', 0.57, 5.8),
  createCryptoData('cardano', 'Cardano', 'ADA', 0.45, 4.6),
  createCryptoData('dogecoin', 'Dogecoin', 'DOGE', 0.08, 3.5),
  createCryptoData('binancecoin', 'Binance Coin', 'BNB', 415.78, 0.8),
  createCryptoData('polkadot', 'Polkadot', 'DOT', 5.68, -0.9),
  createCryptoData('chainlink', 'Chainlink', 'LINK', 12.56, 3.2),
  createCryptoData('avalanche-2', 'Avalanche', 'AVAX', 25.32, 1.7),
  createCryptoData('polygon', 'Polygon', 'MATIC', 0.48, -2.1),
  createCryptoData('tron', 'TRON', 'TRX', 0.12, 1.4),
  createCryptoData('litecoin', 'Litecoin', 'LTC', 61.25, -0.6),
  createCryptoData('uniswap', 'Uniswap', 'UNI', 5.87, 2.5),
  createCryptoData('near', 'NEAR Protocol', 'NEAR', 3.41, 4.2)
];

/**
 * Search for cryptocurrencies by name or symbol
 * @param query Search string
 * @returns Matched cryptocurrencies
 */
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!query || query.length < 2) return [];
  
  // Case-insensitive search for name, symbol, or ID
  const normalizedQuery = query.toLowerCase().trim();
  
  return availableCoins.filter(coin => 
    coin.name.toLowerCase().includes(normalizedQuery) || 
    coin.symbol.toLowerCase().includes(normalizedQuery) ||
    coin.id.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Get price change data for multiple coins
 */
export const getMultiCoinPriceChanges = async (
  coinIds: string[],
  timeframe: '1h' | '24h' | '7d' | '30d' = '24h'
): Promise<Record<string, number>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const result: Record<string, number> = {};
  
  // Generate realistic but random price changes based on timeframe
  coinIds.forEach(id => {
    let baseChange: number;
    
    // Larger potential changes for longer timeframes
    switch (timeframe) {
      case '1h':
        baseChange = Math.random() * 3 - 1.5; // -1.5% to +1.5%
        break;
      case '7d':
        baseChange = Math.random() * 20 - 10; // -10% to +10%
        break;
      case '30d':
        baseChange = Math.random() * 40 - 20; // -20% to +20%
        break;
      case '24h':
      default:
        baseChange = Math.random() * 8 - 4; // -4% to +4%
    }
    
    // Adjust change based on coin for more realistic values
    if (id === 'bitcoin') {
      baseChange = baseChange * 0.8; // BTC typically less volatile
    } else if (id === 'ethereum') {
      baseChange = baseChange * 0.9; // ETH less volatile than small caps
    } else if (id === 'dogecoin' || id === 'solana') {
      baseChange = baseChange * 1.3; // More volatile coins
    }
    
    result[id] = parseFloat(baseChange.toFixed(2));
  });
  
  return result;
};

/**
 * Get historical price data for coin
 */
export const getHistoricalPriceData = async (
  coinId: string,
  days: number = 30
): Promise<{ timestamp: number; price: number }[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Find base info for this coin
  const coinInfo = availableCoins.find(c => c.id === coinId) || 
    availableCoins.find(c => c.id === 'bitcoin')!;
  
  // Generate historical data points
  const data: { timestamp: number; price: number }[] = [];
  const now = Date.now();
  let price = coinInfo.price;
  
  // Generate each day's price going backwards
  for (let i = 0; i < days; i++) {
    // Adding some randomness based on coin
    const volatilityFactor = 
      coinId === 'bitcoin' ? 1.0 : 
      coinId === 'ethereum' ? 1.5 :
      coinId === 'cardano' ? 2.5 :
      coinId === 'solana' ? 3.0 :
      coinId === 'dogecoin' ? 4.0 : 2.0;
    
    // Random daily change with some momentum (prices tend to move in same direction)
    const momentum = i > 0 && i % 3 !== 0 ? 
      (price > data[data.length - 1].price ? 0.6 : -0.6) : 0;
    
    const dailyChange = (Math.random() * 5 - 2.5 + momentum) * volatilityFactor;
    
    // Update price with random daily change (between -X% and +X%)
    price = price * (1 + dailyChange / 100);
    
    // Ensure price stays positive
    if (price <= 0) price = 0.01;
    
    // Add data point (going backwards in time)
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    data.unshift({
      timestamp,
      price
    });
  }
  
  return data;
};

/**
 * Get price for a specific coin
 */
export const getCoinPrice = async (coinId: string): Promise<number | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const coin = availableCoins.find(c => c.id === coinId);
  return coin ? coin.price : null;
};

/**
 * Get trending coins
 */
export const getTrendingCoins = async (): Promise<CoinOption[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a subset of coins as "trending"
  return [
    availableCoins.find(c => c.id === 'solana')!,
    availableCoins.find(c => c.id === 'bitcoin')!,
    availableCoins.find(c => c.id === 'ripple')!,
    availableCoins.find(c => c.id === 'ethereum')!,
    availableCoins.find(c => c.id === 'cardano')!
  ];
};

export default {
  searchCoins,
  getMultiCoinPriceChanges,
  getHistoricalPriceData,
  getCoinPrice,
  getTrendingCoins,
  availableCoins
};
