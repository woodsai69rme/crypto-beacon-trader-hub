
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TradingAccount, PortfolioAsset, SupportedCurrency } from '@/types/trading';
import { Plus, Settings, Trash2, DollarSign } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const AccountManager: React.FC = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([
    {
      id: uuidv4(),
      name: 'Paper Trading Account',
      balance: 10000,
      currency: 'AUD',
      trades: [],
      type: 'paper',
      createdAt: new Date().toISOString(),
      assets: [
        {
          coinId: 'bitcoin',
          amount: 0.5,
          price: 61245.32,
          priceAUD: 61245.32,
          symbol: 'BTC',
          name: 'Bitcoin',
          value: 30622.66,
          valueAUD: 30622.66,
          allocation: 50,
          change24h: 2.3,
          changePercent24h: 2.3
        }
      ],
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Live Trading Account',
      balance: 5000,
      currency: 'AUD',
      trades: [],
      type: 'live',
      createdAt: new Date().toISOString(),
      assets: [
        {
          coinId: 'ethereum',
          amount: 2.5,
          price: 3234.12,
          priceAUD: 3234.12,
          symbol: 'ETH',
          name: 'Ethereum',
          value: 8085.30,
          valueAUD: 8085.30,
          allocation: 75,
          change24h: 1.8,
          changePercent24h: 1.8
        }
      ],
      isActive: false
    },
    {
      id: uuidv4(),
      name: 'Test Account',
      balance: 1000,
      currency: 'AUD',
      trades: [],
      type: 'paper',
      createdAt: new Date().toISOString(),
      assets: [
        {
          coinId: 'solana',
          amount: 50,
          price: 234.56,
          priceAUD: 234.56,
          symbol: 'SOL',
          name: 'Solana',
          value: 11728.00,
          valueAUD: 11728.00,
          allocation: 100,
          change24h: -0.5,
          changePercent24h: -0.5
        }
      ],
      isActive: false
    }
  ]);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Account Manager</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className={`${account.isActive ? 'ring-2 ring-primary' : ''}`}>
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
                <span className="font-semibold flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {account.balance.toLocaleString()} {account.currency}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assets:</span>
                <span className="font-semibold">{account.assets.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trades:</span>
                <span className="font-semibold">{account.trades.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm">{new Date(account.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  size="sm" 
                  variant={account.isActive ? "destructive" : "default"}
                  onClick={() => toggleAccountStatus(account.id)}
                >
                  {account.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => resetAccount(account.id)}>
                  Reset
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteAccount(account.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountManager;
