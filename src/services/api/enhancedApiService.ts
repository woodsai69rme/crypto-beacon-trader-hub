import { apiProviderService } from './apiProviderService';
import { ApiProvider, ApiEndpoint, ApiUsageMetrics } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

// Track API usage metrics
const apiMetrics: Record<string, ApiUsageMetrics> = {};

// Enhanced API service with rate limiting and fallback
const enhancedApiService = {
  /**
   * Makes an API request with automatic provider selection and rate limiting
   */
  async makeRequest<T>(
    endpoint: string, 
    params: Record<string, any> = {}, 
    options: {
      preferredProvider?: string;
      requireAuth?: boolean;
      method?: string;
      headers?: Record<string, string>;
      body?: any;
    } = {}
  ): Promise<T> {
    const { preferredProvider, requireAuth = false, method = 'GET', headers = {}, body } = options;
    
    // Get available providers
    let availableProviders = apiProviderService.getEnabledProviders()
      .filter(p => p.isActive && (!requireAuth || (requireAuth && !!p.apiKey)));
    
    // If no providers available, throw error
    if (availableProviders.length === 0) {
      throw new Error('No active API providers available for this request');
    }
    
    // Sort providers by priority (if no preferred provider)
    if (!preferredProvider) {
      availableProviders = availableProviders.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }
    // If preferred provider specified, try to use it first
    else {
      const preferredProviderObj = availableProviders.find(p => p.id === preferredProvider);
      if (preferredProviderObj) {
        // Move preferred provider to front of array
        availableProviders = [
          preferredProviderObj,
          ...availableProviders.filter(p => p.id !== preferredProvider)
        ];
      }
    }
    
    // Try each provider in order
    for (const provider of availableProviders) {
      try {
        // Check if we've hit the rate limit
        if (provider.currentUsage >= provider.maxUsage) {
          console.warn(`Rate limit exceeded for provider ${provider.name}, trying next provider`);
          continue;
        }
        
        // Track request start time
        const startTime = Date.now();
        
        // Build full URL
        const url = new URL(endpoint.startsWith('http') ? endpoint : `${provider.baseUrl}${endpoint}`);
        
        // Add query parameters
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
        
        // Add API key if required
        if (provider.apiKey && provider.authMethod === 'query' && provider.apiKeyName) {
          url.searchParams.append(provider.apiKeyName, provider.apiKey);
        }
        
        // Prepare headers
        const requestHeaders: Record<string, string> = {
          ...provider.defaultHeaders,
          ...headers
        };
        
        // Add API key to header if that's the auth method
        if (provider.apiKey && provider.authMethod === 'header' && provider.apiKeyName) {
          requestHeaders[provider.apiKeyName] = provider.apiKey;
        }
        
        // Make the request
        const response = await fetch(url.toString(), {
          method,
          headers: requestHeaders,
          body: method !== 'GET' && body ? JSON.stringify(body) : undefined
        });
        
        // Track response time
        const responseTime = Date.now() - startTime;
        
        // Update usage metrics
        this.updateMetrics(provider.id, endpoint, responseTime, response.ok);
        
        // Increment provider usage
        apiProviderService.incrementUsage(provider.id);
        
        // If response is not ok, throw error
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        // Parse response
        const data = await response.json();
        return data as T;
      } catch (error) {
        console.error(`Error with provider ${provider.name}:`, error);
        
        // If this is the last provider, rethrow the error
        if (provider === availableProviders[availableProviders.length - 1]) {
          throw error;
        }
        
        // Otherwise try the next provider
        console.warn(`Trying next provider...`);
      }
    }
    
    throw new Error('All API providers failed');
  },
  
  /**
   * Update metrics for API usage
   */
  updateMetrics(providerId: string, endpoint: string, responseTime: number, success: boolean): void {
    const key = `${providerId}:${endpoint}`;
    
    if (!apiMetrics[key]) {
      apiMetrics[key] = {
        provider: providerId,
        endpoint,
        requestCount: 0,
        successCount: 0,
        errorCount: 0,
        avgResponseTime: 0,
        lastUsed: new Date().toISOString(),
        currentUsage: 0,
        maxUsage: 0
      };
    }
    
    const metrics = apiMetrics[key];
    metrics.requestCount++;
    if (success) {
      metrics.successCount++;
    } else {
      metrics.errorCount++;
    }
    
    // Update average response time
    metrics.avgResponseTime = (metrics.avgResponseTime * (metrics.requestCount - 1) + responseTime) / metrics.requestCount;
    metrics.lastUsed = new Date().toISOString();
    
    // Update provider's current usage from the provider service
    try {
      const provider = apiProviderService.getProviderById(providerId);
      metrics.currentUsage = provider.currentUsage;
      metrics.maxUsage = provider.maxUsage;
    } catch (error) {
      console.warn(`Could not fetch provider ${providerId} metrics:`, error);
    }
  },
  
  /**
   * Get metrics for all API providers
   */
  getMetrics(): ApiUsageMetrics[] {
    return Object.values(apiMetrics);
  },
  
  /**
   * Get metrics for a specific provider
   */
  getProviderMetrics(providerId: string): ApiUsageMetrics[] {
    return Object.values(apiMetrics).filter(m => m.provider === providerId);
  },
  
  /**
   * Reset usage for all providers
   */
  resetAllUsage(): void {
    apiProviderService.resetAllUsage();
  },
  
  /**
   * Select the best provider for a specific endpoint
   */
  selectBestProvider(endpoint: string, requireAuth: boolean = false): ApiProvider | null {
    const availableProviders = apiProviderService.getEnabledProviders()
      .filter(p => p.isActive && (!requireAuth || (requireAuth && !!p.apiKey)));
    
    if (availableProviders.length === 0) {
      return null;
    }
    
    // First check if there's a priority provider with available quota
    const priorityProvider = apiProviderService.getPriorityProvider();
    if (priorityProvider && priorityProvider.currentUsage < priorityProvider.maxUsage) {
      return priorityProvider;
    }
    
    // Otherwise find the provider with the most available quota
    return availableProviders
      .sort((a, b) => {
        const aQuotaLeft = a.maxUsage - a.currentUsage;
        const bQuotaLeft = b.maxUsage - b.currentUsage;
        return bQuotaLeft - aQuotaLeft;
      })[0];
  }
};

export default enhancedApiService;
