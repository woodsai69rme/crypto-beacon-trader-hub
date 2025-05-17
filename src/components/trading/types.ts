
import { CoinOption } from '@/types/trading';

export interface RealTimeTradingProps {
  coins: CoinOption[];
  defaultCoinId?: string;
  showHeader?: boolean;
}
