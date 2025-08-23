
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIBotStrategy, AITradingStrategy } from '@/types/trading';
import { TrendingUp, BarChart3, Zap, Target, Grid3X3, ArrowLeftRight, Activity, Brain, Lightbulb, MessageSquare, Bot, Calculator } from 'lucide-react';

const ComprehensiveAIBotStrategies: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<AIBotStrategy | null>(null);
  
  const strategies: AIBotStrategy[] = [
    {
      id: 'trend-following',
      name: 'Trend Following',
      description: 'Follows market momentum and trends for medium to long-term gains',
      type: 'trend-following'
    },
    {
      id: 'mean-reversion',
      name: 'Mean Reversion', 
      description: 'Exploits price reversals when assets deviate from their average',
      type: 'mean-reversion'
    },
    {
      id: 'breakout',
      name: 'Breakout Trading',
      description: 'Captures momentum when price breaks key resistance/support levels',
      type: 'breakout'
    },
    {
      id: 'scalping',
      name: 'Scalping',
      description: 'Quick trades capturing small price movements with high frequency', 
      type: 'scalping'
    },
    {
      id: 'grid-trading',
      name: 'Grid Trading',
      description: 'Places buy/sell orders at regular intervals to profit from volatility',
      type: 'grid'
    },
    {
      id: 'arbitrage',
      name: 'Arbitrage',
      description: 'Exploits price differences across different exchanges',
      type: 'arbitrage'
    },
    {
      id: 'momentum',
      name: 'Momentum Trading',
      description: 'Rides strong price movements with momentum indicators',
      type: 'momentum'
    },
    {
      id: 'pattern-recognition',
      name: 'Pattern Recognition',
      description: 'Identifies and trades chart patterns like triangles and head & shoulders',
      type: 'pattern-recognition'
    },
    {
      id: 'machine-learning',
      name: 'ML Predictions',
      description: 'Uses machine learning models to predict price movements',
      type: 'machine-learning'
    },
    {
      id: 'sentiment-analysis',
      name: 'Sentiment Trading',
      description: 'Trades based on market sentiment from news and social media',
      type: 'sentiment-based'
    },
    {
      id: 'custom-hybrid',
      name: 'Custom Hybrid',
      description: 'Combines multiple strategies for diversified approach',
      type: 'custom'
    },
    {
      id: 'portfolio-rebalancing',
      name: 'Portfolio Rebalancing',
      description: 'Automatically rebalances portfolio based on risk parameters',
      type: 'portfolio-balancing'
    }
  ];

  const handleSelectStrategy = (strategy: AIBotStrategy) => {
    setSelectedStrategy(strategy);
  };

  const getStrategyIcon = (type: AITradingStrategy) => {
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
      case 'sentiment-based': return <MessageSquare className="h-5 w-5" />;
      case 'custom': return <Lightbulb className="h-5 w-5" />;
      default: return <Calculator className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Comprehensive AI Bot Strategies</h2>
        <p className="text-muted-foreground">
          Choose from our professionally designed trading strategies
        </p>
      </div>

      <div className="grid gap-4">
        {strategies.map((strategy) => (
          <Card 
            key={strategy.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedStrategy?.id === strategy.id ? 'ring-2 ring-primary' : ''
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
                <Badge variant="outline">
                  {strategy.type}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button 
                className="w-full" 
                variant={selectedStrategy?.id === strategy.id ? "default" : "outline"}
              >
                {selectedStrategy?.id === strategy.id ? 'Selected' : 'Select Strategy'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComprehensiveAIBotStrategies;
