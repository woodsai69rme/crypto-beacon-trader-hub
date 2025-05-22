import axios, { AxiosInstance } from 'axios';
import { ApiProvider, ApiEndpoint } from '@/types/api';
import apiProviders from './apiProviderConfig';

// Fixed import - using the default export from apiProviderConfig
const defaultProviders = apiProviders;

// Use default providers as initial providers
let providers: ApiProvider[] = [...defaultProviders];

// Generic function to make API requests
async function makeApiRequest(
  provider: ApiProvider,
  endpointKey: string,
  params: Record<string, string> = {}
): Promise<any> {
  const endpoint: ApiEndpoint | undefined = provider.endpoints[endpointKey];

  if (!endpoint) {
    throw new Error(`Endpoint ${endpointKey} not found in provider ${provider.name}`);
  }

  let url = provider.baseUrl + endpoint.path;
  const method = endpoint.method.toLowerCase();

  // Inject path parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, params[key]);
  });

  const axiosConfig: any = {
    method,
    url,
    // headers: { 'Content-Type': 'application/json' }
  };

  // Set authentication headers or query parameters
  if (provider.authType === 'header' && provider.apiKey) {
    axiosConfig.headers = {
      ...axiosConfig.headers,
      [provider.authKey]: provider.apiKey
    };
  } else if (provider.authType === 'query' && provider.apiKey) {
    axiosConfig.params = {
      ...params,
      [provider.authKey]: provider.apiKey
    };
  } else if (provider.authType === 'apiKey' && provider.apiKey) {
    axiosConfig.headers = {
      ...axiosConfig.headers,
      'x-api-key': provider.apiKey
    };
  }

  try {
    const response = await axios(axiosConfig);
    return response.data;
  } catch (error: any) {
    console.error(`API request failed for ${provider.name} - ${endpointKey}:`, error.message);
    throw error;
  }
}

// Provider manager with complete methods
const providerManager = {
  getAllProviders: () => [...providers],
  getProviderById: (id: string) => providers.find(p => p.id === id) || providers[0],
  addProvider: (provider: ApiProvider) => {
    providers.push(provider);
  },
  updateProvider: (id: string, updatedProvider: ApiProvider) => {
    const index = providers.findIndex(p => p.id === id);
    if (index !== -1) {
      providers[index] = updatedProvider;
    }
  },
  toggleProviderEnabled: (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (provider) {
      provider.enabled = !provider.enabled;
    }
  },
  deleteProvider: (id: string) => {
    const index = providers.findIndex(p => p.id === id);
    if (index !== -1) {
      providers.splice(index, 1);
    }
  },
  setProviderApiKey: (id: string, apiKey: string) => {
    const provider = providers.find(p => p.id === id);
    if (provider) {
      provider.apiKey = apiKey;
    }
  },
  // Add the missing methods
  getPriorityProvider: () => {
    return providers.find(p => p.enabled) || providers[0];
  },
  getEnabledProviders: () => providers.filter(p => p.enabled)
};

export const fetchApiData = async (
  providerId: string,
  endpointId: string,
  params?: Record<string, any>
): Promise<any> => {
  // Find the provider and endpoint
  const provider = defaultProviders.find(p => p.id === providerId);
  if (!provider) throw new Error(`Provider ${providerId} not found`);
  
  const endpoint = provider.endpoints[endpointId];
  if (!endpoint) throw new Error(`Endpoint ${endpointId} not found for provider ${providerId}`);
  
  // Build the URL with query params
  let url = `${provider.baseUrl}${endpoint.path}`;
  
  // Add auth if required
  const headers: Record<string, string> = {};
  const queryParams: Record<string, string> = { ...params };
  
  if (endpoint.requiresAuth && provider.apiKey) {
    if (provider.authType === 'header') {
      headers[provider.authKey || 'Authorization'] = `Bearer ${provider.apiKey}`;
    } else if (provider.authType === 'query') {
      queryParams[provider.authKey || 'api_key'] = provider.apiKey;
    } else if (provider.authType === 'apiKey') {
      queryParams[provider.authKey || 'apiKey'] = provider.apiKey;
    }
  }
  
  // Add query params to URL
  if (Object.keys(queryParams).length > 0) {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    url += url.includes('?') ? `&${queryString}` : `?${queryString}`;
  }
  
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${providerId}/${endpointId}:`, error);
    throw error;
  }
};

export { makeApiRequest, providerManager };
