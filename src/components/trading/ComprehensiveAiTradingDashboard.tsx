
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAiTrading } from '@/contexts/AiTradingContext';
import { Bot, Activity, TrendingUp, Settings, Eye } from 'lucide-react';
import AiBotCreator from './AiBotCreator';
import AiBotPerformance from './AiBotPerformance';
import AiBotAuditLog from './AiBotAuditLog';
import AutomatedTradingSignals from './AutomatedTradingSignals';

const ComprehensiveAiTradingDashboard: React.FC = () => {
  const { bots, activateBot, deactivateBot, deleteBot, isAnyBotActive } = useAiTrading();
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  const activeBots = bots.filter(bot => bot.isActive);
  const selectedBot = selectedBotId ? bots.find(bot => bot.id === selectedBotId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Trading Dashboard</h1>
          <p className="text-muted-foreground">Manage your AI-powered trading bots</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isAnyBotActive ? "default" : "secondary"}>
            {activeBots.length} Active Bot{activeBots.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bots">My Bots</TabsTrigger>
          <TabsTrigger value="create">Create Bot</TabsTrigger>
          <TabsTrigger value="signals">Live Signals</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bots.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeBots.length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bots.reduce((sum, bot) => sum + bot.performance.totalTrades, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all bots
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Win Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bots.length > 0 
                    ? (bots.reduce((sum, bot) => sum + bot.performance.winRate, 0) / bots.length * 100).toFixed(1)
                    : '0'
                  }%
                </div>
                <p className="text-xs text-muted-foreground">
                  Average across all bots
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Bots</CardTitle>
              </CardHeader>
              <CardContent>
                {activeBots.length === 0 ? (
                  <p className="text-muted-foreground">No active bots. Create and activate a bot to start automated trading.</p>
                ) : (
                  <div className="space-y-4">
                    {activeBots.map(bot => (
                      <div key={bot.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{bot.name}</h3>
                          <p className="text-sm text-muted-foreground">{bot.strategy} • {bot.model}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Active</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBotId(bot.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <AutomatedTradingSignals />
          </div>
        </TabsContent>

        <TabsContent value="bots" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {bots.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Bots Created</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first AI trading bot to start automated trading
                  </p>
                  <Button onClick={() => setSelectedBotId(null)}>
                    Create Your First Bot
                  </Button>
                </CardContent>
              </Card>
            ) : (
              bots.map(bot => (
                <Card key={bot.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {bot.name}
                          <Badge variant={bot.isActive ? "default" : "secondary"}>
                            {bot.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {bot.strategy} • {bot.model} • Risk: {bot.riskLevel}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBotId(bot.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={bot.isActive ? "destructive" : "default"}
                          size="sm"
                          onClick={() => bot.isActive ? deactivateBot(bot.id) : activateBot(bot.id)}
                        >
                          {bot.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Trades</p>
                        <p className="text-lg font-semibold">{bot.performance.totalTrades}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="text-lg font-semibold">{(bot.performance.winRate * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Return</p>
                        <p className="text-lg font-semibold">{(bot.performance.totalReturn * 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sharpe</p>
                        <p className="text-lg font-semibold">{bot.performance.sharpeRatio.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <AiBotCreator />
        </TabsContent>

        <TabsContent value="signals">
          <AutomatedTradingSignals />
        </TabsContent>

        <TabsContent value="audit">
          <AiBotAuditLog botId={selectedBotId} />
        </TabsContent>
      </Tabs>

      {selectedBot && (
        <div className="mt-8">
          <AiBotPerformance bot={selectedBot} />
        </div>
      )}
    </div>
  );
};

export default ComprehensiveAiTradingDashboard;
