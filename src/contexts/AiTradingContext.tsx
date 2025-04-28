
import React, { createContext, useContext, useState } from 'react';
import { executeAITrade } from '@/services/aiTradingService';
import { toast } from '@/components/ui/use-toast';
import { useTradingAccounts } from '@/hooks/use-trading-accounts';
import { AITradingStrategy, AiTradingContextType } from '@/types/trading';
import { AVAILABLE_STRATEGIES } from '@/services/aiTradingService';

interface AiTradingProviderProps {
  children: React.ReactNode;
}

// Create context with default values
const AiTradingContext = createContext<AiTradingContextType>({
  executeAiTrade: () => false,
  getConnectedAccount: () => undefined,
  isProcessing: false,
  connectBotToAccount: () => {},
  disconnectBot: () => {},
  activeBots: {}
});

export const useAiTrading = () => useContext(AiTradingContext);

export const AiTradingProvider: React.FC<AiTradingProviderProps> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [botConnections, setBotConnections] = useState<Record<string, string>>({});
  const [activeBots, setActiveBots] = useState<Record<string, {
    lastTrade?: string;
    status: 'connected' | 'disconnected';
  }>>({});
  
  const { accounts, addTradeToAccount } = useTradingAccounts();
  
  const connectBotToAccount = (botId: string, accountId: string) => {
    setBotConnections(prev => ({
      ...prev,
      [botId]: accountId
    }));
    
    setActiveBots(prev => ({
      ...prev,
      [botId]: {
        ...(prev[botId] || {}),
        status: 'connected'
      }
    }));
  };
  
  const disconnectBot = (botId: string) => {
    setBotConnections(prev => {
      const newConnections = { ...prev };
      delete newConnections[botId];
      return newConnections;
    });
    
    setActiveBots(prev => ({
      ...prev,
      [botId]: {
        ...(prev[botId] || {}),
        status: 'disconnected'
      }
    }));
  };
  
  const getConnectedAccount = (botId: string): string | undefined => {
    return botConnections[botId];
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
      const account = accounts.find(acc => acc.id === accountId);
      
      if (!account) {
        toast({
          title: "Trade Error",
          description: "Account not found",
          variant: "destructive"
        });
        return false;
      }
      
      if (type === 'buy' && account.balance < amount * price) {
        toast({
          title: "Insufficient Balance",
          description: "Cannot execute buy trade due to insufficient funds",
          variant: "destructive"
        });
        return false;
      }
      
      const strategy = AVAILABLE_STRATEGIES.find(s => s.id === strategyId);
      if (!strategy) {
        toast({
          title: "Trade Error",
          description: "Strategy not found",
          variant: "destructive"
        });
        return false;
      }
      
      const coinData = {
        id: coinId,
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        symbol: coinId.substring(0, 3).toUpperCase(),
        price: price
      };
      
      // Execute the trade
      const trade = {
        id: `ai-trade-${Date.now()}`,
        coinId: coinData.id,
        coinName: coinData.name,
        coinSymbol: coinData.symbol,
        type,
        amount,
        price: coinData.price,
        totalValue: amount * coinData.price,
        timestamp: new Date().toISOString(),
        currency: "USD",
        botGenerated: true,
        strategyId
      };
      
      addTradeToAccount(accountId, trade);
      
      // Update bot status
      setActiveBots(prev => ({
        ...prev,
        [botId]: {
          ...prev[botId],
          lastTrade: `${type} ${amount} ${coinData.symbol} at $${coinData.price}`
        }
      }));
      
      toast({
        title: "AI Trade Executed",
        description: `${type.toUpperCase()} ${amount} ${coinData.symbol} at $${coinData.price}`,
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
  
  return (
    <AiTradingContext.Provider value={{
      executeAiTrade,
      getConnectedAccount,
      isProcessing,
      connectBotToAccount,
      disconnectBot,
      activeBots
    }}>
      {children}
    </AiTradingContext.Provider>
  );
};

export default AiTradingProvider;
