
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Play, 
  Pause, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign,
  Settings,
  RefreshCw,
  Zap
} from 'lucide-react';
import { realTimeTradingService } from '@/services/ai/realTimeTradingService';
import { AIBot, CoinOption } from '@/types/trading';

const ComprehensiveAiTradingDashboard: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [activeBots, setActiveBots] = useState<AIBot[]>([]);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [algorandData, setAlgorandData] = useState<any>(null);

  useEffect(() => {
    // Start real-time trading service
    const startService = async () => {
      try {
        await realTimeTradingService.startRealTimeTracking();
        setIsConnected(true);
        
        // Subscribe to real-time updates
        const unsubscribe = realTimeTradingService.subscribe((data) => {
          setRealTimeData(data);
          setRecentTrades(data.executions);
        });

        // Load Algorand data
        const algoData = await realTimeTradingService.getAlgorandData();
        setAlgorandData(algoData);

        return unsubscribe;
      } catch (error) {
        console.error('Failed to start trading service:', error);
      }
    };

    startService();

    return () => {
      realTimeTradingService.stopRealTimeTracking();
    };
  }, []);

  const mockActiveBots: AIBot[] = [
    {
      id: 'bot-1',
      name: 'BTC Trend Master',
      strategy: 'trend-following',
      status: 'active',
      isActive: true,
      model: 'deepseek/deepseek-r1',
      createdAt: new Date().toISOString(),
      riskLevel: 'medium',
      maxTradeAmount: 1000,
      targetAssets: ['BTC'],
      performance: {
        totalReturn: 15.4,
        winRate: 68,
        trades: 42,
        totalTrades: 42,
        maxDrawdown: 8.5,
        sharpeRatio: 1.2
      },
      auditLog: []
    },
    {
      id: 'bot-2',
      name: 'ALGO Arbitrage Pro',
      strategy: 'arbitrage',
      status: 'active',
      isActive: true,
      model: 'google/gemini-2.0-flash-exp',
      createdAt: new Date().toISOString(),
      riskLevel: 'low',
      maxTradeAmount: 500,
      targetAssets: ['ALGO'],
      performance: {
        totalReturn: 8.7,
        winRate: 82,
        trades: 156,
        totalTrades: 156,
        maxDrawdown: 3.2,
        sharpeRatio: 2.1
      },
      auditLog: []
    },
    {
      id: 'bot-3',
      name: 'ETH Mean Reversion',
      strategy: 'mean-reversion',
      status: 'paused',
      isActive: false,
      model: 'anthropic/claude-3-haiku',
      createdAt: new Date().toISOString(),
      riskLevel: 'high',
      maxTradeAmount: 2000,
      targetAssets: ['ETH'],
      performance: {
        totalReturn: -2.1,
        winRate: 45,
        trades: 23,
        totalTrades: 23,
        maxDrawdown: 12.8,
        sharpeRatio: 0.3
      },
      auditLog: []
    }
  ];

  const toggleBot = (botId: string) => {
    // In real implementation, this would communicate with the bot service
    console.log(`Toggling bot ${botId}`);
  };

  const currentPrices = realTimeData?.coins || [];
  const executions = realTimeData?.executions || [];

  return (
    <div className="space-y-6">
      {/* Real-Time Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Connection</p>
                <p className="text-lg font-bold flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  {isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{mockActiveBots.filter(b => b.isActive).length}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Trades</p>
                <p className="text-2xl font-bold">{executions.length}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className="text-2xl font-bold text-green-500">+$2,847</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bots" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bots">AI Bots</TabsTrigger>
          <TabsTrigger value="prices">Live Prices</TabsTrigger>
          <TabsTrigger value="trades">Live Trades</TabsTrigger>
          <TabsTrigger value="algorand">Algorand</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Trading Bots</h3>
            <Button>
              <Bot className="h-4 w-4 mr-2" />
              Create New Bot
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockActiveBots.map((bot) => (
              <Card key={bot.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                    <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                      {bot.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {bot.strategy.replace('-', ' ')} • {bot.model.split('/')[1]}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Return</p>
                        <p className={`font-medium ${bot.performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                        <p className="font-medium">{bot.performance.winRate.toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Trades</p>
                        <p className="font-medium">{bot.performance.trades}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={bot.isActive ? 'destructive' : 'default'}
                        onClick={() => toggleBot(bot.id)}
                        className="flex-1"
                      >
                        {bot.isActive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                        {bot.isActive ? 'Pause' : 'Start'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prices" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Real-Time Prices</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Data
              </div>
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentPrices.map((coin: CoinOption) => (
              <Card key={coin.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {coin.image && (
                      <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{coin.symbol}</p>
                      <p className="text-sm text-muted-foreground">{coin.name}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xl font-bold">
                      ${coin.price?.toFixed(coin.symbol === 'ALGO' ? 4 : 2)}
                    </p>
                    {coin.changePercent !== undefined && (
                      <div className={`flex items-center gap-1 text-sm ${
                        coin.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {coin.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{Math.abs(coin.changePercent).toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Live Bot Executions</h3>
            <Badge variant="outline">{executions.length} recent trades</Badge>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Time</th>
                      <th className="text-left p-3 text-sm font-medium">Bot</th>
                      <th className="text-left p-3 text-sm font-medium">Asset</th>
                      <th className="text-left p-3 text-sm font-medium">Action</th>
                      <th className="text-left p-3 text-sm font-medium">Amount</th>
                      <th className="text-left p-3 text-sm font-medium">Price</th>
                      <th className="text-left p-3 text-sm font-medium">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center p-8 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Activity className="h-8 w-8" />
                            <p>Waiting for bot executions...</p>
                            <p className="text-sm">Real-time trades will appear here</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      executions.map((execution, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 text-sm">
                            {new Date(execution.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="p-3 text-sm font-medium">
                            {mockActiveBots.find(b => b.id === execution.botId)?.name || 'Unknown Bot'}
                          </td>
                          <td className="p-3 text-sm">{execution.trade.coinSymbol}</td>
                          <td className="p-3">
                            <Badge variant={execution.trade.type === 'buy' ? 'default' : 'destructive'}>
                              {execution.trade.type.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{execution.trade.amount.toFixed(4)}</td>
                          <td className="p-3 text-sm">${execution.trade.price.toFixed(2)}</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {execution.signal.reason}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorand" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Algorand Integration</h3>
            <Badge variant={algorandData?.realTimeConnected ? 'default' : 'secondary'}>
              {algorandData?.realTimeConnected ? 'Connected' : 'Connecting...'}
            </Badge>
          </div>

          {algorandData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Network Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Network:</span>
                    <span className="text-sm font-medium capitalize">{algorandData.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Round:</span>
                    <span className="text-sm font-medium">{algorandData.lastRound?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="default">{algorandData.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ALGO Price</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold">
                    ${algorandData.prices?.ALGO?.price?.toFixed(4)} AUD
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    algorandData.prices?.ALGO?.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {algorandData.prices?.ALGO?.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{algorandData.prices?.ALGO?.change24h?.toFixed(2)}% (24h)</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Volume: ${algorandData.prices?.ALGO?.volume?.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveAiTradingDashboard;
