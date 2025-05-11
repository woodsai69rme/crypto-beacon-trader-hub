
import { CryptoData } from "@/types/trading";

// Mock cryptocurrency data for correlation analysis
export const mockCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 56000,
    priceChange: 1200,
    changePercent: 2.2,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    marketCap: 1100000000000,
    volume: 38000000000
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 3100,
    priceChange: 150,
    changePercent: 5.1,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    marketCap: 380000000000,
    volume: 18000000000
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    price: 0.45,
    priceChange: -0.02,
    changePercent: -4.2,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    marketCap: 16000000000,
    volume: 800000000
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 146.20,
    priceChange: 12.8,
    changePercent: 9.6,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    marketCap: 63000000000,
    volume: 3600000000
  },
  {
    id: "polkadot",
    symbol: "DOT",
    name: "Polkadot",
    price: 9.80,
    priceChange: 0.3,
    changePercent: 3.2,
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    marketCap: 12000000000,
    volume: 400000000
  }
];

// Function to generate mock historical prices
export const generateHistoricalPrices = (coins: CryptoData[]): Record<string, number[]> => {
  const result: Record<string, number[]> = {};
  
  coins.forEach(coin => {
    const prices: number[] = [];
    let currentPrice = coin.price || 0;
    
    // Generate 30 days of historical data
    for (let i = 0; i < 30; i++) {
      // Add some random variation each day
      const change = currentPrice * (Math.random() * 0.06 - 0.03); // Random change between -3% and +3%
      currentPrice += change;
      prices.push(currentPrice);
    }
    
    result[coin.id] = prices;
  });
  
  return result;
};

// Function to calculate Pearson correlation coefficient
const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;

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

// Function to generate correlation matrix
export const generateCorrelationMatrix = (
  prices: Record<string, number[]>
): Record<string, Record<string, number>> => {
  const coinIds = Object.keys(prices);
  const result: Record<string, Record<string, number>> = {};

  coinIds.forEach(coinA => {
    result[coinA] = {};
    
    coinIds.forEach(coinB => {
      const correlation = calculateCorrelation(prices[coinA], prices[coinB]);
      result[coinA][coinB] = parseFloat(correlation.toFixed(2));
    });
  });

  return result;
};
