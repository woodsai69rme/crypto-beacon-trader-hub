
// Risk management service for trading operations
export interface RiskMetrics {
  portfolioValue: number;
  totalExposure: number;
  diversificationScore: number;
  volatilityRisk: number;
  liquidityRisk: number;
  concentrationRisk: number;
}

export interface RiskAlert {
  id: string;
  type: 'exposure' | 'concentration' | 'volatility' | 'liquidity';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

class RiskManagementService {
  calculateRiskMetrics(account: any): RiskMetrics {
    const portfolioValue = account?.balance || 10000;
    const assets = account?.assets || [];
    
    // Calculate total exposure
    const totalExposure = assets.reduce((sum: number, asset: any) => {
      return sum + (asset.quantity * asset.price);
    }, 0);

    // Calculate diversification score (0-100)
    const diversificationScore = this.calculateDiversification(assets);
    
    // Calculate volatility risk based on asset mix
    const volatilityRisk = this.calculateVolatilityRisk(assets);
    
    // Calculate liquidity risk
    const liquidityRisk = this.calculateLiquidityRisk(assets);
    
    // Calculate concentration risk
    const concentrationRisk = this.calculateConcentrationRisk(assets, totalExposure);

    return {
      portfolioValue,
      totalExposure,
      diversificationScore,
      volatilityRisk,
      liquidityRisk,
      concentrationRisk
    };
  }

  generateRiskAlerts(account: any): RiskAlert[] {
    const alerts: RiskAlert[] = [];
    const metrics = this.calculateRiskMetrics(account);
    
    // High exposure alert
    if (metrics.totalExposure > metrics.portfolioValue * 0.9) {
      alerts.push({
        id: `alert-${Date.now()}-1`,
        type: 'exposure',
        severity: 'high',
        message: 'Portfolio exposure exceeds 90% of total value',
        timestamp: new Date(),
        resolved: false
      });
    }

    // Low diversification alert
    if (metrics.diversificationScore < 30) {
      alerts.push({
        id: `alert-${Date.now()}-2`,
        type: 'concentration',
        severity: 'medium',
        message: 'Portfolio lacks diversification across asset classes',
        timestamp: new Date(),
        resolved: false
      });
    }

    // High volatility alert
    if (metrics.volatilityRisk > 70) {
      alerts.push({
        id: `alert-${Date.now()}-3`,
        type: 'volatility',
        severity: 'high',
        message: 'Portfolio volatility risk is elevated',
        timestamp: new Date(),
        resolved: false
      });
    }

    return alerts;
  }

  private calculateDiversification(assets: any[]): number {
    if (assets.length === 0) return 0;
    if (assets.length === 1) return 20;
    
    // Simple diversification score based on number of assets and their distribution
    const maxAssets = 10;
    const baseScore = Math.min(assets.length / maxAssets, 1) * 70;
    
    // Add bonus for even distribution
    const totalValue = assets.reduce((sum: number, asset: any) => sum + (asset.quantity * asset.price), 0);
    if (totalValue === 0) return baseScore;
    
    const weights = assets.map(asset => (asset.quantity * asset.price) / totalValue);
    const evenWeight = 1 / assets.length;
    const distributionScore = weights.reduce((score, weight) => {
      return score - Math.abs(weight - evenWeight);
    }, 30);
    
    return Math.max(0, Math.min(100, baseScore + distributionScore));
  }

  private calculateVolatilityRisk(assets: any[]): number {
    // Mock volatility calculation based on asset types
    const cryptoVolatility = 60; // High volatility
    const stablecoinVolatility = 5; // Low volatility
    
    let weightedVolatility = 0;
    let totalWeight = 0;
    
    assets.forEach(asset => {
      const weight = asset.quantity * asset.price;
      const volatility = asset.symbol?.includes('USD') ? stablecoinVolatility : cryptoVolatility;
      weightedVolatility += volatility * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? weightedVolatility / totalWeight : 0;
  }

  private calculateLiquidityRisk(assets: any[]): number {
    // Mock liquidity calculation
    const majorCoinsLiquidity = 10; // Low risk
    const altcoinsLiquidity = 40; // Medium risk
    const unknownLiquidity = 80; // High risk
    
    let weightedLiquidity = 0;
    let totalWeight = 0;
    
    assets.forEach(asset => {
      const weight = asset.quantity * asset.price;
      const majorCoins = ['BTC', 'ETH', 'USDT', 'USDC'];
      
      let liquidity = unknownLiquidity;
      if (majorCoins.includes(asset.symbol)) {
        liquidity = majorCoinsLiquidity;
      } else {
        liquidity = altcoinsLiquidity;
      }
      
      weightedLiquidity += liquidity * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? weightedLiquidity / totalWeight : 0;
  }

  private calculateConcentrationRisk(assets: any[], totalExposure: number): number {
    if (totalExposure === 0) return 0;
    
    // Calculate Herfindahl-Hirschman Index (HHI) for concentration
    const weights = assets.map(asset => (asset.quantity * asset.price) / totalExposure);
    const hhi = weights.reduce((sum, weight) => sum + weight * weight, 0);
    
    // Convert HHI to 0-100 scale (higher = more concentrated)
    return Math.min(100, hhi * 100);
  }
}

export const riskManagementService = new RiskManagementService();
