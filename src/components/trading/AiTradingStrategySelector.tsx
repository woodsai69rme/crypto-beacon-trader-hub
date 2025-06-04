
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AITradingStrategy } from '@/types/trading';
import { TrendingUp, TrendingDown, Zap, Target, Grid, RefreshCw, Brain, Heart, BarChart3, Sparkles, Settings, Code } from 'lucide-react';

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
      description: 'AI-powered trend detection with multi-timeframe analysis and momentum confirmation',
      type: 'trend-following',
      riskLevel: 'medium',
      profitPotential: 'high',
      timeframe: 24,
      indicators: ['MACD', 'EMA', 'ADX', 'Volume Profile'],
      triggers: ['Trend confirmation', 'Volume spike', 'Momentum alignment'],
      parameters: {
        fastEma: 12,
        slowEma: 26,
        adxThreshold: 25,
        volumeMultiplier: 1.5
      },
      backtestResults: {
        winRate: 68,
        profitFactor: 1.85,
        maxDrawdown: 12,
        sharpeRatio: 1.42
      }
    },
    {
      id: 'mean-reversion-ml',
      name: 'ML Mean Reversion',
      description: 'Machine learning model that identifies overextended price movements for contrarian trades',
      type: 'mean-reversion',
      riskLevel: 'low',
      profitPotential: 'medium',
      timeframe: 168,
      indicators: ['Bollinger Bands', 'RSI', 'Z-Score', 'Standard Deviation'],
      triggers: ['Oversold/Overbought', 'Statistical deviation', 'Reversion signal'],
      parameters: {
        lookbackPeriod: 20,
        zScoreThreshold: 2.0,
        rsiLower: 30,
        rsiUpper: 70
      },
      backtestResults: {
        winRate: 74,
        profitFactor: 1.52,
        maxDrawdown: 8,
        sharpeRatio: 1.68
      }
    },
    {
      id: 'breakout-momentum',
      name: 'Breakout Momentum',
      description: 'Captures explosive price movements after consolidation periods with volume confirmation',
      type: 'breakout',
      riskLevel: 'high',
      profitPotential: 'high',
      timeframe: 1,
      indicators: ['ATR', 'Volume', 'Support/Resistance', 'Volatility Squeeze'],
      triggers: ['Price breakout', 'Volume explosion', 'Volatility expansion'],
      parameters: {
        atrMultiplier: 2.0,
        volumeThreshold: 200,
        squeezePeriod: 20
      },
      backtestResults: {
        winRate: 45,
        profitFactor: 2.15,
        maxDrawdown: 18,
        sharpeRatio: 1.28
      }
    },
    {
      id: 'grid-trading-ai',
      name: 'AI Grid Trading',
      description: 'Intelligent grid system that adapts to market volatility and adjusts grid spacing dynamically',
      type: 'grid',
      riskLevel: 'medium',
      profitPotential: 'medium',
      timeframe: 24,
      indicators: ['ATR', 'Volatility', 'Price Range', 'Support/Resistance'],
      triggers: ['Range identification', 'Grid level hit', 'Volatility adjustment'],
      parameters: {
        gridLevels: 10,
        minSpacing: 0.5,
        maxSpacing: 2.0
      },
      backtestResults: {
        winRate: 82,
        profitFactor: 1.35,
        maxDrawdown: 6,
        sharpeRatio: 1.95
      }
    },
    {
      id: 'sentiment-neural',
      name: 'Neural Sentiment Analysis',
      description: 'Deep learning model analyzing news, social media, and on-chain data for sentiment-driven trades',
      type: 'sentiment',
      riskLevel: 'medium',
      profitPotential: 'high',
      timeframe: 24,
      indicators: ['Sentiment Score', 'News Volume', 'Social Buzz', 'Fear & Greed Index'],
      triggers: ['Sentiment shift', 'News catalyst', 'Social momentum'],
      parameters: {
        sentimentThreshold: 0.7,
        newsWeight: 0.4,
        socialWeight: 0.3
      },
      backtestResults: {
        winRate: 61,
        profitFactor: 1.78,
        maxDrawdown: 14,
        sharpeRatio: 1.33
      }
    },
    {
      id: 'arbitrage-scanner',
      name: 'Cross-Exchange Arbitrage',
      description: 'Scans multiple exchanges for price discrepancies and executes arbitrage opportunities',
      type: 'arbitrage',
      riskLevel: 'low',
      profitPotential: 'low',
      timeframe: 1,
      indicators: ['Price Spread', 'Volume', 'Latency', 'Fees'],
      triggers: ['Price differential', 'Liquidity check', 'Execution window'],
      parameters: {
        minSpread: 0.3,
        maxSlippage: 0.1,
        feeThreshold: 0.2
      },
      backtestResults: {
        winRate: 95,
        profitFactor: 1.18,
        maxDrawdown: 2,
        sharpeRatio: 2.85
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Strategies', icon: Sparkles },
    { id: 'trend-following', name: 'Trend Following', icon: TrendingUp },
    { id: 'mean-reversion', name: 'Mean Reversion', icon: TrendingDown },
    { id: 'breakout', name: 'Breakout', icon: Zap },
    { id: 'grid', name: 'Grid Trading', icon: Grid },
    { id: 'sentiment', name: 'Sentiment', icon: Heart },
    { id: 'arbitrage', name: 'Arbitrage', icon: RefreshCw }
  ];

  const filteredStrategies = selectedCategory === 'all' 
    ? strategies 
    : strategies.filter(s => s.type === selectedCategory);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfitColor = (profit: string) => {
    switch (profit) {
      case 'low': return 'text-gray-600';
      case 'medium': return 'text-blue-600';
      case 'high': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStrategies.map(strategy => (
          <Card 
            key={strategy.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedStrategyId === strategy.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectStrategy(strategy)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {strategy.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getRiskColor(strategy.riskLevel)} variant="outline">
                    {strategy.riskLevel} risk
                  </Badge>
                  <Badge variant="outline" className={getProfitColor(strategy.profitPotential)}>
                    {strategy.profitPotential} profit
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              {strategy.backtestResults && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Win Rate</span>
                      <span className="font-medium">{strategy.backtestResults.winRate}%</span>
                    </div>
                    <Progress value={strategy.backtestResults.winRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Profit Factor</span>
                      <span className="font-medium">{strategy.backtestResults.profitFactor}</span>
                    </div>
                    <Progress value={(strategy.backtestResults.profitFactor - 1) * 50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Max Drawdown</span>
                      <span className="font-medium text-red-600">{strategy.backtestResults.maxDrawdown}%</span>
                    </div>
                    <Progress value={100 - strategy.backtestResults.maxDrawdown} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Sharpe Ratio</span>
                      <span className="font-medium">{strategy.backtestResults.sharpeRatio}</span>
                    </div>
                    <Progress value={strategy.backtestResults.sharpeRatio * 33.33} className="h-2" />
                  </div>
                </div>
              )}

              {/* Indicators */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Key Indicators</p>
                <div className="flex flex-wrap gap-1">
                  {strategy.indicators?.map(indicator => (
                    <Badge key={indicator} variant="secondary" className="text-xs">
                      {indicator}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Timeframe */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Timeframe</span>
                <span className="font-medium">{strategy.timeframe}h</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AiTradingStrategySelector;
