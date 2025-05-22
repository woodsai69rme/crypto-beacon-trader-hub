
import { ApiProvider } from "@/types/trading";

// Default API providers configuration
const defaultProviders: ApiProvider[] = [
  {
    id: "coingecko",
    name: "CoinGecko",
    description: "Popular cryptocurrency data API",
    baseUrl: "https://api.coingecko.com/api/v3",
    website: "https://www.coingecko.com",
    docs: "https://www.coingecko.com/api/documentation",
    authRequired: false,
    enabled: true,
    requiresAuth: false,
    endpoints: [
      {
        path: "/coins/markets",
        method: "GET",
        description: "Get cryptocurrency prices and market data",
        requiresAuth: false,
      },
      {
        path: "/coins/{id}",
        method: "GET",
        description: "Get current data for a specific coin",
        requiresAuth: false,
      },
    ],
    priority: 1,
  },
  {
    id: "binance",
    name: "Binance",
    description: "Leading cryptocurrency exchange API",
    baseUrl: "https://api.binance.com/api",
    website: "https://www.binance.com",
    docs: "https://binance-docs.github.io/apidocs/",
    authRequired: true,
    apiKey: "",
    enabled: false,
    requiresAuth: true,
    apiKeyName: "X-MBX-APIKEY",
    authMethod: "header",
    endpoints: [
      {
        path: "/v3/ticker/price",
        method: "GET",
        description: "Latest price for a symbol",
        requiresAuth: false,
      },
      {
        path: "/v3/account",
        method: "GET",
        description: "Account information",
        requiresAuth: true,
      },
    ],
    priority: 2,
    defaultHeaders: {},
  }
];

// Local storage key
const STORAGE_KEY = "crypto-api-providers";

// API Provider Manager
export const apiProviderManager = {
  // Get all providers
  getAllProviders: (): ApiProvider[] => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : defaultProviders;
    } catch (error) {
      console.error("Error loading API providers:", error);
      return defaultProviders;
    }
  },

  // Get a specific provider by ID
  getProviderById: (id: string): ApiProvider | null => {
    try {
      const providers = apiProviderManager.getAllProviders();
      return providers.find(provider => provider.id === id) || null;
    } catch (error) {
      console.error(`Error getting provider ${id}:`, error);
      return null;
    }
  },

  // Add a new provider
  addProvider: (provider: ApiProvider): void => {
    try {
      const providers = apiProviderManager.getAllProviders();
      providers.push(provider);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
    } catch (error) {
      console.error("Error adding provider:", error);
    }
  },

  // Update a provider
  updateProvider: (id: string, updatedProvider: ApiProvider): void => {
    try {
      const providers = apiProviderManager.getAllProviders();
      const index = providers.findIndex(provider => provider.id === id);
      
      if (index !== -1) {
        providers[index] = updatedProvider;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
      }
    } catch (error) {
      console.error(`Error updating provider ${id}:`, error);
    }
  },

  // Toggle provider enabled status
  toggleProviderEnabled: (id: string): void => {
    try {
      const providers = apiProviderManager.getAllProviders();
      const index = providers.findIndex(provider => provider.id === id);
      
      if (index !== -1) {
        providers[index].enabled = !providers[index].enabled;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
      }
    } catch (error) {
      console.error(`Error toggling provider ${id}:`, error);
    }
  },

  // Delete a provider
  deleteProvider: (id: string): void => {
    try {
      // Cannot delete the default CoinGecko provider
      if (id === "coingecko") return;
      
      const providers = apiProviderManager.getAllProviders();
      const filteredProviders = providers.filter(provider => provider.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProviders));
    } catch (error) {
      console.error(`Error deleting provider ${id}:`, error);
    }
  },

  // Set API key for a provider
  setProviderApiKey: (id: string, apiKey: string): void => {
    try {
      const providers = apiProviderManager.getAllProviders();
      const index = providers.findIndex(provider => provider.id === id);
      
      if (index !== -1) {
        providers[index].apiKey = apiKey;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
      }
    } catch (error) {
      console.error(`Error setting API key for provider ${id}:`, error);
    }
  },

  // Reset to default providers
  resetToDefaults: (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProviders));
    } catch (error) {
      console.error("Error resetting providers:", error);
    }
  }
};
