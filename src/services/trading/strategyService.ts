
import { AITradingStrategy } from '@/types/trading';

export const TRADING_STRATEGIES: AITradingStrategy[] = [
  {
    id: 'sma-crossover',
    name: 'SMA Crossover',
    description: 'Simple Moving Average crossover strategy',
    type: 'trend-following',
    timeframe: '1h',
    parameters: { shortPeriod: 10, longPeriod: 20 },
    riskLevel: 'medium',
    indicators: ['SMA'],
    triggers: ['SMA crossover'],
    confidence: 0.75,
    performance: { winRate: 65, profitFactor: 1.8, sharpeRatio: 1.4 }
  },
  {
    id: 'ema-crossover',
    name: 'EMA Crossover',
    description: 'Exponential Moving Average crossover strategy',
    type: 'trend-following',
    timeframe: '1h',
    parameters: { shortPeriod: 12, longPeriod: 26 },
    riskLevel: 'medium',
    indicators: ['EMA'],
    triggers: ['EMA crossover'],
    confidence: 0.78,
    performance: { winRate: 68, profitFactor: 1.9, sharpeRatio: 1.5 }
  },
  {
    id: 'rsi-oversold',
    name: 'RSI Oversold/Overbought',
    description: 'Relative Strength Index reversal strategy',
    type: 'mean-reversion',
    timeframe: '4h',
    parameters: { oversold: 30, overbought: 70, period: 14 },
    riskLevel: 'low',
    indicators: ['RSI'],
    triggers: ['RSI < 30', 'RSI > 70'],
    confidence: 0.72,
    performance: { winRate: 72, profitFactor: 1.5, sharpeRatio: 1.7 }
  },
  {
    id: 'macd-divergence',
    name: 'MACD Divergence',
    description: 'MACD signal line divergence strategy',
    type: 'trend-following',
    timeframe: '2h',
    parameters: { fast: 12, slow: 26, signal: 9 },
    riskLevel: 'medium',
    indicators: ['MACD'],
    triggers: ['MACD divergence'],
    confidence: 0.76,
    performance: { winRate: 66, profitFactor: 1.7, sharpeRatio: 1.3 }
  },
  {
    id: 'bollinger-squeeze',
    name: 'Bollinger Band Squeeze',
    description: 'Bollinger Bands volatility breakout',
    type: 'breakout',
    timeframe: '1h',
    parameters: { period: 20, stdDev: 2 },
    riskLevel: 'high',
    indicators: ['Bollinger Bands'],
    triggers: ['Band squeeze breakout'],
    confidence: 0.69,
    performance: { winRate: 58, profitFactor: 2.1, sharpeRatio: 1.2 }
  },
  {
    id: 'stochastic-oversold',
    name: 'Stochastic Oscillator',
    description: 'Stochastic oversold/overbought strategy',
    type: 'mean-reversion',
    timeframe: '1h',
    parameters: { kPeriod: 14, dPeriod: 3, oversold: 20, overbought: 80 },
    riskLevel: 'medium',
    indicators: ['Stochastic'],
    triggers: ['Stochastic < 20', 'Stochastic > 80'],
    confidence: 0.71,
    performance: { winRate: 69, profitFactor: 1.6, sharpeRatio: 1.4 }
  },
  {
    id: 'williams-r',
    name: 'Williams %R',
    description: 'Williams %R momentum oscillator',
    type: 'mean-reversion',
    timeframe: '2h',
    parameters: { period: 14, oversold: -80, overbought: -20 },
    riskLevel: 'medium',
    indicators: ['Williams %R'],
    triggers: ['Williams %R reversal'],
    confidence: 0.67,
    performance: { winRate: 64, profitFactor: 1.4, sharpeRatio: 1.1 }
  },
  {
    id: 'volume-weighted-avg',
    name: 'VWAP Strategy',
    description: 'Volume Weighted Average Price strategy',
    type: 'trend-following',
    timeframe: '1d',
    parameters: { period: 20 },
    riskLevel: 'low',
    indicators: ['VWAP'],
    triggers: ['Price vs VWAP'],
    confidence: 0.73,
    performance: { winRate: 70, profitFactor: 1.3, sharpeRatio: 1.6 }
  },
  {
    id: 'ichimoku-cloud',
    name: 'Ichimoku Cloud',
    description: 'Ichimoku Kinko Hyo trend strategy',
    type: 'trend-following',
    timeframe: '4h',
    parameters: { tenkan: 9, kijun: 26, senkou: 52 },
    riskLevel: 'medium',
    indicators: ['Ichimoku'],
    triggers: ['Cloud breakout'],
    confidence: 0.74,
    performance: { winRate: 67, profitFactor: 1.8, sharpeRatio: 1.5 }
  },
  {
    id: 'fibonacci-retracement',
    name: 'Fibonacci Retracement',
    description: 'Fibonacci level support/resistance',
    type: 'mean-reversion',
    timeframe: '2h',
    parameters: { levels: [0.236, 0.382, 0.5, 0.618, 0.786] },
    riskLevel: 'medium',
    indicators: ['Fibonacci'],
    triggers: ['Fibonacci level bounce'],
    confidence: 0.68,
    performance: { winRate: 63, profitFactor: 1.6, sharpeRatio: 1.2 }
  },
  {
    id: 'parabolic-sar',
    name: 'Parabolic SAR',
    description: 'Parabolic Stop and Reverse trend following',
    type: 'trend-following',
    timeframe: '1h',
    parameters: { acceleration: 0.02, maximum: 0.2 },
    riskLevel: 'medium',
    indicators: ['Parabolic SAR'],
    triggers: ['SAR flip'],
    confidence: 0.69,
    performance: { winRate: 61, profitFactor: 1.7, sharpeRatio: 1.3 }
  },
  {
    id: 'adx-trend',
    name: 'ADX Trend Strength',
    description: 'Average Directional Index trend strength',
    type: 'trend-following',
    timeframe: '2h',
    parameters: { period: 14, threshold: 25 },
    riskLevel: 'medium',
    indicators: ['ADX', 'DI+', 'DI-'],
    triggers: ['ADX > 25'],
    confidence: 0.71,
    performance: { winRate: 65, profitFactor: 1.5, sharpeRatio: 1.4 }
  },
  {
    id: 'commodity-channel',
    name: 'Commodity Channel Index',
    description: 'CCI overbought/oversold strategy',
    type: 'mean-reversion',
    timeframe: '1h',
    parameters: { period: 20, overbought: 100, oversold: -100 },
    riskLevel: 'medium',
    indicators: ['CCI'],
    triggers: ['CCI extremes'],
    confidence: 0.66,
    performance: { winRate: 62, profitFactor: 1.4, sharpeRatio: 1.1 }
  },
  {
    id: 'momentum-oscillator',
    name: 'Momentum Oscillator',
    description: 'Price momentum indicator strategy',
    type: 'momentum',
    timeframe: '1h',
    parameters: { period: 10, threshold: 5 },
    riskLevel: 'high',
    indicators: ['Momentum'],
    triggers: ['Momentum divergence'],
    confidence: 0.64,
    performance: { winRate: 59, profitFactor: 1.9, sharpeRatio: 1.0 }
  },
  {
    id: 'on-balance-volume',
    name: 'On Balance Volume',
    description: 'Volume-price trend confirmation',
    type: 'trend-following',
    timeframe: '2h',
    parameters: {},
    riskLevel: 'low',
    indicators: ['OBV'],
    triggers: ['OBV divergence'],
    confidence: 0.70,
    performance: { winRate: 68, profitFactor: 1.4, sharpeRatio: 1.5 }
  },
  {
    id: 'money-flow-index',
    name: 'Money Flow Index',
    description: 'Volume-weighted RSI strategy',
    type: 'mean-reversion',
    timeframe: '1h',
    parameters: { period: 14, overbought: 80, oversold: 20 },
    riskLevel: 'medium',
    indicators: ['MFI'],
    triggers: ['MFI reversal'],
    confidence: 0.67,
    performance: { winRate: 64, profitFactor: 1.5, sharpeRatio: 1.2 }
  }
];

export const getAvailableStrategies = (): AITradingStrategy[] => {
  return TRADING_STRATEGIES;
};

export const getStrategyById = (id: string): AITradingStrategy | undefined => {
  return TRADING_STRATEGIES.find(strategy => strategy.id === id);
};

export const getStrategiesByType = (type: string): AITradingStrategy[] => {
  return TRADING_STRATEGIES.filter(strategy => strategy.type === type);
};
