
import { toast } from "@/hooks/use-toast";

// Types for OpenRouter API
export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  provider: string;
  pricing?: {
    prompt: number;
    completion: number;
  };
  category?: string;
  isFree?: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
}

// Environment variable or user input for API key
let OPENROUTER_API_KEY = '';

export const setOpenRouterApiKey = (apiKey: string) => {
  OPENROUTER_API_KEY = apiKey;
  localStorage.setItem('openrouter_api_key', apiKey);
};

export const getOpenRouterApiKey = (): string => {
  if (!OPENROUTER_API_KEY) {
    OPENROUTER_API_KEY = localStorage.getItem('openrouter_api_key') || '';
  }
  return OPENROUTER_API_KEY;
};

// Fetch available models from OpenRouter
export const fetchAvailableModels = async (): Promise<OpenRouterModel[]> => {
  try {
    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your OpenRouter API key in settings",
        variant: "destructive",
      });
      return [];
    }

    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Crypto Trading Platform'
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    
    // Enhance data with free tier classification
    return data.data.map((model: OpenRouterModel) => ({
      ...model,
      isFree: model.pricing && (model.pricing.prompt === 0 || model.pricing.completion === 0)
    }));
  } catch (error) {
    console.error('Error fetching models:', error);
    toast({
      title: "Failed to fetch models",
      description: (error as Error).message,
      variant: "destructive",
    });
    return [];
  }
};

// Send chat completion request to OpenRouter
export const sendChatCompletion = async (
  request: ChatCompletionRequest
): Promise<string> => {
  try {
    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
      throw new Error("API key not set");
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Crypto Trading Platform'
      },
      body: JSON.stringify({
        ...request,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 500
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error with chat completion:', error);
    toast({
      title: "Chat completion failed",
      description: (error as Error).message,
      variant: "destructive",
    });
    throw error;
  }
};
