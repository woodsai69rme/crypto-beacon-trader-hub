
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ModelTradingContextType, ModelResult, BacktestResult, ModelConfig } from '@/components/trading/model-trading/types';
import { toast } from '@/components/ui/use-toast';

// Sample model configs
const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'lstm-model',
    name: 'LSTM Price Predictor',
    description: 'Long Short-Term Memory neural network for price prediction',
    parameters: [
      {
        id: 'window_size',
        name: 'Window Size',
        description: 'Number of past days to analyze',
        type: 'number',
        min: 5,
        max: 30,
        step: 1,
        default: 14
      },
      {
        id: 'confidence_threshold',
        name: 'Confidence Threshold',
        description: 'Minimum confidence level for trade signals',
        type: 'range',
        min: 0.5,
        max: 0.95,
        step: 0.05,
        default: 0.7
      },
      {
        id: 'use_market_sentiment',
        name: 'Use Market Sentiment',
        description: 'Include market sentiment data in analysis',
        type: 'boolean',
        default: true
      }
    ],
    defaultValues: {
      window_size: 14,
      confidence_threshold: 0.7,
      use_market_sentiment: true
    }
  },
  {
    id: 'transformer-model',
    name: 'Transformer Market Analyzer',
    description: 'Transformer-based model for market pattern recognition',
    parameters: [
      {
        id: 'attention_layers',
        name: 'Attention Layers',
        description: 'Number of attention layers to use',
        type: 'select',
        options: ['2', '4', '6', '8'],
        default: '4'
      },
      {
        id: 'prediction_horizon',
        name: 'Prediction Horizon',
        description: 'How many days ahead to predict',
        type: 'number',
        min: 1,
        max: 7,
        step: 1,
        default: 3
      },
      {
        id: 'include_volume',
        name: 'Include Volume Analysis',
        description: 'Incorporate trading volume in predictions',
        type: 'boolean',
        default: true
      }
    ],
    defaultValues: {
      attention_layers: '4',
      prediction_horizon: 3,
      include_volume: true
    }
  },
  {
    id: 'rf-ensemble',
    name: 'Random Forest Ensemble',
    description: 'Ensemble of random forests for robust predictions',
    parameters: [
      {
        id: 'estimators',
        name: 'Number of Estimators',
        description: 'Trees in the forest',
        type: 'number',
        min: 50,
        max: 300,
        step: 10,
        default: 100
      },
      {
        id: 'feature_selection',
        name: 'Feature Selection',
        description: 'Feature selection method',
        type: 'select',
        options: ['auto', 'sqrt', 'log2', 'all'],
        default: 'sqrt'
      },
      {
        id: 'max_depth',
        name: 'Max Depth',
        description: 'Maximum depth of trees',
        type: 'number',
        min: 5,
        max: 50,
        step: 5,
        default: 20
      }
    ],
    defaultValues: {
      estimators: 100,
      feature_selection: 'sqrt',
      max_depth: 20
    }
  }
];

// Create context
const ModelTradingContext = createContext<ModelTradingContextType | undefined>(undefined);

export const useModelTrading = () => {
  const context = useContext(ModelTradingContext);
  if (!context) {
    throw new Error('useModelTrading must be used within a ModelTradingProvider');
  }
  return context;
};

export const ModelTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModel, setActiveModel] = useState<string>('lstm-model');
  const [modelConfig, setModelConfig] = useState<Record<string, any>>({});
  const [isModelRunning, setIsModelRunning] = useState<boolean>(false);
  const [modelResults, setModelResults] = useState<ModelResult[]>([]);
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);

  // Load default config for the active model
  useEffect(() => {
    const selectedModel = AVAILABLE_MODELS.find(model => model.id === activeModel);
    if (selectedModel) {
      setModelConfig(selectedModel.defaultValues);
    }
  }, [activeModel]);

  const updateModelConfig = (config: Record<string, any>) => {
    setModelConfig(prevConfig => ({
      ...prevConfig,
      ...config
    }));
  };

  const startModel = () => {
    setIsModelRunning(true);
    toast({
      title: "Model started",
      description: `Running ${AVAILABLE_MODELS.find(model => model.id === activeModel)?.name}`,
    });

    // Simulate model results over time
    const resultInterval = setInterval(() => {
      const newResult = generateModelResult();
      setModelResults(prev => [newResult, ...prev].slice(0, 10));
    }, 5000);

    // Store the interval ID for cleanup
    (window as any).modelInterval = resultInterval;
  };

  const stopModel = () => {
    if ((window as any).modelInterval) {
      clearInterval((window as any).modelInterval);
    }
    setIsModelRunning(false);
    toast({
      title: "Model stopped",
      description: "The AI trading model has been stopped",
    });
  };

  const runBacktest = async (days: number) => {
    toast({
      title: "Running backtest",
      description: `Testing model performance over ${days} days...`,
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = generateBacktestResult(days);
    setBacktestResults(result);

    toast({
      title: "Backtest complete",
      description: `Profit: ${result.finalBalance > result.initialBalance ? '+' : ''}${(result.finalBalance - result.initialBalance).toFixed(2)} USD`,
    });
  };

  return (
    <ModelTradingContext.Provider value={{
      activeModel,
      setActiveModel,
      modelConfig,
      updateModelConfig,
      isModelRunning,
      startModel,
      stopModel,
      modelResults,
      backtestResults,
      runBacktest
    }}>
      {children}
    </ModelTradingContext.Provider>
  );
};

// Helper function to generate realistic model results
function generateModelResult(): ModelResult {
  const actions: Array<'buy' | 'sell' | 'hold'> = ['buy', 'sell', 'hold'];
  const weightedActions = [...Array(5).fill('buy'), ...Array(5).fill('sell'), ...Array(10).fill('hold')];
  const action = weightedActions[Math.floor(Math.random() * weightedActions.length)] as 'buy' | 'sell' | 'hold';
  const confidence = 0.5 + (Math.random() * 0.4); // 50-90% confidence
  
  const reasons = {
    buy: [
      "Positive momentum detected in price action",
      "Bullish divergence in RSI indicator",
      "Price broke above key resistance level",
      "Volume increasing on upward movement",
      "Positive sentiment detected in market news"
    ],
    sell: [
      "Bearish pattern formed on daily timeframe",
      "Price approaching strong resistance zone",
      "Oscillators showing overbought conditions",
      "Volume decreasing during price rise",
      "Negative divergence detected in momentum indicators"
    ],
    hold: [
      "Market in consolidation phase",
      "Mixed signals from technical indicators",
      "Insufficient confidence for directional trade",
      "Price within neutral zone between support/resistance",
      "Awaiting confirmation of trend direction"
    ]
  };

  const reasoning = reasons[action][Math.floor(Math.random() * reasons[action].length)];
  
  return {
    action,
    confidence,
    reasoning,
    suggestedAmount: action !== 'hold' ? (0.1 + Math.random() * 0.4) : undefined,
    suggestedPrice: action !== 'hold' ? (20000 + Math.random() * 5000) : undefined,
    timestamp: new Date().toISOString()
  };
}

// Helper function to generate backtest results
function generateBacktestResult(days: number): BacktestResult {
  const initialBalance = 10000;
  const trades: BacktestTrade[] = [];
  
  let currentBalance = initialBalance;
  let date = new Date();
  date.setDate(date.getDate() - days);
  
  // Generate random trades
  const numTrades = 10 + Math.floor(Math.random() * 20);
  const daysPerTrade = Math.floor(days / numTrades);
  
  let winningTrades = 0;
  
  for (let i = 0; i < numTrades; i++) {
    // Move date forward
    date.setDate(date.getDate() + daysPerTrade);
    
    // Randomly decide if buy or sell
    const action = Math.random() > 0.5 ? 'buy' : 'sell';
    
    // Random price between 19000 and 25000
    const price = 19000 + Math.random() * 6000;
    
    // Random amount between 0.1 and 0.3 BTC
    const amount = 0.1 + Math.random() * 0.2;
    
    // Calculate trade value
    const value = price * amount;
    
    // If buy, subtract from balance; if sell, add to balance
    const profit = action === 'buy' ? -value : value;
    currentBalance += profit;
    
    // For sell trades, determine if profitable
    if (action === 'sell' && profit > 0) {
      winningTrades++;
    }
    
    trades.push({
      date: date.toISOString().split('T')[0],
      action,
      price,
      amount,
      balance: currentBalance,
      profit
    });
  }
  
  // Add some random final trades to ensure a positive outcome most of the time
  if (currentBalance < initialBalance && Math.random() > 0.3) {
    date.setDate(date.getDate() + daysPerTrade);
    const price = 22000 + Math.random() * 3000;
    const amount = 0.2 + Math.random() * 0.3;
    const profit = price * amount;
    currentBalance += profit;
    winningTrades++;
    
    trades.push({
      date: date.toISOString().split('T')[0],
      action: 'sell',
      price,
      amount,
      balance: currentBalance,
      profit
    });
  }
  
  const finalBalance = currentBalance;
  const totalTrades = trades.length;
  const winRate = winningTrades / totalTrades;
  const maxDrawdown = 5 + Math.random() * 15; // 5-20% drawdown
  const profitFactor = 0.9 + Math.random() * 1.5; // 0.9-2.4 profit factor
  const sharpeRatio = 0.5 + Math.random() * 1.5; // 0.5-2.0 Sharpe ratio
  
  return {
    startDate: trades[0].date,
    endDate: trades[trades.length - 1].date,
    initialBalance,
    finalBalance,
    totalTrades,
    winningTrades,
    losingTrades: totalTrades - winningTrades,
    winRate,
    profitFactor,
    maxDrawdown,
    sharpeRatio,
    trades
  };
}
