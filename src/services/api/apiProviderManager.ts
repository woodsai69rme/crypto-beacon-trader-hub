
import { ApiProvider, ApiUsageStats } from '@/types/trading';

export class ApiProviderManager {
  private providers: Map<string, ApiProvider> = new Map();
  private usageStats: Map<string, ApiUsageStats> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const freeProviders: ApiProvider[] = [
      {
        id: 'coingecko',
        name: 'CoinGecko',
        type: 'free',
        url: 'https://api.coingecko.com/api/v3',
        documentation: 'https://www.coingecko.com/en/api/documentation',
        rateLimit: { requestsPerMinute: 50, requestsPerDay: 10000 },
        endpoints: [
          { id: 'price', path: '/simple/price', method: 'GET', requiresAuth: false, description: 'Get current prices' },
          { id: 'markets', path: '/coins/markets', method: 'GET', requiresAuth: false, description: 'Get market data' },
          { id: 'assets', path: '/coins/list', method: 'GET', requiresAuth: false, description: 'Get coin list' }
        ],
        isActive: true
      },
      {
        id: 'coinmarketcap',
        name: 'CoinMarketCap',
        type: 'free',
        url: 'https://pro-api.coinmarketcap.com/v1',
        documentation: 'https://coinmarketcap.com/api/documentation/v1/',
        rateLimit: { requestsPerMinute: 30, requestsPerDay: 10000 },
        endpoints: [
          { id: 'price', path: '/cryptocurrency/quotes/latest', method: 'GET', requiresAuth: true, description: 'Latest market quotes' },
          { id: 'markets', path: '/cryptocurrency/listings/latest', method: 'GET', requiresAuth: true, description: 'Latest listings' }
        ],
        isActive: true
      },
      {
        id: 'cryptocompare',
        name: 'CryptoCompare',
        type: 'free',
        url: 'https://min-api.cryptocompare.com/data',
        documentation: 'https://min-api.cryptocompare.com/documentation',
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 100000 },
        endpoints: [
          { id: 'price', path: '/price', method: 'GET', requiresAuth: false, description: 'Current prices' },
          { id: 'historical', path: '/histoday', method: 'GET', requiresAuth: false, description: 'Historical data' }
        ],
        isActive: true
      },
      {
        id: 'messari',
        name: 'Messari',
        type: 'free',
        url: 'https://data.messari.io/api/v1',
        documentation: 'https://messari.io/api/docs',
        rateLimit: { requestsPerMinute: 20, requestsPerDay: 1000 },
        endpoints: [
          { id: 'assets', path: '/assets', method: 'GET', requiresAuth: false, description: 'Asset information' },
          { id: 'metrics', path: '/assets/{id}/metrics', method: 'GET', requiresAuth: false, description: 'Asset metrics' }
        ],
        isActive: true
      },
      {
        id: 'fear-greed',
        name: 'Fear & Greed Index',
        type: 'free',
        url: 'https://api.alternative.me/fng',
        documentation: 'https://alternative.me/crypto/fear-and-greed-index/',
        rateLimit: { requestsPerMinute: 60, requestsPerDay: 1000 },
        endpoints: [
          { id: 'index', path: '/', method: 'GET', requiresAuth: false, description: 'Fear and greed index' }
        ],
        isActive: true
      },
      {
        id: 'blockchain-info',
        name: 'Blockchain.info',
        type: 'free',
        url: 'https://blockchain.info',
        documentation: 'https://www.blockchain.com/api',
        rateLimit: { requestsPerMinute: 300, requestsPerDay: 10000 },
        endpoints: [
          { id: 'stats', path: '/stats', method: 'GET', requiresAuth: false, description: 'Bitcoin statistics' },
          { id: 'blocks', path: '/blocks', method: 'GET', requiresAuth: false, description: 'Latest blocks' }
        ],
        isActive: true
      },
      {
        id: 'etherscan',
        name: 'Etherscan',
        type: 'free',
        url: 'https://api.etherscan.io/api',
        documentation: 'https://docs.etherscan.io/',
        rateLimit: { requestsPerMinute: 5, requestsPerDay: 100000 },
        endpoints: [
          { id: 'balance', path: '?module=account&action=balance', method: 'GET', requiresAuth: true, description: 'ETH balance' },
          { id: 'transactions', path: '?module=account&action=txlist', method: 'GET', requiresAuth: true, description: 'Transaction list' }
        ],
        isActive: true
      },
      {
        id: 'alpha-vantage',
        name: 'Alpha Vantage',
        type: 'free',
        url: 'https://www.alphavantage.co/query',
        documentation: 'https://www.alphavantage.co/documentation/',
        rateLimit: { requestsPerMinute: 5, requestsPerDay: 500 },
        endpoints: [
          { id: 'crypto', path: '?function=DIGITAL_CURRENCY_DAILY', method: 'GET', requiresAuth: true, description: 'Crypto data' },
          { id: 'forex', path: '?function=FX_DAILY', method: 'GET', requiresAuth: true, description: 'Forex rates' }
        ],
        isActive: true
      }
    ];

    freeProviders.forEach(provider => {
      this.providers.set(provider.id, provider);
      this.usageStats.set(provider.id, {
        provider: provider.id,
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        avgResponseTime: 0,
        lastCalled: new Date().toISOString()
      });
    });
  }

  getProvider(id: string): ApiProvider | undefined {
    return this.providers.get(id);
  }

  getAllProviders(): ApiProvider[] {
    return Array.from(this.providers.values());
  }

  getActiveProviders(): ApiProvider[] {
    return Array.from(this.providers.values()).filter(p => p.isActive);
  }

  updateUsageStats(providerId: string, success: boolean, responseTime: number) {
    const stats = this.usageStats.get(providerId);
    if (stats) {
      stats.totalCalls++;
      if (success) {
        stats.successfulCalls++;
      } else {
        stats.failedCalls++;
      }
      stats.avgResponseTime = (stats.avgResponseTime + responseTime) / 2;
      stats.lastCalled = new Date().toISOString();
    }
  }

  getUsageStats(providerId: string): ApiUsageStats | undefined {
    return this.usageStats.get(providerId);
  }

  getAllUsageStats(): ApiUsageStats[] {
    return Array.from(this.usageStats.values());
  }
}

export const apiProviderManager = new ApiProviderManager();
