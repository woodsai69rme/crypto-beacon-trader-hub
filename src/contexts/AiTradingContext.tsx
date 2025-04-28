
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AiTradingContextType, AITradingStrategy } from '@/types/trading';

// Create the context with default values
const AiTradingContext = createContext<AiTradingContextType>({
  executeAiTrade: () => false,
  getConnectedAccount: () => undefined,
  isProcessing: false,
  connectBotToAccount: () => {},
  disconnectBot: () => {},
  activeBots: {},
});

interface AiTradingProviderProps {
  children: ReactNode;
}

export const AiTradingProvider: React.FC<AiTradingProviderProps> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [connectedBots, setConnectedBots] = useState<Record<string, string>>({});
  const [strategies, setStrategies] = useState<AITradingStrategy[]>([]);
  const [activeBots, setActiveBots] = useState<Record<string, {
    lastTrade?: string;
    status: 'connected' | 'disconnected';
  }>>({});
  
  // Connect a bot to a trading account
  const connectBotToAccount = (botId: string, accountId: string) => {
    setConnectedBots(prev => ({
      ...prev,
      [botId]: accountId
    }));
    
    setActiveBots(prev => ({
      ...prev,
      [botId]: {
        status: 'connected',
        lastTrade: undefined
      }
    }));
    
    toast({
      title: "Bot Connected",
      description: `The trading bot has been connected to account ${accountId}`
    });
  };
  
  // Disconnect a bot
  const disconnectBot = (botId: string) => {
    setConnectedBots(prev => {
      const newConnections = { ...prev };
      delete newConnections[botId];
      return newConnections;
    });
    
    setActiveBots(prev => ({
      ...prev,
      [botId]: {
        status: 'disconnected',
        lastTrade: prev[botId]?.lastTrade
      }
    }));
    
    toast({
      title: "Bot Disconnected",
      description: "The trading bot has been disconnected from the account"
    });
  };
  
  // Get the account connected to a bot
  const getConnectedAccount = (botId: string) => {
    return connectedBots[botId];
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
  }) => {
    setIsProcessing(true);
    
    // Simulate API call to execute trade
    setTimeout(() => {
      setIsProcessing(false);
      
      // Update bot's last trade timestamp
      setActiveBots(prev => ({
        ...prev,
        [params.botId]: {
          ...prev[params.botId],
          lastTrade: new Date().toISOString()
        }
      }));
      
      toast({
        title: `AI ${params.type.toUpperCase()} Order Executed`,
        description: `${params.amount} of ${params.coinId} at $${params.price}`
      });
    }, 1000);
    
    return true;
  };
  
  // Add a new trading strategy
  const addStrategy = (strategy: AITradingStrategy) => {
    setStrategies(prev => [...prev, strategy]);
    
    toast({
      title: "Strategy Added",
      description: `${strategy.name} has been added to your strategies`
    });
  };

  // Provide the context value
  const contextValue: AiTradingContextType = {
    executeAiTrade,
    getConnectedAccount,
    isProcessing,
    connectBotToAccount,
    disconnectBot,
    activeBots,
    addStrategy
  };

  return (
    <AiTradingContext.Provider value={contextValue}>
      {children}
    </AiTradingContext.Provider>
  );
};

// Custom hook to use the context
export const useAiTrading = () => {
  const context = useContext(AiTradingContext);
  if (context === undefined) {
    throw new Error('useAiTrading must be used within an AiTradingProvider');
  }
  return context;
};
