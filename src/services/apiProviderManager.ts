
import { v4 as uuidv4 } from 'uuid';
import { ApiEndpoint } from '@/types/trading';

// Mock API providers and endpoints
const mockProviders = [
  {
    id: 'coingecko',
    name: 'CoinGecko',
    endpoints: [
      {
        id: uuidv4(),
        name: 'Markets Data',
        url: 'https://api.coingecko.com/api/v3/coins/markets',
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: '100', page: '1' },
        rateLimit: 50,
        usageCount: 12,
        lastUsed: new Date().toISOString(),
        category: 'market',
        description: 'Get list of coins with market data',
        isActive: true
      },
      {
        id: uuidv4(),
        name: 'Coin Details',
        url: 'https://api.coingecko.com/api/v3/coins/{id}',
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        rateLimit: 50,
        usageCount: 8,
        lastUsed: new Date().toISOString(),
        category: 'coin',
        description: 'Get current data for a coin',
        isActive: true
      }
    ]
  },
  {
    id: 'coincap',
    name: 'CoinCap',
    endpoints: [
      {
        id: uuidv4(),
        name: 'Assets',
        url: 'https://api.coincap.io/v2/assets',
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        rateLimit: 100,
        usageCount: 5,
        lastUsed: new Date().toISOString(),
        category: 'market',
        description: 'Get all assets',
        isActive: true
      }
    ]
  },
  {
    id: 'binance',
    name: 'Binance',
    endpoints: [
      {
        id: uuidv4(),
        name: 'Ticker Price',
        url: 'https://api.binance.com/api/v3/ticker/price',
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        rateLimit: 1200,
        usageCount: 150,
        lastUsed: new Date().toISOString(),
        category: 'price',
        description: 'Get latest price for a symbol or symbols',
        isActive: true
      },
      {
        id: uuidv4(),
        name: 'Klines (Candlesticks)',
        url: 'https://api.binance.com/api/v3/klines',
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        params: { symbol: 'BTCUSDT', interval: '1h' },
        rateLimit: 1200,
        usageCount: 78,
        lastUsed: new Date().toISOString(),
        category: 'chart',
        description: 'Get candlestick data for a specific trading pair',
        isActive: true
      }
    ]
  }
];

// Combine all endpoints from providers
let allEndpoints: ApiEndpoint[] = mockProviders.flatMap(provider =>
  provider.endpoints.map(endpoint => ({
    ...endpoint,
    provider: provider.name
  }))
);

// Mock API Manager Service
const ApiProviderManager = {
  // Get all API providers
  getProviders: () => {
    return mockProviders;
  },
  
  // Get all endpoints
  getEndpoints: () => {
    return allEndpoints;
  },
  
  // Get endpoints filtered by provider
  getProviderEndpoints: (providerId: string) => {
    const provider = mockProviders.find(p => p.id === providerId);
    return provider ? provider.endpoints : [];
  },
  
  // Get endpoints by category
  getEndpointsByCategory: (category: string) => {
    return allEndpoints.filter(endpoint => endpoint.category === category);
  },
  
  // Add a new endpoint
  addEndpoint: (
    providerId: string,
    name: string,
    url: string,
    method: string,
    category: string,
    description: string,
    headers?: Record<string, string>,
    params?: Record<string, string>,
    rateLimit: number = 60
  ) => {
    const newEndpoint: ApiEndpoint = {
      id: uuidv4(),
      name,
      url,
      method,
      headers,
      params,
      rateLimit,
      usageCount: 0,
      category,
      description,
      isActive: true
    };
    
    const providerIndex = mockProviders.findIndex(p => p.id === providerId);
    
    if (providerIndex >= 0) {
      mockProviders[providerIndex].endpoints.push(newEndpoint);
      allEndpoints = mockProviders.flatMap(provider =>
        provider.endpoints.map(endpoint => ({
          ...endpoint,
          provider: provider.name
        }))
      );
      return newEndpoint;
    }
    
    return null;
  },
  
  // Update an endpoint
  updateEndpoint: (updatedEndpoint: ApiEndpoint) => {
    const providerIndex = mockProviders.findIndex(p => 
      p.endpoints.some(e => e.id === updatedEndpoint.id)
    );
    
    if (providerIndex >= 0) {
      const endpointIndex = mockProviders[providerIndex].endpoints.findIndex(
        e => e.id === updatedEndpoint.id
      );
      
      if (endpointIndex >= 0) {
        mockProviders[providerIndex].endpoints[endpointIndex] = updatedEndpoint;
        
        // Update the combined list
        allEndpoints = mockProviders.flatMap(provider =>
          provider.endpoints.map(endpoint => ({
            ...endpoint,
            provider: provider.name
          }))
        );
        
        return true;
      }
    }
    
    return false;
  },
  
  // Delete an endpoint
  deleteEndpoint: (endpointId: string) => {
    const providerIndex = mockProviders.findIndex(p => 
      p.endpoints.some(e => e.id === endpointId)
    );
    
    if (providerIndex >= 0) {
      mockProviders[providerIndex].endpoints = mockProviders[providerIndex].endpoints.filter(
        e => e.id !== endpointId
      );
      
      // Update the combined list
      allEndpoints = mockProviders.flatMap(provider =>
        provider.endpoints.map(endpoint => ({
          ...endpoint,
          provider: provider.name
        }))
      );
      
      return true;
    }
    
    return false;
  },
  
  // Track usage of an endpoint
  trackEndpointUsage: (endpointId: string) => {
    const providerIndex = mockProviders.findIndex(p => 
      p.endpoints.some(e => e.id === endpointId)
    );
    
    if (providerIndex >= 0) {
      const endpointIndex = mockProviders[providerIndex].endpoints.findIndex(
        e => e.id === endpointId
      );
      
      if (endpointIndex >= 0) {
        const endpoint = mockProviders[providerIndex].endpoints[endpointIndex];
        endpoint.usageCount += 1;
        endpoint.lastUsed = new Date().toISOString();
        
        // Update the combined list
        allEndpoints = mockProviders.flatMap(provider =>
          provider.endpoints.map(endpoint => ({
            ...endpoint,
            provider: provider.name
          }))
        );
        
        return endpoint;
      }
    }
    
    return null;
  },
  
  // Reset usage counters for testing
  resetUsageCounts: () => {
    mockProviders.forEach(provider => {
      provider.endpoints.forEach(endpoint => {
        endpoint.usageCount = 0;
        endpoint.lastUsed = new Date().toISOString();
      });
    });
    
    allEndpoints = mockProviders.flatMap(provider =>
      provider.endpoints.map(endpoint => ({
        ...endpoint,
        provider: provider.name
      }))
    );
  },
  
  // Calculate rate limit usage as percentage
  getRateLimitUsage: (endpointId: string) => {
    const endpoint = allEndpoints.find(e => e.id === endpointId);
    if (!endpoint) return 0;
    
    return Math.min(100, Math.round((endpoint.usageCount / endpoint.rateLimit) * 100));
  },
  
  // Check if an endpoint is approaching rate limit
  isApproachingRateLimit: (endpointId: string, thresholdPercentage: number = 80) => {
    const usage = ApiProviderManager.getRateLimitUsage(endpointId);
    return usage >= thresholdPercentage;
  },
  
  // Get a mock response for an endpoint (simulating API call)
  getMockResponse: async (endpointId: string, params?: Record<string, string>) => {
    const endpoint = allEndpoints.find(e => e.id === endpointId);
    if (!endpoint) throw new Error('Endpoint not found');
    
    // Track usage
    ApiProviderManager.trackEndpointUsage(endpointId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock data based on category
    switch (endpoint.category) {
      case 'market':
        return {
          data: [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', price: 32000, change24h: 2.5 },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum', price: 1800, change24h: -1.2 },
            { id: 'solana', symbol: 'sol', name: 'Solana', price: 45, change24h: 5.7 },
          ]
        };
      case 'price':
        return {
          data: { price: 32000, timestamp: new Date().toISOString() }
        };
      case 'chart':
        // Generate mock candlestick data
        const candles = [];
        const now = Date.now();
        for (let i = 0; i < 100; i++) {
          const time = now - (i * 3600000); // hourly candles
          const open = 30000 + Math.random() * 4000;
          const close = open + (Math.random() * 1000 - 500);
          const high = Math.max(open, close) + Math.random() * 200;
          const low = Math.min(open, close) - Math.random() * 200;
          const volume = 100 + Math.random() * 500;
          
          candles.push([time, open, high, low, close, volume]);
        }
        return { data: candles.reverse() };
      default:
        return { data: { message: "Mock response for " + endpoint.name } };
    }
  }
};

export default ApiProviderManager;
