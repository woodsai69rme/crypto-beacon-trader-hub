
/**
 * Utility functions for market correlation components
 */

/**
 * Get a color shade based on correlation value
 * @param value Correlation value between -1 and 1
 * @returns CSS color string
 */
export const getCorrelationColor = (value: number): string => {
  // Strong positive correlation: dark green
  if (value >= 0.8) return '#15803d';
  
  // Moderate positive correlation: medium green
  if (value >= 0.5) return '#22c55e';
  
  // Weak positive correlation: light green
  if (value >= 0.2) return '#86efac';
  
  // Very weak or no correlation: gray
  if (value >= -0.2) return '#e2e8f0';
  
  // Weak negative correlation: light red
  if (value >= -0.5) return '#fca5a5';
  
  // Moderate negative correlation: medium red
  if (value >= -0.8) return '#ef4444';
  
  // Strong negative correlation: dark red
  return '#b91c1c';
};

/**
 * Calculate Pearson correlation between two arrays of numbers
 * @param x First array of numbers
 * @param y Second array of numbers
 * @returns Correlation coefficient between -1 and 1
 */
export const calculatePearsonCorrelation = (x: number[], y: number[]): number => {
  if (x.length === 0 || y.length === 0 || x.length !== y.length) {
    return 0;
  }

  const n = x.length;
  
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) return 0;
  return numerator / denominator;
};

/**
 * Format correlation value for display
 * @param value Correlation value between -1 and 1
 * @returns Formatted string (e.g. "72%" or "-45%")
 */
export const formatCorrelation = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`;
};

/**
 * Group correlations into categories
 * @param correlations Array of correlation values
 * @returns Object with correlations grouped by strength
 */
export const categorizeCorrelations = (correlations: number[]) => {
  return {
    strong_positive: correlations.filter(c => c >= 0.7),
    moderate_positive: correlations.filter(c => c >= 0.5 && c < 0.7),
    weak_positive: correlations.filter(c => c >= 0.3 && c < 0.5),
    negligible: correlations.filter(c => c > -0.3 && c < 0.3),
    weak_negative: correlations.filter(c => c <= -0.3 && c > -0.5),
    moderate_negative: correlations.filter(c => c <= -0.5 && c > -0.7),
    strong_negative: correlations.filter(c => c <= -0.7)
  };
};
