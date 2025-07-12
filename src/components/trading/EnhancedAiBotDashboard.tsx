
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  Bot,
  Activity,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { AIBot } from '@/types/trading';
import { enhancedAiBotService } from '@/services/ai/enhancedAiBotService';
import { toast } from '@/components/ui/use-toast';

export const EnhancedAiBotDashboard: React.FC = () => {
  const [bots, setBots] = useState<AIBot[]>([]);
  const [selectedBot, setSelectedBot] = useState<AIBot | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    try {
      const botList = await enhancedAiBotService.getAllBots();
      setBots(botList);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load AI bots",
        variant: "destructive"
      });
    }
  };

  const handleBotAction = async (botId: string, action: 'start' | 'pause' | 'stop') => {
    setIsLoading(true);
    try {
      switch (action) {
        case 'start':
          await enhancedAiBotService.startBot(botId);
          break;
        case 'pause':
          await enhancedAiBotService.pauseBot(botId);
          break;
        case 'stop':
          await enhancedAiBotService.stopBot(botId);
          break;
      }
      
      await loadBots();
      toast({
        title: "Success",
        description: `Bot ${action}ed successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} bot`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'stopped': return <Square className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">AI Trading Bots</h2>
          <p className="text-muted-foreground">Manage and monitor your AI trading bots</p>
        </div>
        <Button onClick={() => enhancedAiBotService.createBot({
          name: `Bot ${bots.length + 1}`,
          strategy: 'trend-following',
          riskLevel: 'medium',
          maxPositionSize: 1000,
          stopLossPercentage: 5,
          takeProfitPercentage: 10,
          targetSymbols: ['BTC/USD', 'ETH/USD']
        })}>
          <Bot className="mr-2 h-4 w-4" />
          Create New Bot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <Card key={bot.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedBot(bot)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{bot.name}</CardTitle>
                  <CardDescription>{bot.description || 'AI Trading Bot'}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(bot.status)} text-white`}>
                  {getStatusIcon(bot.status)}
                  <span className="ml-1 capitalize">{bot.status}</span>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Balance</p>
                  <p className="font-semibold">${bot.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Return</p>
                  <p className={`font-semibold flex items-center ${
                    bot.performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {bot.performance.totalReturn >= 0 ? 
                      <TrendingUp className="h-3 w-3 mr-1" /> : 
                      <TrendingDown className="h-3 w-3 mr-1" />
                    }
                    {bot.performance.totalReturn.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Win Rate</span>
                  <span>{bot.performance.winRate.toFixed(1)}%</span>
                </div>
                <Progress value={bot.performance.winRate} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBotAction(bot.id, bot.status === 'active' ? 'pause' : 'start');
                  }}
                  disabled={isLoading}
                >
                  {bot.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBotAction(bot.id, 'stop');
                  }}
                  disabled={isLoading}
                >
                  <Square className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBot(bot);
                  }}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedBot && (
        <Card>
          <CardHeader>
            <CardTitle>Bot Details: {selectedBot.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">${selectedBot.balance.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">{selectedBot.performance.totalReturn.toFixed(2)}%</p>
                    <p className="text-sm text-muted-foreground">Total Return</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">{selectedBot.performance.winRate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                  </div>
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">{selectedBot.performance.totalTrades}</p>
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="performance">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-500">
                            {selectedBot.performance.totalReturn.toFixed(2)}%
                          </p>
                          <p className="text-muted-foreground">Total Return</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold">
                            {selectedBot.performance.winRate.toFixed(1)}%
                          </p>
                          <p className="text-muted-foreground">Win Rate</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Bot Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Strategy</p>
                      <p className="text-muted-foreground capitalize">{selectedBot.strategy}</p>
                    </div>
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-muted-foreground capitalize">{selectedBot.status}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedAiBotDashboard;
