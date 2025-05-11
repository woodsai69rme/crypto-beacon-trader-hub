
import { CryptoData } from "@/types/trading";

export const mockCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 58352.12,
    priceChange: 1245.32,
    changePercent: 2.18,
    marketCap: 1143349097968,
    volume: 48941516789
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 3105.78,
    priceChange: 65.43,
    changePercent: 2.15,
    marketCap: 373952067386,
    volume: 21891456789
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    price: 0.45,
    priceChange: -0.01,
    changePercent: -2.17,
    marketCap: 15893456789,
    volume: 467891234
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 152.37,
    priceChange: 5.23,
    changePercent: 3.55,
    marketCap: 67891234567,
    volume: 3578912345
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "Binance Coin",
    price: 611.45,
    priceChange: -2.35,
    changePercent: -0.38,
    marketCap: 98765432198,
    volume: 2867891234
  }
];

export const generateHistoricalPrices = (
  coins: CryptoData[]
): Record<string, number[]> => {
  const result: Record<string, number[]> = {};

  coins.forEach(coin => {
    const basePrice = coin.price;
    const volatility = coin.price * 0.05; // 5% volatility
    const prices = Array.from({ length: 30 }, (_, i) => {
      // Generate prices with a random walk effect
      const randomFactor = Math.random() * 2 - 1; // between -1 and 1
      return basePrice + randomFactor * volatility * (i / 10);
    });
    result[coin.id] = prices;
  });

  return result;
};

export const generateCorrelationMatrix = (
  historicalPrices: Record<string, number[]>
): Record<string, Record<string, number>> => {
  const coinIds = Object.keys(historicalPrices);
  const result: Record<string, Record<string, number>> = {};

  coinIds.forEach(coin1 => {
    result[coin1] = {};
    coinIds.forEach(coin2 => {
      if (coin1 === coin2) {
        result[coin1][coin2] = 1; // Correlation with self is always 1
      } else {
        // Calculate Pearson correlation coefficient
        const prices1 = historicalPrices[coin1];
        const prices2 = historicalPrices[coin2];
        
        // Calculate correlation
        result[coin1][coin2] = calculateCorrelation(prices1, prices2);
      }
    });
  });

  return result;
};

// Calculate Pearson correlation coefficient
const calculateCorrelation = (array1: number[], array2: number[]): number => {
  if (array1.length !== array2.length) {
    throw new Error('Arrays must have the same length');
  }
  
  const n = array1.length;
  
  // Calculate mean
  const mean1 = array1.reduce((acc, val) => acc + val, 0) / n;
  const mean2 = array2.reduce((acc, val) => acc + val, 0) / n;
  
  // Calculate covariance and variances
  let covariance = 0;
  let variance1 = 0;
  let variance2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = array1[i] - mean1;
    const diff2 = array2[i] - mean2;
    
    covariance += diff1 * diff2;
    variance1 += diff1 * diff1;
    variance2 += diff2 * diff2;
  }
  
  // Calculate Pearson correlation coefficient
  const stdDev1 = Math.sqrt(variance1);
  const stdDev2 = Math.sqrt(variance2);
  
  if (stdDev1 === 0 || stdDev2 === 0) {
    return 0; // Avoid division by zero
  }
  
  return covariance / (stdDev1 * stdDev2);
};
