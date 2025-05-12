
import { CryptoData } from '@/types/trading';

// Mock cryptocurrency data
export const mockCryptoData: CryptoData[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 30000,
    priceChange: 1500,
    changePercent: 5.0,
    marketCap: 580000000000,
    volume: 25000000000,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 1800,
    priceChange: -50,
    changePercent: -2.7,
    marketCap: 220000000000,
    volume: 12000000000,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 45,
    priceChange: 3,
    changePercent: 7.1,
    marketCap: 18000000000,
    volume: 1500000000,
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png'
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.45,
    priceChange: 0.02,
    changePercent: 4.6,
    marketCap: 14000000000,
    volume: 500000000,
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png'
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.08,
    priceChange: -0.005,
    changePercent: -5.9,
    marketCap: 10500000000,
    volume: 800000000,
    image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png'
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 5.2,
    priceChange: 0.3,
    changePercent: 6.1,
    marketCap: 6000000000,
    volume: 300000000,
    image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png'
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    price: 7.8,
    priceChange: 0.4,
    changePercent: 5.4,
    marketCap: 4000000000,
    volume: 250000000,
    image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png'
  },
  {
    id: 'avalanche',
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 12.5,
    priceChange: -0.8,
    changePercent: -6.0,
    marketCap: 4200000000,
    volume: 280000000,
    image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png'
  }
];

// Generate historical price data for mockCryptoData
export const generateHistoricalPrices = (
  coins: CryptoData[],
  days: number = 30
): Record<string, number[]> => {
  const result: Record<string, number[]> = {};
  
  coins.forEach(coin => {
    const prices: number[] = [];
    let currentPrice = coin.price;
    
    // Generate prices going backwards from current price
    for (let i = 0; i < days; i++) {
      // Random daily change between -3% and +3%
      const dailyChange = (Math.random() * 6) - 3;
      currentPrice = currentPrice * (1 - (dailyChange / 100));
      prices.unshift(currentPrice);
    }
    
    result[coin.id] = prices;
  });
  
  return result;
};

// Calculate correlation coefficient between two arrays
export const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length');
  }
  
  const n = x.length;
  
  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate covariance and standard deviations
  let covariance = 0;
  let varX = 0;
  let varY = 0;
  
  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    covariance += diffX * diffY;
    varX += diffX * diffX;
    varY += diffY * diffY;
  }
  
  // Correlation formula
  if (varX === 0 || varY === 0) {
    return 0; // Avoid division by zero
  }
  
  return covariance / Math.sqrt(varX * varY);
};

// Generate correlation matrix from price data
export const generateCorrelationMatrix = (
  priceData: Record<string, number[]>
): Record<string, Record<string, number>> => {
  const matrix: Record<string, Record<string, number>> = {};
  const coinIds = Object.keys(priceData);
  
  coinIds.forEach(id1 => {
    matrix[id1] = {};
    
    coinIds.forEach(id2 => {
      if (id1 === id2) {
        matrix[id1][id2] = 1; // Perfect correlation with self
      } else {
        // Calculate correlation between price series
        try {
          const correlation = calculateCorrelation(priceData[id1], priceData[id2]);
          matrix[id1][id2] = correlation;
        } catch (error) {
          console.error(`Error calculating correlation between ${id1} and ${id2}:`, error);
          matrix[id1][id2] = 0;
        }
      }
    });
  });
  
  return matrix;
};

// Generate some mock correlation data
export const mockCorrelationMatrix = generateCorrelationMatrix(
  generateHistoricalPrices(mockCryptoData)
);
