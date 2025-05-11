
import { CryptoData } from '@/types/trading';

export const mockCorrelationData: CryptoData[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    price: 60000,
    priceChange: 1500,
    changePercent: 2.5,
    marketCap: 1200000000000,
    volume: 30000000000
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    price: 3000,
    priceChange: 120,
    changePercent: 4.0,
    marketCap: 360000000000,
    volume: 20000000000
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    price: 120,
    priceChange: 5,
    changePercent: 4.2,
    marketCap: 65000000000,
    volume: 5000000000
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    price: 0.45,
    priceChange: 0.02,
    changePercent: 4.5,
    marketCap: 16000000000,
    volume: 1000000000
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'Ripple',
    price: 0.6,
    priceChange: 0.01,
    changePercent: 1.7,
    marketCap: 32000000000,
    volume: 2000000000
  }
];

// Generate mock historical data for correlation analysis
export const generateHistoricalPrices = (coins: CryptoData[], days = 30): Record<string, number[]> => {
  const result: Record<string, number[]> = {};
  
  coins.forEach(coin => {
    const basePrice = coin.price;
    const priceHistory: number[] = [];
    
    for (let i = 0; i < days; i++) {
      // Generate some random price movement with volatility proportional to market cap
      const volatility = 1000000000000 / (coin.marketCap || 1000000000);
      const change = (Math.random() - 0.5) * volatility * basePrice;
      const previousPrice = i > 0 ? priceHistory[i-1] : basePrice;
      priceHistory.push(previousPrice + change);
    }
    
    result[coin.id] = priceHistory;
  });
  
  return result;
};

// Generate mock correlation matrix
export const generateCorrelationMatrix = (historicalPrices: Record<string, number[]>): Record<string, Record<string, number>> => {
  const coinIds = Object.keys(historicalPrices);
  const matrix: Record<string, Record<string, number>> = {};
  
  coinIds.forEach(coin1 => {
    matrix[coin1] = {};
    coinIds.forEach(coin2 => {
      if (coin1 === coin2) {
        matrix[coin1][coin2] = 1; // Self correlation is always 1
      } else {
        // Using a deterministic but seemingly random algorithm for demo purposes
        // In a real implementation, this would use actual Pearson correlation
        const seed = (coin1.charCodeAt(0) + coin2.charCodeAt(0)) / 200;
        let value = Math.sin(seed) * 0.5 + 0.5;
        value = Math.min(Math.max(value, -1), 1);
        matrix[coin1][coin2] = value;
      }
    });
  });
  
  return matrix;
};
