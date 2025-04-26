
export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  currentValue?: number;
  profitLoss?: number;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
}
