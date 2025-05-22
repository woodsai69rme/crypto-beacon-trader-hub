
import { AITradingStrategy, Trade, TradingAccount } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

interface AIAnalysisResult {
  recommendation: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  suggestedAmount?: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const AVAILABLE_STRATEGIES: AITradingStrategy[] = [
  {
    id: 'trend-following-ai',
    name: 'AI Trend Following',
    description: 'Uses machine learning to identify and follow market trends',
    type: 'trend-following',
    timeframe: '1d',
    parameters: {
      riskLevel: 'medium',
      backtestResults: {
        winRate: 0.68,
        profitFactor: 1.85,
        sharpeRatio: 1.42,
        drawdown: 15,
        returns: 45
      }
    }
  },
  {
    id: 'mean-reversion-ai',
    name: 'AI Mean Reversion',
    description: 'Identifies overbought and oversold conditions using AI',
    type: 'mean-reversion',
    timeframe: '4h',
    parameters: {
      riskLevel: 'medium',
      backtestResults: {
        winRate: 0.72,
        profitFactor: 1.95,
        sharpeRatio: 1.65,
        drawdown: 12,
        returns: 52
      }
    }
  },
  {
    id: 'sentiment-analysis',
    name: 'AI Sentiment Trading',
    description: 'Analyzes market sentiment using NLP',
    type: 'custom',
    timeframe: '1d',
    parameters: {
      strategyType: 'sentiment',
      riskLevel: 'high',
      backtestResults: {
        winRate: 0.65,
        profitFactor: 2.1,
        sharpeRatio: 1.38,
        drawdown: 22,
        returns: 75
      }
    }
  }
];

export async function analyzeMarketConditions(
  strategy: AITradingStrategy,
  coinId: string,
  historicalData: any[]
): Promise<AIAnalysisResult> {
  // Simulate AI analysis
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const random = Math.random();
  const confidence = 0.5 + (Math.random() * 0.4); // 50-90% confidence
  const riskLevel = strategy.parameters.riskLevel as 'low' | 'medium' | 'high';
  
  return {
    recommendation: random > 0.6 ? 'buy' : random > 0.3 ? 'hold' : 'sell',
    confidence,
    reasoning: `Analysis based on ${strategy.type} strategy shows favorable conditions`,
    suggestedAmount: Math.random() * 0.5, // 0-0.5 units
    riskLevel
  };
}

export async function executeAITrade(
  strategy: AITradingStrategy,
  account: TradingAccount,
  coinData: { id: string; price: number; name: string; symbol: string },
  analysis: AIAnalysisResult
): Promise<Trade | null> {
  try {
    if (analysis.recommendation === 'hold') {
      toast({
        title: "AI Analysis Result",
        description: "Current market conditions suggest holding position",
      });
      return null;
    }

    const tradeAmount = analysis.suggestedAmount || 0.1;
    const totalValue = tradeAmount * coinData.price;

    if (analysis.recommendation === 'buy' && account.balance < totalValue) {
      toast({
        title: "Insufficient Balance",
        description: "Cannot execute buy trade due to insufficient funds",
        variant: "destructive"
      });
      return null;
    }

    const trade: Trade = {
      id: `ai-trade-${Date.now()}`,
      coinId: coinData.id,
      coinName: coinData.name,
      coinSymbol: coinData.symbol,
      type: analysis.recommendation,
      amount: tradeAmount,
      price: coinData.price,
      totalValue,
      timestamp: new Date().toISOString(),
      currency: "USD",
      botGenerated: true,
      strategyId: strategy.id
    };

    toast({
      title: "AI Trade Executed",
      description: `${analysis.recommendation.toUpperCase()} ${tradeAmount} ${coinData.symbol} at $${coinData.price}`,
    });

    return trade;
  } catch (error) {
    console.error("Error executing AI trade:", error);
    toast({
      title: "Trade Error",
      description: "Failed to execute AI trade",
      variant: "destructive"
    });
    return null;
  }
}
