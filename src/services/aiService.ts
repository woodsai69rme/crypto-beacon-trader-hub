
import { AITradingStrategy, Trade, AIModelConfig, AIStrategyParameters, BacktestResults } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

// OpenRouter API endpoints
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1";

// Default API key - in a real app, would be stored securely
// This should be replaced with user's own key in settings
const DEFAULT_API_KEY = ""; // Empty default, user should provide their own key

// Get AI model configuration from settings
export const getAIModelConfig = (): AIModelConfig => {
  try {
    const settings = JSON.parse(localStorage.getItem('aiSettings') || '{}');
    return {
      model: settings.model || "deepseek-coder/deepseek-ruby-1.6-chat",
      provider: settings.provider || "openrouter",
      parameters: {
        temperature: settings.temperature || 0.7,
        topP: settings.topP || 0.9,
        maxTokens: settings.maxTokens || 2000
      }
    };
  } catch (error) {
    return {
      model: "deepseek-coder/deepseek-ruby-1.6-chat",
      provider: "openrouter",
      parameters: {
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 2000
      }
    };
  }
};

// Get API key from settings
export const getAIApiKey = (): string => {
  try {
    const settings = JSON.parse(localStorage.getItem('aiSettings') || '{}');
    return settings.apiKey || DEFAULT_API_KEY;
  } catch (error) {
    return DEFAULT_API_KEY;
  }
};

// Call AI model through OpenRouter API
export const callAI = async (
  prompt: string,
  systemPrompt: string = "",
  config: AIModelConfig = getAIModelConfig()
): Promise<string> => {
  const apiKey = getAIApiKey();
  
  if (!apiKey) {
    toast({
      title: "API Key Required",
      description: "Please add your OpenRouter API key in the AI settings",
      variant: "destructive"
    });
    throw new Error("API key is required");
  }
  
  try {
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "AlphaTrade Crypto Platform"
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt }
        ],
        temperature: config.parameters?.temperature,
        top_p: config.parameters?.topP,
        max_tokens: config.parameters?.maxTokens
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error calling AI service");
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling AI service:", error);
    // Fall back to mock responses in development
    return generateMockAIResponse(prompt);
  }
};

// Generate trading signal from AI
export const generateTradingSignal = async (
  coinId: string,
  strategy: AITradingStrategy,
  historicalData: any[],
  parameters: AIStrategyParameters = {}
): Promise<{ signal: 'buy' | 'sell' | 'hold', confidence: number, reasoning: string }> => {
  try {
    const strategyPrompt = `
You are an expert crypto trading algorithm specializing in ${strategy.type} strategies.
Please analyze the following historical data for ${coinId} and generate a trading signal.

Strategy details:
- Type: ${strategy.type}
- Timeframe: ${strategy.timeframe}
- Risk level: ${strategy.riskLevel}
- Key indicators: ${strategy.indicators.join(', ')}

Parameters:
- Buy threshold: ${parameters.buySignalThreshold || 0.7}
- Sell threshold: ${parameters.sellSignalThreshold || 0.7}
- Stop loss: ${parameters.stopLossPercentage || 5}%
- Take profit: ${parameters.takeProfitPercentage || 10}%

Historical data (most recent first):
${JSON.stringify(historicalData.slice(0, 20), null, 2)}

Based on this data and your ${strategy.type} strategy, generate a trading signal:
1. Signal: "buy", "sell", or "hold"
2. Confidence: A number between 0 and 1
3. Reasoning: A brief explanation of your analysis

Your response should be in JSON format only, like:
{
  "signal": "buy",
  "confidence": 0.85,
  "reasoning": "Explanation of the analysis..."
}
`;

    const response = await callAI(strategyPrompt, "You are a professional trading algorithm. Respond only with valid JSON.");
    
    try {
      const result = JSON.parse(response);
      return {
        signal: result.signal || 'hold',
        confidence: result.confidence || 0.5,
        reasoning: result.reasoning || 'No explanation provided'
      };
    } catch (err) {
      console.error("Error parsing AI response:", err);
      return generateMockTradingSignal();
    }
  } catch (error) {
    console.error("Error generating trading signal:", error);
    return generateMockTradingSignal();
  }
};

// Analyze portfolio and suggest improvements
export const analyzePortfolio = async (
  holdings: { [coinId: string]: { amount: number, value: number } },
  trades: Trade[]
): Promise<{ suggestions: string[], riskScore: number, diversificationScore: number }> => {
  try {
    const portfolioPrompt = `
You are a crypto portfolio analyst. Please analyze the following portfolio and provide suggestions.

Current holdings:
${JSON.stringify(holdings, null, 2)}

Recent trades:
${JSON.stringify(trades.slice(0, 5), null, 2)}

Provide the following:
1. Three specific suggestions for improving portfolio diversification and risk management
2. A risk score from 0 to 10 (10 being highest risk)
3. A diversification score from 0 to 10 (10 being perfectly diversified)

Your response should be in JSON format only, like:
{
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "riskScore": 7.5,
  "diversificationScore": 3.2
}
`;

    const response = await callAI(portfolioPrompt, "You are a professional portfolio analyst. Respond only with valid JSON.");
    
    try {
      const result = JSON.parse(response);
      return {
        suggestions: result.suggestions || [],
        riskScore: result.riskScore || 5,
        diversificationScore: result.diversificationScore || 5
      };
    } catch (err) {
      console.error("Error parsing AI portfolio analysis:", err);
      return {
        suggestions: [
          "Consider diversifying by adding more assets",
          "Rebalance portfolio to reduce exposure to high volatility assets",
          "Set stop-loss orders to protect against sudden market movements"
        ],
        riskScore: 6.5,
        diversificationScore: 4.8
      };
    }
  } catch (error) {
    console.error("Error analyzing portfolio:", error);
    return {
      suggestions: [
        "Consider diversifying by adding more assets",
        "Rebalance portfolio to reduce exposure to high volatility assets",
        "Set stop-loss orders to protect against sudden market movements"
      ],
      riskScore: 6.5,
      diversificationScore: 4.8
    };
  }
};

// Generate backtest results for a strategy
export const backtestStrategy = async (
  strategy: AITradingStrategy,
  coinId: string,
  startDate: string,
  endDate: string,
  parameters: AIStrategyParameters = {}
): Promise<BacktestResults> => {
  try {
    // In a real app, this would run an actual backtest against historical data
    // Here we'll simulate the results
    return generateMockBacktestResults(strategy.id, coinId, startDate, endDate);
  } catch (error) {
    console.error("Error running backtest:", error);
    throw error;
  }
};

// Mock responses for development/fallbacks
const generateMockAIResponse = (prompt: string): string => {
  if (prompt.includes("trading signal")) {
    return JSON.stringify({
      signal: ["buy", "sell", "hold"][Math.floor(Math.random() * 3)],
      confidence: (0.5 + Math.random() * 0.4).toFixed(2),
      reasoning: "Based on technical analysis of momentum indicators and price action patterns, this signal has been generated with medium confidence."
    });
  } else if (prompt.includes("portfolio")) {
    return JSON.stringify({
      suggestions: [
        "Diversify your portfolio by adding more assets from different sectors",
        "Reduce exposure to high volatility assets like memecoin XYZ",
        "Consider adding stablecoins for reduced portfolio volatility"
      ],
      riskScore: (Math.random() * 10).toFixed(1),
      diversificationScore: (Math.random() * 10).toFixed(1)
    });
  } else {
    return "I'm not sure how to respond to that prompt.";
  }
};

// Generate a mock trading signal for testing
const generateMockTradingSignal = (): { signal: 'buy' | 'sell' | 'hold', confidence: number, reasoning: string } => {
  const signals: ('buy' | 'sell' | 'hold')[] = ['buy', 'sell', 'hold'];
  const randomIndex = Math.floor(Math.random() * 3);
  const signal = signals[randomIndex];
  const confidence = 0.5 + (Math.random() * 0.4); // 0.5 to 0.9
  
  const buyReasons = [
    "MACD has crossed above the signal line indicating bullish momentum",
    "Price has broken above a key resistance level with high volume",
    "RSI has bounced from oversold conditions showing strength"
  ];
  
  const sellReasons = [
    "Price approaching a major resistance level with bearish divergence",
    "MACD has crossed below the signal line indicating loss of momentum",
    "RSI showing overbought conditions above 70"
  ];
  
  const holdReasons = [
    "Price consolidating in a range with no clear direction",
    "Mixed signals from indicators suggest caution",
    "Trading volume too low to support a decisive move"
  ];
  
  const reasonings = signal === 'buy' ? buyReasons : signal === 'sell' ? sellReasons : holdReasons;
  const reasoning = reasonings[Math.floor(Math.random() * reasonings.length)];
  
  return {
    signal,
    confidence,
    reasoning
  };
};

// Generate mock backtest results
const generateMockBacktestResults = (
  strategyId: string, 
  coinId: string, 
  startDate: string, 
  endDate: string
): BacktestResults => {
  const initialBalance = 10000;
  const tradeCount = 20 + Math.floor(Math.random() * 30); // 20-50 trades
  const winRate = 0.4 + Math.random() * 0.4; // 40-80% win rate
  const winCount = Math.floor(tradeCount * winRate);
  const lossCount = tradeCount - winCount;
  
  const avgWin = 300 + Math.random() * 500; // $300-800 per winning trade
  const avgLoss = 100 + Math.random() * 300; // $100-400 per losing trade
  
  const totalGain = winCount * avgWin;
  const totalLoss = lossCount * avgLoss;
  const netGain = totalGain - totalLoss;
  const finalBalance = initialBalance + netGain;
  
  const trades: Trade[] = [];
  let currentBalance = initialBalance;
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  
  for (let i = 0; i < tradeCount; i++) {
    // Generate random date between start and end
    const dayIncrement = Math.floor(Math.random() * (endDateObj.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    currentDate = new Date(currentDate.getTime() + dayIncrement * (1000 * 3600 * 24));
    
    if (currentDate > endDateObj) break;
    
    const isWin = i < winCount;
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const amount = 0.01 + Math.random() * 0.5; // 0.01-0.51 BTC or ETH
    const price = type === 'buy' 
      ? (coinId === 'bitcoin' ? 35000 + Math.random() * 30000 : 2000 + Math.random() * 2000)
      : (coinId === 'bitcoin' ? 40000 + Math.random() * 30000 : 2500 + Math.random() * 2000);
    
    const totalValue = amount * price;
    
    trades.push({
      id: `backtest-${strategyId}-${i}`,
      coinId,
      coinName: coinId === 'bitcoin' ? 'Bitcoin' : 'Ethereum',
      coinSymbol: coinId === 'bitcoin' ? 'BTC' : 'ETH',
      type,
      amount,
      price,
      totalValue,
      timestamp: currentDate.toISOString(),
      currency: 'AUD', // Default to AUD as per requirements
      botGenerated: true,
      strategyId,
      total: totalValue
    });
    
    currentBalance = isWin ? currentBalance + (avgWin * Math.random() * 0.5) : currentBalance - (avgLoss * Math.random() * 0.5);
  }
  
  return {
    strategyId,
    startDate,
    endDate,
    trades,
    initialBalance,
    finalBalance,
    returns: ((finalBalance / initialBalance) - 1) * 100,
    sharpeRatio: 0.5 + Math.random() * 2.5, // 0.5-3.0
    maxDrawdown: 5 + Math.random() * 25, // 5-30%
    winRate: winRate * 100,
    profitFactor: totalGain / (totalLoss || 1),
    averageProfitPerTrade: totalGain / (winCount || 1),
    averageLossPerTrade: totalLoss / (lossCount || 1),
    profitTrades: winCount,
    lossTrades: lossCount,
    currency: 'AUD'
  };
};

// Export available strategies for the platform
export const availableStrategies: AITradingStrategy[] = [
  {
    id: 'trend-following',
    name: 'AI Trend Following',
    description: 'Uses machine learning to identify and follow market trends',
    type: 'trend-following',
    timeframe: '1d',
    riskLevel: 'medium',
    indicators: ['SMA', 'EMA', 'MACD', 'RSI'],
    triggers: ['Price breakouts', 'Volume spikes', 'Moving average crossovers'],
    implementation: 'LSTM neural network with technical indicators as features'
  },
  {
    id: 'mean-reversion',
    name: 'AI Mean Reversion',
    description: 'Identifies overbought and oversold conditions using AI',
    type: 'mean-reversion',
    timeframe: '4h',
    riskLevel: 'medium',
    indicators: ['RSI', 'Bollinger Bands', 'Stochastic', 'MFI'],
    triggers: ['Oversold/Overbought conditions', 'Price deviation from mean', 'Volume anomalies'],
    implementation: 'Statistical model with machine learning overlay'
  },
  {
    id: 'breakout',
    name: 'AI Breakout Detection',
    description: 'Identifies and trades significant price breakouts',
    type: 'breakout',
    timeframe: '1h',
    riskLevel: 'high',
    indicators: ['ATR', 'Volume', 'Support/Resistance', 'Volatility'],
    triggers: ['Key level breaks', 'Volatility expansions', 'Volume surges'],
    implementation: 'Pattern recognition algorithms with real-time breakout detection'
  },
  {
    id: 'grid-trading',
    name: 'AI Grid Trading',
    description: 'Automated grid trading with intelligent level adjustment',
    type: 'grid',
    timeframe: '15m',
    riskLevel: 'low',
    indicators: ['Price levels', 'Volatility bands', 'Volume profile'],
    triggers: ['Grid level hits', 'Dynamic grid adjustments'],
    implementation: 'Self-adjusting grid system with volatility-based parameters'
  },
  {
    id: 'scalping',
    name: 'AI Scalping',
    description: 'Ultra-short term trading capturing small price movements',
    type: 'scalping',
    timeframe: '5m',
    riskLevel: 'high',
    indicators: ['Order flow', 'Tick data', 'Market depth', 'Micro patterns'],
    triggers: ['Order imbalance', 'Price momentum', 'Tick anomalies'],
    implementation: 'High-frequency pattern recognition with reinforcement learning'
  },
  {
    id: 'momentum',
    name: 'AI Momentum',
    description: 'Captures strong price moves with momentum indicators',
    type: 'momentum',
    timeframe: '6h',
    riskLevel: 'medium',
    indicators: ['RSI', 'ADX', 'OBV', 'Momentum oscillator'],
    triggers: ['Momentum buildup', 'Trend strength confirmation', 'Volume confirmation'],
    implementation: 'Ensemble of momentum models with adaptive thresholds'
  },
  {
    id: 'arbitrage',
    name: 'AI Arbitrage',
    description: 'Identifies price discrepancies across exchanges',
    type: 'arbitrage',
    timeframe: '1m',
    riskLevel: 'low',
    indicators: ['Cross-exchange price', 'Liquidity', 'Fees', 'Transfer time'],
    triggers: ['Price differentials exceeding threshold', 'Liquidity confirmation'],
    implementation: 'Real-time exchange monitoring with execution optimization'
  },
  {
    id: 'pattern',
    name: 'AI Pattern Detection',
    description: 'Identifies complex chart patterns for trading signals',
    type: 'pattern',
    timeframe: '4h',
    riskLevel: 'medium',
    indicators: ['Chart patterns', 'Fibonacci levels', 'Candlestick patterns', 'Volume patterns'],
    triggers: ['Pattern completions', 'Confirmation signals'],
    implementation: 'Deep learning image recognition on chart patterns'
  },
  {
    id: 'custom',
    name: 'Custom AI Strategy',
    description: 'Fully customizable strategy with user-defined parameters',
    type: 'custom',
    timeframe: 'user',
    riskLevel: 'user',
    indicators: ['User selected'],
    triggers: ['User defined'],
    implementation: 'User configurable model with parameter optimization'
  }
];
