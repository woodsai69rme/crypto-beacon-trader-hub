
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, TrendingUp, Activity, Settings, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { aiTradingBotService, AITradingBot, BotAuditEntry } from '@/services/ai/aiTradingBotService';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from '@/hooks/use-toast';

const ComprehensiveAiTradingDashboard: React.FC = () => {
  const [bots, setBots] = useState<AITradingBot[]>([]);
  const [selectedBot, setSelectedBot] = useState<AITradingBot | null>(null);
  const [auditLog, setAuditLog] = useState<BotAuditEntry[]>([]);
  const [isCreatingBot, setIsCreatingBot] = useState(false);
  const [newBotConfig, setNewBotConfig] = useState({
    name: '',
    strategy: 'trend-following',
    aiModel: 'deepseek/deepseek-r1',
    riskLevel: 'medium' as 'low' | 'medium' | 'high',
    maxTradeAmount: 1000
  });
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    loadBots();
    const interval = setInterval(loadBots, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedBot) {
      const log = aiTradingBotService.getBotAuditLog(selectedBot.id);
      setAuditLog(log);
    }
  }, [selectedBot]);

  const loadBots = () => {
    const allBots = aiTradingBotService.getBots();
    setBots(allBots);
    
    // Update selected bot if it exists
    if (selectedBot) {
      const updatedBot = allBots.find(bot => bot.id === selectedBot.id);
      if (updatedBot) {
        setSelectedBot(updatedBot);
      }
    }
  };

  const handleCreateBot = async () => {
    if (!newBotConfig.name) {
      toast({
        title: "Error",
        description: "Please enter a bot name",
        variant: "destructive"
      });
      return;
    }

    const botId = await aiTradingBotService.createBot({
      name: newBotConfig.name,
      strategy: newBotConfig.strategy,
      aiModel: newBotConfig.aiModel,
      config: {
        riskLevel: newBotConfig.riskLevel,
        maxTradeAmount: newBotConfig.maxTradeAmount,
        targetAssets: ['bitcoin', 'ethereum'],
        stopLoss: 0.05,
        takeProfit: 0.15,
        tradingFrequency: 'medium'
      }
    });

    setNewBotConfig({
      name: '',
      strategy: 'trend-following',
      aiModel: 'deepseek/deepseek-r1',
      riskLevel: 'medium',
      maxTradeAmount: 1000
    });
    setIsCreatingBot(false);
    loadBots();
  };

  const handleToggleBot = async (botId: string, isActive: boolean) => {
    if (isActive) {
      await aiTradingBotService.activateBot(botId);
    } else {
      await aiTradingBotService.deactivateBot(botId);
    }
    loadBots();
  };

  const handleDeleteBot = async (botId: string) => {
    if (confirm('Are you sure you want to delete this bot?')) {
      aiTradingBotService.deleteBotById(botId);
      if (selectedBot?.id === botId) {
        setSelectedBot(null);
      }
      loadBots();
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-500' : 'bg-gray-400';
  };

  const getPerformanceColor = (value: number) => {
    if (value > 5) return 'text-green-600';
    if (value < -5) return 'text-red-600';
    return 'text-yellow-600';
  };

  const activeBots = bots.filter(bot => bot.isActive);
  const totalActiveBalance = activeBots.reduce((sum, bot) => sum + bot.account.balance, 0);
  const totalTrades = bots.reduce((sum, bot) => sum + bot.performance.totalTrades, 0);
  const avgWinRate = bots.length > 0 ? bots.reduce((sum, bot) => sum + bot.performance.winRate, 0) / bots.length : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Active Bots</p>
                <p className="text-2xl font-bold">{activeBots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Total Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(totalActiveBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Total Trades</p>
                <p className="text-2xl font-bold">{totalTrades}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Avg Win Rate</p>
                <p className="text-2xl font-bold">{avgWinRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bots" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bots">AI Trading Bots</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="create">Create Bot</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bots.map((bot) => (
              <Card key={bot.id} className={`cursor-pointer transition-all ${selectedBot?.id === bot.id ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader onClick={() => setSelectedBot(bot)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(bot.isActive)}`} />
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                    </div>
                    <Badge variant={bot.isActive ? "default" : "secondary"}>
                      {bot.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {bot.strategy} • {bot.aiModel}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Balance</p>
                        <p className="font-semibold">{formatCurrency(bot.account.balance)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Return</p>
                        <p className={`font-semibold ${getPerformanceColor(bot.performance.totalReturn)}`}>
                          {bot.performance.totalReturn > 0 ? '+' : ''}{bot.performance.totalReturn.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trades</p>
                        <p className="font-semibold">{bot.performance.totalTrades}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Win Rate</p>
                        <p className="font-semibold">{bot.performance.winRate.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Switch
                        checked={bot.isActive}
                        onCheckedChange={(checked) => handleToggleBot(bot.id, checked)}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedBot(bot)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteBot(bot.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Last Action: {bot.lastAction}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>
                {selectedBot ? `Showing logs for ${selectedBot.name}` : 'Select a bot to view its audit log'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedBot ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {auditLog.map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {entry.result === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {entry.result === 'failed' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {entry.result === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{entry.action}</p>
                          <Badge variant="outline" className="text-xs">
                            {(entry.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{entry.reasoning}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {auditLog.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No audit logs available</p>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Select a bot to view its audit log</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New AI Trading Bot</CardTitle>
              <CardDescription>Configure a new AI-powered trading bot for paper trading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="botName">Bot Name</Label>
                  <Input
                    id="botName"
                    value={newBotConfig.name}
                    onChange={(e) => setNewBotConfig({...newBotConfig, name: e.target.value})}
                    placeholder="Enter bot name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy">Trading Strategy</Label>
                  <Select value={newBotConfig.strategy} onValueChange={(value) => setNewBotConfig({...newBotConfig, strategy: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trend-following">Trend Following</SelectItem>
                      <SelectItem value="momentum">Momentum</SelectItem>
                      <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                      <SelectItem value="breakout">Breakout</SelectItem>
                      <SelectItem value="scalping">Scalping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiModel">AI Model</Label>
                  <Select value={newBotConfig.aiModel} onValueChange={(value) => setNewBotConfig({...newBotConfig, aiModel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deepseek/deepseek-r1">DeepSeek R1 (Free)</SelectItem>
                      <SelectItem value="google/gemini-2.0-flash-exp">Gemini 2.0 Flash (Free)</SelectItem>
                      <SelectItem value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B (Free)</SelectItem>
                      <SelectItem value="openai/gpt-4">GPT-4 (Premium)</SelectItem>
                      <SelectItem value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Premium)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskLevel">Risk Level</Label>
                  <Select value={newBotConfig.riskLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setNewBotConfig({...newBotConfig, riskLevel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="maxTradeAmount">Max Trade Amount (AUD)</Label>
                  <Input
                    id="maxTradeAmount"
                    type="number"
                    value={newBotConfig.maxTradeAmount}
                    onChange={(e) => setNewBotConfig({...newBotConfig, maxTradeAmount: Number(e.target.value)})}
                    placeholder="1000"
                  />
                </div>
              </div>

              <Button onClick={handleCreateBot} className="w-full">
                <Bot className="h-4 w-4 mr-2" />
                Create AI Trading Bot
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveAiTradingDashboard;
