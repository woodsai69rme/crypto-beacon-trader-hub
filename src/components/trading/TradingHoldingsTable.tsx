import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';
import { CoinOption, SupportedCurrency } from '@/types/trading';

interface TradingHoldingsTableProps {
  holdings: Holding[];
  activeCurrency: SupportedCurrency;
}

export interface Holding {
  coinId: string;
  coin?: CoinOption;
  amount: number;
}

// Add price conversion helper function
const getCoinPrice = (coin: CoinOption, currency: SupportedCurrency): number => {
  switch (currency) {
    case 'AUD':
      return coin.price * 1.5; // Apply conversion rate
    case 'EUR':
      return coin.price * 0.9; // Apply conversion rate
    case 'GBP':
      return coin.price * 0.8; // Apply conversion rate
    case 'USD':
    default:
      return coin.price;
  }
};

const TradingHoldingsTable: React.FC<TradingHoldingsTableProps> = ({ holdings, activeCurrency }) => {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => {
            if (!holding.coin) return null;
            
            const price = getCoinPrice(holding.coin, activeCurrency);
            const value = holding.amount * price;
            
            return (
              <TableRow key={holding.coinId}>
                <TableCell className="font-medium">{holding.coin.name}</TableCell>
                <TableCell className="text-right">{holding.amount.toFixed(2)}</TableCell>
                <TableCell className="text-right">{formatCurrency(value, activeCurrency)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TradingHoldingsTable;
