
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TradingAccount, Trade, PortfolioAsset, CoinOption } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

interface TradingContextProps {
  accounts: TradingAccount[];
  trades: Trade[];
  activeAccount: TradingAccount | null;
  addAccount: (account: Omit<TradingAccount, 'id' | 'createdAt'>) => void;
  updateAccount: (account: TradingAccount) => void;
  deleteAccount: (accountId: string) => void;
  setActiveAccount: (accountId: string) => void;
  addTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  updateTrade: (trade: Trade) => void;
  deleteTrade: (tradeId: string) => void;
  getAccountById: (accountId: string) => TradingAccount | undefined;
  getAssetBySymbol: (accountId: string, symbol: string) => PortfolioAsset | undefined;
  getTotalPortfolioValue: () => number;
  getTradeHistory: (filters?: {
    coinId?: string;
    type?: 'buy' | 'sell' | 'all';
    startDate?: Date;
    endDate?: Date;
  }) => Trade[];
  getAvailableCoins: () => CoinOption[];
}

const defaultContext: TradingContextProps = {
  accounts: [],
  trades: [],
  activeAccount: null,
  addAccount: () => {},
  updateAccount: () => {},
  deleteAccount: () => {},
  setActiveAccount: () => {},
  addTrade: () => {},
  updateTrade: () => {},
  deleteTrade: () => {},
  getAccountById: () => undefined,
  getAssetBySymbol: () => undefined,
  getTotalPortfolioValue: () => 0,
  getTradeHistory: () => [],
  getAvailableCoins: () => [],
};

const TradingContext = createContext<TradingContextProps>(defaultContext);

// Mock data for coins
const mockCoins: CoinOption[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 50000, priceChange: 1000, value: "bitcoin", label: "Bitcoin (BTC)" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3000, priceChange: 100, value: "ethereum", label: "Ethereum (ETH)" },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.5, priceChange: 0.02, value: "ripple", label: "XRP (XRP)" },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 1.2, priceChange: 0.05, value: "cardano", label: "Cardano (ADA)" },
  { id: "solana", name: "Solana", symbol: "SOL", price: 150, priceChange: 7, value: "solana", label: "Solana (SOL)" },
];

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([
    {
      id: "default-account",
      name: "Paper Trading Account",
      type: "paper",
      balance: 100000,
      currency: "AUD",
      createdAt: new Date().toISOString(),
      assets: [],
      isActive: true,
    }
  ]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [activeAccount, setActiveAccountState] = useState<TradingAccount | null>(accounts[0]);

  useEffect(() => {
    // Initialize with the first account if none is active
    if (!activeAccount && accounts.length > 0) {
      setActiveAccountState(accounts[0]);
    }
  }, [accounts, activeAccount]);

  const addAccount = (account: Omit<TradingAccount, 'id' | 'createdAt'>) => {
    const newAccount = {
      ...account,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      assets: account.assets || [],
    };
    setAccounts([...accounts, newAccount]);
  };

  const updateAccount = (updatedAccount: TradingAccount) => {
    const updatedAccounts = accounts.map(account =>
      account.id === updatedAccount.id ? updatedAccount : account
    );
    
    setAccounts(updatedAccounts);
    
    if (activeAccount?.id === updatedAccount.id) {
      setActiveAccountState(updatedAccount);
    }
  };

  const deleteAccount = (accountId: string) => {
    const remainingAccounts = accounts.filter(account => account.id !== accountId);
    setAccounts(remainingAccounts);
    
    if (activeAccount?.id === accountId && remainingAccounts.length > 0) {
      setActiveAccountState(remainingAccounts[0]);
    } else if (remainingAccounts.length === 0) {
      setActiveAccountState(null);
    }
  };

  const setActiveAccount = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (account) {
      setActiveAccountState(account);
    }
  };

  const addTrade = (trade: Omit<Trade, 'id' | 'timestamp'>) => {
    if (!activeAccount) return;

    const newTrade = {
      ...trade,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      total: trade.price * trade.amount,
    };

    setTrades([...trades, newTrade]);

    // Update account assets and balance
    const accountToUpdate = { ...activeAccount };
    
    // Update balance
    const tradeValue = trade.price * trade.amount;
    if (trade.type === 'buy') {
      accountToUpdate.balance -= tradeValue;
    } else {
      accountToUpdate.balance += tradeValue;
    }

    // Update assets
    const assetIndex = accountToUpdate.assets?.findIndex(
      asset => asset.coinId === trade.coinId
    ) ?? -1;

    if (assetIndex !== -1 && accountToUpdate.assets) {
      const existingAsset = accountToUpdate.assets[assetIndex];
      
      if (trade.type === 'buy') {
        const newAmount = existingAsset.amount + trade.amount;
        const newAveragePrice = (existingAsset.amount * existingAsset.averagePrice + trade.amount * trade.price) / newAmount;
        
        accountToUpdate.assets[assetIndex] = {
          ...existingAsset,
          amount: newAmount,
          averagePrice: newAveragePrice,
          value: newAmount * trade.price,
        };
      } else {
        const newAmount = existingAsset.amount - trade.amount;
        
        if (newAmount <= 0) {
          // Remove asset if all is sold
          accountToUpdate.assets = accountToUpdate.assets.filter(a => a.coinId !== trade.coinId);
        } else {
          accountToUpdate.assets[assetIndex] = {
            ...existingAsset,
            amount: newAmount,
            value: newAmount * trade.price,
          };
        }
      }
    } else if (trade.type === 'buy') {
      // Add new asset
      const newAsset: PortfolioAsset = {
        coinId: trade.coinId,
        coinName: trade.coinName,
        coinSymbol: trade.coinSymbol,
        amount: trade.amount,
        averagePrice: trade.price,
        value: trade.amount * trade.price,
        price: trade.price,
      };
      
      accountToUpdate.assets = [...(accountToUpdate.assets || []), newAsset];
    }

    updateAccount(accountToUpdate);
  };

  const updateTrade = (updatedTrade: Trade) => {
    setTrades(trades.map(trade => (trade.id === updatedTrade.id ? updatedTrade : trade)));
  };

  const deleteTrade = (tradeId: string) => {
    setTrades(trades.filter(trade => trade.id !== tradeId));
  };

  const getAccountById = (accountId: string) => {
    return accounts.find(account => account.id === accountId);
  };

  const getAssetBySymbol = (accountId: string, symbol: string) => {
    const account = getAccountById(accountId);
    return account?.assets?.find(asset => asset.coinSymbol.toLowerCase() === symbol.toLowerCase());
  };

  const getTotalPortfolioValue = () => {
    if (!activeAccount || !activeAccount.assets) return 0;
    
    return activeAccount.assets.reduce((total, asset) => total + (asset.value || 0), 0) + activeAccount.balance;
  };

  const getTradeHistory = (filters?: {
    coinId?: string;
    type?: 'buy' | 'sell' | 'all';
    startDate?: Date;
    endDate?: Date;
  }) => {
    if (!filters) return trades;
    
    return trades.filter(trade => {
      let match = true;
      
      if (filters.coinId) {
        match = match && trade.coinId === filters.coinId;
      }
      
      if (filters.type && filters.type !== 'all') {
        match = match && trade.type === filters.type;
      }
      
      if (filters.startDate) {
        const tradeDate = new Date(trade.timestamp);
        match = match && tradeDate >= filters.startDate;
      }
      
      if (filters.endDate) {
        const tradeDate = new Date(trade.timestamp);
        match = match && tradeDate <= filters.endDate;
      }
      
      return match;
    });
  };

  const getAvailableCoins = () => {
    return mockCoins;
  };

  const value = {
    accounts,
    trades,
    activeAccount,
    addAccount,
    updateAccount,
    deleteAccount,
    setActiveAccount,
    addTrade,
    updateTrade,
    deleteTrade,
    getAccountById,
    getAssetBySymbol,
    getTotalPortfolioValue,
    getTradeHistory,
    getAvailableCoins,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => useContext(TradingContext);

export default TradingContext;
