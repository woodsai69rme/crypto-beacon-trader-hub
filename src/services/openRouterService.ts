
import { OpenRouterRequest } from '@/types/trading';

class OpenRouterService {
  private static API_KEY_STORAGE_KEY = 'openrouter_api_key';

  public OPENROUTER_MODELS = [
    {
      id: 'deepseek-coder/deepseek-coder-33b-instruct',
      name: 'DeepSeek Coder 33B',
      provider: 'DeepSeek',
      description: 'Specialized coding model from DeepSeek',
      contextLength: 16384,
      costPer1kTokens: 0.0
    },
    {
      id: 'anthropic/claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      description: 'Fast and efficient model from Anthropic',
      contextLength: 200000,
      costPer1kTokens: 0.25
    },
    {
      id: 'google/gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      provider: 'Google',
      description: 'Advanced reasoning and context model',
      contextLength: 1000000,
      costPer1kTokens: 0.5
    },
    {
      id: 'openai/gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      description: 'Most powerful model from OpenAI',
      contextLength: 128000,
      costPer1kTokens: 1.0
    }
  ];

  // Get the stored API key
  public getOpenRouterApiKey(): string {
    return localStorage.getItem(OpenRouterService.API_KEY_STORAGE_KEY) || '';
  }

  // Check if an API key is stored
  public hasApiKey(): boolean {
    return !!this.getOpenRouterApiKey();
  }

  // Save the API key to localStorage
  public saveOpenRouterApiKey(apiKey: string): void {
    localStorage.setItem(OpenRouterService.API_KEY_STORAGE_KEY, apiKey);
  }

  // Set API key (alias for saveOpenRouterApiKey)
  public setApiKey(apiKey: string): void {
    this.saveOpenRouterApiKey(apiKey);
  }

  // Remove the API key from localStorage
  public removeOpenRouterApiKey(): void {
    localStorage.removeItem(OpenRouterService.API_KEY_STORAGE_KEY);
  }

  // Clear API key (alias for removeOpenRouterApiKey)
  public clearApiKey(): void {
    this.removeOpenRouterApiKey();
  }

  // Fetch available models from OpenRouter API
  public async getModels(): Promise<any> {
    const apiKey = this.getOpenRouterApiKey();
    
    if (!apiKey) {
      throw new Error('API key is not set');
    }
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      throw error;
    }
  }

  // Send a request to OpenRouter API
  public async sendOpenRouterRequest(request: OpenRouterRequest): Promise<any> {
    const apiKey = this.getOpenRouterApiKey();
    
    if (!apiKey) {
      throw new Error('API key is not set');
    }
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Crypto Trading Platform'
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 1000
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send request: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending OpenRouter request:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const openRouterService = new OpenRouterService();
export default openRouterService;
