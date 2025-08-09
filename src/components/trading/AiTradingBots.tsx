
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Plus, Play, Pause, Settings, TrendingUp } from 'lucide-react';
import AiTradingStrategySelector from './AiTradingStrategySelector';
import { AITradingStrategyConfig } from '@/types/trading';

interface AiBot {
  id: string;
  name: string;
  strategy: AITradingStrategyConfig;
  status: 'active' | 'paused' | 'stopped';
  performance: {
    totalReturn: number;
    winRate: number;
    trades: number;
  };
  createdAt: string;
}

const AiTradingBots: React.FC = () => {
  const [bots, setBots] = useState<AiBot[]>([
    {
      id: '1',
      name: 'Bitcoin Trend Bot',
      strategy: {
        id: 'trend-following-1',
        name: 'Trend Following',
        description: 'Follows market momentum',
        type: 'trend-following',
        timeframe: 'medium',
        parameters: {}
      },
      status: 'active',
      performance: {
        totalReturn: 12.5,
        winRate: 68,
        trades: 45
      },
      createdAt: '2024-01-15'
    }
  ]);

  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategyConfig | null>(null);

  const handleCreateBot = () => {
    if (!selectedStrategy) return;

    const newBot: AiBot = {
      id: Date.now().toString(),
      name: `${selectedStrategy.name} Bot`,
      strategy: selectedStrategy,
      status: 'paused',
      performance: {
        totalReturn: 0,
        winRate: 0,
        trades: 0
      },
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBots(prev => [...prev, newBot]);
    setSelectedStrategy(null);
  };

  const toggleBotStatus = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId 
        ? { ...bot, status: bot.status === 'active' ? 'paused' : 'active' as const }
        : bot
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Trading Bots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bots" className="w-full">
            <TabsList>
              <TabsTrigger value="bots">My Bots</TabsTrigger>
              <TabsTrigger value="create">Create Bot</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bots" className="space-y-4">
              {bots.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No AI Bots Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first AI trading bot to automate your trading strategy
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Bot
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {bots.map((bot) => (
                    <Card key={bot.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{bot.name}</h3>
                            <p className="text-muted-foreground">{bot.strategy.description}</p>
                          </div>
                          <Badge className={getStatusColor(bot.status)}>
                            {bot.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {bot.performance.totalReturn > 0 ? '+' : ''}{bot.performance.totalReturn}%
                            </div>
                            <div className="text-xs text-muted-foreground">Total Return</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {bot.performance.winRate}%
                            </div>
                            <div className="text-xs text-muted-foreground">Win Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {bot.performance.trades}
                            </div>
                            <div className="text-xs text-muted-foreground">Trades</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => toggleBotStatus(bot.id)}
                            className="flex items-center gap-2"
                          >
                            {bot.status === 'active' ? (
                              <>
                                <Pause className="h-4 w-4" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                Start
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            View Performance
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New AI Bot</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedStrategy ? (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold">{selectedStrategy.name}</h3>
                        <p className="text-muted-foreground">{selectedStrategy.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateBot}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Bot
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedStrategy(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Select a strategy from the Strategies tab to create a new bot.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="strategies">
              <AiTradingStrategySelector 
                strategies={[]}
                onSelectStrategy={setSelectedStrategy}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiTradingBots;
