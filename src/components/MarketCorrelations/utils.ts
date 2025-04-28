
import { CryptoData } from "@/types/trading";

export const getCorrelationDescription = (value: number) => {
  const absValue = Math.abs(value);
  let strength = "No";
  let direction = "correlation";
  
  if (absValue > 0.7) strength = "Strong";
  else if (absValue > 0.4) strength = "Moderate";
  else if (absValue > 0.1) strength = "Weak";
  
  if (value > 0) direction = "positive correlation";
  else if (value < 0) direction = "negative correlation";
  
  return `${strength} ${direction}`;
};

export const getCorrelationColor = (value: number) => {
  const absValue = Math.abs(value);
  
  if (value > 0) {
    // Green for positive correlations, deeper green for stronger correlation
    return `rgba(0, 128, 0, ${absValue})`;
  } else {
    // Red for negative correlations, deeper red for stronger correlation
    return `rgba(220, 53, 69, ${absValue})`;
  }
};

export const generateMockCorrelations = (
  coinsData: CryptoData[], 
  timeRange: '7d' | '30d' | '90d'
): Record<string, Record<string, number>> => {
  const mockCorrelations: Record<string, Record<string, number>> = {};
  
  coinsData.forEach((coin1) => {
    mockCorrelations[coin1.id] = {};
    coinsData.forEach((coin2) => {
      if (coin1.id === coin2.id) {
        mockCorrelations[coin1.id][coin2.id] = 1;
      } else {
        // Generate a random correlation value between -1 and 1
        // In a real app, this would be calculated from price movements
        const randomCorrelation = (Math.random() * 2 - 1) * (timeRange === '7d' ? 0.8 : timeRange === '30d' ? 0.6 : 0.4);
        mockCorrelations[coin1.id][coin2.id] = parseFloat(randomCorrelation.toFixed(2));
      }
    });
  });
  
  return mockCorrelations;
};
