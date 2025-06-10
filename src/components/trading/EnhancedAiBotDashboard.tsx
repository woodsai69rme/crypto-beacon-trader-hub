
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Play, Pause, Square, TrendingUp, DollarSign, Activity, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EnhancedAiBotDashboard: React.FC = () => {
  const [bots] = useState([
    {
      id: '1',
      name: 'Trend Follower Pro',
      strategy: 'trend-following',
      status: 'active',
      model: 'DeepSeek R1',
      portfolio: 25000,
      dailyPnL: 845.32,
      totalPnL: 12450.67,
      winRate: 68.5,
      trades: 89,
      lastAction: 'BUY BTC at $58,350',
      timeActive: '12h 34m'
    },
    {
      id: '2',
      name: 'Mean Reversion Master',
      strategy: 'mean-reversion',
      status: 'active',
      model: 'GPT-4',
      portfolio: 15000,
      dailyPnL: -234.56,
      totalPnL: 8901.23,
      winRate: 72.1,
      trades: 156,
      lastAction: 'SELL ETH at $3,105',
      timeActive: '8h 12m'
    },
    {
      id: '3',
      name: 'Scalping Bot Alpha',
      strategy: 'scalping',
      status: 'paused',
      model: 'Claude 3',
      portfolio: 8000,
      dailyPnL: 0,
      totalPnL: 2345.89,
      winRate: 58.7,
      trades: 423,
      lastAction: 'Paused by user',
      timeActive: '0m'
    }
  ]);

  const performanceData = [
    { time: '00:00', portfolio: 48000, benchmark: 48000 },
    { time: '04:00', portfolio: 48500, benchmark: 48200 },
    { time: '08:00', portfolio: 47800, benchmark: 47900 },
    { time: '12:00', portfolio: 49200, benchmark: 48600 },
    { time: '16:00', portfolio: 50100, benchmark: 49000 },
    { time: '20:00', portfolio: 50296, benchmark: 49200 },
    { time: '24:00', portfolio: 50296, benchmark: 49200 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTotalStats = () => {
    const activeBots = bots.filter(bot => bot.status === 'active').length;
    const totalPortfolio = bots.reduce((sum, bot) => sum + bot.portfolio, 0);
    const totalPnL = bots.reduce((sum, bot) => sum + bot.totalPnL, 0);
    const avgWinRate = bots.reduce((sum, bot) => sum + bot.winRate, 0) / bots.length;

    return { activeBots, totalPortfolio, totalPnL, avgWinRate };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Bot Dashboard</h2>
          <p className="text-muted-foreground">Monitor and manage your AI trading bots</p>
        </div>
        <Button>
          <Bot className="h-4 w-4 mr-2" />
          Create New Bot
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{stats.activeBots}</p>
              </div>
              <Bot className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">${stats.totalPortfolio.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${stats.totalPnL.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Win Rate</p>
                <p className="text-2xl font-bold">{stats.avgWinRate.toFixed(1)}%</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bots" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bots">Active Bots</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-4">
          {bots.map(bot => (
            <Card key={bot.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(bot.status)}`} />
                    <div>
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {bot.strategy} • {bot.model} • Active for {bot.timeActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                      {bot.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Portfolio Value</div>
                    <div className="text-lg font-bold">${bot.portfolio.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Daily P&L</div>
                    <div className={`text-lg font-bold ${bot.dailyPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${bot.dailyPnL >= 0 ? '+' : ''}{bot.dailyPnL.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total P&L</div>
                    <div className={`text-lg font-bold ${bot.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${bot.totalPnL >= 0 ? '+' : ''}{bot.totalPnL.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                    <div className="text-lg font-bold">{bot.winRate}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Last Action</div>
                    <div className="font-medium">{bot.lastAction}</div>
                  </div>
                  <div className="flex gap-2">
                    {bot.status === 'active' ? (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Square className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Combined Performance (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" strokeWidth={2} name="AI Bots" />
                  <Line type="monotone" dataKey="benchmark" stroke="#6b7280" strokeWidth={2} name="Benchmark" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '14:23', bot: 'Trend Follower Pro', action: 'BUY 0.5 BTC at $58,350', result: '+$245' },
                  { time: '14:18', bot: 'Mean Reversion Master', action: 'SELL 2 ETH at $3,105', result: '-$120' },
                  { time: '14:15', bot: 'Scalping Bot Alpha', action: 'PAUSED by user', result: '' },
                  { time: '14:10', bot: 'Trend Follower Pro', action: 'SELL 1 SOL at $95.20', result: '+$89' },
                  { time: '14:05', bot: 'Mean Reversion Master', action: 'BUY 5 ADA at $0.45', result: '+$23' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">{log.time}</div>
                      <div>
                        <div className="font-medium">{log.bot}</div>
                        <div className="text-sm text-muted-foreground">{log.action}</div>
                      </div>
                    </div>
                    {log.result && (
                      <div className={`font-bold ${log.result.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {log.result}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAiBotDashboard;
