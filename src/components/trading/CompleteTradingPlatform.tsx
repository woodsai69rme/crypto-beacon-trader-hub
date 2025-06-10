
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, TrendingUp, Users, Trophy, BarChart3, ShoppingCart, Target } from 'lucide-react';

// Import all the components we've created
import EnhancedPaperTradingDashboard from './EnhancedPaperTradingDashboard';
import BacktestingEngine from './BacktestingEngine';
import TradingCompetitions from './TradingCompetitions';
import StrategyMarketplace from './StrategyMarketplace';
import SocialTradingHub from './SocialTradingHub';
import AdvancedPortfolioAnalytics from './AdvancedPortfolioAnalytics';
import AiBotCreator from './AiBotCreator';
import EnhancedAiBotDashboard from './EnhancedAiBotDashboard';

const CompleteTradingPlatform: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState('dashboard');

  const features = [
    { id: 'dashboard', name: 'Trading Dashboard', icon: BarChart3, description: 'Main trading interface with AI bots' },
    { id: 'bots', name: 'AI Bot Management', icon: Bot, description: 'Create and manage AI trading bots' },
    { id: 'backtest', name: 'Backtesting', icon: TrendingUp, description: 'Test strategies with historical data' },
    { id: 'social', name: 'Social Trading', icon: Users, description: 'Follow and copy successful traders' },
    { id: 'competitions', name: 'Competitions', icon: Trophy, description: 'Compete in trading challenges' },
    { id: 'marketplace', name: 'Strategy Store', icon: ShoppingCart, description: 'Buy and sell trading strategies' },
    { id: 'analytics', name: 'Portfolio Analytics', icon: Target, description: 'Advanced performance analysis' }
  ];

  const platformStats = {
    totalUsers: 125000,
    activeBots: 8500,
    totalTrades: 2500000,
    totalVolume: 125000000,
    competitions: 45,
    strategies: 1200
  };

  return (
    <div className="space-y-6">
      {/* Platform Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Complete Crypto Trading Platform
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Advanced AI-powered trading platform with paper trading, bot management, social features, and comprehensive analytics
        </p>
        
        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{platformStats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{platformStats.activeBots.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">AI Bots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{platformStats.totalTrades.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Trades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">${(platformStats.totalVolume / 1000000).toFixed(0)}M</div>
            <div className="text-sm text-muted-foreground">Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{platformStats.competitions}</div>
            <div className="text-sm text-muted-foreground">Competitions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{platformStats.strategies.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Strategies</div>
          </div>
        </div>
      </div>

      {/* Feature Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(feature => {
              const Icon = feature.icon;
              return (
                <Button
                  key={feature.id}
                  variant={activeFeature === feature.id ? "default" : "outline"}
                  className="h-auto p-4 flex-col gap-2 text-left"
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <Icon className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">{feature.name}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Feature Content */}
      <div className="space-y-6">
        {activeFeature === 'dashboard' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Trading Dashboard</h2>
              <Badge variant="default">Active</Badge>
            </div>
            <EnhancedPaperTradingDashboard />
          </div>
        )}

        {activeFeature === 'bots' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5" />
              <h2 className="text-2xl font-bold">AI Bot Management</h2>
              <Badge variant="default">12 Strategies Available</Badge>
            </div>
            <Tabs defaultValue="dashboard">
              <TabsList>
                <TabsTrigger value="dashboard">Bot Dashboard</TabsTrigger>
                <TabsTrigger value="creator">Create New Bot</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <EnhancedAiBotDashboard />
              </TabsContent>
              <TabsContent value="creator">
                <AiBotCreator />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeFeature === 'backtest' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Strategy Backtesting</h2>
              <Badge variant="secondary">Historical Analysis</Badge>
            </div>
            <BacktestingEngine />
          </div>
        )}

        {activeFeature === 'social' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Social Trading Hub</h2>
              <Badge variant="secondary">Community Driven</Badge>
            </div>
            <SocialTradingHub />
          </div>
        )}

        {activeFeature === 'competitions' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Trading Competitions</h2>
              <Badge variant="default">3 Active</Badge>
            </div>
            <TradingCompetitions />
          </div>
        )}

        {activeFeature === 'marketplace' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Strategy Marketplace</h2>
              <Badge variant="secondary">1,200+ Strategies</Badge>
            </div>
            <StrategyMarketplace />
          </div>
        )}

        {activeFeature === 'analytics' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Portfolio Analytics</h2>
              <Badge variant="secondary">Advanced Metrics</Badge>
            </div>
            <AdvancedPortfolioAnalytics />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompleteTradingPlatform;
