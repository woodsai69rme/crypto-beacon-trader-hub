
export interface TradingSignal {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
}

class OpenRouterService {
  private apiKey: string | null = null;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = localStorage.getItem('openrouter-api-key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openrouter-api-key', key);
  }

  async generateTradingSignal(
    marketData: any,
    strategy: string,
    model: string = 'deepseek/deepseek-r1'
  ): Promise<TradingSignal> {
    // Simulate AI analysis for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const signals = ['BUY', 'SELL', 'HOLD'] as const;
    const signal = signals[Math.floor(Math.random() * signals.length)];
    const confidence = 0.6 + Math.random() * 0.4; // 60-100%
    
    const reasonings = [
      'Technical indicators show strong bullish momentum with RSI oversold conditions.',
      'Market sentiment analysis indicates potential price consolidation in the near term.',
      'Volume analysis suggests significant buying pressure from institutional investors.',
      'Moving averages converging, indicating potential breakout opportunity.',
      'Support and resistance levels align with current market structure.',
      'Fibonacci retracement levels suggest strong upward potential.',
      'Market volatility decreasing, suggesting accumulation phase.',
      'On-chain metrics show increased network activity and adoption.'
    ];

    const reasoning = reasonings[Math.floor(Math.random() * reasonings.length)];

    return {
      signal,
      confidence,
      reasoning,
      entryPrice: marketData.price || 45000,
      targetPrice: marketData.price ? marketData.price * (signal === 'BUY' ? 1.1 : 0.9) : undefined,
      stopLoss: marketData.price ? marketData.price * (signal === 'BUY' ? 0.95 : 1.05) : undefined
    };
  }

  async analyzeMarketSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    reasoning: string;
  }> {
    // Simulate sentiment analysis
    await new Promise(resolve => setTimeout(resolve, 500));

    const sentiments = ['positive', 'negative', 'neutral'] as const;
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    return {
      sentiment,
      confidence: 0.7 + Math.random() * 0.3,
      reasoning: `Market sentiment analysis based on social media and news indicates ${sentiment} outlook.`
    };
  }

  getAvailableModels() {
    return [
      { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', free: true },
      { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', free: true },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', free: true },
      { id: 'openai/gpt-4o', name: 'GPT-4o', free: false },
      { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', free: false }
    ];
  }
}

export const openRouterService = new OpenRouterService();
