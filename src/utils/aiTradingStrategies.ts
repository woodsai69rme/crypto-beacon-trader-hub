
import { AITradingStrategy } from '@/types/trading';

export const aiTradingStrategies: AITradingStrategy[] = [
  {
    id: 'momentum-breakout',
    name: 'Momentum Breakout Strategy',
    description: 'Identifies and trades momentum breakouts with AI-powered entry and exit points',
    type: 'momentum',
    riskLevel: 'medium',
    profitPotential: 'high',
    timeframe: '4h',
    indicators: ['RSI', 'Volume', 'Moving Averages', 'Bollinger Bands'],
    triggers: ['Volume spike', 'Price breakout', 'RSI confirmation'],
    parameters: {
      confidenceThreshold: 0.75,
      maxPositionSize: 0.1,
      stopLossPercent: 3,
      takeProfitPercent: 8
    }
  },
  {
    id: 'sentiment-driven',
    name: 'AI Sentiment Trading',
    description: 'Uses natural language processing to analyze market sentiment and news',
    type: 'sentiment',
    riskLevel: 'medium',
    profitPotential: 'medium',
    timeframe: '1d',
    indicators: ['Sentiment Score', 'News Volume', 'Social Media Buzz'],
    triggers: ['Positive sentiment spike', 'News catalyst', 'Social momentum'],
    parameters: {
      sentimentThreshold: 0.6,
      newsWeight: 0.4,
      socialWeight: 0.3,
      orderSize: 0.05
    }
  },
  {
    id: 'mean-reversion-ml',
    name: 'ML Mean Reversion',
    description: 'Machine learning model that identifies overextended price movements',
    type: 'mean-reversion',
    riskLevel: 'low',
    profitPotential: 'medium',
    timeframe: '1h',
    indicators: ['Standard Deviation', 'Z-Score', 'Moving Averages'],
    triggers: ['Price deviation', 'Statistical significance', 'Reversion signal'],
    parameters: {
      lookbackPeriod: 20,
      entryDeviation: 2.0,
      exitDeviation: 0.5,
      tradeSize: 0.08
    }
  },
  {
    id: 'trend-following-ai',
    name: 'AI Trend Following',
    description: 'Advanced trend detection using machine learning algorithms',
    type: 'trend-following',
    riskLevel: 'medium',
    profitPotential: 'high',
    timeframe: '4h',
    indicators: ['MACD', 'ADX', 'Moving Averages', 'Trend Strength'],
    triggers: ['Trend confirmation', 'Momentum alignment', 'Volume validation'],
    parameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      adxThreshold: 25,
      trailingStop: 0.02
    }
  },
  {
    id: 'scalping-neural',
    name: 'Neural Network Scalping',
    description: 'High-frequency trading using neural networks for quick profits',
    type: 'scalping',
    riskLevel: 'high',
    profitPotential: 'medium',
    timeframe: '1h',
    indicators: ['Price Action', 'Order Book', 'Micro Trends'],
    triggers: ['Neural signal', 'Order flow imbalance', 'Price momentum'],
    parameters: {
      signalThreshold: 0.8,
      maxHoldTime: 30,
      profitTarget: 0.5,
      stopLoss: 0.2
    }
  },
  {
    id: 'multi-factor-ai',
    name: 'Multi-Factor AI Model',
    description: 'Combines technical, fundamental, and sentiment analysis',
    type: 'multi-factor',
    riskLevel: 'high',
    profitPotential: 'high',
    timeframe: '1d',
    indicators: ['Technical Score', 'Fundamental Metrics', 'Sentiment Analysis'],
    triggers: ['Multi-factor alignment', 'Confidence threshold', 'Risk assessment'],
    parameters: {
      technicalWeight: 0.4,
      sentimentWeight: 0.3,
      onChainWeight: 0.3,
      minConfidence: 0.7
    }
  }
];

export default aiTradingStrategies;
