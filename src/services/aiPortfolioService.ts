import { RiskAssessmentResult, TradingAccount, PortfolioAsset, PortfolioOptimizationResult, OptimizationSettings, TradingSignal, MarketInsight } from "@/types/trading";

// Mock risk assessment data
const mockRiskFactors = {
  "bitcoin": ["High volatility", "Large market cap provides some stability", "Significant allocation in portfolio"],
  "ethereum": ["Smart contract risks", "Network congestion concerns", "Good diversification from Bitcoin"],
  "solana": ["Network outage history", "Relatively new blockchain", "High-performance but higher technical risk"],
  "cardano": ["Development delays", "Limited dApp ecosystem", "Strong research background"],
  "binancecoin": ["Exchange dependency risk", "Regulatory concerns", "Strong utility in Binance ecosystem"]
};

// Function to assess portfolio risk
export const assessPortfolioRisk = async (account: TradingAccount): Promise<RiskAssessmentResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const assets = account.assets || [];
  const symbols = assets.map(asset => asset.coinId);
  
  // Calculate diversification score - higher is better
  const diversificationScore = Math.min(100, assets.length * 15);
  
  // Calculate volatility score - higher indicates more volatility
  const volatilityScore = 40 + Math.random() * 30;
  
  // Calculate liquidity score - higher is better
  const liquidityScore = 60 + Math.random() * 25;
  
  // Simulate concentration risk
  let concentrationRisk = 100;
  if (assets.length > 0) {
    // Get the highest allocation percentage in the portfolio
    const maxAllocation = Math.max(...assets.map(asset => asset.amount * asset.price / account.balance * 100));
    // Lower score for more concentrated portfolios
    concentrationRisk = Math.min(100, maxAllocation * 1.2);
  }
  
  // Simulate correlation risk (lower is better)
  const correlationRisk = 50 + Math.random() * 20;
  
  // Calculate overall risk score (higher is riskier)
  const overallScore = Math.round(
    (volatilityScore * 0.3) + 
    ((100 - diversificationScore) * 0.2) + 
    ((100 - liquidityScore) * 0.1) + 
    (concentrationRisk * 0.2) + 
    (correlationRisk * 0.2)
  );
  
  // Generate asset-specific risk analysis
  const riskByAsset: Record<string, { score: number; factors: string[] }> = {};
  
  assets.forEach(asset => {
    const randomRiskScore = Math.round(30 + Math.random() * 50);
    const factors = mockRiskFactors[asset.coinId as keyof typeof mockRiskFactors] || 
                   ["Generic risk factor", "Market exposure"];
                   
    riskByAsset[asset.coinId] = {
      score: randomRiskScore,
      factors: factors.slice(0, 2 + Math.floor(Math.random() * 2)) // Select 2-3 factors
    };
  });
  
  // Generate recommendations based on the analysis
  const recommendations = [
    overallScore > 70 ? "Consider reducing exposure to volatile assets" : "Portfolio has a reasonable risk profile",
    diversificationScore < 60 ? "Increase diversification across more assets" : "Good diversification across assets",
    Object.keys(riskByAsset).length > 0 && 
      Math.max(...Object.values(riskByAsset).map(r => r.score)) > 60 ? 
      `Re-evaluate high-risk asset: ${Object.entries(riskByAsset)
        .sort((a, b) => b[1].score - a[1].score)[0][0]}` : 
      "No individual assets with extremely high risk"
  ];
  
  // Add more specific recommendations based on the portfolio composition
  if (assets.length === 1) {
    recommendations.push("Holding only one asset creates significant concentration risk");
  } else if (assets.length <= 3) {
    recommendations.push("Consider adding more assets to improve diversification");
  }
  
  if (concentrationRisk > 60) {
    recommendations.push("Reduce concentration in your largest holdings");
  }
  
  if (correlationRisk > 70) {
    recommendations.push("Add assets with lower correlation to your existing holdings");
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
};

// Function to optimize portfolio based on settings
export const optimizePortfolio = async (
  account: TradingAccount, 
  settings: OptimizationSettings
): Promise<PortfolioOptimizationResult> => {
  // Simulate API delay for optimization
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const assets = account.assets || [];
  
  // Current allocation
  const currentAllocation: Record<string, number> = {};
  assets.forEach(asset => {
    const value = asset.amount * asset.price;
    currentAllocation[asset.coinId] = +(value / account.balance * 100).toFixed(2);
  });
  
  // Generate a suggested allocation that improves upon current allocation
  // based on the optimization settings
  const suggestedAllocation: Record<string, number> = { ...currentAllocation };
  
  // Adjust allocations based on risk tolerance
  const totalAdjustment = settings.riskTolerance === 'low' ? 0.2 : 
                          settings.riskTolerance === 'medium' ? 0.3 : 0.4;
  
  // Simple algorithm: reduce allocation of high-risk assets and increase for low-risk ones
  // In a real app, this would use actual portfolio optimization algorithms
  let remainingPercent = 100;
  
  Object.keys(suggestedAllocation).forEach(coinId => {
    // Arbitrary adjustment based on coin "risk" (would be calculated properly in production)
    const currentPercent = suggestedAllocation[coinId];
    let newPercent = currentPercent;
    
    if (coinId === 'bitcoin' || coinId === 'ethereum') {
      // Increase allocation to major assets for low risk
      if (settings.riskTolerance === 'low') {
        newPercent = Math.min(40, currentPercent * 1.2);
      } else if (settings.riskTolerance === 'high') {
        newPercent = Math.max(5, currentPercent * 0.9);
      }
    } else {
      // Adjust altcoins based on risk tolerance
      if (settings.riskTolerance === 'low') {
        newPercent = Math.max(1, currentPercent * 0.8);
      } else if (settings.riskTolerance === 'high') {
        newPercent = currentPercent * 1.3;
      }
    }
    
    suggestedAllocation[coinId] = +newPercent.toFixed(2);
    remainingPercent -= newPercent;
  });
  
  // Add a new asset if we have room and high risk tolerance
  if (settings.riskTolerance === 'high' && assets.length < 5 && remainingPercent > 5) {
    const newCoinOptions = ['polkadot', 'avalanche', 'polygon'];
    const newCoin = newCoinOptions[Math.floor(Math.random() * newCoinOptions.length)];
    suggestedAllocation[newCoin] = +remainingPercent.toFixed(2);
    remainingPercent = 0;
  }
  
  // Normalize to ensure total allocation is 100%
  const totalSuggested = Object.values(suggestedAllocation).reduce((sum, val) => sum + val, 0);
  if (totalSuggested !== 100) {
    const normFactor = 100 / totalSuggested;
    Object.keys(suggestedAllocation).forEach(key => {
      suggestedAllocation[key] = +(suggestedAllocation[key] * normFactor).toFixed(2);
    });
  }
  
  // Calculate metrics for the new portfolio
  const expectedReturn = settings.riskTolerance === 'low' ? 8 + Math.random() * 4 : 
                        settings.riskTolerance === 'medium' ? 12 + Math.random() * 6 : 
                        18 + Math.random() * 8;
  
  const expectedRisk = settings.riskTolerance === 'low' ? 5 + Math.random() * 3 : 
                      settings.riskTolerance === 'medium' ? 10 + Math.random() * 5 : 
                      18 + Math.random() * 7;
  
  const sharpeRatio = expectedReturn / expectedRisk;
  
  const diversification = 100 - (Math.max(...Object.values(suggestedAllocation)) - 
                               Math.min(...Object.values(suggestedAllocation)));
  
  // Generate rebalancing trades
  const rebalancingTrades = [];
  const date = new Date().toISOString();
  
  for (const coinId of Object.keys(suggestedAllocation)) {
    const asset = assets.find(a => a.coinId === coinId);
    const currentPercentage = asset ? (asset.amount * asset.price / account.balance * 100) : 0;
    const targetPercentage = suggestedAllocation[coinId];
    const diff = targetPercentage - currentPercentage;
    
    if (Math.abs(diff) > 1) { // Only suggest trades for significant changes (>1%)
      const tradeAmount = Math.abs(account.balance * diff / 100);
      const coinPrice = asset?.price || 100; // Default price if new coin
      const amount = tradeAmount / coinPrice;
      
      rebalancingTrades.push({
        id: `trade-${Date.now()}-${coinId}`,
        coinId: coinId,
        coinName: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        coinSymbol: coinId.substring(0, 3).toUpperCase(),
        type: diff > 0 ? 'buy' : 'sell',
        amount: amount,
        price: coinPrice,
        totalValue: tradeAmount,
        timestamp: date,
        currency: account.currency,
        total: tradeAmount,
        tags: ['rebalance', settings.riskTolerance]
      });
    }
  }
  
  return {
    currentAllocation,
    suggestedAllocation,
    expectedReturn,
    expectedRisk,
    sharpeRatio,
    diversification,
    rebalancingTrades
  };
};

// Function to generate AI-based trading signals
export const generateTradingSignals = async (
  account: TradingAccount,
  options: { limit?: number; minConfidence?: number } = {}
): Promise<TradingSignal[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  const { limit = 8, minConfidence = 60 } = options;
  const signals: TradingSignal[] = [];
  
  // Get available assets from account
  const assets = account.assets || [];
  
  // Generate signals for existing assets (sell signals)
  for (const asset of assets) {
    // Only generate signals for some assets to make it more realistic
    if (Math.random() > 0.6) {
      const confidence = Math.round(65 + Math.random() * 25);
      
      // Only include signals that meet minimum confidence
      if (confidence >= minConfidence) {
        const priceChange = asset.priceChange || (asset.price * (Math.random() * 0.1 - 0.05));
        const isSell = priceChange > 0 && Math.random() > 0.3;
        
        if (isSell) {
          const targetPrice = asset.price * (1 + (Math.random() * 0.05 + 0.02));
          const stopLoss = asset.price * (1 - (Math.random() * 0.03 + 0.01));
          
          signals.push({
            id: `signal-${Date.now()}-${asset.coinId}-sell`,
            coinId: asset.coinId,
            coinSymbol: asset.coinId.substring(0, 3).toUpperCase(),
            type: 'sell',
            price: asset.price,
            strength: confidence,
            timestamp: new Date().toISOString(),
            reason: `${asset.coinId.charAt(0).toUpperCase() + asset.coin.slice(1)} has shown significant gains and technical indicators suggest a local top. Consider taking profits.`,
            suggestedActions: {
              entry: asset.price,
              target: targetPrice,
              stopLoss: stopLoss
            }
          });
        }
      }
    }
  }
  
  // Generate buy signals for potential new assets
  const potentialCoins = ["bitcoin", "ethereum", "solana", "cardano", "binancecoin", "ripple", "polkadot", "avalanche", "polygon", "chainlink"]
    .filter(coin => !assets.some(a => a.coinId === coin));
  
  for (const coin of potentialCoins) {
    if (signals.length >= limit) break;
    
    // Only generate signals for some coins
    if (Math.random() > 0.7) {
      const confidence = Math.round(70 + Math.random() * 20);
      
      // Only include signals that meet minimum confidence
      if (confidence >= minConfidence) {
        const basePrice = coin === "bitcoin" ? 50000 + Math.random() * 10000 : 
                        coin === "ethereum" ? 2800 + Math.random() * 400 :
                        coin === "solana" ? 100 + Math.random() * 30 :
                        coin === "cardano" ? 0.4 + Math.random() * 0.1 :
                        coin === "binancecoin" ? 600 + Math.random() * 50 :
                        coin === "ripple" ? 0.5 + Math.random() * 0.1 :
                        coin === "polkadot" ? 10 + Math.random() * 5 :
                        coin === "avalanche" ? 30 + Math.random() * 10 :
                        coin === "polygon" ? 0.8 + Math.random() * 0.2 :
                        40 + Math.random() * 10; // chainlink or default
        
        const targetPrice = basePrice * (1 + (Math.random() * 0.08 + 0.04));
        const stopLoss = basePrice * (1 - (Math.random() * 0.05 + 0.02));
        
        signals.push({
          id: `signal-${Date.now()}-${coin}-buy`,
          coinId: coin,
          coinSymbol: coin.substring(0, 3).toUpperCase(),
          type: 'buy',
          price: basePrice,
          strength: confidence,
          timestamp: new Date().toISOString(),
          reason: `${coin.charAt(0).toUpperCase() + coin.slice(1)} is showing bullish signals with increasing volume and positive price action. Technical indicators suggest potential upward movement.`,
          suggestedActions: {
            entry: basePrice,
            target: targetPrice,
            stopLoss: stopLoss
          }
        });
      }
    }
  }
  
  // Sort signals by confidence (strength) in descending order
  signals.sort((a, b) => b.strength - a.strength);
  
  // Limit the number of signals returned
  return signals.slice(0, limit);
};

// Function to generate personalized market insights for the user's portfolio
export const getPersonalizedMarketInsights = async (
  account: TradingAccount,
  options: { limit?: number; relevanceThreshold?: number } = {}
): Promise<MarketInsight[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const { limit = 10, relevanceThreshold = 60 } = options;
  const insights: MarketInsight[] = [];
  
  // Get available assets from account
  const assets = account.assets || [];
  const assetIds = assets.map(asset => asset.coinId);
  
  // Generate insights based on portfolio composition
  const insightTypes = ['trend', 'opportunity', 'risk', 'event', 'analysis'];
  const possibleAssets = [...assetIds, 'bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin', 'ripple'];
  
  // Market trends
  insights.push({
    id: `insight-${Date.now()}-1`,
    type: 'trend',
    title: 'Growing DeFi adoption likely to benefit Ethereum',
    summary: 'Recent data shows DeFi TVL has increased 15% this month, with Ethereum-based protocols leading the growth.',
    relevance: assetIds.includes('ethereum') ? 90 : 75,
    confidence: 85,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    assets: ['ethereum', 'polygon'],
    details: 'Total Value Locked across DeFi protocols has risen steadily over the past month, with particular growth in lending and DEX sectors. This trend is likely to continue as institutional interest grows, benefiting smart contract platforms.'
  });
  
  // Risk insight
  if (assetIds.includes('solana')) {
    insights.push({
      id: `insight-${Date.now()}-2`,
      type: 'risk',
      title: 'Solana network congestion could impact short-term growth',
      summary: 'Recent network issues on Solana have led to transaction delays, potentially impacting dApp adoption.',
      relevance: 92,
      confidence: 78,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      assets: ['solana'],
      details: 'While Solana has made significant improvements to network stability, recent congestion issues highlight ongoing challenges. The team is implementing further optimizations, but competing L1s may gain market share in the meantime.'
    });
  }
  
  // Opportunity insight
  insights.push({
    id: `insight-${Date.now()}-3`,
    type: 'opportunity',
    title: 'Bitcoin ETF inflows could drive broader market momentum',
    summary: 'Sustained Bitcoin ETF inflows are creating buying pressure that historically benefits the entire crypto market.',
    relevance: 85,
    confidence: 82,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    assets: ['bitcoin', 'ethereum', 'binancecoin'],
    details: 'ETF inflows have consistently remained positive despite market volatility, indicating growing institutional adoption. Historically, sustained Bitcoin strength leads to rotation into major altcoins within 2-3 weeks.'
  });
  
  // Event insight
  insights.push({
    id: `insight-${Date.now()}-4`,
    type: 'event',
    title: 'Cardano Vasil hard fork approaching - potential volatility',
    summary: 'The upcoming Vasil hard fork could create short-term price volatility for ADA as the market reacts to the upgrade.',
    relevance: assetIds.includes('cardano') ? 95 : 65,
    confidence: 88,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    assets: ['cardano'],
    details: 'Major network upgrades historically create price volatility. While long-term implications are positive, short-term traders should be prepared for potential swings in either direction.'
  });
  
  // Generate additional insights to meet the limit
  for (let i = insights.length; i < limit; i++) {
    // Skip if we already have enough insights
    if (insights.length >= limit) break;
    
    const type = insightTypes[Math.floor(Math.random() * insightTypes.length)];
    const relatedAssets = [possibleAssets[Math.floor(Math.random() * possibleAssets.length)]];
    
    // Add another asset sometimes
    if (Math.random() > 0.7) {
      const secondAsset = possibleAssets[Math.floor(Math.random() * possibleAssets.length)];
      if (!relatedAssets.includes(secondAsset)) {
        relatedAssets.push(secondAsset);
      }
    }
    
    // Calculate relevance - higher if the assets are in the user's portfolio
    const portfolioOverlap = relatedAssets.filter(asset => assetIds.includes(asset)).length;
    const relevance = 50 + (portfolioOverlap / relatedAssets.length) * 40 + Math.random() * 10;
    
    if (relevance < relevanceThreshold) {
      continue; // Skip if below threshold
    }
    
    // Generate insight based on type
    let title, summary;
    
    switch (type) {
      case 'trend':
        title = `${capitalizeFirstLetter(relatedAssets[0])} showing strong momentum in trading volume`;
        summary = `Trading volume for ${relatedAssets[0]} has increased by ${Math.round(20 + Math.random() * 30)}% over the past week, indicating growing interest.`;
        break;
      case 'opportunity':
        title = `Technical indicators suggest potential entry point for ${capitalizeFirstLetter(relatedAssets[0])}`;
        summary = `Multiple indicators including RSI and MACD are signaling a potential reversal after recent price action.`;
        break;
      case 'risk':
        title = `Regulatory uncertainty could impact ${capitalizeFirstLetter(relatedAssets[0])} in the short term`;
        summary = `Recent regulatory developments may create headwinds for ${relatedAssets[0]} and similar assets in the coming weeks.`;
        break;
      case 'event':
        title = `Upcoming protocol upgrade for ${capitalizeFirstLetter(relatedAssets[0])} scheduled next month`;
        summary = `The planned technical upgrade could improve scalability and potentially impact token economics.`;
        break;
      case 'analysis':
        title = `Correlation between ${capitalizeFirstLetter(relatedAssets[0])} and traditional markets decreasing`;
        summary = `Data shows ${relatedAssets[0]} has been decoupling from traditional market movements over the past 30 days.`;
        break;
      default:
        title = `Market analysis for ${capitalizeFirstLetter(relatedAssets[0])}`;
        summary = `Recent market activity suggests changing sentiment around ${relatedAssets[0]} and similar assets.`;
    }
    
    insights.push({
      id: `insight-${Date.now()}-${i+5}`,
      type: type,
      title: title,
      summary: summary,
      relevance: Math.round(relevance),
      confidence: Math.round(65 + Math.random() * 25),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 48) * 60 * 60 * 1000).toISOString(), // Random time in last 48 hours
      assets: relatedAssets,
      details: `This insight is based on analysis of market data, news sentiment, and technical indicators related to ${relatedAssets.join(', ')}.`
    });
  }
  
  // Sort insights by relevance (descending)
  insights.sort((a, b) => b.relevance - a.relevance);
  
  // Return limited number of insights
  return insights.slice(0, limit);
};

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default {
  assessPortfolioRisk,
  optimizePortfolio,
  generateTradingSignals,
  getPersonalizedMarketInsights
};
