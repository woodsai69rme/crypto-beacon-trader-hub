
import { ApiProvider } from "@/types/trading";

class ApiProviderManager {
  private providers: ApiProvider[] = [];
  private localStorage: Storage | null = null;
  private storageKey = 'crypto_api_providers';

  constructor() {
    // Initialize with default providers when in browser environment
    if (typeof window !== 'undefined') {
      this.localStorage = window.localStorage;
      this.initializeProviders();
    }
  }

  private initializeProviders() {
    try {
      const storedProviders = this.localStorage?.getItem(this.storageKey);
      if (storedProviders) {
        this.providers = JSON.parse(storedProviders);
      } else {
        this.resetToDefaults();
      }
    } catch (error) {
      console.error('Error initializing API providers:', error);
      this.resetToDefaults();
    }
  }

  public resetToDefaults() {
    this.providers = [
      {
        id: "coingecko",
        name: "CoinGecko",
        description: "Free crypto API with comprehensive market data",
        baseUrl: "https://api.coingecko.com/api/v3",
        website: "https://www.coingecko.com",
        docs: "https://www.coingecko.com/api/documentation",
        authRequired: false,
        requiresAuth: false,
        enabled: true,
        priority: 1,
        apiKeyName: "x_cg_pro_api_key",
        authMethod: "header",
        endpoints: [
          {
            path: "/coins/markets",
            method: "GET",
            description: "Get cryptocurrency prices",
            requiresAuth: false
          },
          {
            path: "/coins/{id}",
            method: "GET",
            description: "Get coin details",
            requiresAuth: false
          }
        ],
        defaultHeaders: {}
      },
      {
        id: "binance",
        name: "Binance",
        description: "Leading cryptocurrency exchange API",
        baseUrl: "https://api.binance.com/api",
        website: "https://www.binance.com",
        docs: "https://binance-docs.github.io/apidocs",
        authRequired: true,
        requiresAuth: true,
        apiKey: "",
        enabled: false,
        priority: 2,
        apiKeyName: "X-MBX-APIKEY",
        authMethod: "header",
        endpoints: [
          {
            path: "/v3/ticker/price",
            method: "GET",
            description: "Get symbol price ticker",
            requiresAuth: false
          },
          {
            path: "/v3/account",
            method: "GET",
            description: "Get account information",
            requiresAuth: true
          }
        ],
        defaultHeaders: {}
      }
    ];
    
    this.saveProviders();
  }

  private saveProviders() {
    if (this.localStorage) {
      this.localStorage.setItem(this.storageKey, JSON.stringify(this.providers));
    }
  }

  public getAllProviders(): ApiProvider[] {
    return this.providers;
  }

  public getProviderById(id: string): ApiProvider | null {
    const provider = this.providers.find(p => p.id === id);
    return provider || null;
  }

  public addProvider(provider: ApiProvider) {
    if (this.getProviderById(provider.id)) {
      throw new Error(`Provider with ID ${provider.id} already exists`);
    }
    
    this.providers.push(provider);
    this.saveProviders();
  }

  public updateProvider(id: string, updates: Partial<ApiProvider>) {
    const index = this.providers.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    // Update the provider while preserving the id
    this.providers[index] = { ...this.providers[index], ...updates, id };
    this.saveProviders();
  }

  public deleteProvider(id: string) {
    // Don't allow deletion of the default provider
    if (id === "coingecko") {
      throw new Error("Cannot delete the default provider");
    }
    
    const index = this.providers.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    this.providers = this.providers.filter(p => p.id !== id);
    this.saveProviders();
  }

  public toggleProviderEnabled(id: string) {
    const provider = this.getProviderById(id);
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    provider.enabled = !provider.enabled;
    this.saveProviders();
  }

  public setProviderApiKey(id: string, apiKey: string) {
    const provider = this.getProviderById(id);
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    provider.apiKey = apiKey;
    this.saveProviders();
  }
}

export const apiProviderManager = new ApiProviderManager();
