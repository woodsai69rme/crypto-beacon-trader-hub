
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TradingAccount, PortfolioAsset, Trade } from '@/types/trading';
import { Plus, Settings, Trash2, DollarSign, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

const WoodsAccountManager: React.FC = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([
    {
      id: 'paper-1',
      name: 'Woods Paper Trading Pro',
      balance: 50000,
      currency: 'AUD',
      trades: [],
      type: 'paper',
      createdAt: new Date().toISOString(),
      assets: [
        {
          coinId: 'bitcoin',
          amount: 1.25,
          price: 65432.10,
          priceAUD: 65432.10,
          symbol: 'BTC',
          name: 'Bitcoin',
          value: 81790.13,
          valueAUD: 81790.13,
          allocation: 45.2,
          change24h: 3.4,
          changePercent24h: 3.4
        },
        {
          coinId: 'ethereum',
          amount: 15.75,
          price: 3987.65,
          priceAUD: 3987.65,
          symbol: 'ETH',
          name: 'Ethereum',
          value: 62805.49,
          valueAUD: 62805.49,
          allocation: 34.7,
          change24h: 2.1,
          changePercent24h: 2.1
        },
        {
          coinId: 'solana',
          amount: 125,
          price: 234.56,
          priceAUD: 234.56,
          symbol: 'SOL',
          name: 'Solana',
          value: 29320.00,
          valueAUD: 29320.00,
          allocation: 16.2,
          change24h: -1.2,
          changePercent24h: -1.2
        }
      ],
      isActive: true,
      initialBalance: 50000
    },
    {
      id: 'live-1',
      name: 'Woods Live Trading Elite',
      balance: 25000,
      currency: 'AUD',
      trades: [],
      type: 'live',
      createdAt: new Date().toISOString(),
      assets: [
        {
          coinId: 'bitcoin',
          amount: 0.5,
          price: 65432.10,
          priceAUD: 65432.10,
          symbol: 'BTC',
          name: 'Bitcoin',
          value: 32716.05,
          valueAUD: 32716.05,
          allocation: 65.4,
          change24h: 3.4,
          changePercent24h: 3.4
        }
      ],
      isActive: false,
      initialBalance: 25000
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('10000');
  const [newAccountType, setNewAccountType] = useState<'paper' | 'live'>('paper');
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(null);

  const totalPortfolioValue = accounts.reduce((total, account) => {
    return total + account.assets.reduce((sum, asset) => sum + asset.valueAUD, 0);
  }, 0);

  const totalPnL = accounts.reduce((total, account) => {
    const accountValue = account.assets.reduce((sum, asset) => sum + asset.valueAUD, 0);
    return total + (accountValue - (account.initialBalance || account.balance));
  }, 0);

  const createAccount = () => {
    if (!newAccountName.trim()) return;

    const newAccount: TradingAccount = {
      id: `${newAccountType}-${Date.now()}`,
      name: newAccountName,
      balance: parseFloat(newAccountBalance) || 10000,
      currency: 'AUD',
      trades: [],
      type: newAccountType,
      createdAt: new Date().toISOString(),
      assets: [],
      isActive: false,
      initialBalance: parseFloat(newAccountBalance) || 10000
    };

    setAccounts([...accounts, newAccount]);
    setNewAccountName('');
    setNewAccountBalance('10000');
    setShowCreateForm(false);
  };

  const deleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
    if (selectedAccount?.id === accountId) {
      setSelectedAccount(null);
    }
  };

  const resetAccount = (accountId: string) => {
    setAccounts(accounts.map(acc => 
      acc.id === accountId 
        ? { 
            ...acc, 
            balance: acc.initialBalance || 10000, 
            trades: [], 
            assets: [] 
          }
        : acc
    ));
  };

  const toggleAccountStatus = (accountId: string) => {
    setAccounts(accounts.map(acc => 
      acc.id === accountId 
        ? { ...acc, isActive: !acc.isActive }
        : acc
    ));
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
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
                <p className="text-sm text-muted-foreground">Active Accounts</p>
                <p className="text-2xl font-bold">{accounts.filter(acc => acc.isActive).length}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{accounts.reduce((sum, acc) => sum + acc.trades.length, 0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Trading Accounts</h3>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </div>

          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Trading Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Account Name</label>
                  <Input
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    placeholder="Enter account name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Initial Balance (AUD)</label>
                  <Input
                    type="number"
                    value={newAccountBalance}
                    onChange={(e) => setNewAccountBalance(e.target.value)}
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Type</label>
                  <Select value={newAccountType} onValueChange={(value) => setNewAccountType(value as 'paper' | 'live')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paper">Paper Trading</SelectItem>
                      <SelectItem value="live">Live Trading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={createAccount}>Create Account</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className={`cursor-pointer transition-all hover:shadow-lg ${account.isActive ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedAccount(account)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Badge variant={account.type === 'live' ? 'destructive' : 'secondary'}>
                        {account.type.toUpperCase()}
                      </Badge>
                      {account.isActive && <Badge variant="default">Active</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Balance:</span>
                    <span className="font-semibold">${account.balance.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Portfolio Value:</span>
                    <span className="font-semibold">${account.assets.reduce((sum, asset) => sum + asset.valueAUD, 0).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Assets:</span>
                    <span className="font-semibold">{account.assets.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">P&L:</span>
                    <span className={`font-semibold ${(account.assets.reduce((sum, asset) => sum + asset.valueAUD, 0) - account.balance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(account.assets.reduce((sum, asset) => sum + asset.valueAUD, 0) - account.balance) >= 0 ? '+' : ''}${(account.assets.reduce((sum, asset) => sum + asset.valueAUD, 0) - account.balance).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button 
                      size="sm" 
                      variant={account.isActive ? "destructive" : "default"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAccountStatus(account.id);
                      }}
                    >
                      {account.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        resetAccount(account.id);
                      }}
                    >
                      Reset
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAccount(account.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <h3 className="text-xl font-semibold">Portfolio Overview</h3>
          
          {selectedAccount ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedAccount.name} - Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedAccount.assets.map((asset) => (
                    <div key={asset.coinId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-semibold">{asset.name}</h4>
                          <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${asset.priceAUD.toLocaleString()}</p>
                        <p className={`text-sm ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{asset.amount.toFixed(4)}</p>
                        <p className="text-sm text-muted-foreground">${asset.valueAUD.toLocaleString()}</p>
                      </div>
                      <div className="w-16">
                        <Progress value={asset.allocation} className="h-2" />
                        <p className="text-xs text-center mt-1">{asset.allocation}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Select an account to view portfolio details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-xl font-semibold">Account Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Accounts:</span>
                    <span className="font-semibold">{accounts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Accounts:</span>
                    <span className="font-semibold text-green-600">{accounts.filter(acc => acc.isActive).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paper Accounts:</span>
                    <span className="font-semibold">{accounts.filter(acc => acc.type === 'paper').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Live Accounts:</span>
                    <span className="font-semibold text-red-600">{accounts.filter(acc => acc.type === 'live').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Portfolio Diversification:</span>
                    <span className="font-semibold text-green-600">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Level:</span>
                    <span className="font-semibold text-yellow-600">Medium</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Drawdown:</span>
                    <span className="font-semibold">-5.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sharpe Ratio:</span>
                    <span className="font-semibold">1.34</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WoodsAccountManager;
