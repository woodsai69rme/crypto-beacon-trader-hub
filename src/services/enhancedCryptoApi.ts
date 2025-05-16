
import { CoinOption, CryptoData } from '@/types/trading';

export const fetchTopCryptoData = async (limit: number = 10): Promise<CryptoData[]> => {
  // Mock implementation
  return Array.from({ length: limit }, (_, i) => ({
    id: `crypto-${i + 1}`,
    name: `Crypto ${i + 1}`,
    symbol: `CR${i + 1}`,
    current_price: 1000 * (i + 1),
    priceChangePercentage24h: Math.random() * 10 - 5,
    marketCap: 1000000000 * (i + 1),
    totalVolume: 500000000 * (i + 1),
    high24h: 1050 * (i + 1),
    low24h: 950 * (i + 1)
  }));
};

export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // Mock implementation - different from the one in cryptoService.ts
  const mockCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 65000, image: 'https://example.com/btc.png' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3500, image: 'https://example.com/eth.png' },
    { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB', price: 450, image: 'https://example.com/bnb.png' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 150, image: 'https://example.com/sol.png' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45, image: 'https://example.com/ada.png' }
  ];
  
  // Filter coins based on query
  const filteredCoins = mockCoins.filter(coin => 
    coin.name.toLowerCase().includes(query.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(query.toLowerCase())
  );
  
  // Transform to CoinOption format
  return filteredCoins.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.price,
    image: coin.image,
    value: coin.id,
    label: `${coin.name} (${coin.symbol})`
  }));
};
