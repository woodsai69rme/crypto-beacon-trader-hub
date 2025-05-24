
import { Trade, SupportedCurrency } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

export const createTrade = (
  coinId: string,
  coinName: string,
  coinSymbol: string,
  type: 'buy' | 'sell',
  amount: number,
  price: number,
  currency: SupportedCurrency = 'AUD'
): Trade => {
  return {
    id: uuidv4(),
    coinId,
    coinName,
    coinSymbol,
    type,
    amount,
    price,
    totalValue: amount * price,
    total: amount * price,
    timestamp: new Date().toISOString(),
    currency,
  };
};

export const calculateTradeValue = (amount: number, price: number): number => {
  return amount * price;
};

export const calculateProfitLoss = (
  buyPrice: number,
  currentPrice: number,
  amount: number
): number => {
  return (currentPrice - buyPrice) * amount;
};
