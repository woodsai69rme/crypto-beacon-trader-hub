
import { ApiProvider } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

// Define initial API providers
const initialProviders: ApiProvider[] = [
  {
    id: "coingecko",
    name: "CoinGecko",
    baseUrl: "https://api.coingecko.com/api/v3",
    authMethod: "header",
    apiKeyName: "x-cg-pro-api-key",
    requiresAuth: false,
    enabled: true,
    priority: 1,
    endpoints: {
      marketData: "/coins/markets",
      coinData: "/coins/{id}",
      marketChart: "/coins/{id}/market_chart",
      search: "/search",
      trending: "/search/trending",
      global: "/global"
    }
  },
  {
    id: "coinmarketcap",
    name: "CoinMarketCap",
    baseUrl: "https://pro-api.coinmarketcap.com/v1",
    authMethod: "header",
    apiKeyName: "X-CMC_PRO_API_KEY",
    requiresAuth: true,
    enabled: false,
    priority: 2,
    endpoints: {
      marketData: "/cryptocurrency/listings/latest",
      coinData: "/cryptocurrency/quotes/latest",
      global: "/global-metrics/quotes/latest",
      marketChart: "/cryptocurrency/quotes/historical"
    }
  },
  {
    id: "cryptocompare",
    name: "CryptoCompare",
    baseUrl: "https://min-api.cryptocompare.com/data",
    authMethod: "header",
    apiKeyName: "authorization",
    requiresAuth: false,
    enabled: true,
    priority: 3,
    endpoints: {
      marketData: "/top/mktcapfull",
      coinData: "/pricemultifull",
      marketChart: "/v2/histoday",
      global: "/pricemulti"
    },
    defaultHeaders: {
      "authorization": "Apikey {key}"
    }
  },
  {
    id: "messari",
    name: "Messari",
    baseUrl: "https://data.messari.io/api/v1",
    authMethod: "header",
    apiKeyName: "x-messari-api-key",
    requiresAuth: false,
    enabled: false,
    priority: 4,
    endpoints: {
      marketData: "/assets",
      coinData: "/assets/{id}/metrics",
      marketChart: "/assets/{id}/metrics/{metric}/time-series",
      global: "/markets"
    }
  }
];

// Load providers from local storage or use the initial list
const loadProviders = (): ApiProvider[] => {
  try {
    const stored = localStorage.getItem('api-providers');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading API providers:', error);
  }
  return initialProviders;
};

// Save providers to local storage
const saveProviders = (providers: ApiProvider[]): void => {
  try {
    localStorage.setItem('api-providers', JSON.stringify(providers));
  } catch (error) {
    console.error('Error saving API providers:', error);
  }
};

class ApiProviderManager {
  private providers: ApiProvider[];

  constructor() {
    this.providers = loadProviders();
  }

  // Get all providers
  public getAllProviders(): ApiProvider[] {
    return [...this.providers];
  }

  // Get enabled providers
  public getEnabledProviders(): ApiProvider[] {
    return this.providers.filter(provider => provider.enabled)
      .sort((a, b) => a.priority - b.priority);
  }

  // Get provider by id
  public getProviderById(id: string): ApiProvider | undefined {
    return this.providers.find(provider => provider.id === id);
  }

  // Get provider with highest priority
  public getPriorityProvider(): ApiProvider | undefined {
    const enabledProviders = this.getEnabledProviders();
    return enabledProviders.length > 0 ? enabledProviders[0] : undefined;
  }

  // Add new provider
  public addProvider(provider: ApiProvider): void {
    if (this.getProviderById(provider.id)) {
      throw new Error(`Provider with ID '${provider.id}' already exists`);
    }
    
    this.providers.push(provider);
    saveProviders(this.providers);
    
    toast({
      title: "API Provider Added",
      description: `${provider.name} has been added to your providers`
    });
  }

  // Update provider
  public updateProvider(id: string, updates: Partial<ApiProvider>): void {
    const index = this.providers.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider with ID '${id}' not found`);
    }
    
    this.providers[index] = {
      ...this.providers[index],
      ...updates
    };
    
    saveProviders(this.providers);
    
    toast({
      title: "API Provider Updated",
      description: `${this.providers[index].name} has been updated`
    });
  }

  // Delete provider
  public deleteProvider(id: string): void {
    const index = this.providers.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider with ID '${id}' not found`);
    }
    
    const name = this.providers[index].name;
    this.providers.splice(index, 1);
    saveProviders(this.providers);
    
    toast({
      title: "API Provider Removed",
      description: `${name} has been removed from your providers`
    });
  }

  // Set API key for provider
  public setProviderApiKey(id: string, apiKey: string): void {
    const provider = this.getProviderById(id);
    if (!provider) {
      throw new Error(`Provider with ID '${id}' not found`);
    }
    
    provider.apiKey = apiKey;
    saveProviders(this.providers);
    
    toast({
      title: "API Key Updated",
      description: `API key for ${provider.name} has been updated`
    });
  }

  // Toggle provider enabled status
  public toggleProviderEnabled(id: string): void {
    const provider = this.getProviderById(id);
    if (!provider) {
      throw new Error(`Provider with ID '${id}' not found`);
    }
    
    provider.enabled = !provider.enabled;
    saveProviders(this.providers);
    
    toast({
      title: provider.enabled ? "Provider Enabled" : "Provider Disabled",
      description: `${provider.name} is now ${provider.enabled ? 'enabled' : 'disabled'}`
    });
  }

  // Reset to default providers
  public resetToDefaults(): void {
    this.providers = [...initialProviders];
    saveProviders(this.providers);
    
    toast({
      title: "API Providers Reset",
      description: "All API providers have been reset to default settings"
    });
  }
}

export const apiProviderManager = new ApiProviderManager();
