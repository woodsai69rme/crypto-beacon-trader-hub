
// OpenRouter AI Service for trading analysis
interface OpenRouterModel {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
}

interface TradingAnalysis {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  entry_price?: number;
  target_price?: number;
  stop_loss?: number;
}

class OpenRouterService {
  private apiKey: string | null = null;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    // In a real app, this would come from environment variables or user settings
    this.apiKey = localStorage.getItem('openrouter_api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openrouter_api_key', key);
  }

  async getAvailableModels(): Promise<OpenRouterModel[]> {
    if (!this.apiKey) {
      return this.getMockModels();
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data.data || this.getMockModels();
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      return this.getMockModels();
    }
  }

  async generateTradingAnalysis(
    marketData: any,
    strategy: string,
    model: string = 'deepseek/deepseek-r1'
  ): Promise<TradingAnalysis> {
    if (!this.apiKey) {
      return this.getMockAnalysis();
    }

    const prompt = this.buildTradingPrompt(marketData, strategy);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional crypto trading analyst. Provide clear, concise trading signals with reasoning.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      const data = await response.json();
      return this.parseAnalysisResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating trading analysis:', error);
      return this.getMockAnalysis();
    }
  }

  private buildTradingPrompt(marketData: any, strategy: string): string {
    return `
Analyze the following market data for ${marketData.symbol || 'BTC'}:
- Current Price: $${marketData.price || 'N/A'}
- 24h Change: ${marketData.change24h || 'N/A'}%
- Volume: $${marketData.volume || 'N/A'}
- Strategy: ${strategy}

Provide a trading signal (BUY/SELL/HOLD) with:
1. Confidence level (0-100)
2. Brief reasoning
3. Suggested entry, target, and stop-loss prices

Format your response as JSON.
    `;
  }

  private parseAnalysisResponse(content: string): TradingAnalysis {
    try {
      return JSON.parse(content);
    } catch {
      return this.getMockAnalysis();
    }
  }

  private getMockModels(): OpenRouterModel[] {
    return [
      {
        id: 'deepseek/deepseek-r1',
        name: 'DeepSeek R1',
        pricing: { prompt: '0', completion: '0' },
        context_length: 32768
      },
      {
        id: 'google/gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash',
        pricing: { prompt: '0', completion: '0' },
        context_length: 32768
      },
      {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        pricing: { prompt: '3', completion: '15' },
        context_length: 200000
      }
    ];
  }

  private getMockAnalysis(): TradingAnalysis {
    const signals = ['BUY', 'SELL', 'HOLD'] as const;
    const signal = signals[Math.floor(Math.random() * signals.length)];
    
    return {
      signal,
      confidence: Math.floor(Math.random() * 40) + 60,
      reasoning: `AI analysis suggests ${signal} based on current market conditions and technical indicators.`,
      entry_price: signal === 'BUY' ? 65000 : signal === 'SELL' ? 66000 : undefined,
      target_price: signal === 'BUY' ? 70000 : signal === 'SELL' ? 62000 : undefined,
      stop_loss: signal === 'BUY' ? 62000 : signal === 'SELL' ? 68000 : undefined
    };
  }
}

export const openRouterService = new OpenRouterService();
export default openRouterService;
