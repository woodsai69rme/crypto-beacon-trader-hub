
import { TradingAccount, PortfolioAsset, Trade } from '@/types/trading';

export interface RiskMetrics {
  riskScore: number;
  diversificationScore: number;
  volatilityScore: number;
  liquidityScore: number;
  concentrationRisk: number;
  correlationRisk: number;
  portfolioValue: number;
  currentDrawdown: number;
  portfolioVaR: number;
  beta: number;
  sharpeRatio: number;
  maxDrawdown: number;
  diversificationRatio: number;
}

export interface RiskAlert {
  type: 'critical' | 'warning' | 'info';
  message: string;
  action: string;
  severity: number;
}

export interface PositionSizingParams {
  accountBalance: number;
  riskPerTrade: number;
  stopLossDistance: number;
  volatility: number;
}

export class RiskManagementService {
  private readonly riskToleranceLevels = {
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

  private readonly assetRiskProfiles = {
    bitcoin: { volatility: 0.7, correlation: 0.5, liquidity: 0.8 },
    ethereum: { volatility: 0.8, correlation: 0.6, liquidity: 0.7 },
    cardano: { volatility: 0.9, correlation: 0.4, liquidity: 0.6 },
    solana: { volatility: 1.0, correlation: 0.3, liquidity: 0.5 },
    stablecoin: { volatility: 0.01, correlation: 0.1, liquidity: 0.9 }
  };

  calculateRiskMetrics(account: TradingAccount): RiskMetrics {
    const portfolioValue = (account.assets || []).reduce((sum, asset) => sum + asset.value, 0) + account.balance;
    
    return {
      riskScore: this.calculateOverallRiskScore(account),
      diversificationScore: this.assessDiversification(account),
      volatilityScore: this.assessVolatility(account),
      liquidityScore: this.assessLiquidity(account),
      concentrationRisk: this.assessConcentrationRisk(account),
      correlationRisk: this.assessCorrelationRisk(account),
      portfolioValue,
      currentDrawdown: this.calculateCurrentDrawdown(account),
      portfolioVaR: this.calculatePortfolioVaR(account),
      beta: this.calculateBeta(account),
      sharpeRatio: this.calculateSharpeRatio(account),
      maxDrawdown: this.calculateMaxDrawdown(account),
      diversificationRatio: this.calculateDiversificationRatio(account)
    };
  }

  generateRiskAlerts(account: TradingAccount): RiskAlert[] {
    const metrics = this.calculateRiskMetrics(account);
    const alerts: RiskAlert[] = [];

    if (metrics.concentrationRisk > 50) {
      alerts.push({
        type: 'critical',
        message: 'Portfolio is too concentrated in a few assets',
        action: 'Rebalance to diversify holdings',
        severity: 9
      });
    }

    if (metrics.volatilityScore > 70) {
      alerts.push({
        type: 'warning',
        message: 'Portfolio volatility is high',
        action: 'Consider reducing exposure to volatile assets',
        severity: 7
      });
    }

    if (metrics.currentDrawdown > 0.15) {
      alerts.push({
        type: 'critical',
        message: 'Portfolio drawdown exceeds 15%',
        action: 'Review risk management strategy',
        severity: 10
      });
    }

    if (metrics.liquidityScore < 30) {
      alerts.push({
        type: 'warning',
        message: 'Portfolio liquidity is low',
        action: 'Increase allocation to liquid assets',
        severity: 6
      });
    }

    return alerts.sort((a, b) => b.severity - a.severity);
  }

  calculateOptimalPositionSize(params: PositionSizingParams): number {
    const { accountBalance, riskPerTrade, stopLossDistance, volatility } = params;
    
    // Kelly Criterion
    const kellyCriterion = this.calculateKellyCriterion(0.6, 1.5); // Assuming 60% win rate, 1.5 avg win/loss
    
    // Risk-based position sizing
    const riskAmount = accountBalance * (riskPerTrade / 100);
    const positionSize = riskAmount / stopLossDistance;
    
    // Volatility adjustment
    const volatilityAdjustment = Math.min(1, 0.2 / volatility);
    
    return Math.min(positionSize * volatilityAdjustment, accountBalance * kellyCriterion);
  }

  calculateStopLoss(entryPrice: number, volatility: number, riskLevel: 'low' | 'medium' | 'high'): number {
    const multipliers = { low: 1.5, medium: 2.0, high: 3.0 };
    const atr = entryPrice * volatility * 0.1; // Simplified ATR calculation
    return entryPrice - (atr * multipliers[riskLevel]);
  }

  calculateTakeProfit(entryPrice: number, stopLoss: number, riskRewardRatio: number = 2): number {
    const risk = entryPrice - stopLoss;
    return entryPrice + (risk * riskRewardRatio);
  }

  private calculateOverallRiskScore(account: TradingAccount): number {
    const diversificationScore = this.assessDiversification(account);
    const volatilityScore = this.assessVolatility(account);
    const concentrationRisk = this.assessConcentrationRisk(account);
    const correlationRisk = this.assessCorrelationRisk(account);

    return (
      volatilityScore * 0.4 +
      concentrationRisk * 0.3 +
      correlationRisk * 0.2 +
      (100 - diversificationScore) * 0.1
    );
  }

  private assessDiversification(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;

    const assetCount = account.assets.length;
    const idealAllocation = 100 / assetCount;
    let deviationSum = 0;

    for (const asset of account.assets) {
      deviationSum += Math.abs(asset.allocation - idealAllocation);
    }

    const averageDeviation = deviationSum / assetCount;
    return Math.max(0, Math.min(100, 100 - averageDeviation));
  }

  private assessVolatility(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;

    let weightedVolatility = 0;
    for (const asset of account.assets) {
      const profile = this.assetRiskProfiles[asset.coinId] || { volatility: 0.5 };
      weightedVolatility += (asset.allocation / 100) * profile.volatility;
    }

    return Math.max(0, Math.min(100, weightedVolatility * 100));
  }

  private assessLiquidity(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 100;

    let weightedLiquidity = 0;
    for (const asset of account.assets) {
      const profile = this.assetRiskProfiles[asset.coinId] || { liquidity: 0.5 };
      weightedLiquidity += (asset.allocation / 100) * profile.liquidity;
    }

    return Math.max(0, Math.min(100, weightedLiquidity * 100));
  }

  private assessConcentrationRisk(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;
    return Math.max(...account.assets.map(asset => asset.allocation));
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
        
        totalCorrelation += (profile1.correlation + profile2.correlation) / 2;
        pairCount++;
      }
    }

    return pairCount > 0 ? (totalCorrelation / pairCount) * 100 : 0;
  }

  private calculateCurrentDrawdown(account: TradingAccount): number {
    const initialBalance = account.initialBalance || account.balance;
    const currentValue = (account.assets || []).reduce((sum, asset) => sum + asset.value, 0) + account.balance;
    return Math.max(0, (initialBalance - currentValue) / initialBalance);
  }

  private calculatePortfolioVaR(account: TradingAccount, confidenceLevel: number = 0.95): number {
    const portfolioValue = (account.assets || []).reduce((sum, asset) => sum + asset.value, 0) + account.balance;
    const volatility = this.calculatePortfolioVolatility(account);
    const zScore = confidenceLevel === 0.95 ? 1.645 : 2.33;
    return zScore * volatility * portfolioValue;
  }

  private calculatePortfolioVolatility(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;

    let weightedVolatility = 0;
    for (const asset of account.assets) {
      const profile = this.assetRiskProfiles[asset.coinId] || { volatility: 0.5 };
      weightedVolatility += (asset.allocation / 100) * profile.volatility;
    }

    return weightedVolatility;
  }

  private calculateBeta(account: TradingAccount, marketVolatility: number = 0.8): number {
    if (!account.assets || account.assets.length === 0) return 1;

    let weightedCorrelation = 0;
    for (const asset of account.assets) {
      const profile = this.assetRiskProfiles[asset.coinId] || { correlation: 0.5 };
      weightedCorrelation += (asset.allocation / 100) * profile.correlation;
    }

    const portfolioVolatility = this.calculatePortfolioVolatility(account);
    return weightedCorrelation * (portfolioVolatility / marketVolatility);
  }

  private calculateSharpeRatio(account: TradingAccount, riskFreeRate: number = 0.02): number {
    const expectedReturn = this.calculateExpectedReturn(account);
    const portfolioVolatility = this.calculatePortfolioVolatility(account);
    return portfolioVolatility === 0 ? 0 : (expectedReturn - riskFreeRate) / portfolioVolatility;
  }

  private calculateMaxDrawdown(account: TradingAccount): number {
    // This would require historical portfolio values
    // For now, return current drawdown as approximation
    return this.calculateCurrentDrawdown(account) * 100;
  }

  private calculateDiversificationRatio(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;
    
    // Simplified calculation - in practice would use correlation matrix
    const assetCount = account.assets.length;
    const maxDiversification = assetCount;
    const actualDiversification = Math.sqrt(assetCount); // Simplified
    
    return actualDiversification / maxDiversification;
  }

  private calculateExpectedReturn(account: TradingAccount): number {
    if (!account.assets || account.assets.length === 0) return 0;

    let expectedReturn = 0;
    for (const asset of account.assets) {
      const profile = this.assetRiskProfiles[asset.coinId] || { volatility: 0.5 };
      // Simple expected return based on inverse volatility
      expectedReturn += (asset.allocation / 100) * (0.1 - profile.volatility * 0.05);
    }

    return expectedReturn;
  }

  private calculateKellyCriterion(winRate: number, avgWinLossRatio: number): number {
    return (winRate * avgWinLossRatio - (1 - winRate)) / avgWinLossRatio;
  }
}

export const riskManagementService = new RiskManagementService();
