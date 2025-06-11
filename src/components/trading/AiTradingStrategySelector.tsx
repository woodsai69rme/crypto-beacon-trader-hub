
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AITradingStrategy } from '@/types/trading';
import { TrendingUp, BarChart3, Zap, Target, Grid3X3, ArrowLeftRight, Activity, Brain, Lightbulb, MessageSquare, Bot, Calculator } from 'lucide-react';

interface AiTradingStrategySelectorProps {
  strategies: AITradingStrategy[];
  onSelectStrategy: (strategy: AITradingStrategy) => void;
}

const BUILT_IN_STRATEGIES: AITradingStrategy[] = [
  {
    id: 'trend-following',
    name: 'Trend Following',
    description: 'Follows market momentum and trends for medium to long-term gains',
    type: 'trend-following',
    timeframe: 'medium',
    parameters: {
      movingAverageShort: 20,
      movingAverageLong: 50,
      stopLoss: 5,
      takeProfit: 15
    },
    riskLevel: 'medium',
    indicators: ['SMA', 'EMA', 'MACD'],
    performance: {
      winRate: 68,
      profitFactor: 1.8,
      sharpeRatio: 1.2,
      maxDrawdown: 12
    }
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'Exploits price reversals when assets deviate from their average',
    type: 'mean-reversion',
    timeframe: 'short',
    parameters: {
      bollingerBandPeriod: 20,
      rsiPeriod: 14,
      oversoldLevel: 30,
      overboughtLevel: 70
    },
    riskLevel: 'medium',
    indicators: ['RSI', 'Bollinger Bands', 'Stochastic'],
    performance: {
      winRate: 72,
      profitFactor: 2.1,
      sharpeRatio: 1.4,
      maxDrawdown: 8
    }
  },
  {
    id: 'breakout',
    name: 'Breakout Trading',
    description: 'Captures momentum when price breaks key resistance/support levels',
    type: 'breakout',
    timeframe: 'medium',
    parameters: {
      lookbackPeriod: 20,
      volumeConfirmation: true,
      breakoutThreshold: 2,
      stopLoss: 3
    },
    riskLevel: 'high',
    indicators: ['Volume', 'ATR', 'Support/Resistance'],
    performance: {
      winRate: 58,
      profitFactor: 2.5,
      sharpeRatio: 1.1,
      maxDrawdown: 18
    }
  },
  {
    id: 'scalping',
    name: 'Scalping',
    description: 'Quick trades capturing small price movements with high frequency',
    type: 'scalping',
    timeframe: 'short',
    parameters: {
      timeframe: '1m',
      targetProfit: 0.5,
      stopLoss: 0.3,
      maxTrades: 50
    },
    riskLevel: 'high',
    indicators: ['Level II', 'Order Flow', 'Tick Charts'],
    performance: {
      winRate: 78,
      profitFactor: 1.6,
      sharpeRatio: 0.9,
      maxDrawdown: 5
    }
  },
  {
    id: 'grid-trading',
    name: 'Grid Trading',
    description: 'Places buy/sell orders at regular intervals to profit from volatility',
    type: 'grid',
    timeframe: 'long',
    parameters: {
      gridSpacing: 2,
      numberOfGrids: 10,
      baseOrderSize: 100,
      geometricMultiplier: 1.05
    },
    riskLevel: 'low',
    indicators: ['Price Grid', 'Volatility'],
    performance: {
      winRate: 85,
      profitFactor: 1.3,
      sharpeRatio: 1.0,
      maxDrawdown: 15
    }
  },
  {
    id: 'arbitrage',
    name: 'Arbitrage',
    description: 'Exploits price differences across different exchanges',
    type: 'arbitrage',
    timeframe: 'short',
    parameters: {
      minSpread: 0.5,
      maxSlippage: 0.2,
      exchanges: ['binance', 'coinbase', 'kraken'],
      fees: 0.1
    },
    riskLevel: 'low',
    indicators: ['Price Spread', 'Liquidity'],
    performance: {
      winRate: 92,
      profitFactor: 1.2,
      sharpeRatio: 2.1,
      maxDrawdown: 3
    }
  },
  {
    id: 'momentum',
    name: 'Momentum Trading',
    description: 'Rides strong price movements with momentum indicators',
    type: 'momentum',
    timeframe: 'medium',
    parameters: {
      momentumPeriod: 14,
      adxThreshold: 25,
      rsiFilter: true,
      volumeFilter: true
    },
    riskLevel: 'high',
    indicators: ['ADX', 'RSI', 'Volume'],
    performance: {
      winRate: 65,
      profitFactor: 2.2,
      sharpeRatio: 1.3,
      maxDrawdown: 16
    }
  },
  {
    id: 'pattern-recognition',
    name: 'Pattern Recognition',
    description: 'Identifies and trades chart patterns like triangles and head & shoulders',
    type: 'pattern-recognition',
    timeframe: 'medium',
    parameters: {
      patterns: ['triangle', 'head_shoulders', 'double_top', 'flag'],
      minPatternStrength: 70,
      confirmationCandles: 3
    },
    riskLevel: 'medium',
    indicators: ['Chart Patterns', 'Fibonacci', 'Pivot Points'],
    performance: {
      winRate: 71,
      profitFactor: 1.9,
      sharpeRatio: 1.1,
      maxDrawdown: 11
    }
  },
  {
    id: 'machine-learning',
    name: 'ML Predictions',
    description: 'Uses machine learning models to predict price movements',
    type: 'machine-learning',
    timeframe: 'medium',
    parameters: {
      model: 'lstm',
      lookbackPeriod: 60,
      features: ['price', 'volume', 'volatility', 'sentiment'],
      confidenceThreshold: 0.8
    },
    riskLevel: 'medium',
    indicators: ['ML Model', 'Feature Engineering'],
    performance: {
      winRate: 74,
      profitFactor: 2.0,
      sharpeRatio: 1.5,
      maxDrawdown: 9
    }
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Trading',
    description: 'Trades based on market sentiment from news and social media',
    type: 'sentiment',
    timeframe: 'short',
    parameters: {
      sources: ['twitter', 'reddit', 'news'],
      sentimentThreshold: 0.7,
      volumeConfirmation: true,
      decayFactor: 0.9
    },
    riskLevel: 'high',
    indicators: ['Sentiment Score', 'Social Volume'],
    performance: {
      winRate: 69,
      profitFactor: 1.7,
      sharpeRatio: 1.0,
      maxDrawdown: 14
    }
  },
  {
    id: 'custom-hybrid',
    name: 'Custom Hybrid',
    description: 'Combines multiple strategies for diversified approach',
    type: 'hybrid',
    timeframe: 'medium',
    parameters: {
      strategies: ['trend', 'mean_reversion', 'momentum'],
      weights: [0.4, 0.3, 0.3],
      rebalanceFrequency: 'weekly'
    },
    riskLevel: 'medium',
    indicators: ['Multi-Strategy'],
    performance: {
      winRate: 73,
      profitFactor: 1.8,
      sharpeRatio: 1.4,
      maxDrawdown: 10
    }
  },
  {
    id: 'portfolio-rebalancing',
    name: 'Portfolio Rebalancing',
    description: 'Automatically rebalances portfolio based on risk parameters',
    type: 'custom',
    timeframe: 'long',
    parameters: {
      rebalanceFrequency: 'monthly',
      targetAllocations: { BTC: 40, ETH: 30, SOL: 20, ADA: 10 },
      threshold: 5,
      riskBudget: 15
    },
    riskLevel: 'low',
    indicators: ['Portfolio Metrics', 'Risk Parity'],
    performance: {
      winRate: 82,
      profitFactor: 1.4,
      sharpeRatio: 1.6,
      maxDrawdown: 12
    }
  }
];

const AiTradingStrategySelector: React.FC<AiTradingStrategySelectorProps> = ({ 
  strategies = [], 
  onSelectStrategy 
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  
  // Combine built-in strategies with custom ones
  const allStrategies = [...BUILT_IN_STRATEGIES, ...strategies];

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'trend-following': return <TrendingUp className="h-5 w-5" />;
      case 'mean-reversion': return <BarChart3 className="h-5 w-5" />;
      case 'breakout': return <Zap className="h-5 w-5" />;
      case 'scalping': return <Target className="h-5 w-5" />;
      case 'grid': return <Grid3X3 className="h-5 w-5" />;
      case 'arbitrage': return <ArrowLeftRight className="h-5 w-5" />;
      case 'momentum': return <Activity className="h-5 w-5" />;
      case 'pattern-recognition': return <Brain className="h-5 w-5" />;
      case 'machine-learning': return <Bot className="h-5 w-5" />;
      case 'sentiment': return <MessageSquare className="h-5 w-5" />;
      case 'hybrid': return <Lightbulb className="h-5 w-5" />;
      default: return <Calculator className="h-5 w-5" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectStrategy = (strategy: AITradingStrategy) => {
    setSelectedStrategy(strategy.id);
    onSelectStrategy(strategy);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Trading Strategies</h2>
        <p className="text-muted-foreground">
          Choose from our professionally designed trading strategies or create your own
        </p>
      </div>

      <div className="grid gap-4">
        {allStrategies.map((strategy) => (
          <Card 
            key={strategy.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedStrategy === strategy.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelectStrategy(strategy)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStrategyIcon(strategy.type)}
                  <div>
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {strategy.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getRiskColor(strategy.riskLevel || 'medium')}>
                    {strategy.riskLevel || 'Medium'} Risk
                  </Badge>
                  <Badge variant="outline">
                    {typeof strategy.timeframe === 'string' ? strategy.timeframe : 'Medium'} Term
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {strategy.performance && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {strategy.performance.winRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {strategy.performance.profitFactor}
                    </div>
                    <div className="text-xs text-muted-foreground">Profit Factor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {strategy.performance.sharpeRatio}
                    </div>
                    <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {strategy.performance.maxDrawdown}%
                    </div>
                    <div className="text-xs text-muted-foreground">Max Drawdown</div>
                  </div>
                </div>
              )}
              
              {strategy.indicators && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {strategy.indicators.map((indicator, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {indicator}
                    </Badge>
                  ))}
                </div>
              )}
              
              <Button 
                className="w-full" 
                variant={selectedStrategy === strategy.id ? "default" : "outline"}
              >
                {selectedStrategy === strategy.id ? 'Selected' : 'Select Strategy'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AiTradingStrategySelector;
