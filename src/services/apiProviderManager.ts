
import { ApiProvider } from "@/types/trading";

// In-memory storage for API providers
let apiProviders: ApiProvider[] = [
  {
    id: "coingecko",
    name: "CoinGecko",
    baseUrl: "https://api.coingecko.com/api/v3",
    description: "Cryptocurrency data aggregator",
    endpoints: [
      {
        path: "/coins/markets",
        method: "GET",
        description: "Get market data for coins",
        parameters: [
          {
            name: "vs_currency",
            description: "The target currency of market data",
            required: true,
            type: "string",
            default: "usd"
          }
        ],
        isActive: true
      }
    ],
    isActive: true,
    website: "https://www.coingecko.com",
    docs: "https://www.coingecko.com/api/documentation",
    priority: 1,
    requiresAuth: false,
    authRequired: false
  },
  {
    id: "binance",
    name: "Binance",
    baseUrl: "https://api.binance.com/api",
    description: "Cryptocurrency exchange API",
    endpoints: [
      {
        path: "/v3/ticker/price",
        method: "GET",
        description: "Get latest price for a symbol",
        parameters: [
          {
            name: "symbol",
            description: "The trading pair symbol",
            required: false,
            type: "string"
          }
        ],
        isActive: true
      }
    ],
    isActive: true,
    website: "https://www.binance.com",
    docs: "https://binance-docs.github.io/apidocs/",
    priority: 2,
    requiresAuth: true,
    authRequired: true,
    authMethod: "apiKey",
    apiKeyName: "X-MBX-APIKEY"
  }
];

// CRUD operations for API providers
export const getApiProviders = (): ApiProvider[] => {
  return apiProviders;
};

export const getApiProviderById = (id: string): ApiProvider | undefined => {
  return apiProviders.find(provider => provider.id === id);
};

export const createApiProvider = (provider: ApiProvider): ApiProvider => {
  apiProviders.push(provider);
  return provider;
};

export const updateApiProvider = (id: string, updates: Partial<ApiProvider>): ApiProvider | undefined => {
  const index = apiProviders.findIndex(provider => provider.id === id);
  if (index !== -1) {
    apiProviders[index] = { ...apiProviders[index], ...updates };
    return apiProviders[index];
  }
  return undefined;
};

export const deleteApiProvider = (id: string): boolean => {
  const initialLength = apiProviders.length;
  apiProviders = apiProviders.filter(provider => provider.id !== id);
  return apiProviders.length < initialLength;
};

export const setApiKey = (providerId: string, apiKey: string): boolean => {
  const index = apiProviders.findIndex(provider => provider.id === providerId);
  if (index !== -1) {
    apiProviders[index].apiKey = apiKey;
    return true;
  }
  return false;
};

export const toggleApiProviderActive = (id: string): boolean => {
  const index = apiProviders.findIndex(provider => provider.id === id);
  if (index !== -1) {
    apiProviders[index].isActive = !apiProviders[index].isActive;
    return true;
  }
  return false;
};
