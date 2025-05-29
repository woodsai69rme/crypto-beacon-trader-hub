
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TradingAccount, PortfolioAsset } from '@/types/trading';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AccountManagerProps {
  accounts: TradingAccount[];
  onAddAccount: (account: Omit<TradingAccount, 'id' | 'createdAt'>) => void;
  activeAccountId?: string;
  onSelectAccount: (accountId: string) => void;
}

const AccountManager: React.FC<AccountManagerProps> = ({
  accounts,
  onAddAccount,
  activeAccountId,
  onSelectAccount,
}) => {
  const { formatCurrency } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState(10000);
  const [accountType, setAccountType] = useState<'paper' | 'live'>('paper');

  const handleAddAccount = () => {
    const mockAssets: PortfolioAsset[] = [
      {
        coinId: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.5,
        price: 45000,
        value: 22500,
        allocation: 45,
        change24h: 1200,
        changePercent24h: 2.7,
      },
      {
        coinId: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        amount: 5,
        price: 3000,
        value: 15000,
        allocation: 30,
        change24h: 500,
        changePercent24h: 3.5,
      },
      {
        coinId: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        amount: 10000,
        price: 1.2,
        value: 12000,
        allocation: 25,
        change24h: -600,
        changePercent24h: -4.8,
      }
    ];

    onAddAccount({
      name: newAccountName || `Account ${accounts.length + 1}`,
      balance: newAccountBalance,
      currency: 'AUD',
      trades: [],
      type: accountType,
      assets: accountType === 'live' ? mockAssets : [],
      isActive: true,
    });

    setIsAdding(false);
    setNewAccountName('');
    setNewAccountBalance(10000);
    setAccountType('paper');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Trading Accounts</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Cancel' : 'Add Account'}
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Account Name</label>
              <Input
                placeholder="My Trading Account"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Initial Balance</label>
              <Input
                type="number"
                placeholder="10000"
                value={newAccountBalance}
                onChange={(e) => setNewAccountBalance(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Account Type</label>
              <Select value={accountType} onValueChange={(value: 'paper' | 'live') => setAccountType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paper">Paper Trading</SelectItem>
                  <SelectItem value="live">Live Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddAccount} className="w-full">Create Account</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No accounts found. Create an account to start trading.</p>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    activeAccountId === account.id ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:bg-secondary/50'
                  }`}
                  onClick={() => onSelectAccount(account.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">{account.type === 'paper' ? 'Paper Trading' : 'Live Trading'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(account.balance)}</div>
                      <div className="text-xs text-muted-foreground">Available Balance</div>
                    </div>
                  </div>
                  {account.assets && account.assets.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {account.assets.length} asset{account.assets.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountManager;
