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
  portfolioVaR: number;
  portfolioCVaR: number;
  concentrationRisk: number;
  liquidityRisk: number;
  correlationMatrix: number[][];
}

export class PortfolioOptimizer {
  private riskFreeRate: number = 0.02;

  optimizePortfolio(
    assets: Asset[], 
    riskTolerance: 'conservative' | 'moderate' | 'aggressive' = 'moderate',
    targetReturn?: number
  ): OptimizationResult {
    const optimizedAssets = this.calculateOptimalWeights(assets, riskTolerance, targetReturn);
    const portfolio = this.constructPortfolio(optimizedAssets);
    const rebalanceRecommendations = this.generateRebalanceRecommendations(assets, optimizedAssets);
    const riskMetrics = this.calculateRiskMetrics(optimizedAssets);

    return {
      portfolio,
      rebalanceRecommendations,
      riskMetrics
    };
  }

  private calculateOptimalWeights(
    assets: Asset[], 
    riskTolerance: 'conservative' | 'moderate' | 'aggressive',
    targetReturn?: number
  ): Asset[] {
    const riskMultipliers = {
      conservative: 0.5,
      moderate: 1.0,
      aggressive: 1.5
    };

    const riskMultiplier = riskMultipliers[riskTolerance];
    
    const totalAssets = assets.length;
    const optimizedAssets: Asset[] = [];

    const correlationMatrix = this.calculateCorrelationMatrix(assets);
    
    for (let i = 0; i < totalAssets; i++) {
      const asset = assets[i];
      
      let baseWeight = (1 / asset.volatility) / assets.reduce((sum, a) => sum + (1 / a.volatility), 0);
      
      const returnAdjustment = targetReturn 
        ? Math.max(0.1, asset.expectedReturn / targetReturn)
        : (asset.expectedReturn + 1) / 2;
      
      const riskAdjustment = riskTolerance === 'conservative' 
        ? Math.min(1, 1 / asset.volatility)
        : riskTolerance === 'aggressive'
        ? Math.max(1, asset.volatility * 1.2)
        : 1;

      const avgCorrelation = correlationMatrix[i].reduce((sum, corr, j) => 
        i !== j ? sum + Math.abs(corr) : sum, 0) / (totalAssets - 1);
      const correlationPenalty = 1 - (avgCorrelation * 0.3);

      let optimizedWeight = baseWeight * returnAdjustment * riskAdjustment * correlationPenalty * riskMultiplier;
      
      optimizedWeight = Math.max(0.05, Math.min(0.4, optimizedWeight));
      
      optimizedAssets.push({
        ...asset,
        weight: optimizedWeight
      });
    }

    const totalWeight = optimizedAssets.reduce((sum, asset) => sum + asset.weight, 0);
    optimizedAssets.forEach(asset => {
      asset.weight = asset.weight / totalWeight;
    });

    return optimizedAssets;
  }

  private calculateCorrelationMatrix(assets: Asset[]): number[][] {
    const n = assets.length;
    const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          const asset1 = assets[i];
          const asset2 = assets[j];
          
          if (this.isCrypto(asset1.symbol) && this.isCrypto(asset2.symbol)) {
            matrix[i][j] = 0.6 + Math.random() * 0.3;
          } else {
            matrix[i][j] = Math.random() * 0.4;
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
    const totalValue = assets.reduce((sum, asset) => sum + (asset.weight * asset.price * 100), 0);
    
    const expectedReturn = assets.reduce((sum, asset) => sum + (asset.weight * asset.expectedReturn), 0);
    
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
    
    const maxDrawdown = volatility * 2.5;

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
      
      if (Math.abs(weightDiff) > 0.05) {
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
    
    const portfolioReturn = assets.reduce((sum, asset) => sum + (asset.weight * asset.expectedReturn), 0);
    const portfolioVolatility = this.calculatePortfolioVolatility(assets, correlationMatrix);
    const portfolioVaR = portfolioReturn - (1.645 * portfolioVolatility);
    
    const portfolioCVaR = portfolioReturn - (2.33 * portfolioVolatility);
    
    const concentrationRisk = assets.reduce((sum, asset) => sum + (asset.weight * asset.weight), 0);
    
    const liquidityRisk = assets.reduce((sum, asset) => {
      const liquidityScore = this.isCrypto(asset.symbol) ? 0.7 : 0.3;
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

  blackLittermanOptimization(assets: Asset[], views: { asset: string; expectedReturn: number; confidence: number }[]): Asset[] {
    const adjustedAssets = assets.map(asset => {
      const view = views.find(v => v.asset === asset.symbol);
      if (view) {
        const adjustedReturn = (asset.expectedReturn * (1 - view.confidence)) + 
                              (view.expectedReturn * view.confidence);
        return { ...asset, expectedReturn: adjustedReturn };
      }
      return asset;
    });

    return this.calculateOptimalWeights(adjustedAssets, 'moderate');
  }

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
        const randomReturn = this.normalRandom() * portfolioVolatility / Math.sqrt(252) + portfolioReturn / 252;
        cumulativeReturn += randomReturn;
      }
      
      outcomes.push(Math.exp(cumulativeReturn) - 1);
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
    let u1 = Math.random();
    let u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}

export const portfolioOptimizer = new PortfolioOptimizer();
