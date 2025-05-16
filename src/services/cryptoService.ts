
import { CoinOption, CryptoData, PricePoint } from '@/types/trading';
import { toast } from '@/hooks/use-toast';

// Cache management
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
type CacheEntry<T> = { data: T; timestamp: number };
const apiCache: Record<string, CacheEntry<any>> = {};

/**
 * Fetch top cryptocurrencies data
 * @param limit Maximum number of cryptocurrencies to return
 */
export async function fetchCryptoData(limit: number = 10): Promise<CoinOption[]> {
  const cacheKey = `top-${limit}`;
  
  // Check if we have cached data
  if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
    return apiCache[cacheKey].data;
  }
  
  try {
    // In a real app, this would call CoinGecko, Binance, or another API
    // For now, we'll generate mock data
    const data = generateMockCryptoData(limit);
    
    // Cache the result
    apiCache[cacheKey] = { data, timestamp: Date.now() };
    
    return data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    toast({
      title: 'Data Fetch Error',
      description: 'Failed to fetch cryptocurrency data. Using fallback data.',
      variant: 'destructive',
    });
    
    // Return fallback data
    return generateMockCryptoData(limit);
  }
}

/**
 * Generate mock cryptocurrency data
 */
function generateMockCryptoData(count: number): CoinOption[] {
  const cryptoData = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 50000, priceChange: 1500, changePercent: 3.0, value: 'bitcoin', label: 'Bitcoin' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3000, priceChange: 100, changePercent: 3.3, value: 'ethereum', label: 'Ethereum' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 120, priceChange: 5, changePercent: 4.2, value: 'solana', label: 'Solana' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 1.2, priceChange: 0.05, changePercent: 4.1, value: 'cardano', label: 'Cardano' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.75, priceChange: 0.02, changePercent: 2.7, value: 'ripple', label: 'XRP' },
    // Add more mock data as needed
  ];
  
  return cryptoData.slice(0, count);
}

/**
 * Fetch historical price data for a cryptocurrency
 */
export async function fetchHistoricalPrices(coinId: string, days: number = 30): Promise<PricePoint[]> {
  const cacheKey = `history-${coinId}-${days}`;
  
  // Check if we have cached data
  if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
    return apiCache[cacheKey].data;
  }
  
  try {
    // In a real app, this would call a history API endpoint
    // For now, we'll generate mock data
    const data = generateMockHistoricalData(days);
    
    // Cache the result
    apiCache[cacheKey] = { data, timestamp: Date.now() };
    
    return data;
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    toast({
      title: 'Data Fetch Error',
      description: 'Failed to fetch historical price data. Using fallback data.',
      variant: 'destructive',
    });
    
    // Return fallback data
    return generateMockHistoricalData(days);
  }
}

/**
 * Generate mock historical price data
 */
function generateMockHistoricalData(days: number): PricePoint[] {
  const data: PricePoint[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  let price = 50000; // Starting price
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * dayMs);
    const change = (Math.random() - 0.5) * 1000; // Random price movement
    price += change;
    
    data.push({
      timestamp,
      price,
      date: new Date(timestamp).toLocaleDateString(),
      volume: Math.random() * 10000000000
    });
  }
  
  return data;
}

/**
 * Fetch details for a specific cryptocurrency
 */
export async function fetchCoinDetails(coinId: string): Promise<CryptoData | null> {
  const cacheKey = `coin-${coinId}`;
  
  // Check if we have cached data
  if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
    return apiCache[cacheKey].data;
  }
  
  try {
    // In a real app, this would call a coin details API endpoint
    // For now, we'll generate mock data
    const mockCoins = generateMockCryptoData(10);
    const coin = mockCoins.find(c => c.id === coinId);
    
    if (!coin) return null;
    
    const coinData: CryptoData = {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      priceChange: coin.priceChange,
      changePercent: coin.changePercent,
      marketCap: coin.price ? coin.price * 19000000 : undefined, // Mock market cap
      volume: coin.volume || Math.random() * 10000000000,
    };
    
    // Cache the result
    apiCache[cacheKey] = { data: coinData, timestamp: Date.now() };
    
    return coinData;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    toast({
      title: 'Data Fetch Error',
      description: `Failed to fetch details for ${coinId}. Using fallback data.`,
      variant: 'destructive',
    });
    
    // Return null as fallback
    return null;
  }
}

/**
 * Fetch market correlation data between cryptocurrencies
 * @param coinIds Array of coin IDs to calculate correlations for
 */
export async function fetchMarketCorrelationData(coinIds: string[]): Promise<number[][]> {
  const cacheKey = `correlation-matrix-${coinIds.join('-')}`;
  
  // Check if we have cached data
  if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
    return apiCache[cacheKey].data;
  }
  
  try {
    // In a real app, this would calculate correlation based on historical data
    // For now, we'll generate mock correlation data
    const numCoins = coinIds.length;
    const matrix: number[][] = [];
    
    // Generate correlation matrix
    for (let i = 0; i < numCoins; i++) {
      matrix[i] = [];
      for (let j = 0; j < numCoins; j++) {
        if (i === j) {
          // Self-correlation is 1
          matrix[i][j] = 1;
        } else if (j < i) {
          // Use symmetric values
          matrix[i][j] = matrix[j][i];
        } else {
          // Generate random correlation between -1 and 1
          // Use deterministic logic based on the coin IDs to ensure consistent values
          const seed = coinIds[i].charAt(0).charCodeAt(0) + coinIds[j].charAt(0).charCodeAt(0);
          let value = Math.sin(seed) * 0.5 + 0.5; // Between 0 and 1
          if (Math.random() > 0.7) value = -value; // Some negative correlations
          matrix[i][j] = Math.min(Math.max(value, -1), 1); // Ensure within -1 to 1
        }
      }
    }
    
    // Cache the result
    apiCache[cacheKey] = { data: matrix, timestamp: Date.now() };
    
    return matrix;
  } catch (error) {
    console.error('Error fetching correlation data:', error);
    toast({
      title: 'Data Fetch Error',
      description: 'Failed to calculate correlation matrix. Using fallback data.',
      variant: 'destructive',
    });
    
    // Return identity matrix as fallback
    return coinIds.map((_, i) => coinIds.map((_, j) => i === j ? 1 : 0));
  }
}
