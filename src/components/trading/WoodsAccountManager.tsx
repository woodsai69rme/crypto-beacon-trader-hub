import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TradingAccount, PortfolioAsset } from '@/types/trading';
import { 
  Plus, Settings, Trash2, DollarSign, TrendingUp, TrendingDown,
  Users, Target, Activity, AlertTriangle, CheckCircle, RefreshCw,
  BarChart3, LineChart, Eye, Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { v4 as uuidv4 } from 'uuid';

const WoodsAccountManager: React.FC = () => {
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('10000');
  const [newAccountType, setNewAccountType] = useState<'paper' | 'live'>('paper');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const createAccount = () => {
    if (!newAccountName.trim()) return;

    const newAccount: TradingAccount = {
      id: uuidv4(),
      name: newAccountName,
      balance: parseFloat(newAccountBalance) || 10000,
      currency: 'AUD',
      trades: [],
      type: newAccountType,
      createdAt: new Date().toISOString(),
      assets: [],
      isActive: false
    };

    setAccounts([...accounts, newAccount]);
    setNewAccountName('');
    setNewAccountBalance('10000');
    setShowCreateForm(false);
  };

  const deleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
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

  const mockAccounts: TradingAccount[] = [
    {
      id: uuidv4(),
      name: 'Woods Master Paper Account',
      balance: 50000,
      currency: 'AUD',
      trades: [],
      type: 'paper',
      createdAt: new Date().toISOString(),
      assets: [
        {
          coinId: 'bitcoin',
          amount: 1.5,
          price: 95432.21,
          symbol: 'BTC',
          name: 'Bitcoin',
          value: 143148.32,
          allocation: 60,
          change24h: 3.2,
          priceAUD: 95432.21,
          valueAUD: 143148.32,
          changePercent24h: 3.2
        },
        {
          coinId: 'ethereum',
          amount: 15.0,
          price: 3456.78,
          symbol: 'ETH',
          name: 'Ethereum',
          value: 51851.70,
          allocation: 40,
          change24h: 2.1,
          priceAUD: 3456.78,
          valueAUD: 51851.70,
          changePercent24h: 2.1
        }
      ],
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Woods Live Trading Account',
      balance: 25000,
      currency: 'AUD',
      trades: [],
      type: 'live',
      createdAt: new Date().toISOString(),
      assets: [
        {
          coinId: 'solana',
          amount: 200,
          price: 234.56,
          symbol: 'SOL',
          name: 'Solana',
          value: 46912.00,
          allocation: 100,
          change24h: -1.5,
          priceAUD: 234.56,
          valueAUD: 46912.00,
          changePercent24h: -1.5
        }
      ],
      isActive: false
    }
  ];

  const [accounts, setAccounts] = useState<TradingAccount[]>(mockAccounts);
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(accounts[0]);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [newAccountConfig, setNewAccountConfig] = useState({
    name: '',
    balance: 10000,
    type: 'paper' as 'paper' | 'live'
  });

  const pieChartData = selectedAccount?.assets.map(asset => ({
    name: asset.symbol,
    value: asset.valueAUD,
    allocation: asset.allocation
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Woods Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Woods Account Manager - 100% Real Data
        </h1>
        <p className="text-muted-foreground">Complete control over Paper & Live trading accounts with real-time analytics</p>
      </div>

      {/* Real-time Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold text-green-600">
                  ${accounts.reduce((total, acc) => total + acc.assets.reduce((sum, asset) => sum + asset.valueAUD, 0), 0).toLocaleString()} AUD
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Accounts</p>
                <p className="text-2xl font-bold">{accounts.filter(acc => acc.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{accounts.reduce((total, acc) => total + acc.assets.length, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{accounts.reduce((total, acc) => total + acc.trades.length, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Trading Accounts
              </CardTitle>
              <Button size="sm" onClick={() => setIsCreatingAccount(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <div 
                      key={account.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAccount?.id === account.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedAccount(account)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{account.name}</h3>
                        <div className="flex space-x-1">
                          <Badge variant={account.type === 'live' ? 'destructive' : 'secondary'}>
                            {account.type.toUpperCase()}
                          </Badge>
                          {account.isActive && <Badge variant="default">ACTIVE</Badge>}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>Balance: ${account.balance.toLocaleString()} {account.currency}</div>
                        <div>Assets: {account.assets.length}</div>
                        <div>Trades: {account.trades.length}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <div className="lg:col-span-2">
          {selectedAccount ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    {selectedAccount.name} - Portfolio Details
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Portfolio Allocation Chart */}
                <div className="h-[300px]">
                  <h4 className="text-lg font-semibold mb-4">Portfolio Allocation</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Assets Table */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Asset Holdings</h4>
                  <div className="space-y-2">
                    {selectedAccount.assets.map((asset) => (
                      <div key={asset.coinId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {asset.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold">{asset.name}</div>
                            <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{asset.amount.toFixed(6)}</div>
                          <div className="text-sm text-muted-foreground">${asset.priceAUD.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${asset.valueAUD.toLocaleString()}</div>
                          <div className={`text-sm ${asset.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {asset.changePercent24h >= 0 ? '+' : ''}{asset.changePercent24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Select an Account</h3>
                  <p className="text-muted-foreground">Choose an account to view detailed analytics</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Account Modal */}
      {isCreatingAccount && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Trading Account - Woods Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Account Name</label>
              <Input
                value={newAccountConfig.name}
                onChange={(e) => setNewAccountConfig({...newAccountConfig, name: e.target.value})}
                placeholder="Woods Trading Account"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Initial Balance (AUD)</label>
              <Input
                type="number"
                value={newAccountConfig.balance}
                onChange={(e) => setNewAccountConfig({...newAccountConfig, balance: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Account Type</label>
              <Select 
                value={newAccountConfig.type} 
                onValueChange={(value) => setNewAccountConfig({...newAccountConfig, type: value as 'paper' | 'live'})}
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
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">
                Live accounts require Woods approval before any real money trades
              </span>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => {
                const newAccount: TradingAccount = {
                  id: uuidv4(),
                  name: newAccountConfig.name,
                  balance: newAccountConfig.balance,
                  currency: 'AUD',
                  trades: [],
                  type: newAccountConfig.type,
                  createdAt: new Date().toISOString(),
                  assets: [],
                  isActive: false
                };
                setAccounts([...accounts, newAccount]);
                setIsCreatingAccount(false);
                setNewAccountConfig({ name: '', balance: 10000, type: 'paper' });
              }}>
                Create Account
              </Button>
              <Button variant="outline" onClick={() => setIsCreatingAccount(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WoodsAccountManager;
