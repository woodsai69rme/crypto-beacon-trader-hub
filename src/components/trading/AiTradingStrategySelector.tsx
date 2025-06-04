
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AITradingStrategy } from '@/types/trading';
import { TrendingUp, Target, Zap, Grid3X3, ArrowLeftRight, Activity, Brain, Eye, Shuffle, Wrench } from 'lucide-react';

interface AiTradingStrategySelectorProps {
  onSelectStrategy: (strategy: AITradingStrategy) => void;
  selectedStrategyId?: string;
}

const AiTradingStrategySelector: React.FC<AiTradingStrategySelectorProps> = ({
  onSelectStrategy,
  selectedStrategyId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const strategies: AITradingStrategy[] = [
    {
      id: 'trend-following-advanced',
      name: 'Advanced Trend Following',
      description: 'Multi-timeframe trend analysis with AI confirmation and dynamic position sizing',
      type: 'trend-following',
      timeframe: 24,
      riskLevel: 'medium',
      profitPotential: 'high',
      indicators: ['EMA', 'MACD', 'ADX', 'Volume Profile'],
      triggers: ['Trend Confirmation', 'Momentum Divergence'],
      parameters: {
        fastEMA: 12,
        slowEMA: 26,
        signalLine: 9,
        adxThreshold: 25,
        volumeMultiplier: 1.5
      },
      backtestResults: {
        winRate: 68,
        profitFactor: 2.1,
        maxDrawdown: 15,
        sharpeRatio: 1.4
      }
    },
    {
      id: 'mean-reversion-pro',
      name: 'Pro Mean Reversion',
      description: 'Statistical mean reversion with Bollinger Bands and RSI confluence',
      type: 'mean-reversion',
      timeframe: 4,
      riskLevel: 'low',
      profitPotential: 'medium',
      indicators: ['Bollinger Bands', 'RSI', 'Stochastic', 'Z-Score'],
      triggers: ['Oversold Recovery', 'Band Squeeze'],
      parameters: {
        bbPeriod: 20,
        bbStdDev: 2,
        rsiPeriod: 14,
        rsiOversold: 30,
        rsiOverbought: 70
      },
      backtestResults: {
        winRate: 72,
        profitFactor: 1.6,
        maxDrawdown: 8,
        sharpeRatio: 1.8
      }
    },
    {
      id: 'grid-trading-dynamic',
      name: 'Dynamic Grid Trading',
      description: 'Adaptive grid system that adjusts spacing based on volatility',
      type: 'grid',
      timeframe: 1,
      riskLevel: 'low',
      profitPotential: 'medium',
      indicators: ['ATR', 'Volume', 'Support/Resistance'],
      triggers: ['Grid Level Hit', 'Volatility Change'],
      parameters: {
        gridLevels: 10,
        baseSpacing: 0.01,
        volatilityAdjustment: true,
        maxPosition: 0.1
      },
      backtestResults: {
        winRate: 85,
        profitFactor: 1.3,
        maxDrawdown: 5,
        sharpeRatio: 2.1
      }
    },
    {
      id: 'breakout-momentum',
      name: 'Momentum Breakout',
      description: 'Identifies and trades significant price breakouts with volume confirmation',
      type: 'breakout',
      timeframe: 8,
      riskLevel: 'medium',
      profitPotential: 'high',
      indicators: ['Support/Resistance', 'Volume', 'ATR', 'Momentum'],
      triggers: ['Volume Breakout', 'Price Breakout'],
      parameters: {
        breakoutThreshold: 0.02,
        volumeMultiplier: 2.0,
        confirmationCandles: 2
      },
      backtestResults: {
        winRate: 58,
        profitFactor: 2.8,
        maxDrawdown: 18,
        sharpeRatio: 1.3
      }
    },
    {
      id: 'arbitrage-cross-exchange',
      name: 'Cross-Exchange Arbitrage',
      description: 'Exploits price differences across multiple exchanges with real-time monitoring',
      type: 'arbitrage',
      timeframe: 0.1,
      riskLevel: 'medium',
      profitPotential: 'high',
      indicators: ['Price Spread', 'Volume', 'Order Book Depth'],
      triggers: ['Spread Threshold', 'Liquidity Check'],
      parameters: {
        minSpread: 0.005,
        maxExposure: 0.1,
        exchanges: ['Binance', 'Coinbase', 'Kraken']
      },
      backtestResults: {
        winRate: 92,
        profitFactor: 1.8,
        maxDrawdown: 3,
        sharpeRatio: 3.2
      }
    },
    {
      id: 'scalping-ai',
      name: 'AI Scalping',
      description: 'High-frequency scalping with AI pattern recognition',
      type: 'scalping',
      timeframe: 0.25,
      riskLevel: 'high',
      profitPotential: 'medium',
      indicators: ['Order Flow', 'Level II', 'Tick Volume'],
      triggers: ['Micro Pattern', 'Liquidity Imbalance'],
      parameters: {
        targetProfit: 0.001,
        stopLoss: 0.0005,
        maxTrades: 100
      },
      backtestResults: {
        winRate: 65,
        profitFactor: 1.4,
        maxDrawdown: 12,
        sharpeRatio: 1.1
      }
    },
    {
      id: 'momentum-ml',
      name: 'ML Momentum',
      description: 'Machine learning enhanced momentum trading with predictive analytics',
      type: 'momentum',
      timeframe: 12,
      riskLevel: 'medium',
      profitPotential: 'high',
      indicators: ['ML Predictions', 'Momentum Oscillator', 'Rate of Change'],
      triggers: ['ML Signal', 'Momentum Acceleration'],
      parameters: {
        lookbackPeriod: 50,
        predictionHorizon: 24,
        confidenceThreshold: 0.7
      },
      backtestResults: {
        winRate: 71,
        profitFactor: 2.3,
        maxDrawdown: 14,
        sharpeRatio: 1.6
      }
    },
    {
      id: 'pattern-recognition-ai',
      name: 'AI Pattern Recognition',
      description: 'Advanced pattern detection using computer vision and machine learning',
      type: 'pattern-recognition',
      timeframe: 6,
      riskLevel: 'medium',
      profitPotential: 'high',
      indicators: ['Chart Patterns', 'Fibonacci', 'Support/Resistance'],
      triggers: ['Pattern Completion', 'Breakout Confirmation'],
      parameters: {
        patternTypes: ['Head & Shoulders', 'Triangles', 'Flags', 'Wedges'],
        minReliability: 0.8,
        confirmationBars: 3
      },
      backtestResults: {
        winRate: 66,
        profitFactor: 2.0,
        maxDrawdown: 16,
        sharpeRatio: 1.3
      }
    },
    {
      id: 'sentiment-driven',
      name: 'Sentiment-Driven Trading',
      description: 'Social sentiment and news analysis for trading decisions',
      type: 'sentiment',
      timeframe: 2,
      riskLevel: 'medium',
      profitPotential: 'medium',
      indicators: ['Social Sentiment', 'News Sentiment', 'Fear & Greed'],
      triggers: ['Sentiment Shift', 'News Event'],
      parameters: {
        sentimentSources: ['Twitter', 'Reddit', 'News'],
        sentimentThreshold: 0.6,
        newsWeight: 0.4
      },
      backtestResults: {
        winRate: 62,
        profitFactor: 1.7,
        maxDrawdown: 11,
        sharpeRatio: 1.2
      }
    },
    {
      id: 'ml-hybrid',
      name: 'ML Hybrid Strategy',
      description: 'Combines multiple ML models for comprehensive market analysis',
      type: 'machine-learning',
      timeframe: 8,
      riskLevel: 'high',
      profitPotential: 'high',
      indicators: ['Ensemble Models', 'Feature Engineering', 'Deep Learning'],
      triggers: ['Model Consensus', 'Confidence Threshold'],
      parameters: {
        models: ['LSTM', 'Random Forest', 'XGBoost'],
        ensembleWeights: [0.4, 0.3, 0.3],
        retrainInterval: 168
      },
      backtestResults: {
        winRate: 74,
        profitFactor: 2.5,
        maxDrawdown: 13,
        sharpeRatio: 1.9
      }
    }
  ];

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'trend-following': return <TrendingUp className="h-5 w-5" />;
      case 'mean-reversion': return <Target className="h-5 w-5" />;
      case 'breakout': return <Zap className="h-5 w-5" />;
      case 'grid': return <Grid3X3 className="h-5 w-5" />;
      case 'arbitrage': return <ArrowLeftRight className="h-5 w-5" />;
      case 'scalping': return <Activity className="h-5 w-5" />;
      case 'momentum': return <TrendingUp className="h-5 w-5" />;
      case 'pattern-recognition': return <Eye className="h-5 w-5" />;
      case 'sentiment': return <Brain className="h-5 w-5" />;
      case 'machine-learning': return <Brain className="h-5 w-5" />;
      default: return <Wrench className="h-5 w-5" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categories = [
    { id: 'all', name: 'All Strategies' },
    { id: 'conservative', name: 'Conservative' },
    { id: 'aggressive', name: 'Aggressive' },
    { id: 'ai-powered', name: 'AI-Powered' }
  ];

  const filteredStrategies = strategies.filter(strategy => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'conservative') return strategy.riskLevel === 'low';
    if (selectedCategory === 'aggressive') return strategy.riskLevel === 'high';
    if (selectedCategory === 'ai-powered') return ['machine-learning', 'sentiment', 'pattern-recognition'].includes(strategy.type);
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStrategies.map(strategy => (
          <Card 
            key={strategy.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedStrategyId === strategy.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectStrategy(strategy)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStrategyIcon(strategy.type)}
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                </div>
                <Badge className={getRiskColor(strategy.riskLevel || 'medium')}>
                  {strategy.riskLevel} risk
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {strategy.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Timeframe:</span>
                  <span className="font-medium">{strategy.timeframe}h</span>
                </div>

                {strategy.backtestResults && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Win Rate:</span>
                      <div className="font-medium text-green-600">
                        {strategy.backtestResults.winRate}%
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Profit Factor:</span>
                      <div className="font-medium">
                        {strategy.backtestResults.profitFactor}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Drawdown:</span>
                      <div className="font-medium text-red-600">
                        {strategy.backtestResults.maxDrawdown}%
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sharpe Ratio:</span>
                      <div className="font-medium">
                        {strategy.backtestResults.sharpeRatio}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {strategy.indicators?.slice(0, 3).map(indicator => (
                    <Badge key={indicator} variant="outline" className="text-xs">
                      {indicator}
                    </Badge>
                  ))}
                  {strategy.indicators && strategy.indicators.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{strategy.indicators.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  variant={selectedStrategyId === strategy.id ? 'default' : 'outline'}
                >
                  {selectedStrategyId === strategy.id ? 'Selected' : 'Select Strategy'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AiTradingStrategySelector;
