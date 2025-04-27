
import { Trade, TradingAccount } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";
import { SupportedCurrency } from "@/components/trading/TradingStats";

interface PortfolioRecommendation {
  suggestedTrades: Trade[];
  expectedReturn: number;
  riskScore: number;
  reasoning: string;
}

export async function analyzePortfolio(account: TradingAccount): Promise<PortfolioRecommendation> {
  // Simulate AI analysis
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Group holdings by coin
  const holdings = account.trades.reduce((acc, trade) => {
    const { coinId, type, amount } = trade;
    if (!acc[coinId]) acc[coinId] = 0;
    acc[coinId] += type === 'buy' ? amount : -amount;
    return acc;
  }, {} as Record<string, number>);

  // Generate recommendations
  const suggestedTrades: Trade[] = [];
  const timestamp = new Date().toISOString();

  Object.entries(holdings).forEach(([coinId, amount]) => {
    if (amount > 0 && Math.random() > 0.7) {
      // Suggest taking some profit
      suggestedTrades.push({
        id: `rebalance-${Date.now()}-${coinId}`,
        coinId,
        coinName: `Coin ${coinId}`,
        coinSymbol: coinId.toUpperCase(),
        type: 'sell',
        amount: amount * 0.2,
        price: 100 + Math.random() * 1000,
        totalValue: 0,
        timestamp,
        currency: "USD" as SupportedCurrency,
        botGenerated: true,
        tags: ['portfolio-rebalance']
      });
    }
  });

  return {
    suggestedTrades,
    expectedReturn: 8 + Math.random() * 4, // 8-12% expected return
    riskScore: 0.4 + Math.random() * 0.3, // 0.4-0.7 risk score
    reasoning: "Portfolio analysis suggests minor rebalancing for risk management"
  };
}

export async function optimizePortfolio(
  account: TradingAccount,
  riskTolerance: 'low' | 'medium' | 'high'
): Promise<void> {
  try {
    const analysis = await analyzePortfolio(account);
    
    if (analysis.suggestedTrades.length > 0) {
      toast({
        title: "Portfolio Optimization",
        description: `Found ${analysis.suggestedTrades.length} opportunities for improvement`,
      });
    } else {
      toast({
        title: "Portfolio Analysis",
        description: "Your portfolio is currently well-balanced",
      });
    }
  } catch (error) {
    console.error("Error optimizing portfolio:", error);
    toast({
      title: "Optimization Error",
      description: "Failed to analyze portfolio",
      variant: "destructive"
    });
  }
}
