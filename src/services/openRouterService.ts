
import axios from 'axios';

interface OpenRouterRequestOptions {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenRouterService {
  private baseUrl = 'https://openrouter.ai/api/v1';
  private apiKey: string | null = null;

  constructor() {
    // Try to get API key from localStorage
    this.apiKey = localStorage.getItem('openrouter_api_key');
  }

  /**
   * Set the API key for OpenRouter
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('openrouter_api_key', apiKey);
  }

  /**
   * Clear the stored API key
   */
  public clearApiKey(): void {
    this.apiKey = null;
    localStorage.removeItem('openrouter_api_key');
  }

  /**
   * Check if API key is set
   */
  public hasApiKey(): boolean {
    return this.apiKey !== null;
  }

  /**
   * Get available models from OpenRouter
   */
  public async getModels(): Promise<any> {
    if (!this.apiKey) {
      throw new Error('API key is not set');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Crypto Trading Platform'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching models from OpenRouter:', error);
      throw error;
    }
  }

  /**
   * Generate a completion using the OpenRouter API
   */
  public async generateCompletion(options: OpenRouterRequestOptions): Promise<OpenRouterResponse> {
    if (!this.apiKey) {
      throw new Error('API key is not set');
    }

    try {
      const response = await axios.post(`${this.baseUrl}/chat/completions`, options, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Crypto Trading Platform'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating completion with OpenRouter:', error);
      throw error;
    }
  }

  /**
   * Generate a streamed completion using the OpenRouter API
   * This returns an EventSource that emits chunks of the response
   */
  public generateStreamedCompletion(options: OpenRouterRequestOptions): EventSource {
    if (!this.apiKey) {
      throw new Error('API key is not set');
    }

    // Set streaming to true
    options.stream = true;

    // Create a new EventSource
    return new EventSource(`${this.baseUrl}/chat/completions`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Crypto Trading Platform'
      },
      body: JSON.stringify(options),
      method: 'POST'
    } as EventSourceInit);
  }
}

// Create a singleton instance
const openRouterService = new OpenRouterService();

export default openRouterService;
