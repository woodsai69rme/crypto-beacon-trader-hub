
import { 
  Trade, 
  TradingAccount, 
  OptimizationSettings, 
  PortfolioOptimizationResult,
  RiskAssessmentResult,
  MarketInsight,
  TradingSignal
} from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

// Portfolio Optimization
export async function optimizePortfolio(
  account: TradingAccount,
  settings: OptimizationSettings
): Promise<PortfolioOptimizationResult> {
  // Simulate AI analysis with a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Group holdings by coin
  const holdings = account.trades.reduce((acc, trade) => {
    const { coinId, type, amount, price } = trade;
    if (!acc[coinId]) acc[coinId] = { amount: 0, value: 0 };
    
    if (type === 'buy') {
      acc[coinId].amount += amount;
      acc[coinId].value += amount * price;
    } else {
      acc[coinId].amount -= amount;
      // Don't subtract from value as we want to track average buy price
    }
    
    return acc;
  }, {} as Record<string, { amount: number; value: number }>);
  
  // Calculate current allocation percentages
  const totalPortfolioValue = Object.values(holdings).reduce(
    (sum, { amount, value }) => sum + amount * getCurrentPrice(value / amount), 0
  ) + account.balance;
  
  const currentAllocation: Record<string, number> = {};
  Object.entries(holdings).forEach(([coinId, { amount, value }]) => {
    if (amount <= 0) return; // Skip assets we don't own
    const currentPrice = getCurrentPrice(value / amount);
    const assetValue = amount * currentPrice;
    currentAllocation[coinId] = (assetValue / totalPortfolioValue) * 100;
  });
  
  // Add cash to current allocation
  currentAllocation['cash'] = (account.balance / totalPortfolioValue) * 100;
  
  // Generate optimized allocation based on settings
  const suggestedAllocation = generateOptimizedAllocation(
    currentAllocation,
    settings,
    Object.keys(holdings).filter(coinId => holdings[coinId].amount > 0)
  );
  
  // Generate rebalancing trades based on allocation differences
  const rebalancingTrades = generateRebalancingTrades(
    account,
    currentAllocation,
    suggestedAllocation,
    holdings,
    totalPortfolioValue
  );
  
  // Calculate expected metrics based on risk tolerance
  const riskMultiplier = settings.riskTolerance === 'high' ? 1.5 : 
                        settings.riskTolerance === 'low' ? 0.6 : 1.0;
  
  const timeMultiplier = settings.timeHorizon === 'long' ? 1.3 : 
                        settings.timeHorizon === 'short' ? 0.8 : 1.0;
  
  return {
    currentAllocation,
    suggestedAllocation,
    expectedReturn: 8 + (Math.random() * 4) * riskMultiplier * timeMultiplier,
    expectedRisk: 5 + (Math.random() * 5) * riskMultiplier / timeMultiplier,
    sharpeRatio: 1.2 + (Math.random() * 0.8),
    diversification: Math.min(95, 65 + (Math.random() * 20) * (1 / riskMultiplier)),
    rebalancingTrades
  };
}

// Helper function to simulate current market price
function getCurrentPrice(averagePrice: number): number {
  // Simulate some random price movement from average price
  return averagePrice * (1 + (Math.random() * 0.2 - 0.05));
}

// Helper to generate optimized allocation based on settings
function generateOptimizedAllocation(
  currentAllocation: Record<string, number>,
  settings: OptimizationSettings,
  availableAssets: string[]
): Record<string, number> {
  const { riskTolerance, constraints } = settings;
  const { maxAssetAllocation = 40, minCash = 10 } = constraints;
  
  // Start with a clean slate
  const optimized: Record<string, number> = {};
  
  // Ensure we meet minimum cash requirement
  optimized['cash'] = minCash;
  let remainingAllocation = 100 - minCash;
  
  // High risk: Concentrate in fewer assets
  // Low risk: Spread across more assets
  const targetAssetCount = riskTolerance === 'high' ? 3 :
                          riskTolerance === 'low' ? Math.max(5, availableAssets.length) :
                          4;
  
  // Sort assets by current allocation (descending)
  const sortedAssets = availableAssets
    .filter(assetId => assetId !== 'cash')
    .sort((a, b) => (currentAllocation[b] || 0) - (currentAllocation[a] || 0));
  
  // Focus on top assets based on risk tolerance
  const primaryAssets = sortedAssets.slice(0, targetAssetCount);
  
  // Calculate allocation weights with some randomness
  const weights = primaryAssets.map(() => 0.5 + Math.random());
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  // Distribute remaining allocation according to weights
  primaryAssets.forEach((assetId, i) => {
    const allocation = Math.min(
      maxAssetAllocation,
      (weights[i] / totalWeight) * remainingAllocation
    );
    optimized[assetId] = parseFloat(allocation.toFixed(1));
  });
  
  // Calculate the actual allocated amount
  const allocatedAmount = Object.values(optimized).reduce((sum, value) => sum + value, 0);
  
  // Adjust cash to ensure total is 100%
  if (allocatedAmount < 100) {
    optimized['cash'] += (100 - allocatedAmount);
  }
  
  return optimized;
}

// Helper to generate trades needed for rebalancing
function generateRebalancingTrades(
  account: TradingAccount,
  currentAllocation: Record<string, number>,
  suggestedAllocation: Record<string, number>,
  holdings: Record<string, { amount: number; value: number }>,
  totalValue: number
): Trade[] {
  const trades: Trade[] = [];
  const timestamp = new Date().toISOString();
  
  // Process each asset in suggested allocation
  Object.entries(suggestedAllocation).forEach(([assetId, targetPercent]) => {
    if (assetId === 'cash') return; // Skip cash - we'll handle it implicitly
    
    const currentPercent = currentAllocation[assetId] || 0;
    const targetValue = (targetPercent / 100) * totalValue;
    
    if (Math.abs(targetPercent - currentPercent) < 1) {
      return; // Skip if difference is less than 1%
    }
    
    const currentHolding = holdings[assetId];
    
    if (!currentHolding && targetPercent > 0) {
      // Need to buy a new asset
      const amount = targetValue / getCurrentPrice(100); // Mock price
      const price = getCurrentPrice(100);
      const total = amount * price;
      
      trades.push({
        id: `rebalance-buy-${Date.now()}-${assetId}`,
        coinId: assetId,
        coinName: `Coin ${assetId.toUpperCase()}`,
        coinSymbol: assetId.substring(0, 3).toUpperCase(),
        type: 'buy',
        amount,
        price,
        totalValue: total,
        total: total,
        timestamp,
        currency: account.currency as any,
        botGenerated: true,
        tags: ['portfolio-optimization']
      });
    } 
    else if (currentHolding) {
      const currentPrice = getCurrentPrice(currentHolding.value / currentHolding.amount);
      const currentValue = currentHolding.amount * currentPrice;
      
      if (targetValue > currentValue) {
        // Need to buy more
        const amountToBuy = (targetValue - currentValue) / currentPrice;
        const total = amountToBuy * currentPrice;
        
        trades.push({
          id: `rebalance-buy-${Date.now()}-${assetId}`,
          coinId: assetId,
          coinName: `${assetId.charAt(0).toUpperCase() + assetId.slice(1)}`,
          coinSymbol: assetId.substring(0, 3).toUpperCase(),
          type: 'buy',
          amount: amountToBuy,
          price: currentPrice,
          totalValue: total,
          total: total,
          timestamp,
          currency: account.currency as any,
          botGenerated: true,
          tags: ['portfolio-optimization']
        });
      } 
      else if (targetValue < currentValue) {
        // Need to sell some
        const amountToSell = (currentValue - targetValue) / currentPrice;
        const total = amountToSell * currentPrice;
        
        trades.push({
          id: `rebalance-sell-${Date.now()}-${assetId}`,
          coinId: assetId,
          coinName: `${assetId.charAt(0).toUpperCase() + assetId.slice(1)}`,
          coinSymbol: assetId.substring(0, 3).toUpperCase(),
          type: 'sell',
          amount: amountToSell,
          price: currentPrice,
          totalValue: total,
          total: total,
          timestamp,
          currency: account.currency as any,
          botGenerated: true,
          tags: ['portfolio-optimization']
        });
      }
    }
  });
  
  return trades;
}

// Risk Assessment
export async function assessPortfolioRisk(account: TradingAccount): Promise<RiskAssessmentResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Basic risk metrics
  const overallScore = 65 + Math.floor(Math.random() * 20);
  const diversificationScore = 70 + Math.floor(Math.random() * 20);
  const volatilityScore = 50 + Math.floor(Math.random() * 40);
  const liquidityScore = 80 + Math.floor(Math.random() * 15);
  
  // Risk by asset
  const riskByAsset: Record<string, { score: number; factors: string[] }> = {};
  
  // Process each asset
  const assetMap = new Map<string, { amount: number; value: number }>();
  let totalValue = account.balance;
  
  account.trades.forEach(trade => {
    const { coinId, type, amount, price } = trade;
    if (!assetMap.has(coinId)) {
      assetMap.set(coinId, { amount: 0, value: 0 });
    }
    
    const asset = assetMap.get(coinId)!;
    if (type === 'buy') {
      asset.amount += amount;
      asset.value += amount * price;
    } else {
      asset.amount -= amount;
    }
  });
  
  // Calculate total value
  assetMap.forEach(({ amount, value }, coinId) => {
    if (amount <= 0) return;
    const currentPrice = getCurrentPrice(value / amount);
    totalValue += amount * currentPrice;
  });
  
  // Calculate concentration risk
  let maxAllocation = 0;
  assetMap.forEach(({ amount, value }, coinId) => {
    if (amount <= 0) return;
    
    const currentPrice = getCurrentPrice(value / amount);
    const assetValue = amount * currentPrice;
    const allocation = (assetValue / totalValue) * 100;
    
    if (allocation > maxAllocation) {
      maxAllocation = allocation;
    }
    
    // Assign risk score to asset
    const factors = [];
    let riskScore = Math.floor(Math.random() * 40) + 40; // Base risk 40-80
    
    // Add risk factors
    if (allocation > 30) {
      factors.push('High concentration risk');
      riskScore += 15;
    }
    
    if (Math.random() > 0.5) {
      factors.push('Above-average volatility');
      riskScore += 10;
    }
    
    if (Math.random() > 0.7) {
      factors.push('Market uncertainty');
      riskScore += 5;
    }
    
    riskByAsset[coinId] = {
      score: Math.min(100, riskScore),
      factors
    };
  });
  
  // Concentration risk based on max allocation
  const concentrationRisk = maxAllocation > 40 ? 80 : 
                            maxAllocation > 30 ? 60 :
                            maxAllocation > 20 ? 40 : 20;
  
  // Correlation risk - randomized for demo
  const correlationRisk = Math.floor(Math.random() * 60) + 20;
  
  // Generate recommendations based on risks
  const recommendations = [];
  
  if (diversificationScore < 70) {
    recommendations.push('Increase portfolio diversification by adding more assets');
  }
  
  if (maxAllocation > 30) {
    recommendations.push('Reduce concentration in your largest holding');
  }
  
  if (volatilityScore > 70) {
    recommendations.push('Consider adding stable assets to reduce overall volatility');
  }
  
  if ((account.balance / totalValue) * 100 < 5) {
    recommendations.push('Maintain a higher cash reserve for market opportunities');
  }
  
  // Always add at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push('Continue to monitor market conditions and rebalance periodically');
  }
  
  return {
    overallScore,
    diversificationScore,
    volatilityScore,
    liquidityScore,
    concentrationRisk,
    correlationRisk,
    recommendations,
    riskByAsset
  };
}

// Automated Trading Signals
export async function generateTradingSignals(
  account: TradingAccount,
  options?: { limit?: number; minConfidence?: number }
): Promise<TradingSignal[]> {
  const { limit = 5, minConfidence = 60 } = options || {};
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const signals: TradingSignal[] = [];
  const timestamp = new Date().toISOString();
  
  // Get list of assets we're currently holding
  const holdings = new Set<string>();
  account.trades.forEach(trade => {
    if (trade.type === 'buy') {
      holdings.add(trade.coinId);
    }
  });
  
  // Generate signals for holdings and potential new assets
  const potentialAssets = [
    'bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin',
    'ripple', 'polkadot', 'avalanche', 'dogecoin', 'shiba-inu'
  ];
  
  // Create a mix of buy and sell signals
  for (let i = 0; i < Math.min(limit * 2, 15); i++) {
    const isHolding = i < holdings.size;
    let coinId;
    
    if (isHolding) {
      // Pick from holdings
      coinId = Array.from(holdings)[i % holdings.size];
    } else {
      // Pick a new asset
      coinId = potentialAssets[Math.floor(Math.random() * potentialAssets.length)];
      
      // Skip if we're already holding this
      if (holdings.has(coinId)) continue;
    }
    
    // Randomize signal parameters
    const strength = Math.floor(Math.random() * 40) + 60; // 60-100
    
    // Skip if below minimum confidence
    if (strength < minConfidence) continue;
    
    // Determine signal type - prefer sells for holdings and buys for new assets
    const type = isHolding 
      ? (Math.random() > 0.3 ? 'sell' : 'buy')
      : 'buy';
    
    const price = 100 + Math.random() * 1000;
    
    // Random indicators that contributed to the signal
    const indicators: Record<string, number> = {
      rsi: Math.floor(Math.random() * 100),
      macd: Math.random() * 2 - 1,
      volume_surge: Math.random() * 200,
      support_level: price * 0.9,
      resistance_level: price * 1.1,
    };
    
    const suggestedTarget = price * (type === 'buy' ? (1 + Math.random() * 0.2) : (1 - Math.random() * 0.2));
    const suggestedStopLoss = price * (type === 'buy' ? (1 - Math.random() * 0.1) : (1 + Math.random() * 0.1));
    
    signals.push({
      id: `signal-${Date.now()}-${i}`,
      coinId,
      coinSymbol: coinId.substring(0, 3).toUpperCase(),
      type,
      strength,
      timestamp,
      source: Math.random() > 0.5 ? 'ai_analysis' : 'technical_indicators',
      reason: type === 'buy' 
        ? 'Bullish divergence in technical indicators'
        : 'Overbought conditions and resistance level reached',
      indicators,
      price,
      suggestedActions: {
        action: type,
        entry: price,
        target: suggestedTarget,
        stopLoss: suggestedStopLoss
      }
    });
    
    // Only add up to the limit
    if (signals.length >= limit) break;
  }
  
  return signals;
}

// Personalized Market Insights
export async function getPersonalizedMarketInsights(
  account: TradingAccount,
  options?: { limit?: number; relevanceThreshold?: number }
): Promise<MarketInsight[]> {
  const { limit = 5, relevanceThreshold = 60 } = options || {};
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const insights: MarketInsight[] = [];
  const timestamp = new Date().toISOString();
  
  // Get assets we're currently holding
  const holdings = new Set<string>();
  account.trades.forEach(trade => {
    if (trade.type === 'buy') {
      holdings.add(trade.coinId);
    }
  });
  
  // Generate insights for our holdings and general market conditions
  const holdingsList = Array.from(holdings);
  
  // Insight templates
  const insightTemplates = [
    {
      type: 'trend',
      title: 'Market Momentum Shift',
      summary: 'Recent data indicates a potential shift in market momentum favoring {assets}.',
      content: 'Technical analysis shows a convergence of several indicators suggesting a meaningful shift in market momentum. This could represent an opportunity for strategic position adjustments.',
      relevance: 75,
      confidence: 70
    },
    {
      type: 'opportunity',
      title: 'Accumulation Pattern Detected',
      summary: 'Whale wallets are showing accumulation patterns for {assets}.',
      content: 'On-chain analysis reveals significant accumulation by large wallet addresses over the past week. Historically, this pattern has preceded price appreciation in 68% of observed instances.',
      relevance: 85,
      confidence: 75
    },
    {
      type: 'risk',
      title: 'Regulatory Development Alert',
      summary: 'New regulatory developments may impact {assets} in the coming weeks.',
      content: 'Recent statements from regulatory bodies suggest potential policy changes that could impact market dynamics. Consider reviewing position sizes and risk management strategies.',
      relevance: 80,
      confidence: 65
    },
    {
      type: 'analysis',
      title: 'Correlation Breakdown Opportunity',
      summary: '{assets} showing decreased correlation with broader market movements.',
      content: 'Statistical analysis indicates a significant reduction in correlation between this asset and the broader crypto market. This could present both diversification benefits and unique trading opportunities.',
      relevance: 70,
      confidence: 80
    },
    {
      type: 'event',
      title: 'Technical Upgrade Approaching',
      summary: 'Major technical upgrade scheduled for {assets} network.',
      content: 'A significant protocol upgrade is scheduled within the next 14 days. Historical analysis of similar upgrades shows positive price action in 72% of cases, with an average appreciation of 12% in the week following successful implementation.',
      relevance: 90,
      confidence: 85
    }
  ];
  
  // Generate insights using templates
  for (let i = 0; i < Math.min(limit * 2, 10); i++) {
    // Select a template
    const template = insightTemplates[Math.floor(Math.random() * insightTemplates.length)];
    
    // Select assets this insight applies to
    let assets: string[];
    if (i < holdingsList.length) {
      // Focus on one of our holdings
      assets = [holdingsList[i]];
    } else if (Math.random() > 0.5 && holdingsList.length > 0) {
      // Multiple holdings
      assets = holdingsList.slice(0, Math.min(3, holdingsList.length));
    } else {
      // General market or new assets
      const potentialAssets = ['bitcoin', 'ethereum', 'defi-index', 'altcoin-market'];
      assets = [potentialAssets[Math.floor(Math.random() * potentialAssets.length)]];
    }
    
    // Format asset names for display
    const assetNames = assets.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ');
    
    // Adjust relevance based on whether this is for our holdings
    const relevanceAdjustment = assets.some(a => holdings.has(a)) ? 15 : 0;
    const relevance = Math.min(100, template.relevance + relevanceAdjustment);
    
    // Skip if below relevance threshold
    if (relevance < relevanceThreshold) continue;
    
    // Generate tags
    const tags = [template.type];
    if (relevance > 80) tags.push('high-priority');
    if (template.confidence > 80) tags.push('high-confidence');
    assets.forEach(a => tags.push(a));
    
    insights.push({
      id: `insight-${Date.now()}-${i}`,
      type: template.type as any,
      title: template.title.replace('{assets}', assetNames),
      summary: template.summary.replace('{assets}', assetNames),
      content: template.content.replace('{assets}', assetNames),
      relevance,
      timestamp,
      assets,
      tags,
      source: Math.random() > 0.5 ? 'ai_analysis' : 'market_data',
      confidence: template.confidence
    });
    
    // Only add up to the limit
    if (insights.length >= limit) break;
  }
  
  // Sort by relevance
  return insights.sort((a, b) => b.relevance - a.relevance);
}

export default {
  optimizePortfolio,
  assessPortfolioRisk,
  generateTradingSignals,
  getPersonalizedMarketInsights
};
