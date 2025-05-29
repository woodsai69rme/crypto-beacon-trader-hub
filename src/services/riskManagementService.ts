import { TradingAccount, Trade, PortfolioAsset } from '@/types/trading';
import { toast } from "@/hooks/use-toast";

interface RiskParameters {
  maxPositionSize: number; // Percentage of portfolio
  maxDailyLoss: number; // Maximum daily loss in AUD
  stopLossPercentage: number; // Default stop loss percentage
  takeProfitPercentage: number; // Default take profit percentage
  maxCorrelation: number; // Maximum correlation between positions
  volatilityThreshold: number; // Maximum acceptable volatility
  liquidityThreshold: number; // Minimum liquidity requirement
}

interface RiskMetrics {
  portfolioVaR: number; // Value at Risk (95% confidence)
  sharpeRatio: number;
  maxDrawdown: number;
  currentDrawdown: number;
  beta: number; // Portfolio beta vs market
  diversificationRatio: number;
  riskScore: number; // Overall risk score 0-100
}

interface PositionRisk {
  assetId: string;
  currentValue: number;
  portfolioPercentage: number;
  volatility: number;
  liquidityScore: number;
  correlationRisk: number;
  riskRating: 'low' | 'medium' | 'high' | 'extreme';
}

class RiskManagementService {
  private defaultRiskParameters: RiskParameters = {
    maxPositionSize: 20, // 20% max position size
    maxDailyLoss: 1000, // $1000 AUD max daily loss
    stopLossPercentage: 10, // 10% stop loss
    takeProfitPercentage: 25, // 25% take profit
    maxCorrelation: 0.8, // 80% max correlation
    volatilityThreshold: 50, // 50% max volatility
    liquidityThreshold: 1000000 // $1M minimum daily volume
  };

  private riskParameters: Map<string, RiskParameters> = new Map();

  setRiskParameters(accountId: string, parameters: Partial<RiskParameters>): void {
    const current = this.riskParameters.get(accountId) || { ...this.defaultRiskParameters };
    this.riskParameters.set(accountId, { ...current, ...parameters });
  }

  getRiskParameters(accountId: string): RiskParameters {
    return this.riskParameters.get(accountId) || { ...this.defaultRiskParameters };
  }

  // Pre-trade risk validation
  validateTrade(
    accountId: string,
    trade: Omit<Trade, 'id' | 'timestamp'>,
    account: TradingAccount,
    currentPrice: number
  ): { allowed: boolean; reasons: string[]; adjustedAmount?: number } {
    const riskParams = this.getRiskParameters(accountId);
    const reasons: string[] = [];
    let allowed = true;
    let adjustedAmount = trade.amount;

    // Check position size
    const tradeValue = trade.amount * currentPrice;
    const portfolioValue = this.calculatePortfolioValue(account);
    const positionPercentage = (tradeValue / portfolioValue) * 100;

    if (positionPercentage > riskParams.maxPositionSize) {
      allowed = false;
      reasons.push(`Position size ${positionPercentage.toFixed(2)}% exceeds maximum ${riskParams.maxPositionSize}%`);
      
      // Suggest adjusted amount
      adjustedAmount = (portfolioValue * riskParams.maxPositionSize / 100) / currentPrice;
    }

    // Check daily loss limit
    const dailyPnL = this.calculateDailyPnL(account);
    if (dailyPnL < -riskParams.maxDailyLoss) {
      allowed = false;
      reasons.push(`Daily loss limit of $${riskParams.maxDailyLoss} AUD already exceeded`);
    }

    // Check existing position concentration
    const existingPosition = account.assets?.find(asset => asset.coinId === trade.coinId);
    if (existingPosition && trade.type === 'buy') {
      const newPositionValue = existingPosition.value + tradeValue;
      const newPercentage = (newPositionValue / portfolioValue) * 100;
      
      if (newPercentage > riskParams.maxPositionSize) {
        allowed = false;
        reasons.push(`Combined position would exceed maximum allocation of ${riskParams.maxPositionSize}%`);
      }
    }

    // Liquidity check (mock implementation)
    const liquidityScore = this.calculateLiquidityScore(trade.coinId);
    if (liquidityScore < riskParams.liquidityThreshold) {
      reasons.push(`Warning: Low liquidity for ${trade.coinSymbol}`);
    }

    return { allowed, reasons, adjustedAmount: allowed ? undefined : adjustedAmount };
  }

  // Calculate comprehensive risk metrics
  calculateRiskMetrics(account: TradingAccount): RiskMetrics {
    const portfolioValue = this.calculatePortfolioValue(account);
    const assets = account.assets || [];

    // Calculate VaR (simplified Monte Carlo simulation)
    const portfolioVaR = this.calculateVaR(assets, portfolioValue);

    // Calculate Sharpe ratio
    const returns = this.calculatePortfolioReturns(account);
    const sharpeRatio = this.calculateSharpeRatio(returns);

    // Calculate maximum drawdown
    const { maxDrawdown, currentDrawdown } = this.calculateDrawdown(account);

    // Calculate portfolio beta
    const beta = this.calculatePortfolioBeta(assets);

    // Diversification ratio
    const diversificationRatio = this.calculateDiversificationRatio(assets);

    // Overall risk score
    const riskScore = this.calculateOverallRiskScore({
      portfolioVaR,
      sharpeRatio,
      maxDrawdown,
      currentDrawdown,
      beta,
      diversificationRatio
    });

    return {
      portfolioVaR,
      sharpeRatio,
      maxDrawdown,
      currentDrawdown,
      beta,
      diversificationRatio,
      riskScore
    };
  }

  // Analyze individual position risks
  analyzePositionRisks(account: TradingAccount): PositionRisk[] {
    const assets = account.assets || [];
    const portfolioValue = this.calculatePortfolioValue(account);

    return assets.map(asset => {
      const portfolioPercentage = (asset.value / portfolioValue) * 100;
      const volatility = this.calculateAssetVolatility(asset.coinId);
      const liquidityScore = this.calculateLiquidityScore(asset.coinId);
      const correlationRisk = this.calculateCorrelationRisk(asset.coinId, assets);

      let riskRating: 'low' | 'medium' | 'high' | 'extreme' = 'low';
      
      if (portfolioPercentage > 40 || volatility > 80 || correlationRisk > 0.9) {
        riskRating = 'extreme';
      } else if (portfolioPercentage > 25 || volatility > 60 || correlationRisk > 0.8) {
        riskRating = 'high';
      } else if (portfolioPercentage > 15 || volatility > 40 || correlationRisk > 0.6) {
        riskRating = 'medium';
      }

      return {
        assetId: asset.coinId,
        currentValue: asset.value,
        portfolioPercentage,
        volatility,
        liquidityScore,
        correlationRisk,
        riskRating
      };
    });
  }

  // Generate risk alerts
  generateRiskAlerts(account: TradingAccount): Array<{
    type: 'warning' | 'critical';
    message: string;
    action: string;
  }> {
    const alerts: Array<{ type: 'warning' | 'critical'; message: string; action: string }> = [];
    const riskMetrics = this.calculateRiskMetrics(account);
    const positionRisks = this.analyzePositionRisks(account);
    const riskParams = this.getRiskParameters(account.id);

    // Portfolio level alerts
    if (riskMetrics.currentDrawdown > 20) {
      alerts.push({
        type: 'critical',
        message: `Portfolio drawdown is ${riskMetrics.currentDrawdown.toFixed(2)}%`,
        action: 'Consider reducing position sizes or hedging'
      });
    }

    if (riskMetrics.riskScore > 80) {
      alerts.push({
        type: 'critical',
        message: `Overall risk score is very high (${riskMetrics.riskScore})`,
        action: 'Review and reduce portfolio risk immediately'
      });
    }

    if (riskMetrics.diversificationRatio < 0.3) {
      alerts.push({
        type: 'warning',
        message: 'Portfolio lacks diversification',
        action: 'Consider adding uncorrelated assets'
      });
    }

    // Position level alerts
    positionRisks.forEach(position => {
      if (position.riskRating === 'extreme') {
        alerts.push({
          type: 'critical',
          message: `${position.assetId} position has extreme risk`,
          action: 'Consider reducing position size immediately'
        });
      }

      if (position.portfolioPercentage > riskParams.maxPositionSize) {
        alerts.push({
          type: 'warning',
          message: `${position.assetId} exceeds maximum position size (${position.portfolioPercentage.toFixed(2)}%)`,
          action: 'Reduce position to comply with risk limits'
        });
      }
    });

    return alerts;
  }

  // Automated risk management actions
  async executeAutomatedRiskManagement(account: TradingAccount): Promise<Array<{
    action: string;
    assetId: string;
    amount: number;
    reason: string;
  }>> {
    const actions: Array<{ action: string; assetId: string; amount: number; reason: string }> = [];
    const riskMetrics = this.calculateRiskMetrics(account);
    const positionRisks = this.analyzePositionRisks(account);
    const riskParams = this.getRiskParameters(account.id);

    // Automatic position reduction for extreme risk
    for (const position of positionRisks) {
      if (position.riskRating === 'extreme' || position.portfolioPercentage > riskParams.maxPositionSize * 1.5) {
        const targetPercentage = Math.min(riskParams.maxPositionSize, 15); // Cap at 15% for extreme risk
        const reductionPercentage = 1 - (targetPercentage / position.portfolioPercentage);
        const reductionAmount = position.currentValue * reductionPercentage;

        actions.push({
          action: 'reduce_position',
          assetId: position.assetId,
          amount: reductionAmount,
          reason: `Risk rating: ${position.riskRating}, Portfolio allocation: ${position.portfolioPercentage.toFixed(2)}%`
        });
      }
    }

    // Implement stop-losses for positions in drawdown
    if (riskMetrics.currentDrawdown > 15) {
      for (const asset of account.assets || []) {
        if (asset.changePercent24h < -riskParams.stopLossPercentage) {
          actions.push({
            action: 'stop_loss',
            assetId: asset.coinId,
            amount: asset.value * 0.5, // Reduce by 50%
            reason: `Asset down ${asset.changePercent24h.toFixed(2)}% exceeding stop loss threshold`
          });
        }
      }
    }

    return actions;
  }

  // Private calculation methods
  private calculatePortfolioValue(account: TradingAccount): number {
    const assetValue = (account.assets || []).reduce((sum, asset) => sum + asset.value, 0);
    return account.balance + assetValue;
  }

  private calculateDailyPnL(account: TradingAccount): number {
    // Mock calculation - would use actual trade history
    const todaysTrades = account.trades.filter(trade => {
      const tradeDate = new Date(trade.timestamp);
      const today = new Date();
      return tradeDate.toDateString() === today.toDateString();
    });

    return todaysTrades.reduce((sum, trade) => {
      return sum + (trade.type === 'buy' ? -trade.totalValue : trade.totalValue);
    }, 0);
  }

  private calculateLiquidityScore(coinId: string): number {
    // Mock liquidity calculation
    const liquidityMap: Record<string, number> = {
      'bitcoin': 10000000,
      'ethereum': 5000000,
      'cardano': 1000000,
      'solana': 2000000
    };
    return liquidityMap[coinId] || 500000;
  }

  private calculateVaR(assets: PortfolioAsset[], portfolioValue: number): number {
    // Simplified VaR calculation (95% confidence, 1-day horizon)
    const portfolioVolatility = this.calculatePortfolioVolatility(assets);
    return portfolioValue * portfolioVolatility * 1.65; // 95% confidence interval
  }

  private calculatePortfolioVolatility(assets: PortfolioAsset[]): number {
    if (assets.length === 0) return 0;
    
    const weights = assets.map(asset => asset.allocation / 100);
    const volatilities = assets.map(asset => this.calculateAssetVolatility(asset.coinId) / 100);
    
    // Simplified calculation without correlation matrix
    const weightedVolatility = weights.reduce((sum, weight, i) => {
      return sum + (weight * weight * volatilities[i] * volatilities[i]);
    }, 0);
    
    return Math.sqrt(weightedVolatility);
  }

  private calculateAssetVolatility(coinId: string): number {
    // Mock volatility data
    const volatilityMap: Record<string, number> = {
      'bitcoin': 45,
      'ethereum': 55,
      'cardano': 70,
      'solana': 80
    };
    return volatilityMap[coinId] || 60;
  }

  private calculatePortfolioReturns(account: TradingAccount): number[] {
    // Mock returns calculation
    return Array.from({ length: 30 }, () => (Math.random() - 0.5) * 0.1);
  }

  private calculateSharpeRatio(returns: number[]): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);
    
    const riskFreeRate = 0.05 / 365; // 5% annual risk-free rate
    return volatility === 0 ? 0 : (avgReturn - riskFreeRate) / volatility;
  }

  private calculateDrawdown(account: TradingAccount): { maxDrawdown: number; currentDrawdown: number } {
    // Mock drawdown calculation
    const currentValue = this.calculatePortfolioValue(account);
    const initialValue = account.initialBalance || account.balance;
    const currentDrawdown = Math.max(0, (1 - currentValue / initialValue) * 100);
    
    return {
      maxDrawdown: Math.max(currentDrawdown, 15), // Mock historical max
      currentDrawdown
    };
  }

  private calculatePortfolioBeta(assets: PortfolioAsset[]): number {
    // Mock beta calculation (vs BTC as market proxy)
    return assets.reduce((weightedBeta, asset) => {
      const weight = asset.allocation / 100;
      const assetBeta = this.getAssetBeta(asset.coinId);
      return weightedBeta + (weight * assetBeta);
    }, 0);
  }

  private getAssetBeta(coinId: string): number {
    const betaMap: Record<string, number> = {
      'bitcoin': 1.0,
      'ethereum': 1.2,
      'cardano': 1.5,
      'solana': 1.8
    };
    return betaMap[coinId] || 1.3;
  }

  private calculateDiversificationRatio(assets: PortfolioAsset[]): number {
    if (assets.length <= 1) return 0;
    
    // Simplified diversification calculation
    const weightSquareSum = assets.reduce((sum, asset) => {
      const weight = asset.allocation / 100;
      return sum + (weight * weight);
    }, 0);
    
    return 1 - weightSquareSum;
  }

  private calculateCorrelationRisk(assetId: string, assets: PortfolioAsset[]): number {
    // Mock correlation calculation
    const correlations = assets.map(asset => this.getAssetCorrelation(assetId, asset.coinId));
    return correlations.length > 0 ? Math.max(...correlations) : 0;
  }

  private getAssetCorrelation(asset1: string, asset2: string): number {
    if (asset1 === asset2) return 1;
    
    // Mock correlation matrix
    const correlationMap: Record<string, Record<string, number>> = {
      'bitcoin': { 'ethereum': 0.7, 'cardano': 0.6, 'solana': 0.5 },
      'ethereum': { 'bitcoin': 0.7, 'cardano': 0.8, 'solana': 0.7 },
      'cardano': { 'bitcoin': 0.6, 'ethereum': 0.8, 'solana': 0.6 },
      'solana': { 'bitcoin': 0.5, 'ethereum': 0.7, 'cardano': 0.6 }
    };
    
    return correlationMap[asset1]?.[asset2] || 0.5;
  }

  private calculateOverallRiskScore(metrics: Partial<RiskMetrics>): number {
    let score = 50; // Base score
    
    // Adjust based on various risk factors
    if (metrics.maxDrawdown && metrics.maxDrawdown > 20) score += 20;
    if (metrics.sharpeRatio && metrics.sharpeRatio < 0.5) score += 15;
    if (metrics.diversificationRatio && metrics.diversificationRatio < 0.3) score += 15;
    if (metrics.beta && metrics.beta > 1.5) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }
}

export const riskManagementService = new RiskManagementService();

export const calculatePortfolioRisk = (account: TradingAccount): number => {
  if (!account.assets || account.assets.length === 0) {
    return 0;
  }

  const totalValue = account.balance || 10000; // Use balance as fallback
  
  // Calculate portfolio risk based on asset allocation and volatility
  let totalRisk = 0;
  
  account.assets.forEach(asset => {
    const assetValue = asset.amount * asset.price;
    const weight = assetValue / totalValue;
    const volatility = calculateAssetVolatility(asset);
    totalRisk += weight * volatility;
  });

  return Math.min(totalRisk * 100, 100); // Cap at 100%
};
