
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AIBot, AITradingStrategyType, AIModel } from '@/types/trading';
import { comprehensiveAiBotSystem } from '@/services/ai/comprehensiveAiBotSystem';
import { enhancedAiBotService } from '@/services/ai/enhancedAiBotService';
import { Play, Pause, Square, TrendingUp, TrendingDown, Activity, Settings, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const WoodsAiTradingSystem: React.FC = () => {
  const [bots, setBots] = useState<AIBot[]>([]);
  const [systemStats, setSystemStats] = useState<any>({});
  const [isSystemRunning, setIsSystemRunning] = useState(false);
  const [selectedBot, setSelectedBot] = useState<AIBot | null>(null);
  const [showCreateBot, setShowCreateBot] = useState(false);

  // New bot form state
  const [newBotName, setNewBotName] = useState('');
  const [newBotStrategy, setNewBotStrategy] = useState<AITradingStrategyType>('grid');
  const [newBotModel, setNewBotModel] = useState<AIModel>('deepseek-r1');
  const [newBotRiskLevel, setNewBotRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [newBotMaxAmount, setNewBotMaxAmount] = useState('1000');
  const [newBotAssets, setNewBotAssets] = useState('BTC,ETH');

  useEffect(() => {
    loadBots();
    loadSystemStats();
    
    // Update stats every 10 seconds
    const interval = setInterval(() => {
      loadSystemStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadBots = () => {
    const allBots = enhancedAiBotService.getAllBots();
    setBots(allBots);
  };

  const loadSystemStats = () => {
    const stats = comprehensiveAiBotSystem.getSystemStats();
    setSystemStats(stats);
    setIsSystemRunning(stats.systemRunning);
  };

  const handleStartSystem = async () => {
    await comprehensiveAiBotSystem.startSystem();
    setIsSystemRunning(true);
    loadSystemStats();
  };

  const handleStopSystem = async () => {
    await comprehensiveAiBotSystem.stopSystem();
    setIsSystemRunning(false);
    loadSystemStats();
  };

  const handleStartBot = async (botId: string) => {
    await comprehensiveAiBotSystem.startBot(botId);
    enhancedAiBotService.startBot(botId);
    loadBots();
  };

  const handleStopBot = async (botId: string) => {
    await comprehensiveAiBotSystem.stopBot(botId);
    enhancedAiBotService.stopBot(botId);
    loadBots();
  };

  const handleDeleteBot = async (botId: string) => {
    await comprehensiveAiBotSystem.deleteBot(botId);
    enhancedAiBotService.deleteBot(botId);
    loadBots();
    if (selectedBot?.id === botId) {
      setSelectedBot(null);
    }
  };

  const handleCreateBot = async () => {
    if (!newBotName.trim()) return;

    const botConfig = {
      id: uuidv4(),
      name: newBotName,
      description: `AI-powered ${newBotStrategy} trading bot`,
      strategy: newBotStrategy,
      model: newBotModel,
      riskLevel: newBotRiskLevel,
      maxTradeAmount: parseFloat(newBotMaxAmount) || 1000,
      targetAssets: newBotAssets.split(',').map(asset => asset.trim()),
      parameters: {}
    };

    const newBot = enhancedAiBotService.createBot(botConfig);
    await comprehensiveAiBotSystem.createBot(botConfig);
    
    // Reset form
    setNewBotName('');
    setNewBotStrategy('grid');
    setNewBotModel('deepseek-r1');
    setNewBotRiskLevel('medium');
    setNewBotMaxAmount('1000');
    setNewBotAssets('BTC,ETH');
    setShowCreateBot(false);
    
    loadBots();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getStrategyIcon = (strategy: AITradingStrategyType) => {
    switch (strategy) {
      case 'trend-following': return <TrendingUp className="h-4 w-4" />;
      case 'mean-reversion': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Control Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Woods AI Trading System</h2>
          <p className="text-muted-foreground">Professional-grade AI trading automation</p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={isSystemRunning ? handleStopSystem : handleStartSystem}
            variant={isSystemRunning ? "destructive" : "default"}
            size="lg"
          >
            {isSystemRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isSystemRunning ? 'Stop System' : 'Start System'}
          </Button>
          <Button onClick={() => setShowCreateBot(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Bot
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bots</p>
                <p className="text-2xl font-bold">{systemStats.totalBots || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.activeBots || 0}</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Return</p>
                <p className="text-2xl font-bold text-green-600">
                  {systemStats.avgReturn ? `+${systemStats.avgReturn.toFixed(1)}%` : '0%'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">
                  {systemStats.avgWinRate ? `${systemStats.avgWinRate.toFixed(1)}%` : '0%'}
                </p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="bots" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bots">AI Bots</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-6">
          {/* Bot List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <Card key={bot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{bot.description}</p>
                    </div>
                    <Badge variant={getStatusColor(bot.status)}>
                      {bot.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStrategyIcon(bot.strategy)}
                    <span className="text-sm font-medium">{bot.strategy}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Return</p>
                      <p className="font-semibold text-green-600">
                        +{bot.performance.totalReturn.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold">{bot.performance.winRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trades</p>
                      <p className="font-semibold">{bot.performance.trades}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risk</p>
                      <p className="font-semibold capitalize">{bot.riskLevel}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {bot.status === 'active' ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStopBot(bot.id)}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => handleStartBot(bot.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedBot(bot)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Config
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteBot(bot.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    +{systemStats.avgReturn?.toFixed(1) || 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Average Return</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {systemStats.totalTrades || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Trades</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {systemStats.avgWinRate?.toFixed(1) || 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced system settings and configuration options will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Bot Modal */}
      {showCreateBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create New AI Bot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bot Name</label>
                <Input
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  placeholder="Enter bot name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Strategy</label>
                <Select value={newBotStrategy} onValueChange={(value) => setNewBotStrategy(value as AITradingStrategyType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {comprehensiveAiBotSystem.getAvailableStrategies().map(strategy => (
                      <SelectItem key={strategy} value={strategy}>
                        {strategy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">AI Model</label>
                <Select value={newBotModel} onValueChange={(value) => setNewBotModel(value as AIModel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek-r1">DeepSeek R1</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                    <SelectItem value="local-llama">Local LLaMA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Risk Level</label>
                <Select value={newBotRiskLevel} onValueChange={(value) => setNewBotRiskLevel(value as 'low' | 'medium' | 'high')}>
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

              <div>
                <label className="block text-sm font-medium mb-2">Max Trade Amount (AUD)</label>
                <Input
                  type="number"
                  value={newBotMaxAmount}
                  onChange={(e) => setNewBotMaxAmount(e.target.value)}
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Assets (comma-separated)</label>
                <Input
                  value={newBotAssets}
                  onChange={(e) => setNewBotAssets(e.target.value)}
                  placeholder="BTC,ETH,SOL"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateBot} className="flex-1">
                  Create Bot
                </Button>
                <Button variant="outline" onClick={() => setShowCreateBot(false)} className="flex-1">
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

export default WoodsAiTradingSystem;
