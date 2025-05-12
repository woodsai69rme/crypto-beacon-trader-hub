
import { CryptoData } from '@/types/trading';

// Find strongest correlations for a given coin
export const findStrongestCorrelations = (
  correlationMatrix: Record<string, Record<string, number>>,
  coinId: string,
  allCoins: CryptoData[],
  limit: number = 10
): { coin: CryptoData; correlation: number }[] => {
  if (!correlationMatrix[coinId]) {
    console.error(`No correlation data found for coin: ${coinId}`);
    return [];
  }
  
  // Get correlations for the coin
  const correlations = correlationMatrix[coinId];
  
  // Convert to array of [coinId, correlation] pairs, excluding self
  const correlationPairs = Object.entries(correlations)
    .filter(([id]) => id !== coinId);
  
  // Sort by absolute correlation value (descending)
  correlationPairs.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  
  // Take top N correlations
  const topCorrelations = correlationPairs.slice(0, limit);
  
  // Map to objects with coin data
  return topCorrelations.map(([id, correlation]) => {
    const coin = allCoins.find(c => c.id === id);
    return {
      coin: coin || {
        id,
        name: id,
        symbol: id.substring(0, 3).toUpperCase(),
        price: 0,
        priceChange: 0,
        changePercent: 0
      },
      correlation
    };
  });
};

// Find coins most correlated to a specific coin
export const findMostCorrelatedCoins = (
  correlationMatrix: Record<string, Record<string, number>>,
  coinId: string,
  allCoins: CryptoData[],
  limit: number = 5
): { coin: CryptoData; correlation: number }[] => {
  const allCorrelations = findStrongestCorrelations(
    correlationMatrix,
    coinId,
    allCoins
  );
  
  // Return only positive correlations
  return allCorrelations
    .filter(item => item.correlation > 0)
    .sort((a, b) => b.correlation - a.correlation)
    .slice(0, limit);
};

// Find coins most negatively correlated to a specific coin
export const findMostNegativelyCorrelatedCoins = (
  correlationMatrix: Record<string, Record<string, number>>,
  coinId: string,
  allCoins: CryptoData[],
  limit: number = 5
): { coin: CryptoData; correlation: number }[] => {
  const allCorrelations = findStrongestCorrelations(
    correlationMatrix,
    coinId,
    allCoins
  );
  
  // Return only negative correlations
  return allCorrelations
    .filter(item => item.correlation < 0)
    .sort((a, b) => a.correlation - b.correlation)
    .slice(0, limit);
};

// Find pairs of coins with strongest correlation
export const findStrongestCorrelatedPairs = (
  correlationMatrix: Record<string, Record<string, number>>,
  allCoins: CryptoData[],
  limit: number = 10
): { coin1: CryptoData; coin2: CryptoData; correlation: number }[] => {
  const pairs: { coin1: CryptoData; coin2: CryptoData; correlation: number }[] = [];
  const coinIds = Object.keys(correlationMatrix);
  
  // Examine each pair of coins
  for (let i = 0; i < coinIds.length; i++) {
    for (let j = i + 1; j < coinIds.length; j++) {
      const id1 = coinIds[i];
      const id2 = coinIds[j];
      const correlation = correlationMatrix[id1][id2];
      
      const coin1 = allCoins.find(c => c.id === id1);
      const coin2 = allCoins.find(c => c.id === id2);
      
      if (coin1 && coin2) {
        pairs.push({ coin1, coin2, correlation });
      }
    }
  }
  
  // Sort by absolute correlation value (descending)
  pairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  
  // Return top N pairs
  return pairs.slice(0, limit);
};

// Calculate the correlation strength description
export const getCorrelationDescription = (correlation: number): string => {
  const absCorrelation = Math.abs(correlation);
  
  if (absCorrelation > 0.8) {
    return correlation > 0 ? 'Very Strong Positive' : 'Very Strong Negative';
  } else if (absCorrelation > 0.6) {
    return correlation > 0 ? 'Strong Positive' : 'Strong Negative';
  } else if (absCorrelation > 0.4) {
    return correlation > 0 ? 'Moderate Positive' : 'Moderate Negative';
  } else if (absCorrelation > 0.2) {
    return correlation > 0 ? 'Weak Positive' : 'Weak Negative';
  } else {
    return 'No Correlation';
  }
};
