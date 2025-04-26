
import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';
import { TradingAccount, Trade } from '@/types/trading';
import { toast } from '@/components/ui/use-toast';

export const useTradingAccounts = () => {
  const [accounts, setAccounts] = useLocalStorage<TradingAccount[]>("tradingAccounts", []);
  const [activeAccountId, setActiveAccountId] = useLocalStorage<string>("activeAccountId", "");

  useEffect(() => {
    if (accounts.length === 0) {
      // Create default account if none exists
      createAccount("Default Account", 10000);
    }
  }, []);

  const createAccount = (name: string, initialBalance: number) => {
    const newAccount: TradingAccount = {
      id: Date.now().toString(),
      name,
      balance: initialBalance,
      initialBalance,
      trades: [],
      createdAt: new Date().toISOString()
    };
    
    setAccounts([...accounts, newAccount]);
    toast({
      title: "Account Created",
      description: `Successfully created trading account: ${name}`
    });
    
    if (!activeAccountId) {
      setActiveAccountId(newAccount.id);
    }
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
    if (activeAccountId === id) {
      setActiveAccountId(accounts[0]?.id || "");
    }
    toast({
      title: "Account Deleted",
      description: "Trading account has been removed"
    });
  };

  const addTradeToAccount = (accountId: string, trade: Trade) => {
    setAccounts(accounts.map(account => {
      if (account.id === accountId) {
        const newBalance = trade.type === 'buy' 
          ? account.balance - trade.totalValue
          : account.balance + trade.totalValue;
          
        return {
          ...account,
          balance: newBalance,
          trades: [trade, ...account.trades]
        };
      }
      return account;
    }));
  };

  const getActiveAccount = () => accounts.find(account => account.id === activeAccountId);

  return {
    accounts,
    activeAccountId,
    setActiveAccountId,
    createAccount,
    deleteAccount,
    addTradeToAccount,
    getActiveAccount
  };
};
