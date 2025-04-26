
import { AITradingStrategy, BacktestResult, StrategyParameter, OptimizationResult, TradingTimeframe, TechnicalIndicator } from '@/types/trading';

// Define trading timeframes
export const tradingTimeframes: TradingTimeframe[] = [
  { label: '1m', value: '1m', minutes: 1, description: '1 Minute' },
  { label: '5m', value: '5m', minutes: 5, description: '5 Minutes' },
  { label: '15m', value: '15m', minutes: 15, description: '15 Minutes' },
  { label: '30m', value: '30m', minutes: 30, description: '30 Minutes' },
  { label: '1h', value: '1h', minutes: 60, description: '1 Hour' },
  { label: '2h', value: '2h', minutes: 120, description: '2 Hours' },
  { label: '4h', value: '4h', minutes: 240, description: '4 Hours' },
  { label: '1d', value: '1d', minutes: 1440, description: '1 Day' },
  { label: '1w', value: '1w', minutes: 10080, description: '1 Week' },
  { label: '1M', value: '1M', minutes: 43200, description: '1 Month' }
];

// Define technical indicators
export const technicalIndicators: TechnicalIndicator[] = [
  {
    name: 'Relative Strength Index',
    key: 'RSI',
    description: 'Momentum oscillator that measures the speed and change of price movements',
    category: 'momentum',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', value: 14, min: 2, max: 50, step: 1 }
    ]
  },
  {
    name: 'Moving Average Convergence Divergence',
    key: 'MACD',
    description: 'Trend-following momentum indicator showing the relationship between two moving averages',
    category: 'momentum',
    parameters: [
      { name: 'fastPeriod', label: 'Fast Period', type: 'number', value: 12, min: 2, max: 50, step: 1 },
      { name: 'slowPeriod', label: 'Slow Period', type: 'number', value: 26, min: 2, max: 50, step: 1 },
      { name: 'signalPeriod', label: 'Signal Period', type: 'number', value: 9, min: 2, max: 50, step: 1 }
    ]
  },
  {
    name: 'Bollinger Bands',
    key: 'BB',
    description: 'Volatility bands placed above and below a moving average',
    category: 'volatility',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', value: 20, min: 2, max: 50, step: 1 },
      { name: 'stdDev', label: 'Standard Deviations', type: 'number', value: 2, min: 1, max: 5, step: 0.5 }
    ]
  },
  {
    name: 'Simple Moving Average',
    key: 'SMA',
    description: 'Arithmetic moving average calculated by adding recent prices and dividing by the number of time periods',
    category: 'trend',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', value: 50, min: 2, max: 200, step: 1 }
    ]
  },
  {
    name: 'Exponential Moving Average',
    key: 'EMA',
    description: 'Moving average that gives more weight to recent prices',
    category: 'trend',
    parameters: [
      { name: 'period', label: 'Period', type: 'number', value: 21, min: 2, max: 200, step: 1 }
    ]
  }
];

export const predefinedStrategies: AITradingStrategy[] = [
  {
    id: "momentum-ai",
    name: "AI Momentum Strategy",
    description: "Uses AI to identify and trade on momentum patterns across multiple timeframes",
    type: "ai",
    color: "#3B82F6",
    indicators: ["RSI", "MACD", "Volume"],
    timeframes: ["1h", "4h", "1d"],
    riskLevel: "Medium",
    parameters: [
      { name: "rsiThreshold", label: "RSI Threshold", type: "number", value: 70, min: 50, max: 90, step: 1 },
      { name: "volumeMultiplier", label: "Volume Multiplier", type: "number", value: 1.5, min: 1, max: 5, step: 0.1 },
      { name: "stopLoss", label: "Stop Loss %", type: "number", value: 3, min: 1, max: 10, step: 0.5 },
      { name: "takeProfit", label: "Take Profit %", type: "number", value: 5, min: 2, max: 20, step: 0.5 }
    ],
    stats: {
      winRate: 68,
      averageReturn: 2.4,
      riskLevel: "Medium",
      maxDrawdown: 12
    },
    model: "Enhanced Neural Network",
    author: "Trading AI Team",
    creationDate: "2025-01-15",
    version: "2.1.0"
  },
  {
    id: "trend-following",
    name: "Trend Following",
    description: "Classic trend following strategy using moving averages and breakout signals",
    type: "traditional",
    color: "#10B981",
    indicators: ["SMA", "EMA", "Bollinger Bands"],
    timeframes: ["4h", "1d"],
    riskLevel: "Low",
    parameters: [
      { name: "fastMAPeriod", label: "Fast MA Period", type: "number", value: 20, min: 5, max: 50, step: 1 },
      { name: "slowMAPeriod", label: "Slow MA Period", type: "number", value: 50, min: 20, max: 200, step: 1 },
      { name: "stopLoss", label: "Stop Loss %", type: "number", value: 5, min: 1, max: 15, step: 0.5 }
    ],
    stats: {
      winRate: 58,
      averageReturn: 1.8,
      riskLevel: "Low",
      maxDrawdown: 8
    }
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description: "Strategy that capitalizes on price deviations from historical averages",
    type: "traditional",
    color: "#F59E0B",
    indicators: ["Bollinger Bands", "RSI", "Stochastic"],
    timeframes: ["15m", "1h", "4h"],
    riskLevel: "Medium",
    parameters: [
      { name: "bbPeriod", label: "Bollinger Band Period", type: "number", value: 20, min: 10, max: 50, step: 1 },
      { name: "bbDeviation", label: "Bollinger Band Deviation", type: "number", value: 2, min: 1, max: 4, step: 0.1 },
      { name: "rsiPeriod", label: "RSI Period", type: "number", value: 14, min: 7, max: 30, step: 1 },
      { name: "rsiOverbought", label: "RSI Overbought", type: "number", value: 70, min: 60, max: 90, step: 1 },
      { name: "rsiOversold", label: "RSI Oversold", type: "number", value: 30, min: 10, max: 40, step: 1 }
    ],
    stats: {
      winRate: 62,
      averageReturn: 1.5,
      riskLevel: "Medium",
      maxDrawdown: 15
    }
  },
  {
    id: "adaptive-neural-net",
    name: "Adaptive Neural Network",
    description: "Deep learning model that adapts to changing market conditions",
    type: "ai",
    color: "#8B5CF6",
    indicators: ["Custom Neural Indicators"],
    timeframes: ["1h", "4h", "1d"],
    riskLevel: "High",
    parameters: [
      { name: "learningRate", label: "Learning Rate", type: "number", value: 0.001, min: 0.0001, max: 0.01, step: 0.0001 },
      { name: "epochs", label: "Training Epochs", type: "number", value: 50, min: 10, max: 200, step: 5 },
      { name: "lookbackPeriod", label: "Lookback Period", type: "number", value: 60, min: 20, max: 200, step: 5 },
      { name: "batchSize", label: "Batch Size", type: "number", value: 32, min: 8, max: 128, step: 8 }
    ],
    stats: {
      winRate: 72,
      averageReturn: 3.2,
      riskLevel: "High",
      maxDrawdown: 18
    },
    model: "Deep Neural Network",
    author: "AI Research Team",
    creationDate: "2024-12-10",
    version: "3.0.2"
  },
  {
    id: "sentiment-analysis",
    name: "Sentiment Analysis",
    description: "Analyzes market sentiment from social media and news sources",
    type: "ai",
    color: "#EC4899",
    indicators: ["Social Media Metrics", "News Sentiment"],
    timeframes: ["4h", "1d"],
    riskLevel: "Medium-High",
    parameters: [
      { name: "sentimentThreshold", label: "Sentiment Threshold", type: "number", value: 0.6, min: 0.1, max: 0.9, step: 0.05 },
      { name: "newsWeight", label: "News Weight", type: "number", value: 0.7, min: 0.1, max: 1, step: 0.05 },
      { name: "socialMediaWeight", label: "Social Media Weight", type: "number", value: 0.3, min: 0.1, max: 1, step: 0.05 },
      { name: "minConfidence", label: "Minimum Confidence", type: "number", value: 0.65, min: 0.5, max: 0.95, step: 0.05 }
    ],
    stats: {
      winRate: 64,
      averageReturn: 2.8,
      riskLevel: "Medium-High",
      maxDrawdown: 16
    }
  },
  {
    id: "volatility-breakout",
    name: "Volatility Breakout",
    description: "Trades breakouts during periods of increasing market volatility",
    type: "traditional",
    color: "#EF4444",
    indicators: ["ATR", "Volatility", "Support/Resistance"],
    timeframes: ["15m", "1h", "4h"],
    riskLevel: "High",
    parameters: [
      { name: "atrPeriod", label: "ATR Period", type: "number", value: 14, min: 7, max: 30, step: 1 },
      { name: "atrMultiplier", label: "ATR Multiplier", type: "number", value: 2.5, min: 1, max: 5, step: 0.1 },
      { name: "breakoutThreshold", label: "Breakout Threshold", type: "number", value: 1.5, min: 1, max: 3, step: 0.1 }
    ],
    stats: {
      winRate: 54,
      averageReturn: 2.6,
      riskLevel: "High",
      maxDrawdown: 22
    }
  },
  {
    id: "ml-pattern-recognition",
    name: "ML Pattern Recognition",
    description: "Uses machine learning algorithms to identify chart patterns and predict price movements",
    type: "ai",
    color: "#6366F1",
    indicators: ["Pattern Detection", "Candlestick Analysis"],
    timeframes: ["1h", "4h", "1d"],
    riskLevel: "Medium-High",
    parameters: [
      { name: "patternConfidence", label: "Pattern Confidence", type: "number", value: 0.75, min: 0.5, max: 0.95, step: 0.05 },
      { name: "historyLength", label: "History Length", type: "number", value: 100, min: 50, max: 500, step: 10 },
      { name: "stopLoss", label: "Stop Loss %", type: "number", value: 3, min: 1, max: 10, step: 0.5 },
      { name: "takeProfit", label: "Take Profit %", type: "number", value: 6, min: 2, max: 20, step: 0.5 }
    ],
    stats: {
      winRate: 66,
      averageReturn: 2.9,
      riskLevel: "Medium-High",
      maxDrawdown: 14
    },
    model: "Pattern Recognition ML",
    author: "Quantitative Research Team",
    creationDate: "2025-02-08",
    version: "1.2.5"
  },
  {
    id: "multi-factor",
    name: "Multi-Factor Strategy",
    description: "Combines multiple technical and fundamental factors for more robust trading decisions",
    type: "hybrid",
    color: "#0EA5E9",
    indicators: ["Price Action", "Volume", "Market Breadth", "RSI"],
    timeframes: ["1h", "4h", "1d"],
    riskLevel: "Medium",
    parameters: [
      { name: "technicalWeight", label: "Technical Weight", type: "number", value: 0.6, min: 0.1, max: 0.9, step: 0.05 },
      { name: "fundamentalWeight", label: "Fundamental Weight", type: "number", value: 0.4, min: 0.1, max: 0.9, step: 0.05 },
      { name: "minimumSignals", label: "Minimum Signals", type: "number", value: 3, min: 1, max: 5, step: 1 }
    ],
    stats: {
      winRate: 64,
      averageReturn: 2.2,
      riskLevel: "Medium",
      maxDrawdown: 13
    },
    author: "Quantitative Strategy Team",
    version: "2.0.1"
  }
];

// Function to run a backtest on a strategy
export const runBacktest = async (
  strategyId: string,
  coinId: string,
  startDate: Date,
  endDate: Date,
  initialCapital: number,
  parameters: Record<string, any>
): Promise<BacktestResult> => {
  // This would normally fetch historical data and run the backtest
  // Here we'll just simulate it with some random but realistic results
  const strategy = predefinedStrategies.find(s => s.id === strategyId);
  if (!strategy) {
    throw new Error('Strategy not found');
  }
  
  // Simulate a delay to mimic API call and calculation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate trades based on strategy type
  const trades: BacktestTrade[] = [];
  const equity: {date: string; value: number}[] = [];
  
  let currentCapital = initialCapital;
  let totalTrades = Math.floor(Math.random() * 50) + 20; // 20 to 70 trades
  
  // Generate random trades
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();
  const timeRange = endTimestamp - startTimestamp;
  
  for (let i = 0; i < totalTrades; i++) {
    const tradeTime = new Date(startTimestamp + Math.random() * timeRange);
    const isBuy = Math.random() > 0.5;
    const price = 40000 + Math.random() * 30000; // Random price between 40k and 70k
    const amount = (Math.random() * 0.5 + 0.1).toFixed(6); // Between 0.1 and 0.6 BTC
    const value = price * parseFloat(amount);
    
    // Determine profit/loss for sell trades
    let profitLoss = undefined;
    let profitLossPercentage = undefined;
    
    if (!isBuy && trades.filter(t => t.type === 'buy').length > 0) {
      profitLoss = Math.random() > 0.4 ? Math.random() * 5000 : -Math.random() * 3000;
      profitLossPercentage = (profitLoss / value) * 100;
      currentCapital += profitLoss;
    } else if (isBuy) {
      // Subtract the purchase from capital
      currentCapital -= value;
    }
    
    trades.push({
      id: `trade-${i}`,
      date: tradeTime.toISOString(),
      type: isBuy ? 'buy' : 'sell',
      price,
      amount: parseFloat(amount),
      value,
      profitLoss,
      profitLossPercentage,
      reason: isBuy ? 
        `${strategy.indicators[0]} crossed ${strategy.indicators[1]}` : 
        `Take profit target reached`
    });
    
    // Add equity point
    equity.push({
      date: tradeTime.toISOString(),
      value: currentCapital + (isBuy ? value : 0) // Add value of purchased coins to equity
    });
  }
  
  // Sort trades by date
  trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  equity.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate stats
  const winningTrades = trades.filter(t => t.profitLoss !== undefined && t.profitLoss > 0).length;
  const losingTrades = trades.filter(t => t.profitLoss !== undefined && t.profitLoss < 0).length;
  const sellTrades = trades.filter(t => t.type === 'sell').length;
  
  const winRate = sellTrades > 0 ? (winningTrades / sellTrades) * 100 : 0;
  const totalReturn = ((currentCapital - initialCapital) / initialCapital) * 100;
  
  // Calculate averages
  const winningValues = trades
    .filter(t => t.profitLoss !== undefined && t.profitLoss > 0)
    .map(t => t.profitLoss!);
  const losingValues = trades
    .filter(t => t.profitLoss !== undefined && t.profitLoss < 0)
    .map(t => Math.abs(t.profitLoss!));
  
  const averageProfit = winningValues.length > 0 ? 
    winningValues.reduce((sum, val) => sum + val, 0) / winningValues.length : 0;
  const averageLoss = losingValues.length > 0 ? 
    losingValues.reduce((sum, val) => sum + val, 0) / losingValues.length : 0;
  const profitFactor = averageLoss > 0 ? averageProfit / averageLoss : 0;
  
  // Calculate drawdown
  let maxDrawdown = 0;
  let peak = initialCapital;
  
  for (const point of equity) {
    if (point.value > peak) {
      peak = point.value;
    }
    const drawdown = (peak - point.value) / peak * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  // Adjust stats based on strategy characteristics
  const strategyMultiplier = strategy.stats.winRate / 60; // Normalize around 60%
  const adjustedWinRate = Math.min(Math.max(winRate * strategyMultiplier, 40), 80);
  const adjustedReturn = Math.min(Math.max(totalReturn * strategyMultiplier, -15), 40);
  const adjustedDrawdown = Math.min(Math.max(maxDrawdown / strategyMultiplier, 5), 30);
  
  return {
    strategyId,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    initialCapital,
    finalCapital: currentCapital,
    totalReturn: adjustedReturn,
    totalTrades,
    winningTrades,
    losingTrades,
    winRate: adjustedWinRate,
    averageProfit,
    averageLoss,
    profitFactor,
    maxDrawdown: adjustedDrawdown,
    sharpeRatio: 1.2 + Math.random() * 1.5,
    sortinoRatio: 1.5 + Math.random() * 2.0,
    trades,
    equity,
    parameters
  };
};

// Function to optimize a strategy
export const optimizeStrategy = async (
  strategyId: string,
  coinId: string,
  startDate: Date,
  endDate: Date,
  initialCapital: number,
  parameterRanges: Record<string, {min: number, max: number, step: number}>
): Promise<OptimizationResult[]> => {
  // This would normally test many parameter combinations
  // Here we'll just simulate it with some reasonable results
  const strategy = predefinedStrategies.find(s => s.id === strategyId);
  if (!strategy) {
    throw new Error('Strategy not found');
  }
  
  // Simulate a delay to mimic optimization
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate 5-10 "optimized" parameter sets
  const numResults = Math.floor(Math.random() * 5) + 5;
  const results: OptimizationResult[] = [];
  
  for (let i = 0; i < numResults; i++) {
    const parameters: Record<string, any> = {};
    
    // Generate parameter values within the given ranges
    for (const [paramName, range] of Object.entries(parameterRanges)) {
      const steps = Math.floor((range.max - range.min) / range.step);
      const randomSteps = Math.floor(Math.random() * steps);
      parameters[paramName] = range.min + (randomSteps * range.step);
    }
    
    // Create realistic performance metrics
    // Better parameters should give better results (in general)
    const quality = Math.random(); // 0 to 1, how "good" this parameter set is
    
    results.push({
      parameters,
      performance: {
        totalReturn: 10 + (quality * 30), // 10% to 40%
        winRate: 50 + (quality * 30), // 50% to 80%
        maxDrawdown: 25 - (quality * 15), // 25% to 10%
        sharpeRatio: 1 + (quality * 2), // 1 to 3
        profitFactor: 1.2 + (quality * 1.8) // 1.2 to 3
      }
    });
  }
  
  // Sort by total return (highest first)
  results.sort((a, b) => b.performance.totalReturn - a.performance.totalReturn);
  
  return results;
};

// Function to generate custom strategy
export const generateCustomStrategy = (
  name: string,
  description: string,
  selectedIndicators: string[],
  selectedTimeframes: string[],
  parameters: StrategyParameter[],
  riskLevel: string
): AITradingStrategy => {
  // Generate a random color for the strategy
  const colors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", 
    "#EC4899", "#0EA5E9", "#6366F1", "#14B8A6", "#F97316"
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    id: `custom-${Date.now()}`,
    name,
    description,
    type: "hybrid",
    color,
    indicators: selectedIndicators,
    timeframes: selectedTimeframes,
    riskLevel,
    parameters,
    stats: {
      winRate: 50 + Math.random() * 20, // 50-70%
      averageReturn: 1 + Math.random() * 2, // 1-3%
      riskLevel,
      maxDrawdown: 10 + Math.random() * 10 // 10-20%
    },
    author: "User",
    creationDate: new Date().toISOString(),
    version: "1.0.0",
    public: false
  };
};
