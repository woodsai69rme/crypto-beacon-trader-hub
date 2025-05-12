
import { AITradingStrategy } from "@/types/trading";

// Default strategy parameters used when creating a new strategy
export const DEFAULT_STRATEGY_PARAMETERS = {
  period: 14,
  threshold: 70,
  stopLoss: 5,
  takeProfit: 10,
  useVolume: true,
  indicator: 'rsi',
  allowWeekendTrading: false,
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9,
  upperBand: 70,
  lowerBand: 30,
  riskFactor: 1.5,
  marketCapFilter: 1000000000, // $1B minimum market cap
  volumeThreshold: 100000000, // $100M minimum 24h volume
  volatilityFilter: 0.05, // 5% minimum volatility
  maxLeverage: 1, // No leverage by default
  trailingStopLoss: false,
  dynamicPositionSizing: false,
  rebalancePeriod: 0, // No automatic rebalancing
  correlationThreshold: 0.7 // For correlation-based strategies
};

// Predefined strategies for the application
export const predefinedStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-1',
    name: 'RSI Mean Reversion',
    description: 'Trades oversold and overbought conditions using RSI',
    type: 'mean-reversion',
    timeframe: '1h',
    riskLevel: 'Medium',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      period: 14,
      threshold: 30,
      indicator: 'rsi',
      lowerBand: 30,
      upperBand: 70,
      stopLoss: 3,
      takeProfit: 6
    }
  },
  {
    id: 'strategy-2',
    name: 'MACD Trend Following',
    description: 'Follows market trends using MACD crossovers',
    type: 'trend-following',
    timeframe: '4h',
    riskLevel: 'Medium',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      indicator: 'macd',
      stopLoss: 5,
      takeProfit: 15
    }
  },
  {
    id: 'strategy-3',
    name: 'Bollinger Breakout',
    description: 'Captures price breakouts from Bollinger Bands',
    type: 'breakout',
    timeframe: '15m',
    riskLevel: 'High',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      period: 20,
      indicator: 'bb',
      stopLoss: 3,
      takeProfit: 9,
      volatilityFilter: 0.08 // 8% minimum volatility
    }
  },
  {
    id: 'strategy-4',
    name: 'Moving Average Crossover',
    description: 'Detects trend changes using moving average crossovers',
    type: 'trend-following',
    timeframe: '1d',
    riskLevel: 'Low',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      fastPeriod: 9,
      slowPeriod: 21,
      indicator: 'ma',
      useVolume: true,
      stopLoss: 8,
      takeProfit: 20
    }
  },
  {
    id: 'strategy-5',
    name: 'Sentiment-Based Trading',
    description: 'Uses market sentiment analysis to find trading opportunities',
    type: 'sentiment',
    timeframe: '4h',
    riskLevel: 'Medium',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      sentimentThreshold: 65,
      sentimentTimeframe: '24h',
      useVolume: true,
      indicator: 'sentiment',
      stopLoss: 6,
      takeProfit: 12
    }
  },
  {
    id: 'strategy-6',
    name: 'Volume-Weighted RSI',
    description: 'RSI strategy that incorporates trading volume for signal strength',
    type: 'mean-reversion',
    timeframe: '2h',
    riskLevel: 'Medium-High',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      period: 14,
      indicator: 'rsi',
      useVolume: true,
      volumeThreshold: 200000000, // $200M minimum volume
      lowerBand: 25,
      upperBand: 75,
      stopLoss: 4,
      takeProfit: 12
    }
  },
  {
    id: 'strategy-7',
    name: 'Multi-Timeframe Momentum',
    description: 'Aligns multiple timeframes to confirm strong momentum trends',
    type: 'momentum',
    timeframe: '1h',
    riskLevel: 'High',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      indicator: 'momentum',
      primaryTimeframe: '1h',
      secondaryTimeframe: '4h',
      tertiaryTimeframe: '1d',
      momentumThreshold: 70,
      stopLoss: 5,
      takeProfit: 15,
      trailingStopLoss: true
    }
  },
  {
    id: 'strategy-8',
    name: 'Correlation Arbitrage',
    description: 'Exploits temporary divergences between historically correlated assets',
    type: 'arbitrage',
    timeframe: '30m',
    riskLevel: 'Medium',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      indicator: 'correlation',
      correlationThreshold: 0.8,
      correlationLookback: 90, // 90 days of historical correlation
      divergenceThreshold: 0.15, // 15% divergence triggers trade
      stopLoss: 4,
      takeProfit: 8,
      rebalancePeriod: 24 // hours
    },
    assets: ['bitcoin', 'ethereum'] // Default pair
  },
  {
    id: 'strategy-9',
    name: 'Adaptive Position Sizing',
    description: 'Dynamically adjusts position size based on market volatility',
    type: 'volatility',
    timeframe: '1d',
    riskLevel: 'Medium',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      indicator: 'atr', // Average True Range
      period: 14,
      dynamicPositionSizing: true,
      baseRisk: 1, // % of portfolio per trade
      maxPositionSize: 10, // % of portfolio
      stopLoss: 10,
      takeProfit: 30
    }
  },
  {
    id: 'strategy-10',
    name: 'Smart Grid Trading',
    description: 'Places multiple buy and sell orders at key support and resistance levels',
    type: 'grid',
    timeframe: '4h',
    riskLevel: 'Low-Medium',
    parameters: {
      ...DEFAULT_STRATEGY_PARAMETERS,
      indicator: 'grid',
      gridLevels: 5, // Number of grid levels
      gridSpacing: 2, // % between grid levels
      upperLimit: 10, // % above entry for highest sell grid
      lowerLimit: 10, // % below entry for lowest buy grid
      stopLoss: 15, // Only triggers after entire grid is compromised
      takeProfit: 0 // No take profit, profits taken at grid levels
    }
  }
];

// Strategy templates by type
export const strategyTemplates = {
  'mean-reversion': {
    ...DEFAULT_STRATEGY_PARAMETERS,
    indicator: 'rsi',
    period: 14,
    lowerBand: 30,
    upperBand: 70,
    stopLoss: 5,
    takeProfit: 10
  },
  'trend-following': {
    ...DEFAULT_STRATEGY_PARAMETERS,
    indicator: 'macd',
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    stopLoss: 8,
    takeProfit: 15
  },
  'breakout': {
    ...DEFAULT_STRATEGY_PARAMETERS,
    indicator: 'bb',
    period: 20,
    volatilityFilter: 0.08,
    stopLoss: 5,
    takeProfit: 15
  },
  'momentum': {
    ...DEFAULT_STRATEGY_PARAMETERS,
    indicator: 'momentum',
    period: 10,
    threshold: 70,
    stopLoss: 7,
    takeProfit: 20
  },
  'arbitrage': {
    ...DEFAULT_STRATEGY_PARAMETERS,
    indicator: 'correlation',
    correlationThreshold: 0.8,
    correlationLookback: 90,
    divergenceThreshold: 0.1,
    stopLoss: 3,
    takeProfit: 6
  }
};

// Maps indicators to their required parameters
export const indicatorParameters = {
  'rsi': ['period', 'upperBand', 'lowerBand'],
  'macd': ['fastPeriod', 'slowPeriod', 'signalPeriod'],
  'bb': ['period', 'stdDev'],
  'ma': ['fastPeriod', 'slowPeriod'],
  'momentum': ['period', 'threshold'],
  'atr': ['period'],
  'sentiment': ['sentimentThreshold', 'sentimentTimeframe'],
  'correlation': ['correlationThreshold', 'correlationLookback', 'divergenceThreshold'],
  'grid': ['gridLevels', 'gridSpacing', 'upperLimit', 'lowerLimit']
};

// Generates a new strategy with default parameters
export const createNewStrategy = (type: string, name: string): AITradingStrategy => {
  const template = strategyTemplates[type as keyof typeof strategyTemplates] || DEFAULT_STRATEGY_PARAMETERS;
  
  return {
    id: `strategy-${Date.now()}`,
    name: name || `New ${type} Strategy`,
    description: `Custom ${type} strategy`,
    type,
    timeframe: '1h',
    riskLevel: 'Medium',
    parameters: { ...template }
  };
};

// Validates if a strategy has all required parameters for its indicator
export const validateStrategy = (strategy: AITradingStrategy): boolean => {
  const indicator = strategy.parameters.indicator as string;
  if (!indicator || !indicatorParameters[indicator]) return false;
  
  const requiredParams = indicatorParameters[indicator];
  return requiredParams.every(param => strategy.parameters[param] !== undefined);
};
