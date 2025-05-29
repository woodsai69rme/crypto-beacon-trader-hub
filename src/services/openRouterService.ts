
interface OpenRouterModel {
  id: string;
  name: string;
  context_length: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number;
  };
}

interface OpenRouterResponse {
  id: string;
  choices: Array<{
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
  private apiKeys: string[] = [];
  private currentKeyIndex = 0;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private availableModels: OpenRouterModel[] = [];
  private userApiKey: string | null = null;

  constructor() {
    this.loadApiKeys();
    this.initializeModels();
    this.loadUserApiKey();
  }

  private loadApiKeys() {
    // Load multiple API keys for load balancing
    const keys = [
      'sk-SVuaujEtzO7skHM4C2qyhKVeOiXEFxMeANiwcur3DaT3BlbkFJH-_YtynEqZF051Bn8GwwA7vtj1e-eMrcA9BvZWwP0A',
      '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'
    ];
    this.apiKeys = keys.filter(key => key && key.length > 0);
  }

  private loadUserApiKey() {
    try {
      this.userApiKey = localStorage.getItem('openrouter_api_key');
    } catch (error) {
      console.error('Failed to load user API key:', error);
    }
  }

  private initializeModels() {
    this.availableModels = [
      // Free models
      {
        id: 'deepseek/deepseek-r1',
        name: 'DeepSeek R1',
        context_length: 128000,
        pricing: { prompt: 0, completion: 0 },
        top_provider: { context_length: 128000, max_completion_tokens: 8192 }
      },
      {
        id: 'google/gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash',
        context_length: 1048576,
        pricing: { prompt: 0, completion: 0 },
        top_provider: { context_length: 1048576, max_completion_tokens: 8192 }
      },
      {
        id: 'meta-llama/llama-3.3-70b-instruct',
        name: 'Llama 3.3 70B',
        context_length: 128000,
        pricing: { prompt: 0, completion: 0 },
        top_provider: { context_length: 128000, max_completion_tokens: 4096 }
      },
      // Premium models
      {
        id: 'openai/gpt-4',
        name: 'GPT-4',
        context_length: 8192,
        pricing: { prompt: 0.03, completion: 0.06 },
        top_provider: { context_length: 8192, max_completion_tokens: 4096 }
      },
      {
        id: 'anthropic/claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        context_length: 200000,
        pricing: { prompt: 0.003, completion: 0.015 },
        top_provider: { context_length: 200000, max_completion_tokens: 4096 }
      },
      {
        id: 'google/gemini-pro',
        name: 'Gemini Pro',
        context_length: 2097152,
        pricing: { prompt: 0.001, completion: 0.002 },
        top_provider: { context_length: 2097152, max_completion_tokens: 8192 }
      }
    ];
  }

  hasApiKey(): boolean {
    return !!(this.userApiKey || this.apiKeys.length > 0);
  }

  setApiKey(key: string): void {
    this.userApiKey = key;
    try {
      localStorage.setItem('openrouter_api_key', key);
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  }

  clearApiKey(): void {
    this.userApiKey = null;
    try {
      localStorage.removeItem('openrouter_api_key');
    } catch (error) {
      console.error('Failed to clear API key:', error);
    }
  }

  async getModels(): Promise<OpenRouterModel[] | null> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.getNextApiKey()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || this.availableModels;
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return this.availableModels;
    }
  }

  private getNextApiKey(): string {
    // Prefer user's API key if available
    if (this.userApiKey) {
      return this.userApiKey;
    }

    if (this.apiKeys.length === 0) {
      throw new Error('No API keys available');
    }
    
    const key = this.apiKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    return key;
  }

  async generateTradingSignal(
    marketData: any,
    strategy: string,
    modelId: string = 'deepseek/deepseek-r1'
  ): Promise<{
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string;
    entryPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
  }> {
    const prompt = `
    As an expert cryptocurrency trading AI, analyze the following market data and provide a trading signal.

    Market Data:
    ${JSON.stringify(marketData, null, 2)}

    Strategy: ${strategy}
    Base Currency: AUD

    Provide your analysis in the following JSON format:
    {
      "signal": "BUY|SELL|HOLD",
      "confidence": 0.0-1.0,
      "reasoning": "detailed explanation",
      "entryPrice": number,
      "stopLoss": number,
      "takeProfit": number
    }
    `;

    try {
      const response = await this.makeRequest(prompt, modelId);
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response content received');
      }

      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response format');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating trading signal:', error);
      return {
        signal: 'HOLD',
        confidence: 0,
        reasoning: 'Unable to generate signal due to API error'
      };
    }
  }

  async analyzeSentiment(text: string, modelId: string = 'deepseek/deepseek-r1'): Promise<{
    sentiment: 'bullish' | 'bearish' | 'neutral';
    score: number;
    keywords: string[];
  }> {
    const prompt = `
    Analyze the sentiment of the following cryptocurrency-related text:

    "${text}"

    Provide sentiment analysis in JSON format:
    {
      "sentiment": "bullish|bearish|neutral",
      "score": -1.0 to 1.0,
      "keywords": ["keyword1", "keyword2"]
    }
    `;

    try {
      const response = await this.makeRequest(prompt, modelId);
      const content = response.choices[0]?.message?.content;
      
      const jsonMatch = content?.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid sentiment analysis response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        sentiment: 'neutral',
        score: 0,
        keywords: []
      };
    }
  }

  async optimizePortfolio(
    portfolio: any[],
    riskLevel: 'low' | 'medium' | 'high',
    modelId: string = 'deepseek/deepseek-r1'
  ): Promise<{
    allocations: Record<string, number>;
    reasoning: string;
    riskScore: number;
  }> {
    const prompt = `
    Optimize the following cryptocurrency portfolio for AUD-based trading:

    Current Portfolio:
    ${JSON.stringify(portfolio, null, 2)}

    Risk Level: ${riskLevel}
    Base Currency: AUD

    Provide optimization recommendations in JSON format:
    {
      "allocations": {"BTC": 0.4, "ETH": 0.3, "ADA": 0.3},
      "reasoning": "detailed explanation",
      "riskScore": 0.0-1.0
    }
    `;

    try {
      const response = await this.makeRequest(prompt, modelId);
      const content = response.choices[0]?.message?.content;
      
      const jsonMatch = content?.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid portfolio optimization response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error optimizing portfolio:', error);
      return {
        allocations: {},
        reasoning: 'Unable to optimize portfolio due to API error',
        riskScore: 0.5
      };
    }
  }

  private async makeRequest(prompt: string, modelId: string): Promise<OpenRouterResponse> {
    const apiKey = this.getNextApiKey();
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Crypto Trading Platform'
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'system',
            content: 'You are an expert cryptocurrency trading AI assistant specialized in Australian market conditions and AUD-based trading.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  getAvailableModels(): OpenRouterModel[] {
    return this.availableModels;
  }

  getFreeModels(): OpenRouterModel[] {
    return this.availableModels.filter(model => 
      model.pricing.prompt === 0 && model.pricing.completion === 0
    );
  }

  getPaidModels(): OpenRouterModel[] {
    return this.availableModels.filter(model => 
      model.pricing.prompt > 0 || model.pricing.completion > 0
    );
  }
}

export const openRouterService = new OpenRouterService();
export default openRouterService;
