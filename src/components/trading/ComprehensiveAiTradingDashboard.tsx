
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
import { comprehensiveAiBotSystem } from '@/services/ai/comprehensiveAiBotSystem';
import { AIBot, CoinOption } from '@/types/trading';
import EnhancedAiBotDashboard from './EnhancedAiBotDashboard';

const ComprehensiveAiTradingDashboard: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [activeBots, setActiveBots] = useState<AIBot[]>([]);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<CoinOption[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Start real-time trading service
    realTimeTradingService.startRealTimeTracking();
    
    // Subscribe to real-time updates
    const unsubscribe = realTimeTradingService.subscribe((data) => {
      setRealTimeData(data);
      setMarketData(data.coins || []);
      setIsConnected(true);
    });

    // Load bot data
    const loadBotData = () => {
      setActiveBots(comprehensiveAiBotSystem.getAllBots());
      setRecentTrades(comprehensiveAiBotSystem.getRecentExecutions(10));
    };

    loadBotData();
    
    // Set up periodic updates
    const interval = setInterval(loadBotData, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
      realTimeTradingService.stopRealTimeTracking();
    };
  }, []);

  const activeBotCount = activeBots.filter(bot => bot.isActive).length;
  const totalReturn = activeBots.reduce((sum, bot) => sum + bot.performance.totalReturn, 0);
  const totalTrades = activeBots.reduce((sum, bot) => sum + bot.performance.totalTrades, 0);

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">
            {isConnected ? 'Live Data Connected' : 'Connecting...'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {realTimeData && (
            <>
              <RefreshCw className="h-4 w-4" />
              Last update: {new Date(realTimeData.timestamp).toLocaleTimeString()}
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{activeBotCount}</p>
              </div>
              <Bot className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
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
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{totalTrades}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Assets</p>
                <p className="text-2xl font-bold">{marketData.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Live Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.slice(0, 8).map((coin) => (
              <div key={coin.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{coin.symbol}</span>
                  <Badge variant={
                    (coin.changePercent || 0) >= 0 ? 'default' : 'destructive'
                  }>
                    {(coin.changePercent || 0).toFixed(2)}%
                  </Badge>
                </div>
                <div className="text-lg font-bold">
                  ${coin.price?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Vol: {(coin.volume || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Trading Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bot Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTrades.slice(0, 5).map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={trade.trade.type === 'buy' ? 'default' : 'secondary'}>
                    {trade.trade.type.toUpperCase()}
                  </Badge>
                  <div>
                    <p className="font-medium">{trade.trade.coinSymbol}</p>
                    <p className="text-sm text-muted-foreground">
                      Bot: {activeBots.find(b => b.id === trade.botId)?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {trade.trade.amount.toFixed(4)} @ ${trade.trade.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {recentTrades.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No recent trading activity. Start a bot to begin automated trading.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full Bot Dashboard */}
      <EnhancedAiBotDashboard />
    </div>
  );
};

export default ComprehensiveAiTradingDashboard;
