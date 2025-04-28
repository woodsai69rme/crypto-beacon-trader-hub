
import React, { createContext, useState, useContext } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Trade, AiTradingContextType, AITradingStrategy } from '@/types/trading';

// Create the context
const AiTradingContext = createContext<AiTradingContextType>({
  executeAiTrade: () => false,
  getConnectedAccount: () => undefined,
  isProcessing: false,
  connectBotToAccount: () => {},
  disconnectBot: () => {},
  activeBots: {},
});

// Create a provider component
export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBots, setActiveBots] = useState<Record<string, { lastTrade?: string, status: 'connected' | 'disconnected' }>>({});
  const [botAccountMap, setBotAccountMap] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [strategies, setStrategies] = useState<AITradingStrategy[]>([]);

  // Connect a bot to a trading account
  const connectBotToAccount = (botId: string, accountId: string) => {
    setBotAccountMap(prev => ({ ...prev, [botId]: accountId }));
    
    setActiveBots(prev => ({
      ...prev,
      [botId]: { 
        ...prev[botId],
        status: 'connected' 
      }
    }));
    
    toast({
      title: "Bot Connected",
      description: `Trading bot has been connected to account ID: ${accountId.substring(0, 8)}...`
    });
  };

  // Disconnect a bot from its account
  const disconnectBot = (botId: string) => {
    setBotAccountMap(prev => {
      const newMap = { ...prev };
      delete newMap[botId];
      return newMap;
    });
    
    setActiveBots(prev => ({
      ...prev,
      [botId]: {
        ...prev[botId],
        status: 'disconnected'
      }
    }));
    
    toast({
      title: "Bot Disconnected",
      description: "Trading bot has been disconnected from the account"
    });
  };

  // Get connected account ID for a bot
  const getConnectedAccount = (botId: string): string | undefined => {
    return botAccountMap[botId];
  };

  // Execute an AI trade
  const executeAiTrade = (params: {
    botId: string;
    strategyId: string;
    accountId: string;
    coinId: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
  }): boolean => {
    const { botId, strategyId, accountId, coinId, type, amount, price } = params;
    
    // Check if bot is connected to this account
    if (botAccountMap[botId] !== accountId) {
      toast({
        title: "Trade Failed",
        description: "Bot is not connected to this account",
        variant: "destructive"
      });
      return false;
    }
    
    setIsProcessing(true);
    
    // In a real app, we would call an API to execute the trade
    // For this example, we'll simulate a successful trade
    setTimeout(() => {
      // Update bot status with last trade info
      setActiveBots(prev => ({
        ...prev,
        [botId]: {
          ...prev[botId],
          lastTrade: `${type.toUpperCase()} ${amount} ${coinId} at $${price}`
        }
      }));
      
      setIsProcessing(false);
      
      toast({
        title: "Trade Executed",
        description: `Successfully ${type} ${amount} ${coinId} at $${price}`,
      });
    }, 1500);
    
    return true;
  };
  
  // Add a new strategy
  const addStrategy = (strategy: AITradingStrategy) => {
    setStrategies(prev => [...prev, strategy]);
    
    toast({
      title: "Strategy Added",
      description: `${strategy.name} has been added to your strategies`
    });
  };

  // Context value
  const value: AiTradingContextType = {
    executeAiTrade,
    getConnectedAccount,
    isProcessing,
    connectBotToAccount,
    disconnectBot,
    activeBots,
    addStrategy,
  };

  return (
    <AiTradingContext.Provider value={value}>
      {children}
    </AiTradingContext.Provider>
  );
};

// Custom hook for using the context
export const useAiTrading = () => {
  return useContext(AiTradingContext);
};
