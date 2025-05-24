
import { ApiProvider, ApiEndpoint } from '@/types/trading';

const createEndpoint = (id: string, name: string, path: string, method: string, description: string, requiresAuth: boolean): ApiEndpoint => ({
  id,
  name,
  path,
  method,
  description,
  requiresAuth
});

export const defaultApiProviders: ApiProvider[] = [
  {
    id: 'coingecko-free',
    name: 'CoinGecko Free',
    type: 'free',
    url: 'https://api.coingecko.com/api/v3',
    documentation: 'https://www.coingecko.com/api/docs/v3',
    description: 'Free cryptocurrency data with rate limits',
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerDay: 1000
    },
    endpoints: [
      createEndpoint('ping', 'Ping', '/ping', 'GET', 'Check API status', false),
      createEndpoint('coins-list', 'Coins List', '/coins/list', 'GET', 'List all coins', false)
    ],
    isActive: true,
    enabled: true
  },
  {
    id: 'coingecko-pro',
    name: 'CoinGecko Pro',
    type: 'paid',
    url: 'https://pro-api.coingecko.com/api/v3',
    documentation: 'https://www.coingecko.com/api/docs/v3',
    description: 'Premium cryptocurrency data with higher limits',
    rateLimit: {
      requestsPerMinute: 500,
      requestsPerDay: 50000
    },
    endpoints: [
      createEndpoint('ping-pro', 'Ping Pro', '/ping', 'GET', 'Check Pro API status', false),
      createEndpoint('coins-markets-pro', 'Markets Pro', '/coins/markets', 'GET', 'Market data with extended info', true)
    ],
    isActive: false,
    enabled: false,
    requiresAuth: true
  }
];

export const getDefaultProvider = (): ApiProvider => defaultApiProviders[0];

export const getProviderByType = (type: 'free' | 'paid'): ApiProvider[] => {
  return defaultApiProviders.filter(provider => provider.type === type);
};
