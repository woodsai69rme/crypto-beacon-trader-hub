
import { CoinOption, NewsItem, ApiUsageStats } from '@/types/trading';
import { fetchTopCryptoData, fetchCryptoData } from './cryptoService';

// Sample news data for development
const sampleNews: NewsItem[] = [
  {
    id: "news-1",
    title: "Bitcoin reaches new all-time high as institutional demand grows",
    content: "Bitcoin has reached a new all-time high price as institutional investors continue to enter the market...",
    summary: "Bitcoin reaches new ATH as institutions buy in",
    source: "CryptoNews",
    url: "https://example.com/news/1",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    sentiment: 0.8,
    topics: ["Bitcoin", "Institutional Investment"],
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
  },
  {
    id: "news-2",
    title: "Ethereum developers announce date for Shanghai upgrade",
    content: "Ethereum developers have announced the date for the upcoming Shanghai upgrade which will enable...",
    summary: "Ethereum Shanghai upgrade date announced",
    source: "Blockchain Daily",
    url: "https://example.com/news/2",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    sentiment: 0.6,
    topics: ["Ethereum", "Technology", "Upgrade"],
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1746&q=80"
  },
  {
    id: "news-3",
    title: "Regulatory concerns impact crypto market sentiment",
    content: "Concerns about upcoming regulations in major economies are causing uncertainty in crypto markets...",
    summary: "Regulation worries affect crypto markets",
    source: "Financial Times",
    url: "https://example.com/news/3",
    timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
    sentiment: -0.4,
    topics: ["Regulation", "Market Sentiment"],
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1802&q=80"
  },
  {
    id: "news-4",
    title: "Major bank launches cryptocurrency custody service",
    content: "A major international bank has announced the launch of a custody service for digital assets...",
    summary: "Bank launches crypto custody service",
    source: "Banking Today",
    url: "https://example.com/news/4",
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    sentiment: 0.7,
    topics: ["Banking", "Custody", "Institutional"],
    image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: "news-5",
    title: "New DeFi protocol reports record TVL growth",
    content: "A newly launched decentralized finance protocol has reported record growth in total value locked...",
    summary: "New DeFi protocol sees rapid TVL growth",
    source: "DeFi Pulse",
    url: "https://example.com/news/5",
    timestamp: new Date(Date.now() - 18 * 3600000).toISOString(),
    sentiment: 0.9,
    topics: ["DeFi", "TVL", "Growth"],
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1832&q=80"
  }
];

// Sample API usage statistics
const sampleApiUsage: ApiUsageStats[] = [
  {
    service: "CoinGecko",
    currentUsage: 45,
    maxUsage: 100,
    endpoint: "/api/v3/coins/markets",
    resetTime: new Date(Date.now() + 3600000).toISOString()
  },
  {
    service: "CoinGecko",
    currentUsage: 12,
    maxUsage: 50,
    endpoint: "/api/v3/coins/{id}",
    resetTime: new Date(Date.now() + 3600000).toISOString()
  },
  {
    service: "CryptoCompare",
    currentUsage: 156,
    maxUsage: 1000,
    endpoint: "/data/pricemultifull",
    resetTime: new Date(Date.now() + 86400000).toISOString()
  },
  {
    service: "CoinMarketCap",
    currentUsage: 8,
    maxUsage: 333,
    endpoint: "/v1/cryptocurrency/listings/latest",
    resetTime: new Date(Date.now() + 86400000).toISOString()
  }
];

// Get trending coins
export const getTrendingCoins = async (): Promise<CoinOption[]> => {
  try {
    // In a production environment, this would call a real API
    // For now, return mock data
    console.log('Fetching trending coins');
    return await fetchTopCryptoData(10);
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return [];
  }
};

// Get latest news
export const getLatestNews = async (): Promise<NewsItem[]> => {
  try {
    // In a production environment, this would call a real news API
    // For now, return sample news data
    console.log('Fetching latest crypto news');
    return sampleNews;
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
};

// Get news by sentiment
export const getNewsBySentiment = async (
  sentiment: 'positive' | 'negative' | 'neutral' | 'all' = 'all'
): Promise<NewsItem[]> => {
  try {
    console.log(`Fetching news with ${sentiment} sentiment`);
    
    let filteredNews = [...sampleNews];
    
    if (sentiment !== 'all') {
      filteredNews = sampleNews.filter(news => {
        if (sentiment === 'positive' && (news.sentiment || 0) > 0.3) return true;
        if (sentiment === 'negative' && (news.sentiment || 0) < -0.3) return true;
        if (sentiment === 'neutral' && Math.abs(news.sentiment || 0) <= 0.3) return true;
        return false;
      });
    }
    
    return filteredNews;
  } catch (error) {
    console.error('Error fetching news by sentiment:', error);
    return [];
  }
};

// Get API usage statistics
export const getApiUsageStats = async (): Promise<ApiUsageStats[]> => {
  try {
    console.log('Fetching API usage statistics');
    // In a production environment, this would track actual API usage
    // For now, return sample data
    return sampleApiUsage;
  } catch (error) {
    console.error('Error fetching API usage stats:', error);
    return [];
  }
};

// Check if an API provider is available
export const isApiProviderAvailable = async (
  providerId: string
): Promise<boolean> => {
  // In a production environment, this would actually check the API
  console.log(`Checking availability of API provider: ${providerId}`);
  
  // Mock response - always available
  return true;
};

// Getting news for a specific coin
export const getNewsForCoin = async (
  coinId: string
): Promise<NewsItem[]> => {
  try {
    console.log(`Fetching news for coin: ${coinId}`);
    
    // Get coin details to match against news
    const coin = await fetchCryptoData(coinId);
    if (!coin) return [];
    
    // Filter news that mentions this coin
    const relevantNews = sampleNews.filter(news => {
      const contentLower = (news.content || '').toLowerCase();
      const titleLower = news.title.toLowerCase();
      const symbolLower = coin.symbol.toLowerCase();
      const nameLower = coin.name.toLowerCase();
      
      return (
        contentLower.includes(symbolLower) ||
        contentLower.includes(nameLower) ||
        titleLower.includes(symbolLower) ||
        titleLower.includes(nameLower) ||
        (news.topics || []).some(topic => 
          topic.toLowerCase() === nameLower || 
          topic.toLowerCase() === symbolLower
        )
      );
    });
    
    return relevantNews;
  } catch (error) {
    console.error(`Error fetching news for coin ${coinId}:`, error);
    return [];
  }
};

export default {
  getTrendingCoins,
  getLatestNews,
  getNewsBySentiment,
  getApiUsageStats,
  isApiProviderAvailable,
  getNewsForCoin
};
