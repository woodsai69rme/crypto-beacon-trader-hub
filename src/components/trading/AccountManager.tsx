
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Edit, ExternalLink } from 'lucide-react';
import { TradingAccount } from '@/types/trading';

const mockAccounts: TradingAccount[] = [
  {
    id: 'acc1',
    name: 'Binance',
    trades: [],
    balance: 25000,
    currency: 'USD',
    createdAt: '2025-01-15T00:00:00Z',
    provider: 'Binance',
    type: 'exchange',
    assets: {
      'BTC': 0.5,
      'ETH': 4.2,
      'SOL': 25,
    },
    lastUpdated: '2025-05-12T08:30:00Z',
    isActive: true,
  },
  {
    id: 'acc2',
    name: 'Personal Wallet',
    trades: [],
    balance: 12500,
    currency: 'USD',
    createdAt: '2025-02-10T00:00:00Z',
    provider: 'MetaMask',
    type: 'wallet',
    assets: {
      'ETH': 2.8,
      'LINK': 120,
      'UNI': 75,
    },
    lastUpdated: '2025-05-12T06:15:00Z',
    isActive: true,
  },
  {
    id: 'acc3',
    name: 'Manual Tracking',
    trades: [],
    balance: 8750,
    currency: 'USD',
    createdAt: '2025-03-05T00:00:00Z',
    provider: 'Manual',
    type: 'manual',
    assets: {
      'BTC': 0.15,
      'DOT': 250,
      'ADA': 3000,
    },
    lastUpdated: '2025-05-11T20:45:00Z',
    isActive: true,
  }
];

const AccountManager: React.FC = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>(mockAccounts);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  const totalBalance = accounts.reduce((total, account) => total + account.balance, 0);
  
  const handleAddAccount = () => {
    // In a real app, this would open a modal to add a new account
    alert('Adding a new account...');
  };
  
  const handleDeleteAccount = (id: string) => {
    // In a real app, this would show a confirmation dialog
    setAccounts(accounts.filter(account => account.id !== id));
  };
  
  const handleEditAccount = (id: string) => {
    setSelectedAccount(id);
    // In a real app, this would open an edit modal
    alert(`Editing account ${id}...`);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Trading Accounts</CardTitle>
            <CardDescription>Manage your connected trading accounts</CardDescription>
          </div>
          <Button size="sm" onClick={handleAddAccount} className="gap-1">
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-secondary/20 rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
          <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Across {accounts.length} accounts</div>
        </div>
        
        <div className="space-y-3">
          {accounts.map((account) => (
            <div 
              key={account.id} 
              className={`border rounded-lg p-4 ${
                selectedAccount === account.id ? 'border-primary' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {account.provider} • {account.type}
                  </div>
                </div>
                <div>
                  <div className="text-right font-bold">${account.balance.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground text-right">
                    {Object.keys(account.assets || {}).length} assets
                  </div>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Last Updated</div>
                  <div className="text-sm">
                    {new Date(account.lastUpdated || '').toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="text-sm flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${account.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>{account.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  View
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleEditAccount(account.id)}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 gap-1" onClick={() => handleDeleteAccount(account.id)}>
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountManager;
