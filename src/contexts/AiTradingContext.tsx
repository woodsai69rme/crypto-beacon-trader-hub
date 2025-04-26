
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTradingAccounts } from '@/hooks/use-trading-accounts';
import { toast } from "@/components/ui/use-toast";
import { Trade } from '@/types/trading';

interface AiTradeRequest {
  botId: string;
  strategyId: string;
  accountId: string;
  coinId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
}

interface AiTradingContextType {
  connectBotToAccount: (botId: string, accountId: string) => void;
  disconnectBot: (botId: string) => void;
  getConnectedAccount: (botId: string) => string | null;
  executeAiTrade: (request: AiTradeRequest) => boolean;
  activeBots: Record<string, { accountId: string, lastTrade?: Date }>;
  isProcessing: boolean;
}

const AiTradingContext = createContext<AiTradingContextType>({
  connectBotToAccount: () => {},
  disconnectBot: () => {},
  getConnectedAccount: () => null,
  executeAiTrade: () => false,
  activeBots: {},
  isProcessing: false,
});

export const useAiTrading = () => useContext(AiTradingContext);

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBots, setActiveBots] = useState<Record<string, { accountId: string, lastTrade?: Date }>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const { addTradeToAccount, accounts } = useTradingAccounts();

  // Connect a bot to a trading account
  const connectBotToAccount = (botId: string, accountId: string) => {
    setActiveBots(prev => ({
      ...prev,
      [botId]: { accountId }
    }));
    
    toast({
      title: "Bot Connected",
      description: `AI Trading Bot successfully connected to account ${accounts.find(a => a.id === accountId)?.name || accountId}`,
    });
  };

  // Disconnect a bot from its trading account
  const disconnectBot = (botId: string) => {
    if (!activeBots[botId]) return;
    
    const accountId = activeBots[botId].accountId;
    setActiveBots(prev => {
      const newState = { ...prev };
      delete newState[botId];
      return newState;
    });
    
    toast({
      title: "Bot Disconnected",
      description: `AI Trading Bot disconnected from account ${accounts.find(a => a.id === accountId)?.name || accountId}`,
    });
  };

  // Get the account ID connected to a bot
  const getConnectedAccount = (botId: string): string | null => {
    return activeBots[botId]?.accountId || null;
  };

  // Execute a trade from an AI bot
  const executeAiTrade = (request: AiTradeRequest): boolean => {
    const { botId, accountId, coinId, type, amount, price, strategyId } = request;
    
    // Validate the bot is connected to this account
    if (activeBots[botId]?.accountId !== accountId) {
      toast({
        title: "Trade Failed",
        description: "Bot is not connected to this trading account",
        variant: "destructive",
      });
      return false;
    }
    
    setIsProcessing(true);
    
    try {
      // Create the trade object
      const trade: Trade = {
        id: `bot-${Date.now()}`,
        coinId,
        coinName: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        coinSymbol: coinId.toUpperCase().slice(0, 4),
        type,
        amount,
        price,
        totalValue: price * amount,
        timestamp: new Date().toISOString(),
        currency: 'USD',
        botGenerated: true,
        strategyId
      };
      
      // Add the trade to the account
      addTradeToAccount(accountId, trade);
      
      // Update the last trade timestamp for this bot
      setActiveBots(prev => ({
        ...prev,
        [botId]: { ...prev[botId], lastTrade: new Date() }
      }));
      
      toast({
        title: "AI Bot Trade Executed",
        description: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${amount} ${coinId.toUpperCase()} via AI strategy`,
      });
      
      return true;
    } catch (error) {
      console.error("Error executing AI trade:", error);
      toast({
        title: "AI Trade Failed",
        description: "Could not execute the AI trade due to an error",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AiTradingContext.Provider 
      value={{
        connectBotToAccount,
        disconnectBot,
        getConnectedAccount,
        executeAiTrade,
        activeBots,
        isProcessing
      }}
    >
      {children}
    </AiTradingContext.Provider>
  );
};

export default AiTradingContext;
