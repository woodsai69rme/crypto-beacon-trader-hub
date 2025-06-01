
import { openRouterService } from '@/services/openRouterService';

export interface AdvancedTradingSignal {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframe: string;
  technicalIndicators: Record<string, number>;
  sentimentScore: number;
  marketConditions: string;
}

export interface MarketPrediction {
  asset: string;
  timeframe: string;
  priceTarget: number;
  confidence: number;
  supportLevels: number[];
  resistanceLevels: number[];
  volatilityForecast: number;
  trendDirection: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
}

export interface SentimentAnalysis {
  overallSentiment: number;
  newsScore: number;
  socialScore: number;
  fearGreedIndex: number;
  keyEvents: Array<{
    event: string;
    impact: number;
    timeframe: string;
  }>;
}

class AdvancedOpenRouterService {
  private models = {
    trading: 'deepseek/deepseek-r1',
    sentiment: 'google/gemini-2.0-flash-exp',
    prediction: 'anthropic/claude-3-haiku',
    research: 'openai/gpt-4o-mini'
  };

  async generateAdvancedTradingSignal(
    marketData: any,
    strategy: string,
    userPreferences: any = {}
  ): Promise<AdvancedTradingSignal> {
    const prompt = `
      As an expert trading analyst, analyze the following market data and generate a comprehensive trading signal:
      
      Market Data:
      - Symbol: ${marketData.symbol}
      - Current Price: $${marketData.price}
      - 24h Volume: $${marketData.volume}
      - Price Change: ${marketData.priceChange}%
      - RSI: ${marketData.rsi || 50}
      - MACD: ${marketData.macd || 0}
      - Moving Averages: 20MA: $${marketData.ma20 || marketData.price}, 50MA: $${marketData.ma50 || marketData.price}
      
      Strategy: ${strategy}
      Risk Tolerance: ${userPreferences.riskTolerance || 'MEDIUM'}
      
      Provide a JSON response with:
      {
        "signal": "BUY/SELL/HOLD",
        "confidence": 0.0-1.0,
        "reasoning": "detailed analysis",
        "entryPrice": number,
        "targetPrice": number,
        "stopLoss": number,
        "riskLevel": "LOW/MEDIUM/HIGH",
        "timeframe": "1h/4h/1d",
        "technicalIndicators": {"rsi": number, "macd": number},
        "sentimentScore": 0.0-1.0,
        "marketConditions": "description"
      }
    `;

    try {
      const response = await openRouterService.makeRequest([{
        role: 'user',
        content: prompt
      }], this.models.trading);

      const content = response.choices[0]?.message?.content || '';
      return this.parseAdvancedSignalResponse(content, marketData);
    } catch (error) {
      console.error('Error generating advanced trading signal:', error);
      return this.getFallbackSignal(marketData);
    }
  }

  async performAdvancedSentimentAnalysis(data: {
    newsItems: Array<{ title: string; content: string; source: string; publishedAt: string }>;
    socialPosts: Array<{ content: string; platform: string; engagement: number; timestamp: string }>;
    priceData: Array<{ price: number; timestamp: string }>;
  }): Promise<SentimentAnalysis> {
    const prompt = `
      Analyze the sentiment of crypto market data and provide comprehensive insights:
      
      Recent News (${data.newsItems.length} items):
      ${data.newsItems.slice(0, 5).map(item => `- ${item.title} (${item.source})`).join('\n')}
      
      Social Media Buzz (${data.socialPosts.length} posts):
      ${data.socialPosts.slice(0, 10).map(post => `- ${post.content.slice(0, 100)}... (${post.platform})`).join('\n')}
      
      Provide analysis with:
      - Overall sentiment score (-1 to 1)
      - News impact score (0-1)
      - Social media sentiment (0-1)
      - Fear & Greed estimation (0-100)
      - Key market events and their impact
    `;

    try {
      const response = await openRouterService.makeRequest([{
        role: 'system',
        content: 'You are a financial sentiment analyst. Provide accurate, data-driven sentiment analysis.'
      }, {
        role: 'user',
        content: prompt
      }], this.models.sentiment);

      const content = response.choices[0]?.message?.content || '';
      return this.parseSentimentResponse(content);
    } catch (error) {
      console.error('Advanced sentiment analysis failed:', error);
      return this.getFallbackSentiment();
    }
  }

  async generateMarketPredictions(data: {
    symbol: string;
    historicalPrices: number[];
    volume: number[];
    technicalIndicators: Record<string, number>;
    timeframe: string;
  }): Promise<MarketPrediction> {
    const prompt = `
      Generate market predictions for ${data.symbol} based on:
      
      Historical Prices (last 30 data points): ${data.historicalPrices.slice(-30).join(', ')}
      Volume Data: ${data.volume.slice(-10).join(', ')}
      Technical Indicators: ${JSON.stringify(data.technicalIndicators)}
      Timeframe: ${data.timeframe}
      
      Provide prediction with:
      - Price target for next period
      - Confidence level (0-1)
      - Support and resistance levels
      - Volatility forecast
      - Trend direction assessment
    `;

    try {
      const response = await openRouterService.makeRequest([{
        role: 'system',
        content: 'You are a quantitative analyst specializing in cryptocurrency price predictions.'
      }, {
        role: 'user',
        content: prompt
      }], this.models.prediction);

      const content = response.choices[0]?.message?.content || '';
      return this.parsePredictionResponse(content, data.symbol);
    } catch (error) {
      console.error('Market prediction failed:', error);
      return this.getFallbackPrediction(data.symbol, data.historicalPrices);
    }
  }

  async generateMarketResearch(topic: string): Promise<{
    summary: string;
    keyPoints: string[];
    outlook: string;
    risks: string[];
    opportunities: string[];
  }> {
    const prompt = `
      Generate comprehensive market research on: ${topic}
      
      Include:
      1. Executive summary
      2. Key market points
      3. Market outlook
      4. Risk factors
      5. Investment opportunities
      
      Focus on actionable insights for traders and investors.
    `;

    try {
      const response = await openRouterService.makeRequest([{
        role: 'system',
        content: 'You are a senior market research analyst providing institutional-grade analysis.'
      }, {
        role: 'user',
        content: prompt
      }], this.models.research);

      const content = response.choices[0]?.message?.content || '';
      return this.parseResearchResponse(content);
    } catch (error) {
      console.error('Market research generation failed:', error);
      return this.getFallbackResearch(topic);
    }
  }

  private parseAdvancedSignalResponse(content: string, marketData: any): AdvancedTradingSignal {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          signal: parsed.signal || 'HOLD',
          confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
          reasoning: parsed.reasoning || 'AI analysis',
          entryPrice: parsed.entryPrice || marketData.price,
          targetPrice: parsed.targetPrice || marketData.price * 1.05,
          stopLoss: parsed.stopLoss || marketData.price * 0.95,
          riskLevel: parsed.riskLevel || 'MEDIUM',
          timeframe: parsed.timeframe || '1h',
          technicalIndicators: parsed.technicalIndicators || {},
          sentimentScore: parsed.sentimentScore || 0.5,
          marketConditions: parsed.marketConditions || 'Normal market conditions'
        };
      }
    } catch (e) {
      console.error('Failed to parse advanced signal:', e);
    }
    return this.getFallbackSignal(marketData);
  }

  private parseSentimentResponse(content: string): SentimentAnalysis {
    return {
      overallSentiment: this.extractNumber(content, 'sentiment', -1, 1) || 0,
      newsScore: this.extractNumber(content, 'news', 0, 1) || 0.5,
      socialScore: this.extractNumber(content, 'social', 0, 1) || 0.5,
      fearGreedIndex: this.extractNumber(content, 'fear', 0, 100) || 50,
      keyEvents: []
    };
  }

  private parsePredictionResponse(content: string, symbol: string): MarketPrediction {
    const currentPrice = 45000; // Mock current price
    return {
      asset: symbol,
      timeframe: '24h',
      priceTarget: this.extractNumber(content, 'target', currentPrice * 0.8, currentPrice * 1.2) || currentPrice * 1.02,
      confidence: this.extractNumber(content, 'confidence', 0, 1) || 0.7,
      supportLevels: [currentPrice * 0.95, currentPrice * 0.9],
      resistanceLevels: [currentPrice * 1.05, currentPrice * 1.1],
      volatilityForecast: 0.15,
      trendDirection: Math.random() > 0.5 ? 'BULLISH' : 'BEARISH'
    };
  }

  private parseResearchResponse(content: string) {
    return {
      summary: content.slice(0, 300) + '...',
      keyPoints: ['Market analysis point 1', 'Market analysis point 2'],
      outlook: 'Cautiously optimistic',
      risks: ['Market volatility', 'Regulatory uncertainty'],
      opportunities: ['Technology adoption', 'Institutional investment']
    };
  }

  private extractNumber(text: string, keyword: string, min: number, max: number): number | null {
    const regex = new RegExp(`${keyword}[:\\s]+(-?\\d*\\.?\\d+)`, 'i');
    const match = text.match(regex);
    if (match) {
      const num = parseFloat(match[1]);
      return Math.min(Math.max(num, min), max);
    }
    return null;
  }

  private getFallbackSignal(marketData: any): AdvancedTradingSignal {
    return {
      signal: 'HOLD',
      confidence: 0.5,
      reasoning: 'Fallback analysis - insufficient data',
      entryPrice: marketData.price || 0,
      targetPrice: (marketData.price || 0) * 1.02,
      stopLoss: (marketData.price || 0) * 0.98,
      riskLevel: 'MEDIUM',
      timeframe: '1h',
      technicalIndicators: {},
      sentimentScore: 0.5,
      marketConditions: 'Normal conditions'
    };
  }

  private getFallbackSentiment(): SentimentAnalysis {
    return {
      overallSentiment: 0,
      newsScore: 0.5,
      socialScore: 0.5,
      fearGreedIndex: 50,
      keyEvents: []
    };
  }

  private getFallbackPrediction(symbol: string, prices: number[]): MarketPrediction {
    const lastPrice = prices[prices.length - 1] || 45000;
    return {
      asset: symbol,
      timeframe: '24h',
      priceTarget: lastPrice * 1.01,
      confidence: 0.5,
      supportLevels: [lastPrice * 0.95],
      resistanceLevels: [lastPrice * 1.05],
      volatilityForecast: 0.1,
      trendDirection: 'SIDEWAYS'
    };
  }

  private getFallbackResearch(topic: string) {
    return {
      summary: `Research analysis for ${topic} is currently unavailable.`,
      keyPoints: ['Analysis pending', 'Data collection in progress'],
      outlook: 'Neutral',
      risks: ['Market uncertainty'],
      opportunities: ['Potential growth']
    };
  }
}

export const advancedOpenRouterService = new AdvancedOpenRouterService();
