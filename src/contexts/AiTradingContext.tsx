
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useTradingAccounts } from '@/hooks/use-trading-accounts';
import type { AITradingStrategy, Trade } from '@/types/trading';
import { sampleStrategies } from '@/utils/aiTradingStrategies';

interface AiTradingContextType {
  activeStrategies: AITradingStrategy[];
  pendingStrategies: AITradingStrategy[];
  addStrategy: (strategy: AITradingStrategy) => void;
  removeStrategy: (strategyId: string) => void;
  activateStrategy: (strategyId: string) => void;
  deactivateStrategy: (strategyId: string) => void;
  isStrategyActive: (strategyId: string) => boolean;
  isPendingStrategy: (strategyId: string) => boolean;
  updateStrategy: (strategy: AITradingStrategy) => void;
  executeTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => boolean;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  serverUrl: string;
  setServerUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  serversHistory: string[];
  clearHistory: () => void;
}

const AiTradingContext = createContext<AiTradingContextType>({
  activeStrategies: [],
  pendingStrategies: [],
  addStrategy: () => {},
  removeStrategy: () => {},
  activateStrategy: () => {},
  deactivateStrategy: () => {},
  isStrategyActive: () => false,
  isPendingStrategy: () => false,
  updateStrategy: () => {},
  executeTrade: () => false,
  isConnected: false,
  setIsConnected: () => {},
  serverUrl: '',
  setServerUrl: () => {},
  apiKey: '',
  setApiKey: () => {},
  serversHistory: [],
  clearHistory: () => {},
});

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStrategies, setActiveStrategies] = useLocalStorage<AITradingStrategy[]>('ai-active-strategies', [
    // Default active strategy
    sampleStrategies[0],
  ]);
  const [pendingStrategies, setPendingStrategies] = useLocalStorage<AITradingStrategy[]>('ai-pending-strategies', []);
  const [isConnected, setIsConnected] = useLocalStorage('ai-is-connected', false);
  const [serverUrl, setServerUrl] = useLocalStorage('ai-server-url', 'http://localhost:8000');
  const [apiKey, setApiKey] = useLocalStorage('ai-api-key', '');
  const [serversHistory, setServersHistory] = useLocalStorage<string[]>('ai-servers-history', []);
  
  const { executeAccountTrade, activeAccountId } = useTradingAccounts();

  // Save server URL to history when it changes
  useEffect(() => {
    if (serverUrl && !serversHistory.includes(serverUrl)) {
      setServersHistory([...serversHistory, serverUrl]);
    }
  }, [serverUrl, serversHistory, setServersHistory]);

  const addStrategy = (strategy: AITradingStrategy) => {
    if (!strategy.id) {
      strategy.id = `strategy-${Date.now()}`; 
    }
    
    if (activeStrategies.some(s => s.id === strategy.id) || 
        pendingStrategies.some(s => s.id === strategy.id)) {
      toast({
        title: "Strategy already exists",
        description: "This strategy is already in your list."
      });
      return;
    }
    
    setPendingStrategies([...pendingStrategies, strategy]);
    
    toast({
      title: "Strategy Added",
      description: "The strategy has been added to your pending list."
    });
  };

  const removeStrategy = (strategyId: string) => {
    setActiveStrategies(activeStrategies.filter(s => s.id !== strategyId));
    setPendingStrategies(pendingStrategies.filter(s => s.id !== strategyId));
    
    toast({
      title: "Strategy Removed",
      description: "The strategy has been removed."
    });
  };

  const activateStrategy = (strategyId: string) => {
    const strategy = pendingStrategies.find(s => s.id === strategyId);
    if (!strategy) return;
    
    setPendingStrategies(pendingStrategies.filter(s => s.id !== strategyId));
    setActiveStrategies([...activeStrategies, strategy]);
    
    toast({
      title: "Strategy Activated",
      description: "The strategy is now active and trading."
    });
  };

  const deactivateStrategy = (strategyId: string) => {
    const strategy = activeStrategies.find(s => s.id === strategyId);
    if (!strategy) return;
    
    setActiveStrategies(activeStrategies.filter(s => s.id !== strategyId));
    setPendingStrategies([...pendingStrategies, strategy]);
    
    toast({
      title: "Strategy Deactivated",
      description: "The strategy has been deactivated."
    });
  };

  const isStrategyActive = (strategyId: string) => {
    return activeStrategies.some(s => s.id === strategyId);
  };

  const isPendingStrategy = (strategyId: string) => {
    return pendingStrategies.some(s => s.id === strategyId);
  };

  const updateStrategy = (strategy: AITradingStrategy) => {
    if (isStrategyActive(strategy.id)) {
      setActiveStrategies(activeStrategies.map(s => 
        s.id === strategy.id ? strategy : s
      ));
    } else if (isPendingStrategy(strategy.id)) {
      setPendingStrategies(pendingStrategies.map(s => 
        s.id === strategy.id ? strategy : s
      ));
    }
    
    toast({
      title: "Strategy Updated",
      description: "The strategy settings have been updated."
    });
  };

  // Execute a trade with the active account
  const executeTrade = (trade: Omit<Trade, 'id' | 'timestamp'>) => {
    if (!activeAccountId) return false;
    
    const success = executeAccountTrade(activeAccountId, {
      ...trade,
      strategyId: trade.strategyId
    });
    
    if (success) {
      toast({
        title: trade.type === 'buy' ? "Buy Order Executed" : "Sell Order Executed",
        description: `${trade.amount} ${trade.coinSymbol} at ${trade.price} ${trade.currency}`,
      });
    }
    
    return success;
  };

  const clearHistory = () => {
    setServersHistory([]);
    
    toast({
      title: "History Cleared",
      description: "Server history has been cleared."
    });
  };

  return (
    <AiTradingContext.Provider value={{
      activeStrategies,
      pendingStrategies,
      addStrategy,
      removeStrategy,
      activateStrategy,
      deactivateStrategy,
      isStrategyActive,
      isPendingStrategy,
      updateStrategy,
      executeTrade,
      isConnected,
      setIsConnected,
      serverUrl,
      setServerUrl,
      apiKey,
      setApiKey,
      serversHistory,
      clearHistory,
    }}>
      {children}
    </AiTradingContext.Provider>
  );
};

export const useAiTrading = () => useContext(AiTradingContext);

export default AiTradingContext;
