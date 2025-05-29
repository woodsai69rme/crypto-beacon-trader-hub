import { TradingAccount, PortfolioAsset } from '@/types/trading';

class RiskManagementService {
  private riskToleranceLevels = {
    low: {
      maxSingleAssetAllocation: 0.2,
      maxVolatileAssetAllocation: 0.3,
      maxDrawdown: 0.05,
      sharpeRatioThreshold: 0.5
    },
    medium: {
      maxSingleAssetAllocation: 0.3,
      maxVolatileAssetAllocation: 0.5,
      maxDrawdown: 0.10,
      sharpeRatioThreshold: 0.7
    },
    high: {
      maxSingleAssetAllocation: 0.5,
      maxVolatileAssetAllocation: 0.8,
      maxDrawdown: 0.20,
      sharpeRatioThreshold: 1.0
    }
  };

  private assetRiskProfiles = {
    bitcoin: {
      volatility: 0.7,
      correlation: 0.5,
      liquidity: 0.8
    },
    ethereum: {
      volatility: 0.8,
      correlation: 0.6,
      liquidity: 0.7
    },
    cardano: {
      volatility: 0.9,
      correlation: 0.4,
      liquidity: 0.6
    },
    solana: {
      volatility: 1.0,
      correlation: 0.3,
      liquidity: 0.5
    },
    stablecoin: {
      volatility: 0.01,
      correlation: 0.1,
      liquidity: 0.9
    }
  };

  private calculateAssetRiskScore(asset: PortfolioAsset): number {
    const profile = this.assetRiskProfiles[asset.coinId] || {
      volatility: 0.5,
      correlation: 0.5,
      liquidity: 0.5
    };
    
    let riskScore = (
      profile.volatility * 0.4 +
      profile.correlation * 0.3 +
      (1 - profile.liquidity) * 0.3
    );
    
    riskScore = Math.max(0, Math.min(1, riskScore));
    
    return riskScore;
  }

  private assessDiversification(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;

    const assetCount = account.assets.length;
    const totalAllocation = account.assets.reduce((sum, asset) => sum + asset.allocation, 0);
    const idealAllocation = 100 / assetCount;

    let deviationSum = 0;
    for (const asset of account.assets) {
      deviationSum += Math.abs(asset.allocation - idealAllocation);
    }

    const averageDeviation = deviationSum / assetCount;
    const diversificationScore = 100 - averageDeviation;

    return Math.max(0, Math.min(100, diversificationScore));
  }

  private assessVolatility(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;

    let weightedVolatility = 0;
    for (const asset of account.assets) {
      const riskScore = this.calculateAssetRiskScore(asset);
      weightedVolatility += asset.allocation * riskScore;
    }

    return Math.max(0, Math.min(100, weightedVolatility * 100));
  }

  private assessLiquidity(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 100;

    let weightedLiquidity = 0;
    for (const asset of account.assets) {
      const profile = this.assetRiskProfiles[asset.coinId] || { liquidity: 0.5 };
      weightedLiquidity += asset.allocation * profile.liquidity;
    }

    return Math.max(0, Math.min(100, weightedLiquidity * 100));
  }

  private assessConcentrationRisk(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;

    const maxAllocation = Math.max(...account.assets.map(asset => asset.allocation));
    return Math.max(0, Math.min(100, maxAllocation));
  }

  private assessCorrelationRisk(account: TradingAccount): number {
    if (!account.assets || account.assets.length < 2) return 0;

    let totalCorrelation = 0;
    let pairCount = 0;

    for (let i = 0; i < account.assets.length; i++) {
      for (let j = i + 1; j < account.assets.length; j++) {
        const asset1 = account.assets[i];
        const asset2 = account.assets[j];

        const profile1 = this.assetRiskProfiles[asset1.coinId] || { correlation: 0.5 };
        const profile2 = this.assetRiskProfiles[asset2.coinId] || { correlation: 0.5 };

        const correlation = (profile1.correlation + profile2.correlation) / 2;
        totalCorrelation += correlation;
        pairCount++;
      }
    }

    const averageCorrelation = totalCorrelation / pairCount;
    return Math.max(0, Math.min(100, averageCorrelation * 100));
  }

  calculateRiskMetrics(account: TradingAccount): any {
    const diversificationScore = this.assessDiversification(account);
    const volatilityScore = this.assessVolatility(account);
    const liquidityScore = this.assessLiquidity(account);
    const concentrationRisk = this.assessConcentrationRisk(account);
    const correlationRisk = this.assessCorrelationRisk(account);

    const riskScore = (
      volatilityScore * 0.4 +
      concentrationRisk * 0.3 +
      correlationRisk * 0.2 +
      (100 - diversificationScore) * 0.1
    );

    const portfolioValue = (account.assets || []).reduce((sum, asset) => sum + asset.value, 0) + account.balance;
    const currentDrawdown = this.calculateCurrentDrawdown(account);
    const portfolioVaR = this.calculatePortfolioVaR(account);
    const beta = this.calculateBeta(account);
    const sharpeRatio = this.calculateSharpeRatio(account);

    return {
      riskScore: Math.max(0, Math.min(100, riskScore)),
      diversificationScore,
      volatilityScore,
      liquidityScore,
      concentrationRisk,
      correlationRisk,
      portfolioValue,
      currentDrawdown,
      portfolioVaR,
      beta,
      sharpeRatio
    };
  }

  generateRiskAlerts(account: TradingAccount): any[] {
    const metrics = this.calculateRiskMetrics(account);
    const alerts = [];

    if (metrics.concentrationRisk > 50) {
      alerts.push({
        type: 'critical',
        message: 'Portfolio is too concentrated in a few assets',
        action: 'Rebalance to diversify holdings'
      });
    }

    if (metrics.volatilityScore > 70) {
      alerts.push({
        type: 'warning',
        message: 'Portfolio volatility is high',
        action: 'Consider reducing exposure to volatile assets'
      });
    }

    if (metrics.currentDrawdown > 0.15) {
      alerts.push({
        type: 'critical',
        message: 'Portfolio drawdown exceeds 15%',
        action: 'Review risk management strategy'
      });
    }

    return alerts;
  }

  private calculateCurrentDrawdown(account: TradingAccount): number {
    const initialBalance = account.initialBalance || account.balance;
    const currentValue = (account.assets || []).reduce((sum, asset) => sum + asset.value, 0) + account.balance;
    const drawdown = (initialBalance - currentValue) / initialBalance;
    return Math.max(0, drawdown);
  }

  private calculatePortfolioVaR(account: TradingAccount, confidenceLevel: number = 0.95): number {
    const portfolioValue = (account.assets || []).reduce((sum, asset) => sum + asset.value, 0) + account.balance;
    const volatility = this.calculatePortfolioVolatility(account);
    const zScore = this.getZScore(confidenceLevel);
    const varValue = zScore * volatility * portfolioValue;
    return varValue;
  }

  private calculatePortfolioVolatility(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;

    let weightedVolatility = 0;
    for (const asset of account.assets) {
      const assetData = this.assetRiskProfiles[asset.coinId] || { volatility: 0.5 };
      weightedVolatility += asset.allocation * assetData.volatility;
    }

    return weightedVolatility;
  }

  private getZScore(confidenceLevel: number): number {
    // Approximation for common confidence levels
    if (confidenceLevel === 0.95) return 1.645;
    if (confidenceLevel === 0.99) return 2.33;
    return 1.645;
  }

  private calculateBeta(account: TradingAccount, marketVolatility: number = 0.8): number {
    if (!account.assets || account.assets.length === 0) return 1;

    let weightedCorrelation = 0;
    for (const asset of account.assets) {
      const assetData = this.assetRiskProfiles[asset.coinId] || { correlation: 0.5 };
      weightedCorrelation += asset.allocation * assetData.correlation;
    }

    const portfolioVolatility = this.calculatePortfolioVolatility(account);
    return weightedCorrelation * (portfolioVolatility / marketVolatility);
  }

  private calculateSharpeRatio(account: TradingAccount, riskFreeRate: number = 0.02): number {
    const expectedReturn = this.calculateExpectedReturn(account);
    const portfolioVolatility = this.calculatePortfolioVolatility(account);
    const excessReturn = expectedReturn - riskFreeRate;
    return excessReturn / portfolioVolatility;
  }

  private calculateExpectedReturn(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;

    let expectedReturn = 0;
    for (const asset of account.assets) {
      const assetData = this.assetRiskProfiles[asset.coinId] || { volatility: 0.5 };
      expectedReturn += asset.allocation * (1 - assetData.volatility);
    }

    return expectedReturn;
  }
}

const calculateAssetVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0;
  
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  
  const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
};

export const riskManagementService = new RiskManagementService();
