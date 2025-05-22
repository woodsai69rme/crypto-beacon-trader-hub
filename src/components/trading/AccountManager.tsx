
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TradingAccount, SupportedCurrency } from '@/types/trading';
import { formatPrice } from '@/services/cryptoService'; 
import { BarChart, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from '@/components/ui/use-toast';

// Mock trading accounts
const mockAccounts: TradingAccount[] = [
  {
    id: '1',
    name: 'Binance Account',
    balance: 24563.98,
    currency: 'AUD', // Default to AUD as per requirements
    createdAt: '2023-07-15T10:30:00Z',
    trades: [],
    provider: 'binance',
    assets: {
      'bitcoin': 0.5,
      'ethereum': 5.2,
      'solana': 45.8
    },
    lastUpdated: '2023-09-22T14:30:00Z',
    isActive: true,
    initialBalance: 20000,
    type: 'exchange'
  },
  {
    id: '2',
    name: 'Coinbase Pro',
    balance: 12450.34,
    currency: 'AUD',
    createdAt: '2023-05-10T08:20:00Z',
    trades: [],
    provider: 'coinbase',
    assets: {
      'bitcoin': 0.25,
      'ethereum': 2.8,
      'cardano': 2500
    },
    lastUpdated: '2023-09-20T09:45:00Z',
    isActive: true,
    initialBalance: 10000,
    type: 'exchange'
  },
  {
    id: '3',
    name: 'Paper Trading',
    balance: 32500.00,
    currency: 'AUD',
    createdAt: '2023-08-05T16:15:00Z',
    trades: [],
    provider: 'paper',
    assets: {
      'bitcoin': 0.15,
      'ethereum': 1.5,
      'polkadot': 120,
      'chainlink': 200
    },
    lastUpdated: '2023-09-21T11:20:00Z',
    isActive: true,
    initialBalance: 25000,
    type: 'manual'
  }
];

const AccountManager: React.FC = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>(mockAccounts);
  const [showAddAccount, setShowAddAccount] = useState(false);
  
  const calculateTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };
  
  const calculateTotalAssets = () => {
    const assetCounts: Record<string, number> = {};
    
    accounts.forEach(account => {
      if (account.assets) {
        Object.entries(account.assets).forEach(([asset, amount]) => {
          if (assetCounts[asset]) {
            assetCounts[asset] += amount;
          } else {
            assetCounts[asset] = amount;
          }
        });
      }
    });
    
    return assetCounts;
  };
  
  const handleAddAccount = () => {
    // In a real app, this would open a modal or form to add a new account
    setShowAddAccount(true);
    
    // For demo purposes, just show a toast
    toast({
      title: "Add Account",
      description: "This would open a form to add a new trading account",
    });
  };
  
  const handleEditAccount = (accountId: string) => {
    toast({
      title: "Edit Account",
      description: `This would open a form to edit account ${accountId}`,
    });
  };
  
  const handleDeleteAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(account => account.id !== accountId));
    
    toast({
      title: "Account Deleted",
      description: "The trading account has been removed",
      variant: "destructive"
    });
  };
  
  const handleViewStats = (accountId: string) => {
    toast({
      title: "View Statistics",
      description: `This would show detailed statistics for account ${accountId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Accounts</h2>
        <Button onClick={handleAddAccount}>
          <Plus className="h-4 w-4 mr-2" /> Add Account
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>
            Manage your connected trading accounts and view balances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{accounts.length}</div>
                <p className="text-sm text-muted-foreground">Connected Accounts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{formatPrice(calculateTotalBalance())}</div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{Object.keys(calculateTotalAssets()).length}</div>
                <p className="text-sm text-muted-foreground">Unique Assets</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            {accounts.map((account) => (
              <Card key={account.id} className={account.isActive ? "" : "opacity-70"}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-bold flex items-center">
                        {account.name}
                        {account.isActive === false && (
                          <Badge variant="outline" className="ml-2 text-xs bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Inactive
                          </Badge>
                        )}
                        {account.type === 'manual' && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Paper
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">Provider: {account.provider}</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="font-bold">{formatPrice(account.balance)}</div>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(account.lastUpdated || account.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="icon" variant="ghost" onClick={() => handleViewStats(account.id)}>
                        <BarChart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEditAccount(account.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteAccount(account.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {account.assets && Object.keys(account.assets).length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-1">Assets:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(account.assets).map(([asset, amount]) => (
                          <div key={asset} className="bg-muted px-2 py-1 rounded-md text-xs">
                            {asset.charAt(0).toUpperCase() + asset.slice(1)}: {amount}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {accounts.length === 0 && (
              <div className="text-center p-8 border rounded-md">
                <p className="text-muted-foreground mb-4">No trading accounts connected yet</p>
                <Button onClick={handleAddAccount}>Add Your First Account</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountManager;
