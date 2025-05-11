import { toast } from "@/components/ui/use-toast";
import { apiProviderManager } from "./apiProviderConfig";
import { ApiProvider } from "@/types/trading";
import apiCache from "./cacheService";

type RequestParams = Record<string, string | number | boolean>;

interface ApiRequestOptions {
  endpoint: string;
  params?: RequestParams;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  cacheTime?: number; // in milliseconds
  cacheKey?: string;
  forceFresh?: boolean;
  provider?: string; // provider id
}

interface ApiResponse<T = any> {
  data: T;
  source: string; // API provider that returned the data
  cached: boolean;
  timestamp: number;
}

export async function apiRequest<T = any>(options: ApiRequestOptions): Promise<ApiResponse<T>> {
  const {
    endpoint,
    params = {},
    method = 'GET',
    data,
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    cacheKey,
    forceFresh = false,
    provider: providerId
  } = options;
  
  // Generate cache key if not provided
  const generatedCacheKey = cacheKey || 
    `${endpoint}-${JSON.stringify(params)}-${method}${providerId ? `-${providerId}` : ''}`;
  
  // Check cache first if not forcing fresh data
  if (!forceFresh && cacheKey) {
    const cachedData = apiCache.get<ApiResponse<T>>(generatedCacheKey);
    if (cachedData) {
      return {
        ...cachedData,
        cached: true
      };
    }
  }
  
  // Get the API provider to use
  let apiProvider: ApiProvider | undefined;
  
  if (providerId) {
    apiProvider = apiProviderManager.getProviderById(providerId);
    if (!apiProvider?.enabled) {
      throw new Error(`API provider '${providerId}' is not enabled`);
    }
  } else {
    apiProvider = apiProviderManager.getPriorityProvider();
  }
  
  if (!apiProvider) {
    throw new Error("No enabled API provider available");
  }
  
  // Process the endpoint, replacing any path params like {id}
  let processedEndpoint = apiProvider.endpoints[endpoint] || endpoint;
  Object.keys(params).forEach(key => {
    processedEndpoint = processedEndpoint.replace(`{${key}}`, String(params[key]));
  });
  
  // Build the URL with query parameters
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    // Skip parameters that were used in the path
    if (!processedEndpoint.includes(`{${key}}`)) {
      queryParams.append(key, String(params[key]));
    }
  });
  
  const url = `${apiProvider.baseUrl}${processedEndpoint}${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  
  // Build the fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...apiProvider.defaultHeaders
    }
  };
  
  // Add authentication if required
  if (apiProvider.requiresAuth && apiProvider.apiKey) {
    if (apiProvider.authMethod === 'header') {
      const headerName = apiProvider.apiKeyName || 'Authorization';
      let headerValue = apiProvider.apiKey;
      
      // Check if there's a template in defaultHeaders
      if (apiProvider.defaultHeaders?.[headerName]?.includes('{key}')) {
        headerValue = apiProvider.defaultHeaders[headerName].replace('{key}', apiProvider.apiKey);
      }
      
      (fetchOptions.headers as Record<string, string>)[headerName] = headerValue;
    } else if (apiProvider.authMethod === 'query') {
      const keyName = apiProvider.apiKeyName || 'apikey';
      queryParams.append(keyName, apiProvider.apiKey);
    }
  }
  
  // Add body data if needed
  if (['POST', 'PUT'].includes(method) && data) {
    fetchOptions.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Format the API response
    const apiResponse: ApiResponse<T> = {
      data: responseData,
      source: apiProvider.name,
      cached: false,
      timestamp: Date.now()
    };
    
    // Cache the response
    apiCache.set(generatedCacheKey, apiResponse, cacheTime);
    
    return apiResponse;
  } catch (error) {
    console.error(`Error calling ${apiProvider.name} API:`, error);
    
    // Try the next available provider if there was an error
    if (!providerId) {
      const allProviders = apiProviderManager.getEnabledProviders();
      const currentIndex = allProviders.findIndex(p => p.id === apiProvider?.id);
      
      if (currentIndex >= 0 && currentIndex < allProviders.length - 1) {
        const nextProvider = allProviders[currentIndex + 1];
        
        console.log(`Trying fallback provider: ${nextProvider.name}`);
        
        return apiRequest({
          ...options,
          provider: nextProvider.id,
          forceFresh: true // Don't use cache for fallback
        });
      }
    }
    
    throw new Error(`Error fetching data from ${apiProvider.name}: ${(error as Error).message}`);
  }
}

export async function getMarketData(limit: number = 20, currency: string = 'usd'): Promise<any> {
  try {
    const response = await apiRequest({
      endpoint: 'marketData',
      params: {
        limit,
        vs_currency: currency
      },
      cacheKey: `market-data-${limit}-${currency}`,
      cacheTime: 2 * 60 * 1000 // 2 minutes
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    throw error;
  }
}

export async function getCoinData(coinId: string, currency: string = 'usd'): Promise<any> {
  try {
    const response = await apiRequest({
      endpoint: 'coinData',
      params: {
        id: coinId,
        localization: 'false',
        market_data: 'true',
        vs_currency: currency
      },
      cacheKey: `coin-data-${coinId}-${currency}`,
      cacheTime: 5 * 60 * 1000 // 5 minutes
    });
    
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch data for coin ${coinId}:`, error);
    throw error;
  }
}

export async function getHistoricalData(
  coinId: string,
  days: number = 30,
  interval: string = 'daily',
  currency: string = 'usd'
): Promise<any> {
  try {
    const response = await apiRequest({
      endpoint: 'marketChart',
      params: {
        id: coinId,
        days,
        interval,
        vs_currency: currency
      },
      cacheKey: `historical-data-${coinId}-${days}-${interval}-${currency}`,
      cacheTime: 15 * 60 * 1000 // 15 minutes
    });
    
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch historical data for coin ${coinId}:`, error);
    throw error;
  }
}

// Add missing methods to the apiProviderManager
const getPriorityProvider = () => {
  const availableProviders = apiProviderManager.getAllProviders().filter(p => p.enabled);
  
  if (availableProviders.length === 0) {
    throw new Error("No enabled API providers available");
  }
  
  return availableProviders.sort((a, b) => (a.priority || 0) - (b.priority || 0))[0];
};

const getEnabledProviders = () => {
  return apiProviderManager.getAllProviders().filter(p => p.enabled);
};

// Attach these methods to the apiProviderManager
apiProviderManager.getPriorityProvider = getPriorityProvider;
apiProviderManager.getEnabledProviders = getEnabledProviders;

// Export the API provider manager
export { apiProviderManager };
