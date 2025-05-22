
import { CryptoData } from '@/types/trading';

// Calculate correlation between two arrays
export function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;

  // Calculate mean of x and y
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate numerator and denominators
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    denominatorX += xDiff * xDiff;
    denominatorY += yDiff * yDiff;
  }

  // Calculate correlation
  const denominator = Math.sqrt(denominatorX * denominatorY);
  if (denominator === 0) return 0;
  
  return numerator / denominator;
}

// Calculate correlations between selected coins
export function calculateCorrelations(
  cryptoData: CryptoData[],
  selectedCoins: string[],
  metric: 'price' | 'volume' | 'marketCap' = 'price'
): any[] {
  const result = [];
  
  // Filter data to only include selected coins
  const filteredData = cryptoData.filter(crypto => selectedCoins.includes(crypto.id));
  
  // Generate all pairs of coins
  for (let i = 0; i < filteredData.length; i++) {
    for (let j = i + 1; j < filteredData.length; j++) {
      const coin1 = filteredData[i];
      const coin2 = filteredData[j];
      
      // Generate mock correlation with some randomness but weighted by similarity
      // In a real app, this would use historical price data
      let correlation: number;
      
      // Add some factors that make the correlation more realistic
      const sameSector = Math.random() > 0.5; // Mock for whether coins are in same sector
      const sizeRelation = Math.abs(
        (coin1[metric] || 0) - (coin2[metric] || 0)
      ) / Math.max((coin1[metric] || 1), (coin2[metric] || 1));
      
      if (sameSector) {
        correlation = 0.5 + (Math.random() * 0.5); // Higher correlation for same sector
      } else {
        correlation = Math.random() * 0.7; // Lower correlation for different sectors
      }
      
      // Adjust based on size relation - similar size may indicate similar behavior
      correlation = correlation * (1 - sizeRelation * 0.3);
      
      // Add some noise
      correlation = correlation + (Math.random() * 0.2 - 0.1);
      
      // Ensure within range -1 to 1
      correlation = Math.max(-1, Math.min(1, correlation));
      
      result.push({
        coin1: coin1.id,
        coin2: coin2.id,
        coin1Name: coin1.name,
        coin2Name: coin2.name,
        correlation,
        x: correlation,
        y: Math.random() * 0.4 + 0.3, // Random y-position for visualization
        z: 300 * Math.random() + 100, // Random size for bubble chart
      });
    }
  }
  
  return result;
}

// Generate correlation matrix
export function generateCorrelationMatrix(cryptoData: CryptoData[]): number[][] {
  const n = cryptoData.length;
  const matrix = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Fill diagonal with 1 (perfect correlation with self)
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1;
  }
  
  // Fill upper triangle with correlation values
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // In a real app, calculate actual correlation from historical data
      const correlation = Math.random() * 2 - 1; // Random between -1 and 1
      matrix[i][j] = correlation;
      matrix[j][i] = correlation; // Correlation matrix is symmetric
    }
  }
  
  return matrix;
}
