
import axios from 'axios';
import { ApiProvider, ApiUsageStats, CryptoData } from '@/types/trading';
import { apiProviderManager } from './apiProviderConfig';

class EnhancedApiService {
  private usageStats: Map<string, ApiUsageStats> = new Map();

  private logApiCall(providerId: string, success: boolean, responseTime: number): void {
    const stats = this.usageStats.get(providerId) || {
      provider: providerId,
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      avgResponseTime: 0,
      lastCalled: new Date().toISOString()
    };

    stats.totalCalls += 1;
    if (success) {
      stats.successfulCalls += 1;
    } else {
      stats.failedCalls += 1;
    }

    // Update average response time
    stats.avgResponseTime = ((stats.avgResponseTime * (stats.totalCalls - 1)) + responseTime) / stats.totalCalls;
    stats.lastCalled = new Date().toISOString();

    this.usageStats.set(providerId, stats);
  }

  async makeApiCall<T>(
    providerId: string,
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    const provider = apiProviderManager.getProviderById(providerId);
    if (!provider.enabled) {
      throw new Error(`Provider ${providerId} is disabled`);
    }

    const startTime = Date.now();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...provider.defaultHeaders
      };

      if (provider.requiresAuth && provider.apiKey) {
        headers['X-CMC_PRO_API_KEY'] = provider.apiKey;
      }

      const response = await axios.get(`${provider.url}${endpoint}`, {
        params,
        headers,
        timeout: 10000
      });

      const responseTime = Date.now() - startTime;
      this.logApiCall(providerId, true, responseTime);

      return response.data;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logApiCall(providerId, false, responseTime);
      throw error;
    }
  }

  async fetchCryptoData(limit: number = 100): Promise<CryptoData[]> {
    const priorityProvider = apiProviderManager.getPriorityProvider();
    if (!priorityProvider) {
      throw new Error('No enabled API providers available');
    }

    try {
      const data = await this.makeApiCall<any>(
        priorityProvider.id,
        '/coins/markets',
        {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false
        }
      );

      return data.map((coin: any): CryptoData => ({
        id: coin.id,
        symbol: coin.symbol?.toUpperCase() || '',
        name: coin.name || '',
        price: coin.current_price || 0,
        priceChange: coin.price_change_24h || 0,
        changePercent: coin.price_change_percentage_24h || 0,
        volume: coin.total_volume || 0,
        marketCap: coin.market_cap || 0,
        rank: coin.market_cap_rank || 0,
        image: coin.image,
        value: coin.id,
        label: `${coin.name} (${coin.symbol?.toUpperCase()})`
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      
      // Try fallback providers
      const fallbackProviders = apiProviderManager.getEnabledProviders()
        .filter(p => p.id !== priorityProvider.id);
      
      for (const provider of fallbackProviders) {
        try {
          return await this.fetchCryptoData(limit);
        } catch (fallbackError) {
          console.error(`Fallback provider ${provider.id} failed:`, fallbackError);
        }
      }
      
      throw new Error('All API providers failed');
    }
  }

  getUsageStats(): ApiUsageStats[] {
    return Array.from(this.usageStats.values());
  }

  getProviderStats(providerId: string): ApiUsageStats | null {
    return this.usageStats.get(providerId) || null;
  }

  resetStats(): void {
    this.usageStats.clear();
  }
}

export const enhancedApiService = new EnhancedApiService();
export default enhancedApiService;
