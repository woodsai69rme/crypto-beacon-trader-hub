
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bot, 
  Play, 
  Pause, 
  Plus, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { comprehensiveAiBotSystem } from '@/services/ai/comprehensiveAiBotSystem';
import { AIBot, AITradingStrategy } from '@/types/trading';

const EnhancedAiBotDashboard: React.FC = () => {
  const [bots, setBots] = useState<AIBot[]>([]);
  const [strategies, setStrategies] = useState<AITradingStrategy[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Bot creation form state
  const [formData, setFormData] = useState({
    name: '',
    strategy: '',
    model: 'deepseek/deepseek-r1',
    riskLevel: 'medium' as 'low' | 'medium' | 'high',
    maxTradeAmount: 1000,
    targetAssets: ['BTC', 'ETH']
  });

  useEffect(() => {
    // Initialize data
    loadBotData();
    
    // Start the bot system
    comprehensiveAiBotSystem.startSystem();
    
    // Set up real-time updates
    const interval = setInterval(loadBotData, 5000);
    
    return () => {
      clearInterval(interval);
      comprehensiveAiBotSystem.stopSystem();
    };
  }, []);

  const loadBotData = () => {
    setBots(comprehensiveAiBotSystem.getAllBots());
    setStrategies(comprehensiveAiBotSystem.getAvailableStrategies());
    setExecutions(comprehensiveAiBotSystem.getRecentExecutions());
  };

  const handleCreateBot = async () => {
    if (!formData.name || !formData.strategy) return;

    const botConfig = {
      id: `bot-${Date.now()}`,
      name: formData.name,
      strategy: formData.strategy,
      model: formData.model,
      riskLevel: formData.riskLevel,
      maxTradeAmount: formData.maxTradeAmount,
      targetAssets: formData.targetAssets,
      parameters: {}
    };

    await comprehensiveAiBotSystem.createBot(botConfig);
    setShowCreateForm(false);
    setFormData({
      name: '',
      strategy: '',
      model: 'deepseek/deepseek-r1',
      riskLevel: 'medium',
      maxTradeAmount: 1000,
      targetAssets: ['BTC', 'ETH']
    });
    loadBotData();
  };

  const toggleBot = async (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;

    if (bot.isActive) {
      await comprehensiveAiBotSystem.stopBot(botId);
    } else {
      await comprehensiveAiBotSystem.startBot(botId);
    }
    loadBotData();
  };

  const activeBots = bots.filter(bot => bot.isActive);
  const totalReturn = bots.reduce((sum, bot) => sum + bot.performance.totalReturn, 0);
  const avgWinRate = bots.length > 0 ? bots.reduce((sum, bot) => sum + bot.performance.winRate, 0) / bots.length : 0;
  const totalTrades = bots.reduce((sum, bot) => sum + bot.performance.totalTrades, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Trading Bots</h2>
          <p className="text-muted-foreground">
            Manage your automated trading strategies
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Bot
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{activeBots.length}</p>
              </div>
              <Bot className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
                </p>
              </div>
              {totalReturn >= 0 ? 
                <TrendingUp className="h-8 w-8 text-green-500" /> : 
                <TrendingDown className="h-8 w-8 text-red-500" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Win Rate</p>
                <p className="text-2xl font-bold">{avgWinRate.toFixed(1)}%</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{totalTrades}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="executions">Executions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Active Bots Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Active Bots Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeBots.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active bots. Create and start a bot to begin automated trading.
                  </div>
                ) : (
                  activeBots.map(bot => (
                    <div key={bot.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <div>
                          <h4 className="font-medium">{bot.name}</h4>
                          <p className="text-sm text-muted-foreground">{bot.strategy}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground">Return</p>
                          <p className={`font-medium ${bot.performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Win Rate</p>
                          <p className="font-medium">{bot.performance.winRate.toFixed(1)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Trades</p>
                          <p className="font-medium">{bot.performance.totalTrades}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Executions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Trade Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {executions.slice(0, 5).map((execution, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={execution.trade.type === 'buy' ? 'default' : 'secondary'}>
                        {execution.trade.type.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium">{execution.trade.coinSymbol}</p>
                        <p className="text-sm text-muted-foreground">
                          {execution.trade.amount.toFixed(4)} @ ${execution.trade.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(execution.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-sm font-medium">
                        ${execution.trade.totalValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                {executions.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No executions yet. Start a bot to see trading activity.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-6">
          {/* Bot Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map(bot => (
              <Card key={bot.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                    <Badge variant={bot.isActive ? 'default' : 'secondary'}>
                      {bot.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{bot.strategy}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Return</p>
                        <p className={`font-medium ${bot.performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Win Rate</p>
                        <p className="font-medium">{bot.performance.winRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trades</p>
                        <p className="font-medium">{bot.performance.totalTrades}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sharpe</p>
                        <p className="font-medium">{bot.performance.sharpeRatio.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className={`w-2 h-2 rounded-full ${bot.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm">
                        {bot.isActive ? 'Running' : 'Stopped'}
                      </span>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2">
                      <Button
                        variant={bot.isActive ? 'destructive' : 'default'}
                        size="sm"
                        className="flex-1"
                        onClick={() => toggleBot(bot.id)}
                      >
                        {bot.isActive ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          {/* Available Strategies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map(strategy => (
              <Card key={strategy.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <Badge variant={
                      strategy.riskLevel === 'low' ? 'secondary' :
                      strategy.riskLevel === 'medium' ? 'default' : 'destructive'
                    }>
                      {strategy.riskLevel} risk
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Timeframe:</span>
                      <span className="font-medium">{strategy.timeframe}h</span>
                    </div>
                    
                    {strategy.backtestResults && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Win Rate:</span>
                          <div className="font-medium text-green-600">
                            {strategy.backtestResults.winRate}%
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Profit Factor:</span>
                          <div className="font-medium">
                            {strategy.backtestResults.profitFactor}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-6">
          {/* Trade Executions */}
          <Card>
            <CardHeader>
              <CardTitle>All Trade Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {executions.map((execution, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant={execution.trade.type === 'buy' ? 'default' : 'secondary'}>
                        {execution.trade.type.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium">{execution.trade.coinSymbol}</p>
                        <p className="text-sm text-muted-foreground">
                          Bot: {bots.find(b => b.id === execution.botId)?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">
                        {execution.trade.amount.toFixed(4)} @ ${execution.trade.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${execution.trade.totalValue.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(execution.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(execution.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {executions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No trade executions yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Bot Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create New AI Bot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Bot Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter bot name"
                />
              </div>

              <div>
                <Label htmlFor="strategy">Strategy</Label>
                <Select value={formData.strategy} onValueChange={(value) => setFormData(prev => ({ ...prev, strategy: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map(strategy => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        {strategy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxTradeAmount">Max Trade Amount (AUD)</Label>
                <Input
                  id="maxTradeAmount"
                  type="number"
                  value={formData.maxTradeAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxTradeAmount: Number(e.target.value) }))}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateBot} className="flex-1">
                  Create Bot
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedAiBotDashboard;
