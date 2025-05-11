
import { ApiProvider } from '@/types/trading';
import initialProviders from './apiProviderConfig';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for API providers
let providers: ApiProvider[] = [...initialProviders];

export const apiProviderService = {
  getAllProviders: (): ApiProvider[] => {
    return [...providers];
  },

  getEnabledProviders: (): ApiProvider[] => {
    return providers.filter(provider => provider.enabled);
  },
  
  getProviderById: (id: string): ApiProvider => {
    const provider = providers.find(p => p.id === id);
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    return { ...provider };
  },
  
  addProvider: (provider: ApiProvider): void => {
    if (!provider.id) {
      provider.id = uuidv4();
    }
    
    // Set defaults for new provider
    const newProvider: ApiProvider = {
      ...provider,
      currentUsage: provider.currentUsage || 0,
      maxUsage: provider.maxUsage || 100,
      resetTime: provider.resetTime || 'daily',
      usageLimit: provider.usageLimit || 100,
      isActive: provider.isActive !== undefined ? provider.isActive : true,
      enabled: provider.enabled !== undefined ? provider.enabled : true,
      priority: provider.priority || 0
    };
    
    providers.push(newProvider);
  },
  
  updateProvider: (id: string, updatedProvider: ApiProvider): void => {
    const index = providers.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    providers[index] = { ...providers[index], ...updatedProvider };
  },
  
  toggleProviderEnabled: (id: string): void => {
    const index = providers.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    providers[index] = { 
      ...providers[index], 
      enabled: !providers[index].enabled 
    };
  },
  
  deleteProvider: (id: string): void => {
    providers = providers.filter(p => p.id !== id);
  },
  
  setProviderApiKey: (id: string, apiKey: string): void => {
    const index = providers.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    providers[index] = { 
      ...providers[index], 
      apiKey,
      isActive: !!apiKey 
    };
  },
  
  incrementUsage: (id: string, amount: number = 1): void => {
    const provider = providers.find(p => p.id === id);
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    provider.currentUsage += amount;
  },
  
  resetUsage: (id: string): void => {
    const provider = providers.find(p => p.id === id);
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    provider.currentUsage = 0;
  },

  getPriorityProvider: (): ApiProvider | undefined => {
    return providers
      .filter(p => p.enabled && p.isActive)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];
  },
  
  resetAllUsage: (): void => {
    providers = providers.map(p => ({ ...p, currentUsage: 0 }));
  }
};
