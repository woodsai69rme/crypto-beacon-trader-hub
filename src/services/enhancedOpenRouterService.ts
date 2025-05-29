
import { AITradingStrategy } from '@/types/trading';

const getApiKey = (): string => {
  return process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
};

const extractStrategyName = (content: string): string | null => {
  const nameRegex = /Strategy Name:\s*([^\n]+)/i;
  const match = content.match(nameRegex);
  return match ? match[1].trim() : null;
};

const extractDescription = (content: string): string | null => {
  const descriptionRegex = /Description:\s*([^\n]+)/i;
  const match = content.match(descriptionRegex);
  return match ? match[1].trim() : null;
};

const extractParameters = (content: string): any => {
  const parametersRegex = /Parameters:\s*({[\s\S]*?})/i;
  const match = content.match(parametersRegex);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error('Failed to parse parameters:', error);
      return {};
    }
  }
  return {};
};

const extractIndicators = (content: string): string[] => {
  const indicatorsRegex = /Indicators:\s*([^\n]+)/i;
  const match = content.match(indicatorsRegex);
  return match ? match[1].split(',').map(s => s.trim()) : [];
};

const extractTriggers = (content: string): string[] => {
  const triggersRegex = /Triggers:\s*([^\n]+)/i;
  const match = content.match(triggersRegex);
  return match ? match[1].split(',').map(s => s.trim()) : [];
};

export const generateTradingStrategy = async (
  prompt: string,
  preferences: any = {}
): Promise<AITradingStrategy> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: [
          {
            role: 'system',
            content: 'You are an expert trading strategy developer. Generate comprehensive trading strategies based on user requirements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse and create strategy
    return {
      id: `ai-strategy-${Date.now()}`,
      name: extractStrategyName(content) || 'AI Generated Strategy',
      description: extractDescription(content) || 'AI-generated trading strategy',
      type: 'ai-predictive',
      timeframe: 24,
      parameters: extractParameters(content),
      riskLevel: 'medium',
      indicators: extractIndicators(content),
      triggers: extractTriggers(content),
      confidence: 0.75,
      performance: {
        winRate: 65,
        profitFactor: 1.8,
        sharpeRatio: 1.4
      }
    };
  } catch (error) {
    console.error('Error generating trading strategy:', error);
    
    // Return fallback strategy
    return {
      id: `fallback-strategy-${Date.now()}`,
      name: 'Fallback Strategy',
      description: 'Default strategy when AI generation fails',
      type: 'trend-following',
      timeframe: 24,
      parameters: { defaultRisk: 'medium' },
      riskLevel: 'medium',
      indicators: ['SMA', 'RSI'],
      triggers: ['Moving average crossover'],
      confidence: 0.5
    };
  }
};

const generateEnsembleStrategy = async (
  prompt: string,
  preferences: any = {}
): Promise<AITradingStrategy> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: [
          {
            role: 'system',
            content: 'You are an expert trading strategy developer. Generate comprehensive trading strategies based on user requirements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse and create strategy
    const strategy: AITradingStrategy = {
      id: `ai-strategy-${Date.now()}`,
      name: extractStrategyName(content) || 'AI Generated Strategy',
      description: extractDescription(content) || 'AI-generated trading strategy',
      type: 'ai-predictive',
      timeframe: 24,
      parameters: extractParameters(content),
      riskLevel: 'medium',
      indicators: extractIndicators(content),
      performance: {
        winRate: 65,
        profitFactor: 1.8,
        sharpeRatio: 1.4
      }
    };

    return strategy;
  } catch (error) {
    console.error('Error generating trading strategy:', error);
    
    // Return fallback strategy
    return {
      id: `fallback-strategy-${Date.now()}`,
      name: 'Fallback Strategy',
      description: 'Default strategy when AI generation fails',
      type: 'trend-following',
      timeframe: 24,
      parameters: { defaultRisk: 'medium' },
      riskLevel: 'medium',
      indicators: ['SMA', 'RSI'],
      triggers: ['Moving average crossover'],
      confidence: 0.5
    };
  }
};

class EnhancedOpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async makeRequest(messages: { role: string, content: string }[]): Promise<any> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: messages,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    return response.json();
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
        News Items: ${JSON.stringify(data.newsItems)}
        Social Posts: ${JSON.stringify(data.socialPosts)}
        Timeframe: ${data.timeframe}
        
        Provide sentiment analysis with overall sentiment score (-1 to 1), trend direction, key topics, and risk indicators.`;

      const response = await this.makeRequest([{
        role: 'user',
        content: prompt
      }]);

      return {
        overallSentiment: Math.random() * 2 - 1, // Mock sentiment score
        sentimentTrend: Math.random() > 0.5 ? 'bullish' : 'bearish',
        keyTopics: ['Bitcoin', 'Ethereum', 'DeFi'],
        riskIndicators: ['Market volatility', 'Regulatory concerns']
      };
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return {
        overallSentiment: 0,
        sentimentTrend: 'neutral',
        keyTopics: [],
        riskIndicators: []
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

      return {
        priceTarget: Math.random() * 100000 + 30000, // Mock price target
        confidence: Math.random() * 0.5 + 0.5, // 50-100% confidence
        timeframe: data.predictionHorizon,
        keyFactors: ['Technical momentum', 'Market sentiment', 'Volume analysis'],
        riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      };
    } catch (error) {
      console.error('Market prediction failed:', error);
      return {
        priceTarget: 50000,
        confidence: 0.5,
        timeframe: data.predictionHorizon,
        keyFactors: [],
        riskLevel: 'medium'
      };
    }
  }

  async generateTradingStrategy(prompt: string, preferences: any = {}): Promise<AITradingStrategy> {
    return generateTradingStrategy(prompt, preferences);
  }

  async generateEnsembleStrategy(prompt: string, preferences: any = {}): Promise<AITradingStrategy> {
    return generateEnsembleStrategy(prompt, preferences);
  }
}

const enhancedOpenRouterService = new EnhancedOpenRouterService(getApiKey());

export { generateEnsembleStrategy };
export default enhancedOpenRouterService;
