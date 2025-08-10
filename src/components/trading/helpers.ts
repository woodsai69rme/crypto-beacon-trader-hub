
import { CoinOption } from '@/types/trading';

export const generateMockCoins = (): CoinOption[] => [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 45000,
    change24h: 2.5,
    value: 'BTC',
    label: 'Bitcoin (BTC)'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3000,
    change24h: -1.2,
    value: 'ETH',
    label: 'Ethereum (ETH)'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 100,
    change24h: 5.8,
    value: 'SOL',
    label: 'Solana (SOL)'
  }
];
