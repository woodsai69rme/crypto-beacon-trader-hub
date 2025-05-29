
import { useState } from 'react';
import { TradingAccount, PortfolioAsset } from '@/types/trading';

export const useTradingAccounts = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string>('');

  const addAccount = (accountData: Omit<TradingAccount, 'id' | 'createdAt'>) => {
    const newAccount: TradingAccount = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...accountData,
    };
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };

  const getActiveAccount = () => {
    return accounts.find(account => account.id === activeAccountId);
  };

  const createDefaultPaperAccount = () => {
    const defaultAccount: TradingAccount = {
      id: 'default-paper',
      name: 'Default Paper Account',
      type: 'paper',
      balance: 10000,
      currency: 'AUD',
      trades: [],
      assets: [],
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    
    setAccounts([defaultAccount]);
    setActiveAccountId(defaultAccount.id);
    return defaultAccount;
  };

  const createDefaultLiveAccount = () => {
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
      }
    ];

    const liveAccount: TradingAccount = {
      id: 'default-live',
      name: 'Default Live Account',
      type: 'live',
      balance: 50000,
      currency: 'AUD',
      trades: [],
      assets: mockAssets,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    
    setAccounts(prev => [...prev, liveAccount]);
    return liveAccount;
  };

  return {
    accounts,
    activeAccountId,
    setActiveAccountId,
    addAccount,
    getActiveAccount,
    createDefaultPaperAccount,
    createDefaultLiveAccount,
  };
};
