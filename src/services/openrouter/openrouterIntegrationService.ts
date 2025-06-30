
export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture?: string;
  top_provider?: {
    max_completion_tokens?: number;
    is_moderated?: boolean;
  };
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

export interface TradingAnalysisRequest {
  symbol: string;
  marketData: {
    price: number;
    change24h: number;
    volume: number;
    marketCap?: number;
    high24h?: number;
    low24h?: number;
  };
  strategy: string;
  timeframe: string;
  riskTolerance: 'low' | 'medium' | 'high';
}

export interface TradingAnalysisResponse {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
  timeframe: string;
  riskLevel: string;
  technicalIndicators?: {
    rsi?: number;
    macd?: string;
    movingAverages?: string;
  };
}

class OpenRouterIntegrationService {
  private baseUrl = 'https://openrouter.ai/api/v1';
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = localStorage.getItem('openrouter_api_key');
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('openrouter_api_key', key);
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  async getAvailableModels(): Promise<OpenRouterModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || this.getDefaultModels();
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      return this.getDefaultModels();
    }
  }

  async generateTradingAnalysis(
    request: TradingAnalysisRequest,
    modelId: string = 'deepseek/deepseek-r1'
  ): Promise<TradingAnalysisResponse> {
    if (!this.apiKey) {
      return this.getMockAnalysis(request);
    }

    try {
      const prompt = this.buildTradingPrompt(request);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      return this.parseAnalysisResponse(data.choices[0].message.content, request);
    } catch (error) {
      console.error('Error generating trading analysis:', error);
      return this.getMockAnalysis(request);
    }
  }

  async generateMultipleAnalyses(
    requests: TradingAnalysisRequest[],
    modelId?: string
  ): Promise<TradingAnalysisResponse[]> {
    const analyses = await Promise.all(
      requests.map(request => this.generateTradingAnalysis(request, modelId))
    );
    return analyses;
  }

  async generateMarketOverview(
    marketData: Array<{ symbol: string; price: number; change24h: number; volume: number }>,
    modelId: string = 'deepseek/deepseek-r1'
  ): Promise<{
    overallSentiment: 'bullish' | 'bearish' | 'neutral';
    keyInsights: string[];
    marketTrends: string[];
    recommendations: string[];
  }> {
    if (!this.apiKey) {
      return this.getMockMarketOverview();
    }

    try {
      const prompt = this.buildMarketOverviewPrompt(marketData);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'system',
              content: 'You are a professional crypto market analyst. Provide clear, concise market overviews with actionable insights.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.4,
          max_tokens: 1500,
        }),
      });

      const data: OpenRouterResponse = await response.json();
      return this.parseMarketOverviewResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating market overview:', error);
      return this.getMockMarketOverview();
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  private getSystemPrompt(): string {
    return `You are a professional cryptocurrency trading analyst with expertise in technical analysis, market sentiment, and risk management. 

Your task is to analyze market data and provide trading recommendations in JSON format.

Always respond with valid JSON containing:
- signal: "BUY", "SELL", or "HOLD"
- confidence: number from 0-100
- reasoning: brief explanation
- entryPrice: suggested entry price (optional)
- targetPrice: profit target (optional)
- stopLoss: stop loss level (optional)
- riskLevel: "low", "medium", or "high"
- technicalIndicators: relevant technical analysis

Be conservative with recommendations and always consider risk management.`;
  }

  private buildTradingPrompt(request: TradingAnalysisRequest): string {
    return `
Analyze ${request.symbol} for trading opportunities:

Market Data:
- Current Price: $${request.marketData.price}
- 24h Change: ${request.marketData.change24h}%
- 24h Volume: $${request.marketData.volume?.toLocaleString()}
- Market Cap: $${request.marketData.marketCap?.toLocaleString() || 'N/A'}
- 24h High: $${request.marketData.high24h || 'N/A'}
- 24h Low: $${request.marketData.low24h || 'N/A'}

Strategy: ${request.strategy}
Timeframe: ${request.timeframe}
Risk Tolerance: ${request.riskTolerance}

Provide a trading recommendation in JSON format with signal, confidence, reasoning, suggested entry/exit points, and technical analysis.
    `;
  }

  private buildMarketOverviewPrompt(
    marketData: Array<{ symbol: string; price: number; change24h: number; volume: number }>
  ): string {
    const marketSummary = marketData
      .map(data => `${data.symbol}: $${data.price} (${data.change24h >= 0 ? '+' : ''}${data.change24h}%)`)
      .join('\n');

    return `
Analyze the current cryptocurrency market based on the following data:

${marketSummary}

Provide a comprehensive market overview in JSON format with:
- overallSentiment: "bullish", "bearish", or "neutral"
- keyInsights: array of 3-5 key market insights
- marketTrends: array of current trends
- recommendations: array of actionable recommendations

Focus on overall market direction, sector performance, and trading opportunities.
    `;
  }

  private parseAnalysisResponse(content: string, request: TradingAnalysisRequest): TradingAnalysisResponse {
    try {
      const parsed = JSON.parse(content);
      return {
        signal: parsed.signal || 'HOLD',
        confidence: parsed.confidence || 50,
        reasoning: parsed.reasoning || 'Analysis performed with available data',
        entryPrice: parsed.entryPrice,
        targetPrice: parsed.targetPrice,
        stopLoss: parsed.stopLoss,
        timeframe: request.timeframe,
        riskLevel: parsed.riskLevel || request.riskTolerance,
        technicalIndicators: parsed.technicalIndicators,
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      return this.getMockAnalysis(request);
    }
  }

  private parseMarketOverviewResponse(content: string): {
    overallSentiment: 'bullish' | 'bearish' | 'neutral';
    keyInsights: string[];
    marketTrends: string[];
    recommendations: string[];
  } {
    try {
      const parsed = JSON.parse(content);
      return {
        overallSentiment: parsed.overallSentiment || 'neutral',
        keyInsights: parsed.keyInsights || ['Market analysis performed'],
        marketTrends: parsed.marketTrends || ['Mixed market conditions'],
        recommendations: parsed.recommendations || ['Monitor market conditions'],
      };
    } catch (error) {
      console.error('Error parsing market overview response:', error);
      return this.getMockMarketOverview();
    }
  }

  private getMockAnalysis(request: TradingAnalysisRequest): TradingAnalysisResponse {
    const signals: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
    const signal = signals[Math.floor(Math.random() * signals.length)];
    
    return {
      signal,
      confidence: Math.floor(Math.random() * 40) + 60,
      reasoning: `Mock analysis for ${request.symbol} using ${request.strategy} strategy. Market conditions suggest ${signal.toLowerCase()} signal.`,
      entryPrice: signal === 'BUY' ? request.marketData.price * 0.98 : signal === 'SELL' ? request.marketData.price * 1.02 : undefined,
      targetPrice: signal === 'BUY' ? request.marketData.price * 1.15 : signal === 'SELL' ? request.marketData.price * 0.85 : undefined,
      stopLoss: signal === 'BUY' ? request.marketData.price * 0.92 : signal === 'SELL' ? request.marketData.price * 1.08 : undefined,
      timeframe: request.timeframe,
      riskLevel: request.riskTolerance,
      technicalIndicators: {
        rsi: Math.floor(Math.random() * 40) + 30,
        macd: Math.random() > 0.5 ? 'bullish' : 'bearish',
        movingAverages: Math.random() > 0.5 ? 'above 20 MA' : 'below 20 MA',
      },
    };
  }

  private getMockMarketOverview(): {
    overallSentiment: 'bullish' | 'bearish' | 'neutral';
    keyInsights: string[];
    marketTrends: string[];
    recommendations: string[];
  } {
    const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
    return {
      overallSentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      keyInsights: [
        'Bitcoin showing strong institutional interest',
        'Altcoin season appears to be beginning',
        'DeFi protocols gaining traction',
        'Regulatory clarity improving market confidence',
      ],
      marketTrends: [
        'Increased institutional adoption',
        'Growing DeFi ecosystem',
        'Layer 2 solutions gaining momentum',
        'NFT market stabilizing',
      ],
      recommendations: [
        'Consider dollar-cost averaging into major assets',
        'Monitor regulatory developments',
        'Diversify across different crypto sectors',
        'Implement proper risk management',
      ],
    };
  }

  private getDefaultModels(): OpenRouterModel[] {
    return [
      {
        id: 'deepseek/deepseek-r1',
        name: 'DeepSeek R1',
        description: 'Advanced reasoning model for complex analysis',
        pricing: { prompt: '0', completion: '0' },
        context_length: 32768,
      },
      {
        id: 'google/gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash',
        description: 'Fast and efficient general-purpose model',
        pricing: { prompt: '0', completion: '0' },
        context_length: 32768,
      },
      {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        description: 'High-quality analysis and reasoning',
        pricing: { prompt: '3', completion: '15' },
        context_length: 200000,
      },
      {
        id: 'openai/gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Efficient OpenAI model for quick analysis',
        pricing: { prompt: '0.15', completion: '0.6' },
        context_length: 128000,
      },
    ];
  }
}

export const openRouterIntegrationService = new OpenRouterIntegrationService();
export default openRouterIntegrationService;
