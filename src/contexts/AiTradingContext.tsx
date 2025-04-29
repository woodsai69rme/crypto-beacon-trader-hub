
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { AITradingStrategy, Trade } from "@/types/trading";
import { AVAILABLE_STRATEGIES, analyzeMarketConditions, executeAITrade } from "@/services/aiTradingService";

interface AiTradingContextType {
  availableStrategies: AITradingStrategy[];
  activeStrategy: AITradingStrategy | null;
  setActiveStrategy: (strategy: AITradingStrategy | null) => void;
  isProcessing: boolean;
  connectBotToAccount: (botId: string, accountId: string) => void;
  disconnectBot: (botId: string) => void;
  getConnectedAccount: (botId: string) => string | null;
  executeAiTrade: (botId: string, accountId: string, coinData: any) => Promise<Trade | null>;
  connectedAccounts: Record<string, string>; // botId -> accountId
}

// Create a context
const AiTradingContext = createContext<AiTradingContextType>({
  availableStrategies: [],
  activeStrategy: null,
  setActiveStrategy: () => {},
  isProcessing: false,
  connectBotToAccount: () => {},
  disconnectBot: () => {},
  getConnectedAccount: () => null,
  executeAiTrade: async () => null,
  connectedAccounts: {},
});

// Create a provider
export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableStrategies, setAvailableStrategies] = useState<AITradingStrategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<AITradingStrategy | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('ai-connected-accounts');
    return saved ? JSON.parse(saved) : {};
  });
  
  useEffect(() => {
    setAvailableStrategies(AVAILABLE_STRATEGIES);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('ai-connected-accounts', JSON.stringify(connectedAccounts));
  }, [connectedAccounts]);
  
  const connectBotToAccount = (botId: string, accountId: string) => {
    setConnectedAccounts(prev => {
      const updated = { ...prev, [botId]: accountId };
      return updated;
    });
    toast({
      title: "Bot Connected",
      description: `Trading bot has been connected to account ${accountId}`,
    });
  };
  
  const disconnectBot = (botId: string) => {
    setConnectedAccounts(prev => {
      const updated = { ...prev };
      delete updated[botId];
      return updated;
    });
    toast({
      title: "Bot Disconnected",
      description: "Trading bot has been disconnected from account",
    });
  };
  
  const getConnectedAccount = (botId: string): string | null => {
    return connectedAccounts[botId] || null;
  };
  
  const executeAiTrade = async (botId: string, accountId: string, coinData: any): Promise<Trade | null> => {
    try {
      setIsProcessing(true);
      
      // Get strategy for this bot
      const strategy = availableStrategies.find(s => s.id === botId);
      if (!strategy) {
        throw new Error("Strategy not found");
      }
      
      // Get account data (in a real application this would fetch the actual account)
      const mockAccount = {
        id: accountId,
        balance: 10000,
        initialBalance: 10000,
        name: "Demo Account",
        trades: [],
        currency: "USD",
        createdAt: new Date().toISOString(),
      };
      
      // Analyze market using AI
      const analysis = await analyzeMarketConditions(
        strategy, 
        coinData.id, 
        [] // Empty array for historical data in this simplified version
      );
      
      // Execute trade based on analysis
      const trade = await executeAITrade(strategy, mockAccount, coinData, analysis);
      
      if (trade) {
        toast({
          title: "AI Trade Executed",
          description: `${trade.type.toUpperCase()} ${trade.amount} ${trade.coinSymbol} at $${trade.price}`,
        });
      }
      
      return trade;
    } catch (error) {
      console.error("Error executing AI trade:", error);
      toast({
        title: "AI Trade Error",
        description: "Failed to execute the AI trade",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <AiTradingContext.Provider 
      value={{ 
        availableStrategies,
        activeStrategy, 
        setActiveStrategy,
        isProcessing,
        connectBotToAccount,
        disconnectBot,
        getConnectedAccount,
        executeAiTrade,
        connectedAccounts
      }}
    >
      {children}
    </AiTradingContext.Provider>
  );
};

// Create a hook to use the context
export const useAiTrading = () => useContext(AiTradingContext);
