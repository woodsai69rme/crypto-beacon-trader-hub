
import { PriceAlert, VolumeAlert, TechnicalAlert } from '@/types/alerts';
export type { PriceAlertFormData, VolumeAlertFormData, TechnicalAlertFormData } from '@/types/alerts';

// List of supported cryptocurrencies for alerts
export const COIN_OPTIONS = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    currentPrice: 65000
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    currentPrice: 3500
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    currentPrice: 140
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    currentPrice: 0.45
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    currentPrice: 0.56
  },
];

// Technical indicators supported by alerts
export const TECHNICAL_INDICATORS = [
  { value: 'RSI', label: 'RSI (Relative Strength Index)' },
  { value: 'MACD', label: 'MACD (Moving Average Convergence Divergence)' },
  { value: 'MA', label: 'MA (Moving Average)' },
  { value: 'EMA', label: 'EMA (Exponential Moving Average)' },
  { value: 'VWAP', label: 'VWAP (Volume Weighted Average Price)' },
  { value: 'BB', label: 'Bollinger Bands' },
  { value: 'STOCH', label: 'Stochastic Oscillator' },
];

// Technical indicator conditions
export const TECHNICAL_CONDITIONS = [
  { value: 'above', label: 'Above' },
  { value: 'below', label: 'Below' },
  { value: 'crosses_above', label: 'Crosses Above' },
  { value: 'crosses_below', label: 'Crosses Below' },
  { value: 'equals', label: 'Equals' },
];
