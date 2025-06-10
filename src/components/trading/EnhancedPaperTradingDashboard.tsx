
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Bot, Play, Pause, Settings } from 'lucide-react';
import { comprehensiveAiBotSystem } from '@/services/ai/comprehensiveAiBotSystem';

const EnhancedPaperTradingDashboard: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState(50000);
  const [totalPnL, setTotalPnL] = useState(2500);
  const [activeBots, setActiveBots] = useState(0);
  const [totalTrades, setTotalTrades] = useState(156);
  const [winRate, setWinRate] = useState(68.5);
  const [systemRunning, setSystemRunning] = useState(false);

  // Mock performance data
  const performanceData = [
    { date: '2024-01', value: 47500 },
    { date: '2024-02', value: 48200 },
    { date: '2024-03', value: 49800 },
    { date: '2024-04', value: 48900 },
    { date: '2024-05', value: 51200 },
    { date: '2024-06', value: 50000 },
  ];

  const tradeData = [
    { month: 'Jan', wins: 12, losses: 5 },
    { month: 'Feb', wins: 15, losses: 8 },
    { month: 'Mar', wins: 18, losses: 6 },
    { month: 'Apr', wins: 14, losses: 9 },
    { month: 'May', wins: 20, losses: 7 },
    { month: 'Jun', wins: 16, losses: 4 },
  ];

  const recentTrades = [
    { id: 1, symbol: 'BTC/AUD', side: 'BUY', amount: 0.5, price: 65000, pnl: 850, time: '10:23 AM' },
    { id: 2, symbol: 'ETH/AUD', side: 'SELL', amount: 2.3, price: 4200, pnl: -120, time: '09:45 AM' },
    { id: 3, symbol: 'SOL/AUD', side: 'BUY', amount: 15, price: 180, pnl: 340, time: '09:12 AM' },
    { id: 4, symbol: 'ADA/AUD', side: 'SELL', amount: 500, price: 0.85, pnl: 75, time: '08:58 AM' },
  ];

  const handleStartSystem = async () => {
    setSystemRunning(true);
    // Start all active bots
    const bots = comprehensiveAiBotSystem.getBots();
    for (const bot of bots) {
      if (bot.status === 'paused') {
        await comprehensiveAiBotSystem.startBot(bot.config.id);
      }
    }
    setActiveBots(bots.filter(bot => bot.status === 'active').length);
  };

  const handleStopSystem = async () => {
    setSystemRunning(false);
    // Stop all active bots
    const bots = comprehensiveAiBotSystem.getBots();
    for (const bot of bots) {
      if (bot.status === 'active') {
        await comprehensiveAiBotSystem.stopBot(bot.config.id);
      }
    }
    setActiveBots(0);
  };

  useEffect(() => {
    const updateStats = () => {
      const bots = comprehensiveAiBotSystem.getBots();
      setActiveBots(bots.filter(bot => bot.status === 'active').length);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const createQuickBot = async () => {
    const botConfig = {
      id: `bot_${Date.now()}`,
      name: `Quick Bot ${Date.now()}`,
      description: 'Quick trading bot for immediate deployment',
      strategy: 'trend-following',
      model: 'gpt-4o-mini',
      riskLevel: 'medium' as const,
      maxTradeAmount: 1000,
      targetAssets: ['BTC', 'ETH'],
      parameters: {}
    };
    
    const botInstance = await comprehensiveAiBotSystem.createBot(botConfig);
    await comprehensiveAiBotSystem.startBot(botConfig.id);
    setActiveBots(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* System Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Trading System Control
            </span>
            <Badge variant={systemRunning ? "default" : "secondary"}>
              {systemRunning ? "Running" : "Stopped"}
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
              Start System
            </Button>
            <Button 
              onClick={handleStopSystem} 
              disabled={!systemRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              Stop System
            </Button>
            <Button 
              onClick={createQuickBot}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Bot className="h-4 w-4" />
              Quick Deploy Bot
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">${portfolioValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}
                </p>
              </div>
              {totalPnL >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{activeBots}</p>
              </div>
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{winRate}%</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="bots">Bot Status</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tradeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="wins" fill="#10b981" />
                  <Bar dataKey="losses" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant={trade.side === 'BUY' ? 'default' : 'secondary'}>
                        {trade.side}
                      </Badge>
                      <span className="font-medium">{trade.symbol}</span>
                      <span className="text-sm text-muted-foreground">
                        {trade.amount} @ ${trade.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                      </span>
                      <div className="text-xs text-muted-foreground">{trade.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Bot Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comprehensiveAiBotSystem.getBots().map((bot) => (
                  <div key={bot.config.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h3 className="font-semibold">{bot.config.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Strategy: {bot.config.strategy} | Model: {bot.config.model}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                        {bot.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        Win Rate: {bot.performance.winRate}%
                      </div>
                    </div>
                  </div>
                ))}
                
                {comprehensiveAiBotSystem.getBots().length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Bots Deployed</h3>
                    <p className="text-muted-foreground mb-4">Create your first AI trading bot to get started</p>
                    <Button onClick={createQuickBot}>
                      <Bot className="h-4 w-4 mr-2" />
                      Create Quick Bot
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedPaperTradingDashboard;
