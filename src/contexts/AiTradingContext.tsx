
import React, { createContext, useContext, useState, useEffect } from 'react';
import { openRouterService, TradingSignal } from '@/services/openRouterService';
import { useTradingContext } from './TradingContext';
import { useToast } from '@/hooks/use-toast';
import { Trade, TradingAccount, SupportedCurrency } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

export interface AiBot {
  id: string;
  name: string;
  strategy: string;
  model: string; // This is the correct property name
  aiModel?: string; // Alias for compatibility
  isActive: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  maxTradeAmount: number;
  targetAssets: string[];
  createdAt: string;
  account: TradingAccount; // Add missing account property
  performance: {
    totalTrades: number;
    winRate: number;
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  signal?: TradingSignal;
  reasoning: string;
  result?: string;
  marketData?: any;
}

interface AiTradingContextType {
  bots: AiBot[];
  activeBots: AiBot[]; // Add missing activeBots property
  createBot: (config: Partial<AiBot>) => string;
  activateBot: (botId: string) => void;
  deactivateBot: (botId: string) => void;
  deleteBot: (botId: string) => void;
  getBotById: (botId: string) => AiBot | undefined;
  isAnyBotActive: boolean;
}

const AiTradingContext = createContext<AiTradingContextType>({
  bots: [],
  activeBots: [],
  createBot: () => '',
  activateBot: () => {},
  deactivateBot: () => {},
  deleteBot: () => {},
  getBotById: () => undefined,
  isAnyBotActive: false,
});

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bots, setBots] = useState<AiBot[]>([]);
  const { addTrade, activeAccount } = useTradingContext();
  const { toast } = useToast();

  // Compute activeBots from bots state
  const activeBots = bots.filter(bot => bot.isActive);

  useEffect(() => {
    const stored = localStorage.getItem('ai-trading-bots');
    if (stored) {
      setBots(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-trading-bots', JSON.stringify(bots));
  }, [bots]);

  const createBotAccount = (name: string): TradingAccount => {
    return {
      id: uuidv4(),
      name,
      trades: [],
      balance: 10000,
      currency: 'AUD' as SupportedCurrency,
      createdAt: new Date().toISOString(),
      type: 'paper',
      assets: []
    };
  };

  // AI Bot execution loop
  useEffect(() => {
    const interval = setInterval(async () => {
      const activeBotsToRun = bots.filter(bot => bot.isActive);
      
      for (const bot of activeBotsToRun) {
        await executeBot(bot);
      }
    }, 30000); // Run every 30 seconds

    return () => clearInterval(interval);
  }, [bots, activeAccount]);

  const executeBot = async (bot: AiBot) => {
    if (!activeAccount) return;

    try {
      // Generate mock market data
      const marketData = generateMockMarketData(bot.targetAssets[0] || 'BTC');
      
      // Get AI signal
      const signal = await openRouterService.generateTradingSignal(
        marketData,
        bot.strategy,
        bot.model
      );

      // Create audit entry
      const auditEntry: AuditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        action: 'ANALYSIS',
        signal,
        reasoning: signal.reasoning,
        marketData
      };

      // Execute trade based on signal and risk level
      if (signal.signal !== 'HOLD' && signal.confidence > getConfidenceThreshold(bot.riskLevel)) {
        const tradeAmount = calculateTradeAmount(bot, signal, activeAccount.balance);
        
        if (tradeAmount > 0) {
          const trade: Trade = {
            id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            symbol: bot.targetAssets[0] || 'BTC',
            coinSymbol: bot.targetAssets[0] || 'BTC',
            coinId: bot.targetAssets[0]?.toLowerCase() || 'bitcoin',
            coinName: bot.targetAssets[0] || 'Bitcoin',
            type: signal.signal.toLowerCase() as 'buy' | 'sell',
            quantity: tradeAmount / signal.entryPrice,
            amount: tradeAmount / signal.entryPrice,
            price: signal.entryPrice,
            totalValue: tradeAmount,
            total: tradeAmount,
            timestamp: new Date().toISOString(),
            botId: bot.id,
            botGenerated: true,
            strategyId: bot.id,
            currency: 'AUD',
            tags: [`ai-${bot.strategy}`, `${bot.model}`, `confidence-${Math.round(signal.confidence * 100)}`]
          };

          addTrade(trade);
          
          auditEntry.action = 'TRADE_EXECUTED';
          auditEntry.result = `${signal.signal} ${tradeAmount.toFixed(2)} AUD of ${trade.symbol}`;

          toast({
            title: `AI Bot Trade: ${bot.name}`,
            description: `${signal.signal} ${trade.symbol} - ${(signal.confidence * 100).toFixed(1)}% confidence`,
          });

          // Update bot performance
          updateBotPerformance(bot.id, trade, signal);
        }
      }

      // Add audit entry to bot
      updateBotAuditLog(bot.id, auditEntry);

    } catch (error) {
      console.error(`Bot ${bot.name} execution failed:`, error);
      
      const errorEntry: AuditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        action: 'ERROR',
        reasoning: `Execution failed: ${error}`,
      };
      
      updateBotAuditLog(bot.id, errorEntry);
    }
  };

  const generateMockMarketData = (symbol: string) => {
    const basePrice = symbol === 'BTC' ? 50000 : symbol === 'ETH' ? 3000 : 1;
    const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
    
    return {
      symbol,
      price,
      change24h: (Math.random() - 0.5) * 20,
      volume: Math.random() * 1000000000,
      marketCap: price * 19000000,
      rsi: 30 + Math.random() * 40,
      ma20: price * (0.95 + Math.random() * 0.1)
    };
  };

  const getConfidenceThreshold = (riskLevel: string): number => {
    switch (riskLevel) {
      case 'low': return 0.8;
      case 'medium': return 0.7;
      case 'high': return 0.6;
      default: return 0.8;
    }
  };

  const calculateTradeAmount = (bot: AiBot, signal: TradingSignal, balance: number): number => {
    const maxAmount = Math.min(bot.maxTradeAmount, balance * 0.1); // Max 10% of balance
    const riskMultiplier = bot.riskLevel === 'low' ? 0.5 : bot.riskLevel === 'medium' ? 0.75 : 1.0;
    return maxAmount * riskMultiplier * signal.confidence;
  };

  const updateBotPerformance = (botId: string, trade: any, signal: TradingSignal) => {
    setBots(prev => prev.map(bot => {
      if (bot.id === botId) {
        const newTotalTrades = bot.performance.totalTrades + 1;
        // Mock performance calculation
        const isWin = Math.random() > 0.4; // 60% win rate
        const newWinRate = (bot.performance.winRate * bot.performance.totalTrades + (isWin ? 1 : 0)) / newTotalTrades;
        
        return {
          ...bot,
          performance: {
            ...bot.performance,
            totalTrades: newTotalTrades,
            winRate: newWinRate,
            totalReturn: bot.performance.totalReturn + (isWin ? 0.02 : -0.01),
            sharpeRatio: 1.2 + Math.random() * 0.8,
            maxDrawdown: Math.max(bot.performance.maxDrawdown, Math.random() * 0.15)
          }
        };
      }
      return bot;
    }));
  };

  const updateBotAuditLog = (botId: string, entry: AuditEntry) => {
    setBots(prev => prev.map(bot => {
      if (bot.id === botId) {
        return {
          ...bot,
          auditLog: [entry, ...bot.auditLog].slice(0, 100) // Keep last 100 entries
        };
      }
      return bot;
    }));
  };

  const createBot = (config: Partial<AiBot>): string => {
    const botId = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newBot: AiBot = {
      id: botId,
      name: config.name || 'AI Trading Bot',
      strategy: config.strategy || 'trend-following',
      model: config.model || 'deepseek/deepseek-r1',
      aiModel: config.model || 'deepseek/deepseek-r1', // Alias for compatibility
      isActive: false,
      riskLevel: config.riskLevel || 'low',
      maxTradeAmount: config.maxTradeAmount || 1000,
      targetAssets: config.targetAssets || ['BTC'],
      createdAt: new Date().toISOString(),
      account: createBotAccount(`${config.name || 'AI Trading Bot'} Account`),
      performance: {
        totalTrades: 0,
        winRate: 0,
        totalReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      },
      auditLog: []
    };

    setBots(prev => [...prev, newBot]);
    return botId;
  };

  const activateBot = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId ? { ...bot, isActive: true } : bot
    ));
    
    toast({
      title: "AI Bot Activated",
      description: "Bot will start analyzing markets and executing trades",
    });
  };

  const deactivateBot = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId ? { ...bot, isActive: false } : bot
    ));
    
    toast({
      title: "AI Bot Deactivated",
      description: "Bot has been stopped",
    });
  };

  const deleteBot = (botId: string) => {
    setBots(prev => prev.filter(bot => bot.id !== botId));
    
    toast({
      title: "AI Bot Deleted",
      description: "Bot has been permanently removed",
    });
  };

  const getBotById = (botId: string): AiBot | undefined => {
    return bots.find(bot => bot.id === botId);
  };

  const isAnyBotActive = bots.some(bot => bot.isActive);

  return (
    <AiTradingContext.Provider value={{
      bots,
      activeBots,
      createBot,
      activateBot,
      deactivateBot,
      deleteBot,
      getBotById,
      isAnyBotActive,
    }}>
      {children}
    </AiTradingContext.Provider>
  );
};

export const useAiTrading = () => useContext(AiTradingContext);
