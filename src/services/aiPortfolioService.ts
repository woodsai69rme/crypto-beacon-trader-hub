import { RiskAssessmentResult, TradingAccount, PortfolioAsset, PortfolioOptimizationResult, OptimizationSettings, TradingSignal } from "@/types/trading";

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
            reason: `${asset.coinId.charAt(0).toUpperCase() + asset.coinId.slice(1)} has shown significant gains and technical indicators suggest a local top. Consider taking profits.`,
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

export default {
  assessPortfolioRisk,
  optimizePortfolio,
  generateTradingSignals
};
