
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

// Generate correlation matrix from crypto data
export function generateCorrelationMatrix(cryptoData: CryptoData[]): number[][] {
  const n = cryptoData.length;
  const matrix = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Fill diagonal with 1 (perfect correlation with self)
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1;
  }
  
  // Fill upper triangle with correlation values and mirror to lower triangle
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Generate mock historical price data for correlation calculation
      const priceData1 = generateMockPriceHistory(cryptoData[i]);
      const priceData2 = generateMockPriceHistory(cryptoData[j]);
      
      const correlation = calculateCorrelation(priceData1, priceData2);
      matrix[i][j] = correlation;
      matrix[j][i] = correlation; // Correlation matrix is symmetric
    }
  }
  
  return matrix;
}

// Generate mock price history for correlation calculation
function generateMockPriceHistory(coin: CryptoData): number[] {
  const dataPoints = 30; // 30 days of data
  const prices: number[] = [];
  let currentPrice = coin.price;
  
  // Generate somewhat realistic price movements
  for (let i = 0; i < dataPoints; i++) {
    // Random walk with slight trend
    const volatility = 0.02; // 2% daily volatility
    const trend = 0.001; // 0.1% daily trend
    const randomChange = (Math.random() - 0.5) * volatility + trend;
    
    currentPrice = currentPrice * (1 + randomChange);
    prices.push(currentPrice);
  }
  
  return prices;
}

// Calculate correlations between selected coins for chart data
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
      
      // Generate mock historical data for correlation
      const priceData1 = generateMockPriceHistory(coin1);
      const priceData2 = generateMockPriceHistory(coin2);
      
      const correlation = calculateCorrelation(priceData1, priceData2);
      
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
