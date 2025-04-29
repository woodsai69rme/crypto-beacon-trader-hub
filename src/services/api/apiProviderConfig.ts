import { ApiProvider, ApiEndpoint } from "@/types/trading";

// Default API providers
const defaultProviders: ApiProvider[] = [
  {
    id: "coingecko",
    name: "CoinGecko",
    description: "Comprehensive cryptocurrency API with market data, charts, and more",
    baseUrl: "https://api.coingecko.com/api/v3",
    apiKey: "",
    enabled: true,
    endpoints: {
      "/coins/markets": "List all supported coins with market data",
      "/coins/{id}": "Get current data for a coin",
      "/coins/{id}/market_chart": "Get historical market data"
    },
    website: "https://www.coingecko.com",
    docs: "https://www.coingecko.com/api/documentation",
    authRequired: false,
    requiresAuth: false,
    priority: 1
  },
  {
    id: "cryptocompare",
    name: "CryptoCompare",
    description: "Real-time cryptocurrency data and trading API",
    baseUrl: "https://min-api.cryptocompare.com/data",
    apiKey: "",
    enabled: true,
    endpoints: {
      "/price": "Single symbol price",
      "/pricemulti": "Multiple symbol prices",
      "/v2/histoday": "Daily OHLCV data"
    },
    website: "https://www.cryptocompare.com",
    docs: "https://min-api.cryptocompare.com/documentation",
    authRequired: true,
    requiresAuth: true,
    apiKeyName: "api_key",
    authMethod: "header",
    priority: 2,
    defaultHeaders: {
      "Content-Type": "application/json"
    }
  }
];

// Manage API providers
class ApiProviderManager {
  private providers: ApiProvider[] = [];

  constructor() {
    // Load providers from localStorage or use defaults
    this.loadProviders();
  }

  private loadProviders(): void {
    try {
      const savedProviders = localStorage.getItem('apiProviders');
      if (savedProviders) {
        this.providers = JSON.parse(savedProviders);
      } else {
        this.providers = [...defaultProviders];
        this.saveProviders();
      }
    } catch (error) {
      console.error('Error loading API providers:', error);
      this.providers = [...defaultProviders];
    }
  }

  private saveProviders(): void {
    try {
      localStorage.setItem('apiProviders', JSON.stringify(this.providers));
    } catch (error) {
      console.error('Error saving API providers:', error);
    }
  }

  // Get all providers
  getAllProviders(): ApiProvider[] {
    return [...this.providers];
  }

  // Get a provider by ID
  getProviderById(id: string): ApiProvider | undefined {
    return this.providers.find(provider => provider.id === id);
  }

  // Get enabled providers (for API requests)
  getEnabledProviders(): ApiProvider[] {
    return this.providers
      .filter(provider => provider.enabled)
      .sort((a, b) => (a.priority || 999) - (b.priority || 999));
  }

  // Add a new provider
  addProvider(provider: ApiProvider): void {
    // Check if provider with the same ID already exists
    if (this.providers.some(p => p.id === provider.id)) {
      throw new Error(`Provider with ID ${provider.id} already exists`);
    }
    
    this.providers.push(provider);
    this.saveProviders();
  }

  // Update an existing provider
  updateProvider(id: string, updatedProvider: ApiProvider): void {
    const index = this.providers.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    this.providers[index] = { ...updatedProvider };
    this.saveProviders();
  }

  // Delete a provider
  deleteProvider(id: string): void {
    // Don't allow deletion of core providers
    if (id === 'coingecko') {
      throw new Error('Cannot delete core provider');
    }
    
    const index = this.providers.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    this.providers.splice(index, 1);
    this.saveProviders();
  }

  // Enable/disable a provider
  toggleProviderEnabled(id: string): void {
    const provider = this.providers.find(p => p.id === id);
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    provider.enabled = !provider.enabled;
    this.saveProviders();
  }

  // Update API key for a provider
  setProviderApiKey(id: string, apiKey: string): void {
    const provider = this.providers.find(p => p.id === id);
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    
    provider.apiKey = apiKey;
    this.saveProviders();
  }

  // Reset to default providers
  resetToDefaults(): void {
    this.providers = [...defaultProviders];
    this.saveProviders();
  }
}

export const apiProviderManager = new ApiProviderManager();
