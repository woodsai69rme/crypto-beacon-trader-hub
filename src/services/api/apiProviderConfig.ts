
import { ApiProvider } from "@/types/trading";

const defaultProviders: ApiProvider[] = [
  {
    id: "coingecko",
    name: "CoinGecko",
    baseUrl: "https://api.coingecko.com/api/v3",
    description: "Free cryptocurrency data API",
    website: "https://coingecko.com",
    docs: "https://www.coingecko.com/api/documentation",
    authRequired: false,
    enabled: true,
    requiresAuth: false,
    rateLimit: 50,
    endpoints: {
      coins: "/coins/markets",
      coin: "/coins/{id}",
      price: "/simple/price",
      search: "/search",
      trending: "/search/trending"
    },
    defaultHeaders: {}
  },
  {
    id: "binance",
    name: "Binance",
    baseUrl: "https://api.binance.com",
    description: "Binance cryptocurrency exchange API",
    website: "https://binance.com",
    docs: "https://binance-docs.github.io/apidocs/",
    authRequired: true,
    apiKey: "",
    enabled: false,
    requiresAuth: true,
    apiKeyName: "X-MBX-APIKEY",
    authMethod: "header",
    priority: 5,
    endpoints: {
      ticker: "/api/v3/ticker/price",
      klines: "/api/v3/klines",
      depth: "/api/v3/depth",
      trades: "/api/v3/trades",
      exchangeInfo: "/api/v3/exchangeInfo"
    },
    defaultHeaders: {}
  }
];

// Simple in-memory store for API providers
class ApiProviderManager {
  private providers: ApiProvider[] = [];
  
  constructor() {
    this.loadFromLocalStorage();
    
    // If no providers were loaded, use defaults
    if (this.providers.length === 0) {
      this.providers = [...defaultProviders];
      this.saveToLocalStorage();
    }
  }
  
  private loadFromLocalStorage() {
    try {
      const savedProviders = localStorage.getItem('apiProviders');
      if (savedProviders) {
        this.providers = JSON.parse(savedProviders);
      }
    } catch (error) {
      console.error("Error loading API providers from localStorage:", error);
      this.providers = [...defaultProviders];
    }
  }
  
  private saveToLocalStorage() {
    try {
      localStorage.setItem('apiProviders', JSON.stringify(this.providers));
    } catch (error) {
      console.error("Error saving API providers to localStorage:", error);
    }
  }
  
  getAllProviders(): ApiProvider[] {
    return [...this.providers];
  }
  
  getProviderById(id: string): ApiProvider | undefined {
    return this.providers.find(provider => provider.id === id);
  }
  
  addProvider(provider: ApiProvider) {
    if (!provider.id) {
      throw new Error("Provider must have an ID");
    }
    
    if (this.providers.some(p => p.id === provider.id)) {
      throw new Error(`Provider with ID ${provider.id} already exists`);
    }
    
    this.providers.push(provider);
    this.saveToLocalStorage();
  }
  
  updateProvider(id: string, updatedProvider: Partial<ApiProvider>) {
    const index = this.providers.findIndex(provider => provider.id === id);
    
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    this.providers[index] = { ...this.providers[index], ...updatedProvider };
    this.saveToLocalStorage();
  }
  
  deleteProvider(id: string) {
    // Don't allow deletion of core providers
    if (id === "coingecko") {
      throw new Error("Cannot delete core provider");
    }
    
    const index = this.providers.findIndex(provider => provider.id === id);
    
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    this.providers.splice(index, 1);
    this.saveToLocalStorage();
  }
  
  toggleProviderEnabled(id: string) {
    const index = this.providers.findIndex(provider => provider.id === id);
    
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    this.providers[index].enabled = !this.providers[index].enabled;
    this.saveToLocalStorage();
  }
  
  setProviderApiKey(id: string, apiKey: string) {
    const index = this.providers.findIndex(provider => provider.id === id);
    
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    this.providers[index].apiKey = apiKey;
    this.saveToLocalStorage();
  }
  
  resetToDefaults() {
    this.providers = [...defaultProviders];
    this.saveToLocalStorage();
  }
}

export const apiProviderManager = new ApiProviderManager();
