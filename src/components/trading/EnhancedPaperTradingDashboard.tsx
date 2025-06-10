
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Bot, 
  DollarSign, 
  Target, 
  Shield, 
  Activity,
  BarChart3,
  Zap,
  Play,
  Pause
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { comprehensiveAiBotSystem } from '@/services/ai/comprehensiveAiBotSystem';
import { useTradingContext } from '@/contexts/TradingContext';
import AiBotCreator from './AiBotCreator';
import EnhancedAiBotDashboard from './EnhancedAiBotDashboard';
import FakeTradingForm from './FakeTradingForm';
import { Trade, CoinOption } from '@/types/trading';

const EnhancedPaperTradingDashboard: React.FC = () => {
  const { toast } = useToast();
  const { activeAccount, addTrade } = useTradingContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [bots, setBots] = useState([]);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [showBotCreator, setShowBotCreator] = useState(false);
  
  // Mock portfolio data
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 100000,
    dailyPnL: 2340.56,
    dailyPnLPercent: 2.34,
    totalReturn: 15.8,
    activeBots: 3,
    totalTrades: 127,
    winRate: 68.5
  });

  // Mock coin data
  const mockCoin: CoinOption = {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 61245.32,
    priceChange: 1200,
    changePercent: 2.3,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    volume: 28000000000,
    marketCap: 1180000000000,
    value: "BTC",
    label: "Bitcoin (BTC)"
  };

  useEffect(() => {
    // Initialize the bot system
    comprehensiveAiBotSystem.startSystem();
    loadDashboardData();

    // Set up real-time updates
    const interval = setInterval(loadDashboardData, 10000);

    return () => {
      clearInterval(interval);
      comprehensiveAiBotSystem.stopSystem();
    };
  }, []);

  const loadDashboardData = () => {
    setBots(comprehensiveAiBotSystem.getAllBots());
    
    // Update portfolio with bot performance
    const allBots = comprehensiveAiBotSystem.getAllBots();
    const activeBotCount = allBots.filter(bot => bot.isActive).length;
    const totalReturn = allBots.reduce((sum, bot) => sum + bot.performance.totalReturn, 0);
    
    setPortfolioData(prev => ({
      ...prev,
      activeBots: activeBotCount,
      totalReturn: totalReturn || prev.totalReturn
    }));
  };

  const handleTrade = (trade: Trade) => {
    addTrade(trade);
    setRecentTrades(prev => [trade, ...prev.slice(0, 9)]); // Keep last 10 trades
    
    // Update portfolio value
    setPortfolioData(prev => ({
      ...prev,
      totalValue: prev.totalValue + (trade.type === 'sell' ? trade.totalValue : -trade.totalValue),
      totalTrades: prev.totalTrades + 1
    }));

    toast({
      title: 'Trade Executed',
      description: `${trade.type.toUpperCase()} ${trade.quantity} ${trade.symbol} at $${trade.price.toFixed(2)}`
    });
  };

  const quickStartBot = async (strategy: string) => {
    const botConfig = {
      id: `quickbot-${Date.now()}`,
      name: `Quick ${strategy} Bot`,
      strategy,
      model: 'deepseek/deepseek-r1',
      riskLevel: 'medium' as const,
      maxTradeAmount: 1000,
      targetAssets: ['BTC', 'ETH'],
      parameters: {}
    };

    try {
      const botId = await comprehensiveAiBotSystem.createBot(botConfig);
      await comprehensiveAiBotSystem.startBot(botId);
      loadDashboardData();
      
      toast({
        title: 'Quick Bot Started',
        description: `${strategy} bot is now running!`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start quick bot',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paper Trading Dashboard</h1>
          <p className="text-muted-foreground">
            Practice trading with virtual funds • Account: {activeAccount?.name || 'Default'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowBotCreator(true)} variant="outline">
            <Bot className="h-4 w-4 mr-2" />
            Create Bot
          </Button>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            New Trade
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">
                  {portfolioData.totalValue.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily P&L</p>
                <p className={`text-2xl font-bold ${portfolioData.dailyPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioData.dailyPnL >= 0 ? '+' : ''}${portfolioData.dailyPnL.toFixed(2)}
                </p>
                <p className={`text-sm ${portfolioData.dailyPnLPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioData.dailyPnLPercent >= 0 ? '+' : ''}{portfolioData.dailyPnLPercent.toFixed(2)}%
                </p>
              </div>
              {portfolioData.dailyPnL >= 0 ? 
                <TrendingUp className="h-8 w-8 text-green-500" /> : 
                <TrendingDown className="h-8 w-8 text-red-500" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{portfolioData.activeBots}</p>
                <p className="text-sm text-muted-foreground">
                  {portfolioData.totalTrades} total trades
                </p>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{portfolioData.winRate.toFixed(1)}%</p>
                <Progress value={portfolioData.winRate} className="mt-2" />
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="bots">AI Bots</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Trading Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { strategy: 'trend-following', name: 'Trend', icon: TrendingUp },
                  { strategy: 'mean-reversion', name: 'Reversion', icon: Target },
                  { strategy: 'scalping', name: 'Scalping', icon: Zap },
                  { strategy: 'breakout', name: 'Breakout', icon: TrendingUp },
                  { strategy: 'arbitrage', name: 'Arbitrage', icon: Shield }
                ].map(({ strategy, name, icon: Icon }) => (
                  <Button
                    key={strategy}
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => quickStartBot(strategy)}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTrades.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No trades yet. Start trading to see activity here.
                    </p>
                  ) : (
                    recentTrades.map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                            {trade.type.toUpperCase()}
                          </Badge>
                          <div>
                            <p className="font-medium">{trade.symbol}</p>
                            <p className="text-sm text-muted-foreground">
                              {trade.quantity.toFixed(6)} @ ${trade.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${trade.totalValue.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(trade.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Bot Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bots.filter(bot => bot.isActive).length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No active bots. Create and start a bot to see performance.
                    </p>
                  ) : (
                    bots.filter(bot => bot.isActive).map((bot) => (
                      <div key={bot.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <div>
                            <p className="font-medium">{bot.name}</p>
                            <p className="text-sm text-muted-foreground">{bot.strategy}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${bot.performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {bot.performance.totalTrades} trades
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <FakeTradingForm
                onTrade={handleTrade}
                selectedCoin={mockCoin}
                onAddTrade={handleTrade}
                advancedMode={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-6">
          <EnhancedAiBotDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Advanced analytics dashboard coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Portfolio analysis tools coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bot Creator Modal */}
      {showBotCreator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Create AI Trading Bot</h3>
              <Button variant="ghost" onClick={() => setShowBotCreator(false)}>×</Button>
            </div>
            <div className="p-4">
              <AiBotCreator />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPaperTradingDashboard;
