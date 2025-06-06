
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCryptoStore, TradingBot } from '@/stores/useCryptoStore';
import { 
  TrendingUp, Bot, Wallet, AlertTriangle, Play, Square, 
  Plus, BarChart3, DollarSign, Activity, Target 
} from 'lucide-react';

const CryptoTradingView: React.FC = () => {
  const {
    assets,
    bots,
    portfolios,
    alerts,
    wallets,
    tradingMode,
    addBot,
    updateBot,
    deleteBot,
    startBot,
    stopBot,
    addPortfolio,
    addAlert,
    addWallet,
    setTradingMode
  } = useCryptoStore();

  const [isCreatingBot, setIsCreatingBot] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    strategy: 'grid' as TradingBot['strategy'],
    mode: tradingMode,
    settings: {}
  });

  // Mock market data
  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      // This would typically fetch real market data
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateBot = () => {
    if (!newBot.name) return;
    
    addBot({
      ...newBot,
      settings: {
        symbol: 'BTC/USDT',
        gridLevels: 10,
        gridSpacing: 0.5,
        investment: 1000,
        ...newBot.settings
      }
    });
    
    setNewBot({
      name: '',
      strategy: 'grid',
      mode: tradingMode,
      settings: {}
    });
    setIsCreatingBot(false);
  };

  const runningBots = bots.filter(b => b.status === 'running');
  const totalPortfolioValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0);
  const activeAlerts = alerts.filter(a => !a.triggered).length;

  const strategies = [
    { value: 'grid', label: 'Grid Trading', description: 'Buy low, sell high with grid orders' },
    { value: 'dca', label: 'DCA', description: 'Dollar cost averaging strategy' },
    { value: 'trend', label: 'Trend Following', description: 'Follow market trends' },
    { value: 'mean_reversion', label: 'Mean Reversion', description: 'Buy oversold, sell overbought' },
    { value: 'arbitrage', label: 'Arbitrage', description: 'Profit from price differences' },
    { value: 'breakout', label: 'Breakout', description: 'Trade on price breakouts' },
    { value: 'custom', label: 'Custom', description: 'Custom trading strategy' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-green-400" />
            Crypto Trading Dashboard
          </h1>
          <p className="text-muted-foreground">AI-powered cryptocurrency trading and portfolio management</p>
        </div>
        <div className="flex gap-2">
          <Select value={tradingMode} onValueChange={(value: any) => setTradingMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paper">Paper</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreatingBot(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Bot
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{runningBots.length}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected Wallets</p>
                <p className="text-2xl font-bold">{wallets.length}</p>
              </div>
              <Wallet className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">{activeAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Mode Banner */}
      <Card className={`border-2 ${tradingMode === 'live' ? 'border-red-500 bg-red-50 dark:bg-red-950' : 'border-green-500 bg-green-50 dark:bg-green-950'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className={`h-6 w-6 ${tradingMode === 'live' ? 'text-red-600' : 'text-green-600'}`} />
              <div>
                <h3 className={`font-bold ${tradingMode === 'live' ? 'text-red-600' : 'text-green-600'}`}>
                  {tradingMode === 'live' ? 'LIVE TRADING MODE' : 'PAPER TRADING MODE'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tradingMode === 'live' 
                    ? 'Trading with real money - be careful!' 
                    : 'Practice trading with virtual funds'
                  }
                </p>
              </div>
            </div>
            <Badge variant={tradingMode === 'live' ? 'destructive' : 'default'} className="text-lg px-4 py-2">
              {tradingMode.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="bots" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bots">Trading Bots</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-4">
          {/* Create Bot */}
          {isCreatingBot && (
            <Card>
              <CardHeader>
                <CardTitle>Create Trading Bot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Bot name"
                    value={newBot.name}
                    onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                  />
                  <Select value={newBot.strategy} onValueChange={(value: any) => setNewBot({ ...newBot, strategy: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map(strategy => (
                        <SelectItem key={strategy.value} value={strategy.value}>
                          <div>
                            <div className="font-medium">{strategy.label}</div>
                            <div className="text-sm text-muted-foreground">{strategy.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleCreateBot}>Create Bot</Button>
                  <Button variant="outline" onClick={() => setIsCreatingBot(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <Card key={bot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{strategies.find(s => s.value === bot.strategy)?.label}</Badge>
                        <Badge 
                          variant={
                            bot.status === 'running' ? 'default' : 
                            bot.status === 'stopped' ? 'secondary' : 'outline'
                          }
                        >
                          {bot.status}
                        </Badge>
                        <Badge variant={bot.mode === 'live' ? 'destructive' : 'secondary'}>
                          {bot.mode}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Performance</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Return:</span>
                          <span className={`ml-1 font-medium ${bot.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn.toFixed(2)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Win Rate:</span>
                          <span className="ml-1 font-medium">{(bot.performance.winRate * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Trades:</span>
                          <span className="ml-1 font-medium">{bot.performance.totalTrades}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">P&L:</span>
                          <span className={`ml-1 font-medium ${(bot.performance.profit - bot.performance.loss) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${(bot.performance.profit - bot.performance.loss).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {bot.status === 'running' ? (
                        <Button size="sm" variant="outline" onClick={() => stopBot(bot.id)}>
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => startBot(bot.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => deleteBot(bot.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {bots.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Trading Bots</h3>
                <p className="text-muted-foreground mb-4">Create your first trading bot to automate your strategies.</p>
                <Button onClick={() => setIsCreatingBot(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bot
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolios.length > 0 ? (
                <div className="space-y-4">
                  {portfolios.map(portfolio => (
                    <div key={portfolio.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{portfolio.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(portfolio.created).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</p>
                          <p className={`text-sm ${portfolio.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {portfolio.change24h >= 0 ? '+' : ''}{portfolio.change24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {portfolio.assets.map(asset => (
                          <div key={asset.symbol} className="text-center p-2 bg-muted rounded">
                            <p className="font-medium">{asset.symbol}</p>
                            <p className="text-sm">{asset.amount.toFixed(4)}</p>
                            <p className="text-sm text-muted-foreground">${asset.value.toLocaleString()}</p>
                            <p className="text-xs">{asset.allocation.toFixed(1)}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Portfolios</h3>
                  <p className="text-muted-foreground mb-4">Create a portfolio to track your investments.</p>
                  <Button onClick={() => addPortfolio({
                    name: 'Main Portfolio',
                    totalValue: 10000,
                    change24h: 0,
                    assets: []
                  })}>
                    Create Portfolio
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market">
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Market Data</h3>
                <p className="text-muted-foreground">Real-time market data will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Price Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Alerts</h3>
                <p className="text-muted-foreground mb-4">Set up price alerts to monitor your investments.</p>
                <Button onClick={() => addAlert({
                  symbol: 'BTC',
                  type: 'price',
                  condition: 'above',
                  value: 50000,
                  triggered: false
                })}>
                  Create Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallets">
          <Card>
            <CardHeader>
              <CardTitle>Connected Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Wallets Connected</h3>
                <p className="text-muted-foreground mb-4">Connect your cryptocurrency wallets to track balances.</p>
                <Button onClick={() => addWallet({
                  name: 'Test Wallet',
                  address: '0x' + Math.random().toString(16).slice(2, 42),
                  balance: Math.random() * 10,
                  network: 'ethereum',
                  connected: true
                })}>
                  Connect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CryptoTradingView;
