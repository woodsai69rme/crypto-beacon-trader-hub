
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { enhancedAiBotService } from '@/services/ai/enhancedAiBotService';
import { AIBot, AITradingStrategy } from '@/types/trading';
import { Bot, Play, Pause, Settings, TrendingUp, DollarSign, Activity } from 'lucide-react';

const EnhancedAiBotDashboard: React.FC = () => {
  const [selectedBot, setSelectedBot] = useState<AIBot | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const allBots = enhancedAiBotService.getAllBots();
  const activeBots = enhancedAiBotService.getActiveBots();
  const topPerformers = enhancedAiBotService.getTopPerformingBots(5);
  const availableStrategies = enhancedAiBotService.getAvailableStrategies();

  const toggleBot = (botId: string) => {
    enhancedAiBotService.toggleBot(botId);
    // Re-fetch data or trigger re-render
  };

  const BotCard: React.FC<{ bot: AIBot }> = ({ bot }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedBot(bot)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{bot.name}</CardTitle>
        <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
          {bot.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span className="text-xs text-muted-foreground">{bot.model}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              toggleBot(bot.id);
            }}
          >
            {bot.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
        </div>
        <div className="mt-4 space-y-2">
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

  const StrategyCard: React.FC<{ strategy: AITradingStrategy }> = ({ strategy }) => (
    <Card className="h-full">
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
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allBots.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeBots.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(allBots.reduce((sum, bot) => sum + bot.performance.totalReturn, 0) / allBots.length).toFixed(2)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allBots.reduce((sum, bot) => sum + bot.performance.trades, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Bots</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="performance">Top Performers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBots.slice(0, 6).map((bot) => (
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
            {availableStrategies.slice(0, 9).map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPerformers.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedBot && (
        <Card>
          <CardHeader>
            <CardTitle>Bot Details: {selectedBot.name}</CardTitle>
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

export default EnhancedAiBotDashboard;
