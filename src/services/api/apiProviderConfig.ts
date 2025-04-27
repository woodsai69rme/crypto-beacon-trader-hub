
import type { ApiProvider } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

// Default API providers
export const defaultApiProviders: ApiProvider[] = [
  {
    id: "coingecko-free",
    name: "CoinGecko (Free)",
    baseUrl: "https://api.coingecko.com/api/v3",
    authMethod: "none",
    requiresAuth: false,
    endpoints: {
      marketData: "/coins/markets",
      coinData: "/coins",
      marketChart: "/coins/{id}/market_chart",
      search: "/search",
      trending: "/search/trending",
    },
    enabled: true,
    priority: 2
  },
  {
    id: "coingecko-pro",
    name: "CoinGecko Pro",
    baseUrl: "https://pro-api.coingecko.com/api/v3",
    apiKeyName: "x_cg_pro_api_key",
    authMethod: "header",
    requiresAuth: true,
    endpoints: {
      marketData: "/coins/markets",
      coinData: "/coins",
      marketChart: "/coins/{id}/market_chart",
      search: "/search",
      trending: "/search/trending",
    },
    enabled: false,
    priority: 1
  },
  {
    id: "coinmarketcap",
    name: "CoinMarketCap",
    baseUrl: "https://pro-api.coinmarketcap.com/v1",
    apiKeyName: "X-CMC_PRO_API_KEY",
    authMethod: "header",
    requiresAuth: true,
    endpoints: {
      marketData: "/cryptocurrency/listings/latest",
      coinData: "/cryptocurrency/info",
      marketChart: "/cryptocurrency/quotes/historical",
    },
    enabled: false,
    priority: 1
  },
  {
    id: "cryptocompare",
    name: "CryptoCompare",
    baseUrl: "https://min-api.cryptocompare.com/data",
    apiKeyName: "authorization",
    defaultHeaders: {
      "authorization": "Apikey {key}"
    },
    authMethod: "header",
    requiresAuth: true,
    endpoints: {
      marketData: "/top/mktcapfull",
      coinData: "/coin/generalinfo",
      priceMulti: "/pricemulti",
      historicalData: "/v2/histoday",
    },
    enabled: true,
    priority: 3
  }
];

class ApiProviderManager {
  private providers: ApiProvider[] = [];
  private storageKey = "api-providers";
  
  constructor() {
    this.loadProviders();
  }
  
  private loadProviders(): void {
    try {
      const storedProviders = localStorage.getItem(this.storageKey);
      if (storedProviders) {
        this.providers = JSON.parse(storedProviders);
      } else {
        this.providers = [...defaultApiProviders];
        this.saveProviders();
      }
    } catch (error) {
      console.error("Failed to load API providers:", error);
      this.providers = [...defaultApiProviders];
    }
  }
  
  private saveProviders(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.providers));
    } catch (error) {
      console.error("Failed to save API providers:", error);
    }
  }
  
  public getAllProviders(): ApiProvider[] {
    return [...this.providers];
  }
  
  public getEnabledProviders(): ApiProvider[] {
    return this.providers.filter(p => p.enabled);
  }
  
  public getProviderById(id: string): ApiProvider | undefined {
    return this.providers.find(p => p.id === id);
  }
  
  public getPriorityProvider(): ApiProvider | undefined {
    return [...this.providers]
      .filter(p => p.enabled)
      .sort((a, b) => a.priority - b.priority)[0];
  }
  
  public addProvider(provider: ApiProvider): void {
    if (this.providers.some(p => p.id === provider.id)) {
      throw new Error(`Provider with ID '${provider.id}' already exists`);
    }
    
    this.providers.push(provider);
    this.saveProviders();
    
    toast({
      title: "API Provider Added",
      description: `Successfully added ${provider.name}`,
    });
  }
  
  public updateProvider(id: string, updates: Partial<ApiProvider>): void {
    const index = this.providers.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider with ID '${id}' not found`);
    }
    
    this.providers[index] = {
      ...this.providers[index],
      ...updates
    };
    
    this.saveProviders();
    
    toast({
      title: "API Provider Updated",
      description: `Successfully updated ${this.providers[index].name}`,
    });
  }
  
  public setProviderApiKey(id: string, apiKey: string): void {
    const provider = this.getProviderById(id);
    if (!provider) {
      throw new Error(`Provider with ID '${id}' not found`);
    }
    
    this.updateProvider(id, { apiKey });
    
    toast({
      title: "API Key Updated",
      description: `Successfully updated API key for ${provider.name}`,
    });
  }
  
  public toggleProviderEnabled(id: string): void {
    const provider = this.getProviderById(id);
    if (!provider) {
      throw new Error(`Provider with ID '${id}' not found`);
    }
    
    this.updateProvider(id, { enabled: !provider.enabled });
  }
  
  public removeProvider(id: string): void {
    // Don't allow removing default providers, just disable them
    const isDefaultProvider = defaultApiProviders.some(p => p.id === id);
    
    if (isDefaultProvider) {
      const index = this.providers.findIndex(p => p.id === id);
      if (index !== -1) {
        this.providers[index].enabled = false;
        this.saveProviders();
        
        toast({
          title: "API Provider Disabled",
          description: "Default providers cannot be removed, but it has been disabled.",
        });
      }
      return;
    }
    
    const initialLength = this.providers.length;
    this.providers = this.providers.filter(p => p.id !== id);
    
    if (this.providers.length !== initialLength) {
      this.saveProviders();
      
      toast({
        title: "API Provider Removed",
        description: "Successfully removed the API provider.",
      });
    }
  }
}

export const apiProviderManager = new ApiProviderManager();
