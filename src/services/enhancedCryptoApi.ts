
import { CoinOption } from '@/types/trading';

// Mock crypto API service for searching coins
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockCoins: CoinOption[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 58352.12,
      priceChange: 1245.32,
      changePercent: 2.18,
      marketCap: 1143349097968,
      volume: 48941516789,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      value: "bitcoin",
      label: "Bitcoin (BTC)"
    },
    {
      id: "ethereum",
      name: "Ethereum", 
      symbol: "ETH",
      price: 3105.78,
      priceChange: 65.43,
      changePercent: 2.15,
      marketCap: 373952067386,
      volume: 21891456789,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      value: "ethereum",
      label: "Ethereum (ETH)"
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.45,
      priceChange: 0.02,
      changePercent: 4.65,
      marketCap: 16789456123,
      volume: 756123489,
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      value: "cardano",
      label: "Cardano (ADA)"
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 143.87,
      priceChange: 7.23,
      changePercent: 5.29,
      marketCap: 63287612543,
      volume: 3691845721,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      value: "solana",
      label: "Solana (SOL)"
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      price: 8.45,
      priceChange: 0.23,
      changePercent: 2.8,
      marketCap: 8500000000,
      volume: 450000000,
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      value: "polkadot",
      label: "Polkadot (DOT)"
    },
    {
      id: "chainlink",
      name: "Chainlink",
      symbol: "LINK",
      price: 15.67,
      priceChange: 0.89,
      changePercent: 6.0,
      marketCap: 7800000000,
      volume: 890000000,
      image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
      value: "chainlink",
      label: "Chainlink (LINK)"
    }
  ];

  // Filter coins based on search query
  return mockCoins.filter(coin => 
    coin.name.toLowerCase().includes(query.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(query.toLowerCase())
  );
};

export const getCoinPrice = async (coinId: string): Promise<number> => {
  const coins = await searchCoins(coinId);
  const coin = coins.find(c => c.id === coinId || c.symbol.toLowerCase() === coinId.toLowerCase());
  return coin?.price || 0;
};

export const getTopCoins = async (limit: number = 10): Promise<CoinOption[]> => {
  const allCoins = await searchCoins('');
  return allCoins.slice(0, limit);
};
