
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AITradingStrategy, AIBot, AuditLogEntry } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';
import { comprehensiveAiStrategies } from '@/services/ai/comprehensiveAiStrategies';

interface AiTradingContextType {
  bots: AIBot[];
  activeBots: AIBot[];
  strategies: AITradingStrategy[];
  createBot: (config: Partial<AIBot>) => string;
  toggleBot: (botId: string) => void;
  deleteBot: (botId: string) => void;
  getBotPerformance: (botId: string) => any;
  addStrategy: (strategy: AITradingStrategy) => void;
  addAuditEntry: (botId: string, entry: AuditLogEntry) => void;
}

const AiTradingContext = createContext<AiTradingContextType | undefined>(undefined);

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bots, setBots] = useState<AIBot[]>([]);
  const [strategies, setStrategies] = useState<AITradingStrategy[]>([]);
  const { toast } = useToast();

  // Computed property for active bots
  const activeBots = bots.filter(bot => bot.status === 'active');

  useEffect(() => {
    // Load saved bots from localStorage
    const savedBots = localStorage.getItem('ai-trading-bots');
    if (savedBots) {
      setBots(JSON.parse(savedBots));
    }

    // Initialize with comprehensive AI strategies
    setStrategies(comprehensiveAiStrategies.getAllStrategies());
  }, []);

  const createBot = (config: Partial<AIBot>): string => {
    const newBot: AIBot = {
      id: `bot-${Date.now()}`,
      name: config.name || 'New Trading Bot',
      strategy: config.strategy || 'trend-following',
      status: 'paused',
      isActive: false,
      model: config.model || 'deepseek/deepseek-r1',
      createdAt: new Date().toISOString(),
      riskLevel: config.riskLevel || 'medium',
      maxTradeAmount: config.maxTradeAmount || 1000,
      targetAssets: config.targetAssets || ['BTC', 'ETH'],
      performance: {
        totalReturn: 0,
        winRate: 0,
        trades: 0,
        totalTrades: 0,
        maxDrawdown: 0,
        sharpeRatio: 0
      },
      auditLog: [],
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
        const newStatus: 'active' | 'paused' | 'stopped' = bot.status === 'active' ? 'paused' : 'active';
        const isActive = newStatus === 'active';
        
        // Add audit entry
        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          action: isActive ? 'BOT_STARTED' : 'BOT_STOPPED',
          timestamp: new Date().toISOString(),
          reasoning: `Bot ${isActive ? 'activated' : 'deactivated'} by user`
        };

        toast({
          title: `Bot ${isActive ? 'Started' : 'Paused'}`,
          description: `${bot.name} is now ${newStatus}.`
        });

        return { 
          ...bot, 
          status: newStatus, 
          isActive,
          auditLog: [...bot.auditLog, auditEntry]
        };
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
    return bot?.performance || { totalReturn: 0, winRate: 0, trades: 0, totalTrades: 0, maxDrawdown: 0, sharpeRatio: 0 };
  };

  const addStrategy = (strategy: AITradingStrategy) => {
    setStrategies(prev => [...prev, strategy]);
  };

  const addAuditEntry = (botId: string, entry: AuditLogEntry) => {
    const updatedBots = bots.map(bot => {
      if (bot.id === botId) {
        return {
          ...bot,
          auditLog: [...bot.auditLog, entry]
        };
      }
      return bot;
    });
    setBots(updatedBots);
    localStorage.setItem('ai-trading-bots', JSON.stringify(updatedBots));
  };

  return (
    <AiTradingContext.Provider value={{
      bots,
      activeBots,
      strategies,
      createBot,
      toggleBot,
      deleteBot,
      getBotPerformance,
      addStrategy,
      addAuditEntry
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
