
import React, { useState } from 'react';
import { CoinOption, SupportedCurrency } from '@/types/trading';

interface TradingFormProps {
  balance: number;
  availableCoins: CoinOption[];
  onTrade: (coinId: string, type: 'buy' | 'sell', amount: number, price: number) => void;
  getOwnedCoinAmount: (coinId: string) => number;
  activeCurrency: SupportedCurrency;
  onCurrencyChange?: (currency: SupportedCurrency) => void;
  conversionRate?: number;
}

const TradingForm: React.FC<TradingFormProps> = ({
  balance,
  availableCoins,
  onTrade,
  getOwnedCoinAmount,
  activeCurrency,
  onCurrencyChange,
  conversionRate
}) => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState<number>(0);
  
  const selectedCoin = availableCoins.find(coin => coin.id === selectedCoinId);
  
  const handleTrade = () => {
    if (selectedCoin && tradeAmount > 0) {
      onTrade(selectedCoinId, tradeType, tradeAmount, selectedCoin.price || 0);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Trading Form</h3>
        <div className="text-sm">
          Balance: {balance.toFixed(2)} {activeCurrency}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Add UI elements for coin selection, trade type, and amount */}
        <div>Choose a coin, trade type, and enter an amount</div>
        
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
          onClick={handleTrade}
        >
          Execute Trade
        </button>
      </div>
    </div>
  );
};

export default TradingForm;
