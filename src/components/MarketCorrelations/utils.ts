
/**
 * Generates color based on correlation value
 * @param correlation Value between -1 and 1
 * @returns CSS color string
 */
export function getCorrelationColor(correlation: number): string {
  // Red for negative correlation, blue for positive
  if (correlation > 0) {
    const intensity = Math.round(correlation * 200) + 55;
    return `rgb(0, 0, ${intensity})`;
  } else {
    const intensity = Math.round(-correlation * 200) + 55;
    return `rgb(${intensity}, 0, 0)`;
  }
}

/**
 * Calculates Pearson correlation coefficient between two arrays of numbers
 * @param x First array of numbers
 * @param y Second array of numbers
 * @returns Correlation coefficient between -1 and 1
 */
export function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length');
  }
  
  const n = x.length;
  
  // Calculate means
  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  
  // Calculate variance and covariance
  let xVariance = 0;
  let yVariance = 0;
  let covariance = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    
    xVariance += xDiff * xDiff;
    yVariance += yDiff * yDiff;
    covariance += xDiff * yDiff;
  }
  
  // Calculate correlation coefficient
  const denominator = Math.sqrt(xVariance * yVariance);
  
  if (denominator === 0) {
    return 0;
  }
  
  return covariance / denominator;
}

/**
 * Finds strongest correlations for a given coin
 */
export function findStrongestCorrelations(
  correlationMatrix: Record<string, Record<string, number>>,
  coinId: string,
  cryptoData: {
    id: string;
    name: string;
    symbol: string;
    price?: number;
    image?: string;
    marketCap?: number;
    volume?: number;
    changePercent?: number;
  }[],
  limit = 5
): { coin: { 
    id: string;
    name: string;
    symbol: string;
    price?: number;
    image?: string;
    marketCap?: number;
    volume?: number;
    changePercent?: number;
  }; correlation: number }[] {
  const coinCorrelations = correlationMatrix[coinId];
  if (!coinCorrelations) return [];
  
  const coinMap = cryptoData.reduce((map, coin) => {
    map[coin.id] = coin;
    return map;
  }, {} as Record<string, {
    id: string;
    name: string;
    symbol: string;
    price?: number;
    image?: string;
    marketCap?: number;
    volume?: number;
    changePercent?: number;
  }>);
  
  return Object.entries(coinCorrelations)
    .filter(([id]) => id !== coinId && coinMap[id])
    .map(([id, correlation]) => ({
      coin: coinMap[id],
      correlation
    }))
    .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
    .slice(0, limit);
}
