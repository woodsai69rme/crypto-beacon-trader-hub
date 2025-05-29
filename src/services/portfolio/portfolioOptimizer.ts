
export interface Asset {
  symbol: string;
  name: string;
  weight: number;
  expectedReturn: number;
  volatility: number;
  price: number;
}

export interface Portfolio {
  assets: Asset[];
  totalValue: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface OptimizationResult {
  portfolio: Portfolio;
  rebalanceRecommendations: RebalanceRecommendation[];
  riskMetrics: RiskMetrics;
}

export interface RebalanceRecommendation {
  asset: string;
  currentWeight: number;
  targetWeight: number;
  action: 'buy' | 'sell' | 'hold';
  amount: number;
  priority: 'high' | 'medium' | 'low';
}

export interface RiskMetrics {
  portfolioVaR: number; // Value at Risk
  portfolioCVaR: number; // Conditional VaR
  concentrationRisk: number;
  liquidityRisk: number;
  correlationMatrix: number[][];
}

export class PortfolioOptimizer {
  private riskFreeRate: number = 0.02; // 2% annual risk-free rate

  // Modern Portfolio Theory optimization
  optimizePortfolio(assets: Asset[], targetReturn?: number, riskTolerance: 'conservative' | 'moderate' | 'aggressive' = 'moderate'): OptimizationResult {
    const optimizedAssets = this.calculateOptimalWeights(assets, targetReturn, riskTolerance);
    const portfolio = this.constructPortfolio(optimizedAssets);
    const rebalanceRecommendations = this.generateRebalanceRecommendations(assets, optimizedAssets);
    const riskMetrics = this.calculateRiskMetrics(optimizedAssets);

    return {
      portfolio,
      rebalanceRecommendations,
      riskMetrics
    };
  }

  private calculateOptimalWeights(assets: Asset[], targetReturn?: number, riskTolerance: 'conservative' | 'moderate' | 'aggressive'): Asset[] {
    // Risk tolerance mapping
    const riskMultipliers = {
      conservative: 0.5,
      moderate: 1.0,
      aggressive: 1.5
    };

    const riskMultiplier = riskMultipliers[riskTolerance];
    
    // Simple optimization using Markowitz-inspired approach
    const totalAssets = assets.length;
    const optimizedAssets: Asset[] = [];

    // Calculate correlation matrix
    const correlationMatrix = this.calculateCorrelationMatrix(assets);
    
    // Risk parity approach with adjustments
    for (let i = 0; i < totalAssets; i++) {
      const asset = assets[i];
      
      // Base weight using inverse volatility
      let baseWeight = (1 / asset.volatility) / assets.reduce((sum, a) => sum + (1 / a.volatility), 0);
      
      // Adjust for expected return
      const returnAdjustment = targetReturn 
        ? Math.max(0.1, asset.expectedReturn / targetReturn)
        : (asset.expectedReturn + 1) / 2;
      
      // Adjust for risk tolerance
      const riskAdjustment = riskTolerance === 'conservative' 
        ? Math.min(1, 1 / asset.volatility)
        : riskTolerance === 'aggressive'
        ? Math.max(1, asset.volatility * 1.2)
        : 1;

      // Calculate correlation penalty
      const avgCorrelation = correlationMatrix[i].reduce((sum, corr, j) => 
        i !== j ? sum + Math.abs(corr) : sum, 0) / (totalAssets - 1);
      const correlationPenalty = 1 - (avgCorrelation * 0.3);

      let optimizedWeight = baseWeight * returnAdjustment * riskAdjustment * correlationPenalty * riskMultiplier;
      
      // Apply constraints
      optimizedWeight = Math.max(0.05, Math.min(0.4, optimizedWeight)); // Min 5%, Max 40%
      
      optimizedAssets.push({
        ...asset,
        weight: optimizedWeight
      });
    }

    // Normalize weights to sum to 1
    const totalWeight = optimizedAssets.reduce((sum, asset) => sum + asset.weight, 0);
    optimizedAssets.forEach(asset => {
      asset.weight = asset.weight / totalWeight;
    });

    return optimizedAssets;
  }

  private calculateCorrelationMatrix(assets: Asset[]): number[][] {
    const n = assets.length;
    const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
    
    // Mock correlation calculation (in production, use historical price data)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          // Mock correlation based on asset types
          const asset1 = assets[i];
          const asset2 = assets[j];
          
          // Crypto assets tend to be more correlated
          if (this.isCrypto(asset1.symbol) && this.isCrypto(asset2.symbol)) {
            matrix[i][j] = 0.6 + Math.random() * 0.3; // 0.6-0.9 correlation
          } else {
            matrix[i][j] = Math.random() * 0.4; // 0-0.4 correlation
          }
        }
      }
    }
    
    return matrix;
  }

  private isCrypto(symbol: string): boolean {
    const cryptoSymbols = ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'LINK', 'UNI', 'MATIC'];
    return cryptoSymbols.includes(symbol);
  }

  private constructPortfolio(assets: Asset[]): Portfolio {
    const totalValue = assets.reduce((sum, asset) => sum + (asset.weight * asset.price * 100), 0); // Assuming $100 per unit
    
    const expectedReturn = assets.reduce((sum, asset) => sum + (asset.weight * asset.expectedReturn), 0);
    
    // Portfolio volatility using correlation matrix
    const correlationMatrix = this.calculateCorrelationMatrix(assets);
    let portfolioVariance = 0;
    
    for (let i = 0; i < assets.length; i++) {
      for (let j = 0; j < assets.length; j++) {
        portfolioVariance += assets[i].weight * assets[j].weight * 
                           assets[i].volatility * assets[j].volatility * 
                           correlationMatrix[i][j];
      }
    }
    
    const volatility = Math.sqrt(portfolioVariance);
    const sharpeRatio = (expectedReturn - this.riskFreeRate) / volatility;
    
    // Mock max drawdown calculation
    const maxDrawdown = volatility * 2.5; // Simplified estimation

    return {
      assets,
      totalValue,
      expectedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown
    };
  }

  private generateRebalanceRecommendations(currentAssets: Asset[], targetAssets: Asset[]): RebalanceRecommendation[] {
    const recommendations: RebalanceRecommendation[] = [];
    
    for (let i = 0; i < currentAssets.length; i++) {
      const current = currentAssets[i];
      const target = targetAssets[i];
      const weightDiff = target.weight - current.weight;
      
      if (Math.abs(weightDiff) > 0.05) { // 5% threshold
        const action: 'buy' | 'sell' | 'hold' = weightDiff > 0 ? 'buy' : 'sell';
        const priority: 'high' | 'medium' | 'low' = 
          Math.abs(weightDiff) > 0.15 ? 'high' :
          Math.abs(weightDiff) > 0.1 ? 'medium' : 'low';
        
        recommendations.push({
          asset: current.symbol,
          currentWeight: current.weight,
          targetWeight: target.weight,
          action,
          amount: Math.abs(weightDiff),
          priority
        });
      }
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private calculateRiskMetrics(assets: Asset[]): RiskMetrics {
    const correlationMatrix = this.calculateCorrelationMatrix(assets);
    
    // Value at Risk (95% confidence level)
    const portfolioReturn = assets.reduce((sum, asset) => sum + (asset.weight * asset.expectedReturn), 0);
    const portfolioVolatility = this.calculatePortfolioVolatility(assets, correlationMatrix);
    const portfolioVaR = portfolioReturn - (1.645 * portfolioVolatility); // 95% VaR
    
    // Conditional VaR (Expected Shortfall)
    const portfolioCVaR = portfolioReturn - (2.33 * portfolioVolatility); // Simplified CVaR
    
    // Concentration risk (Herfindahl index)
    const concentrationRisk = assets.reduce((sum, asset) => sum + (asset.weight * asset.weight), 0);
    
    // Liquidity risk (simplified based on asset type)
    const liquidityRisk = assets.reduce((sum, asset) => {
      const liquidityScore = this.isCrypto(asset.symbol) ? 0.7 : 0.3; // Crypto generally less liquid
      return sum + (asset.weight * liquidityScore);
    }, 0);

    return {
      portfolioVaR,
      portfolioCVaR,
      concentrationRisk,
      liquidityRisk,
      correlationMatrix
    };
  }

  private calculatePortfolioVolatility(assets: Asset[], correlationMatrix: number[][]): number {
    let portfolioVariance = 0;
    
    for (let i = 0; i < assets.length; i++) {
      for (let j = 0; j < assets.length; j++) {
        portfolioVariance += assets[i].weight * assets[j].weight * 
                           assets[i].volatility * assets[j].volatility * 
                           correlationMatrix[i][j];
      }
    }
    
    return Math.sqrt(portfolioVariance);
  }

  // Black-Litterman model implementation (simplified)
  blackLittermanOptimization(assets: Asset[], views: { asset: string; expectedReturn: number; confidence: number }[]): Asset[] {
    // Simplified Black-Litterman implementation
    const adjustedAssets = assets.map(asset => {
      const view = views.find(v => v.asset === asset.symbol);
      if (view) {
        // Adjust expected return based on view and confidence
        const adjustedReturn = (asset.expectedReturn * (1 - view.confidence)) + 
                              (view.expectedReturn * view.confidence);
        return { ...asset, expectedReturn: adjustedReturn };
      }
      return asset;
    });

    return this.calculateOptimalWeights(adjustedAssets);
  }

  // Monte Carlo simulation for portfolio performance
  runMonteCarloSimulation(assets: Asset[], simulations: number = 1000, timeHorizon: number = 252): {
    outcomes: number[];
    statistics: {
      mean: number;
      median: number;
      standardDeviation: number;
      percentile5: number;
      percentile95: number;
    };
  } {
    const outcomes: number[] = [];
    const portfolioReturn = assets.reduce((sum, asset) => sum + (asset.weight * asset.expectedReturn), 0);
    const portfolioVolatility = this.calculatePortfolioVolatility(assets, this.calculateCorrelationMatrix(assets));
    
    for (let i = 0; i < simulations; i++) {
      let cumulativeReturn = 0;
      
      for (let day = 0; day < timeHorizon; day++) {
        // Generate random return using normal distribution
        const randomReturn = this.normalRandom() * portfolioVolatility / Math.sqrt(252) + portfolioReturn / 252;
        cumulativeReturn += randomReturn;
      }
      
      outcomes.push(Math.exp(cumulativeReturn) - 1); // Convert to total return
    }
    
    outcomes.sort((a, b) => a - b);
    
    const mean = outcomes.reduce((sum, outcome) => sum + outcome, 0) / outcomes.length;
    const median = outcomes[Math.floor(outcomes.length / 2)];
    const variance = outcomes.reduce((sum, outcome) => sum + Math.pow(outcome - mean, 2), 0) / outcomes.length;
    const standardDeviation = Math.sqrt(variance);
    const percentile5 = outcomes[Math.floor(outcomes.length * 0.05)];
    const percentile95 = outcomes[Math.floor(outcomes.length * 0.95)];

    return {
      outcomes,
      statistics: {
        mean,
        median,
        standardDeviation,
        percentile5,
        percentile95
      }
    };
  }

  private normalRandom(): number {
    // Box-Muller transformation for normal distribution
    let u1 = Math.random();
    let u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}

export const portfolioOptimizer = new PortfolioOptimizer();
