
import axios from 'axios';

const STORAGE_KEY = 'openrouter_api_key';

export interface OpenRouterRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextLength: number;
  costPer1kTokens: number;
}

const OPENROUTER_MODELS: OpenRouterModel[] = [
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'The most powerful model for highly complex tasks',
    contextLength: 200000,
    costPer1kTokens: 0.15,
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balance of intelligence and speed',
    contextLength: 200000,
    costPer1kTokens: 0.03,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'OpenAI\'s latest multimodal model',
    contextLength: 128000,
    costPer1kTokens: 0.05,
  },
  {
    id: 'google/gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: 'Google\'s advanced multimodal model',
    contextLength: 1000000,
    costPer1kTokens: 0.0035,
  },
];

// Check if API key exists
const hasApiKey = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

// Get the stored API key
const getOpenRouterApiKey = (): string => {
  return localStorage.getItem(STORAGE_KEY) || '';
};

// Save the API key
const saveOpenRouterApiKey = (apiKey: string): void => {
  localStorage.setItem(STORAGE_KEY, apiKey);
};

// Remove the API key
const removeOpenRouterApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Set the API key for the current session
const setApiKey = (apiKey: string): void => {
  // This is just a wrapper around saveOpenRouterApiKey
  saveOpenRouterApiKey(apiKey);
};

// Clear the API key
const clearApiKey = (): void => {
  // This is just a wrapper around removeOpenRouterApiKey
  removeOpenRouterApiKey();
};

// Get models from OpenRouter
const getModels = async (): Promise<any> => {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) throw new Error('No API key provided');

  try {
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch models from OpenRouter:', error);
    throw error;
  }
};

// Send a request to OpenRouter
const sendOpenRouterRequest = async (request: OpenRouterRequest): Promise<any> => {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) throw new Error('No API key provided');

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', request, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href,
        'X-Title': 'Crypto Trading App'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};

// Export all methods and constants
export default {
  getOpenRouterApiKey,
  saveOpenRouterApiKey,
  removeOpenRouterApiKey,
  sendOpenRouterRequest,
  OPENROUTER_MODELS,
  hasApiKey,
  setApiKey,
  clearApiKey,
  getModels
};
