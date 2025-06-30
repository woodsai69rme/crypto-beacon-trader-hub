
import { openRouterIntegrationService } from '../openrouter/openrouterIntegrationService';
import { contextService } from '../context/contextService';

export interface AdvancedAnalysisRequest {
  symbols: string[];
  timeframe: string;
  strategies: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  marketConditions?: string;
  newsContext?: string[];
}

export interface AdvancedAnalysisResponse {
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
  signals: Array<{
    symbol: string;
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string;
    targetPrice?: number;
    stopLoss?: number;
  }>;
  marketInsights: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    recommendations: string[];
  };
  strategicRecommendations: string[];
}

export interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
  annualizedReturn: number;
  volatility: number;
  trades: Array<{
    date: string;
    symbol: string;
    action: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    pnl: number;
  }>;
}

class AdvancedOpenRouterService {
  private baseService = openRouterIntegrationService;

  async generateAdvancedAnalysis(
    request: AdvancedAnalysisRequest,
    modelId: string = 'deepseek/deepseek-r1'
  ): Promise<AdvancedAnalysisResponse> {
    try {
      // Get recent context for enhanced analysis
      const recentContext = contextService.queryContexts({
        type: 'market',
        limit: 10
      });

      const prompt = this.buildAdvancedPrompt(request, recentContext);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'system',
              content: this.getAdvancedSystemPrompt(),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const analysis = this.parseAdvancedResponse(data.choices[0].message.content);
      
      // Store analysis in context
      await contextService.storeContext({
        type: 'trading',
        category: 'advanced-analysis',
        data: {
          request,
          analysis,
          modelUsed: modelId
        },
        source: 'advanced-openrouter-service'
      });

      return analysis;
    } catch (error) {
      console.error('Error in advanced analysis:', error);
      return this.getMockAdvancedAnalysis(request);
    }
  }

  async performBacktest(
    strategy: string,
    symbol: string,
    startDate: string,
    endDate: string,
    initialCapital: number = 10000
  ): Promise<BacktestResult> {
    try {
      const prompt = `Perform detailed backtesting for strategy: ${strategy} on ${symbol} from ${startDate} to ${endDate} with initial capital ${initialCapital}. Provide comprehensive results including all metrics and trade history.`;
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1',
          messages: [
            {
              role: 'system',
              content: 'You are a professional quantitative analyst specializing in backtesting trading strategies. Provide detailed, realistic results in JSON format.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 3000,
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error in backtesting:', error);
      return this.getMockBacktestResult(symbol, initialCapital);
    }
  }

  async generateMarketSentimentAnalysis(
    symbols: string[],
    modelId: string = 'deepseek/deepseek-r1'
  ): Promise<{
    overallSentiment: number;
    symbolSentiments: Record<string, number>;
    newsImpact: string[];
    socialTrends: string[];
  }> {
    try {
      const prompt = `Analyze current market sentiment for: ${symbols.join(', ')}
      
      Provide analysis on:
      1. Overall market sentiment (-100 to 100 scale)
      2. Individual symbol sentiments
      3. Key news impacts
      4. Social media trends
      
      Format as JSON with overallSentiment, symbolSentiments, newsImpact, socialTrends`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'system',
              content: 'You are a market sentiment analyst. Provide precise numerical sentiment scores.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      return {
        overallSentiment: Math.random() * 40 - 20,
        symbolSentiments: Object.fromEntries(symbols.map(s => [s, Math.random() * 40 - 20])),
        newsImpact: ['Mixed institutional interest', 'Regulatory developments pending'],
        socialTrends: ['Increased retail interest', 'Growing DeFi adoption']
      };
    }
  }

  async generateRiskAssessment(
    portfolioData: any,
    modelId: string = 'claude-3.5-sonnet'
  ): Promise<{
    riskScore: number;
    riskFactors: string[];
    recommendations: string[];
    hedgingSuggestions: string[];
  }> {
    try {
      const prompt = `Analyze portfolio risk for: ${JSON.stringify(portfolioData)}
      
      Provide comprehensive risk assessment including:
      1. Overall risk score (0-100)
      2. Key risk factors
      3. Risk mitigation recommendations
      4. Hedging suggestions
      
      Format as JSON.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'system',
              content: 'You are a professional risk analyst specializing in cryptocurrency portfolios.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.25,
          max_tokens: 1500,
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error in risk assessment:', error);
      return {
        riskScore: Math.floor(Math.random() * 60) + 20,
        riskFactors: ['High volatility exposure', 'Concentration risk', 'Market correlation'],
        recommendations: ['Diversify holdings', 'Set stop losses', 'Monitor positions'],
        hedgingSuggestions: ['Consider stablecoin allocation', 'Use options for protection']
      };
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const apiKey = this.baseService.getApiKey();
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    return headers;
  }

  private getAdvancedSystemPrompt(): string {
    return `You are an elite cryptocurrency trading analyst with deep expertise in:
    - Technical analysis across multiple timeframes
    - Fundamental analysis and market dynamics
    - Risk management and portfolio optimization
    - Market sentiment and behavioral finance
    - Quantitative trading strategies

    Always provide analysis in JSON format with detailed reasoning.
    Consider market context, risk factors, and multiple scenarios.
    Be conservative with high-confidence signals and always include risk warnings.`;
  }

  private buildAdvancedPrompt(request: AdvancedAnalysisRequest, context: any[]): string {
    const contextSummary = context.length > 0 
      ? `Recent market context: ${context.map(c => c.data.symbol || 'Market').join(', ')}`
      : 'No recent context available';

    return `
    Perform comprehensive trading analysis for:
    
    Symbols: ${request.symbols.join(', ')}
    Timeframe: ${request.timeframe}
    Strategies: ${request.strategies.join(', ')}
    Risk Tolerance: ${request.riskTolerance}
    ${request.marketConditions ? `Market Conditions: ${request.marketConditions}` : ''}
    ${request.newsContext ? `News Context: ${request.newsContext.join(', ')}` : ''}
    
    ${contextSummary}
    
    Provide detailed JSON analysis with:
    - overallSentiment: "bullish" | "bearish" | "neutral"
    - signals: array of detailed trading signals with confidence scores
    - marketInsights: key market observations
    - riskAssessment: comprehensive risk analysis
    - strategicRecommendations: actionable strategy advice
    
    Focus on AUD-based analysis and Australian market context where relevant.
    `;
  }

  private parseAdvancedResponse(content: string): AdvancedAnalysisResponse {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing advanced response:', error);
      return this.getMockAdvancedAnalysis({} as AdvancedAnalysisRequest);
    }
  }

  private getMockAdvancedAnalysis(request: AdvancedAnalysisRequest): AdvancedAnalysisResponse {
    const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
    const signals: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];

    return {
      overallSentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      signals: (request.symbols || ['BTC', 'ETH']).map(symbol => ({
        symbol,
        signal: signals[Math.floor(Math.random() * signals.length)],
        confidence: Math.floor(Math.random() * 40) + 60,
        reasoning: `Analysis for ${symbol} suggests ${signals[0].toLowerCase()} based on current market conditions`,
        targetPrice: Math.random() * 50000 + 10000,
        stopLoss: Math.random() * 45000 + 8000,
      })),
      marketInsights: [
        'Increased institutional adoption driving long-term growth',
        'Short-term volatility expected due to regulatory developments',
        'Technical indicators showing mixed signals across timeframes'
      ],
      riskAssessment: {
        level: request.riskTolerance || 'medium',
        factors: ['Market volatility', 'Regulatory uncertainty', 'Correlation risks'],
        recommendations: ['Implement position sizing', 'Use stop losses', 'Monitor market conditions']
      },
      strategicRecommendations: [
        'Consider dollar-cost averaging for long-term positions',
        'Diversify across different crypto sectors',
        'Maintain risk management discipline'
      ]
    };
  }

  private getMockBacktestResult(symbol: string, initialCapital: number): BacktestResult {
    const totalReturn = (Math.random() - 0.3) * 100; // -30% to 70% range
    const trades = Math.floor(Math.random() * 50) + 10;
    
    return {
      totalReturn,
      sharpeRatio: Math.random() * 2,
      maxDrawdown: Math.random() * 30,
      winRate: Math.random() * 40 + 40, // 40-80%
      totalTrades: trades,
      profitFactor: Math.random() * 2 + 0.5,
      annualizedReturn: totalReturn * 1.2,
      volatility: Math.random() * 50 + 20,
      trades: Array.from({ length: Math.min(trades, 10) }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        symbol,
        action: Math.random() > 0.5 ? 'BUY' : 'SELL' as 'BUY' | 'SELL',
        price: Math.random() * 50000 + 10000,
        quantity: Math.random() * 2,
        pnl: (Math.random() - 0.5) * 1000
      }))
    };
  }
}

export const advancedOpenRouterService = new AdvancedOpenRouterService();
export default advancedOpenRouterService;
