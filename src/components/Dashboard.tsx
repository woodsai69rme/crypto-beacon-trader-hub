
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Bot, DollarSign, Activity, Zap } from 'lucide-react';
import { useAiTrading } from '@/contexts/AiTradingContext';
import { useTrading } from '@/contexts/TradingContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const Dashboard: React.FC = () => {
  const { bots, activeBots } = useAiTrading();
  const { accounts, getTotalBalance } = useTrading();
  const { formatCurrency } = useCurrency();

  const totalBalance = getTotalBalance();
  const totalTrades = accounts.reduce((sum, acc) => sum + acc.trades.length, 0);
  const avgWinRate = bots.length > 0 
    ? bots.reduce((sum, bot) => sum + bot.performance.winRate, 0) / bots.length 
    : 0;

  const recentActivity = accounts.flatMap(acc => 
    acc.trades.slice(-5).map(trade => ({
      ...trade,
      accountName: acc.name
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to Crypto Beacon</h1>
        <p className="text-muted-foreground">
          Your AI-powered cryptocurrency trading platform. All trading is in paper mode using virtual AUD funds.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Virtual AUD funds for paper trading
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBots.length}</div>
            <p className="text-xs text-muted-foreground">
              {bots.length} total bots created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              Across all accounts and bots
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWinRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              AI bot performance average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Bots Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Trading Bots
            </CardTitle>
            <CardDescription>
              Your AI-powered trading assistants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bots.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No AI bots created yet. Visit AI Trading to create your first bot.
              </p>
            ) : (
              bots.slice(0, 3).map(bot => (
                <div key={bot.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{bot.name}</p>
                    <p className="text-sm text-muted-foreground">{bot.strategy}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={bot.isActive ? "default" : "secondary"}>
                      {bot.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatCurrency(bot.account.balance)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest trades and bot actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No recent trading activity. Start trading to see activity here.
              </p>
            ) : (
              recentActivity.slice(0, 5).map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {trade.type === 'buy' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{trade.type.toUpperCase()} {trade.coinSymbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(trade.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(trade.totalValue)}</p>
                    <p className="text-sm text-muted-foreground">
                      {trade.amount.toFixed(6)} {trade.coinSymbol}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bot Performance */}
      {bots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bot Performance Overview</CardTitle>
            <CardDescription>
              Performance metrics for your AI trading bots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {bots.map(bot => (
                <div key={bot.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{bot.name}</p>
                      <p className="text-sm text-muted-foreground">{bot.strategy} • {bot.aiModel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{bot.performance.totalReturn.toFixed(2)}%</p>
                      <p className="text-sm text-muted-foreground">
                        {bot.performance.totalTrades} trades
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Win Rate</span>
                      <span>{bot.performance.winRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={bot.performance.winRate} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <Bot className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Create AI Bot</p>
              <p className="text-sm text-muted-foreground">Set up a new trading bot</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Manual Trade</p>
              <p className="text-sm text-muted-foreground">Execute a paper trade</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">View Analytics</p>
              <p className="text-sm text-muted-foreground">Check performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
