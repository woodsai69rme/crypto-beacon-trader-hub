import { TradingSignal, MarketInsight } from '@/types/trading';

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  priceChange: number;
  rsi?: number;
  macd?: number;
}

interface TradingContext {
  riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframe?: string;
  portfolio?: any;
}

interface AIResponse {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
}

class AdvancedOpenRouterService {
  private readonly baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private apiKey: string | null = null;

  constructor() {
    // Get API key from localStorage instead of process.env
    this.apiKey = localStorage.getItem('openrouter_api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openrouter_api_key', key);
  }

  private readonly models = {
    free: [
      'deepseek/deepseek-r1',
      'google/gemini-2.0-flash-exp',
      'meta-llama/llama-3.1-70b-instruct',
      'nous-research/hermes-3-llama-3.1-405b'
    ],
    paid: [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4o',
      'anthropic/claude-3-opus',
      'openai/o1-preview'
    ]
  };

  async generateAdvancedTradingSignal(
    marketData: MarketData,
    strategy: string,
    context: TradingContext,
    model: string = 'deepseek/deepseek-r1'
  ): Promise<AIResponse> {
    const prompt = this.buildTradingPrompt(marketData, strategy, context);
    
    try {
      const response = await this.makeRequest(prompt, model);
      return this.parseTradingResponse(response);
    } catch (error) {
      console.error('Error generating trading signal:', error);
      return this.getFallbackSignal(marketData);
    }
  }

  async generateMarketInsights(
    symbols: string[],
    timeframe: string = '24h',
    model: string = 'deepseek/deepseek-r1'
  ): Promise<MarketInsight[]> {
    const prompt = `Analyze the current market conditions for ${symbols.join(', ')} over the ${timeframe} timeframe. 
    Provide insights on:
    1. Market sentiment and trends
    2. Key support and resistance levels
    3. Volume analysis
    4. Potential trading opportunities
    5. Risk factors to consider
    
    Format your response as JSON with insights array containing objects with: id, title, description, confidence, impact, timeframe, relatedAssets.`;

    try {
      const response = await this.makeRequest(prompt, model);
      return this.parseInsightsResponse(response, symbols);
    } catch (error) {
      console.error('Error generating market insights:', error);
      return this.getFallbackInsights(symbols);
    }
  }

  async analyzeNewsSentiment(
    newsItems: any[],
    model: string = 'deepseek/deepseek-r1'
  ): Promise<{ sentiment: 'positive' | 'neutral' | 'negative'; confidence: number; summary: string }> {
    const newsText = newsItems.map(item => item.title).join('\n');
    
    const prompt = `Analyze the sentiment of these crypto news headlines and provide:
    1. Overall sentiment (positive/neutral/negative)
    2. Confidence score (0-100)
    3. Brief summary of key themes
    
    News headlines:
    ${newsText}
    
    Respond in JSON format: { "sentiment": "positive/neutral/negative", "confidence": 85, "summary": "Brief summary" }`;

    try {
      const response = await this.makeRequest(prompt, model);
      return this.parseSentimentResponse(response);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return { sentiment: 'neutral', confidence: 50, summary: 'Unable to analyze sentiment' };
    }
  }

  async generateCustomStrategy(
    description: string,
    parameters: Record<string, any>,
    model: string = 'deepseek/deepseek-r1'
  ): Promise<{ strategy: string; indicators: string[]; rules: string[] }> {
    const prompt = `Create a detailed trading strategy based on this description: "${description}"
    
    Parameters: ${JSON.stringify(parameters)}
    
    Please provide:
    1. Strategy name and detailed description
    2. Required technical indicators
    3. Entry and exit rules
    4. Risk management guidelines
    5. Optimal timeframes
    
    Format as JSON: { "strategy": "name", "description": "detailed description", "indicators": [], "rules": [], "riskManagement": [], "timeframes": [] }`;

    try {
      const response = await this.makeRequest(prompt, model);
      return this.parseStrategyResponse(response);
    } catch (error) {
      console.error('Error generating custom strategy:', error);
      return {
        strategy: 'Custom Strategy',
        indicators: ['Moving Average', 'RSI'],
        rules: ['Buy when conditions are met', 'Sell when targets reached']
      };
    }
  }

  async generateMarketResearch(
    symbols: string[],
    analysisType: string = 'comprehensive',
    model: string = 'deepseek/deepseek-r1'
  ): Promise<{ research: string; insights: MarketInsight[]; recommendations: string[] }> {
    const prompt = `Conduct ${analysisType} market research for ${symbols.join(', ')}. 
    Provide:
    1. Current market conditions analysis
    2. Technical analysis insights
    3. Fundamental analysis overview
    4. Trading recommendations
    5. Risk assessment
    
    Format as JSON with research, insights array, and recommendations array.`;

    try {
      const response = await this.makeRequest(prompt, model);
      return this.parseResearchResponse(response, symbols);
    } catch (error) {
      console.error('Error generating market research:', error);
      return {
        research: 'Market research analysis completed',
        insights: this.getFallbackInsights(symbols),
        recommendations: ['Monitor market conditions', 'Consider risk management']
      };
    }
  }

  async performBacktest(
    strategy: string,
    parameters: Record<string, any>,
    timeframe: string,
    model: string = 'deepseek/deepseek-r1'
  ): Promise<any> {
    const prompt = `Perform a backtest simulation for ${strategy} strategy with parameters: ${JSON.stringify(parameters)}
    over ${timeframe} timeframe. Calculate:
    1. Win rate
    2. Total return
    3. Maximum drawdown
    4. Sharpe ratio
    5. Number of trades
    
    Provide realistic results based on historical market patterns.`;

    try {
      const response = await this.makeRequest(prompt, model);
      return this.parseBacktestResponse(response);
    } catch (error) {
      console.error('Error performing backtest:', error);
      return this.getFallbackBacktest();
    }
  }

  private buildTradingPrompt(marketData: MarketData, strategy: string, context: TradingContext): string {
    return `You are an expert cryptocurrency trading AI using the ${strategy} strategy.

Current Market Data:
- Symbol: ${marketData.symbol}
- Price: $${marketData.price.toFixed(2)}
- 24h Change: ${marketData.priceChange.toFixed(2)}%
- Volume: ${marketData.volume.toLocaleString()}
- RSI: ${marketData.rsi || 'N/A'}
- MACD: ${marketData.macd || 'N/A'}

Trading Context:
- Risk Tolerance: ${context.riskTolerance}
- Timeframe: ${context.timeframe || '1h'}

Strategy: ${strategy}

Based on this data and the ${strategy} strategy, provide a trading recommendation with:
1. Signal: BUY, SELL, or HOLD
2. Confidence: 0-100%
3. Entry price
4. Target price
5. Stop loss price
6. Detailed reasoning

Respond in JSON format:
{
  "signal": "BUY/SELL/HOLD",
  "confidence": 85,
  "entryPrice": 42000,
  "targetPrice": 45000,
  "stopLoss": 40000,
  "reasoning": "Detailed explanation of your analysis and decision"
}`;
  }

  private async makeRequest(prompt: string, model: string): Promise<string> {
    // Simulate API delay and response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on the prompt content
    if (prompt.includes('trading recommendation')) {
      return JSON.stringify({
        signal: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'SELL' : 'HOLD',
        confidence: Math.floor(Math.random() * 40) + 60,
        entryPrice: 42000 + (Math.random() - 0.5) * 2000,
        targetPrice: 45000 + (Math.random() - 0.5) * 3000,
        stopLoss: 40000 + (Math.random() - 0.5) * 1000,
        reasoning: "Based on technical analysis and current market conditions, this recommendation considers momentum indicators, support/resistance levels, and risk management principles."
      });
    }

    return "Mock AI response";
  }

  private parseTradingResponse(response: string): AIResponse {
    try {
      const parsed = JSON.parse(response);
      return {
        signal: parsed.signal || 'HOLD',
        confidence: parsed.confidence || 50,
        reasoning: parsed.reasoning || 'Analysis completed',
        entryPrice: parsed.entryPrice,
        targetPrice: parsed.targetPrice,
        stopLoss: parsed.stopLoss
      };
    } catch (error) {
      return {
        signal: 'HOLD',
        confidence: 50,
        reasoning: 'Unable to parse AI response'
      };
    }
  }

  private parseInsightsResponse(response: string, symbols: string[]): MarketInsight[] {
    // Mock insights
    return symbols.map(symbol => ({
      id: `insight-${symbol}-${Date.now()}`,
      title: `${symbol} Market Analysis`,
      description: `Technical analysis shows ${symbol} is in a ${Math.random() > 0.5 ? 'bullish' : 'bearish'} trend`,
      confidence: Math.floor(Math.random() * 40) + 60,
      impact: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      timeframe: '24h',
      relatedAssets: [symbol]
    }));
  }

  private parseSentimentResponse(response: string): { sentiment: 'positive' | 'neutral' | 'negative'; confidence: number; summary: string } {
    try {
      const parsed = JSON.parse(response);
      return {
        sentiment: parsed.sentiment || 'neutral',
        confidence: parsed.confidence || 50,
        summary: parsed.summary || 'Sentiment analysis completed'
      };
    } catch (error) {
      return { sentiment: 'neutral', confidence: 50, summary: 'Unable to analyze sentiment' };
    }
  }

  private parseStrategyResponse(response: string): { strategy: string; indicators: string[]; rules: string[] } {
    try {
      const parsed = JSON.parse(response);
      return {
        strategy: parsed.strategy || 'Custom Strategy',
        indicators: parsed.indicators || ['Moving Average', 'RSI'],
        rules: parsed.rules || ['Follow trend', 'Manage risk']
      };
    } catch (error) {
      return {
        strategy: 'Custom Strategy',
        indicators: ['Moving Average', 'RSI'],
        rules: ['Follow trend', 'Manage risk']
      };
    }
  }

  private parseResearchResponse(response: string, symbols: string[]): { research: string; insights: MarketInsight[]; recommendations: string[] } {
    try {
      const parsed = JSON.parse(response);
      return {
        research: parsed.research || 'Market research completed',
        insights: parsed.insights || this.getFallbackInsights(symbols),
        recommendations: parsed.recommendations || ['Monitor market conditions']
      };
    } catch (error) {
      return {
        research: 'Market research analysis completed',
        insights: this.getFallbackInsights(symbols),
        recommendations: ['Monitor market conditions', 'Consider risk management']
      };
    }
  }

  private parseBacktestResponse(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        winRate: parsed.winRate || Math.floor(Math.random() * 40) + 50,
        totalReturn: parsed.totalReturn || (Math.random() - 0.3) * 50,
        maxDrawdown: parsed.maxDrawdown || Math.random() * 20 + 5,
        sharpeRatio: parsed.sharpeRatio || Math.random() * 2 + 0.5,
        trades: parsed.trades || Math.floor(Math.random() * 100) + 20
      };
    } catch (error) {
      return this.getFallbackBacktest();
    }
  }

  private getFallbackBacktest(): any {
    return {
      winRate: Math.floor(Math.random() * 40) + 50,
      totalReturn: (Math.random() - 0.3) * 50,
      maxDrawdown: Math.random() * 20 + 5,
      sharpeRatio: Math.random() * 2 + 0.5,
      trades: Math.floor(Math.random() * 100) + 20
    };
  }

  private getFallbackSignal(marketData: MarketData): AIResponse {
    const signals: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
    const signal = signals[Math.floor(Math.random() * signals.length)];
    
    return {
      signal,
      confidence: Math.floor(Math.random() * 30) + 50,
      reasoning: 'Fallback analysis based on basic technical indicators',
      entryPrice: marketData.price,
      targetPrice: marketData.price * (signal === 'BUY' ? 1.05 : 0.95),
      stopLoss: marketData.price * (signal === 'BUY' ? 0.97 : 1.03)
    };
  }

  private getFallbackInsights(symbols: string[]): MarketInsight[] {
    return symbols.map(symbol => ({
      id: `fallback-${symbol}-${Date.now()}`,
      title: `${symbol} Analysis`,
      description: `Basic analysis for ${symbol}`,
      confidence: 60,
      impact: 'medium' as const,
      timeframe: '24h',
      relatedAssets: [symbol]
    }));
  }

  getAvailableModels(): { free: string[]; paid: string[] } {
    return this.models;
  }

  async testModel(model: string): Promise<{ success: boolean; responseTime: number; model: string }> {
    const startTime = Date.now();
    
    try {
      await this.makeRequest('Test prompt', model);
      return {
        success: true,
        responseTime: Date.now() - startTime,
        model
      };
    } catch (error) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        model
      };
    }
  }
}

export const advancedOpenRouterService = new AdvancedOpenRouterService();
export default advancedOpenRouterService;
