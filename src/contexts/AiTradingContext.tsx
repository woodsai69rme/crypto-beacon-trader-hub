
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AITradingBot, 
  AITradingStrategy, 
  TradingAccount,
  LocalModel,
  PaperTradingConfig
} from '@/types/trading';

// Mock data for strategies and bots
const DEFAULT_STRATEGIES: AITradingStrategy[] = [
  {
    id: 'trend-following',
    name: 'Trend Following',
    description: 'A strategy that follows the market trend, buying in an uptrend and selling in a downtrend',
    type: 'trend',
    riskLevel: 'medium',
    parameters: {
      lookbackPeriod: 14,
      entryThreshold: 0.05,
      exitThreshold: -0.03,
      stopLoss: 0.1
    },
    indicators: ['MA', 'MACD'],
    performance: {
      accuracy: 68,
      returns: 12.5,
      sharpeRatio: 1.8,
      maxDrawdown: 15
    }
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'A strategy that assumes prices will revert to their historical average',
    type: 'mean-reversion',
    riskLevel: 'low',
    parameters: {
      meanPeriod: 20,
      entryDeviation: 2,
      exitDeviation: 0.5,
      stopLoss: 0.15
    },
    indicators: ['RSI', 'Bollinger Bands'],
    performance: {
      accuracy: 72,
      returns: 8.2,
      sharpeRatio: 1.5,
      maxDrawdown: 12
    }
  }
];

const DEFAULT_BOTS: AITradingBot[] = [
  {
    id: 'bot-1',
    name: 'BTC Trend Follower',
    description: 'Bitcoin trend following strategy',
    strategy: DEFAULT_STRATEGIES[0],
    strategyId: DEFAULT_STRATEGIES[0].id,
    strategyName: DEFAULT_STRATEGIES[0].name,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastRun: new Date().toISOString(),
    model: 'DeepSeek R1',
    asset: 'bitcoin',
    accuracy: 68,
    successRate: 0.68,
    trades: 145,
    totalTrades: 145,
    performance: {
      winRate: 0.68,
      trades: 145,
      profit: 2350
    },
    profitLoss: 2350
  },
  {
    id: 'bot-2',
    name: 'ETH Mean Reverter',
    description: 'Ethereum mean reversion strategy',
    strategy: DEFAULT_STRATEGIES[1],
    strategyId: DEFAULT_STRATEGIES[1].id,
    strategyName: DEFAULT_STRATEGIES[1].name,
    status: 'paused',
    createdAt: new Date().toISOString(),
    lastRun: new Date().toISOString(),
    model: 'GPT-4',
    asset: 'ethereum',
    accuracy: 72,
    successRate: 0.72,
    trades: 120,
    totalTrades: 120,
    performance: {
      winRate: 0.72,
      trades: 120,
      profit: 1850
    },
    profitLoss: 1850
  }
];

// Default values for the context
const DEFAULT_TRADING_ACCOUNT: TradingAccount = {
  id: 'ai-trading-account',
  name: 'AI Trading Account',
  balance: 10000,
  initialBalance: 10000,
  trades: [],
  currency: 'USD',
  createdAt: new Date().toISOString(),
  type: 'paper',
  address: '0x0000000000000000000000000000000000000000',
  network: 'paper',
  assets: []
};

const DEFAULT_CONFIG: PaperTradingConfig = {
  enabled: true,
  initialBalance: 10000,
  currency: 'USD',
  slippageModel: 'simple',
  slippagePercentage: 0.1,
  maxTradeSize: 1000,
  includeFees: true,
  feePercentage: 0.1
};

interface AiTradingContextType {
  strategies: AITradingStrategy[];
  bots: AITradingBot[];
  account: TradingAccount;
  paperTradingConfig: PaperTradingConfig;
  selectedStrategy: AITradingStrategy | null;
  selectedBot: AITradingBot | null;
  localModels: LocalModel[];
  createBot: (name: string, strategyId: string, asset: string, model: string) => AITradingBot;
  toggleBotStatus: (id: string) => void;
  deleteBot: (id: string) => void;
  updateBot: (id: string, updates: Partial<AITradingBot>) => void;
  selectStrategy: (id: string) => void;
  selectBot: (id: string) => void;
  getAvailableModels: () => string[];
}

// Create the context
const AiTradingContext = createContext<AiTradingContextType>({
  strategies: DEFAULT_STRATEGIES,
  bots: DEFAULT_BOTS,
  account: DEFAULT_TRADING_ACCOUNT,
  paperTradingConfig: DEFAULT_CONFIG,
  selectedStrategy: null,
  selectedBot: null,
  localModels: [],
  createBot: () => DEFAULT_BOTS[0],
  toggleBotStatus: () => {},
  deleteBot: () => {},
  updateBot: () => {},
  selectStrategy: () => {},
  selectBot: () => {},
  getAvailableModels: () => []
});

// Create the provider component
export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [strategies, setStrategies] = useState<AITradingStrategy[]>(DEFAULT_STRATEGIES);
  const [bots, setBots] = useState<AITradingBot[]>(DEFAULT_BOTS);
  const [account, setAccount] = useState<TradingAccount>(DEFAULT_TRADING_ACCOUNT);
  const [paperTradingConfig, setPaperTradingConfig] = useState<PaperTradingConfig>(DEFAULT_CONFIG);
  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategy | null>(null);
  const [selectedBot, setSelectedBot] = useState<AITradingBot | null>(null);
  const [localModels, setLocalModels] = useState<LocalModel[]>([
    {
      id: 'local-1',
      name: 'Local LLaMA',
      endpoint: 'http://localhost:11434/v1',
      type: 'trading',
      isConnected: false
    }
  ]);

  // Load data from localStorage on mount if available
  useEffect(() => {
    try {
      const savedBots = localStorage.getItem('aiBots');
      if (savedBots) {
        setBots(JSON.parse(savedBots));
      }
      
      const savedAccount = localStorage.getItem('aiTradingAccount');
      if (savedAccount) {
        setAccount(JSON.parse(savedAccount));
      }
    } catch (error) {
      console.error('Error loading AI trading data:', error);
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('aiBots', JSON.stringify(bots));
    } catch (error) {
      console.error('Error saving AI bots:', error);
    }
  }, [bots]);
  
  useEffect(() => {
    try {
      localStorage.setItem('aiTradingAccount', JSON.stringify(account));
    } catch (error) {
      console.error('Error saving AI trading account:', error);
    }
  }, [account]);
  
  // Create a new bot
  const createBot = (name: string, strategyId: string, asset: string, model: string): AITradingBot => {
    const strategy = strategies.find(s => s.id === strategyId);
    
    if (!strategy) {
      throw new Error('Strategy not found');
    }
    
    const newBot: AITradingBot = {
      id: `bot-${Date.now()}`,
      name,
      description: `${asset} trading bot using ${strategy.name}`,
      strategy: strategy,
      strategyId: strategyId,
      strategyName: strategy.name,
      status: 'active',
      createdAt: new Date().toISOString(),
      model,
      asset,
      accuracy: 0,
      successRate: 0,
      trades: 0,
      totalTrades: 0,
      performance: {
        winRate: 0,
        trades: 0,
        profit: 0
      },
      profitLoss: 0
    };
    
    setBots(prev => [...prev, newBot]);
    return newBot;
  };
  
  // Toggle bot active/paused status
  const toggleBotStatus = (id: string) => {
    setBots(prev => prev.map(bot => {
      if (bot.id !== id) return bot;
      
      const newStatus = bot.status === 'active' ? 'paused' : 'active';
      return { ...bot, status: newStatus };
    }));
  };
  
  // Delete a bot
  const deleteBot = (id: string) => {
    setBots(prev => prev.filter(bot => bot.id !== id));
    
    // If selected bot was deleted, clear selection
    if (selectedBot?.id === id) {
      setSelectedBot(null);
    }
  };
  
  // Update a bot
  const updateBot = (id: string, updates: Partial<AITradingBot>) => {
    setBots(prev => prev.map(bot => 
      bot.id === id ? { ...bot, ...updates } : bot
    ));
    
    // If updating the selected bot, update selection
    if (selectedBot?.id === id) {
      setSelectedBot(prev => prev ? { ...prev, ...updates } : null);
    }
  };
  
  // Select a strategy
  const selectStrategy = (id: string) => {
    const strategy = strategies.find(s => s.id === id) || null;
    setSelectedStrategy(strategy);
  };
  
  // Select a bot
  const selectBot = (id: string) => {
    const bot = bots.find(b => b.id === id) || null;
    setSelectedBot(bot);
  };
  
  // Get available models
  const getAvailableModels = () => {
    const openRouterModels = ['DeepSeek R1', 'GPT-4', 'Claude 3', 'Gemini 1.5'];
    const localModelNames = localModels.filter(m => m.isConnected).map(m => m.name);
    
    return [...openRouterModels, ...localModelNames];
  };
  
  return (
    <AiTradingContext.Provider
      value={{
        strategies,
        bots,
        account,
        paperTradingConfig,
        selectedStrategy,
        selectedBot,
        localModels,
        createBot,
        toggleBotStatus,
        deleteBot,
        updateBot,
        selectStrategy,
        selectBot,
        getAvailableModels,
      }}
    >
      {children}
    </AiTradingContext.Provider>
  );
};

// Custom hook for accessing the context
export const useAiTrading = () => useContext(AiTradingContext);

export default AiTradingContext;
