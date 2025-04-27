
import { useState, useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { Trade, TradingAccount } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

export function useTradingAccounts() {
  const [accounts, setAccounts] = useLocalStorage<TradingAccount[]>("trading-accounts", [
    {
      id: "default",
      name: "Main Account",
      balance: 10000,
      initialBalance: 10000,
      currency: "USD",
      trades: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      allowBots: true
    }
  ]);
  
  const [activeAccountId, setActiveAccountId] = useState<string>(accounts[0]?.id || "default");

  useEffect(() => {
    // Initialize activeAccountId when accounts change
    if (accounts.length > 0 && !accounts.find(a => a.id === activeAccountId)) {
      setActiveAccountId(accounts[0].id);
    }
  }, [accounts, activeAccountId]);

  // Add a new account
  const addAccount = (name: string, initialBalance: number, currency: string = "USD") => {
    const newAccount: TradingAccount = {
      id: `account-${Date.now()}`,
      name,
      balance: initialBalance,
      initialBalance,
      currency,
      trades: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    setAccounts([...accounts, newAccount]);
    
    toast({
      title: "Account Created",
      description: `Successfully created ${name} with ${initialBalance} ${currency}`,
    });
    
    return newAccount;
  };

  // Alias for addAccount to maintain compatibility
  const createAccount = addAccount;

  // Get the currently active account
  const getActiveAccount = () => {
    return accounts.find(acc => acc.id === activeAccountId) || accounts[0];
  };

  // Execute a trade on a specific account
  const executeAccountTrade = (accountId: string, trade: Omit<Trade, "id" | "timestamp">) => {
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);
    if (accountIndex === -1) return false;
    
    const account = accounts[accountIndex];
    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      ...trade,
      timestamp: new Date().toISOString()
    };
    
    let updatedBalance = account.balance;
    if (trade.type === 'buy') {
      updatedBalance -= trade.totalValue;
    } else {
      updatedBalance += trade.totalValue;
    }
    
    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = {
      ...account,
      balance: updatedBalance,
      trades: [newTrade, ...account.trades],
      lastModified: new Date().toISOString()
    };
    
    setAccounts(updatedAccounts);
    return true;
  };

  // Alias for executeAccountTrade to maintain compatibility
  const addTradeToAccount = (accountId: string, trade: Trade) => {
    const { id, timestamp, ...tradeData } = trade;
    return executeAccountTrade(accountId, tradeData);
  };

  // Update an account
  const updateAccount = (accountId: string, data: Partial<TradingAccount>) => {
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);
    if (accountIndex === -1) return false;
    
    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = {
      ...accounts[accountIndex],
      ...data,
      lastModified: new Date().toISOString()
    };
    
    setAccounts(updatedAccounts);
    
    toast({
      title: "Account Updated",
      description: `Successfully updated ${updatedAccounts[accountIndex].name}`,
    });
    
    return true;
  };

  // Delete an account
  const deleteAccount = (accountId: string) => {
    const filtered = accounts.filter(acc => acc.id !== accountId);
    
    // If we're deleting the active account, switch to another one
    if (activeAccountId === accountId && filtered.length > 0) {
      setActiveAccountId(filtered[0].id);
    }
    
    setAccounts(filtered);
    
    toast({
      title: "Account Deleted",
      description: "The trading account has been deleted.",
    });
  };

  // Reset all accounts to initial state
  const resetAccounts = () => {
    const defaultAccount: TradingAccount = {
      id: "default",
      name: "Main Account",
      balance: 10000,
      initialBalance: 10000,
      currency: "USD",
      trades: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    setAccounts([defaultAccount]);
    setActiveAccountId(defaultAccount.id);
    
    toast({
      title: "Accounts Reset",
      description: "All trading accounts have been reset to default.",
    });
  };

  return {
    accounts,
    activeAccountId,
    setActiveAccountId,
    addAccount,
    createAccount,
    executeAccountTrade,
    addTradeToAccount,
    updateAccount,
    deleteAccount,
    resetAccounts,
    getActiveAccount
  };
}
