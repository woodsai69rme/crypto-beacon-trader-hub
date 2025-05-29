
import { Trade, CoinOption, SupportedCurrency } from '@/types/trading';

export const createTrade = (
  coinId: string,
  coinSymbol: string,
  coinName: string,
  type: 'buy' | 'sell',
  amount: number,
  price: number,
  currency: SupportedCurrency = 'AUD'
): Trade => {
  const totalValue = amount * price;
  
  return {
    id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    coinId,
    coinName,
    coinSymbol,
    symbol: coinSymbol,
    type,
    amount,
    quantity: amount,
    price,
    totalValue,
    total: totalValue,
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
