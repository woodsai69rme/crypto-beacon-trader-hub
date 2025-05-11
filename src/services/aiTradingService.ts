
import { AITradingStrategy, TradingAccount, Trade } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

// Mock AI trading service
const aiTradingService = {
  /**
   * Get pre-built AI trading strategies
   */
  getPrebuiltStrategies(): AITradingStrategy[] {
    return [
      {
        id: 'strategy-1',
        name: 'BTC Trend Follower',
        description: 'Follows Bitcoin trends using moving average crossovers',
        type: 'trend-following',
        timeframe: '4h',
        parameters: {
          shortMaPeriod: 9,
          longMaPeriod: 21,
          takeProfitPct: 3.5,
          stopLossPct: 2.5
        },
        indicators: ['MA', 'Volume', 'RSI'],
        performance: {
          winRate: 65,
          profitFactor: 1.8,
          trades: 125,
          returns: 42.5
        }
      },
      {
        id: 'strategy-2',
        name: 'ETH Mean Reversion',
        description: 'Trades Ethereum mean reversion using Bollinger Bands',
        type: 'mean-reversion',
        timeframe: '1h',
        parameters: {
          bbPeriod: 20,
          bbDeviation: 2,
          rsiPeriod: 14,
          rsiOverbought: 70,
          rsiOversold: 30
        },
        indicators: ['BB', 'RSI', 'Volume'],
        performance: {
          winRate: 72,
          profitFactor: 2.1,
          trades: 210,
          returns: 56.8
        }
      },
      {
        id: 'strategy-3',
        name: 'Sentiment Trader',
        description: 'Uses market sentiment analysis and news to generate signals',
        type: 'sentiment',
        timeframe: '1d',
        parameters: {
          sentimentThreshold: 65,
          trendConfirmation: true,
          newsWeight: 40,
          socialWeight: 60
        },
        indicators: ['Sentiment', 'Volume', 'News'],
        performance: {
          winRate: 61,
          profitFactor: 1.6,
          trades: 85,
          returns: 37.2
        }
      },
      {
        id: 'strategy-4',
        name: 'MultiTimeframe ML',
        description: 'Machine learning strategy using multiple timeframe analysis',
        type: 'machine-learning',
        timeframe: 'multi',
        parameters: {
          primaryTimeframe: '4h',
          secondaryTimeframe: '1d',
          tertiaryTimeframe: '1h',
          features: 15,
          confidenceThreshold: 75
        },
        indicators: ['ML', 'MACD', 'OBV', 'ATR'],
        performance: {
          winRate: 68,
          profitFactor: 2.3,
          trades: 142,
          returns: 61.4
        }
      },
      {
        id: 'strategy-5',
        name: 'Hybrid Predictor',
        description: 'Combines technical analysis with AI price prediction',
        type: 'hybrid',
        timeframe: '1d',
        parameters: {
          modelAccuracyThreshold: 70,
          technicalWeight: 60,
          predictionWeight: 40,
          confirmationPeriod: 2
        },
        indicators: ['Prediction', 'MACD', 'RSI', 'Support/Resistance'],
        performance: {
          winRate: 70,
          profitFactor: 2.5,
          trades: 95,
          returns: 74.3
        }
      }
    ];
  },
  
  /**
   * Backtest a trading strategy with historical data
   */
  async backtestStrategy(
    strategy: AITradingStrategy,
    coinId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    returns: number;
    winRate: number;
    trades: number;
    sharpeRatio: number;
    maxDrawdown: number;
    tradeHistory: Trade[];
  }> {
    // This is a mock implementation
    // In a real system, this would run the strategy against historical data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock performance metrics based on strategy type
    const performanceByType: Record<string, any> = {
      'trend-following': {
        returns: 35 + Math.random() * 20,
        winRate: 60 + Math.random() * 15,
        trades: Math.floor(80 + Math.random() * 60),
        sharpeRatio: 1.2 + Math.random() * 0.8,
        maxDrawdown: 12 + Math.random() * 8
      },
      'mean-reversion': {
        returns: 40 + Math.random() * 25,
        winRate: 65 + Math.random() * 15,
        trades: Math.floor(100 + Math.random() * 120),
        sharpeRatio: 1.5 + Math.random() * 1.0,
        maxDrawdown: 10 + Math.random() * 10
      },
      'breakout': {
        returns: 30 + Math.random() * 40,
        winRate: 55 + Math.random() * 15,
        trades: Math.floor(60 + Math.random() * 40),
        sharpeRatio: 1.3 + Math.random() * 0.7,
        maxDrawdown: 15 + Math.random() * 10
      },
      'sentiment': {
        returns: 25 + Math.random() * 30,
        winRate: 58 + Math.random() * 12,
        trades: Math.floor(50 + Math.random() * 40),
        sharpeRatio: 1.1 + Math.random() * 0.6,
        maxDrawdown: 18 + Math.random() * 7
      },
      'machine-learning': {
        returns: 45 + Math.random() * 35,
        winRate: 68 + Math.random() * 12,
        trades: Math.floor(90 + Math.random() * 60),
        sharpeRatio: 1.6 + Math.random() * 1.2,
        maxDrawdown: 14 + Math.random() * 8
      },
      'multi-timeframe': {
        returns: 42 + Math.random() * 30,
        winRate: 67 + Math.random() * 13,
        trades: Math.floor(85 + Math.random() * 70),
        sharpeRatio: 1.4 + Math.random() * 1.0,
        maxDrawdown: 13 + Math.random() * 9
      },
      'hybrid': {
        returns: 50 + Math.random() * 40,
        winRate: 70 + Math.random() * 15,
        trades: Math.floor(70 + Math.random() * 50),
        sharpeRatio: 1.7 + Math.random() * 1.3,
        maxDrawdown: 12 + Math.random() * 8
      }
    };
    
    // Use default metrics if strategy type doesn't match
    const metrics = performanceByType[strategy.type] || {
      returns: 30 + Math.random() * 20,
      winRate: 60 + Math.random() * 10,
      trades: Math.floor(70 + Math.random() * 50),
      sharpeRatio: 1.2 + Math.random() * 0.8,
      maxDrawdown: 15 + Math.random() * 10
    };
    
    // Generate mock trade history
    const tradeHistory: Trade[] = [];
    const tradeCount = metrics.trades;
    const winRate = metrics.winRate / 100;
    
    // Mock start price
    let price = coinId === 'bitcoin' ? 45000 : 3000;
    
    // Generate trades spread across the date range
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    const timeSpan = endTimestamp - startTimestamp;
    
    for (let i = 0; i < tradeCount; i++) {
      // Determine if this trade is a win based on win rate
      const isWin = Math.random() < winRate;
      
      // Calculate trade parameters
      const tradeTime = new Date(startTimestamp + (timeSpan * (i / tradeCount))).toISOString();
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const amount = Math.random() * (coinId === 'bitcoin' ? 0.5 : 5);
      
      // Update price with some random walk
      price = price * (1 + (Math.random() * 0.05 - 0.025));
      
      // Calculate profit/loss (wins make 2-4%, losses lose 1-2%)
      const profitPct = isWin 
        ? (Math.random() * 2 + 2) / 100 
        : -(Math.random() * 1 + 1) / 100;
      
      tradeHistory.push({
        id: uuidv4(),
        coinId,
        coinName: coinId === 'bitcoin' ? 'Bitcoin' : 'Ethereum',
        coinSymbol: coinId === 'bitcoin' ? 'BTC' : 'ETH',
        type,
        amount,
        price,
        total: amount * price,
        totalValue: amount * price,
        timestamp: tradeTime,
        currency: 'USD',
        profitLoss: price * amount * profitPct,
        strategyId: strategy.id
      });
    }
    
    return {
      returns: metrics.returns,
      winRate: metrics.winRate,
      trades: metrics.trades,
      sharpeRatio: metrics.sharpeRatio,
      maxDrawdown: metrics.maxDrawdown,
      tradeHistory
    };
  }
};

export default aiTradingService;
