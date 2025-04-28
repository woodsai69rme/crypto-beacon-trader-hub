
import React, { createContext, useContext, useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { AiTradingContextType, AITradingStrategy, Trade } from '@/types/trading';
import { AVAILABLE_STRATEGIES } from '@/services/aiTradingService';

const AiTradingContext = createContext<AiTradingContextType | undefined>(undefined);

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addTradeToAccount } = useTradingAccounts();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [botAccountConnections, setBotAccountConnections] = useState<Record<string, string>>({});
  const [activeBots, setActiveBots] = useState<Record<string, { lastTrade?: string; status: 'connected' | 'disconnected' }>>({});
  const [strategies, setStrategies] = useState<AITradingStrategy[]>(AVAILABLE_STRATEGIES);

  const connectBotToAccount = (botId: string, accountId: string) => {
    setBotAccountConnections(prev => ({
      ...prev,
      [botId]: accountId
    }));

    setActiveBots(prev => ({
      ...prev,
      [botId]: { status: 'connected' }
    }));

    toast({
      title: "Bot Connected",
      description: `Trading bot has been connected to account`,
    });
  };

  const disconnectBot = (botId: string) => {
    setBotAccountConnections(prev => {
      const newConnections = { ...prev };
      delete newConnections[botId];
      return newConnections;
    });

    setActiveBots(prev => ({
      ...prev,
      [botId]: { status: 'disconnected' }
    }));

    toast({
      title: "Bot Disconnected",
      description: `Trading bot has been disconnected from account`,
    });
  };

  const getConnectedAccount = (botId: string) => {
    return botAccountConnections[botId];
  };

  const executeAiTrade = (params: {
    botId: string;
    strategyId: string;
    accountId: string;
    coinId: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
  }): boolean => {
    try {
      setIsProcessing(true);
      const { botId, strategyId, accountId, coinId, type, amount, price } = params;
      
      // Find strategy details
      const strategy = strategies.find(s => s.id === strategyId);
      if (!strategy) {
        throw new Error(`Strategy ${strategyId} not found`);
      }

      // Create trade object
      const trade: Trade = {
        id: `ai-trade-${Date.now()}`,
        coinId,
        coinName: coinId.charAt(0).toUpperCase() + coinId.slice(1), // Capitalize first letter
        coinSymbol: coinId.substring(0, 3).toUpperCase(),
        type,
        amount,
        price,
        totalValue: amount * price,
        timestamp: new Date().toISOString(),
        currency: "USD",
        botGenerated: true,
        strategyId
      };

      // Add trade to account
      addTradeToAccount(accountId, trade);
      
      // Update bot's last trade
      setActiveBots(prev => ({
        ...prev,
        [botId]: { 
          ...prev[botId],
          lastTrade: new Date().toISOString(), 
          status: 'connected'
        }
      }));

      toast({
        title: "AI Trade Executed",
        description: `${type.toUpperCase()} ${amount} ${trade.coinSymbol} at $${price.toLocaleString()}`
      });

      return true;
    } catch (error) {
      console.error("Error executing AI trade:", error);
      toast({
        title: "Trade Error",
        description: "Failed to execute AI trade",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const addStrategy = (strategy: AITradingStrategy) => {
    setStrategies(prev => [...prev, strategy]);
    toast({
      title: "Strategy Added",
      description: `${strategy.name} has been added to your strategies`
    });
  };

  const value: AiTradingContextType = {
    executeAiTrade,
    getConnectedAccount,
    isProcessing,
    connectBotToAccount,
    disconnectBot,
    activeBots,
    addStrategy
  };

  return (
    <AiTradingContext.Provider value={value}>
      {children}
    </AiTradingContext.Provider>
  );
};

export const useAiTrading = () => {
  const context = useContext(AiTradingContext);
  if (context === undefined) {
    throw new Error('useAiTrading must be used within an AiTradingProvider');
  }
  return context;
};
