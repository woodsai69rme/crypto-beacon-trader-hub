
import { AITradingStrategy } from '@/types/trading';

export const comprehensiveAiStrategies = {
  getAllStrategies(): AITradingStrategy[] {
    return [
      {
        id: 'trend-following-advanced',
        name: 'Advanced Trend Following',
        description: 'Multi-timeframe trend analysis with momentum confirmation',
        type: 'trend-following',
        riskLevel: 'medium',
        profitPotential: 'high',
        timeframe: 24,
        indicators: ['EMA', 'MACD', 'RSI', 'Volume'],
        triggers: ['EMA Crossover', 'MACD Signal Line', 'RSI Confirmation'],
        parameters: {
          fastEMA: 12,
          slowEMA: 26,
          rsiPeriod: 14,
          volumeThreshold: 1.5
        },
        backtestResults: {
          winRate: 68.5,
          profitFactor: 1.85,
          maxDrawdown: 12.3,
          sharpeRatio: 1.42
        }
      },
      {
        id: 'mean-reversion-ml',
        name: 'Machine Learning Mean Reversion',
        description: 'AI-powered mean reversion using statistical analysis',
        type: 'mean-reversion',
        riskLevel: 'low',
        profitPotential: 'medium',
        timeframe: 12,
        indicators: ['Bollinger Bands', 'Z-Score', 'Stochastic'],
        triggers: ['Statistical Deviation', 'Oversold/Overbought'],
        parameters: {
          lookbackPeriod: 20,
          zScoreThreshold: 2.0,
          reentryThreshold: 0.5
        },
        backtestResults: {
          winRate: 72.1,
          profitFactor: 1.34,
          maxDrawdown: 8.7,
          sharpeRatio: 1.18
        }
      },
      {
        id: 'arbitrage-multi-exchange',
        name: 'Multi-Exchange Arbitrage',
        description: 'Cross-exchange price difference exploitation',
        type: 'arbitrage',
        riskLevel: 'low',
        profitPotential: 'medium',
        timeframe: 1,
        indicators: ['Price Spread', 'Volume Analysis'],
        triggers: ['Price Differential', 'Liquidity Check'],
        parameters: {
          minSpread: 0.5,
          maxSlippage: 0.2,
          volumeRequirement: 10000
        },
        backtestResults: {
          winRate: 89.3,
          profitFactor: 2.12,
          maxDrawdown: 3.2,
          sharpeRatio: 2.45
        }
      },
      {
        id: 'grid-trading-dynamic',
        name: 'Dynamic Grid Trading',
        description: 'Adaptive grid strategy with volatility adjustment',
        type: 'grid',
        riskLevel: 'medium',
        profitPotential: 'medium',
        timeframe: 6,
        indicators: ['ATR', 'Volatility Index'],
        triggers: ['Grid Level Hit', 'Volatility Adjustment'],
        parameters: {
          gridLevels: 10,
          gridSpacing: 2.0,
          volatilityMultiplier: 1.5
        },
        backtestResults: {
          winRate: 78.9,
          profitFactor: 1.67,
          maxDrawdown: 15.4,
          sharpeRatio: 1.23
        }
      },
      {
        id: 'sentiment-analysis-nlp',
        name: 'NLP Sentiment Trading',
        description: 'News and social media sentiment analysis trading',
        type: 'sentiment',
        riskLevel: 'high',
        profitPotential: 'high',
        timeframe: 4,
        indicators: ['Sentiment Score', 'News Volume', 'Social Mentions'],
        triggers: ['Sentiment Spike', 'News Event', 'Social Trend'],
        parameters: {
          sentimentThreshold: 0.7,
          newsWeight: 0.4,
          socialWeight: 0.6
        },
        backtestResults: {
          winRate: 61.2,
          profitFactor: 2.34,
          maxDrawdown: 18.9,
          sharpeRatio: 1.56
        }
      }
    ];
  },

  getStrategyByType(type: string): AITradingStrategy[] {
    return this.getAllStrategies().filter(strategy => strategy.type === type);
  },

  getStrategyById(id: string): AITradingStrategy | undefined {
    return this.getAllStrategies().find(strategy => strategy.id === id);
  }
};

export default comprehensiveAiStrategies;
