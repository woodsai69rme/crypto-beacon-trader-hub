
import { CoinOption } from "@/types/trading";

// Sample coin options for alert forms
export const COIN_OPTIONS: CoinOption[] = [
  { 
    id: "bitcoin", 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 58000, 
    priceChange: 1200,
    changePercent: 2.1,
    marketCap: 1100000000000,
    volume: 45000000000,
    value: "bitcoin",
    label: "Bitcoin (BTC)"
  },
  { 
    id: "ethereum", 
    name: "Ethereum", 
    symbol: "ETH", 
    price: 3200, 
    priceChange: 150,
    changePercent: 4.8,
    marketCap: 380000000000,
    volume: 22000000000,
    value: "ethereum",
    label: "Ethereum (ETH)"
  },
  { 
    id: "ripple", 
    name: "XRP", 
    symbol: "XRP", 
    price: 0.50, 
    priceChange: 0.02,
    changePercent: 3.5,
    marketCap: 23000000000,
    volume: 1800000000,
    value: "ripple",
    label: "XRP (XRP)"
  },
  { 
    id: "solana", 
    name: "Solana", 
    symbol: "SOL", 
    price: 102, 
    priceChange: 5,
    changePercent: 5.1,
    marketCap: 43000000000,
    volume: 2500000000,
    value: "solana",
    label: "Solana (SOL)"
  },
  { 
    id: "cardano", 
    name: "Cardano", 
    symbol: "ADA", 
    price: 0.35, 
    priceChange: 0.01,
    changePercent: 2.8,
    marketCap: 12000000000,
    volume: 350000000,
    value: "cardano",
    label: "Cardano (ADA)"
  }
];

// Alert condition types
export const CONDITIONS = {
  PRICE: [
    { id: 'above', label: 'Price Above' },
    { id: 'below', label: 'Price Below' },
    { id: 'percentage_rise', label: 'Percentage Rise' },
    { id: 'percentage_fall', label: 'Percentage Fall' }
  ],
  VOLUME: [
    { id: 'volume_spike', label: 'Volume Spike' },
    { id: 'volume_drop', label: 'Volume Drop' }
  ],
  TECHNICAL: [
    { id: 'rsi_overbought', label: 'RSI Overbought' },
    { id: 'rsi_oversold', label: 'RSI Oversold' },
    { id: 'macd_cross_up', label: 'MACD Cross Up' },
    { id: 'macd_cross_down', label: 'MACD Cross Down' }
  ]
};

// Technical indicators for alerts
export const TECHNICAL_INDICATORS = [
  { id: 'rsi', label: 'RSI (Relative Strength Index)' },
  { id: 'macd', label: 'MACD (Moving Average Convergence Divergence)' },
  { id: 'sma', label: 'SMA (Simple Moving Average)' },
  { id: 'ema', label: 'EMA (Exponential Moving Average)' },
  { id: 'bb', label: 'Bollinger Bands' }
];

// Available notification methods
export const NOTIFICATION_METHODS = [
  { id: 'app', label: 'In-App' },
  { id: 'email', label: 'Email' },
  { id: 'push', label: 'Push Notification' }
];
