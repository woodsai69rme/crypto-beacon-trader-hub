
import { openRouterService, TradingSignal } from '@/services/openRouterService';
import { AITradingStrategy } from '@/types/trading';

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  priceChange: number;
  timestamp: string;
}

export class AiTradingService {
  async generateTradingSignal(marketData: MarketData, strategy: string): Promise<TradingSignal> {
    return openRouterService.generateTradingSignal(marketData, strategy);
  }

  async generateStrategy(prompt: string, preferences: any = {}): Promise<AITradingStrategy> {
    return openRouterService.generateTradingStrategy(prompt, preferences);
  }

  async analyzeSentiment(data: {
    newsItems: Array<{ title: string; content: string; source: string }>;
    socialPosts: Array<{ content: string; platform: string; engagement: number }>;
    timeframe: string;
  }) {
    return openRouterService.performSentimentAnalysis(data);
  }

  async predictMarket(data: {
    asset: string;
    historicalData: number[];
    technicalIndicators: Record<string, number>;
    timeframe: string;
    predictionHorizon: string;
  }) {
    return openRouterService.generateMarketPrediction(data);
  }
}

export const aiTradingService = new AiTradingService();
