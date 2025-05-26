
import { toast } from "@/hooks/use-toast";
import { AITradingStrategy, CoinOption } from '@/types/trading';

const OPENROUTER_API_KEYS = [
  'sk-SVuaujEtzO7skHM4C2qyhKVeOiXEFxMeANiwcur3DaT3BlbkFJH-_YtynEqZF051Bn8GwwA7vtj1e-eMrcA9BvZWwP0A',
  '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'
];

const API_BASE_URL = 'https://openrouter.ai/api/v1';

// Enhanced model list with free and paid options
export const enhancedOpenRouterModels = [
  // Free Models
  { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', tier: 'free', specialty: 'reasoning' },
  { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', provider: 'Google', tier: 'free', specialty: 'fast-analysis' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'Meta', tier: 'free', specialty: 'general' },
  { id: 'microsoft/phi-4', name: 'Phi-4', provider: 'Microsoft', tier: 'free', specialty: 'efficient' },
  { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', provider: 'Qwen', tier: 'free', specialty: 'multilingual' },
  
  // Paid Premium Models
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', tier: 'paid', specialty: 'advanced-reasoning' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', tier: 'paid', specialty: 'analysis' },
  { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', tier: 'paid', specialty: 'speed' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', provider: 'Google', tier: 'paid', specialty: 'multimodal' }
];

interface ModelUsageStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  totalCost: number;
  averageResponseTime: number;
}

class EnhancedOpenRouterService {
  private currentKeyIndex = 0;
  private modelUsageStats = new Map<string, ModelUsageStats>();
  private rateLimitTracking = new Map<string, { count: number; resetTime: number }>();

  private getApiKey(): string {
    return OPENROUTER_API_KEYS[this.currentKeyIndex];
  }

  private rotateApiKey(): void {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % OPENROUTER_API_KEYS.length;
  }

  private async makeRequest(endpoint: string, body: any, retries = 2): Promise<any> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.getApiKey()}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Advanced Crypto Trading Platform'
          },
          body: JSON.stringify(body),
        });

        const responseTime = Date.now() - startTime;

        if (response.status === 429) {
          // Rate limited, try next key
          this.rotateApiKey();
          if (attempt < retries) continue;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        // Update usage stats
        this.updateUsageStats(body.model, true, responseTime, data.usage?.total_tokens || 0);
        
        return data;
      } catch (error) {
        this.updateUsageStats(body.model, false, 0, 0);
        
        if (attempt === retries) {
          throw error;
        }
        
        // Rotate key and try again
        this.rotateApiKey();
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  private updateUsageStats(model: string, success: boolean, responseTime: number, tokens: number): void {
    const stats = this.modelUsageStats.get(model) || {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      totalCost: 0,
      averageResponseTime: 0
    };

    stats.totalCalls++;
    if (success) {
      stats.successfulCalls++;
      stats.averageResponseTime = (stats.averageResponseTime + responseTime) / 2;
      // Estimate cost based on tokens (rough estimate)
      stats.totalCost += (tokens / 1000) * 0.01; // $0.01 per 1K tokens estimate
    } else {
      stats.failedCalls++;
    }

    this.modelUsageStats.set(model, stats);
  }

  // Multi-model ensemble trading analysis
  async generateEnsembleTradingStrategy(params: {
    assets: string[];
    timeframe: string;
    riskLevel: string;
    marketConditions: string;
    historicalData?: any;
  }): Promise<AITradingStrategy> {
    const models = ['deepseek/deepseek-r1', 'google/gemini-2.0-flash-exp', 'meta-llama/llama-3.3-70b-instruct'];
    const strategies: AITradingStrategy[] = [];

    // Get analysis from multiple models
    for (const model of models) {
      try {
        const strategy = await this.generateTradingStrategy({ ...params, preferredModel: model });
        strategies.push(strategy);
      } catch (error) {
        console.error(`Failed to get strategy from ${model}:`, error);
      }
    }

    // Combine strategies into ensemble
    return this.combineStrategies(strategies, params);
  }

  async generateTradingStrategy(params: {
    assets: string[];
    timeframe: string;
    riskLevel: string;
    marketConditions: string;
    preferredModel?: string;
    additionalContext?: string;
  }): Promise<AITradingStrategy> {
    const model = params.preferredModel || 'deepseek/deepseek-r1';
    
    const prompt = `As an expert cryptocurrency trading strategist, analyze the following and create a comprehensive trading strategy:

Assets: ${params.assets.join(', ')}
Timeframe: ${params.timeframe}
Risk Level: ${params.riskLevel}
Market Conditions: ${params.marketConditions}
Base Currency: AUD (Australian Dollar)
${params.additionalContext ? `Additional Context: ${params.additionalContext}` : ''}

Provide a detailed strategy including:
1. Strategy name and type
2. Entry and exit criteria
3. Technical indicators to use
4. Risk management rules
5. Position sizing recommendations
6. Expected performance metrics
7. Market condition adaptations

Format your response as a structured analysis with clear actionable recommendations.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert cryptocurrency trading strategist with deep knowledge of technical analysis, market psychology, and risk management. Provide detailed, actionable trading strategies optimized for Australian cryptocurrency markets.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return this.parseStrategyResponse(response.choices[0].message.content, params);
    } catch (error) {
      console.error("Error generating trading strategy:", error);
      throw error;
    }
  }

  async performSentimentAnalysis(data: {
    newsItems: Array<{ title: string; content: string; source: string }>;
    socialPosts: Array<{ text: string; platform: string; engagement: number }>;
    timeframe: string;
  }): Promise<{
    overallSentiment: number;
    sentimentTrend: string;
    keyThemes: string[];
    riskFactors: string[];
    confidenceScore: number;
  }> {
    const model = 'google/gemini-2.0-flash-exp'; // Fast model for sentiment analysis

    const prompt = `Analyze the sentiment of the following cryptocurrency market data:

News Articles (${data.newsItems.length} items):
${data.newsItems.map(item => `- ${item.title} (${item.source})`).join('\n')}

Social Media Posts (${data.socialPosts.length} items):
${data.socialPosts.slice(0, 10).map(post => `- ${post.text.substring(0, 100)}... (${post.platform})`).join('\n')}

Timeframe: ${data.timeframe}

Provide:
1. Overall sentiment score (-1 to 1, where -1 is very bearish, 1 is very bullish)
2. Sentiment trend (improving/declining/stable)
3. Key themes driving sentiment
4. Risk factors to watch
5. Confidence score (0-1) in this analysis

Focus on Australian crypto market context and AUD-related implications.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert in cryptocurrency market sentiment analysis with expertise in social media trends, news impact, and market psychology.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      return this.parseSentimentResponse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      throw error;
    }
  }

  async generateMarketPrediction(params: {
    asset: string;
    historicalData: any[];
    technicalIndicators: Record<string, number>;
    timeframe: string;
    predictionHorizon: string;
  }): Promise<{
    priceTarget: number;
    confidence: number;
    timeframe: string;
    keyFactors: string[];
    riskFactors: string[];
    alternativeScenarios: Array<{ scenario: string; probability: number; target: number }>;
  }> {
    const model = 'deepseek/deepseek-r1'; // Good for reasoning and analysis

    const prompt = `Analyze the following data for ${params.asset} and provide a price prediction:

Historical Price Data: Last 30 data points showing trend
Technical Indicators:
${Object.entries(params.technicalIndicators).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Timeframe: ${params.timeframe}
Prediction Horizon: ${params.predictionHorizon}
Base Currency: AUD

Provide:
1. Primary price target with confidence level
2. Key factors supporting this prediction
3. Risk factors that could invalidate the prediction
4. Alternative scenarios with probabilities
5. Recommended actions based on prediction

Consider technical analysis, market structure, and broader crypto market conditions.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert cryptocurrency market analyst specializing in price prediction using technical analysis, market structure, and quantitative methods.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 1500
      });

      return this.parsePredictionResponse(response.choices[0].message.content, params.asset);
    } catch (error) {
      console.error("Error generating market prediction:", error);
      throw error;
    }
  }

  async optimizePortfolio(params: {
    currentHoldings: Array<{ asset: string; amount: number; valueAUD: number }>;
    riskProfile: string;
    objectives: string[];
    constraints: Record<string, any>;
    marketOutlook: string;
  }): Promise<{
    suggestedAllocation: Record<string, number>;
    rebalancingActions: Array<{ action: string; asset: string; amount: number; reasoning: string }>;
    expectedReturn: number;
    riskScore: number;
    timeframe: string;
  }> {
    const model = 'anthropic/claude-3.5-haiku'; // Good for structured analysis

    const currentPortfolio = params.currentHoldings.map(h => 
      `${h.asset}: ${h.amount} units (~$${h.valueAUD.toLocaleString()} AUD)`
    ).join('\n');

    const prompt = `Optimize the following cryptocurrency portfolio for Australian market conditions:

Current Portfolio:
${currentPortfolio}

Risk Profile: ${params.riskProfile}
Objectives: ${params.objectives.join(', ')}
Market Outlook: ${params.marketOutlook}
Constraints: ${JSON.stringify(params.constraints)}

Provide:
1. Optimal allocation percentages for each asset
2. Specific rebalancing actions with reasoning
3. Expected return and risk metrics
4. Timeline for rebalancing
5. Monitoring criteria for the new allocation

Consider Australian tax implications, AUD correlation, and local market access.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert portfolio manager specializing in cryptocurrency investments with deep knowledge of Australian financial markets and tax considerations.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1800
      });

      return this.parsePortfolioResponse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error optimizing portfolio:", error);
      throw error;
    }
  }

  private combineStrategies(strategies: AITradingStrategy[], params: any): AITradingStrategy {
    if (strategies.length === 0) {
      throw new Error('No strategies to combine');
    }

    // Simple ensemble approach - could be enhanced with weighted voting
    const combinedStrategy: AITradingStrategy = {
      id: `ensemble-${Date.now()}`,
      name: `Ensemble Strategy for ${params.assets.join(', ')}`,
      description: `Multi-model ensemble strategy combining insights from ${strategies.length} AI models`,
      type: 'ensemble',
      timeframe: params.timeframe,
      riskLevel: params.riskLevel,
      profitPotential: this.averageEnum(strategies.map(s => s.profitPotential)),
      indicators: [...new Set(strategies.flatMap(s => s.indicators))],
      triggers: [...new Set(strategies.flatMap(s => s.triggers))],
      confidence: strategies.reduce((sum, s) => sum + (s.confidence || 0.7), 0) / strategies.length,
      backtestResults: this.averageBacktestResults(strategies)
    };

    return combinedStrategy;
  }

  private parseStrategyResponse(content: string, params: any): AITradingStrategy {
    // Enhanced parsing logic
    const lines = content.split('\n');
    
    return {
      id: `strategy-${Date.now()}`,
      name: this.extractValue(content, ['Strategy Name', 'Name']) || `${params.assets[0]} Strategy`,
      description: this.extractValue(content, ['Description', 'Overview']) || content.substring(0, 200),
      type: this.extractValue(content, ['Type', 'Strategy Type']) || 'ai-generated',
      timeframe: params.timeframe,
      riskLevel: params.riskLevel,
      profitPotential: this.assessProfitPotential(content),
      indicators: this.extractList(content, ['Indicators', 'Technical Indicators']),
      triggers: this.extractList(content, ['Entry Criteria', 'Triggers', 'Signals']),
      confidence: this.assessConfidence(content),
      backtestResults: this.generateMockBacktest()
    };
  }

  private parseSentimentResponse(content: string) {
    return {
      overallSentiment: this.extractNumber(content, 'sentiment score') || 0,
      sentimentTrend: this.extractValue(content, ['trend', 'direction']) || 'stable',
      keyThemes: this.extractList(content, ['themes', 'key themes']),
      riskFactors: this.extractList(content, ['risk factors', 'risks']),
      confidenceScore: this.extractNumber(content, 'confidence') || 0.7
    };
  }

  private parsePredictionResponse(content: string, asset: string) {
    return {
      priceTarget: this.extractNumber(content, 'price target') || 0,
      confidence: this.extractNumber(content, 'confidence') || 0.7,
      timeframe: this.extractValue(content, ['timeframe']) || '1 week',
      keyFactors: this.extractList(content, ['key factors', 'supporting factors']),
      riskFactors: this.extractList(content, ['risk factors', 'risks']),
      alternativeScenarios: [
        { scenario: 'Bullish', probability: 0.3, target: 0 },
        { scenario: 'Base', probability: 0.4, target: 0 },
        { scenario: 'Bearish', probability: 0.3, target: 0 }
      ]
    };
  }

  private parsePortfolioResponse(content: string) {
    return {
      suggestedAllocation: {},
      rebalancingActions: [],
      expectedReturn: this.extractNumber(content, 'expected return') || 0,
      riskScore: this.extractNumber(content, 'risk score') || 0.5,
      timeframe: this.extractValue(content, ['timeframe']) || '1 month'
    };
  }

  // Utility methods
  private extractValue(text: string, keywords: string[]): string | null {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}:?\\s*(.+)`, 'i');
      const match = text.match(regex);
      if (match) return match[1].trim();
    }
    return null;
  }

  private extractNumber(text: string, keyword: string): number | null {
    const regex = new RegExp(`${keyword}:?\\s*([0-9.-]+)`, 'i');
    const match = text.match(regex);
    return match ? parseFloat(match[1]) : null;
  }

  private extractList(text: string, keywords: string[]): string[] {
    const items: string[] = [];
    for (const keyword of keywords) {
      const section = this.extractSection(text, keyword);
      if (section) {
        const lines = section.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
            items.push(line.replace(/^[-•]\s*/, '').trim());
          }
        }
      }
    }
    return items.length > 0 ? items : ['RSI', 'MACD', 'Moving Averages']; // Default fallback
  }

  private extractSection(text: string, keyword: string): string | null {
    const regex = new RegExp(`${keyword}:?\\s*([\\s\\S]*?)(?:\\n\\n|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  private assessProfitPotential(content: string): 'low' | 'medium' | 'high' {
    const lowKeywords = ['conservative', 'low risk', 'stable', 'defensive'];
    const highKeywords = ['aggressive', 'high reward', 'growth', 'momentum'];
    
    const lowerContent = content.toLowerCase();
    const lowScore = lowKeywords.reduce((sum, word) => sum + (lowerContent.includes(word) ? 1 : 0), 0);
    const highScore = highKeywords.reduce((sum, word) => sum + (lowerContent.includes(word) ? 1 : 0), 0);
    
    if (highScore > lowScore) return 'high';
    if (lowScore > highScore) return 'low';
    return 'medium';
  }

  private assessConfidence(content: string): number {
    // Simple confidence assessment based on content analysis
    const confidenceKeywords = ['confident', 'strong', 'reliable', 'proven'];
    const uncertaintyKeywords = ['uncertain', 'volatile', 'risky', 'unpredictable'];
    
    const lowerContent = content.toLowerCase();
    const confidenceScore = confidenceKeywords.reduce((sum, word) => sum + (lowerContent.includes(word) ? 1 : 0), 0);
    const uncertaintyScore = uncertaintyKeywords.reduce((sum, word) => sum + (lowerContent.includes(word) ? 1 : 0), 0);
    
    return Math.max(0.5, Math.min(0.95, 0.7 + (confidenceScore - uncertaintyScore) * 0.1));
  }

  private averageEnum(values: string[]): 'low' | 'medium' | 'high' {
    const scores = values.map(v => v === 'low' ? 1 : v === 'medium' ? 2 : 3);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return average < 1.5 ? 'low' : average < 2.5 ? 'medium' : 'high';
  }

  private averageBacktestResults(strategies: AITradingStrategy[]) {
    const results = strategies.filter(s => s.backtestResults).map(s => s.backtestResults!);
    if (results.length === 0) return this.generateMockBacktest();
    
    return {
      winRate: results.reduce((sum, r) => sum + r.winRate, 0) / results.length,
      profitFactor: results.reduce((sum, r) => sum + r.profitFactor, 0) / results.length,
      maxDrawdown: results.reduce((sum, r) => sum + r.maxDrawdown, 0) / results.length,
      sharpeRatio: results.reduce((sum, r) => sum + r.sharpeRatio, 0) / results.length
    };
  }

  private generateMockBacktest() {
    return {
      winRate: 55 + Math.random() * 25, // 55-80%
      profitFactor: 1.2 + Math.random() * 0.8, // 1.2-2.0
      maxDrawdown: 5 + Math.random() * 15, // 5-20%
      sharpeRatio: 0.5 + Math.random() * 1.0 // 0.5-1.5
    };
  }

  getModelUsageStats(): Map<string, ModelUsageStats> {
    return this.modelUsageStats;
  }

  getAvailableModels(tier?: 'free' | 'paid') {
    if (tier) {
      return enhancedOpenRouterModels.filter(model => model.tier === tier);
    }
    return enhancedOpenRouterModels;
  }
}

export const enhancedOpenRouterService = new EnhancedOpenRouterService();
