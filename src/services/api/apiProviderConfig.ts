
import { ApiProvider } from "@/types/trading";

// Default API providers
const defaultProviders: ApiProvider[] = [
  {
    id: "coingecko",
    name: "CoinGecko",
    baseUrl: "https://api.coingecko.com/api/v3",
    description: "CoinGecko API provides cryptocurrency data such as prices, market data, and more.",
    website: "https://www.coingecko.com",
    docs: "https://www.coingecko.com/api/documentation",
    authRequired: false,
    apiKey: "",
    enabled: true,
    requiresAuth: false,
    endpoints: [
      {
        path: "/coins/markets",
        method: "GET",
        description: "List all supported coins with price, market cap, volume, and market related data",
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: "100",
          page: "1",
          sparkline: "false"
        },
        requiresAuth: false
      },
      {
        path: "/coins/{id}",
        method: "GET",
        description: "Get current data for a coin",
        params: {
          id: "",
          localization: "false",
          tickers: "false",
          market_data: "true",
          community_data: "false",
          developer_data: "false"
        },
        requiresAuth: false
      },
      {
        path: "/coins/{id}/market_chart",
        method: "GET",
        description: "Get historical market data for a coin",
        params: {
          id: "",
          vs_currency: "usd",
          days: "30"
        },
        requiresAuth: false
      },
      {
        path: "/search",
        method: "GET",
        description: "Search for coins, categories and markets listed on CoinGecko",
        params: {
          query: ""
        },
        requiresAuth: false
      }
    ],
    defaultHeaders: {},
    priority: 1,
    tier: "free",
    rateLimit: 10
  }
];

// Local storage keys
const PROVIDERS_KEY = "api_providers";

// Helper functions
const getStoredProviders = (): ApiProvider[] => {
  try {
    const stored = localStorage.getItem(PROVIDERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading stored API providers:", error);
  }
  return defaultProviders;
};

const saveProviders = (providers: ApiProvider[]): void => {
  try {
    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(providers));
  } catch (error) {
    console.error("Error saving API providers:", error);
  }
};

// API Provider Manager
export const apiProviderManager = {
  /**
   * Get all providers
   */
  getAllProviders: (): ApiProvider[] => {
    return getStoredProviders();
  },

  /**
   * Get all enabled providers
   */
  getEnabledProviders: (): ApiProvider[] => {
    return getStoredProviders().filter(p => p.enabled);
  },

  /**
   * Get provider by ID
   */
  getProviderById: (id: string): ApiProvider | undefined => {
    return getStoredProviders().find(p => p.id === id);
  },

  /**
   * Get the highest priority enabled provider
   */
  getPriorityProvider: (): ApiProvider | undefined => {
    const enabledProviders = apiProviderManager.getEnabledProviders();
    if (enabledProviders.length === 0) return undefined;
    
    return enabledProviders.reduce((prev, current) => {
      return (prev.priority || 999) < (current.priority || 999) ? prev : current;
    });
  },

  /**
   * Add a new provider
   */
  addProvider: (provider: ApiProvider): void => {
    const providers = getStoredProviders();
    providers.push(provider);
    saveProviders(providers);
  },

  /**
   * Update an existing provider
   */
  updateProvider: (id: string, updatedProvider: ApiProvider): void => {
    const providers = getStoredProviders();
    const index = providers.findIndex(p => p.id === id);
    
    if (index !== -1) {
      providers[index] = { ...providers[index], ...updatedProvider };
      saveProviders(providers);
    }
  },

  /**
   * Delete a provider
   */
  deleteProvider: (id: string): void => {
    const providers = getStoredProviders();
    const newProviders = providers.filter(p => p.id !== id);
    saveProviders(newProviders);
  },

  /**
   * Toggle a provider's enabled status
   */
  toggleProviderEnabled: (id: string): void => {
    const providers = getStoredProviders();
    const index = providers.findIndex(p => p.id === id);
    
    if (index !== -1) {
      providers[index].enabled = !providers[index].enabled;
      saveProviders(providers);
    }
  },

  /**
   * Set a provider's API key
   */
  setProviderApiKey: (id: string, apiKey: string): void => {
    const providers = getStoredProviders();
    const index = providers.findIndex(p => p.id === id);
    
    if (index !== -1) {
      providers[index].apiKey = apiKey;
      saveProviders(providers);
    }
  },

  /**
   * Reset all providers to defaults
   */
  resetToDefaults: (): void => {
    saveProviders(defaultProviders);
  }
};

// Initialize with defaults if no providers are stored
if (!localStorage.getItem(PROVIDERS_KEY)) {
  saveProviders(defaultProviders);
}
