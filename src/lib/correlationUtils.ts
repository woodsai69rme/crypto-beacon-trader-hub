
import { CoinOption } from '@/types/trading';

export const generateCorrelationMatrix = (coins: CoinOption[]): number[][] => {
  const matrix: number[][] = [];
  
  for (let i = 0; i < coins.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < coins.length; j++) {
      if (i === j) {
        // Perfect correlation with itself
        row.push(1.0);
      } else {
        // Generate realistic correlation values
        // Major cryptos tend to be positively correlated
        const baseCorrelation = 0.3 + Math.random() * 0.5; // 0.3 to 0.8
        const variation = (Math.random() - 0.5) * 0.4; // ±0.2 variation
        const correlation = Math.max(-0.9, Math.min(0.9, baseCorrelation + variation));
        row.push(Number(correlation.toFixed(3)));
      }
    }
    matrix.push(row);
  }
  
  // Ensure matrix is symmetric
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (i !== j) {
        matrix[j][i] = matrix[i][j];
      }
    }
  }
  
  return matrix;
};

export const calculatePriceCorrelation = (
  prices1: number[], 
  prices2: number[]
): number => {
  if (prices1.length !== prices2.length || prices1.length < 2) {
    return 0;
  }
  
  const n = prices1.length;
  const sum1 = prices1.reduce((a, b) => a + b, 0);
  const sum2 = prices2.reduce((a, b) => a + b, 0);
  const sum1Sq = prices1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = prices2.reduce((a, b) => a + b * b, 0);
  const sum12 = prices1.reduce((a, b, i) => a + b * prices2[i], 0);
  
  const numerator = n * sum12 - sum1 * sum2;
  const denominator = Math.sqrt((n * sum1Sq - sum1 * sum1) * (n * sum2Sq - sum2 * sum2));
  
  return denominator === 0 ? 0 : numerator / denominator;
};
