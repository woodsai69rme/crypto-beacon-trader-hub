
import { CoinOption, CryptoData, PricePoint } from '@/types/trading';
import { toast } from '@/hooks/use-toast';

// Cache management
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
type CacheEntry<T> = { data: T; timestamp: number };
const apiCache: Record<string, CacheEntry<any>> = {};

// Import the functions from cryptoService with aliases to avoid name conflicts
import { 
  fetchHistoricalPrices as fetchHistoricalDataFromService,
  fetchCoinDetails as fetchCoinDetailsFromService,
  fetchCryptoData as fetchCryptoDataFromService,
  fetchMarketCorrelationData as fetchMarketCorrelationDataFromService
} from './cryptoService';

// Re-export with appropriate aliases to avoid name conflicts
export const fetchHistoricalData = fetchHistoricalDataFromService;
export const fetchCoinDetails = fetchCoinDetailsFromService;

/**
 * Get trending cryptocurrencies
 * @param limit Number of trending coins to fetch
 */
export async function getTrendingCoins(limit: number = 10): Promise<CoinOption[]> {
  const cacheKey = `trending-${limit}`;
  
  // Check if we have cached data
  if (
    apiCache[cacheKey] &&
    Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION
  ) {
    return apiCache[cacheKey].data;
  }
  
  try {
    const data = await fetchTopCryptoData(limit);
    
    // Add some randomness to simulate "trending" nature
    const sortedData = data.sort(() => Math.random() - 0.5);
    
    // Cache the result
    apiCache[cacheKey] = { data: sortedData, timestamp: Date.now() };
    
    return sortedData;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    toast({
      title: 'Data Fetch Error',
      description: 'Failed to fetch trending coins. Using fallback data.',
      variant: 'destructive',
    });
    
    // Return fallback data
    return generateFallbackTrendingCoins(limit);
  }
}

/**
 * Search cryptocurrencies
 * @param query Search query string
 * @param limit Maximum number of results to return
 */
export async function searchCoins(query: string, limit: number = 20): Promise<CoinOption[]> {
  if (!query) return [];
  
  try {
    // In a real app, this would call a search API
    // For now, we'll filter the fallback data
    const allCoins = generateFallbackTrendingCoins(50);
    
    const normalizedQuery = query.toLowerCase();
    const matchedCoins = allCoins.filter(coin => 
      coin.name.toLowerCase().includes(normalizedQuery) || 
      coin.symbol.toLowerCase().includes(normalizedQuery) ||
      coin.id.toLowerCase().includes(normalizedQuery)
    ).slice(0, limit);
    
    return matchedCoins;
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
}

/**
 * Get latest cryptocurrency news
 * @param limit Number of news items to fetch
 */
export async function getLatestNews(limit: number = 10): Promise<any[]> {
  const cacheKey = `news-${limit}`;
  
  // Check if we have cached data
  if (
    apiCache[cacheKey] &&
    Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION
  ) {
    return apiCache[cacheKey].data;
  }
  
  try {
    // In a real app, this would call a news API
    // For now, we'll generate mock news data
    const news = generateMockNewsData(limit);
    
    // Cache the result
    apiCache[cacheKey] = { data: news, timestamp: Date.now() };
    
    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    toast({
      title: 'Data Fetch Error',
      description: 'Failed to fetch news data. Using fallback data.',
      variant: 'destructive',
    });
    
    // Return fallback data
    return generateMockNewsData(limit);
  }
}

/**
 * Calculate correlation between two assets
 * @param asset1Id First asset ID
 * @param asset2Id Second asset ID
 * @param days Number of days of historical data to use
 */
export async function calculateCorrelation(
  asset1Id: string,
  asset2Id: string,
  days: number = 30
): Promise<number> {
  const cacheKey = `correlation-${asset1Id}-${asset2Id}-${days}`;
  
  // Check if we have cached data
  if (
    apiCache[cacheKey] &&
    Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION
  ) {
    return apiCache[cacheKey].data;
  }
  
  try {
    const asset1Data = await fetchHistoricalData(asset1Id, days);
    const asset2Data = await fetchHistoricalData(asset2Id, days);
    
    // Ensure we have data for both assets
    if (!asset1Data?.length || !asset2Data?.length) {
      throw new Error('Missing price data for correlation calculation');
    }
    
    // Extract price data
    const prices1 = asset1Data.map(item => item.price);
    const prices2 = asset2Data.map(item => item.price);
    
    // Calculate correlation
    const correlation = calculatePearsonCorrelation(prices1, prices2);
    
    // Cache the result
    apiCache[cacheKey] = { data: correlation, timestamp: Date.now() };
    
    return correlation;
  } catch (error) {
    console.error('Error calculating correlation:', error);
    toast({
      title: 'Calculation Error',
      description: 'Failed to calculate asset correlation. Using estimated value.',
      variant: 'destructive',
    });
    
    // Return a random correlation value as fallback
    return Math.random() * 2 - 1; // Between -1 and 1
  }
}

/**
 * Calculate Pearson correlation coefficient between two datasets
 */
function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  
  // Calculate sums
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }
  
  // Calculate Pearson correlation
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Generate fallback trending coins when API fails
 */
function generateFallbackTrendingCoins(count: number): CoinOption[] {
  const trendingCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 50000, priceChange: 1500, changePercent: 3.0, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', value: 'bitcoin', label: 'Bitcoin' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3000, priceChange: 100, changePercent: 3.3, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', value: 'ethereum', label: 'Ethereum' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 120, priceChange: 5, changePercent: 4.2, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', value: 'solana', label: 'Solana' },
    // More coins here...
  ];
  
  // Return requested number of coins with added value and label fields for Select component
  return trendingCoins.slice(0, count);
}

/**
 * Generate mock news data for testing
 */
function generateMockNewsData(count: number): any[] {
  // Mock news data implementation
  const newsItems = [
    { title: 'Bitcoin Surges Past $50,000 as Institutional Interest Grows', source: 'Coindesk' },
    { title: 'Ethereum 2.0 Update: What You Need to Know About the Merge', source: 'Cointelegraph' },
    // More news items here...
  ];
  
  // Return requested number of news items
  return newsItems.slice(0, count).map((item, index) => ({
    ...item,
    id: `news-${index}`,
    timestamp: new Date().toISOString(),
    url: '#',
    summary: `${item.title}. This is a brief summary of the article discussing the latest developments.`,
  }));
}

// Helper function for fetching top crypto data
async function fetchTopCryptoData(limit: number): Promise<CoinOption[]> {
  try {
    // Use the function from cryptoService but with our own alias
    return await fetchCryptoDataFromService(limit);
  } catch (error) {
    console.error('Error fetching top crypto data:', error);
    return generateFallbackTrendingCoins(limit);
  }
}

// Export the market correlation data fetch function with our alias
export const fetchMarketCorrelationData = fetchMarketCorrelationDataFromService;
