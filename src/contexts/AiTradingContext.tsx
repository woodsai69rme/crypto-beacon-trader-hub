
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AITradingStrategy } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';

export interface AIBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'stopped';
  performance: {
    totalReturn: number;
    winRate: number;
    trades: number;
  };
  model: string;
  createdAt: string;
}

interface AiTradingContextType {
  bots: AIBot[];
  strategies: AITradingStrategy[];
  createBot: (config: Partial<AIBot>) => string;
  toggleBot: (botId: string) => void;
  deleteBot: (botId: string) => void;
  getBotPerformance: (botId: string) => any;
  addStrategy: (strategy: AITradingStrategy) => void;
}

const AiTradingContext = createContext<AiTradingContextType | undefined>(undefined);

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bots, setBots] = useState<AIBot[]>([]);
  const [strategies, setStrategies] = useState<AITradingStrategy[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved bots from localStorage
    const savedBots = localStorage.getItem('ai-trading-bots');
    if (savedBots) {
      setBots(JSON.parse(savedBots));
    }
  }, []);

  const createBot = (config: Partial<AIBot>): string => {
    const newBot: AIBot = {
      id: `bot-${Date.now()}`,
      name: config.name || 'New Trading Bot',
      strategy: config.strategy || 'trend-following',
      status: 'paused',
      performance: { totalReturn: 0, winRate: 0, trades: 0 },
      model: config.model || 'deepseek/deepseek-r1',
      createdAt: new Date().toISOString(),
      ...config
    };

    const updatedBots = [...bots, newBot];
    setBots(updatedBots);
    localStorage.setItem('ai-trading-bots', JSON.stringify(updatedBots));
    
    toast({
      title: "Bot Created",
      description: `${newBot.name} has been created successfully.`
    });

    return newBot.id;
  };

  const toggleBot = (botId: string) => {
    const updatedBots = bots.map(bot => {
      if (bot.id === botId) {
        const newStatus = bot.status === 'active' ? 'paused' : 'active';
        toast({
          title: `Bot ${newStatus === 'active' ? 'Started' : 'Paused'}`,
          description: `${bot.name} is now ${newStatus}.`
        });
        return { ...bot, status: newStatus };
      }
      return bot;
    });

    setBots(updatedBots);
    localStorage.setItem('ai-trading-bots', JSON.stringify(updatedBots));
  };

  const deleteBot = (botId: string) => {
    const updatedBots = bots.filter(bot => bot.id !== botId);
    setBots(updatedBots);
    localStorage.setItem('ai-trading-bots', JSON.stringify(updatedBots));
    
    toast({
      title: "Bot Deleted",
      description: "Trading bot has been removed successfully."
    });
  };

  const getBotPerformance = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    return bot?.performance || { totalReturn: 0, winRate: 0, trades: 0 };
  };

  const addStrategy = (strategy: AITradingStrategy) => {
    setStrategies(prev => [...prev, strategy]);
  };

  return (
    <AiTradingContext.Provider value={{
      bots,
      strategies,
      createBot,
      toggleBot,
      deleteBot,
      getBotPerformance,
      addStrategy
    }}>
      {children}
    </AiTradingContext.Provider>
  );
};

export const useAiTrading = () => {
  const context = useContext(AiTradingContext);
  if (!context) {
    throw new Error('useAiTrading must be used within an AiTradingProvider');
  }
  return context;
};
