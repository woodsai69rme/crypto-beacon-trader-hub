
import { CoinOption } from '@/types/trading';

/**
 * Starts real-time price monitoring for specified cryptocurrencies
 * @param coinIds Array of coin IDs to monitor
 * @param onUpdate Callback function to receive updated coin data
 * @param interval Update interval in milliseconds
 * @returns Function to stop monitoring
 */
export const startPriceMonitoring = (
  coinIds: string[],
  onUpdate: (updatedCoins: CoinOption[]) => void,
  interval: number = 5000
): () => void => {
  // In a real implementation, this would connect to a WebSocket or REST API
  // For this demo, we'll simulate price updates
  
  const intervalId = setInterval(() => {
    // Get the coins that need to be updated
    const updatedCoins = coinIds.map(coinId => {
      // Generate a random price change (-2% to +2%)
      const priceChangePercent = (Math.random() * 4 - 2) / 100;
      
      // Base prices for common cryptocurrencies
      let basePrice = 0;
      let symbol = '';
      let name = '';
      
      switch (coinId) {
        case 'bitcoin':
          basePrice = 61000 + Math.random() * 2000;
          symbol = 'BTC';
          name = 'Bitcoin';
          break;
        case 'ethereum':
          basePrice = 3000 + Math.random() * 200;
          symbol = 'ETH';
          name = 'Ethereum';
          break;
        case 'solana':
          basePrice = 120 + Math.random() * 10;
          symbol = 'SOL';
          name = 'Solana';
          break;
        case 'cardano':
          basePrice = 0.45 + Math.random() * 0.05;
          symbol = 'ADA';
          name = 'Cardano';
          break;
        case 'ripple':
          basePrice = 0.6 + Math.random() * 0.04;
          symbol = 'XRP';
          name = 'XRP';
          break;
        case 'dogecoin':
          basePrice = 0.13 + Math.random() * 0.02;
          symbol = 'DOGE';
          name = 'Dogecoin';
          break;
        default:
          basePrice = 10 + Math.random() * 2;
          symbol = 'COIN';
          name = coinId.charAt(0).toUpperCase() + coinId.slice(1);
          break;
      }
      
      // Calculate new price with change
      const price = basePrice * (1 + priceChangePercent);
      const priceChange = basePrice * priceChangePercent;
      
      // Random volume and market cap data
      const volume = basePrice * 100000 * (0.8 + Math.random() * 0.4);
      const marketCap = basePrice * 10000000 * (0.9 + Math.random() * 0.2);

      // Create updated coin data
      return {
        id: coinId,
        symbol,
        name,
        price,
        priceChange,
        changePercent: priceChangePercent * 100,
        volume,
        marketCap,
        image: `https://assets.coingecko.com/coins/images/1/large/${coinId}.png`,
        value: coinId,
        label: `${name} (${symbol})`
      };
    });
    
    // Call the update callback with the updated data
    onUpdate(updatedCoins);
  }, interval);
  
  // Return a function to stop monitoring
  return () => clearInterval(intervalId);
};

/**
 * Fetches historical price data for a specific coin
 * @param coinId ID of the cryptocurrency
 * @param days Number of days to fetch history for
 * @returns Promise with historical price data
 */
export const fetchCoinHistory = async (coinId: string, days: number = 7) => {
  // In a real implementation, this would fetch data from an API
  // For this demo, we'll generate mock data
  
  const now = new Date();
  const data = {
    prices: [] as [number, number][]
  };
  
  // Generate historical price data
  let price = 0;
  
  switch (coinId) {
    case 'bitcoin':
      price = 60000;
      break;
    case 'ethereum':
      price = 3000;
      break;
    case 'solana':
      price = 120;
      break;
    default:
      price = 100;
  }
  
  // Generate data points (1 per day or hour depending on timeframe)
  const pointsPerDay = days <= 1 ? 24 : 1; // Hourly for 1 day, daily for longer periods
  const totalPoints = days * pointsPerDay;
  const interval = (24 * 60 * 60 * 1000) / pointsPerDay;
  
  for (let i = totalPoints; i >= 0; i--) {
    const timestamp = now.getTime() - (i * interval);
    const randomChange = (Math.random() * 0.06) - 0.03; // -3% to +3%
    price = price * (1 + randomChange);
    
    data.prices.push([timestamp, price]);
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return data;
};

/**
 * Fetches data for multiple cryptocurrencies
 * @param coinIds Array of coin IDs to fetch
 * @returns Promise with cryptocurrency data
 */
export const fetchMultipleCryptoData = async (coinIds: string[]) => {
  // In a real implementation, this would fetch data from an API
  // For this demo, we'll generate mock data
  
  const data = coinIds.map(coinId => {
    // Base prices for common cryptocurrencies
    let price = 0;
    let symbol = '';
    let name = '';
    
    switch (coinId) {
      case 'bitcoin':
        price = 61000 + Math.random() * 2000;
        symbol = 'BTC';
        name = 'Bitcoin';
        break;
      case 'ethereum':
        price = 3000 + Math.random() * 200;
        symbol = 'ETH';
        name = 'Ethereum';
        break;
      case 'solana':
        price = 120 + Math.random() * 10;
        symbol = 'SOL';
        name = 'Solana';
        break;
      default:
        price = 10 + Math.random() * 2;
        symbol = 'COIN';
        name = coinId.charAt(0).toUpperCase() + coinId.slice(1);
        break;
    }
    
    const priceChangePercent = (Math.random() * 10 - 5) / 100;
    const priceChange = price * priceChangePercent;
    
    return {
      id: coinId,
      symbol,
      name,
      current_price: price,
      price_change_24h: priceChange,
      price_change_percentage_24h: priceChangePercent * 100,
      image: `https://assets.coingecko.com/coins/images/1/large/${coinId}.png`,
      total_volume: price * 100000 * (0.8 + Math.random() * 0.4),
      market_cap: price * 10000000 * (0.9 + Math.random() * 0.2)
    };
  });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return data;
};

/**
 * Converts raw API data to CoinOption format
 * @param rawData Raw API response data
 * @returns Formatted coin options
 */
export const convertToCoinOptions = (rawData: any[]): CoinOption[] => {
  return rawData.map(item => ({
    id: item.id,
    name: item.name,
    symbol: item.symbol.toUpperCase(),
    price: item.current_price,
    priceChange: item.price_change_24h,
    changePercent: item.price_change_percentage_24h,
    image: item.image,
    volume: item.total_volume,
    marketCap: item.market_cap,
    value: item.id,
    label: `${item.name} (${item.symbol.toUpperCase()})`
  }));
};
