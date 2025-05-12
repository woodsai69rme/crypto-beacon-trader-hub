
/**
 * Utility functions for Market Correlations components
 */

/**
 * Get color for correlation heatmap based on correlation value
 * @param correlation Correlation coefficient (-1 to 1)
 * @returns Color in hex format
 */
export const getCorrelationColor = (correlation: number): string => {
  // Strong negative correlation: deep blue
  if (correlation <= -0.75) return "#2563eb";
  
  // Medium negative correlation: light blue
  if (correlation <= -0.5) return "#60a5fa";
  
  // Weak negative correlation: very light blue
  if (correlation < 0) return "#bfdbfe";
  
  // No correlation: light gray
  if (correlation === 0) return "#f3f4f6";
  
  // Weak positive correlation: light orange
  if (correlation < 0.5) return "#fed7aa";
  
  // Medium positive correlation: medium orange
  if (correlation < 0.75) return "#fb923c";
  
  // Strong positive correlation: deep orange/red
  return "#ea580c";
};

/**
 * Format correlation coefficient for display
 * @param correlation Correlation coefficient
 * @returns Formatted string
 */
export const formatCorrelation = (correlation: number): string => {
  // Ensure correlation is within range
  const value = Math.max(-1, Math.min(1, correlation));
  
  // Convert to percentage and show sign
  const percentage = Math.round(value * 100);
  return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
};

/**
 * Get description for correlation strength
 * @param correlation Correlation coefficient
 * @returns Description string
 */
export const getCorrelationDescription = (correlation: number): string => {
  const abs = Math.abs(correlation);
  
  if (abs > 0.8) {
    return correlation > 0 ? 'Very strong positive' : 'Very strong negative';
  }
  
  if (abs > 0.6) {
    return correlation > 0 ? 'Strong positive' : 'Strong negative';
  }
  
  if (abs > 0.4) {
    return correlation > 0 ? 'Moderate positive' : 'Moderate negative';
  }
  
  if (abs > 0.2) {
    return correlation > 0 ? 'Weak positive' : 'Weak negative';
  }
  
  return 'Very weak or no correlation';
};

/**
 * Sort correlations from highest to lowest or vice versa
 * @param data Correlation data
 * @param ascending Sort direction
 * @returns Sorted correlation data
 */
export const sortCorrelations = (
  data: { name: string; correlation: number }[],
  ascending = false
): { name: string; correlation: number }[] => {
  return [...data].sort((a, b) => {
    if (ascending) {
      return a.correlation - b.correlation;
    } else {
      return b.correlation - a.correlation;
    }
  });
};
