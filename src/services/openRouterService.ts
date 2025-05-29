
import { toast } from "@/hooks/use-toast";

export interface TradingSignal {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  pricing: 'free' | 'paid';
  description: string;
}

class OpenRouterService {
  private apiKey: string | null = null;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.loadApiKey();
  }

  private loadApiKey(): void {
    const stored = localStorage.getItem('openrouter-api-key');
    if (stored) {
      this.apiKey = stored;
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('openrouter-api-key', apiKey);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  clearApiKey(): void {
    this.apiKey = null;
    localStorage.removeItem('openrouter-api-key');
  }

  async getModels(): Promise<AIModel[]> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.parseModels(data.data || []);
    } catch (error) {
      console.error('Failed to fetch models:', error);
      // Return default models if API fails
      return this.getDefaultModels();
    }
  }

  private parseModels(modelsData: any[]): AIModel[] {
    return modelsData.map(model => ({
      id: model.id,
      name: model.name || model.id,
      provider: this.extractProvider(model.id),
      pricing: this.determinePricing(model.id),
      description: model.description || ''
    })).slice(0, 20); // Limit to 20 models for performance
  }

  private extractProvider(modelId: string): string {
    if (modelId.includes('openai')) return 'OpenAI';
    if (modelId.includes('anthropic')) return 'Anthropic';
    if (modelId.includes('google')) return 'Google';
    if (modelId.includes('meta')) return 'Meta';
    if (modelId.includes('deepseek')) return 'DeepSeek';
    if (modelId.includes('mistral')) return 'Mistral';
    return 'Other';
  }

  private determinePricing(modelId: string): 'free' | 'paid' {
    const freeModels = [
      'deepseek/deepseek-r1',
      'google/gemini-2.0-flash-exp',
      'meta-llama/llama-3.3-70b-instruct',
      'microsoft/phi-3.5-mini-instruct',
      'qwen/qwen-2.5-7b-instruct'
    ];
    return freeModels.some(free => modelId.includes(free)) ? 'free' : 'paid';
  }

  getDefaultModels(): AIModel[] {
    return [
      {
        id: 'deepseek/deepseek-r1',
        name: 'DeepSeek R1',
        provider: 'DeepSeek',
        pricing: 'free',
        description: 'Advanced reasoning model, excellent for trading analysis'
      },
      {
        id: 'google/gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash',
        provider: 'Google',
        pricing: 'free',
        description: 'Fast and capable multimodal model'
      },
      {
        id: 'meta-llama/llama-3.3-70b-instruct',
        name: 'Llama 3.3 70B',
        provider: 'Meta',
        pricing: 'free',
        description: 'Large language model with strong reasoning'
      },
      {
        id: 'openai/gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'OpenAI',
        pricing: 'paid',
        description: 'Efficient and capable model from OpenAI'
      },
      {
        id: 'anthropic/claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'Anthropic',
        pricing: 'paid',
        description: 'Fast and efficient Claude model'
      }
    ];
  }

  async generateTradingSignal(marketData: any, strategy: string, model: string = 'deepseek/deepseek-r1'): Promise<TradingSignal> {
    if (!this.apiKey) {
      // Use mock signal when no API key
      return this.generateMockSignal(marketData);
    }

    try {
      const prompt = this.buildTradingPrompt(marketData, strategy);
      
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
              content: 'You are an expert cryptocurrency trading analyst. Analyze the provided market data and generate a trading signal with confidence score and reasoning.'
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

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.parseTradingSignal(data.choices[0]?.message?.content || '', marketData);
    } catch (error) {
      console.error('Failed to generate AI signal:', error);
      toast({
        title: "AI Signal Error",
        description: "Using fallback analysis. Check API key configuration.",
        variant: "destructive"
      });
      return this.generateMockSignal(marketData);
    }
  }

  private buildTradingPrompt(marketData: any, strategy: string): string {
    return `
Analyze the following cryptocurrency market data using ${strategy} strategy:

Current Price: $${marketData.price}
24h Change: ${marketData.change24h}%
Volume: $${marketData.volume}
Market Cap: $${marketData.marketCap}
RSI: ${marketData.rsi || 'N/A'}
MA(20): $${marketData.ma20 || 'N/A'}

Strategy: ${strategy}

Provide a trading signal in this format:
Signal: [BUY/SELL/HOLD]
Confidence: [0.0-1.0]
Entry Price: $[price]
Target Price: $[price]
Stop Loss: $[price]
Reasoning: [detailed explanation]

Focus on ${strategy} indicators and provide clear reasoning for your decision.
    `;
  }

  private parseTradingSignal(content: string, marketData: any): TradingSignal {
    try {
      const signal = content.includes('BUY') ? 'BUY' : 
                   content.includes('SELL') ? 'SELL' : 'HOLD';
      
      const confidenceMatch = content.match(/Confidence:\s*([\d.]+)/i);
      const confidence = confidenceMatch ? Math.min(parseFloat(confidenceMatch[1]), 1.0) : 0.7;
      
      const entryMatch = content.match(/Entry Price:\s*\$?([\d,.]+)/i);
      const entryPrice = entryMatch ? parseFloat(entryMatch[1].replace(/,/g, '')) : marketData.price;
      
      const targetMatch = content.match(/Target Price:\s*\$?([\d,.]+)/i);
      const targetPrice = targetMatch ? parseFloat(targetMatch[1].replace(/,/g, '')) : 
                         signal === 'BUY' ? entryPrice * 1.05 : entryPrice * 0.95;
      
      const stopMatch = content.match(/Stop Loss:\s*\$?([\d,.]+)/i);
      const stopLoss = stopMatch ? parseFloat(stopMatch[1].replace(/,/g, '')) :
                      signal === 'BUY' ? entryPrice * 0.95 : entryPrice * 1.05;
      
      const reasoningMatch = content.match(/Reasoning:\s*(.+?)(?:\n|$)/is);
      const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'AI analysis completed';

      return {
        signal: signal as 'BUY' | 'SELL' | 'HOLD',
        confidence,
        reasoning,
        entryPrice,
        targetPrice,
        stopLoss
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.generateMockSignal(marketData);
    }
  }

  private generateMockSignal(marketData: any): TradingSignal {
    const signals: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
    const signal = signals[Math.floor(Math.random() * signals.length)];
    const confidence = 0.6 + Math.random() * 0.3; // 60-90%
    
    const price = marketData.price || 50000;
    const entryPrice = price * (0.98 + Math.random() * 0.04); // ±2%
    
    return {
      signal,
      confidence,
      reasoning: `Mock analysis suggests ${signal} based on current market conditions. This is a simulated signal for demonstration purposes.`,
      entryPrice,
      targetPrice: signal === 'BUY' ? entryPrice * 1.05 : entryPrice * 0.95,
      stopLoss: signal === 'BUY' ? entryPrice * 0.95 : entryPrice * 1.05
    };
  }

  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      const models = await this.getModels();
      return models.length > 0;
    } catch {
      return false;
    }
  }
}

export const openRouterService = new OpenRouterService();
