import { TradingAccount, TradingSignal, MarketInsight, PortfolioOptimizationResult, OptimizationSettings, RiskAssessmentResult } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

// Mock AI-powered portfolio optimization service
export const generatePortfolioOptimization = async (
  account: TradingAccount,
  settings?: OptimizationSettings
): Promise<PortfolioOptimizationResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock optimization result
  return {
    currentAllocation: {
      'bitcoin': 60,
      'ethereum': 30,
      'cardano': 10
    },
    suggestedAllocation: {
      'bitcoin': 45,
      'ethereum': 35,
      'cardano': 15,
      'polygon': 5
    },
    expectedReturn: 12.5,
    expectedRisk: 18.2,
    sharpeRatio: 0.68,
    diversification: 0.82,
    rebalancingTrades: []
  };
};

// Export as optimizePortfolio for compatibility
export const optimizePortfolio = generatePortfolioOptimization;

export const assessPortfolioRisk = async (
  account: TradingAccount
): Promise<RiskAssessmentResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    overallScore: 75,
    diversificationScore: 68,
    volatilityScore: 82,
    liquidityScore: 90,
    concentrationRisk: 25,
    correlationRisk: 40,
    recommendations: [
      'Consider reducing Bitcoin concentration to below 50%',
      'Add exposure to DeFi tokens for better diversification',
      'Consider dollar-cost averaging to reduce timing risk'
    ],
    riskByAsset: {
      'bitcoin': { score: 60, factors: ['High volatility', 'Large allocation'] },
      'ethereum': { score: 70, factors: ['Moderate volatility'] }
    }
  };
};

export const generateTradingSignals = async (
  account: TradingAccount,
  options?: { limit?: number; minConfidence?: number }
): Promise<TradingSignal[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  const mockSignals: TradingSignal[] = [
    {
      id: uuidv4(),
      coinId: 'bitcoin',
      coinSymbol: 'BTC',
      type: 'buy',
      price: 45250,
      strength: 78,
      timestamp: new Date().toISOString(),
      reason: 'Technical analysis shows strong support at $45k level with RSI oversold',
      suggestedActions: {
        entry: 45000,
        target: 48500,
        stopLoss: 43000
      }
    },
    {
      id: uuidv4(),
      coinId: 'ethereum',
      coinSymbol: 'ETH',
      type: 'sell',
      price: 3150,
      strength: 72,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      reason: 'Resistance at $3200 level, momentum indicators suggest pullback',
      suggestedActions: {
        entry: 3150,
        target: 2900,
        stopLoss: 3300
      }
    }
  ];

  const limit = options?.limit || 10;
  const minConfidence = options?.minConfidence || 50;

  return mockSignals
    .filter(signal => signal.strength >= minConfidence)
    .slice(0, limit);
};

export const generateMarketInsights = async (
  account?: TradingAccount
): Promise<MarketInsight[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {
      id: uuidv4(),
      type: 'trend',
      title: 'Bitcoin Breaking Key Resistance',
      summary: 'BTC has broken above the 200-day moving average with strong volume',
      relevance: 85,
      confidence: 78,
      timestamp: new Date().toISOString(),
      assets: ['bitcoin'],
      details: 'Technical analysis indicates a potential continuation of the uptrend...'
    },
    {
      id: uuidv4(),
      type: 'opportunity',
      title: 'DeFi Sector Oversold',
      summary: 'Several DeFi tokens showing oversold conditions with strong fundamentals',
      relevance: 72,
      confidence: 65,
      timestamp: new Date(Date.now() - 600000).toISOString(),
      assets: ['uniswap', 'aave', 'compound'],
      details: 'Market sentiment has driven DeFi tokens to oversold levels...'
    }
  ];
};

// Export as getPersonalizedMarketInsights for compatibility
export const getPersonalizedMarketInsights = async (
  account: TradingAccount,
  options?: { limit?: number; relevanceThreshold?: number }
): Promise<MarketInsight[]> => {
  const insights = await generateMarketInsights(account);
  const limit = options?.limit || 10;
  const relevanceThreshold = options?.relevanceThreshold || 50;
  
  return insights
    .filter(insight => insight.relevance >= relevanceThreshold)
    .slice(0, limit);
};

// Additional utility functions
export const calculatePortfolioMetrics = (account: TradingAccount) => {
  const totalValue = account.assets?.reduce((sum, asset) => sum + asset.value, 0) || 0;
  const totalChange24h = account.assets?.reduce((sum, asset) => sum + asset.change24h, 0) || 0;
  const changePercent24h = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;

  return {
    totalValue,
    totalChange24h,
    changePercent24h,
    assetCount: account.assets?.length || 0
  };
};

export const getTopPerformingAssets = (account: TradingAccount, limit: number = 3) => {
  if (!account.assets) return [];
  
  return [...account.assets]
    .sort((a, b) => b.changePercent24h - a.changePercent24h)
    .slice(0, limit);
};

export const getWorstPerformingAssets = (account: TradingAccount, limit: number = 3) => {
  if (!account.assets) return [];
  
  return [...account.assets]
    .sort((a, b) => a.changePercent24h - b.changePercent24h)
    .slice(0, limit);
};

export default {
  generatePortfolioOptimization,
  optimizePortfolio,
  assessPortfolioRisk,
  generateTradingSignals,
  generateMarketInsights,
  getPersonalizedMarketInsights,
  calculatePortfolioMetrics,
  getTopPerformingAssets,
  getWorstPerformingAssets
};
