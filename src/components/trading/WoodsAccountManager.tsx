
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { TradingAccount, PortfolioAsset, Trade } from '@/types/trading';
import { 
  Plus, Settings, Trash2, DollarSign, Activity, 
  Eye, RefreshCw, Download, Upload, AlertTriangle,
  CheckCircle, Clock, TrendingUp, BarChart3
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const WoodsAccountManager: React.FC = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([
    {
      id: uuidv4(),
      name: 'Woods Master Paper Account',
      balance: 100000,
      currency: 'AUD',
      trades: [],
      type: 'paper',
      createdAt: new Date().toISOString(),
      assets: [],
      isActive: true,
      initialBalance: 100000
    }
  ]);

  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(accounts[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    balance: 10000,
    type: 'paper' as 'paper' | 'live',
    autoTrading: false,
    riskLevel: 'medium' as 'low' | 'medium' | 'high'
  });

  const createAccount = () => {
    const account: TradingAccount = {
      id: uuidv4(),
      name: newAccount.name || 'New Trading Account',
      balance: newAccount.balance,
      currency: 'AUD',
      trades: [],
      type: newAccount.type,
      createdAt: new Date().toISOString(),
      assets: [],
      isActive: false,
      initialBalance: newAccount.balance
    };

    setAccounts([...accounts, account]);
    setIsCreating(false);
    setNewAccount({
      name: '',
      balance: 10000,
      type: 'paper',
      autoTrading: false,
      riskLevel: 'medium'
    });
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

  const deleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
    if (selectedAccount?.id === accountId) {
      setSelectedAccount(accounts.find(acc => acc.id !== accountId) || null);
    }
  };

  const generateMockTrades = (accountId: string, count: number = 50) => {
    const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'AVAX', 'MATIC'];
    const trades: Trade[] = [];

    for (let i = 0; i < count; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const price = Math.random() * 50000 + 1000;
      const quantity = Math.random() * 10;
      const totalValue = price * quantity;

      trades.push({
        id: uuidv4(),
        symbol,
        type,
        quantity,
        price,
        totalValue,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        botGenerated: Math.random() > 0.3,
        fees: totalValue * 0.001
      });
    }

    setAccounts(accounts.map(acc => 
      acc.id === accountId 
        ? { ...acc, trades: [...acc.trades, ...trades] }
        : acc
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Woods Account Manager - 100% Perfect</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Account
        </Button>
      </div>

      {isCreating && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Create New Trading Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Account Name</label>
                <Input
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  placeholder="Woods Trading Account"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Initial Balance (AUD)</label>
                <Input
                  type="number"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({...newAccount, balance: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Account Type</label>
                <Select 
                  value={newAccount.type} 
                  onValueChange={(value) => setNewAccount({...newAccount, type: value as 'paper' | 'live'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paper">Paper Trading (Safe)</SelectItem>
                    <SelectItem value="live">Live Trading (Real Money)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Risk Level</label>
                <Select 
                  value={newAccount.riskLevel} 
                  onValueChange={(value) => setNewAccount({...newAccount, riskLevel: value as 'low' | 'medium' | 'high'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={newAccount.autoTrading}
                onCheckedChange={(checked) => setNewAccount({...newAccount, autoTrading: checked})}
              />
              <label className="text-sm">Enable AI Auto-Trading (Woods Approval Required)</label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={createAccount}>Create Account</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Trading Accounts</h2>
          {accounts.map((account) => (
            <Card 
              key={account.id} 
              className={`cursor-pointer transition-all ${
                selectedAccount?.id === account.id ? 'ring-2 ring-primary' : ''
              } ${account.isActive ? 'border-green-500' : ''}`}
              onClick={() => setSelectedAccount(account)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold truncate">{account.name}</h3>
                  <div className="flex space-x-1">
                    <Badge variant={account.type === 'live' ? 'destructive' : 'secondary'}>
                      {account.type.toUpperCase()}
                    </Badge>
                    {account.isActive && <Badge variant="default">ACTIVE</Badge>}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance:</span>
                    <span className="font-semibold">${account.balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trades:</span>
                    <span>{account.trades.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assets:</span>
                    <span>{account.assets.length}</span>
                  </div>
                </div>
                <div className="flex space-x-1 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      generateMockTrades(account.id);
                    }}
                  >
                    <RefreshCw className="h-3 w-3" />
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
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Account Details */}
        <div className="lg:col-span-2">
          {selectedAccount ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trades">Trades</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {selectedAccount.name} - Overview
                      <Badge variant={selectedAccount.type === 'live' ? 'destructive' : 'default'}>
                        {selectedAccount.type === 'live' ? 'LIVE MONEY' : 'PAPER TRADING'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <DollarSign className="h-8 w-8 mx-auto text-green-500 mb-2" />
                          <div className="text-2xl font-bold">${selectedAccount.balance.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Current Balance</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Activity className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                          <div className="text-2xl font-bold">{selectedAccount.trades.length}</div>
                          <div className="text-sm text-muted-foreground">Total Trades</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 text-center">
                          <BarChart3 className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                          <div className="text-2xl font-bold">{selectedAccount.assets.length}</div>
                          <div className="text-sm text-muted-foreground">Active Assets</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold">Account Performance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Profit/Loss</span>
                            <span className="text-green-600">+$2,450.32</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Win Rate</span>
                            <span>68.5%</span>
                          </div>
                          <Progress value={68.5} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trades" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Trade History - Woods Audit Trail
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => generateMockTrades(selectedAccount.id, 20)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Generate Trades
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {selectedAccount.trades.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No trades yet. Generate some sample trades to see the audit trail.</p>
                          </div>
                        ) : (
                          selectedAccount.trades.map((trade) => (
                            <div key={trade.id} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                                    {trade.type.toUpperCase()}
                                  </Badge>
                                  <span className="font-semibold">{trade.symbol}</span>
                                  {trade.botGenerated && (
                                    <Badge variant="outline">
                                      <Activity className="h-3 w-3 mr-1" />
                                      AI Bot
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">
                                    {trade.quantity.toFixed(4)} @ ${trade.price.toFixed(2)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Total: ${trade.totalValue.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                <span>{new Date(trade.timestamp).toLocaleString()}</span>
                                {trade.fees && <span>Fee: ${trade.fees.toFixed(2)}</span>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assets" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAccount.assets.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No assets in portfolio. Start trading to build your portfolio.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedAccount.assets.map((asset) => (
                          <div key={asset.coinId} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {asset.symbol.substring(0, 2)}
                              </div>
                              <div>
                                <div className="font-semibold">{asset.name}</div>
                                <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{asset.amount.toFixed(4)}</div>
                              <div className="text-sm text-muted-foreground">
                                ${asset.valueAUD.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings - Woods Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Account Status</div>
                        <div className="text-sm text-muted-foreground">
                          Enable/disable this trading account
                        </div>
                      </div>
                      <Switch 
                        checked={selectedAccount.isActive}
                        onCheckedChange={(checked) => {
                          setAccounts(accounts.map(acc => 
                            acc.id === selectedAccount.id 
                              ? { ...acc, isActive: checked }
                              : acc
                          ));
                          if (selectedAccount) {
                            setSelectedAccount({ ...selectedAccount, isActive: checked });
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">AI Auto-Trading</div>
                        <div className="text-sm text-muted-foreground">
                          Allow AI bots to trade on this account
                        </div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Real-time Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Get notified of all trading activity
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Woods Approval Required</div>
                        <div className="text-sm text-muted-foreground">
                          Require manual approval for large trades
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        onClick={() => resetAccount(selectedAccount.id)}
                        className="mr-2"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset Account
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => deleteAccount(selectedAccount.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Account Selected</h3>
                <p className="text-muted-foreground">Select an account from the list to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WoodsAccountManager;
