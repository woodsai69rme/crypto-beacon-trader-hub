
import { useState, useEffect } from 'react';
import { TradingAccount, Trade } from '@/types/trading';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface UseTradingAccountsReturn {
  accounts: TradingAccount[];
  activeAccountId: string | null;
  createAccount: (name: string, balance: number) => void;
  deleteAccount: (id: string) => void;
  setActiveAccountId: (id: string | null) => void;
  addTradeToAccount: (accountId: string, trade: Trade) => void;
  getActiveAccount: () => TradingAccount | null;
  updateAccount: (id: string, updates: Partial<TradingAccount>) => void;
}

export const useTradingAccounts = (): UseTradingAccountsReturn => {
  // Load accounts from local storage
  const [accounts, setAccounts] = useLocalStorage<TradingAccount[]>('trading-accounts', []);
  const [activeAccountId, setActiveAccountId] = useLocalStorage<string | null>('active-trading-account', null);

  // Initialize with a default account if none exists
  useEffect(() => {
    if (accounts.length === 0) {
      const defaultAccount: TradingAccount = {
        id: uuidv4(),
        name: 'Default Account',
        balance: 10000,
        initialBalance: 10000,
        currency: 'USD',
        trades: [],
        createdAt: new Date().toISOString()
      };
      
      setAccounts([defaultAccount]);
      setActiveAccountId(defaultAccount.id);
      
      toast({
        title: 'Default Account Created',
        description: 'A default trading account has been set up for you.'
      });
    }
  }, []);

  const createAccount = (name: string, balance: number) => {
    const newAccount: TradingAccount = {
      id: uuidv4(),
      name,
      balance,
      initialBalance: balance,
      currency: 'USD',
      trades: [],
      createdAt: new Date().toISOString()
    };
    
    setAccounts([...accounts, newAccount]);
    setActiveAccountId(newAccount.id);
    
    toast({
      title: 'Account Created',
      description: `Trading account "${name}" has been created with $${balance.toLocaleString()}.`
    });
    
    return newAccount.id;
  };

  const deleteAccount = (id: string) => {
    // Don't allow deleting the last account
    if (accounts.length <= 1) {
      toast({
        title: 'Cannot Delete Account',
        description: 'You must have at least one trading account.',
        variant: 'destructive'
      });
      return;
    }
    
    const accountToDelete = accounts.find(a => a.id === id);
    if (!accountToDelete) return;
    
    // Update accounts
    const updatedAccounts = accounts.filter(a => a.id !== id);
    setAccounts(updatedAccounts);
    
    // Update active account if needed
    if (activeAccountId === id) {
      setActiveAccountId(updatedAccounts[0]?.id || null);
    }
    
    toast({
      title: 'Account Deleted',
      description: `Trading account "${accountToDelete.name}" has been deleted.`
    });
  };

  const addTradeToAccount = (accountId: string, trade: Trade) => {
    const accountIndex = accounts.findIndex(a => a.id === accountId);
    if (accountIndex === -1) return;
    
    const account = accounts[accountIndex];
    
    // Calculate the impact on balance
    let balanceChange = 0;
    if (trade.type === 'buy') {
      balanceChange = -trade.totalValue;
    } else if (trade.type === 'sell') {
      balanceChange = trade.totalValue;
    }
    
    // Create updated account
    const updatedAccount = {
      ...account,
      balance: account.balance + balanceChange,
      trades: [...account.trades, trade],
      lastModified: new Date().toISOString()
    };
    
    // Update accounts
    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = updatedAccount;
    setAccounts(updatedAccounts);
  };
  
  const getActiveAccount = () => {
    if (!activeAccountId) return null;
    return accounts.find(a => a.id === activeAccountId) || null;
  };
  
  const updateAccount = (id: string, updates: Partial<TradingAccount>) => {
    const accountIndex = accounts.findIndex(a => a.id === id);
    if (accountIndex === -1) return;
    
    const updatedAccount = {
      ...accounts[accountIndex],
      ...updates,
      lastModified: new Date().toISOString()
    };
    
    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = updatedAccount;
    setAccounts(updatedAccounts);
  };

  return {
    accounts,
    activeAccountId,
    createAccount,
    deleteAccount,
    setActiveAccountId,
    addTradeToAccount,
    getActiveAccount,
    updateAccount
  };
};
