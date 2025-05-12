
// OpenRouter API service for accessing AI models
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'openrouter_api_key';

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  provider: string;
}

export const OPENROUTER_MODELS = [
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic\'s most powerful model for complex tasks',
    context_length: 100000,
    provider: 'Anthropic'
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and affordability',
    context_length: 100000,
    provider: 'Anthropic'
  },
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'OpenAI\'s most capable model',
    context_length: 128000,
    provider: 'OpenAI'
  },
  {
    id: 'meta-llama/llama-3-70b-instruct',
    name: 'Llama 3 70B',
    description: 'Meta\'s largest open model',
    context_length: 8192,
    provider: 'Meta'
  }
];

const openRouterService = {
  // Set the API key in localStorage
  setApiKey: (apiKey: string) => {
    localStorage.setItem(STORAGE_KEY, apiKey);
  },
  
  // Check if an API key exists
  hasApiKey: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  },
  
  // Get the stored API key
  getApiKey: (): string | null => {
    return localStorage.getItem(STORAGE_KEY);
  },
  
  // Clear the stored API key
  clearApiKey: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
  
  // Fetch available models from OpenRouter
  getModels: async (): Promise<OpenRouterModel[]> => {
    const apiKey = localStorage.getItem(STORAGE_KEY);
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      throw error;
    }
  },
  
  // Generate text completion via OpenRouter API
  generateCompletion: async (
    prompt: string,
    modelId: string = 'openai/gpt-4-turbo',
    maxTokens: number = 500
  ): Promise<string> => {
    const apiKey = localStorage.getItem(STORAGE_KEY);
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: 'You are a helpful assistant for cryptocurrency trading analysis.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating completion:', error);
      throw error;
    }
  }
};

// A React hook for using API key state
export const useOpenRouterApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  
  useEffect(() => {
    const storedKey = openRouterService.getApiKey();
    setApiKey(storedKey);
    setIsConfigured(!!storedKey);
  }, []);
  
  const saveApiKey = (key: string) => {
    openRouterService.setApiKey(key);
    setApiKey(key);
    setIsConfigured(true);
  };
  
  const removeApiKey = () => {
    openRouterService.clearApiKey();
    setApiKey(null);
    setIsConfigured(false);
  };
  
  return { apiKey, isConfigured, saveApiKey, removeApiKey };
};

export default openRouterService;
