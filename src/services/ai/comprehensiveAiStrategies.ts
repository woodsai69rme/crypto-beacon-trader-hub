
import { AITradingStrategy, CoinOption, TradingSignal } from '@/types/trading';

// Mock AI analysis functions
const analyzeTrend = (data: number[]): 'bullish' | 'bearish' | 'neutral' => {
  const recent = data.slice(-5);
  const earlier = data.slice(-10, -5);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  
  if (recentAvg > earlierAvg * 1.02) return 'bullish';
  if (recentAvg < earlierAvg * 0.98) return 'bearish';
  return 'neutral';
};

const calculateVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0;
  
  const returns = prices.slice(1).map((price, i) => 
    Math.log(price / prices[i])
  );
  
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
};

const generateMomentumSignal = (coin: CoinOption): TradingSignal => {
  const strength = Math.random() * 100;
  const type = Math.random() > 0.5 ? 'buy' : 'sell';
  
  return {
    id: `signal-${coin.id}-${Date.now()}`,
    coinId: coin.id,
    coinSymbol: coin.symbol,
    type,
    price: coin.price,
    strength,
    timestamp: new Date().toISOString(),
    reason: `Momentum analysis indicates ${type} signal with ${strength.toFixed(1)}% confidence`,
    suggestedActions: {
      entry: coin.price * (type === 'buy' ? 0.99 : 1.01),
      target: coin.price * (type === 'buy' ? 1.05 : 0.95),
      stopLoss: coin.price * (type === 'buy' ? 0.95 : 1.05)
    }
  };
};

// Comprehensive AI Strategies Implementation
export const comprehensiveAiStrategies = {
  // Trend Following Strategy
  trendFollowing: (coins: CoinOption[]): TradingSignal[] => {
    return coins.map(coin => {
      const mockPriceHistory = Array.from({ length: 20 }, (_, i) => 
        coin.price * (1 + (Math.random() - 0.5) * 0.1)
      );
      
      const trend = analyzeTrend(mockPriceHistory);
      const strength = Math.random() * 80 + 20; // 20-100%
      
      return {
        id: `trend-${coin.id}-${Date.now()}`,
        coinId: coin.id,
        coinSymbol: coin.symbol,
        type: trend === 'bullish' ? 'buy' : trend === 'bearish' ? 'sell' : 'buy',
        price: coin.price,
        strength,
        timestamp: new Date().toISOString(),
        reason: `Trend analysis shows ${trend} momentum with ${strength.toFixed(1)}% confidence`,
        suggestedActions: {
          entry: coin.price,
          target: coin.price * (trend === 'bullish' ? 1.08 : 0.92),
          stopLoss: coin.price * (trend === 'bullish' ? 0.95 : 1.05)
        }
      };
    });
  },

  // Mean Reversion Strategy
  meanReversion: (coins: CoinOption[]): TradingSignal[] => {
    return coins.map(coin => {
      const mockPriceHistory = Array.from({ length: 50 }, (_, i) => 
        coin.price * (1 + Math.sin(i * 0.1) * 0.1 + (Math.random() - 0.5) * 0.05)
      );
      
      const sma = mockPriceHistory.reduce((sum, price) => sum + price, 0) / mockPriceHistory.length;
      const deviation = (coin.price - sma) / sma;
      const strength = Math.abs(deviation) * 100;
      
      return {
        id: `mean-reversion-${coin.id}-${Date.now()}`,
        coinId: coin.id,
        coinSymbol: coin.symbol,
        type: deviation > 0.02 ? 'sell' : deviation < -0.02 ? 'buy' : 'buy',
        price: coin.price,
        strength: Math.min(strength, 100),
        timestamp: new Date().toISOString(),
        reason: `Price is ${Math.abs(deviation * 100).toFixed(1)}% ${deviation > 0 ? 'above' : 'below'} mean`,
        suggestedActions: {
          entry: coin.price,
          target: sma,
          stopLoss: coin.price * (deviation > 0 ? 1.03 : 0.97)
        }
      };
    });
  },

  // Breakout Strategy
  breakoutStrategy: (coins: CoinOption[]): TradingSignal[] => {
    return coins.map(coin => {
      const volatility = calculateVolatility(Array.from({ length: 20 }, () => 
        coin.price * (1 + (Math.random() - 0.5) * 0.05)
      ));
      
      const isBreakout = volatility > 0.3; // High volatility threshold
      const strength = isBreakout ? Math.random() * 40 + 60 : Math.random() * 30;
      
      return {
        id: `breakout-${coin.id}-${Date.now()}`,
        coinId: coin.id,
        coinSymbol: coin.symbol,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        price: coin.price,
        strength,
        timestamp: new Date().toISOString(),
        reason: isBreakout ? 'Breakout pattern detected' : 'Consolidation phase, low breakout probability',
        suggestedActions: {
          entry: coin.price,
          target: coin.price * (isBreakout ? 1.12 : 1.03),
          stopLoss: coin.price * (isBreakout ? 0.92 : 0.98)
        }
      };
    });
  },

  // Momentum Strategy
  momentumStrategy: (coins: CoinOption[]): TradingSignal[] => {
    return coins.map(generateMomentumSignal);
  },

  // Sentiment Analysis Strategy
  sentimentStrategy: (coins: CoinOption[]): TradingSignal[] => {
    return coins.map(coin => {
      const sentiment = Math.random(); // Mock sentiment score 0-1
      const strength = sentiment * 100;
      
      return {
        id: `sentiment-${coin.id}-${Date.now()}`,
        coinId: coin.id,
        coinSymbol: coin.symbol,
        type: sentiment > 0.6 ? 'buy' : sentiment < 0.4 ? 'sell' : 'buy',
        price: coin.price,
        strength,
        timestamp: new Date().toISOString(),
        reason: `Market sentiment is ${sentiment > 0.6 ? 'positive' : sentiment < 0.4 ? 'negative' : 'neutral'}`,
        suggestedActions: {
          entry: coin.price,
          target: coin.price * (sentiment > 0.6 ? 1.06 : 0.94),
          stopLoss: coin.price * (sentiment > 0.6 ? 0.96 : 1.04)
        }
      };
    });
  },

  // Grid Trading Strategy
  gridStrategy: (coins: CoinOption[]): TradingSignal[] => {
    return coins.map(coin => {
      const gridSize = 0.02; // 2% grid spacing
      const currentLevel = Math.floor(coin.price / (coin.price * gridSize));
      const strength = 70 + Math.random() * 20;
      
      return {
        id: `grid-${coin.id}-${Date.now()}`,
        coinId: coin.id,
        coinSymbol: coin.symbol,
        type: currentLevel % 2 === 0 ? 'buy' : 'sell',
        price: coin.price,
        strength,
        timestamp: new Date().toISOString(),
        reason: `Grid level ${currentLevel}, executing ${currentLevel % 2 === 0 ? 'buy' : 'sell'} order`,
        suggestedActions: {
          entry: coin.price,
          target: coin.price * (1 + gridSize),
          stopLoss: coin.price * (1 - gridSize * 2)
        }
      };
    });
  },

  // Arbitrage Strategy
  arbitrageStrategy: (coins: CoinOption[]): TradingSignal[] => {
    return coins.map(coin => {
      const exchangePrice1 = coin.price;
      const exchangePrice2 = coin.price * (1 + (Math.random() - 0.5) * 0.01); // ±0.5% difference
      const spread = Math.abs(exchangePrice1 - exchangePrice2) / exchangePrice1;
      const strength = spread * 1000; // Convert to percentage
      
      return {
        id: `arbitrage-${coin.id}-${Date.now()}`,
        coinId: coin.id,
        coinSymbol: coin.symbol,
        type: exchangePrice1 < exchangePrice2 ? 'buy' : 'sell',
        price: coin.price,
        strength: Math.min(strength, 100),
        timestamp: new Date().toISOString(),
        reason: `Price spread of ${(spread * 100).toFixed(3)}% detected between exchanges`,
        suggestedActions: {
          entry: Math.min(exchangePrice1, exchangePrice2),
          target: Math.max(exchangePrice1, exchangePrice2),
          stopLoss: Math.min(exchangePrice1, exchangePrice2) * 0.999
        }
      };
    });
  }
};

// Strategy factory
export const createAiStrategy = (strategyType: string): AITradingStrategy => {
  const baseStrategy: AITradingStrategy = {
    id: `strategy-${Date.now()}`,
    name: '',
    description: '',
    type: 'custom',
    riskLevel: 'medium',
    profitPotential: 'medium',
    timeframe: 24,
    parameters: {},
    backtestResults: {
      winRate: 65,
      profitFactor: 1.5,
      maxDrawdown: 15,
      sharpeRatio: 1.2
    }
  };

  switch (strategyType) {
    case 'trend-following':
      return {
        ...baseStrategy,
        name: 'AI Trend Following',
        description: 'Uses machine learning to identify and follow market trends',
        type: 'trend-following',
        indicators: ['SMA', 'EMA', 'MACD', 'RSI'],
        riskLevel: 'medium',
        profitPotential: 'high'
      };
    
    case 'mean-reversion':
      return {
        ...baseStrategy,
        name: 'AI Mean Reversion',
        description: 'Identifies overbought/oversold conditions for counter-trend trades',
        type: 'mean-reversion',
        indicators: ['Bollinger Bands', 'RSI', 'Stochastic'],
        riskLevel: 'low',
        profitPotential: 'medium'
      };
    
    case 'breakout':
      return {
        ...baseStrategy,
        name: 'AI Breakout Detection',
        description: 'Detects and trades volatility breakouts and consolidation patterns',
        type: 'breakout',
        indicators: ['ATR', 'Volume', 'Support/Resistance'],
        riskLevel: 'high',
        profitPotential: 'high'
      };
    
    default:
      return baseStrategy;
  }
};
