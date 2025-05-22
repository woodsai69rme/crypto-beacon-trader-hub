import { ApiProvider, ApiEndpoint } from '@/types/api';

// Update this function to use proper ApiEndpoint type
export const createEndpoint = (
  path: string,
  method: string,
  description: string,
  requiresAuth: boolean,
  parameters: ApiEndpoint['parameters'] = []
): ApiEndpoint => {
  return {
    path,
    method,
    description,
    requiresAuth,
    parameters
  };
};

// Mock API providers
const providers: ApiProvider[] = [
  {
    id: "coingecko",
    name: "CoinGecko",
    baseUrl: "https://api.coingecko.com/api/v3",
    description: "Provides comprehensive cryptocurrency data",
    authType: "apiKey",
    authKey: "x_cg_pro_api_key",
    enabled: true,
    endpoints: {
      "coins": {
        path: "/coins/markets",
        method: "GET",
        description: "Get cryptocurrency markets data",
        requiresAuth: false,
        parameters: [{
          name: "vs_currency",
          description: "The target currency of prices",
          required: false,
          type: "string",
          default: "usd"
        }, {
          name: "order",
          description: "Sort results by field",
          required: false,
          type: "string",
          default: "market_cap_desc"
        }, {
          name: "per_page",
          description: "Number of results per page",
          required: false,
          type: "number",
          default: "100"
        }, {
          name: "page",
          description: "Page through results",
          required: false,
          type: "number",
          default: "1"
        }, {
          name: "sparkline",
          description: "Include sparkline 7d data",
          required: false,
          type: "boolean",
          default: "false"
        }]
      },
      "coin": {
        path: "/coins/{id}",
        method: "GET",
        description: "Get cryptocurrency details by id",
        requiresAuth: false,
        parameters: [{
          name: "id",
          description: "The cryptocurrency id",
          required: true,
          type: "string"
        }, {
          name: "localization",
          description: "Include localization data",
          required: false,
          type: "boolean",
          default: "false"
        }, {
          name: "tickers",
          description: "Include ticker data",
          required: false,
          type: "boolean",
          default: "false"
        }, {
          name: "market_data",
          description: "Include market data",
          required: false,
          type: "boolean",
          default: "true"
        }, {
          name: "community_data",
          description: "Include community data",
          required: false,
          type: "boolean",
          default: "false"
        }, {
          name: "developer_data",
          description: "Include developer data",
          required: false,
          type: "boolean",
          default: "false"
        }, {
          name: "sparkline",
          description: "Include sparkline 7d data",
          required: false,
          type: "boolean",
          default: "false"
        }]
      },
      "ohlc": {
        path: "/coins/{id}/ohlc",
        method: "GET",
        description: "Get cryptocurrency OHLC (Open High Low Close) data",
        requiresAuth: false,
        parameters: [{
          name: "id",
          description: "The cryptocurrency id",
          required: true,
          type: "string"
        }, {
          name: "vs_currency",
          description: "The target currency of prices",
          required: false,
          type: "string",
          default: "usd"
        }, {
          name: "days",
          description: "Data up to number of days ago (1/7/14/30/90/180/365)",
          required: true,
          type: "string"
        }]
      }
    },
    rateLimit: 50
  },
  {
    id: "cryptocompare",
    name: "CryptoCompare",
    baseUrl: "https://min-api.cryptocompare.com/data/v2",
    description: "Provides real-time and historical cryptocurrency data",
    authType: "apiKey",
    authKey: "api_key",
    enabled: false,
    endpoints: {
      "marketData": {
        path: "/histoday",
        method: "GET",
        description: "Get historical daily market data for a cryptocurrency",
        requiresAuth: false,
        parameters: [{
          name: "fsym",
          description: "The cryptocurrency symbol",
          required: true,
          type: "string",
          default: "BTC"
        }, {
          name: "tsym",
          description: "The target currency symbol",
          required: false,
          type: "string",
          default: "USD"
        }, {
          name: "limit",
          description: "The number of data points to return",
          required: false,
          type: "number",
          default: "30"
        }]
      },
      "price": {
        path: "/price",
        method: "GET",
        description: "Get the current price of a cryptocurrency",
        requiresAuth: false,
        parameters: [{
          name: "fsym",
          description: "The cryptocurrency symbol",
          required: true,
          type: "string",
          default: "BTC"
        }, {
          name: "tsyms",
          description: "The target currency symbols (comma separated)",
          required: false,
          type: "string",
          default: "USD"
        }]
      },
      "news": {
        path: "/news/",
        method: "GET",
        description: "Get the latest cryptocurrency news",
        requiresAuth: false,
        parameters: [{
          name: "categories",
          description: "Categories of news to retrieve",
          required: false,
          type: "string",
          default: "Blockchain, Cryptocurrency"
        }, {
          name: "feeds",
          description: "News feeds to retrieve",
          required: false,
          type: "string"
        }, {
          name: "limit",
          description: "The number of news items to return",
          required: false,
          type: "number",
          default: "10"
        }]
      }
    },
    rateLimit: 30
  },
  {
    id: "localai",
    name: "Local AI Model",
    baseUrl: "http://localhost:8080",
    description: "Access a locally hosted AI model for trading signals",
    authType: "header",
    authKey: "Authorization",
    enabled: false,
    endpoints: {
      "marketData": {
        path: "/market/data",
        method: "GET",
        description: "Get current market data for cryptocurrencies",
        parameters: [{
          name: "symbol",
          description: "Cryptocurrency symbol",
          required: true,
          type: "string",
          default: "BTC"
        }],
        isActive: true,
        requiresAuth: true
      },
      "tradingSignal": {
        path: "/trading/signal",
        method: "POST",
        description: "Get a trading signal from the AI model",
        requiresAuth: true,
        parameters: [{
          name: "strategy",
          description: "The trading strategy to use",
          required: true,
          type: "string",
          default: "trend-following"
        }, {
          name: "symbol",
          description: "The cryptocurrency symbol",
          required: true,
          type: "string",
          default: "BTC"
        }, {
          name: "timeframe",
          description: "The timeframe for the data",
          required: false,
          type: "string",
          default: "1h"
        }],
        isActive: true
      },
      "optimizeStrategy": {
        path: "/optimize/strategy",
        method: "POST",
        description: "Optimize a trading strategy using the AI model",
        requiresAuth: true,
        parameters: [{
          name: "strategy",
          description: "The trading strategy to optimize",
          required: true,
          type: "string"
        }, {
          name: "symbol",
          description: "The cryptocurrency symbol",
          required: true,
          type: "string"
        }, {
          name: "timeframe",
          description: "The timeframe for the data",
          required: false,
          type: "string",
          default: "1h"
        }],
        isActive: true
      }
    },
    rateLimit: 10
  }
];

const endpoints: Record<string, ApiEndpoint> = {
  "marketData": {
    path: "/market/data",
    method: "GET",
    description: "Get current market data for cryptocurrencies",
    parameters: [{
      name: "symbol",
      description: "Cryptocurrency symbol",
      required: true,
      type: "string",
      default: "BTC"
    }],
    isActive: true,
    requiresAuth: false
  },
  "tradingSignal": {
    path: "/trading/signal",
    method: "POST",
    description: "Get a trading signal from the AI model",
    requiresAuth: true,
    parameters: [{
      name: "strategy",
      description: "The trading strategy to use",
      required: true,
      type: "string",
      default: "trend-following"
    }, {
      name: "symbol",
      description: "The cryptocurrency symbol",
      required: true,
      type: "string"
    }, {
      name: "timeframe",
      description: "The timeframe for the data",
      required: false,
      type: "string",
      default: "1h"
    }],
    isActive: true
  },
  "optimizeStrategy": {
    path: "/optimize/strategy",
    method: "POST",
    description: "Optimize a trading strategy using the AI model",
    requiresAuth: true,
    parameters: [{
      name: "strategy",
      description: "The trading strategy to optimize",
      required: true,
      type: "string"
    }, {
      name: "symbol",
      description: "The cryptocurrency symbol",
      required: true,
      type: "string"
    }, {
      name: "timeframe",
      description: "The timeframe for the data",
      required: false,
      type: "string",
      default: "1h"
    }],
    isActive: true
  }
};

const authType: "header" | "query" | "apiKey" = "apiKey";

const providerManager = {
  getAllProviders: () => [...providers],
  getProviderById: (id: string) => providers.find(p => p.id === id) || providers[0],
  addProvider: (provider: ApiProvider) => {
    providers.push(provider);
  },
  updateProvider: (id: string, updatedProvider: ApiProvider) => {
    const index = providers.findIndex(p => p.id === id);
    if (index !== -1) {
      providers[index] = updatedProvider;
    }
  },
  toggleProviderEnabled: (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (provider) {
      provider.enabled = !provider.enabled;
    }
  },
  deleteProvider: (id: string) => {
    const index = providers.findIndex(p => p.id === id);
    if (index !== -1) {
      providers.splice(index, 1);
    }
  },
  setProviderApiKey: (id: string, apiKey: string) => {
    const provider = providers.find(p => p.id === id);
    if (provider) {
      provider.apiKey = apiKey;
    }
  },
  getPriorityProvider: () => {
    return providers.find(p => p.enabled) || providers[0];
  },
  getEnabledProviders: () => providers.filter(p => p.enabled)
};

export default providerManager;
