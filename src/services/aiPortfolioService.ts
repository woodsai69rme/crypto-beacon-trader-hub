
import { TradingAccount, Trade, PortfolioAsset } from '@/types/trading';

// Mock AI portfolio service
const aiPortfolioService = {
  /**
   * Generate an optimal portfolio allocation based on risk level
   */
  generatePortfolioAllocation(
    riskLevel: 'conservative' | 'moderate' | 'aggressive',
    preferredAssets: string[] = []
  ): PortfolioAsset[] {
    // Mock assets for different risk levels
    const portfolioAllocations: Record<string, PortfolioAsset[]> = {
      conservative: [
        { coinId: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', amount: 0.12, price: 58352.12, value: 7002.25, allocation: 35, change24h: 432.10, changePercent24h: 1.85 },
        { coinId: 'ethereum', symbol: 'ETH', name: 'Ethereum', amount: 1.5, price: 3105.78, value: 4658.67, allocation: 25, change24h: 125.87, changePercent24h: 2.10 },
        { coinId: 'usdc', symbol: 'USDC', name: 'USD Coin', amount: 4000, price: 1, value: 4000, allocation: 20, change24h: 0, changePercent24h: 0 },
        { coinId: 'binancecoin', symbol: 'BNB', name: 'Binance Coin', amount: 2.3, price: 611.45, value: 1406.33, allocation: 10, change24h: -25.76, changePercent24h: -0.45 },
        { coinId: 'solana', symbol: 'SOL', name: 'Solana', amount: 12.5, price: 152.37, value: 1904.63, allocation: 10, change24h: 85.32, changePercent24h: 3.55 },
      ],
      moderate: [
        { coinId: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', amount: 0.18, price: 58352.12, value: 10503.38, allocation: 30, change24h: 648.15, changePercent24h: 1.85 },
        { coinId: 'ethereum', symbol: 'ETH', name: 'Ethereum', amount: 2.8, price: 3105.78, value: 8696.18, allocation: 25, change24h: 234.96, changePercent24h: 2.10 },
        { coinId: 'solana', symbol: 'SOL', name: 'Solana', amount: 32.5, price: 152.37, value: 4952.03, allocation: 15, change24h: 221.84, changePercent24h: 3.55 },
        { coinId: 'binancecoin', symbol: 'BNB', name: 'Binance Coin', amount: 5.8, price: 611.45, value: 3546.41, allocation: 10, change24h: -65.01, changePercent24h: -0.45 },
        { coinId: 'cardano', symbol: 'ADA', name: 'Cardano', amount: 7500, price: 0.45, value: 3375, allocation: 10, change24h: -73.24, changePercent24h: -2.17 },
        { coinId: 'polkadot', symbol: 'DOT', name: 'Polkadot', amount: 210, price: 8.32, value: 1747.2, allocation: 5, change24h: 21.56, changePercent24h: 0.78 },
        { coinId: 'usdc', symbol: 'USDC', name: 'USD Coin', amount: 1750, price: 1, value: 1750, allocation: 5, change24h: 0, changePercent24h: 0 },
      ],
      aggressive: [
        { coinId: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', amount: 0.25, price: 58352.12, value: 14588.03, allocation: 25, change24h: 900.21, changePercent24h: 1.85 },
        { coinId: 'ethereum', symbol: 'ETH', name: 'Ethereum', amount: 4.2, price: 3105.78, value: 13044.28, allocation: 20, change24h: 352.44, changePercent24h: 2.10 },
        { coinId: 'solana', symbol: 'SOL', name: 'Solana', amount: 65.3, price: 152.37, value: 9949.76, allocation: 15, change24h: 445.56, changePercent24h: 3.55 },
        { coinId: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', amount: 180, price: 35.25, value: 6345, allocation: 10, change24h: 178.32, changePercent24h: 2.75 },
        { coinId: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', amount: 3200, price: 1.35, value: 4320, allocation: 8, change24h: 132.41, changePercent24h: 4.12 },
        { coinId: 'binancecoin', symbol: 'BNB', name: 'Binance Coin', amount: 7.5, price: 611.45, value: 4585.88, allocation: 7, change24h: -84.07, changePercent24h: -0.45 },
        { coinId: 'cardano', symbol: 'ADA', name: 'Cardano', amount: 10000, price: 0.45, value: 4500, allocation: 7, change24h: -97.65, changePercent24h: -2.17 },
        { coinId: 'polkadot', symbol: 'DOT', name: 'Polkadot', amount: 350, price: 8.32, value: 2912, allocation: 5, change24h: 35.93, changePercent24h: 0.78 },
        { coinId: 'chainlink', symbol: 'LINK', name: 'Chainlink', amount: 125, price: 14.25, value: 1781.25, allocation: 3, change24h: 45.32, changePercent24h: 2.35 },
      ]
    };
    
    // Get allocation based on risk level
    let allocation = portfolioAllocations[riskLevel];
    
    // If preferred assets are specified, adjust allocation to include them
    if (preferredAssets.length > 0) {
      // Ensure preferred assets are included (this is simplified logic)
      preferredAssets.forEach(assetId => {
        if (!allocation.some(asset => asset.coinId === assetId)) {
          // Add a small allocation for this asset
          allocation = [
            ...allocation.slice(0, -1), // Remove the smallest allocation
            { coinId: assetId, symbol: assetId.slice(0, 3).toUpperCase(), name: assetId.charAt(0).toUpperCase() + assetId.slice(1), amount: 0, price: 0, value: 0, allocation: 5, change24h: 0, changePercent24h: 0 }
          ];
          
          // Rebalance allocations (simplified)
          let totalAllocation = allocation.reduce((sum, asset) => sum + asset.allocation, 0);
          allocation = allocation.map(asset => ({
            ...asset,
            allocation: Math.round((asset.allocation / totalAllocation) * 100)
          }));
        }
      });
    }
    
    return allocation;
  },
  
  /**
   * Generate a rebalancing recommendation for an existing portfolio
   */
  generateRebalancingRecommendation(
    account: TradingAccount,
    targetAllocation: PortfolioAsset[]
  ): Trade[] {
    // This is a simplified mock implementation
    const trades: Trade[] = [];
    
    if (!account.assets || account.assets.length === 0) {
      return [];
    }
    
    // Calculate current allocations
    const totalValue = account.assets.reduce((sum, asset) => sum + asset.value, 0);
    const currentAllocations = account.assets.map(asset => ({
      ...asset,
      allocation: (asset.value / totalValue) * 100
    }));
    
    // Compare with target and generate trades
    targetAllocation.forEach(targetAsset => {
      const currentAsset = currentAllocations.find(a => a.coinId === targetAsset.coinId);
      
      if (!currentAsset) {
        // Need to buy new asset
        trades.push({
          id: `trade-${Date.now()}-${targetAsset.coinId}`,
          coinId: targetAsset.coinId,
          coinName: targetAsset.name,
          coinSymbol: targetAsset.symbol,
          type: 'buy',
          amount: targetAsset.amount,
          price: targetAsset.price,
          total: targetAsset.value,
          totalValue: targetAsset.value,
          timestamp: new Date().toISOString(),
          currency: 'USD',
          tags: ['rebalancing']
        });
      } else if (Math.abs(currentAsset.allocation - targetAsset.allocation) > 3) {
        // Need to rebalance (if difference is more than 3%)
        const type = currentAsset.allocation > targetAsset.allocation ? 'sell' : 'buy';
        const amountDiff = Math.abs(targetAsset.amount - currentAsset.amount);
        
        trades.push({
          id: `trade-${Date.now()}-${targetAsset.coinId}`,
          coinId: targetAsset.coinId,
          coinName: targetAsset.name,
          coinSymbol: targetAsset.symbol,
          type,
          amount: amountDiff,
          price: targetAsset.price,
          total: amountDiff * targetAsset.price,
          totalValue: amountDiff * targetAsset.price,
          timestamp: new Date().toISOString(),
          currency: 'USD',
          tags: ['rebalancing']
        });
      }
    });
    
    // Check for assets to sell that aren't in target allocation
    currentAllocations.forEach(currentAsset => {
      if (!targetAllocation.some(a => a.coinId === currentAsset.coinId)) {
        trades.push({
          id: `trade-${Date.now()}-${currentAsset.coinId}`,
          coinId: currentAsset.coinId,
          coinName: currentAsset.name,
          coinSymbol: currentAsset.symbol,
          type: 'sell',
          amount: currentAsset.amount,
          price: currentAsset.price,
          total: currentAsset.value,
          totalValue: currentAsset.value,
          timestamp: new Date().toISOString(),
          currency: 'USD',
          tags: ['rebalancing']
        });
      }
    });
    
    return trades;
  }
};

export default aiPortfolioService;
