import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTradingContext } from '@/contexts/TradingContext';
import { TradingAccount, PortfolioAsset } from '@/types/trading';
import { Plus, Trash2 } from 'lucide-react';

const AccountManager: React.FC = () => {
  const { accounts, createAccount, deleteAccount, setActiveAccount } = useTradingContext();
  const [newAccountName, setNewAccountName] = useState('');
  const [accountType, setAccountType] = useState<'paper' | 'live'>('paper');

  const handleCreateAccount = () => {
    if (!newAccountName.trim()) return;

    const mockAssets: PortfolioAsset[] = [
      {
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        amount: 0.5,
        price: 65000,
        symbol: 'BTC',
        name: 'Bitcoin',
        value: 32500,
        allocation: 65,
        change24h: 2.5,
        priceAUD: 97500,
        valueAUD: 48750
      },
      {
        coinId: 'ethereum',
        coinName: 'Ethereum',
        amount: 5,
        price: 3500,
        symbol: 'ETH',
        name: 'Ethereum',
        value: 17500,
        allocation: 35,
        change24h: -1.2,
        priceAUD: 5250,
        valueAUD: 26250
      },
      {
        coinId: 'solana',
        coinName: 'Solana',
        amount: 100,
        price: 180,
        symbol: 'SOL',
        name: 'Solana',
        value: 18000,
        allocation: 20,
        change24h: 5.8,
        priceAUD: 270,
        valueAUD: 27000
      }
    ];

    const newAccount: Omit<TradingAccount, 'id' | 'createdAt'> = {
      name: newAccountName,
      balance: 50000,
      currency: 'AUD',
      type: accountType,
      assets: mockAssets,
      isActive: true,
      trades: [] // Add required trades field
    };

    createAccount(newAccount);
    setNewAccountName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create New Account */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold">Create New Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="My Trading Account"
              />
            </div>
            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <Select value={accountType} onValueChange={(value: 'paper' | 'live') => setAccountType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paper">Paper Trading</SelectItem>
                  <SelectItem value="live">Live Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreateAccount} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </div>
          </div>
        </div>

        {/* Existing Accounts */}
        <div className="space-y-4">
          <h3 className="font-semibold">Existing Accounts</h3>
          {accounts.length === 0 ? (
            <p className="text-muted-foreground">No accounts created yet</p>
          ) : (
            <div className="grid gap-4">
              {accounts.map((account) => (
                <div key={account.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{account.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={account.type === 'live' ? 'default' : 'secondary'}>
                          {account.type === 'live' ? 'Live' : 'Paper'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Balance: ${account.balance.toLocaleString()} {account.currency}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveAccount(account.id)}
                        disabled={account.isActive}
                      >
                        {account.isActive ? 'Active' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountManager;
