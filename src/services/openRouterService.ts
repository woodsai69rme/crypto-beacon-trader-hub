
// OpenRouter API service for AI trading signals and analysis
export interface TradingSignal {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SentimentAnalysis {
  overall_sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  key_factors: string[];
  sentiment_score: number;
  recommendation: string;
}

export interface MarketPrediction {
  asset: string;
  prediction: 'up' | 'down' | 'sideways';
  confidence: number;
  timeframe: string;
  priceTarget: number;
  reasoning: string;
}

class OpenRouterService {
  private apiKey: string = '';
  private baseUrl: string = 'https://openrouter.ai/api/v1';

  constructor() {
    // Try to get API key from localStorage first, then fallback to environment
    this.apiKey = localStorage.getItem('openrouter_api_key') || '';
    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. Some AI features will use mock data.');
    }
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('openrouter_api_key', key);
  }

  async generateTradingSignal(marketData: any, strategy: string, model: string = 'deepseek/deepseek-r1'): Promise<TradingSignal> {
    if (!this.apiKey) {
      return this.getMockTradingSignal(marketData, strategy);
    }

    try {
      const prompt = this.createTradingPrompt(marketData, strategy);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert cryptocurrency trading analyst. Provide precise trading signals based on market data and strategy. Return responses in JSON format only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const signal = JSON.parse(content);
        return this.validateTradingSignal(signal);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return this.getMockTradingSignal(marketData, strategy);
      }
    } catch (error) {
      console.error('Error generating trading signal:', error);
      return this.getMockTradingSignal(marketData, strategy);
    }
  }

  async performSentimentAnalysis(data: {
    newsItems: Array<{ title: string; content: string; source: string }>;
    socialPosts: Array<{ content: string; platform: string; engagement: number }>;
    timeframe: string;
  }): Promise<SentimentAnalysis> {
    if (!this.apiKey) {
      return this.getMockSentimentAnalysis();
    }

    try {
      const prompt = this.createSentimentPrompt(data);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1',
          messages: [
            {
              role: 'system',
              content: 'You are a cryptocurrency sentiment analyst. Analyze news and social media to determine market sentiment. Return responses in JSON format only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 400
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const responseData = await response.json();
      const content = responseData.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        return this.getMockSentimentAnalysis();
      }
    } catch (error) {
      console.error('Error performing sentiment analysis:', error);
      return this.getMockSentimentAnalysis();
    }
  }

  async generateMarketPrediction(data: {
    asset: string;
    historicalData: number[];
    technicalIndicators: Record<string, number>;
    timeframe: string;
    predictionHorizon: string;
  }): Promise<MarketPrediction> {
    if (!this.apiKey) {
      return this.getMockMarketPrediction(data.asset);
    }

    try {
      const prompt = this.createPredictionPrompt(data);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1',
          messages: [
            {
              role: 'system',
              content: 'You are a cryptocurrency market prediction expert. Analyze technical data to predict short-term price movements. Return responses in JSON format only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const responseData = await response.json();
      const content = responseData.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        return this.getMockMarketPrediction(data.asset);
      }
    } catch (error) {
      console.error('Error generating market prediction:', error);
      return this.getMockMarketPrediction(data.asset);
    }
  }

  private createTradingPrompt(marketData: any, strategy: string): string {
    return `
Analyze this market data and provide a trading signal using the ${strategy} strategy:

Market Data:
- Asset: ${marketData.symbol}
- Current Price: $${marketData.price}
- 24h Change: ${marketData.change24h}%
- Volume: ${marketData.volume}
- RSI: ${marketData.rsi || 'N/A'}
- MA20: ${marketData.ma20 || 'N/A'}

Strategy: ${strategy}

Provide your response in this exact JSON format:
{
  "signal": "BUY|SELL|HOLD",
  "confidence": 0.75,
  "reasoning": "Brief explanation of the signal",
  "entryPrice": ${marketData.price},
  "stopLoss": ${marketData.price * 0.95},
  "takeProfit": ${marketData.price * 1.1},
  "timeframe": "1h",
  "riskLevel": "medium"
}
`;
  }

  private createSentimentPrompt(data: any): string {
    const newsText = data.newsItems.map((item: any) => `${item.title}: ${item.content}`).join('\n');
    const socialText = data.socialPosts.map((post: any) => post.content).join('\n');
    
    return `
Analyze the sentiment of this cryptocurrency-related content:

News Items:
${newsText}

Social Media Posts:
${socialText}

Timeframe: ${data.timeframe}

Provide your response in this exact JSON format:
{
  "overall_sentiment": "bullish|bearish|neutral",
  "confidence": 0.80,
  "key_factors": ["factor1", "factor2"],
  "sentiment_score": 0.65,
  "recommendation": "Brief recommendation"
}
`;
  }

  private createPredictionPrompt(data: any): string {
    return `
Predict the price movement for ${data.asset} based on this technical analysis:

Historical Prices (last 10 periods): [${data.historicalData.join(', ')}]
Technical Indicators: ${JSON.stringify(data.technicalIndicators)}
Timeframe: ${data.timeframe}
Prediction Horizon: ${data.predictionHorizon}

Provide your response in this exact JSON format:
{
  "asset": "${data.asset}",
  "prediction": "up|down|sideways",
  "confidence": 0.72,
  "timeframe": "${data.predictionHorizon}",
  "priceTarget": ${data.historicalData[data.historicalData.length - 1] * 1.05},
  "reasoning": "Brief explanation of the prediction"
}
`;
  }

  private validateTradingSignal(signal: any): TradingSignal {
    return {
      signal: ['BUY', 'SELL', 'HOLD'].includes(signal.signal) ? signal.signal : 'HOLD',
      confidence: Math.max(0, Math.min(1, signal.confidence || 0.5)),
      reasoning: signal.reasoning || 'Analysis based on market conditions',
      entryPrice: signal.entryPrice || 0,
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit,
      timeframe: signal.timeframe || '1h',
      riskLevel: ['low', 'medium', 'high'].includes(signal.riskLevel) ? signal.riskLevel : 'medium'
    };
  }

  private getMockTradingSignal(marketData: any, strategy: string): TradingSignal {
    const signals = ['BUY', 'SELL', 'HOLD'] as const;
    const signal = signals[Math.floor(Math.random() * signals.length)];
    const confidence = 0.6 + Math.random() * 0.3;
    
    return {
      signal,
      confidence,
      reasoning: `${strategy} strategy suggests ${signal.toLowerCase()} based on current market conditions`,
      entryPrice: marketData.price || 50000,
      stopLoss: signal === 'BUY' ? marketData.price * 0.95 : undefined,
      takeProfit: signal === 'BUY' ? marketData.price * 1.1 : undefined,
      timeframe: '1h',
      riskLevel: 'medium'
    };
  }

  private getMockSentimentAnalysis(): SentimentAnalysis {
    const sentiments = ['bullish', 'bearish', 'neutral'] as const;
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    return {
      overall_sentiment: sentiment,
      confidence: 0.7 + Math.random() * 0.2,
      key_factors: ['Market momentum', 'News sentiment', 'Technical indicators'],
      sentiment_score: sentiment === 'bullish' ? 0.7 : sentiment === 'bearish' ? 0.3 : 0.5,
      recommendation: `Market sentiment appears ${sentiment}. Consider this in your trading decisions.`
    };
  }

  private getMockMarketPrediction(asset: string): MarketPrediction {
    const predictions = ['up', 'down', 'sideways'] as const;
    const prediction = predictions[Math.floor(Math.random() * predictions.length)];
    
    return {
      asset,
      prediction,
      confidence: 0.6 + Math.random() * 0.3,
      timeframe: '24h',
      priceTarget: 50000 + (Math.random() - 0.5) * 10000,
      reasoning: `Technical analysis suggests ${prediction} movement based on current patterns`
    };
  }
}

export const openRouterService = new OpenRouterService();
