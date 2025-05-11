import { v4 as uuidv4 } from 'uuid';
import { AITradingStrategy, TradingAccount, Trade } from "@/types/trading";

// Mock function to simulate fetching AI trading strategies
export const fetchAITradingStrategies = async (): Promise<AITradingStrategy[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const strategies: AITradingStrategy[] = [
        {
          id: uuidv4(),
          name: "Trend Following",
          description: "Trades based on identified trends in the market.",
          timeframe: "4h",
          indicators: ["MACD", "RSI"],
          parameters: {
            macd_fast_period: 12,
            macd_slow_period: 26,
            rsi_oversold: 30,
            rsi_overbought: 70,
          },
          performance: {
            winRate: 0.65,
            profitFactor: 1.8,
            sharpeRatio: 1.2,
          },
          aiModel: "trend_model_v1",
          confidenceThreshold: 0.75,
          riskLevel: "medium",
          maxDrawdown: 0.10,
          type: "AI",
          creator: "System",
          tags: ["trend", "momentum"],
        },
        {
          id: uuidv4(),
          name: "Mean Reversion",
          description: "Trades based on deviations from the mean price.",
          timeframe: "1h",
          indicators: ["Bollinger Bands", "RSI"],
          parameters: {
            bb_period: 20,
            rsi_oversold: 25,
            rsi_overbought: 75,
          },
          performance: {
            winRate: 0.70,
            profitFactor: 1.5,
            sharpeRatio: 0.9,
          },
          aiModel: "mean_reversion_v1",
          confidenceThreshold: 0.80,
          riskLevel: "low",
          maxDrawdown: 0.05,
          type: "AI",
          creator: "System",
          tags: ["mean reversion", "volatility"],
        },
      ];
      resolve(strategies);
    }, 500);
  });
};

// Mock function to simulate fetching trading accounts
export const fetchTradingAccounts = async (): Promise<TradingAccount[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const accounts: TradingAccount[] = [
        {
          id: uuidv4(),
          name: "Binance Account",
          exchange: "Binance",
          balance: 5000,
          currency: "USD",
          connected: true,
          isActive: true,
          provider: "Binance",
          type: "Real",
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: "Coinbase Account",
          exchange: "Coinbase",
          balance: 3000,
          currency: "USD",
          connected: false,
          isActive: false,
          provider: "Coinbase",
          type: "Real",
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        },
      ];
      resolve(accounts);
    }, 500);
  });
};

// Mock function to simulate executing an AI trade
export const executeAiTrade = async (
  strategyId: string,
  coinId: string,
  amount: number,
  price: number,
  coinName: string,
  coinSymbol: string,
  type: 'buy' | 'sell'
): Promise<Trade> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tradeId = uuidv4();
      const trade: Trade = {
        id: tradeId,
        coinId,
        coinName,
        coinSymbol,
        type,
        amount,
        price,
        totalValue: amount * price,
        total: amount * price,
        timestamp: new Date().toISOString(),
        currency: 'USD',
        botGenerated: true,
        strategyId
      };
      resolve(trade);
    }, 500);
  });
};
