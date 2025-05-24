
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

// Updated mock strategies with all required properties
const mockStrategies: AITradingStrategy[] = [
  {
    id: 'trend-follower',
    name: 'Trend Follower',
    description: 'Follows established market trends using multiple moving averages and momentum indicators.',
    type: 'trend-following',
    timeframe: 'medium',
    riskLevel: 'medium',
    profitPotential: 'medium',
    indicators: ['MA', 'MACD', 'RSI'],
    triggers: ['Moving Average Crossover', 'RSI Divergence'],
    tags: ['trend', 'momentum', 'technical'],
    backtestResults: {
      winRate: 65,
      profitFactor: 1.8,
      sharpeRatio: 1.5,
      maxDrawdown: 18
    }
  },
  {
    id: 'breakout-hunter',
    name: 'Breakout Hunter',
    description: 'Identifies and trades breakouts from key support and resistance levels.',
    type: 'breakout',
    timeframe: 'short',
    riskLevel: 'high',
    profitPotential: 'high',
    indicators: ['Bollinger Bands', 'Volume', 'ATR'],
    triggers: ['Volume Spike', 'Price Breakout'],
    tags: ['volatility', 'breakout', 'volume'],
    backtestResults: {
      winRate: 55,
      profitFactor: 2.1,
      sharpeRatio: 1.7,
      maxDrawdown: 25
    }
  },
  {
    id: 'mean-reverter',
    name: 'Mean Reversion',
    description: 'Capitalizes on price deviations from historical averages.',
    type: 'mean-reversion',
    timeframe: 'long',
    riskLevel: 'low',
    profitPotential: 'medium',
    indicators: ['RSI', 'Stochastic', 'Bollinger Bands'],
    triggers: ['Oversold/Overbought Signals', 'Support/Resistance'],
    tags: ['overbought', 'oversold', 'oscillator'],
    backtestResults: {
      winRate: 72,
      profitFactor: 1.6,
      sharpeRatio: 1.4,
      maxDrawdown: 15
    }
  },
  {
    id: 'sentiment-trader',
    name: 'Sentiment Analyzer',
    description: 'Trades based on market sentiment derived from news and social media.',
    type: 'sentiment',
    timeframe: 'medium',
    riskLevel: 'high',
    profitPotential: 'high',
    indicators: ['Sentiment Score', 'Social Volume', 'News Impact'],
    triggers: ['Positive Sentiment Spike', 'Negative Sentiment Drop'],
    tags: ['sentiment', 'news', 'social'],
    backtestResults: {
      winRate: 60,
      profitFactor: 1.9,
      sharpeRatio: 1.6,
      maxDrawdown: 22
    }
  },
  {
    id: 'ml-predictor',
    name: 'ML Predictor',
    description: 'Uses machine learning to predict price movements based on historical patterns.',
    type: 'machine-learning',
    timeframe: 'medium',
    riskLevel: 'medium',
    profitPotential: 'high',
    indicators: ['ML Score', 'Confidence', 'Pattern Recognition'],
    triggers: ['High Confidence Signal', 'Pattern Match'],
    tags: ['machine learning', 'prediction', 'pattern'],
    backtestResults: {
      winRate: 68,
      profitFactor: 2.0,
      sharpeRatio: 1.8,
      maxDrawdown: 20
    }
  },
  {
    id: 'multi-timeframe',
    name: 'Multi-Timeframe',
    description: 'Analyzes multiple timeframes to identify high-probability trading opportunities.',
    type: 'multi-timeframe',
    timeframe: 'short',
    riskLevel: 'low',
    profitPotential: 'medium',
    indicators: ['MA Alignments', 'Trend Strength', 'Confluence'],
    triggers: ['Timeframe Alignment', 'Confluence Signal'],
    tags: ['multi-timeframe', 'confluence', 'alignment'],
    backtestResults: {
      winRate: 70,
      profitFactor: 1.7,
      sharpeRatio: 1.5,
      maxDrawdown: 12
    }
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
                      strategy.riskLevel === 'low' ? 'outline' : 
                      strategy.riskLevel === 'medium' ? 'secondary' : 'destructive'
                    }
                  >
                    {strategy.riskLevel}
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
                
                {strategy.backtestResults && (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="font-medium">Win Rate</div>
                      <div className="text-accent-foreground">{strategy.backtestResults.winRate}%</div>
                    </div>
                    <div>
                      <div className="font-medium">Sharpe Ratio</div>
                      <div className="text-accent-foreground">{strategy.backtestResults.sharpeRatio}</div>
                    </div>
                    <div>
                      <div className="font-medium">Max Drawdown</div>
                      <div className="text-accent-foreground">{strategy.backtestResults.maxDrawdown}%</div>
                    </div>
                  </div>
                )}
                
                {strategy.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {strategy.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AiTradingStrategySelector;
