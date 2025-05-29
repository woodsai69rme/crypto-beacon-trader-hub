
import { ApiProvider, ApiUsageStats, CryptoData } from '@/types/trading';

class EnhancedApiService {
  private providers: Map<string, ApiProvider> = new Map();
  private usageStats: Map<string, ApiUsageStats> = new Map();
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const defaultProviders: ApiProvider[] = [
      {
        id: 'coingecko',
        name: 'CoinGecko',
        type: 'free',
        url: 'https://api.coingecko.com/api/v3',
        documentation: 'https://www.coingecko.com/en/api/documentation',
        rateLimit: { requestsPerMinute: 10, requestsPerDay: 1000 },
        endpoints: {
          price: '/simple/price',
          markets: '/coins/markets',
          assets: '/coins/list'
        },
        isActive: true,
        enabled: true,
      }
    ];

    defaultProviders.forEach(provider => {
      this.providers.set(provider.id, provider);
      this.initializeUsageStats(provider.id);
    });
  }

  private initializeUsageStats(providerId: string) {
    this.usageStats.set(providerId, {
      provider: providerId,
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      avgResponseTime: 0,
      lastCalled: new Date().toISOString(),
    });
  }

  async fetchData(providerId: string, endpoint: string, params?: Record<string, any>): Promise<any> {
    const provider = this.providers.get(providerId);
    if (!provider || !provider.enabled) {
      throw new Error(`Provider ${providerId} not found or disabled`);
    }

    const cacheKey = `${providerId}-${endpoint}-${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const startTime = Date.now();
    const stats = this.usageStats.get(providerId)!;

    try {
      const url = new URL(endpoint, provider.url);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...provider.defaultHeaders
      };

      if (provider.requiresAuth && provider.apiKey) {
        headers['Authorization'] = `Bearer ${provider.apiKey}`;
      }

      const response = await fetch(url.toString(), { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      // Update stats
      stats.totalCalls++;
      stats.successfulCalls++;
      stats.avgResponseTime = ((stats.avgResponseTime * (stats.totalCalls - 1)) + responseTime) / stats.totalCalls;
      stats.lastCalled = new Date().toISOString();

      // Cache the response
      this.cache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      stats.totalCalls++;
      stats.failedCalls++;
      stats.lastCalled = new Date().toISOString();
      throw error;
    }
  }

  async getCryptoData(): Promise<CryptoData[]> {
    try {
      const data = await this.fetchData('coingecko', '/coins/markets', {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
      });

      return data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        priceChange: coin.price_change_24h,
        changePercent: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        image: coin.image,
        value: coin.symbol.toUpperCase(),
        label: `${coin.name} (${coin.symbol.toUpperCase()})`,
      }));
    } catch (error) {
      console.error('Failed to fetch crypto data:', error);
      return [];
    }
  }

  getUsageStats(): ApiUsageStats[] {
    return Array.from(this.usageStats.values());
  }

  getProviders(): ApiProvider[] {
    return Array.from(this.providers.values());
  }

  addProvider(provider: ApiProvider): void {
    this.providers.set(provider.id, provider);
    this.initializeUsageStats(provider.id);
  }

  updateProvider(providerId: string, updates: Partial<ApiProvider>): boolean {
    const provider = this.providers.get(providerId);
    if (provider) {
      this.providers.set(providerId, { ...provider, ...updates });
      return true;
    }
    return false;
  }

  removeProvider(providerId: string): boolean {
    const removed = this.providers.delete(providerId);
    if (removed) {
      this.usageStats.delete(providerId);
    }
    return removed;
  }
}

export const enhancedApiService = new EnhancedApiService();
export default enhancedApiService;
