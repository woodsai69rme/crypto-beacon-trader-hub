
import React, { createContext, useContext, useState } from "react";

export type TradingStrategyType = 
  "traditional" | 
  "ai-predictive" | 
  "hybrid" | 
  "trend-following" | 
  "mean-reversion" | 
  "breakout" | 
  "sentiment" | 
  "machine-learning" | 
  "multi-timeframe";

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  type: TradingStrategyType;
  risk: "low" | "medium" | "high";
  timeframe: "short" | "medium" | "long";
  performance: {
    last30Days: number;
    last90Days: number;
    lastYear: number;
  };
  creator: string;
  isActive: boolean;
  configuration?: Record<string, any>;
}

export interface AiTradingContextType {
  strategies: TradingStrategy[];
  activeStrategy: TradingStrategy | null;
  isConnected: boolean;
  isProcessing: boolean;
  performanceData: any[];
  aiRecommendations: any[];
  connectedAccount: string | null;
  addStrategy: (strategy: TradingStrategy) => void;
  removeStrategy: (id: string) => void;
  setActiveStrategy: (id: string) => void;
  toggleConnection: () => void;
  executeAiTrade: (params?: any) => Promise<boolean>;
  getRecommendations: () => Promise<any[]>;
  updateStrategyConfig: (id: string, config: any) => void;
  getConnectedAccount: () => string | null;
  connectBotToAccount: (botId: string, accountId: string) => void;
  disconnectBot: (botId: string) => void;
}

const initialState: AiTradingContextType = {
  strategies: [],
  activeStrategy: null,
  isConnected: false,
  isProcessing: false,
  performanceData: [],
  aiRecommendations: [],
  connectedAccount: null,
  addStrategy: () => {},
  removeStrategy: () => {},
  setActiveStrategy: () => {},
  toggleConnection: () => {},
  executeAiTrade: async () => false,
  getRecommendations: async () => [],
  updateStrategyConfig: () => {},
  getConnectedAccount: () => null,
  connectBotToAccount: () => {},
  disconnectBot: () => {},
};

const AiTradingContext = createContext<AiTradingContextType>(initialState);

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [strategies, setStrategies] = useState<TradingStrategy[]>([
    {
      id: "1",
      name: "AI-Powered Trend Following",
      description: "Uses machine learning to identify and follow market trends with adaptive parameters",
      type: "trend-following",
      risk: "medium",
      timeframe: "medium",
      performance: {
        last30Days: 8.4,
        last90Days: 14.2,
        lastYear: 32.7,
      },
      creator: "System",
      isActive: true,
    },
    {
      id: "2",
      name: "Mean Reversion Oscillator",
      description: "Identifies overbought and oversold conditions using AI-enhanced indicators",
      type: "mean-reversion",
      risk: "medium",
      timeframe: "short",
      performance: {
        last30Days: 5.1,
        last90Days: 11.8,
        lastYear: 24.3,
      },
      creator: "System",
      isActive: false,
    },
    {
      id: "3",
      name: "Smart Breakout Detection",
      description: "Uses pattern recognition to identify genuine breakouts and filter false signals",
      type: "breakout",
      risk: "high",
      timeframe: "short",
      performance: {
        last30Days: 12.5,
        last90Days: 18.6,
        lastYear: 36.9,
      },
      creator: "System",
      isActive: false,
    },
  ]);
  const [activeStrategy, setActiveStrategyState] = useState<TradingStrategy | null>(strategies[0]);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  const [performanceData] = useState([
    { date: "2023-01", return: 3.2 },
    { date: "2023-02", return: -1.8 },
    { date: "2023-03", return: 5.4 },
    { date: "2023-04", return: 2.1 },
    { date: "2023-05", return: 4.7 },
    { date: "2023-06", return: -2.3 },
    { date: "2023-07", return: 6.8 },
    { date: "2023-08", return: 3.5 },
    { date: "2023-09", return: -1.2 },
    { date: "2023-10", return: 4.9 },
    { date: "2023-11", return: 7.6 },
    { date: "2023-12", return: 3.3 },
  ]);

  const [aiRecommendations] = useState([
    {
      coin: "BTC",
      action: "Buy",
      confidence: 87,
      reason: "Positive sentiment, price consolidation, increasing volume",
    },
    {
      coin: "ETH",
      action: "Hold",
      confidence: 72,
      reason: "Technical resistance at $3600, moderate trading volume",
    },
    {
      coin: "SOL",
      action: "Buy",
      confidence: 81,
      reason: "Breaking key resistance with increasing volume and network activity",
    },
  ]);

  const addStrategy = (strategy: TradingStrategy) => {
    setStrategies((prev) => [...prev, strategy]);
  };

  const removeStrategy = (id: string) => {
    setStrategies((prev) => prev.filter((s) => s.id !== id));
    if (activeStrategy?.id === id) {
      setActiveStrategyState(null);
    }
  };

  const setActiveStrategy = (id: string) => {
    const strategy = strategies.find((s) => s.id === id);
    setActiveStrategyState(strategy || null);
  };

  const toggleConnection = () => {
    setIsConnected((prev) => !prev);
  };

  const executeAiTrade = async (params?: any): Promise<boolean> => {
    setIsProcessing(true);
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    return true;
  };

  const getRecommendations = async (): Promise<any[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return aiRecommendations;
  };

  const updateStrategyConfig = (id: string, config: any) => {
    setStrategies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, configuration: config } : s))
    );
  };

  const getConnectedAccount = (): string | null => {
    return connectedAccount;
  };

  const connectBotToAccount = (botId: string, accountId: string) => {
    console.log(`Connecting bot ${botId} to account ${accountId}`);
    setConnectedAccount(accountId);
  };

  const disconnectBot = (botId: string) => {
    console.log(`Disconnecting bot ${botId}`);
    setConnectedAccount(null);
  };

  return (
    <AiTradingContext.Provider
      value={{
        strategies,
        activeStrategy,
        isConnected,
        isProcessing,
        performanceData,
        aiRecommendations,
        connectedAccount,
        addStrategy,
        removeStrategy,
        setActiveStrategy,
        toggleConnection,
        executeAiTrade,
        getRecommendations,
        updateStrategyConfig,
        getConnectedAccount,
        connectBotToAccount,
        disconnectBot,
      }}
    >
      {children}
    </AiTradingContext.Provider>
  );
};

export const useAiTrading = () => {
  const context = useContext(AiTradingContext);
  if (context === undefined) {
    throw new Error("useAiTrading must be used within an AiTradingProvider");
  }
  return context;
};
