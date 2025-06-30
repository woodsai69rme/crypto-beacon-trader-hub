
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Settings, TrendingUp, TrendingDown } from 'lucide-react';
import { enhancedAiBotService } from '@/services/ai/enhancedAiBotService';
import { AIBot } from '@/types/trading';

export function EnhancedAiBotDashboard() {
  const [bots, setBots] = useState<AIBot[]>([]);
  const [topBots, setTopBots] = useState<AIBot[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBots(enhancedAiBotService.getAllBots());
    setTopBots(enhancedAiBotService.getTopPerformingBots(5));
    setStrategies(enhancedAiBotService.getAvailableStrategies());
  };

  const handleToggleBot = (botId: string) => {
    enhancedAiBotService.toggleBot(botId);
    loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getReturnColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">AI Trading Bots</h2>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Configure Bots
        </Button>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.length}</div>
            <p className="text-xs text-muted-foreground">
              {bots.filter(b => b.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {enhancedAiBotService.getPerformanceStats().totalReturn.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedAiBotService.getPerformanceStats().avgWinRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedAiBotService.getPerformanceStats().totalTrades}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Bots */}
      <Card>
        <CardHeader>
          <CardTitle>Active Trading Bots</CardTitle>
          <CardDescription>
            Monitor and control your AI trading bots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bots.map((bot) => (
              <div key={bot.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(bot.status)}`} />
                  <div>
                    <h3 className="font-semibold">{bot.name}</h3>
                    <p className="text-sm text-muted-foreground">{bot.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{bot.strategy}</Badge>
                      <Badge variant="outline">{bot.model}</Badge>
                      <Badge variant="outline">{bot.riskLevel}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`font-semibold ${getReturnColor(bot.performance.totalReturn)}`}>
                      {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bot.performance.trades} trades
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleBot(bot.id)}
                  >
                    {bot.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Bots</CardTitle>
          <CardDescription>
            Best performing bots by total return
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topBots.map((bot, index) => (
              <div key={bot.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{bot.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {bot.strategy} • {bot.performance.trades} trades
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-bold ${getReturnColor(bot.performance.totalReturn)}`}>
                  {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
