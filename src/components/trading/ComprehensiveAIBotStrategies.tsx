
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, TrendingUp, Brain, Zap, Target, Shield, Cpu, BarChart3 } from 'lucide-react';
import { AIBotStrategy, AdvancedAIBotConfig } from '@/types/trading';

const ComprehensiveAIBotStrategies: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<AIBotStrategy>('trend-following');

  const strategyCategories = {
    'Technical Analysis': [
      {
        id: 'trend-following' as AIBotStrategy,
        name: 'Trend Following',
        description: 'Follows price trends using moving averages and momentum indicators',
        complexity: 'Beginner',
        riskLevel: 'Medium',
        expectedReturn: '15-25%',
        timeframe: '1h-4h',
        icon: TrendingUp,
        color: 'bg-blue-500'
      },
      {
        id: 'mean-reversion' as AIBotStrategy,
        name: 'Mean Reversion',
        description: 'Trades against short-term price movements expecting return to average',
        complexity: 'Intermediate',
        riskLevel: 'Medium',
        expectedReturn: '10-20%',
        timeframe: '15m-1h',
        icon: Target,
        color: 'bg-green-500'
      },
      {
        id: 'breakout' as AIBotStrategy,
        name: 'Breakout',
        description: 'Identifies and trades significant price breakouts from consolidation',
        complexity: 'Intermediate',
        riskLevel: 'High',
        expectedReturn: '20-35%',
        timeframe: '30m-2h',
        icon: Zap,
        color: 'bg-yellow-500'
      },
      {
        id: 'rsi-divergence' as AIBotStrategy,
        name: 'RSI Divergence',
        description: 'Spots divergences between price and RSI for reversal signals',
        complexity: 'Advanced',
        riskLevel: 'Medium',
        expectedReturn: '12-22%',
        timeframe: '1h-4h',
        icon: BarChart3,
        color: 'bg-purple-500'
      },
      {
        id: 'bollinger-bands' as AIBotStrategy,
        name: 'Bollinger Bands',
        description: 'Uses volatility bands to identify overbought/oversold conditions',
        complexity: 'Beginner',
        riskLevel: 'Low',
        expectedReturn: '8-15%',
        timeframe: '30m-1h',
        icon: Shield,
        color: 'bg-indigo-500'
      },
      {
        id: 'macd-crossover' as AIBotStrategy,
        name: 'MACD Crossover',
        description: 'Trades on MACD signal line crossovers and histogram divergences',
        complexity: 'Beginner',
        riskLevel: 'Medium',
        expectedReturn: '10-18%',
        timeframe: '1h-4h',
        icon: TrendingUp,
        color: 'bg-teal-500'
      },
      {
        id: 'ichimoku-cloud' as AIBotStrategy,
        name: 'Ichimoku Cloud',
        description: 'Comprehensive system using cloud, lines, and momentum analysis',
        complexity: 'Advanced',
        riskLevel: 'Medium',
        expectedReturn: '15-25%',
        timeframe: '4h-1d',
        icon: Brain,
        color: 'bg-pink-500'
      }
    ],
    'Algorithmic Trading': [
      {
        id: 'scalping' as AIBotStrategy,
        name: 'High-Frequency Scalping',
        description: 'Rapid micro-trades capturing small price movements',
        complexity: 'Expert',
        riskLevel: 'High',
        expectedReturn: '30-50%',
        timeframe: '1m-5m',
        icon: Zap,
        color: 'bg-red-500'
      },
      {
        id: 'grid' as AIBotStrategy,
        name: 'Grid Trading',
        description: 'Places buy/sell orders at regular intervals in a grid pattern',
        complexity: 'Intermediate',
        riskLevel: 'Medium',
        expectedReturn: '12-20%',
        timeframe: '15m-1h',
        icon: Target,
        color: 'bg-orange-500'
      },
      {
        id: 'arbitrage' as AIBotStrategy,
        name: 'Cross-Exchange Arbitrage',
        description: 'Exploits price differences across multiple exchanges',
        complexity: 'Expert',
        riskLevel: 'Low',
        expectedReturn: '5-12%',
        timeframe: '1m-5m',
        icon: Cpu,
        color: 'bg-cyan-500'
      },
      {
        id: 'market-making' as AIBotStrategy,
        name: 'Market Making',
        description: 'Provides liquidity by placing both buy and sell orders',
        complexity: 'Expert',
        riskLevel: 'Medium',
        expectedReturn: '15-25%',
        timeframe: '1m-15m',
        icon: Shield,
        color: 'bg-emerald-500'
      },
      {
        id: 'pairs-trading' as AIBotStrategy,
        name: 'Pairs Trading',
        description: 'Trades correlated assets when their price relationship diverges',
        complexity: 'Advanced',
        riskLevel: 'Medium',
        expectedReturn: '10-18%',
        timeframe: '1h-4h',
        icon: Target,
        color: 'bg-violet-500'
      }
    ],
    'AI & Machine Learning': [
      {
        id: 'machine-learning' as AIBotStrategy,
        name: 'ML Prediction Model',
        description: 'Uses machine learning algorithms to predict price movements',
        complexity: 'Expert',
        riskLevel: 'High',
        expectedReturn: '25-40%',
        timeframe: '30m-4h',
        icon: Brain,
        color: 'bg-rose-500'
      },
      {
        id: 'sentiment' as AIBotStrategy,
        name: 'Sentiment Analysis',
        description: 'Analyzes news and social media sentiment for trading signals',
        complexity: 'Advanced',
        riskLevel: 'High',
        expectedReturn: '20-35%',
        timeframe: '15m-2h',
        icon: Brain,
        color: 'bg-amber-500'
      },
      {
        id: 'reinforcement-learning' as AIBotStrategy,
        name: 'Reinforcement Learning',
        description: 'AI that learns and adapts trading strategies through experience',
        complexity: 'Expert',
        riskLevel: 'High',
        expectedReturn: '30-60%',
        timeframe: '5m-1h',
        icon: Cpu,
        color: 'bg-fuchsia-500'
      },
      {
        id: 'deep-learning' as AIBotStrategy,
        name: 'Deep Neural Networks',
        description: 'Complex neural networks for pattern recognition and prediction',
        complexity: 'Expert',
        riskLevel: 'High',
        expectedReturn: '35-70%',
        timeframe: '15m-1h',
        icon: Brain,
        color: 'bg-sky-500'
      },
      {
        id: 'ensemble-methods' as AIBotStrategy,
        name: 'Ensemble ML',
        description: 'Combines multiple ML models for improved accuracy',
        complexity: 'Expert',
        riskLevel: 'Medium',
        expectedReturn: '25-45%',
        timeframe: '30m-2h',
        icon: Cpu,
        color: 'bg-lime-500'
      }
    ],
    'Advanced Strategies': [
      {
        id: 'whale-tracking' as AIBotStrategy,
        name: 'Whale Tracking',
        description: 'Monitors large wallet movements and follows whale activity',
        complexity: 'Advanced',
        riskLevel: 'High',
        expectedReturn: '20-40%',
        timeframe: '5m-1h',
        icon: Target,
        color: 'bg-slate-500'
      },
      {
        id: 'flash-loan-arbitrage' as AIBotStrategy,
        name: 'Flash Loan Arbitrage',
        description: 'Uses DeFi flash loans for risk-free arbitrage opportunities',
        complexity: 'Expert',
        riskLevel: 'Low',
        expectedReturn: '8-15%',
        timeframe: '1m-5m',
        icon: Zap,
        color: 'bg-gray-500'
      },
      {
        id: 'yield-farming-optimizer' as AIBotStrategy,
        name: 'Yield Farming Optimizer',
        description: 'Automatically moves funds to highest-yielding DeFi protocols',
        complexity: 'Advanced',
        riskLevel: 'Medium',
        expectedReturn: '15-30%',
        timeframe: '1h-1d',
        icon: TrendingUp,
        color: 'bg-green-600'
      },
      {
        id: 'options-arbitrage' as AIBotStrategy,
        name: 'Options Arbitrage',
        description: 'Exploits pricing inefficiencies in crypto options markets',
        complexity: 'Expert',
        riskLevel: 'Medium',
        expectedReturn: '12-25%',
        timeframe: '15m-1h',
        icon: Shield,
        color: 'bg-blue-600'
      }
    ],
    'Portfolio Management': [
      {
        id: 'portfolio-rebalancing' as AIBotStrategy,
        name: 'Auto Rebalancing',
        description: 'Automatically rebalances portfolio to target allocations',
        complexity: 'Intermediate',
        riskLevel: 'Low',
        expectedReturn: '8-15%',
        timeframe: '1d-1w',
        icon: Shield,
        color: 'bg-emerald-600'
      },
      {
        id: 'risk-parity' as AIBotStrategy,
        name: 'Risk Parity',
        description: 'Allocates risk equally across different assets',
        complexity: 'Advanced',
        riskLevel: 'Low',
        expectedReturn: '10-18%',
        timeframe: '1d-1w',
        icon: Shield,
        color: 'bg-teal-600'
      },
      {
        id: 'volatility-targeting' as AIBotStrategy,
        name: 'Volatility Targeting',
        description: 'Adjusts position sizes based on market volatility',
        complexity: 'Advanced',
        riskLevel: 'Medium',
        expectedReturn: '12-22%',
        timeframe: '4h-1d',
        icon: Target,
        color: 'bg-indigo-600'
      }
    ]
  };

  const allStrategies = Object.values(strategyCategories).flat();
  const selectedStrategyInfo = allStrategies.find(s => s.id === selectedStrategy);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'text-blue-600 bg-blue-100';
      case 'Intermediate': return 'text-purple-600 bg-purple-100';
      case 'Advanced': return 'text-orange-600 bg-orange-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Comprehensive AI Trading Bot Strategies
          </CardTitle>
          <CardDescription>
            Explore 30+ advanced AI-powered trading strategies across multiple categories
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Strategy Categories */}
      <Tabs defaultValue="Technical Analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="Technical Analysis">Technical</TabsTrigger>
          <TabsTrigger value="Algorithmic Trading">Algorithmic</TabsTrigger>
          <TabsTrigger value="AI & Machine Learning">AI/ML</TabsTrigger>
          <TabsTrigger value="Advanced Strategies">Advanced</TabsTrigger>
          <TabsTrigger value="Portfolio Management">Portfolio</TabsTrigger>
        </TabsList>

        {Object.entries(strategyCategories).map(([category, strategies]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strategies.map((strategy) => {
                const IconComponent = strategy.icon;
                return (
                  <Card
                    key={strategy.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedStrategy === strategy.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedStrategy(strategy.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${strategy.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1">{strategy.name}</h3>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {strategy.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Complexity</span>
                              <Badge className={`text-xs ${getComplexityColor(strategy.complexity)}`}>
                                {strategy.complexity}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Risk</span>
                              <Badge className={`text-xs ${getRiskColor(strategy.riskLevel)}`}>
                                {strategy.riskLevel}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Expected Return</span>
                              <span className="text-xs font-medium text-green-600">
                                {strategy.expectedReturn}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Timeframe</span>
                              <span className="text-xs font-medium">{strategy.timeframe}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Selected Strategy Details */}
      {selectedStrategyInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${selectedStrategyInfo.color}`}>
                <selectedStrategyInfo.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl">{selectedStrategyInfo.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedStrategyInfo.description}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Strategy Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Complexity Level</div>
                <Badge className={getComplexityColor(selectedStrategyInfo.complexity)}>
                  {selectedStrategyInfo.complexity}
                </Badge>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Risk Level</div>
                <Badge className={getRiskColor(selectedStrategyInfo.riskLevel)}>
                  {selectedStrategyInfo.riskLevel}
                </Badge>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Expected Return</div>
                <div className="text-lg font-bold text-green-600">
                  {selectedStrategyInfo.expectedReturn}
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Timeframe</div>
                <div className="text-lg font-bold">{selectedStrategyInfo.timeframe}</div>
              </div>
            </div>

            {/* Strategy Configuration Preview */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-3">Strategy Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Primary Indicators:</span>
                  <p className="font-medium">RSI, MACD, Moving Averages</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Entry Conditions:</span>
                  <p className="font-medium">Trend confirmation + Volume spike</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Exit Strategy:</span>
                  <p className="font-medium">Stop loss: 2%, Take profit: 5%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Position Sizing:</span>
                  <p className="font-medium">Kelly Criterion + Risk Parity</p>
                </div>
              </div>
            </div>

            {/* Performance Simulation */}
            <div className="space-y-4">
              <h3 className="font-semibold">Backtesting Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                  <div className="text-2xl font-bold text-green-600">68%</div>
                  <Progress value={68} className="mt-2" />
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Sharpe Ratio</div>
                  <div className="text-2xl font-bold text-blue-600">1.42</div>
                  <Progress value={71} className="mt-2" />
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Max Drawdown</div>
                  <div className="text-2xl font-bold text-red-600">-8.5%</div>
                  <Progress value={15} className="mt-2" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1">
                <Bot className="h-4 w-4 mr-2" />
                Deploy Bot with This Strategy
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Run Backtest
              </Button>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Customize Strategy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategy Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Strategies</p>
                <p className="text-2xl font-bold">{allStrategies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">AI/ML Strategies</p>
                <p className="text-2xl font-bold">{strategyCategories['AI & Machine Learning'].length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Low Risk</p>
                <p className="text-2xl font-bold">
                  {allStrategies.filter(s => s.riskLevel === 'Low').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Beginner Friendly</p>
                <p className="text-2xl font-bold">
                  {allStrategies.filter(s => s.complexity === 'Beginner').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensiveAIBotStrategies;
