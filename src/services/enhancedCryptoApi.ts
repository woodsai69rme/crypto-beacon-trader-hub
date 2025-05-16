
import { CryptoData } from '@/types/trading';

export const fetchTopCryptoData = async (limit: number = 10): Promise<CryptoData[]> => {
  // Mock implementation
  return [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      currentPrice: 65000,
      priceChangePercentage24h: 2.5,
      marketCap: 1250000000000,
      totalVolume: 35000000000,
      high24h: 66000,
      low24h: 64000
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      currentPrice: 3500,
      priceChangePercentage24h: 3.2,
      marketCap: 420000000000,
      totalVolume: 18000000000,
      high24h: 3550,
      low24h: 3400
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      currentPrice: 150,
      priceChangePercentage24h: 4.8,
      marketCap: 63000000000,
      totalVolume: 3800000000,
      high24h: 152,
      low24h: 144
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      currentPrice: 0.45,
      priceChangePercentage24h: -1.2,
      marketCap: 16000000000,
      totalVolume: 500000000,
      high24h: 0.47,
      low24h: 0.44
    },
    {
      id: 'binancecoin',
      name: 'BNB',
      symbol: 'BNB',
      currentPrice: 450,
      priceChangePercentage24h: 1.8,
      marketCap: 70000000000,
      totalVolume: 2200000000,
      high24h: 455,
      low24h: 445
    },
    {
      id: 'ripple',
      name: 'XRP',
      symbol: 'XRP',
      currentPrice: 0.52,
      priceChangePercentage24h: 0.5,
      marketCap: 28000000000,
      totalVolume: 900000000,
      high24h: 0.53,
      low24h: 0.51
    },
    {
      id: 'polkadot',
      name: 'Polkadot',
      symbol: 'DOT',
      currentPrice: 6.50,
      priceChangePercentage24h: -0.8,
      marketCap: 8100000000,
      totalVolume: 300000000,
      high24h: 6.60,
      low24h: 6.45
    },
    {
      id: 'chainlink',
      name: 'Chainlink',
      symbol: 'LINK',
      currentPrice: 15.80,
      priceChangePercentage24h: 5.2,
      marketCap: 9200000000,
      totalVolume: 720000000,
      high24h: 16.20,
      low24h: 15.10
    },
    {
      id: 'litecoin',
      name: 'Litecoin',
      symbol: 'LTC',
      currentPrice: 75.20,
      priceChangePercentage24h: 1.1,
      marketCap: 5500000000,
      totalVolume: 420000000,
      high24h: 76.40,
      low24h: 74.80
    },
    {
      id: 'uniswap',
      name: 'Uniswap',
      symbol: 'UNI',
      currentPrice: 8.90,
      priceChangePercentage24h: 3.4,
      marketCap: 6800000000,
      totalVolume: 310000000,
      high24h: 9.10,
      low24h: 8.70
    }
  ].slice(0, limit);
};

// Add searchCoins function to resolve error in CryptoSearch component
export const searchCoins = async (query: string): Promise<CryptoData[]> => {
  const allCoins = await fetchTopCryptoData(20); // Fetch all available coins
  
  // Filter coins based on query matching name, symbol or id
  return allCoins.filter(coin => 
    coin.name.toLowerCase().includes(query.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(query.toLowerCase()) ||
    coin.id.toLowerCase().includes(query.toLowerCase())
  );
};
