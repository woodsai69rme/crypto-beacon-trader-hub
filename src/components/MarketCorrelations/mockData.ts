import { CryptoData } from "@/types/trading";

export const generateMockCorrelations = (
  coins: CryptoData[],
  timeRange: '7d' | '30d' | '90d'
) => {
  // The timeRange parameter can be used to adjust correlation values
  // In a real implementation, we would fetch historical data for each timeframe
  
  const correlationMultiplier = 
    timeRange === '7d' ? 0.85 : 
    timeRange === '30d' ? 0.95 : 
    1; // 90d has strongest correlations in this mock
    
  const result: { [key: string]: { [key: string]: number } } = {};
  
  coins.forEach((coin1) => {
    result[coin1.id] = {};
    
    coins.forEach((coin2) => {
      if (coin1.id === coin2.id) {
        // Perfect correlation with self
        result[coin1.id][coin2.id] = 1;
      } else {
        // Generate a pseudo-random correlation based on the coins' market cap ranks
        // Similar market cap ranks tend to have higher correlation in reality
        const marketCapDiff = Math.abs(
          (coin1.market_cap_rank || 0) - (coin2.market_cap_rank || 0)
        );
        
        // Base correlation - closer ranks have higher correlation
        const baseCorrelation = 1 - Math.min(marketCapDiff / 20, 0.8);
        
        // Add some randomness
        const randomFactor = (Math.random() * 0.4) - 0.2;
        
        // Bitcoin tends to lead the market, so correlate more strongly with it
        const btcFactor = 
          (coin1.id === 'bitcoin' || coin2.id === 'bitcoin') ? 0.15 : 0;
          
        // Stablecoins should have near-zero or negative correlation with others
        const stableCoinFactor = 
          (coin1.symbol === 'USDT' || coin1.symbol === 'USDC' || 
           coin2.symbol === 'USDT' || coin2.symbol === 'USDC') ? -0.5 : 0;
           
        // Calculate final correlation and apply the time range multiplier
        let correlation = (baseCorrelation + randomFactor + btcFactor + stableCoinFactor) * correlationMultiplier;
        
        // Ensure correlation is between -1 and 1
        correlation = Math.max(-1, Math.min(1, correlation));
        
        result[coin1.id][coin2.id] = correlation;
      }
    });
  });
  
  return result;
};
