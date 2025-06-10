
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, TrendingUp, Brain, Settings, Play, Pause } from 'lucide-react';
import { comprehensiveAiBotSystem } from '@/services/ai/comprehensiveAiBotSystem';
import AiBotCreator from './AiBotCreator';

interface BotPerformance {
  totalReturn: number;
  winRate: number;
  trades: number;
  sharpeRatio: number;
}

const ComprehensiveAiTradingDashboard: React.FC = () => {
  const [activeBots, setActiveBots] = useState<any[]>([]);
  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = () => {
    const bots = comprehensiveAiBotSystem.getBots();
    setActiveBots(bots);
  };

  const toggleBot = async (botId: string) => {
    const bot = comprehensiveAiBotSystem.getBot(botId);
    if (!bot) return;

    if (bot.status === 'active') {
      await comprehensiveAiBotSystem.stopBot(botId);
    } else {
      await comprehensiveAiBotSystem.startBot(botId);
    }
    
    loadBots();
  };

  const mockPerformance: BotPerformance = {
    totalReturn: 15.4,
    winRate: 68,
    trades: 42,
    sharpeRatio: 1.8
  };

  const strategies = comprehensiveAiBotSystem.getAvailableStrategies();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Trading Command Center
          </h2>
          <p className="text-muted-foreground">
            Manage your AI-powered trading strategies
          </p>
        </div>
        <Button onClick={() => setShowCreator(!showCreator)}>
          <Bot className="h-4 w-4 mr-2" />
          Create Bot
        </Button>
      </div>

      {showCreator && (
        <Card>
          <CardContent className="p-6">
            <AiBotCreator />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active-bots">Active Bots</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Return</p>
                    <p className="text-2xl font-bold text-green-600">+{mockPerformance.totalReturn}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold">{mockPerformance.winRate}%</p>
                  </div>
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                    <p className="text-2xl font-bold">{mockPerformance.trades}</p>
                  </div>
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                    <p className="text-2xl font-bold">{mockPerformance.sharpeRatio}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bot Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeBots.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Bots</h3>
                    <p className="text-muted-foreground mb-4">Create your first AI trading bot to get started</p>
                    <Button onClick={() => setShowCreator(true)}>
                      Create Bot
                    </Button>
                  </div>
                ) : (
                  activeBots.map((bot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          bot.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <div>
                          <span className="font-medium">{bot.config.name}</span>
                          <p className="text-sm text-muted-foreground">{bot.config.strategy}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                          {bot.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleBot(bot.config.id)}
                        >
                          {bot.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-bots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Trading Bots</CardTitle>
            </CardHeader>
            <CardContent>
              {activeBots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active bots found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeBots.map((bot, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{bot.config.name}</h3>
                          <p className="text-sm text-muted-foreground">{bot.config.description}</p>
                        </div>
                        <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                          {bot.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Strategy</p>
                          <p className="font-medium">{bot.config.strategy}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Model</p>
                          <p className="font-medium">{bot.config.model.split('/')[1]}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <p className="font-medium capitalize">{bot.config.riskLevel}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max Trade</p>
                          <p className="font-medium">${bot.config.maxTradeAmount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <Brain className="h-8 w-8 mx-auto text-primary" />
                    <div>
                      <h3 className="font-semibold">{strategy.name}</h3>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
            <p className="text-muted-foreground">Detailed performance metrics coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveAiTradingDashboard;
