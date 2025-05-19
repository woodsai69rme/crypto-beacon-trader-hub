
import { ApiProvider, ApiEndpoint } from '@/types/trading';

export const coinGeckoEndpoints: Record<string, ApiEndpoint> = {
  "coins": {
    path: "/coins/markets",
    method: "GET",
    description: "Get cryptocurrency markets data",
    requiresAuth: false
  },
  "coin": {
    path: "/coins/{id}",
    method: "GET",
    description: "Get cryptocurrency details by id",
    requiresAuth: false
  },
  "ohlc": {
    path: "/coins/{id}/ohlc",
    method: "GET",
    description: "Get cryptocurrency OHLC (Open High Low Close) data",
    requiresAuth: false
  },
  "global": {
    path: "/global",
    method: "GET",
    description: "Get global cryptocurrency data",
    requiresAuth: false
  }
};

export const cryptoCompareEndpoints: Record<string, ApiEndpoint> = {
  "price": {
    path: "/data/price",
    method: "GET",
    description: "Get current price of a cryptocurrency",
    requiresAuth: false
  },
  "histoDay": {
    path: "/data/v2/histoday",
    method: "GET",
    description: "Get historical daily data",
    requiresAuth: false
  },
  "news": {
    path: "/data/v2/news/",
    method: "GET",
    description: "Get latest cryptocurrency news",
    requiresAuth: false
  }
};

export const defaultProviders: ApiProvider[] = [
  {
    id: "coingecko",
    name: "CoinGecko",
    baseUrl: "https://api.coingecko.com/api/v3",
    description: "Provides comprehensive cryptocurrency data",
    authType: "apiKey",
    authKey: "x_cg_pro_api_key",
    enabled: true,
    endpoints: coinGeckoEndpoints,
    rateLimit: 50
  },
  {
    id: "cryptocompare",
    name: "CryptoCompare",
    baseUrl: "https://min-api.cryptocompare.com",
    description: "Offers real-time cryptocurrency prices and historical data",
    authType: "apiKey",
    authKey: "api_key",
    enabled: false,
    endpoints: cryptoCompareEndpoints,
    rateLimit: 100
  }
];
