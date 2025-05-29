import { ApiProvider, ApiEndpoint } from '@/types/trading';

class ApiProviderManager {
  private providers: Map<string, ApiProvider> = new Map();

  constructor() {
    // Initialize with default providers
    this.addProvider({
      id: 'coingecko',
      name: 'CoinGecko',
      type: 'free',
      url: 'https://api.coingecko.com/api/v3',
      documentation: 'https://www.coingecko.com/api/docs/v3',
      description: 'Free cryptocurrency data API',
      rateLimit: {
        requestsPerMinute: 10,
        requestsPerDay: 1000
      },
      endpoints: {
        price: '/simple/price',
        markets: '/coins/markets',
        assets: '/coins/list',
        news: '/news'
      },
      isActive: true,
      enabled: true
    });

    this.addProvider({
      id: 'coinmarketcap',
      name: 'CoinMarketCap',
      type: 'paid',
      url: 'https://pro-api.coinmarketcap.com/v1',
      documentation: 'https://coinmarketcap.com/api/documentation/v1/',
      description: 'Professional cryptocurrency data API',
      rateLimit: {
        requestsPerMinute: 30,
        requestsPerDay: 10000
      },
      endpoints: {
        price: '/cryptocurrency/quotes/latest',
        markets: '/cryptocurrency/listings/latest',
        assets: '/cryptocurrency/map'
      },
      isActive: false,
      enabled: false,
      requiresAuth: true
    });
  }

  getAllProviders(): ApiProvider[] {
    return Array.from(this.providers.values());
  }

  getProviderById(id: string): ApiProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Provider with id ${id} not found`);
    }
    return provider;
  }

  addProvider(provider: ApiProvider): void {
    this.providers.set(provider.id, provider);
  }

  updateProvider(id: string, updatedProvider: ApiProvider): void {
    if (!this.providers.has(id)) {
      throw new Error(`Provider with id ${id} not found`);
    }
    this.providers.set(id, updatedProvider);
  }

  toggleProviderEnabled(id: string): void {
    const provider = this.getProviderById(id);
    provider.enabled = !provider.enabled;
    this.updateProvider(id, provider);
  }

  deleteProvider(id: string): void {
    if (!this.providers.delete(id)) {
      throw new Error(`Provider with id ${id} not found`);
    }
  }

  setProviderApiKey(id: string, apiKey: string): void {
    const provider = this.getProviderById(id);
    provider.apiKey = apiKey;
    this.updateProvider(id, provider);
  }

  getEnabledProviders(): ApiProvider[] {
    return this.getAllProviders().filter(provider => provider.enabled);
  }

  getPriorityProvider(): ApiProvider | null {
    const enabled = this.getEnabledProviders();
    return enabled.length > 0 ? enabled[0] : null;
  }
}

export const apiProviderManager = new ApiProviderManager();
export default apiProviderManager;
