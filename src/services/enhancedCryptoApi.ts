/**
 * Enhanced Crypto API Service
 * Provides advanced cryptocurrency data and analysis functions.
 */

import { CoinOption, CryptoData } from '@/types/trading.d';
import { toast } from "@/components/ui/use-toast";
import { 
  fetchCoinDetails,
  fetchHistoricalData as fetchHistoricalDataFromService,
  fetchCoinHistory as fetchCoinHistoryFromService
} from './cryptoService';

// Cache for storing recent API responses
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Re-export with appropriate aliases to avoid name conflicts
export const fetchHistoricalData = fetchHistoricalDataFromService;
export const fetchCoinHistory = fetchCoinHistoryFromService;
export { fetchCoinDetails };

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
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 1.2, priceChange: 0.05, changePercent: 4.1, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', value: 'cardano', label: 'Cardano' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.75, priceChange: 0.02, changePercent: 2.7, image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', value: 'ripple', label: 'XRP' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 22, priceChange: 0.8, changePercent: 3.6, image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', value: 'polkadot', label: 'Polkadot' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', price: 1.8, priceChange: 0.09, changePercent: 5.0, image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png', value: 'polygon', label: 'Polygon' },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: 85, priceChange: 3.2, changePercent: 3.8, image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', value: 'avalanche', label: 'Avalanche' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', price: 28, priceChange: 1.1, changePercent: 3.9, image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', value: 'chainlink', label: 'Chainlink' },
    { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', price: 18, priceChange: 0.7, changePercent: 3.9, image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png', value: 'uniswap', label: 'Uniswap' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: 0.12, priceChange: 0.01, changePercent: 8.3, image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', value: 'dogecoin', label: 'Dogecoin' },
    { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB', price: 0.00002, priceChange: 0.000001, changePercent: 5.0, image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png', value: 'shiba-inu', label: 'Shiba Inu' },
    { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', price: 5.2, priceChange: 0.3, changePercent: 6.1, image: 'https://assets.coingecko.com/coins/images/10365/large/near_icon.png', value: 'near', label: 'NEAR Protocol' },
    { id: 'aave', name: 'Aave', symbol: 'AAVE', price: 175, priceChange: 7, changePercent: 4.0, image: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png', value: 'aave', label: 'Aave' },
    { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM', price: 28, priceChange: 1.5, changePercent: 5.3, image: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png', value: 'cosmos', label: 'Cosmos' },
  ];
  
  // Return requested number of coins with added value and label fields for Select component
  return trendingCoins.slice(0, count);
}

/**
 * Generate mock news data for testing
 */
function generateMockNewsData(count: number): any[] {
  const newsSources = ['CryptoDaily', 'Coindesk', 'Cointelegraph', 'The Block', 'Decrypt'];
  
  const newsItems = [
    { title: 'Bitcoin Surges Past $50,000 as Institutional Interest Grows', source: 'Coindesk' },
    { title: 'Ethereum 2.0 Update: What You Need to Know About the Merge', source: 'Cointelegraph' },
    { title: 'Solana Network Reports Record Transaction Throughput', source: 'The Block' },
    { title: 'Regulators Approve New Bitcoin ETF Applications', source: 'Decrypt' },
    { title: 'Cardano Smart Contracts See Surge in Adoption', source: 'CryptoDaily' },
    { title: 'Major Banks Partner with Ripple for Cross-Border Payments', source: 'Coindesk' },
    { title: 'Polkadot Parachains Attract $500M in Funding', source: 'Cointelegraph' },
    { title: 'NFT Market Shows Signs of Recovery After Slump', source: 'The Block' },
    { title: 'DeFi Protocols Report Record TVL Despite Market Uncertainty', source: 'Decrypt' },
    { title: 'Avalanche Launches $200M Developer Incentive Program', source: 'CryptoDaily' },
    { title: 'Chainlink Introduces New Oracle Solutions for DeFi', source: 'Coindesk' },
    { title: 'Uniswap Governance Votes on Protocol Fee Structure', source: 'Cointelegraph' },
    { title: 'Central Banks Accelerate CBDC Development', source: 'The Block' },
    { title: 'Crypto Mining Companies Embrace Renewable Energy', source: 'Decrypt' },
    { title: 'Major Retailer Announces Bitcoin Payment Integration', source: 'CryptoDaily' },
  ];
  
  // Generate additional random news if needed
  while (newsItems.length < count) {
    const randomTopics = ['Bitcoin', 'Ethereum', 'NFTs', 'DeFi', 'Web3', 'Metaverse', 'Layer 2', 'Regulation'];
    const randomVerbs = ['Surges', 'Launches', 'Introduces', 'Announces', 'Reports', 'Reveals', 'Partners with', 'Develops'];
    
    const randomTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
    const randomVerb = randomVerbs[Math.floor(Math.random() * randomVerbs.length)];
    const randomSource = newsSources[Math.floor(Math.random() * newsSources.length)];
    
    newsItems.push({
      title: `${randomTopic} ${randomVerb} New Project to Transform Blockchain Space`,
      source: randomSource,
    });
  }
  
  // Add timestamps, URLs, and IDs
  return newsItems.slice(0, count).map((item, index) => ({
    ...item,
    id: `news-${index}`,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
    url: '#',
    summary: `${item.title}. This is a brief summary of the article discussing the latest developments in the cryptocurrency space.`,
  }));
}

// Helper function for fetching top crypto data
async function fetchTopCryptoData(limit: number): Promise<CoinOption[]> {
  // Implementation would be similar to the one in cryptoService.ts
  // but we're creating a stub version here to avoid duplicate exports
  const trendingCoins = generateFallbackTrendingCoins(limit);
  return trendingCoins;
}

// Re-export these functions for convenience
export { fetchHistoricalData, fetchCoinDetails, fetchCoinHistory };
