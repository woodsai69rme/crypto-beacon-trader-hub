
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AITradingStrategy } from '@/types/trading';

interface AiTradingStrategySelectorProps {
  strategies: AITradingStrategy[];
  selectedStrategy?: string;
  onSelectStrategy: (strategyId: string) => void;
}

// Updated mock strategies with string timeframes
const mockStrategies: AITradingStrategy[] = [
  {
    id: 'trend-follower',
    name: 'Trend Follower',
    description: 'Follows established market trends using multiple moving averages and momentum indicators.',
    type: 'trend-following',
    timeframe: '1h',
    parameters: {
      riskLevel: 'medium',
      backtestResults: {
        winRate: 65,
        profitFactor: 1.8,
        sharpeRatio: 1.5,
        drawdown: 18,
        returns: 42
      }
    },
    indicators: ['MA', 'MACD', 'RSI'],
    tags: ['trend', 'momentum', 'technical']
  },
  {
    id: 'breakout-hunter',
    name: 'Breakout Hunter',
    description: 'Identifies and trades breakouts from key support and resistance levels.',
    type: 'breakout',
    timeframe: '4h',
    parameters: {
      riskLevel: 'high',
      backtestResults: {
        winRate: 55,
        profitFactor: 2.1,
        sharpeRatio: 1.7,
        drawdown: 25,
        returns: 68
      }
    },
    indicators: ['Bollinger Bands', 'Volume', 'ATR'],
    tags: ['volatility', 'breakout', 'volume']
  },
  {
    id: 'mean-reverter',
    name: 'Mean Reversion',
    description: 'Capitalizes on price deviations from historical averages.',
    type: 'mean-reversion',
    timeframe: '1d',
    parameters: {
      riskLevel: 'medium',
      backtestResults: {
        winRate: 72,
        profitFactor: 1.6,
        sharpeRatio: 1.4,
        drawdown: 15,
        returns: 35
      }
    },
    indicators: ['RSI', 'Stochastic', 'Bollinger Bands'],
    tags: ['overbought', 'oversold', 'oscillator']
  },
  {
    id: 'sentiment-trader',
    name: 'Sentiment Analyzer',
    description: 'Trades based on market sentiment derived from news and social media.',
    type: 'sentiment',
    timeframe: '1d',
    parameters: {
      riskLevel: 'high',
      backtestResults: {
        winRate: 60,
        profitFactor: 1.9,
        sharpeRatio: 1.6,
        drawdown: 22,
        returns: 58
      }
    },
    indicators: ['Sentiment Score', 'Social Volume', 'News Impact'],
    tags: ['sentiment', 'news', 'social']
  },
  {
    id: 'ml-predictor',
    name: 'ML Predictor',
    description: 'Uses machine learning to predict price movements based on historical patterns.',
    type: 'machine-learning',
    timeframe: '1d',
    parameters: {
      riskLevel: 'medium',
      backtestResults: {
        winRate: 68,
        profitFactor: 2.0,
        sharpeRatio: 1.8,
        drawdown: 20,
        returns: 62
      }
    },
    indicators: ['ML Score', 'Confidence', 'Pattern Recognition'],
    tags: ['machine learning', 'prediction', 'pattern']
  },
  {
    id: 'multi-timeframe',
    name: 'Multi-Timeframe',
    description: 'Analyzes multiple timeframes to identify high-probability trading opportunities.',
    type: 'multi-timeframe',
    timeframe: '4h',
    parameters: {
      riskLevel: 'low',
      backtestResults: {
        winRate: 70,
        profitFactor: 1.7,
        sharpeRatio: 1.5,
        drawdown: 12,
        returns: 38
      }
    },
    indicators: ['MA Alignments', 'Trend Strength', 'Confluence'],
    tags: ['multi-timeframe', 'confluence', 'alignment']
  }
];

const AiTradingStrategySelector: React.FC<AiTradingStrategySelectorProps> = ({
  strategies = mockStrategies,
  selectedStrategy,
  onSelectStrategy
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Trading Strategies</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`p-3 border rounded-md hover:bg-accent cursor-pointer ${
                  selectedStrategy === strategy.id ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => onSelectStrategy(strategy.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{strategy.name}</h3>
                  <Badge 
                    variant={
                      strategy.parameters.riskLevel === 'low' ? 'outline' : 
                      strategy.parameters.riskLevel === 'medium' ? 'secondary' : 'destructive'
                    }
                  >
                    {strategy.parameters.riskLevel}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
                
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  {strategy.indicators?.map((indicator, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {indicator}
                    </Badge>
                  ))}
                </div>
                
                {strategy.parameters.backtestResults && (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="font-medium">Win Rate</div>
                      <div className="text-accent-foreground">{strategy.parameters.backtestResults.winRate}%</div>
                    </div>
                    <div>
                      <div className="font-medium">Sharpe Ratio</div>
                      <div className="text-accent-foreground">{strategy.parameters.backtestResults.sharpeRatio}</div>
                    </div>
                    <div>
                      <div className="font-medium">Returns</div>
                      <div className="text-accent-foreground">{strategy.parameters.backtestResults.returns}%</div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {strategy.tags?.map((tag, index) => (
                    <span key={index} className="text-xs bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AiTradingStrategySelector;
