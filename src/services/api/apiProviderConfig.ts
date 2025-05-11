
import { ApiProvider, ApiEndpoint } from '@/types/trading';

const apiProviders: ApiProvider[] = [
  {
    id: "coingecko",
    name: "CoinGecko",
    baseUrl: "https://api.coingecko.com/api/v3",
    description: "Cryptocurrency market data API",
    currentUsage: 0,
    maxUsage: 50,
    resetTime: "hourly",
    endpoint: "/coins/markets",
    status: "active",
    website: "https://www.coingecko.com",
    docs: "https://www.coingecko.com/en/api/documentation",
    isActive: true,
    apiKey: "",
    usageLimit: 50,
    authMethod: "query",
    apiKeyName: "x_cg_pro_api_key",
    defaultHeaders: {},
    enabled: true,
    requiresAuth: false,
    authRequired: false,
    endpoints: [
      {
        id: "markets",
        name: "Coin Markets",
        path: "/coins/markets",
        method: "GET",
        requiresAuth: false,
        description: "Get cryptocurrency prices, market cap, volume, and market related data"
      },
      {
        id: "coin",
        name: "Coin Data",
        path: "/coins/{id}",
        method: "GET",
        requiresAuth: false,
        description: "Get current data for a coin"
      }
    ]
  },
  {
    id: "binance",
    name: "Binance",
    baseUrl: "https://api.binance.com/api/v3",
    description: "Leading cryptocurrency exchange API",
    currentUsage: 0,
    maxUsage: 1200,
    resetTime: "minute",
    endpoint: "/ticker/price",
    status: "active",
    website: "https://www.binance.com",
    docs: "https://binance-docs.github.io/apidocs/",
    isActive: true,
    apiKey: "",
    usageLimit: 1200,
    authMethod: "header",
    apiKeyName: "X-MBX-APIKEY",
    defaultHeaders: {},
    enabled: false,
    requiresAuth: true,
    endpoints: [
      {
        id: "ticker",
        name: "Price Ticker",
        path: "/ticker/price",
        method: "GET",
        requiresAuth: false,
        description: "Get latest price for a symbol"
      },
      {
        id: "klines",
        name: "Klines/Candlestick Data",
        path: "/klines",
        method: "GET",
        requiresAuth: true,
        description: "Get kline/candlestick data for a symbol"
      }
    ]
  }
];

export default apiProviders;
