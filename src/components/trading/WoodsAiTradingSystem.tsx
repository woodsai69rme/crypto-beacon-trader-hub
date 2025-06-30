import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { enhancedAiBotService } from '@/services/ai/enhancedAiBotService';
import { AIBot, BotConfig, AITradingStrategyType, AIModel } from '@/types/trading';
import { Bot, Play, Pause, Settings, Trash2, Plus, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

const WoodsAiTradingSystem: React.FC = () => {
  const [bots, setBots] = useState<AIBot[]>([]);
  const [selectedBot, setSelectedBot] = useState<AIBot | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [systemRunning, setSystemRunning] = useState(false);

  // Create bot form state
  const [newBotName, setNewBotName] = useState('');
  const [newBotDescription, setNewBotDescription] = useState('');
  const [newBotStrategy, setNewBotStrategy] = useState<AITradingStrategyType>('grid');
  const [newBotModel, setNewBotModel] = useState<AIModel>('gpt-4o-mini');
  const [newBotRiskLevel, setNewBotRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [newBotMaxTrade, setNewBotMaxTrade] = useState('1000');
  const [newBotTargetAssets, setNewBotTargetAssets] = useState('BTC,ETH');

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = () => {
    const allBots = enhancedAiBotService.getAllBots();
    setBots(allBots);
  };

  const handleToggleBot = (botId: string) => {
    enhancedAiBotService.toggleBot(botId);
    loadBots();
  };

  const handleDeleteBot = (botId: string) => {
    enhancedAiBotService.deleteBot(botId);
    loadBots();
    if (selectedBot?.id === botId) {
      setSelectedBot(null);
    }
  };

  const handleCreateBot = () => {
    if (!newBotName.trim()) return;

    const config: BotConfig = {
      id: `bot-${Date.now()}`,
      name: newBotName,
      description: newBotDescription,
      strategy: newBotStrategy,
      model: newBotModel,
      riskLevel: newBotRiskLevel,
      maxTradeAmount: parseFloat(newBotMaxTrade) || 1000,
      targetAssets: newBotTargetAssets.split(',').map(asset => asset.trim()),
      parameters: {}
    };

    enhancedAiBotService.createBot(config);
    loadBots();
    
    // Reset form
    setNewBotName('');
    setNewBotDescription('');
    setNewBotStrategy('grid');
    setNewBotModel('gpt-4o-mini');
    setNewBotRiskLevel('medium');
    setNewBotMaxTrade('1000');
    setNewBotTargetAssets('BTC,ETH');
    setShowCreateForm(false);
  };

  const handleStartSystem = () => {
    setSystemRunning(true);
    bots.forEach(bot => {
      if (bot.status === 'paused') {
        enhancedAiBotService.toggleBot(bot.id);
      }
    });
    loadBots();
  };

  const handleStopSystem = () => {
    setSystemRunning(false);
    bots.forEach(bot => {
      if (bot.status === 'active') {
        enhancedAiBotService.toggleBot(bot.id);
      }
    });
    loadBots();
  };

  // ... keep existing code for stats calculation
  const stats = enhancedAiBotService.getBotStats();
  const activeBots = bots.filter(bot => bot.status === 'active');
  const totalPnL = bots.reduce((sum, bot) => sum + (bot.performance.totalReturn * 1000), 0); // Rough calculation

  const BotCard: React.FC<{ bot: AIBot }> = ({ bot }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedBot(bot)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{bot.name}</CardTitle>
        <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
          {bot.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span className="text-xs text-muted-foreground">{bot.model}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleBot(bot.id);
            }}
          >
            {bot.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Strategy:</span>
            <span className="font-medium">{bot.strategy}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Return:</span>
            <span className={bot.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
              {bot.performance.totalReturn.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Win Rate:</span>
            <span>{bot.performance.winRate}%</span>
          </div>
          <Progress value={bot.performance.winRate} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* System Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Woods AI Trading System
            </span>
            <Badge variant={systemRunning ? "default" : "secondary"}>
              {systemRunning ? "System Active" : "System Paused"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={handleStartSystem} 
              disabled={systemRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start All Bots
            </Button>
            <Button 
              onClick={handleStopSystem} 
              disabled={!systemRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              Stop All Bots
            </Button>
            <Button 
              onClick={() => setShowCreateForm(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Bot
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bots</p>
                <p className="text-2xl font-bold">{stats.totalBots}</p>
              </div>
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeBots}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{stats.totalTrades.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Return</p>
                <p className={`text-2xl font-bold ${stats.avgReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.avgReturn.toFixed(1)}%
                </p>
              </div>
              {stats.avgReturn >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bots" className="w-full">
        <TabsList>
          <TabsTrigger value="bots">AI Bots ({bots.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeBots.length})</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-4">
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New AI Trading Bot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <SelectItem value="grid">Grid Trading</SelectItem>
                        <SelectItem value="trend-following">Trend Following</SelectItem>
                        <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                        <SelectItem value="breakout">Breakout</SelectItem>
                        <SelectItem value="scalping">Scalping</SelectItem>
                        <SelectItem value="arbitrage">Arbitrage</SelectItem>
                        <SelectItem value="momentum">Momentum</SelectItem>
                        <SelectItem value="sentiment">Sentiment</SelectItem>
                        <SelectItem value="whale-tracking">Whale Tracking</SelectItem>
                        <SelectItem value="portfolio-balancing">Portfolio Balancing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input
                    value={newBotDescription}
                    onChange={(e) => setNewBotDescription(e.target.value)}
                    placeholder="Describe what this bot does"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">AI Model</label>
                    <Select value={newBotModel} onValueChange={(value) => setNewBotModel(value as AIModel)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                        <SelectItem value="deepseek-r1">DeepSeek R1</SelectItem>
                        <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                        <SelectItem value="local-llama">Local Llama</SelectItem>
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
                    <label className="block text-sm font-medium mb-2">Max Trade Amount</label>
                    <Input
                      type="number"
                      value={newBotMaxTrade}
                      onChange={(e) => setNewBotMaxTrade(e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Assets (comma-separated)</label>
                  <Input
                    value={newBotTargetAssets}
                    onChange={(e) => setNewBotTargetAssets(e.target.value)}
                    placeholder="BTC,ETH,SOL"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleCreateBot}>Create Bot</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeBots.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enhancedAiBotService.getAvailableStrategies().map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <CardTitle className="text-sm">{strategy.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{strategy.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline">{strategy.type}</Badge>
                    <div className="text-xs space-y-1">
                      <div>Timeframe: {strategy.timeframe}</div>
                      {strategy.performance && (
                        <div className="flex justify-between">
                          <span>Win Rate:</span>
                          <span>{strategy.performance.winRate}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enhancedAiBotService.getTopPerformingBots(6).map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedBot && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Bot Details: {selectedBot.name}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleBot(selectedBot.id)}
                >
                  {selectedBot.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteBot(selectedBot.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Configuration</h4>
                  <div className="text-sm space-y-1 mt-2">
                    <div>Strategy: {selectedBot.strategy}</div>
                    <div>Model: {selectedBot.model}</div>
                    <div>Risk Level: {selectedBot.riskLevel}</div>
                    <div>Max Trade: ${selectedBot.maxTradeAmount.toLocaleString()}</div>
                    <div>Target Assets: {selectedBot.targetAssets.join(', ')}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <div className="text-sm space-y-1 mt-2">
                    <div>Total Return: {selectedBot.performance.totalReturn.toFixed(2)}%</div>
                    <div>Win Rate: {selectedBot.performance.winRate}%</div>
                    <div>Total Trades: {selectedBot.performance.trades}</div>
                    <div>Max Drawdown: {selectedBot.performance.maxDrawdown.toFixed(2)}%</div>
                    <div>Sharpe Ratio: {selectedBot.performance.sharpeRatio.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WoodsAiTradingSystem;
