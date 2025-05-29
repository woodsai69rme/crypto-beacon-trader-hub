
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AITradingStrategy } from '@/types/trading';
import { Bot, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface AiTradingStrategySelectorProps {
  onSelectStrategy: (strategy: AITradingStrategy) => void;
  selectedStrategyId?: string;
}

const AiTradingStrategySelector: React.FC<AiTradingStrategySelectorProps> = ({
  onSelectStrategy,
  selectedStrategyId
}) => {
  const [strategies] = useState<AITradingStrategy[]>([
    {
      id: 'trend-following',
      name: 'Trend Following',
      description: 'Follows major market trends using moving averages and momentum indicators',
      type: 'trend-following',
      timeframe: 24,
      parameters: {},
      riskLevel: 'medium',
      performance: {
        winRate: 65,
        profitFactor: 1.8,
        sharpeRatio: 1.4,
        trades: 156,
        maxDrawdown: 12
      }
    },
    {
      id: 'mean-reversion',
      name: 'Mean Reversion',
      description: 'Buys oversold and sells overbought conditions',
      type: 'mean-reversion',
      timeframe: 4,
      parameters: {},
      riskLevel: 'low',
      performance: {
        winRate: 72,
        profitFactor: 1.5,
        sharpeRatio: 1.7,
        trades: 203,
        maxDrawdown: 8
      }
    },
    {
      id: 'breakout',
      name: 'Breakout Strategy',
      description: 'Captures price movements after consolidation periods',
      type: 'breakout',
      timeframe: 1,
      parameters: {},
      riskLevel: 'high',
      performance: {
        winRate: 45,
        profitFactor: 2.1,
        sharpeRatio: 1.2,
        trades: 89,
        maxDrawdown: 18
      }
    },
    {
      id: 'sentiment',
      name: 'Sentiment Trading',
      description: 'Uses news sentiment and social media data for trading decisions',
      type: 'sentiment',
      timeframe: 6,
      parameters: {},
      riskLevel: 'medium',
      performance: {
        winRate: 58,
        profitFactor: 1.6,
        sharpeRatio: 1.3,
        trades: 124,
        maxDrawdown: 15
      }
    },
    {
      id: 'ml-prediction',
      name: 'ML Prediction',
      description: 'Advanced machine learning model for price prediction',
      type: 'machine-learning',
      timeframe: 12,
      parameters: {},
      riskLevel: 'high',
      performance: {
        winRate: 62,
        profitFactor: 1.9,
        sharpeRatio: 1.6,
        trades: 67,
        maxDrawdown: 14
      }
    },
    {
      id: 'grid-trading',
      name: 'Grid Trading',
      description: 'Places buy and sell orders at regular intervals',
      type: 'hybrid',
      timeframe: 168,
      parameters: {},
      riskLevel: 'low',
      performance: {
        winRate: 78,
        profitFactor: 1.3,
        sharpeRatio: 1.1,
        trades: 245,
        maxDrawdown: 6
      }
    }
  ]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {strategies.map((strategy) => (
        <Card 
          key={strategy.id} 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedStrategyId === strategy.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectStrategy(strategy)}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{strategy.name}</CardTitle>
              </div>
              <Badge variant={getRiskColor(strategy.riskLevel!)}>
                {strategy.riskLevel} risk
              </Badge>
            </div>
            <CardDescription className="text-sm">
              {strategy.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Timeframe:</span>
                <div className="font-medium">{strategy.timeframe}h</div>
              </div>
              <div>
                <span className="text-muted-foreground">Win Rate:</span>
                <div className="font-medium text-green-600">
                  {strategy.performance?.winRate}%
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Profit Factor:</span>
                <div className="font-medium">{strategy.performance?.profitFactor}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Max Drawdown:</span>
                <div className="font-medium text-red-600">
                  -{strategy.performance?.maxDrawdown}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <BarChart3 className="h-3 w-3" />
                {strategy.performance?.trades} trades
              </div>
              <div className="text-sm font-medium">
                Sharpe: {strategy.performance?.sharpeRatio}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AiTradingStrategySelector;
