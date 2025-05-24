
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AITradingStrategy, TradingAccount, Trade } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

interface AiTradingContextType {
  strategies: AITradingStrategy[];
  activeStrategies: AITradingStrategy[];
  activateStrategy: (strategy: AITradingStrategy, account: TradingAccount) => void;
  deactivateStrategy: (strategyId: string) => void;
  updateStrategyPerformance: (strategyId: string, performance: any) => void;
  getStrategyPerformance: (strategyId: string) => any;
}

const AiTradingContext = createContext<AiTradingContextType | undefined>(undefined);

export const useAiTrading = () => {
  const context = useContext(AiTradingContext);
  if (!context) {
    throw new Error('useAiTrading must be used within an AiTradingProvider');
  }
  return context;
};

// Utility function for creating trades
const createTrade = (
  coinId: string,
  coinSymbol: string,
  type: 'buy' | 'sell',
  amount: number,
  price: number,
  currency: any = 'AUD',
  strategyId?: string
): Trade => {
  return {
    id: uuidv4(),
    coinId,
    coinName: coinId.charAt(0).toUpperCase() + coinId.slice(1),
    coinSymbol,
    type,
    amount,
    price,
    totalValue: amount * price,
    total: amount * price,
    timestamp: new Date().toISOString(),
    currency,
    strategyId,
    botGenerated: true
  };
};

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [strategies] = useState<AITradingStrategy[]>([
    {
      id: 'trend-following-v2',
      name: 'Trend Following v2',
      description: 'Advanced trend following strategy with multiple timeframe analysis',
      type: 'trend-following',
      timeframe: 'medium',
      riskLevel: 'medium',
      profitPotential: 'high',
      indicators: ['Moving Averages', 'MACD', 'Volume'],
      triggers: ['Crossovers', 'Volume Spikes'],
      backtestResults: {
        winRate: 65,
        profitFactor: 1.8,
        sharpeRatio: 1.4,
        maxDrawdown: 12
      }
    },
    {
      id: 'breakout-hunter-v3',
      name: 'Breakout Hunter v3',
      description: 'Identifies and trades breakouts with advanced volume analysis',
      type: 'breakout',
      timeframe: 'short',
      riskLevel: 'high',
      profitPotential: 'high',
      indicators: ['Bollinger Bands', 'ATR', 'Support/Resistance'],
      triggers: ['Band Breakouts', 'Volume Confirmation'],
      backtestResults: {
        winRate: 55,
        profitFactor: 2.1,
        sharpeRatio: 1.2,
        maxDrawdown: 18
      }
    }
  ]);

  const [activeStrategies, setActiveStrategies] = useState<AITradingStrategy[]>([]);
  const [strategyPerformance, setStrategyPerformance] = useState<Record<string, any>>({});

  const activateStrategy = (strategy: AITradingStrategy, account: TradingAccount) => {
    // Check if strategy is already active
    if (activeStrategies.find(s => s.id === strategy.id)) {
      return;
    }

    setActiveStrategies(prev => [...prev, strategy]);
    
    // Initialize performance tracking
    setStrategyPerformance(prev => ({
      ...prev,
      [strategy.id]: {
        startDate: new Date().toISOString(),
        totalTrades: 0,
        winningTrades: 0,
        totalProfit: 0,
        isRunning: true
      }
    }));
  };

  const deactivateStrategy = (strategyId: string) => {
    setActiveStrategies(prev => prev.filter(s => s.id !== strategyId));
    
    // Update performance to mark as stopped
    setStrategyPerformance(prev => ({
      ...prev,
      [strategyId]: {
        ...prev[strategyId],
        isRunning: false,
        endDate: new Date().toISOString()
      }
    }));
  };

  const updateStrategyPerformance = (strategyId: string, performance: any) => {
    setStrategyPerformance(prev => ({
      ...prev,
      [strategyId]: {
        ...prev[strategyId],
        ...performance
      }
    }));
  };

  const getStrategyPerformance = (strategyId: string) => {
    return strategyPerformance[strategyId] || null;
  };

  return (
    <AiTradingContext.Provider value={{
      strategies,
      activeStrategies,
      activateStrategy,
      deactivateStrategy,
      updateStrategyPerformance,
      getStrategyPerformance
    }}>
      {children}
    </AiTradingContext.Provider>
  );
};
