
import { AITradingStrategy, TimeframeOption, TechnicalIndicator, StrategyParameter } from "@/types/trading";

// Define available timeframes with proper typing
export const availableTimeframes: TimeframeOption[] = [
  { value: "1m", label: "1 Minute", description: "Very short-term trading", minutes: 1 },
  { value: "5m", label: "5 Minutes", description: "Short-term scalping", minutes: 5 },
  { value: "15m", label: "15 Minutes", description: "Short-term trading", minutes: 15 },
  { value: "30m", label: "30 Minutes", description: "Medium-short term trading", minutes: 30 },
  { value: "1h", label: "1 Hour", description: "Medium-term trading", minutes: 60 },
  { value: "4h", label: "4 Hours", description: "Medium-term trading", minutes: 240 },
  { value: "1d", label: "1 Day", description: "Long-term trading", minutes: 1440 },
  { value: "1w", label: "1 Week", description: "Position trading", minutes: 10080 },
  { value: "1M", label: "1 Month", description: "Investment perspective", minutes: 43200 },
];

// Define technical indicators
const maIndicator: TechnicalIndicator = {
  name: "Moving Average",
  period: 20,
  key: "ma",
  category: "Trend",
  description: "Tracks the average price over a specified period"
};

const rsiIndicator: TechnicalIndicator = {
  name: "RSI",
  period: 14,
  key: "rsi",
  category: "Momentum",
  description: "Measures the speed and change of price movements"
};

const macdIndicator: TechnicalIndicator = {
  name: "MACD",
  period: 26,
  params: { fast: 12, slow: 26, signal: 9 },
  key: "macd",
  category: "Momentum",
  description: "Shows the relationship between two moving averages of a security's price"
};

const bollingerIndicator: TechnicalIndicator = {
  name: "Bollinger Bands",
  period: 20,
  params: { stdDev: 2 },
  key: "bollinger",
  category: "Volatility",
  description: "Shows price volatility with bands based on standard deviation"
};

const stochasticIndicator: TechnicalIndicator = {
  name: "Stochastic",
  period: 14,
  params: { k: 14, d: 3, smooth: 3 },
  key: "stochastic",
  category: "Momentum",
  description: "Compares a security's closing price to its price range over time"
};

// Example AI trading strategies
export const sampleStrategies: AITradingStrategy[] = [
  {
    id: "strategy-1",
    name: "Trend Following",
    description: "Uses moving averages to follow market trends and generate signals on crossovers.",
    tags: ["trend", "moving average", "crossover"],
    riskLevel: "medium",
    timeframes: [availableTimeframes[4].value, availableTimeframes[5].value, availableTimeframes[6].value],
    indicators: [maIndicator, macdIndicator, bollingerIndicator],
    performance: {
      winRate: 0.65,
      profitFactor: 1.8,
      maxDrawdown: 15,
      averageProfit: 2.3,
      sharpeRatio: 1.4
    },
    parameters: [
      {
        id: "param-1",
        name: "fastMAPeriod",
        label: "Fast MA Period",
        description: "The period for the fast moving average",
        type: "number",
        value: 10,
        min: 5,
        max: 50,
        step: 1
      },
      {
        id: "param-2",
        name: "slowMAPeriod",
        label: "Slow MA Period",
        description: "The period for the slow moving average",
        type: "number",
        value: 30,
        min: 10,
        max: 100,
        step: 1
      },
      {
        id: "param-3",
        name: "stopLossPercent",
        label: "Stop Loss %",
        description: "Stop loss percentage",
        type: "number",
        value: 5,
        min: 1,
        max: 15,
        step: 0.5
      }
    ],
    color: "#4caf50"
  },
  {
    id: "strategy-2",
    name: "RSI Reversal",
    description: "Uses RSI to identify overbought and oversold conditions for potential reversals.",
    tags: ["reversal", "oscillator", "RSI"],
    riskLevel: "high",
    timeframes: [availableTimeframes[3].value, availableTimeframes[4].value],
    indicators: [rsiIndicator, maIndicator],
    performance: {
      winRate: 0.58,
      profitFactor: 1.5,
      maxDrawdown: 22,
      averageProfit: 3.1,
      sharpeRatio: 1.1
    },
    parameters: [
      {
        id: "param-4",
        name: "rsiPeriod",
        label: "RSI Period",
        description: "The period for RSI calculation",
        type: "number",
        value: 14,
        min: 7,
        max: 30,
        step: 1
      },
      {
        id: "param-5",
        name: "overboughtLevel",
        label: "Overbought Level",
        description: "RSI level considered overbought",
        type: "number",
        value: 70,
        min: 60,
        max: 90,
        step: 1
      },
      {
        id: "param-6",
        name: "oversoldLevel",
        label: "Oversold Level",
        description: "RSI level considered oversold",
        type: "number",
        value: 30,
        min: 10,
        max: 40,
        step: 1
      },
      {
        id: "param-7",
        name: "takeProfitPercent",
        label: "Take Profit %",
        description: "Take profit percentage",
        type: "number",
        value: 7,
        min: 2,
        max: 20,
        step: 0.5
      }
    ],
    color: "#ff9800"
  },
  {
    id: "strategy-3",
    name: "MACD Divergence",
    description: "Identifies and trades divergences between price and MACD for potential reversals.",
    tags: ["divergence", "MACD", "momentum"],
    riskLevel: "medium",
    timeframes: [availableTimeframes[4].value, availableTimeframes[5].value, availableTimeframes[6].value],
    indicators: [macdIndicator, rsiIndicator],
    performance: {
      winRate: 0.62,
      profitFactor: 1.7,
      maxDrawdown: 18,
      averageProfit: 2.7,
      sharpeRatio: 1.3
    },
    parameters: [
      {
        id: "param-8",
        name: "fastLength",
        label: "MACD Fast Length",
        description: "The fast period for MACD calculation",
        type: "number",
        value: 12,
        min: 8,
        max: 20,
        step: 1
      },
      {
        id: "param-9",
        name: "slowLength",
        label: "MACD Slow Length",
        description: "The slow period for MACD calculation",
        type: "number",
        value: 26,
        min: 18,
        max: 40,
        step: 1
      },
      {
        id: "param-10",
        name: "signalLength",
        label: "Signal Line Length",
        description: "The signal line period for MACD",
        type: "number",
        value: 9,
        min: 5,
        max: 15,
        step: 1
      },
      {
        id: "param-11",
        name: "divergenceThreshold",
        label: "Divergence Threshold",
        description: "The minimum threshold for divergence detection",
        type: "number",
        value: 5,
        min: 2,
        max: 10,
        step: 0.1
      }
    ],
    color: "#2196f3"
  }
];
