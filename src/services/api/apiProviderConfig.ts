
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
    endpoints: [
      {
        path: "/coins/markets",
        method: "GET",
        description: "List all supported coins with market data",
        parameters: {
          vs_currency: "currency (e.g., usd)",
          ids: "coin ids (comma-separated)",
          order: "sort order",
          per_page: "items per page",
          page: "page number",
          sparkline: "include sparkline data"
        }
      },
      {
        path: "/coins/{id}",
        method: "GET",
        description: "Get current data for a coin",
        parameters: {
          id: "coin id (e.g., bitcoin)",
          localization: "include localized data",
          tickers: "include ticker data",
          market_data: "include market data",
          community_data: "include community data",
          developer_data: "include developer data"
        }
      },
      {
        path: "/coins/{id}/market_chart",
        method: "GET",
        description: "Get historical market data",
        parameters: {
          id: "coin id (e.g., bitcoin)",
          vs_currency: "currency (e.g., usd)",
          days: "data up to number of days ago"
        }
      }
    ],
    rateLimit: 50,
    tier: "free",
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
    endpoints: [
      {
        path: "/price",
        method: "GET",
        description: "Single symbol price",
        parameters: {
          fsym: "from symbol",
          tsyms: "to symbols (comma-separated)"
        },
        authentication: true
      },
      {
        path: "/pricemulti",
        method: "GET",
        description: "Multiple symbol prices",
        parameters: {
          fsyms: "from symbols (comma-separated)",
          tsyms: "to symbols (comma-separated)"
        },
        authentication: true
      },
      {
        path: "/v2/histoday",
        method: "GET",
        description: "Daily OHLCV data",
        parameters: {
          fsym: "from symbol",
          tsym: "to symbol",
          limit: "number of data points",
          toTs: "end timestamp",
          aggregate: "data aggregation"
        },
        authentication: true
      }
    ],
    rateLimit: 100,
    tier: "standard",
    requiresAuth: true,
    apiKeyName: "api_key",
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
