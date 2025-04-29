
import { ApiProvider, ApiEndpoint } from "@/types/trading";

class ApiProviderManager {
  private providers: ApiProvider[] = [];
  private storageKey = 'crypto-app-api-providers';

  constructor() {
    this.loadProviders();
    
    // If no providers exist yet, initialize with defaults
    if (this.providers.length === 0) {
      this.resetToDefaults();
    }
  }

  private loadProviders(): void {
    try {
      const savedProviders = localStorage.getItem(this.storageKey);
      if (savedProviders) {
        this.providers = JSON.parse(savedProviders);
      }
    } catch (error) {
      console.error("Failed to load API providers:", error);
      this.providers = [];
    }
  }

  private saveProviders(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.providers));
    } catch (error) {
      console.error("Failed to save API providers:", error);
    }
  }

  resetToDefaults(): void {
    this.providers = [
      {
        id: "coingecko",
        name: "CoinGecko",
        baseUrl: "https://api.coingecko.com/api/v3",
        authMethod: "query",
        apiKeyName: "x_cg_pro_api_key",
        requiresAuth: false,
        enabled: true,
        priority: 1,
        endpoints: {
          marketData: "/coins/markets",
          coinData: "/coins/{id}",
          marketChart: "/coins/{id}/market_chart",
          search: "/search",
        },
        defaultHeaders: {}
      },
      {
        id: "cryptocompare",
        name: "CryptoCompare",
        baseUrl: "https://min-api.cryptocompare.com/data",
        authMethod: "header",
        apiKeyName: "authorization",
        requiresAuth: false,
        enabled: true,
        priority: 2,
        endpoints: {
          multipleSymbolsFullData: "/pricemultifull",
          historicalData: "/v2/histoday",
          topList: "/top/totalvolfull",
          news: "/v2/news/",
          technicalIndicator: "/tradingsignals/intotheblock/latest"
        },
        defaultHeaders: {
          "authorization": "Apikey {key}"
        }
      }
    ];
    this.saveProviders();
  }

  getAllProviders(): ApiProvider[] {
    return this.providers;
  }

  getEnabledProviders(): ApiProvider[] {
    return this.providers
      .filter(provider => provider.enabled)
      .sort((a, b) => a.priority - b.priority);
  }

  getPriorityProvider(): ApiProvider | undefined {
    return this.getEnabledProviders()[0];
  }

  getProviderById(id: string): ApiProvider | undefined {
    return this.providers.find(provider => provider.id === id);
  }

  toggleProviderEnabled(id: string): void {
    const provider = this.getProviderById(id);
    if (provider) {
      provider.enabled = !provider.enabled;
      this.saveProviders();
    }
  }

  setProviderApiKey(id: string, apiKey: string): void {
    const provider = this.getProviderById(id);
    if (provider) {
      provider.apiKey = apiKey;
      this.saveProviders();
    }
  }

  updateProvider(id: string, updates: Partial<ApiProvider>): void {
    const index = this.providers.findIndex(provider => provider.id === id);
    if (index >= 0) {
      this.providers[index] = { ...this.providers[index], ...updates };
      this.saveProviders();
    }
  }

  addProvider(provider: ApiProvider): void {
    // Ensure ID is unique
    if (this.getProviderById(provider.id)) {
      throw new Error(`Provider with ID '${provider.id}' already exists`);
    }
    
    this.providers.push(provider);
    this.saveProviders();
  }

  deleteProvider(id: string): void {
    // Don't delete built-in providers
    if (id === "coingecko") {
      throw new Error("Cannot delete built-in providers");
    }
    
    const initialLength = this.providers.length;
    this.providers = this.providers.filter(provider => provider.id !== id);
    
    if (this.providers.length === initialLength) {
      throw new Error(`Provider with ID '${id}' not found`);
    }
    
    this.saveProviders();
  }

  // Convert provider endpoints to array of ApiEndpoint objects
  getProviderEndpoints(providerId: string): ApiEndpoint[] {
    const provider = this.getProviderById(providerId);
    if (!provider) {
      return [];
    }

    return Object.entries(provider.endpoints).map(([id, path]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
      path,
      method: path.includes("historicalData") ? "GET" : "GET",
      description: `Endpoint for ${id}`
    }));
  }
}

export const apiProviderManager = new ApiProviderManager();
