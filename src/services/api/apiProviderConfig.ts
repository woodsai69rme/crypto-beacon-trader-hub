
import { ApiProvider, ApiEndpoint } from '@/types/api';

export const coinGeckoEndpoints: Record<string, ApiEndpoint> = {
  ping: {
    id: 'ping',
    name: 'Ping',
    path: '/ping',
    method: 'GET',
    description: 'Check API server status',
    requiresAuth: false
  },
  coins: {
    id: 'coins',
    name: 'Coins List',
    path: '/coins/list',
    method: 'GET',
    description: 'List all supported coins with id, name, and symbol',
    requiresAuth: false
  },
  coinMarkets: {
    id: 'coinMarkets',
    name: 'Coin Markets',
    path: '/coins/markets',
    method: 'GET',
    description: 'List all supported coins price, market cap, volume, and market related data',
    requiresAuth: false
  },
  coinData: {
    id: 'coinData',
    name: 'Coin Data',
    path: '/coins/{id}',
    method: 'GET',
    description: 'Get current data for a coin',
    requiresAuth: false
  }
};

export const binanceEndpoints: Record<string, ApiEndpoint> = {
  ticker24hr: {
    id: 'ticker24hr',
    name: '24hr Ticker',
    path: '/ticker/24hr',
    method: 'GET',
    description: 'Get 24hr price change statistics for all symbols',
    requiresAuth: false
  },
  klines: {
    id: 'klines',
    name: 'Klines/Candlesticks',
    path: '/klines',
    method: 'GET',
    description: 'Get kline/candlestick bars for a symbol',
    requiresAuth: false
  },
  depth: {
    id: 'depth',
    name: 'Order Book Depth',
    path: '/depth',
    method: 'GET',
    description: 'Get order book depth data',
    requiresAuth: false
  }
};

export const apiProviders: ApiProvider[] = [
  {
    id: 'coingecko',
    name: 'CoinGecko',
    baseUrl: 'https://api.coingecko.com/api/v3',
    description: 'Cryptocurrency data aggregator',
    authType: 'query',
    authKey: 'api_key',
    enabled: true,
    endpoints: coinGeckoEndpoints
  },
  {
    id: 'binance',
    name: 'Binance',
    baseUrl: 'https://api.binance.com/api/v3',
    description: 'Binance cryptocurrency exchange',
    authType: 'header',
    authKey: 'X-MBX-APIKEY',
    enabled: true,
    endpoints: binanceEndpoints
  }
];

export default apiProviders;
