
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
      currency: "USD", // Adding the required currency property
      trades: [],
      createdAt: new Date().toISOString()
    }
  ]);

  // Add a new account
  const addAccount = (name: string, initialBalance: number, currency: string = "USD") => {
    const newAccount: TradingAccount = {
      id: `account-${Date.now()}`,
      name,
      balance: initialBalance,
      initialBalance,
      currency,
      trades: [],
      createdAt: new Date().toISOString()
    };
    
    setAccounts([...accounts, newAccount]);
    
    toast({
      title: "Account Created",
      description: `Successfully created ${name} with ${initialBalance} ${currency}`,
    });
    
    return newAccount;
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
      trades: [newTrade, ...account.trades]
    };
    
    setAccounts(updatedAccounts);
    return true;
  };

  // Delete an account
  const deleteAccount = (accountId: string) => {
    const filtered = accounts.filter(acc => acc.id !== accountId);
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
      createdAt: new Date().toISOString()
    };
    
    setAccounts([defaultAccount]);
    
    toast({
      title: "Accounts Reset",
      description: "All trading accounts have been reset to default.",
    });
  };

  return {
    accounts,
    addAccount,
    executeAccountTrade,
    deleteAccount,
    resetAccounts
  };
}
