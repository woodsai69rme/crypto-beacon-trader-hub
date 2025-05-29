
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AITradingBot } from '@/services/ai/aiTradingBotService';
import { aiTradingBotService } from '@/services/ai/aiTradingBotService';

interface AiTradingContextType {
  bots: AITradingBot[];
  activeBots: AITradingBot[];
  refreshBots: () => void;
  createBot: (config: Partial<AITradingBot>) => Promise<string>;
  activateBot: (botId: string) => Promise<boolean>;
  deactivateBot: (botId: string) => Promise<boolean>;
  deleteBot: (botId: string) => boolean;
}

const AiTradingContext = createContext<AiTradingContextType>({
  bots: [],
  activeBots: [],
  refreshBots: () => {},
  createBot: async () => '',
  activateBot: async () => false,
  deactivateBot: async () => false,
  deleteBot: () => false,
});

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bots, setBots] = useState<AITradingBot[]>([]);

  const refreshBots = () => {
    const allBots = aiTradingBotService.getBots();
    setBots(allBots);
  };

  useEffect(() => {
    refreshBots();
    const interval = setInterval(refreshBots, 5000);
    return () => clearInterval(interval);
  }, []);

  const createBot = async (config: Partial<AITradingBot>): Promise<string> => {
    const botId = await aiTradingBotService.createBot(config);
    refreshBots();
    return botId;
  };

  const activateBot = async (botId: string): Promise<boolean> => {
    const result = await aiTradingBotService.activateBot(botId);
    refreshBots();
    return result;
  };

  const deactivateBot = async (botId: string): Promise<boolean> => {
    const result = await aiTradingBotService.deactivateBot(botId);
    refreshBots();
    return result;
  };

  const deleteBot = (botId: string): boolean => {
    const result = aiTradingBotService.deleteBotById(botId);
    refreshBots();
    return result;
  };

  const activeBots = bots.filter(bot => bot.isActive);

  return (
    <AiTradingContext.Provider value={{
      bots,
      activeBots,
      refreshBots,
      createBot,
      activateBot,
      deactivateBot,
      deleteBot
    }}>
      {children}
    </AiTradingContext.Provider>
  );
};

export const useAiTrading = () => useContext(AiTradingContext);
