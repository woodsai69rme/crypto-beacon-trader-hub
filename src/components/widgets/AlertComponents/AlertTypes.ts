
import { ReactNode } from 'react';

export interface AlertFormSheetProps {
  onFormChange: (data: PriceAlertFormData) => void;
  onSubmit: () => void;
  initialData: PriceAlertFormData;
  content?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export interface PriceAlertFormData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  percentageChange?: number;
  enabled: boolean;
  notifyVia: string[];
}

export interface TechnicalAlertFormData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  indicator: string;
  condition: string;
  value: number;
  timeframe: string;
  enabled: boolean;
  notifyVia: string[];
}

export interface VolumeAlertFormData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  volumeThreshold: number;
  isAbove: boolean;
  timeframe: string;
  enabled: boolean;
  notifyVia: string[];
}

export const COIN_OPTIONS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', value: 'bitcoin', label: 'BTC - Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', value: 'ethereum', label: 'ETH - Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', value: 'solana', label: 'SOL - Solana' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', value: 'cardano', label: 'ADA - Cardano' },
  { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin', value: 'binancecoin', label: 'BNB - Binance Coin' }
];
