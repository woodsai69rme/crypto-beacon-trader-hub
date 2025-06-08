
import { ApiProvider, ApiEndpoint } from '@/types/trading';

export const createApiEndpoint = (
  id: string,
  name: string,
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  description: string,
  requiresAuth: boolean = false
): ApiEndpoint => ({
  id,
  name,
  url: path,
  path,
  method,
  description,
  requiresAuth,
  rateLimit: 10
});

export const coingeckoEndpoints = [
  createApiEndpoint('prices', 'Simple Price', '/simple/price', 'GET', 'Get current prices'),
  createApiEndpoint('markets', 'Coin Markets', '/coins/markets', 'GET', 'Get market data'),
  createApiEndpoint('coins', 'Coin List', '/coins/list', 'GET', 'Get all coins list'),
];

export const coinmarketcapEndpoints = [
  createApiEndpoint('listings', 'Latest Listings', '/v1/cryptocurrency/listings/latest', 'GET', 'Latest market data', true),
  createApiEndpoint('quotes', 'Price Quotes', '/v1/cryptocurrency/quotes/latest', 'GET', 'Current price quotes', true),
];

export const API_PROVIDERS: ApiProvider[] = [
  {
    id: 'coingecko',
    name: 'CoinGecko',
    type: 'free',
    url: 'https://api.coingecko.com/api/v3',
    documentation: 'https://www.coingecko.com/en/api/documentation',
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerDay: 1000,
    },
    endpoints: {
      price: '/simple/price',
      markets: '/coins/markets',
      assets: '/coins/list',
      news: '/news'
    },
    isActive: true,
    enabled: true,
  },
  {
    id: 'coinmarketcap',
    name: 'CoinMarketCap',
    type: 'paid',
    url: 'https://pro-api.coinmarketcap.com',
    documentation: 'https://coinmarketcap.com/api/documentation/v1/',
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerDay: 10000,
    },
    endpoints: {
      price: '/v1/cryptocurrency/quotes/latest',
      markets: '/v1/cryptocurrency/listings/latest',
      assets: '/v1/cryptocurrency/map',
    },
    isActive: false,
    enabled: false,
    requiresAuth: true,
  },
];
