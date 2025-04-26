
import { CryptoData } from "@/services/cryptoApi";

export function generateMockCorrelations(
  coinsData: CryptoData[], 
  timeRange: '7d' | '30d' | '90d'
): { [key: string]: { [key: string]: number } } {
  const mockCorrelations: { [key: string]: { [key: string]: number } } = {};
  
  coinsData.forEach((coin1) => {
    mockCorrelations[coin1.id] = {};
    coinsData.forEach((coin2) => {
      if (coin1.id === coin2.id) {
        mockCorrelations[coin1.id][coin2.id] = 1;
      } else {
        // Generate a random correlation value between -1 and 1
        // In a real app, this would be calculated from price movements
        const baseSeed = (coin1.id.charCodeAt(0) + coin2.id.charCodeAt(0)) / 200;
        
        // Make correlation more stable for longer timeframes
        const randomFactor = timeRange === '7d' ? 0.8 : 
                            timeRange === '30d' ? 0.6 : 0.4;
        
        const randomCorrelation = baseSeed + (Math.random() * 2 - 1) * randomFactor;
        // Clamp values to -1 to 1 range
        const clampedValue = Math.max(-1, Math.min(1, randomCorrelation));
        
        mockCorrelations[coin1.id][coin2.id] = parseFloat(clampedValue.toFixed(2));
      }
    });
  });
  
  return mockCorrelations;
}
