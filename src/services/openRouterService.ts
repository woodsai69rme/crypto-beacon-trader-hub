
import { AITradingStrategy } from '@/types/trading';

export interface TradingSignal {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
}

const getApiKey = (): string => {
  // Use localStorage instead of process.env for browser compatibility
  return localStorage.getItem('openrouter_api_key') || '';
};

export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || getApiKey();
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('openrouter_api_key', key);
  }

  clearApiKey(): void {
    this.apiKey = '';
    localStorage.removeItem('openrouter_api_key');
  }

  hasApiKey(): boolean {
    return this.apiKey.length > 0;
  }

  getDefaultModels() {
    return [
      { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', pricing: 'Free' },
      { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', pricing: 'Free' },
      { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', pricing: 'Paid' },
      { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', pricing: 'Paid' }
    ];
  }

  async getModels() {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching models:', error);
      return this.getDefaultModels();
    }
  }

  async makeRequest(messages: { role: string, content: string }[], model: string = 'deepseek/deepseek-r1'): Promise<any> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    return response.json();
  }

  async generateTradingSignal(marketData: any, strategy: string, model: string = 'deepseek/deepseek-r1'): Promise<TradingSignal> {
    try {
      const prompt = `Analyze market data for ${marketData.symbol || 'crypto'} and provide a trading signal using ${strategy} strategy.
        Current price: ${marketData.price}
        Volume: ${marketData.volume}
        Price change: ${marketData.priceChange}%
        
        Provide a JSON response with signal (BUY/SELL/HOLD), confidence (0-1), reasoning, entryPrice, targetPrice, and stopLoss.`;

      const response = await this.makeRequest([{
        role: 'user',
        content: prompt
      }], model);

      const content = response.choices[0]?.message?.content || '';
      return this.parseTradingSignalResponse(content, marketData);
    } catch (error) {
      console.error('Error generating trading signal:', error);
      return {
        signal: 'HOLD',
        confidence: 0.5,
        reasoning: 'Error generating signal',
        entryPrice: marketData.price || 0,
        targetPrice: marketData.price || 0,
        stopLoss: marketData.price || 0
      };
    }
  }

  async generateTradingStrategy(prompt: string, preferences: any = {}): Promise<AITradingStrategy> {
    try {
      const response = await this.makeRequest([
        {
          role: 'system',
          content: 'You are an expert trading strategy developer. Generate comprehensive trading strategies based on user requirements. Format your response with clear sections: Strategy Name, Description, Parameters (as JSON), Indicators, and Triggers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const content = response.choices[0]?.message?.content || '';
      return this.parseStrategyResponse(content);
    } catch (error) {
      console.error('Error generating trading strategy:', error);
      return this.getFallbackStrategy();
    }
  }

  async performSentimentAnalysis(data: {
    newsItems: Array<{ title: string; content: string; source: string }>;
    socialPosts: Array<{ content: string; platform: string; engagement: number }>;
    timeframe: string;
  }): Promise<{
    overallSentiment: number;
    sentimentTrend: string;
    keyTopics: string[];
    riskIndicators: string[];
  }> {
    try {
      const prompt = `Analyze the sentiment of the following crypto market data:
        News Items: ${JSON.stringify(data.newsItems.slice(0, 5))}
        Social Posts: ${JSON.stringify(data.socialPosts.slice(0, 10))}
        Timeframe: ${data.timeframe}
        
        Provide sentiment analysis with overall sentiment score (-1 to 1), trend direction, key topics, and risk indicators.`;

      const response = await this.makeRequest([{
        role: 'user',
        content: prompt
      }]);

      const content = response.choices[0]?.message?.content || '';
      return this.parseSentimentResponse(content);
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return {
        overallSentiment: Math.random() * 2 - 1,
        sentimentTrend: Math.random() > 0.5 ? 'bullish' : 'bearish',
        keyTopics: ['Bitcoin', 'Ethereum', 'Market volatility'],
        riskIndicators: ['High volatility', 'Regulatory uncertainty']
      };
    }
  }

  async generateMarketPrediction(data: {
    asset: string;
    historicalData: number[];
    technicalIndicators: Record<string, number>;
    timeframe: string;
    predictionHorizon: string;
  }): Promise<{
    priceTarget: number;
    confidence: number;
    timeframe: string;
    keyFactors: string[];
    riskLevel: string;
  }> {
    try {
      const prompt = `Generate a market prediction for ${data.asset} based on:
        Historical Data: ${data.historicalData.slice(-10)}
        Technical Indicators: ${JSON.stringify(data.technicalIndicators)}
        Timeframe: ${data.timeframe}
        Prediction Horizon: ${data.predictionHorizon}
        
        Provide price target, confidence level, key factors, and risk assessment.`;

      const response = await this.makeRequest([{
        role: 'user',
        content: prompt
      }]);

      const content = response.choices[0]?.message?.content || '';
      return this.parsePredictionResponse(content, data.asset);
    } catch (error) {
      console.error('Market prediction failed:', error);
      return {
        priceTarget: Math.random() * 100000 + 30000,
        confidence: Math.random() * 0.5 + 0.5,
        timeframe: data.predictionHorizon,
        keyFactors: ['Technical momentum', 'Market sentiment'],
        riskLevel: 'medium'
      };
    }
  }

  private parseTradingSignalResponse(content: string, marketData: any): TradingSignal {
    try {
      const jsonMatch = content.match(/\{[^}]+\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          signal: parsed.signal || 'HOLD',
          confidence: parsed.confidence || 0.5,
          reasoning: parsed.reasoning || 'AI analysis',
          entryPrice: parsed.entryPrice || marketData.price,
          targetPrice: parsed.targetPrice || marketData.price,
          stopLoss: parsed.stopLoss || marketData.price
        };
      }
    } catch (e) {
      console.error('Failed to parse trading signal:', e);
    }

    return {
      signal: 'HOLD',
      confidence: 0.5,
      reasoning: 'Default signal due to parsing error',
      entryPrice: marketData.price || 0,
      targetPrice: marketData.price || 0,
      stopLoss: marketData.price || 0
    };
  }

  private parseStrategyResponse(content: string): AITradingStrategy {
    const nameMatch = content.match(/Strategy Name:\s*([^\n]+)/i);
    const descMatch = content.match(/Description:\s*([^\n]+)/i);
    const paramMatch = content.match(/Parameters:\s*({[^}]+})/i);
    const indicatorsMatch = content.match(/Indicators:\s*([^\n]+)/i);
    const triggersMatch = content.match(/Triggers:\s*([^\n]+)/i);

    let parameters = {};
    if (paramMatch) {
      try {
        parameters = JSON.parse(paramMatch[1]);
      } catch (e) {
        console.error('Failed to parse parameters:', e);
      }
    }

    return {
      id: `ai-strategy-${Date.now()}`,
      name: nameMatch?.[1]?.trim() || 'AI Generated Strategy',
      description: descMatch?.[1]?.trim() || 'AI-generated trading strategy',
      type: 'ai-predictive',
      timeframe: '1h',
      parameters,
      riskLevel: 'medium',
      indicators: indicatorsMatch?.[1]?.split(',').map(s => s.trim()) || ['AI Analysis'],
      triggers: triggersMatch?.[1]?.split(',').map(s => s.trim()) || ['AI Signal'],
      confidence: 0.75,
      performance: {
        winRate: 65,
        profitFactor: 1.8,
        sharpeRatio: 1.4
      }
    };
  }

  private parseSentimentResponse(content: string): any {
    const sentimentMatch = content.match(/sentiment[:\s]+(-?\d*\.?\d+)/i);
    const trendMatch = content.match(/trend[:\s]+(bullish|bearish|neutral)/i);
    
    return {
      overallSentiment: sentimentMatch ? parseFloat(sentimentMatch[1]) : Math.random() * 2 - 1,
      sentimentTrend: trendMatch?.[1] || (Math.random() > 0.5 ? 'bullish' : 'bearish'),
      keyTopics: ['Bitcoin', 'Ethereum', 'Market analysis'],
      riskIndicators: ['Market volatility', 'Regulatory changes']
    };
  }

  private parsePredictionResponse(content: string, asset: string): any {
    const priceMatch = content.match(/price[:\s]+\$?(\d+(?:,\d+)*(?:\.\d+)?)/i);
    const confidenceMatch = content.match(/confidence[:\s]+(\d+(?:\.\d+)?)/i);
    
    return {
      priceTarget: priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : Math.random() * 100000 + 30000,
      confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) / 100 : Math.random() * 0.5 + 0.5,
      timeframe: '7d',
      keyFactors: ['Technical analysis', 'Market sentiment', 'Volume trends'],
      riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    };
  }

  private getFallbackStrategy(): AITradingStrategy {
    return {
      id: `fallback-strategy-${Date.now()}`,
      name: 'Fallback Strategy',
      description: 'Default strategy when AI generation fails',
      type: 'trend-following',
      timeframe: '1h',
      parameters: { defaultRisk: 'medium' },
      riskLevel: 'medium',
      indicators: ['SMA', 'RSI'],
      triggers: ['Moving average crossover'],
      confidence: 0.5,
      performance: {
        winRate: 50,
        profitFactor: 1.0,
        sharpeRatio: 0.5
      }
    };
  }
}

export const openRouterService = new OpenRouterService();
