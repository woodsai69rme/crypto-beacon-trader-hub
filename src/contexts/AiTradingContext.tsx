
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { TradingAccount, Trade } from "@/types/trading";

type AiModelStatus = "idle" | "training" | "running" | "error";
type AiStrategy = "traditional" | "ai-predictive" | "hybrid" | "trend-following" | "mean-reversion" | 
                 "breakout" | "sentiment" | "machine-learning" | "multi-timeframe";

interface AiModel {
  id: string;
  name: string;
  strategy: AiStrategy;
  status: AiModelStatus;
  lastTrained: Date | null;
  accuracy: number;
  trainingProgress?: number;
  description: string;
}

type TradeSignal = {
  coin: string;
  action: "buy" | "sell" | "hold";
  price: number;
  confidence: number;
  time: Date;
  reason: string;
};

interface AiTradingContextType {
  models: AiModel[];
  activeModel: AiModel | null;
  isLoading: boolean;
  error: string | null;
  signals: TradeSignal[];
  automationEnabled: boolean;
  connectedAccounts: string[];
  tradingSettings: {
    maxTradeSize: number;
    stopLossPercentage: number;
    takeProfitPercentage: number;
    riskLevel: "low" | "medium" | "high";
  };
  createModel: (name: string, strategy: AiStrategy, description: string) => Promise<void>;
  deleteModel: (id: string) => Promise<void>;
  trainModel: (id: string) => Promise<void>;
  stopModel: (id: string) => Promise<void>;
  setActiveModel: (id: string | null) => void;
  toggleAutomation: () => void;
  updateTradingSettings: (settings: Partial<AiTradingContextType["tradingSettings"]>) => void;
  executeAiTrade: (signal: TradeSignal, account: TradingAccount) => Promise<Trade | null>;
  getConnectedAccount: (accountId: string) => TradingAccount | null;
  connectBotToAccount: (modelId: string, accountId: string) => void;
  disconnectBot: (modelId: string) => void;
  isProcessing: boolean;
  addStrategy?: (strategy: AiStrategy, name: string, description: string) => Promise<void>;
}

const defaultTradingSettings = {
  maxTradeSize: 1000,
  stopLossPercentage: 5,
  takeProfitPercentage: 10,
  riskLevel: "medium" as const
};

const initialModels: AiModel[] = [
  {
    id: "ai-model-1",
    name: "Trend Analyzer",
    strategy: "trend-following",
    status: "idle",
    lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    accuracy: 0.72,
    description: "Long-term trend detection model based on price momentum indicators"
  },
  {
    id: "ai-model-2",
    name: "Market Predictor",
    strategy: "ai-predictive",
    status: "idle",
    lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    accuracy: 0.68,
    description: "Short-term price prediction using machine learning algorithms"
  },
  {
    id: "ai-model-3",
    name: "Sentiment Analyzer",
    strategy: "sentiment",
    status: "error",
    lastTrained: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    accuracy: 0.60,
    description: "News and social media sentiment analysis for market trends"
  }
];

const initialSignals: TradeSignal[] = [
  {
    coin: "BTC",
    action: "buy",
    price: 45000,
    confidence: 0.78,
    time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    reason: "Strong upward momentum detected"
  },
  {
    coin: "ETH",
    action: "hold",
    price: 2800,
    confidence: 0.65,
    time: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    reason: "Market consolidation period"
  },
  {
    coin: "SOL",
    action: "sell",
    price: 120,
    confidence: 0.82,
    time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    reason: "Bearish divergence on RSI"
  }
];

// Sample trading accounts for demo (with corrected TradingAccount type)
const sampleTradingAccounts: TradingAccount[] = [
  {
    id: "account-1",
    name: "Main Trading Account",
    balance: 10000,
    initialBalance: 10000,
    currency: "USD",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    trades: []
  },
  {
    id: "account-2",
    name: "Demo Account",
    balance: 50000,
    initialBalance: 50000,
    currency: "USD",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    trades: []
  }
];

const AiTradingContext = createContext<AiTradingContextType | undefined>(undefined);

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [models, setModels] = useState<AiModel[]>(initialModels);
  const [activeModel, setActiveModelState] = useState<AiModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signals, setSignals] = useState<TradeSignal[]>(initialSignals);
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [tradingSettings, setTradingSettings] = useState(defaultTradingSettings);
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>(sampleTradingAccounts);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Generate new signals periodically when automation is enabled
  useEffect(() => {
    if (!automationEnabled || !activeModel || activeModel.status !== "running") return;
    
    const interval = setInterval(() => {
      // Only generate new signals sometimes
      if (Math.random() > 0.7) {
        const coins = ["BTC", "ETH", "SOL", "ADA", "BNB", "XRP"];
        const actions: Array<"buy" | "sell" | "hold"> = ["buy", "sell", "hold"];
        const reasons = [
          "Bullish divergence detected",
          "Bearish pattern forming",
          "Support level holding strong",
          "Resistance broken with volume",
          "Market sentiment shift",
          "News impact analysis"
        ];
        
        const newSignal: TradeSignal = {
          coin: coins[Math.floor(Math.random() * coins.length)],
          action: actions[Math.floor(Math.random() * actions.length)],
          price: 1000 + Math.random() * 50000,
          confidence: 0.5 + Math.random() * 0.4,
          time: new Date(),
          reason: reasons[Math.floor(Math.random() * reasons.length)]
        };
        
        setSignals(prev => [newSignal, ...prev].slice(0, 20));
        
        // Notify user of high confidence signals
        if (newSignal.confidence > 0.8 && newSignal.action !== "hold") {
          toast({
            title: `${newSignal.action.toUpperCase()} ${newSignal.coin} Signal`,
            description: `${newSignal.reason} (${Math.floor(newSignal.confidence * 100)}% confidence)`,
            variant: newSignal.action === "buy" ? "default" : "destructive"
          });
          
          // If automation is enabled and an account is connected, auto-trade
          if (automationEnabled && connectedAccounts.length > 0) {
            const account = getConnectedAccount(connectedAccounts[0]);
            if (account) {
              executeAiTrade(newSignal, account);
            }
          }
        }
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [automationEnabled, activeModel]);
  
  const createModel = useCallback(async (name: string, strategy: AiStrategy, description: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newModel: AiModel = {
        id: `model-${Date.now()}`,
        name,
        strategy,
        status: "idle",
        lastTrained: null,
        accuracy: 0,
        description
      };
      
      setModels(prev => [...prev, newModel]);
      toast({
        title: "Model Created",
        description: `${name} has been created successfully.`
      });
    } catch (err) {
      setError("Failed to create model");
      toast({
        title: "Error",
        description: "Failed to create AI trading model",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const deleteModel = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setModels(prev => prev.filter(model => model.id !== id));
      
      if (activeModel?.id === id) {
        setActiveModelState(null);
      }
      
      toast({
        title: "Model Deleted",
        description: "The AI trading model has been deleted"
      });
    } catch (err) {
      setError("Failed to delete model");
      toast({
        title: "Error",
        description: "Failed to delete AI trading model",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeModel]);
  
  const trainModel = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the model to update
      const modelToTrain = models.find(model => model.id === id);
      if (!modelToTrain) {
        throw new Error("Model not found");
      }
      
      // Update the model status
      setModels(prev => prev.map(model => 
        model.id === id ? { ...model, status: "training", trainingProgress: 0 } : model
      ));
      
      // Simulate training progress
      for (let i = 0; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setModels(prev => prev.map(model => 
          model.id === id ? { ...model, trainingProgress: i * 10 } : model
        ));
      }
      
      // Update with completed training
      const accuracy = 0.6 + Math.random() * 0.3; // Random accuracy between 60% and 90%
      
      setModels(prev => prev.map(model => 
        model.id === id ? {
          ...model,
          status: "idle",
          lastTrained: new Date(),
          accuracy,
          trainingProgress: undefined
        } : model
      ));
      
      toast({
        title: "Training Complete",
        description: `Model trained with ${Math.floor(accuracy * 100)}% accuracy`
      });
    } catch (err) {
      setError("Failed to train model");
      setModels(prev => prev.map(model => 
        model.id === id ? { ...model, status: "error", trainingProgress: undefined } : model
      ));
      toast({
        title: "Error",
        description: "Failed to train AI model",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [models]);
  
  const stopModel = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setModels(prev => prev.map(model => 
        model.id === id ? { ...model, status: "idle" } : model
      ));
      
      toast({
        title: "Model Stopped",
        description: "The AI trading model has been stopped"
      });
    } catch (err) {
      setError("Failed to stop model");
      toast({
        title: "Error",
        description: "Failed to stop AI trading model",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const setActiveModel = useCallback((id: string | null) => {
    if (id === null) {
      setActiveModelState(null);
      return;
    }
    
    const model = models.find(model => model.id === id);
    if (model) {
      setActiveModelState(model);
      
      // Start the model
      setModels(prev => prev.map(m => 
        m.id === id ? { ...m, status: "running" } : m
      ));
      
      toast({
        title: "Model Activated",
        description: `${model.name} is now active`
      });
    }
  }, [models]);
  
  const toggleAutomation = useCallback(() => {
    setAutomationEnabled(prev => {
      const newValue = !prev;
      
      toast({
        title: newValue ? "Automation Enabled" : "Automation Disabled",
        description: newValue ? 
          "AI will automatically execute trades based on signals" : 
          "Automatic trading is now disabled"
      });
      
      return newValue;
    });
  }, []);
  
  const updateTradingSettings = useCallback((settings: Partial<typeof tradingSettings>) => {
    setTradingSettings(prev => ({
      ...prev,
      ...settings
    }));
    
    toast({
      title: "Settings Updated",
      description: "Trading settings have been updated"
    });
  }, []);
  
  const executeAiTrade = useCallback(async (signal: TradeSignal, account: TradingAccount): Promise<Trade | null> => {
    if (isProcessing) {
      toast({
        title: "Processing",
        description: "Another trade is currently processing",
        variant: "destructive"
      });
      return null;
    }
    
    setIsProcessing(true);
    
    try {
      // Check if there's enough balance
      const tradeSize = Math.min(
        account.balance * 0.1, // Max 10% of account
        tradingSettings.maxTradeSize
      );
      
      if (tradeSize <= 0 || (signal.action === "buy" && account.balance < tradeSize)) {
        toast({
          title: "Insufficient Balance",
          description: "Not enough balance to execute this trade",
          variant: "destructive"
        });
        return null;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const tradeId = `trade-${Date.now()}`;
      const trade: Trade = {
        id: tradeId,
        type: signal.action === "buy" ? "buy" : "sell",
        coinId: signal.coin,
        amount: tradeSize / signal.price,
        price: signal.price,
        timestamp: new Date().toISOString(),
        currency: "USD" as const,
        coinName: signal.coin,
        coinSymbol: signal.coin,
        totalValue: tradeSize,
        fees: tradeSize * 0.001 // 0.1% fee
      };
      
      // Update the account
      setTradingAccounts(prev => prev.map(acc => {
        if (acc.id === account.id) {
          const trades = [...acc.trades, trade];
          const balance = signal.action === "buy" ? 
            acc.balance - tradeSize - (trade.fees || 0) :
            acc.balance + tradeSize - (trade.fees || 0);
          
          return {
            ...acc,
            balance,
            trades,
          };
        }
        return acc;
      }));
      
      toast({
        title: "Trade Executed",
        description: `${signal.action === "buy" ? "Bought" : "Sold"} ${trade.amount.toFixed(6)} ${signal.coin} at $${signal.price.toFixed(2)}`
      });
      
      return trade;
    } catch (error) {
      console.error("Error executing trade:", error);
      toast({
        title: "Trade Failed",
        description: "Failed to execute the trade",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, tradingSettings]);
  
  // Get trading account by ID
  const getConnectedAccount = useCallback((accountId: string): TradingAccount | null => {
    return tradingAccounts.find(account => account.id === accountId) || null;
  }, [tradingAccounts]);
  
  // Connect bot to trading account
  const connectBotToAccount = useCallback((modelId: string, accountId: string) => {
    const model = models.find(m => m.id === modelId);
    const account = tradingAccounts.find(acc => acc.id === accountId);
    
    if (!model || !account) {
      toast({
        title: "Connection Error",
        description: "Could not find the specified model or account",
        variant: "destructive"
      });
      return;
    }
    
    setConnectedAccounts(prev => {
      if (prev.includes(accountId)) return prev;
      return [...prev, accountId];
    });
    
    toast({
      title: "Connection Established",
      description: `${model.name} is now connected to ${account.name}`
    });
  }, [models, tradingAccounts]);
  
  // Disconnect bot from trading account
  const disconnectBot = useCallback((modelId: string) => {
    const model = models.find(m => m.id === modelId);
    
    if (!model) {
      toast({
        title: "Disconnection Error",
        description: "Could not find the specified model",
        variant: "destructive"
      });
      return;
    }
    
    setConnectedAccounts([]);
    
    toast({
      title: "Disconnected",
      description: `${model.name} is now disconnected from all accounts`
    });
  }, [models]);

  // Add custom strategy
  const addStrategy = useCallback(async (strategy: AiStrategy, name: string, description: string) => {
    return createModel(name, strategy, description);
  }, [createModel]);
  
  return (
    <AiTradingContext.Provider
      value={{
        models,
        activeModel,
        isLoading,
        error,
        signals,
        automationEnabled,
        connectedAccounts,
        tradingSettings,
        createModel,
        deleteModel,
        trainModel,
        stopModel,
        setActiveModel,
        toggleAutomation,
        updateTradingSettings,
        executeAiTrade,
        getConnectedAccount,
        connectBotToAccount,
        disconnectBot,
        isProcessing,
        addStrategy
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
