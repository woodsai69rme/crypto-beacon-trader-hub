
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Bot, Play, Pause, Settings, TrendingUp, AlertTriangle } from 'lucide-react';
import { AiBotTradingProps } from '@/types/trading';

interface ExtendedAiBotTradingProps extends Omit<AiBotTradingProps, 'strategyId'> {
  strategyId?: string;
}

const AiTradingBotDetail: React.FC<ExtendedAiBotTradingProps> = ({ 
  botId, 
  strategyId, 
  strategyName 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [performance, setPerformance] = useState({
    totalTrades: 45,
    winRate: 68.9,
    totalReturn: 12.5,
    sharpeRatio: 1.82,
    maxDrawdown: -8.3
  });

  const [recentTrades] = useState([
    { id: '1', asset: 'BTC', type: 'buy', amount: 0.1, price: 58000, profit: 580, timestamp: '2024-01-15T10:30:00Z' },
    { id: '2', asset: 'ETH', type: 'sell', amount: 2.5, price: 2900, profit: -145, timestamp: '2024-01-15T09:15:00Z' },
    { id: '3', asset: 'SOL', type: 'buy', amount: 10, price: 145, profit: 290, timestamp: '2024-01-14T16:45:00Z' }
  ]);

  const toggleBot = () => {
    setIsActive(!isActive);
  };

  const configureBot = () => {
    console.log('Opening bot configuration...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Trading Bot #{botId}</h2>
            <p className="text-muted-foreground">{strategyName || 'Custom Strategy'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Stopped'}
          </Badge>
          <Button onClick={toggleBot} className="gap-2">
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isActive ? 'Stop' : 'Start'} Bot
          </Button>
          <Button variant="outline" onClick={configureBot} className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{performance.totalTrades}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold text-green-600">{performance.winRate}%</p>
              </div>
              <div className="w-12 h-12 relative">
                <Progress value={performance.winRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold text-green-600">+{performance.totalReturn}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">{performance.sharpeRatio}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-600">{performance.maxDrawdown}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Latest trades executed by this bot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                        {trade.type.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium">{trade.asset}</p>
                        <p className="text-sm text-muted-foreground">
                          {trade.amount} @ ${trade.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${trade.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trade.profit > 0 ? '+' : ''}${trade.profit}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(trade.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and charts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Performance charts coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
              <CardDescription>Adjust bot parameters and risk settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Configuration panel coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Bot Logs</CardTitle>
              <CardDescription>Detailed execution logs and decision history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Logs panel coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiTradingBotDetail;
