
import { CryptoData } from "@/types/trading";

// Function to generate mock correlation data for the demo
export const generateMockCorrelations = (
  coins: CryptoData[], 
  timeRange: '7d' | '30d' | '90d'
): Record<string, Record<string, number>> => {
  const correlations: Record<string, Record<string, number>> = {};
  
  // Generate a mock correlation value
  const generateCorrelation = (
    coin1: string, 
    coin2: string, 
    timeRange: '7d' | '30d' | '90d'
  ) => {
    // Make some coins have stronger correlations
    if (
      (coin1.includes('bitcoin') && coin2.includes('ethereum')) ||
      (coin1.includes('ethereum') && coin2.includes('bitcoin'))
    ) {
      return 0.7 + Math.random() * 0.25; // Strong correlation between BTC and ETH
    }
    
    // Some coins should be negatively correlated
    if (
      (coin1.includes('bitcoin') && coin2.includes('ripple')) ||
      (coin1.includes('ripple') && coin2.includes('bitcoin'))
    ) {
      return -0.3 - Math.random() * 0.3; // Negative correlation between BTC and XRP
    }
    
    // Adjust correlation based on time range
    const baseCorrelation = Math.random() * 1.4 - 0.7; // Between -0.7 and 0.7
    
    switch (timeRange) {
      case '7d':
        // Short term has more extreme correlations (more volatile)
        return baseCorrelation * 1.2;
      case '30d':
        // Medium term has standard correlations
        return baseCorrelation;
      case '90d':
        // Long term has more regressed correlations (closer to mean)
        return baseCorrelation * 0.8;
      default:
        return baseCorrelation;
    }
  };
  
  // Create correlation matrix
  for (const coin1 of coins) {
    correlations[coin1.id] = {};
    
    for (const coin2 of coins) {
      if (coin1.id === coin2.id) {
        // Perfect correlation with self
        correlations[coin1.id][coin2.id] = 1;
      } else if (correlations[coin2.id] && correlations[coin2.id][coin1.id] !== undefined) {
        // Use the already calculated correlation value
        correlations[coin1.id][coin2.id] = correlations[coin2.id][coin1.id];
      } else {
        // Generate a new correlation value
        correlations[coin1.id][coin2.id] = generateCorrelation(coin1.id, coin2.id, timeRange);
      }
    }
  }
  
  return correlations;
};

// Function to determine the color based on correlation value
export const getCorrelationColor = (correlation: number): string => {
  if (correlation >= 0.8) return 'bg-green-800 text-white';
  if (correlation >= 0.5) return 'bg-green-600 text-white';
  if (correlation >= 0.2) return 'bg-green-400';
  if (correlation >= -0.2) return 'bg-gray-200';
  if (correlation >= -0.5) return 'bg-red-400';
  if (correlation >= -0.8) return 'bg-red-600 text-white';
  return 'bg-red-800 text-white';
};

// Function to get readable correlation description
export const getCorrelationDescription = (correlation: number): string => {
  const absCorrelation = Math.abs(correlation);
  
  if (absCorrelation >= 0.8) {
    return correlation > 0 ? 'Very strong positive' : 'Very strong negative';
  }
  if (absCorrelation >= 0.6) {
    return correlation > 0 ? 'Strong positive' : 'Strong negative';
  }
  if (absCorrelation >= 0.4) {
    return correlation > 0 ? 'Moderate positive' : 'Moderate negative';
  }
  if (absCorrelation >= 0.2) {
    return correlation > 0 ? 'Weak positive' : 'Weak negative';
  }
  return 'No significant correlation';
};

// Function to get interpretation of correlation value
export const getCorrelationInterpretation = (
  correlation: number, 
  coin1: string, 
  coin2: string
): string => {
  const absCorrelation = Math.abs(correlation);
  
  if (absCorrelation >= 0.7) {
    return correlation > 0
      ? `${coin1} and ${coin2} tend to move strongly in the same direction.`
      : `${coin1} and ${coin2} tend to move strongly in opposite directions.`;
  }
  
  if (absCorrelation >= 0.4) {
    return correlation > 0
      ? `${coin1} and ${coin2} tend to move somewhat together.`
      : `${coin1} and ${coin2} tend to move somewhat in opposite directions.`;
  }
  
  return `${coin1} and ${coin2} show little to no relationship in price movement.`;
};

// Format correlation value for display
export const formatCorrelation = (correlation: number): string => {
  return correlation.toFixed(2);
};
