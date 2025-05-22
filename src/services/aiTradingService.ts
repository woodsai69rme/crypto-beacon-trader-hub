
import { AITradingStrategy, Trade, LocalModel } from '@/types/trading';

// Mock AI trading strategies
const mockStrategies: AITradingStrategy[] = [
  {
    id: 'trend-follower',
    name: 'Trend Follower',
    description: 'Follows established market trends using multiple moving averages and momentum indicators.',
    type: 'trend-following',
    timeframe: '1h',
    parameters: {
      riskLevel: 'medium',
      backtestResults: {
        winRate: 65,
        profitFactor: 1.8,
        sharpeRatio: 1.5,
        drawdown: 18,
        returns: 42
      }
    },
    indicators: ['MA', 'MACD', 'RSI'],
    tags: ['trend', 'momentum', 'technical']
  },
  {
    id: 'breakout-hunter',
    name: 'Breakout Hunter',
    description: 'Identifies and trades breakouts from key support and resistance levels.',
    type: 'breakout',
    timeframe: '4h',
    parameters: {
      riskLevel: 'high',
      backtestResults: {
        winRate: 55,
        profitFactor: 2.1,
        sharpeRatio: 1.7,
        drawdown: 25,
        returns: 68
      }
    },
    indicators: ['Bollinger Bands', 'Volume', 'ATR'],
    tags: ['volatility', 'breakout', 'volume']
  },
  {
    id: 'mean-reverter',
    name: 'Mean Reversion',
    description: 'Capitalizes on price deviations from historical averages.',
    type: 'mean-reversion',
    timeframe: '1d',
    parameters: {
      riskLevel: 'medium',
      backtestResults: {
        winRate: 72,
        profitFactor: 1.6,
        sharpeRatio: 1.4,
        drawdown: 15,
        returns: 35
      }
    },
    indicators: ['RSI', 'Stochastic', 'Bollinger Bands'],
    tags: ['overbought', 'oversold', 'oscillator']
  },
];

// Mock AI models
const mockModels: LocalModel[] = [
  {
    id: 'gpt-trading',
    name: 'GPT Trading Analyst',
    type: 'cloud',
    endpoint: 'https://api.openrouter.ai/api/v1/chat/completions',
    isConnected: true,
    lastUsed: new Date().toISOString(),
    description: 'Advanced language model specialized in crypto market analysis and trading signals.',
    performance: {
      accuracy: 76,
      returns: 42,
      sharpeRatio: 1.8,
      maxDrawdown: 15
    }
  },
  {
    id: 'local-ml',
    name: 'Local ML Predictor',
    type: 'local',
    endpoint: 'http://localhost:8000/predict',
    isConnected: false,
    description: 'Machine learning model running locally for price prediction.',
    performance: {
      accuracy: 68,
      returns: 31,
      sharpeRatio: 1.4,
      maxDrawdown: 22
    }
  },
  {
    id: 'sentiment-analyzer',
    name: 'Sentiment Analyzer',
    type: 'api',
    endpoint: 'https://api.sentimentanalysis.io/v1/analyze',
    isConnected: true,
    lastUsed: new Date().toISOString(),
    description: 'Real-time analysis of market sentiment from news and social media.',
    performance: {
      accuracy: 72,
      returns: 38,
      sharpeRatio: 1.6,
      maxDrawdown: 18
    }
  }
];

// Fetch all available AI trading strategies
export async function fetchAiStrategies(): Promise<AITradingStrategy[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStrategies);
    }, 500);
  });
}

// Get a strategy by ID
export async function getStrategyById(id: string): Promise<AITradingStrategy | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const strategy = mockStrategies.find(s => s.id === id);
      resolve(strategy);
    }, 300);
  });
}

// Fetch AI models available for trading
export async function fetchAiModels(): Promise<LocalModel[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockModels);
    }, 600);
  });
}

// Run backtest for a strategy
export async function runBacktest(
  strategyId: string, 
  coinId: string,
  timeframe: string, 
  days: number,
  initialCapital: number = 10000
): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const strategy = mockStrategies.find(s => s.id === strategyId);
      
      // Generate mock backtest results based on strategy parameters
      const winRate = strategy?.parameters.backtestResults?.winRate || 55;
      const profitFactor = strategy?.parameters.backtestResults?.profitFactor || 1.5;
      const maxDrawdown = strategy?.parameters.backtestResults?.maxDrawdown || 20;
      const returns = strategy?.parameters.backtestResults?.returns || 30;
      
      // Calculate final balance based on returns
      const finalCapital = initialCapital * (1 + (returns / 100));
      const profit = finalCapital - initialCapital;
      const profitPercentage = (profit / initialCapital) * 100;
      
      // Generate mock trades
      const trades: any[] = [];
      let currentBalance = initialCapital;
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - days);
      
      // Strategy parameters affect trade generation
      const tradeCount = Math.floor(days / 3) + Math.floor(Math.random() * 5);
      const winCount = Math.floor(tradeCount * (winRate / 100));
      const loseCount = tradeCount - winCount;
      
      // Generate winning trades
      for (let i = 0; i < winCount; i++) {
        currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 3) + 1);
        const price = 100 + Math.random() * 50;
        const amount = (currentBalance * 0.1) / price;
        const tradeValue = amount * price;
        const profitAmount = tradeValue * (0.05 + Math.random() * 0.1);
        currentBalance += profitAmount;
        
        trades.push({
          id: `trade-win-${i}`,
          timestamp: new Date(currentDate).toISOString(),
          date: currentDate.toLocaleDateString(),
          type: 'buy',
          price,
          amount,
          total: tradeValue,
          profit: profitAmount,
          profitPercentage: (profitAmount / tradeValue) * 100,
        });
        
        // Add the corresponding sell trade
        currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 2) + 1);
        trades.push({
          id: `trade-win-sell-${i}`,
          timestamp: new Date(currentDate).toISOString(),
          date: currentDate.toLocaleDateString(),
          type: 'sell',
          price: price * (1.05 + Math.random() * 0.1),
          amount,
          total: tradeValue + profitAmount,
          profit: profitAmount,
          profitPercentage: (profitAmount / tradeValue) * 100,
        });
      }
      
      // Generate losing trades
      for (let i = 0; i < loseCount; i++) {
        currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 3) + 1);
        const price = 100 + Math.random() * 50;
        const amount = (currentBalance * 0.1) / price;
        const tradeValue = amount * price;
        const lossAmount = tradeValue * (0.02 + Math.random() * 0.08);
        currentBalance -= lossAmount;
        
        trades.push({
          id: `trade-loss-${i}`,
          timestamp: new Date(currentDate).toISOString(),
          date: currentDate.toLocaleDateString(),
          type: 'buy',
          price,
          amount,
          total: tradeValue,
          profit: -lossAmount,
          profitPercentage: (-lossAmount / tradeValue) * 100,
        });
        
        // Add the corresponding sell trade
        currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 2) + 1);
        trades.push({
          id: `trade-loss-sell-${i}`,
          timestamp: new Date(currentDate).toISOString(),
          date: currentDate.toLocaleDateString(),
          type: 'sell',
          price: price * (0.92 + Math.random() * 0.08),
          amount,
          total: tradeValue - lossAmount,
          profit: -lossAmount,
          profitPercentage: (-lossAmount / tradeValue) * 100,
        });
      }
      
      // Sort trades by date
      trades.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Calculate other metrics
      const totalTrades = trades.length;
      const winningTrades = trades.filter(trade => trade.profit > 0).length;
      const losingTrades = trades.filter(trade => trade.profit < 0).length;
      const averageProfit = trades.reduce((sum, trade) => sum + trade.profit, 0) / totalTrades;
      const averageWin = trades.filter(trade => trade.profit > 0).reduce((sum, trade) => sum + trade.profit, 0) / winningTrades || 0;
      const averageLoss = Math.abs(trades.filter(trade => trade.profit < 0).reduce((sum, trade) => sum + trade.profit, 0)) / losingTrades || 0;
      
      // Calculate Sharpe Ratio (simplified)
      const profitReturns = trades.map(trade => trade.profitPercentage);
      const avgReturn = profitReturns.reduce((sum, ret) => sum + ret, 0) / profitReturns.length;
      const stdDev = Math.sqrt(profitReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / profitReturns.length);
      const sharpeRatio = avgReturn / (stdDev || 1);
      
      // Calculate Sortino Ratio (simplified)
      const negativeReturns = profitReturns.filter(ret => ret < 0);
      const downDev = Math.sqrt(negativeReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / (negativeReturns.length || 1));
      const sortinoRatio = avgReturn / (downDev || 1);
      
      resolve({
        startDate: new Date(currentDate.setDate(currentDate.getDate() - days)).toISOString(),
        endDate: new Date().toISOString(),
        initialBalance: initialCapital,
        finalBalance: finalCapital,
        profit,
        profitPercentage,
        maxDrawdown,
        winRate,
        trades,
        sharpeRatio: sharpeRatio > 0 ? sharpeRatio : strategy?.parameters.backtestResults?.sharpeRatio || 1.4,
        profitFactor,
        averageProfit,
        averageWin,
        averageLoss,
        initialCapital,
        finalCapital,
        totalReturn: profitPercentage,
        totalTrades,
        winningTrades,
        losingTrades,
        sortinoRatio,
      });
    }, 1500);
  });
}

// Generate trading signals for a model
export async function generateTradingSignals(
  modelId: string,
  coinId: string,
  strategyId: string
): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const model = mockModels.find(m => m.id === modelId);
      const strategy = mockStrategies.find(s => s.id === strategyId);
      
      // Generate 1-3 signals based on model and strategy
      const signalCount = Math.floor(Math.random() * 3) + 1;
      const signals = [];
      
      for (let i = 0; i < signalCount; i++) {
        // Determine signal type based on strategy type
        let signalType: 'buy' | 'sell' | 'hold';
        const rnd = Math.random();
        
        if (strategy?.type === 'trend-following') {
          signalType = rnd < 0.6 ? 'buy' : rnd < 0.9 ? 'sell' : 'hold';
        } else if (strategy?.type === 'mean-reversion') {
          signalType = rnd < 0.5 ? 'sell' : rnd < 0.8 ? 'buy' : 'hold';
        } else if (strategy?.type === 'breakout') {
          signalType = rnd < 0.7 ? 'buy' : rnd < 0.9 ? 'sell' : 'hold';
        } else {
          signalType = rnd < 0.4 ? 'buy' : rnd < 0.8 ? 'sell' : 'hold';
        }
        
        // Generate mock signal
        signals.push({
          id: `signal-${Date.now()}-${i}`,
          coinId,
          type: signalType,
          price: 100 + Math.random() * 50,
          confidence: Math.round(60 + Math.random() * 30),
          source: model?.name || 'AI Model',
          timestamp: new Date().toISOString(),
          reason: getSignalReason(strategyId, signalType),
        });
      }
      
      resolve(signals);
    }, 800);
  });
}

// Helper function to generate signal reasons
function getSignalReason(strategyId: string, signalType: 'buy' | 'sell' | 'hold'): string {
  const strategy = mockStrategies.find(s => s.id === strategyId);
  
  if (strategy?.type === 'trend-following') {
    if (signalType === 'buy') {
      return 'Strong upward trend detected with increasing volume.';
    } else if (signalType === 'sell') {
      return 'Trend reversal detected with bearish crossover.';
    } else {
      return 'Trend unclear, waiting for confirmation.';
    }
  } else if (strategy?.type === 'mean-reversion') {
    if (signalType === 'buy') {
      return 'Asset oversold on RSI with bullish divergence.';
    } else if (signalType === 'sell') {
      return 'Asset overbought on multiple timeframes.';
    } else {
      return 'Price within normal range, waiting for extremes.';
    }
  } else if (strategy?.type === 'breakout') {
    if (signalType === 'buy') {
      return 'Price broke above key resistance with high volume.';
    } else if (signalType === 'sell') {
      return 'Support level broken with increasing momentum.';
    } else {
      return 'Price consolidating in range, no breakout yet.';
    }
  } else {
    if (signalType === 'buy') {
      return 'Multiple indicators showing bullish signals.';
    } else if (signalType === 'sell') {
      return 'Technical indicators suggest downward movement.';
    } else {
      return 'Mixed signals, maintaining current position.';
    }
  }
}

// Connect to a new AI model
export async function connectToModel(model: Partial<LocalModel>): Promise<LocalModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would test the connection to the endpoint
      const newModel: LocalModel = {
        id: model.id || `model-${Date.now()}`,
        name: model.name || 'New Model',
        type: model.type || 'api',
        endpoint: model.endpoint || '',
        isConnected: true,
        lastUsed: new Date().toISOString(),
        description: model.description || 'Custom AI model',
        performance: {
          accuracy: Math.floor(60 + Math.random() * 25),
          returns: Math.floor(20 + Math.random() * 40),
          sharpeRatio: 1 + Math.random() * 2,
          maxDrawdown: Math.floor(10 + Math.random() * 20)
        }
      };
      
      resolve(newModel);
    }, 1000);
  });
}

// Disconnect from an AI model
export async function disconnectFromModel(modelId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would close connections to the endpoint
      resolve(true);
    }, 500);
  });
}

// Create a new AI trading strategy
export async function createStrategy(strategyData: Partial<AITradingStrategy>): Promise<AITradingStrategy> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a new strategy based on provided data
      const newStrategy: AITradingStrategy = {
        id: `strategy-${Date.now()}`,
        name: strategyData.name || 'Custom Strategy',
        description: strategyData.description || 'User-defined trading strategy',
        type: strategyData.type || 'custom',
        timeframe: strategyData.timeframe || '1h',
        parameters: {
          riskLevel: strategyData.parameters?.riskLevel || 'medium',
          backtestResults: {
            winRate: Math.floor(50 + Math.random() * 30),
            profitFactor: 1 + Math.random() * 1.5,
            sharpeRatio: 1 + Math.random() * 1,
            drawdown: Math.floor(10 + Math.random() * 20),
            returns: Math.floor(20 + Math.random() * 50)
          }
        },
        indicators: strategyData.indicators || ['Custom'],
        tags: strategyData.tags || ['custom'],
        creator: 'user'
      };
      
      resolve(newStrategy);
    }, 1000);
  });
}
